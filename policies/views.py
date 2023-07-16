import logging
from copy import copy
from django.utils import timezone
from django.contrib.contenttypes.models import ContentType
from django.db.models import Q
from pods.serializers import PodSerializer
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.mixins import UpdateModelMixin
from rest_framework.views import APIView
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_403_FORBIDDEN
from rest_framework.generics import RetrieveUpdateDestroyAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import SAFE_METHODS, IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.filters import SearchFilter
from policies.paginators import StandardResultsSetPagination
from policies.models import Policy, PolicyRiskSettings, Premium, Risk
from policies.permissions import (
    InPolicyPod,
    InPolicyPremiumPod,
    IsPhotoOwner,
    InRiskSettingsPolicyPod,
)
from policies.premiums import schedule_premiums
from policies.risk.emails import send_risk_update_email
from policies.risk.models import PropertyImage, get_model_for_risk_type
from policies.risk.permissions import IsRiskOwner
from policies.risk.risk_scores import compute_premium_amount, compute_risk_score
from policies.risk.serializers import (
    AlbumSerializer,
    ImageSerializer,
    get_serializer_for_risk_type,
)
from policies.serializers import (
    PolicyRiskSettingsSerializer,
    PolicySerializer,
    FullPolicySerializer,
    PremiumSerializer,
    RiskSerializer,
)
from policies.utils import send_user_welcome_email

logger = logging.getLogger(__name__)


class PolicyViewSet(ModelViewSet):
    queryset = Policy.objects.all()
    permission_classes = [IsAuthenticated & InPolicyPod]
    pagination_class = StandardResultsSetPagination
    filter_backends = [SearchFilter]
    search_fields = [
        "name",
        "description",
        "coverage_type",
        "premium_pool_type",
        "governance_type",
    ]

    def get_queryset(self):
        if where_member := self.request.query_params.get("where_member", None):
            if where_member:
                return Policy.objects.filter(
                    pod__members__id=self.request.user.id
                ).order_by("-created_at")
            else:
                return Policy.objects.exclude(
                    pod__members__id=self.request.user.id
                ).order_by("-created_at")
        return Policy.objects.filter(
            Q(is_public=True) | Q(pod__members__in=[self.request.user.id])
        ).distinct()

    def get_serializer_class(self):
        if self.request.method in SAFE_METHODS:
            return FullPolicySerializer
        return PolicySerializer

    def perform_create(self, serializer):
        # create the attached pod if payload doesnt have a pod id
        # adds the policy creator as the escrow agent. This might change in the future, likely to a democratic system
        if not serializer.validated_data.get("pod", None):
            pod_serializer = PodSerializer(data=self.request.data)
            if pod_serializer.is_valid():
                pod = pod_serializer.save(creator=self.request.user)
                serializer.save(pod=pod, escrow_manager=self.request.user)
            else:
                raise ValidationError(
                    {
                        "errors": pod_serializer.errors,
                        "message": "Could not create pod which is required for a new policy",
                    }
                )

    @action(detail=True, methods=["POST"], permission_classes=[IsAuthenticated])
    def join(self, request, pk=None):
        # there should be gaurdrails for a new user to join
        # namely based the risk that this user personally carries
        # but for now, let them in.
        policy = self.get_object()
        pod = policy.pod
        if policy.is_policy_active() and not pod.allow_joiners_after_policy_start:
            return Response(
                {
                    "message": "Policy is active and does not allow for new members after policy start"
                },
                status=HTTP_403_FORBIDDEN,
            )
        if pod.is_full():
            return Response({"message": "Pod is full"}, status=HTTP_403_FORBIDDEN)
        policy.pod.members.add(request.user)
        schedule_premiums(policy, for_users=[request.user])

        spots_remaining = -1  # unlimited, except where theres a max_pod_size
        if pod.max_pod_size and pod.max_pod_size > 0:
            spots_remaining = pod.max_pod_size - pod.members.count()

        send_user_welcome_email(request.user, policy)

        return Response(
            {
                **FullPolicySerializer(policy).data,
                "spots_remaining": spots_remaining,
            },
            status=HTTP_201_CREATED,
        )


class PremiumViewSet(RetrieveUpdateDestroyAPIView):
    queryset = Premium.objects.all()
    serializer_class = PremiumSerializer
    permission_classes = [IsAuthenticated]

    # premiums are paid to the publicly available escrow account
    # available on the policy detail page
    # for now we dont handle direct debiting, just allowing the pod to keep track of it


class RiskSettingsViewSet(RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated & InRiskSettingsPolicyPod]
    serializer_class = PolicyRiskSettingsSerializer
    lookup_url_kwarg = "policy_id"

    def get_object(self):
        try:
            return PolicyRiskSettings.objects.get(policy__id=self.kwargs["policy_id"])
        except PolicyRiskSettings.DoesNotExist:
            raise ValidationError({"message": "Risk settings not found"})

    def perform_update(self, serializer):
        # dont allow risk settings to change if the policy is already active
        # might be moved to a vote in the future but a hard stop for now is better than allowing changes during an active policy
        coverage_start_date = self.get_object().policy.coverage_start_date

        if coverage_start_date and coverage_start_date < timezone.now():
            raise ValidationError(
                {"message": "Risk settings cannot be changed once the policy is active"}
            )

        risk_settings = serializer.save(last_updated_by=self.request.user)
        policy = risk_settings.policy

        # we need to recompute the risk scores and premiums
        for risk in risk_settings.policy.risks.filter(premium_amount__isnull=False):
            old_risk = copy(risk.__dict__)
            risk.risk_score = compute_risk_score(risk, risk_settings)
            risk.premium_amount = compute_premium_amount(risk)
            risk.value_at_risk = risk.risk_score * risk.content_object.market_value
            risk.save()

            # send an email to the all policy members that their premiums have changed
            premium_changed = old_risk["premium_amount"] != risk.premium_amount
            if premium_changed:
                send_risk_update_email(
                    user=risk.user,
                    policy=policy,
                    changer=self.request.user,
                    old_risk=old_risk,
                    new_risk=risk,
                )
                logger.info(
                    f"Updated risk {risk.id} from after risk settings update. Email notification sent to {risk.user.email}"
                )

        # recompute the premiums
        policy.premiums.all().delete()
        schedule_premiums(policy)

        return risk_settings


class RiskSettingsHyptotheticalApiView(APIView):
    permission_classes = [IsAuthenticated & InRiskSettingsPolicyPod]
    serializer_class = PolicyRiskSettingsSerializer

    def post(self, request, *args, **kwargs):
        """
        Compute the hypothetical premium amount for a proposed risk setting

        returns:
            user_id -> hypothetical_premium
        """
        try:
            risk_settings = PolicyRiskSettings.objects.get(
                policy__id=self.kwargs["policy_id"]
            )
        except PolicyRiskSettings.DoesNotExist:
            raise ValidationError({"message": "Risk settings not found"})
        risk_settings_serializer = PolicyRiskSettingsSerializer(data=request.data)
        risk_settings_serializer.is_valid(raise_exception=True)
        # DO NOT SAVE THE RISK SETTINGS
        proposed_risk_settings = PolicyRiskSettings(
            **risk_settings_serializer.validated_data, policy=risk_settings.policy
        )

        # compute the hypothetical premium amount for each user
        hypothetical_premiums = {}
        for risk in risk_settings.policy.risks.filter(premium_amount__isnull=False):
            risk.risk_score = compute_risk_score(risk, proposed_risk_settings)
            premium_amount = compute_premium_amount(risk)
            hypothetical_premiums[risk.user.id] = premium_amount

        return Response(
            hypothetical_premiums,
            status=HTTP_200_OK,
        )


class PolicyRiskViewSet(ModelViewSet):
    serializer_class = RiskSerializer

    def get_queryset(self):
        return Risk.objects.filter(policy=self.kwargs["policy_pk"])

    def perform_create(self, serializer):
        policy = Policy.objects.get(id=self.kwargs["policy_pk"])

        kwargs = {"underlying_insured_type": None}

        if len(policy.available_underlying_insured_types) == 1:
            kwargs[
                "underlying_insured_type"
            ] = policy.available_underlying_insured_types[0]
            property_model = get_model_for_risk_type(
                policy.available_underlying_insured_types[0]
            )
            kwargs["content_type"] = ContentType.objects.get_for_model(property_model)
            property_object = property_model.objects.create()
            kwargs["object_id"] = property_object.id

        risk = serializer.save(policy=policy, user=self.request.user, **kwargs)

        return risk

    def partial_update(self, request, policy_pk=None, pk=None):
        risk: Risk = self.get_object()
        serializer = RiskSerializer(risk, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        risk = serializer.save()

        # check if the update comes with nested property information
        existing_property = risk.content_object
        property_serializer_class = get_serializer_for_risk_type(
            risk.underlying_insured_type
        )
        property_serializer = property_serializer_class(
            instance=existing_property,
            data=request.data,
            partial=(existing_property is not None),
        )
        property_serializer.is_valid(raise_exception=True)
        property_object = property_serializer.save()

        risk.premium_amount = None  # reset premium amount on every update

        if not existing_property:
            risk.content_type = ContentType.objects.get_for_model(property_object)
            risk.object_id = property_object.id

        risk.save()

        return Response(RiskSerializer(risk).data, status=HTTP_200_OK)

    @action(detail=True, methods=["GET"], permission_classes=[IsAuthenticated])
    def quote(self, *args, **kwargs):
        risk: Risk = self.get_object()
        # make sure the risk's content_object is filled out
        if not risk.content_object or not risk.content_object.is_filled_out():
            raise ValidationError("Property risk is not filled out")

        if risk.premium_amount:
            # already quoted (doesnt allow for a new price)
            return Response(self.get_serializer(risk).data, status=HTTP_200_OK)

        risk.risk_score = compute_risk_score(risk, risk.policy.risk_settings)
        risk.premium_amount = compute_premium_amount(risk)
        risk.value_at_risk = risk.risk_score * risk.content_object.market_value
        logger.info(f"Risk {risk.id} has a premium of {risk.premium_amount}")
        risk.save()

        # handle the case where the policy creator (who gets auto added to the pod)
        # starts to create their first risk

        if self.request.user == risk.policy.pod.creator:  # be lazy
            policy = risk.policy  # ok special case, be eager
            if policy.premiums.filter(payer=self.request.user).count() == 0:
                schedule_premiums(policy, for_users=[self.request.user])
                send_user_welcome_email(self.request.user, policy)

        return Response(self.get_serializer(risk).data, status=HTTP_200_OK)

    @action(detail=True, methods=["POST"], permission_classes=[IsAuthenticated])
    def upload_image(self, *args, **kwargs):
        risk: Risk = self.get_object()
        if not risk.content_object:
            raise ValidationError("Risk doesnt have a content form")

        album = risk.content_object.album
        image_serializer = ImageSerializer(data=self.request.data)
        image_serializer.is_valid(raise_exception=True)
        image_serializer.save(album=album, owner=self.request.user)

        # we want to return the whole album so the client has the most recent photo set
        return Response(AlbumSerializer(album).data, status=HTTP_201_CREATED)


class RiskMediaViewSet(RetrieveUpdateDestroyAPIView):
    queryset = PropertyImage.objects.all()
    serializer_class = ImageSerializer
    permission_classes = [IsAuthenticated & IsPhotoOwner]
    lookup_url_kwarg = "photo_id"


class RiskViewSet(ModelViewSet):
    serializer_class = RiskSerializer
    permission_classes = [IsAuthenticated & IsRiskOwner]

    def get_queryset(self):
        return Risk.objects.filter(user=self.request.user)


# nested under policies router
class PolicyPremiumViewSet(UpdateModelMixin, ReadOnlyModelViewSet):
    serializer_class = PremiumSerializer
    permission_classes = [IsAuthenticated & InPolicyPremiumPod]

    def get_queryset(self):
        return Premium.objects.filter(policy=self.kwargs["policy_pk"])

    def perform_update(self, serializer):
        kwargs = {}

        premium = self.get_object()
        policy = premium.policy

        if serializer.validated_data["paid"]:
            kwargs["paid_date"] = timezone.now().date()
            kwargs["marked_paid_by"] = self.request.user
            policy.pool_balance += premium.amount
        elif serializer.validated_data["paid"] is False:
            policy.pool_balance -= premium.amount
        policy.save()
        serializer.save(**kwargs)

import logging
from django.utils import timezone
from django.contrib.contenttypes.models import ContentType
from pods.serializers import PodSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_403_FORBIDDEN
from rest_framework.generics import RetrieveUpdateDestroyAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import SAFE_METHODS, IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.filters import SearchFilter
from policies.paginators import StandardResultsSetPagination
from policies.models import Claim, ClaimApproval, Policy, PolicyRiskSettings, Premium, Risk
from policies.permissions import (
    InPolicyPod,
    InPodAndNotClaimant,
    InClaimPod,
    IsPhotoOwner,
    InRiskSettingsPolicyPod
)
from policies.premiums import schedule_premiums
from policies.risk.models import PropertyImage, get_model_for_risk_type
from policies.risk.permissions import IsRiskOwner
from policies.risk.risk_scores import compute_premium_amount, compute_risk_score
from policies.risk.serializers import (
    AlbumSerializer,
    ImageSerializer,
    get_serializer_for_risk_type,
)
from policies.serializers import (
    ClaimSerializer,
    PolicyRiskSettingsSerializer,
    PolicySerializer,
    FullPolicySerializer,
    PremiumSerializer,
    ClaimApprovalSerializer,
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
                return Policy.objects.filter(pod__members__id=self.request.user.id).order_by('-created_at')
            else:
                return Policy.objects.exclude(pod__members__id=self.request.user.id).order_by('-created_at')
        return Policy.objects.all()

    def get_serializer_class(self):
        if self.request.method in SAFE_METHODS:
            return FullPolicySerializer
        return PolicySerializer

    def perform_create(self, serializer):
        # create the attached pod if payload doesnt have a pod id
        if not serializer.validated_data.get("pod", None):
            pod_serializer = PodSerializer(data=self.request.data)
            if pod_serializer.is_valid():
                pod = pod_serializer.save(creator=self.request.user)
                serializer.save(pod=pod)
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
                    "message": "Policy is active and does not allow for new memebers after policy start"
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
    permission_classes = [IsAuthenticated & InPodAndNotClaimant]

    # premiums are paid to the publicly available escrow account
    # available on the policy detail page
    # for now we dont handle direct debiting, just allowing the pod to keep track of it

class RiskSettingsViewSet(RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated & InRiskSettingsPolicyPod]
    serializer_class = PolicyRiskSettingsSerializer
    lookup_url_kwarg = "policy_id"
    
    def get_queryset(self):
        return PolicyRiskSettings.objects.filter(policy__id=self.kwargs["policy_id"])

class ClaimViewSet(ModelViewSet):
    queryset = Claim.objects.all()
    serializer_class = ClaimSerializer
    permission_classes = [IsAuthenticated & InClaimPod]

    def perform_create(self, serializer):
        claim = serializer.save()

        # side effect, send out open approvals requests
        policy_type = claim.policy.governance_type
        if policy_type == "direct_democracy":
            approvals = [
                ClaimApproval(claim=claim, approver=user)
                for user in claim.policy.pod.members.all().exclude(id=claim.claimant.id)
            ]
            ClaimApproval.objects.bulk_create(approvals)
            # maybe send an email too?


class ClaimApprovalViewSet(RetrieveUpdateDestroyAPIView):
    serializer_class = ClaimApprovalSerializer

    def get_queryset(self):
        return ClaimApproval.objects.filter(approver=self.request.user)

    def perform_update(self, serializer):
        approval = serializer.save()
        claim = approval.claim
        policy = claim.policy

        # TODO what happens when the claim is > pool_balance? Tough cookies?

        # Everything is all good, mark the claim as something to be paid out
        # Maybe there should be another record for claim payouts, similar to policy closeouts
        policy.pool_balance -= claim.amount
        policy.save()
        claim.paid_on = timezone.now()
        claim.save()


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

        risk.risk_score = compute_risk_score(risk)
        risk.premium_amount = compute_premium_amount(risk)
        risk.value_at_risk = risk.risk_score * risk.content_object.market_value
        logger.info(f"Risk {risk.id} has a premium of {risk.premium_amount}")
        risk.save()
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

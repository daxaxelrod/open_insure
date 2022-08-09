from urllib import request
from django.utils import timezone
from pods.serializers import PodSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import RetrieveUpdateDestroyAPIView, ListCreateAPIView
from rest_framework.permissions import SAFE_METHODS, IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.filters import SearchFilter
from policies.paginators import StandardResultsSetPagination
from policies.models import Claim, ClaimApproval, Policy, Premium, Risk
from policies.permissions import InPolicyPod, InPodAndNotClaimant, InClaimPod
from policies.premiums import schedule_premiums
from policies.serializers import (
    ClaimSerializer,
    PolicySerializer,
    FullPolicySerializer,
    PremiumSerializer,
    ClaimApprovalSerializer,
    RiskSerializer,
)


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
                return Policy.objects.filter(pod__members__id=self.request.user.id)
            else:
                return Policy.objects.exclude(pod__members__id=self.request.user.id)
        return Policy.objects.all()

    def get_serializer_class(self):
        if self.request.method in SAFE_METHODS:
            return FullPolicySerializer
        return PolicySerializer

    def perform_update(self, serializer):
        # schedule first premiums when coverage date gets set
        coverage_start_date = serializer.instance.coverage_start_date
        policy = serializer.save()

        # when the policy gets activated, schedule all premiums
        if not coverage_start_date and policy.coverage_start_date:
            schedule_premiums(policy)

    def perform_create(self, serializer):
        # create the attached pod if payload doesnt have a pod id
        if not serializer.validated_data.get("pod", None):
            pod_serializer = PodSerializer(data=self.request.data)
            if pod_serializer.is_valid():
                pod = pod_serializer.save(creator=self.request.user)
                policy = serializer.save(pod=pod)
            else:
                raise ValidationError(
                    {
                        "errors": pod_serializer.errors,
                        "message": "Could not create pod which is required for a new policy",
                    }
                )
        else:
            policy = serializer.save()

        # schedule premiums when coverage date gets set
        if policy.coverage_start_date:
            schedule_premiums(policy)

    @action(detail=True, methods=["POST"], permission_classes=[IsAuthenticated])
    def join(self, request, pk=None):
        # there should be gaurdrails for a new user to join
        # namely based the risk that this user personally carries
        # but for now, let them in.
        policy = self.get_object()
        policy.pod.members.add(request.user)
        schedule_premiums(policy, for_users=[request.user])
        return Response(FullPolicySerializer(policy).data, status=201)


class PremiumViewSet(RetrieveUpdateDestroyAPIView):
    queryset = Premium.objects.all()
    serializer_class = PremiumSerializer
    permission_classes = [IsAuthenticated & InPodAndNotClaimant]

    # premiums are paid to the publicly available escrow account
    # available on the policy detail page
    # for now we dont handle direct debiting, just allowing the pod to keep track of it


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


class RiskViewSet(ModelViewSet):
    serializer_class = RiskSerializer

    def get_queryset(self):
        return Risk.objects.filter(policy=self.kwargs["policy_pk"])

    def perform_create(self, serializer):
        policy = Policy.objects.get(id=self.kwargs["policy_pk"])
        underlying_insured_type = None
        if len(policy.available_underlying_insured_types) == 1:
            underlying_insured_type = policy.available_underlying_insured_types[0]
        risk = serializer.save(
            policy=policy,
            user=self.request.user,
            underlying_insured_type=underlying_insured_type,
        )
        return risk

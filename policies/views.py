
from django.utils import timezone
from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.permissions import SAFE_METHODS, IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from policies.models import Claim, ClaimApproval, Policy, Premium
from policies.permissions import InPolicyPod, InPodAndNotClaimant, InClaimPod
from policies.premiums import schedule_premiums
from policies.serializers import (ClaimSerializer, PolicySerializer, 
                                  FullPolicySerializer, PremiumSerializer, 
                                  ClaimApprovalSerializer)

class PolicyViewSet(ModelViewSet):
    queryset = Policy.objects.all()
    permission_classes = [IsAuthenticated&InPolicyPod]
    
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
        policy = serializer.save()
        if policy.coverage_start_date:
            schedule_premiums(policy)

    @action(detail=True, methods=['POST'], permission_classes=[IsAuthenticated])
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
    permission_classes = [IsAuthenticated&InPodAndNotClaimant]

    # premiums are paid to the publicly available escrow account
    # available on the policy detail page
    # for now we dont handle direct debiting, just allowing the pod to keep track of it

class ClaimViewSet(ModelViewSet):
    queryset = Claim.objects.all()
    serializer_class = ClaimSerializer
    permission_classes = [IsAuthenticated&InClaimPod]

    def perform_create(self, serializer):
        claim = serializer.save()

        # side effect, send out open approvals requests
        policy_type = claim.policy.governance_type
        if policy_type == 'direct_democracy':
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
        if claim.is_approved() and claim.paid_on is None:
            # TODO what happens when the claim is > pool_balance? Tough cookies?
            policy.pool_balance -= claim.amount
            policy.save()
            claim.paid_on = timezone.now()
            claim.save()
            


    
    




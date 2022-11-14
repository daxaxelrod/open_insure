
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from policies.claims.emails import send_notification_of_new_claim_vote

from policies.models import Claim, ClaimApproval, Policy
from policies.claims.serializers import ClaimSerializer, ClaimApprovalSerializer
from policies.claims.permissions import InClaimPod, InClaimApprovalPod, IsNotClaimant


class ClaimViewSet(ModelViewSet):
    queryset = Claim.objects.all()
    serializer_class = ClaimSerializer
    permission_classes = [IsAuthenticated & InClaimPod]

    def perform_create(self, serializer):
        policy = Policy.objects.get(id=self.kwargs["policy_pk"])
        claim = serializer.save(policy=policy)

        # side effect, send out open approvals requests
        policy_type = claim.policy.governance_type
        if policy_type == "direct_democracy" and claim.has_evidence():
            pod_members_except_claimant = claim.policy.pod.members.all().exclude(id=claim.claimant.id)
            approvals = [
                ClaimApproval(claim=claim, approver=user)
                for user in pod_members_except_claimant
            ]
            ClaimApproval.objects.bulk_create(approvals)
            send_notification_of_new_claim_vote(claim, pod_members_except_claimant)


class ClaimApprovalViewSet(RetrieveUpdateDestroyAPIView):
    serializer_class = ClaimApprovalSerializer
    permission_classes = [IsAuthenticated & InClaimApprovalPod & IsNotClaimant]

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


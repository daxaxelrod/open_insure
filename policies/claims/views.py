
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from rest_framework.generics import RetrieveUpdateDestroyAPIView

from policies.models import Claim, ClaimApproval
from policies.claims.serializers import ClaimSerializer, ClaimApprovalSerializer
from policies.claims.permissions import InClaimPod


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


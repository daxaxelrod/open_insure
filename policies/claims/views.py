
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS

from django.utils import timezone
from rest_framework.generics import RetrieveUpdateDestroyAPIView, CreateAPIView
from django.shortcuts import get_object_or_404

from policies.models import Claim, ClaimApproval, ClaimEvidence, Policy
from policies.claims.serializers import ClaimSerializer, ClaimApprovalSerializer, ClaimEvidenceSerializer, FullClaimSerializer
from policies.claims.permissions import InClaimPod, InClaimApprovalPod, IsNotClaimant
from policies.claims.approvals import conditionally_create_claim_approvals


class ClaimViewSet(ModelViewSet):
    queryset = Claim.objects.all()
    serializer_class = ClaimSerializer
    permission_classes = [IsAuthenticated & InClaimPod]

    def get_serializer_class(self):
        if self.request.method in SAFE_METHODS:
            return FullClaimSerializer
        return ClaimSerializer

    def perform_create(self, serializer):
        policy = Policy.objects.get(id=self.kwargs["policy_pk"])
        claim = serializer.save(policy=policy)
        conditionally_create_claim_approvals(claim)
        
            

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

class ClaimEvidenceAPIView(CreateAPIView):
    '''
        Frontend workflow necessitates that we create image assets for the claim before we can create the claim itself

        Clients will create images first (which is linked to the photo upload) and then attach them to the claim
    '''
    serializer_class = ClaimEvidenceSerializer
    permission_classes = [IsAuthenticated & InClaimPod]

    def perform_create(self, serializer):
        policy = get_object_or_404(Policy, pk=self.kwargs["policy_pk"])
        return serializer.save(policy=policy, owner=self.request.user)
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_403_FORBIDDEN
from rest_framework.decorators import action
from rest_framework.generics import RetrieveUpdateDestroyAPIView, CreateAPIView

from django.utils import timezone
from django.shortcuts import get_object_or_404

from policies.models import Claim, ClaimApproval, ClaimComment, Policy
from policies.claims.models import ClaimView
from policies.claims.serializers import ClaimSerializer, ClaimApprovalSerializer, ClaimEvidenceSerializer, FullClaimSerializer, ClaimViewSerializer, ClaimCommentSerializer
from policies.claims.permissions import InClaimPod, InClaimApprovalPod, IsNotClaimant, IsCommentOwner
from policies.claims.approvals import conditionally_create_claim_approvals, conditionally_approve_claim


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

    @action(detail=True, methods=["post"])
    def payout(self, request, pk=None):
        # a route that only the escrow agent can call
        # pays out the claim (and deducts from the policy reserves)
        # also maybe sends an email in the future
        claim = self.get_object()
        policy: Policy = claim.policy

        if policy.escrow_manager != request.user:
            return Response(
                {"error": "Only the escrow manager can payout claims"},
                status=HTTP_403_FORBIDDEN,
            )
        if claim.is_approved():
            policy.pool_balance -= claim.amount
            policy.save()

            claim.paid_on = timezone.now()
            claim.save()
            
            return Response(data={"message": "Claim paid out", "claim": ClaimSerializer(claim).data}, status=HTTP_200_OK)
        return Response(data={"message": "Claim not approved, cannot pay out"}, status=HTTP_400_BAD_REQUEST)
        
        
            

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
        conditionally_approve_claim(claim)

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

class ClaimCommentsViewSet(ModelViewSet):
    
    permission_classes = [IsAuthenticated & InClaimPod & IsCommentOwner]
    serializer_class = ClaimCommentSerializer

    def perform_create(self, serializer):
        claim = get_object_or_404(Claim, pk=self.kwargs["claim_pk"])
        return serializer.save(claim=claim, commenter=self.request.user)

    def get_queryset(self):
        return ClaimComment.objects.filter(claim__id=self.kwargs["claim_pk"])


class ClaimViewModelViewSet(ModelViewSet):
    queryset = ClaimView.objects.all()
    serializer_class = ClaimViewSerializer
    permission_classes = [IsAuthenticated & InClaimPod]

    def get_queryset(self):
        return ClaimView.objects.filter(claim__id=self.kwargs["claim_pk"])

    def perform_create(self, serializer):
        serializer.save(viewer=self.request.user)

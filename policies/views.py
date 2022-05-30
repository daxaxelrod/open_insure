
from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.permissions import SAFE_METHODS, IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from policies.models import Claim, ClaimApproval, Policy, Premium
from policies.permissions import InPod, InPodAndNotPayee
from policies.premiums import schedule_premiums
from policies.serializers import ClaimSerializer, PolicySerializer, FullPolicySerializer, PremiumSerializer

class PolicyViewSet(ModelViewSet):
    queryset = Policy.objects.all()
    permission_classes = [IsAuthenticated&InPod]
    
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
    permission_classes = [IsAuthenticated&InPodAndNotPayee]

    # premiums are paid to the publicly available escrow account
    # available on the policy detail page
    # for now we dont handle direct debiting, just allowing the pod to keep track of it

class ClaimViewSet(ModelViewSet):
    queryset = Claim.objects.all()
    serializer_class = ClaimSerializer

    def perform_create(self, serializer):
        claim = serializer.save()

        # side effect, send out open approvals requests
        policy_type = claim.policy.governance_type
        if policy_type == 'direct_democracy':
            approvals = [
                ClaimApproval(claim=claim, approver=claim.policy.pod.owner) 
                for user in claim.policy.pod.members.all().exclude(id=claim.claiment.id)
            ]
            ClaimApproval.objects.bulk_create(approvals)

            # maybe send an email too?
    




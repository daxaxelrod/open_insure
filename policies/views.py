from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import SAFE_METHODS
from policies.models import Claim, ClaimApproval, Policy
from policies.serializers import ClaimSerializer, PolicySerializer, FullPolicySerializer

class PolicyViewSet(ModelViewSet):
    queryset = Policy.objects.all()
    
    def get_serializer_class(self):
        if self.request.method in SAFE_METHODS:
            return PolicySerializer
        return FullPolicySerializer


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
    




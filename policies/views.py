from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import SAFE_METHODS
from policies.models import Claim, Policy
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
    



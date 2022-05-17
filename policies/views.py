from rest_framework.viewsets import ModelViewSet
from policies.models import Claim, Policy
from policies.serializers import ClaimSerializer, PolicySerializer


class PolicyViewSet(ModelViewSet):
    queryset = Policy.objects.all()
    serializer_class = PolicySerializer


class ClaimViewSet(ModelViewSet):
    queryset = Claim.objects.all()
    serializer_class = ClaimSerializer

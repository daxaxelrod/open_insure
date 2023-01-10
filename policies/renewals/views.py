from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from policies.permissions import InPolicyPod
from policies.renewals.serializers import RenewalSerializer

class RenewalModelViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated & InPolicyPod]
    serializer_class = RenewalSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from policies.models import Policy
from policies.permissions import InPolicyPod
from policies.renewals.serializers import RenewalSerializer

class RenewalModelViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated & InPolicyPod]
    serializer_class = RenewalSerializer

    # gets the policy from the url from the nested serializer
    def perform_create(self, serializer):
        policy = Policy.objects.get(id=self.kwargs["policy_pk"])
        serializer.save(policy=policy)
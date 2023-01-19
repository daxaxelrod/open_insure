from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from policies.models import Policy
from policies.permissions import InPolicyPod
from policies.renewals.serializers import RenewalSerializer
from rest_framework.exceptions import PermissionDenied


class RenewalModelViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated & InPolicyPod]
    serializer_class = RenewalSerializer

    def get_queryset(self):
        policy = Policy.objects.get(id=self.kwargs["policy_pk"])
        return policy.renewals.all()

    # gets the policy from the url from the nested serializer
    def perform_create(self, serializer):
        policy = Policy.objects.get(id=self.kwargs["policy_pk"])
        if self.request.user not in policy.pod.members.all():
            raise PermissionDenied("You are not a member of this policy's pod")
        serializer.save(policy=policy)

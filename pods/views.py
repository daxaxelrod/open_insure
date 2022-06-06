from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.status import HTTP_201_CREATED, HTTP_403_FORBIDDEN, HTTP_200_OK, HTTP_400_BAD_REQUEST
from pods.models import Pod, User
from pods.serializers import PodSerializer, UserSerializer
from policies.premiums import remove_future_premiums

class PodViewSet(ModelViewSet):
    queryset = Pod.objects.all()
    serializer_class = PodSerializer

    @action(detail=True, methods=["POST"])
    def join(self, request, **kwargs):
        pod = self.get_object()
        user = request.user
        if pod.has_policy():
            if pod.policy.is_policy_active() and not pod.allow_joiners_after_policy_start:
                return Response({"message": "Policy is active and does not allow for new memebers after policy start"}, status=HTTP_403_FORBIDDEN)
        if pod.is_full():
            return Response({"message": "Pod is full"}, status=HTTP_403_FORBIDDEN)
        pod.members.add(user)
        spots_remaining = -1
        if pod.max_pod_size > 0:
            spots_remaining = pod.max_pod_size - pod.members.count()
        return Response({**self.get_serializer_class()(pod),
            "spots_remaining": spots_remaining
        }, status=HTTP_201_CREATED)
        
    # Leaving a pod should be allowed
    #   - gives people flexibility if they cant pay premiums anymore for example
    # Just conflicted on what to do with the already paid premiums
    # Its generally better for the herd to have policies that are active not have a ton of attition
    # So as of right now a policy 'keeps' (redistributes) the premiums already paid in.
    # We also dont allow for a user to be 'booted', just them who can leave.
    #   - Blocks bad acting admins from kicking everyone out and keeping premiums for themselves
    # Happy to hear other opinions on the matter
    @action(detail=True, methods=["POST"])
    def leave(self, request, **kwargs):
        pod = self.get_object()
        user = request.user
        remove_future_premiums(user, pod.policy)
        pod.members.remove(user)
        return Response({"message": "You have left the pod. You no longer owe premiums"}, status=HTTP_200_OK)

class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    
        

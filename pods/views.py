from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from pods.models import Pod, User
from pods.serializers import PodSerializer, UserSerializer

class PodViewSet(ModelViewSet):
    queryset = Pod.objects.all()
    serializer_class = PodSerializer

    @action(detail=True, methods=['POST'])
    def join(self, request, pk=None):
        pod = self.get_object()
        pod.members.add(request.user)
        return Response(PodSerializer(pod).data)

    @action(detail=True, methods=['POST'])
    def leave(self, request, pk=None):
        pod = self.get_object()
        pod.members.remove(request.user)
        return Response(PodSerializer(pod).data)
    
class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    
        

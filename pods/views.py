from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.status import HTTP_403_FORBIDDEN
from pods.models import Pod, User
from pods.serializers import PodSerializer, UserSerializer

class PodViewSet(ModelViewSet):
    queryset = Pod.objects.all()
    serializer_class = PodSerializer
class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    
        

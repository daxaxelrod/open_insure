from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet

from pods.models import Pod, User
from pods.serializers import PodSerializer, UserSerializer

class PodViewSet(ModelViewSet):
    queryset = Pod.objects.all()
    serializer_class = PodSerializer
    
class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
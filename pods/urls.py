from django.urls import include, path
from rest_framework import routers

from pods.views import PodViewSet, UserViewSet

router = routers.DefaultRouter()
router.register(r"pods", PodViewSet)
router.register(r"users", UserViewSet)

urlpatterns = [] # still need for one off routes, see policies.urls

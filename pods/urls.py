from django.urls import path
from rest_framework import routers

from pods.views import (
    PodViewSet,
    UserViewSet,
    SelfView,
    WaitlistView,
    PodInviteRetrieveUpdateView,
)

router = routers.DefaultRouter()
router.register(r"pods", PodViewSet)
router.register(r"users", UserViewSet)

urlpatterns = [
    path(
        "me/",
        SelfView.as_view(),
        name="me",
    ),
    path("waitlist/", WaitlistView.as_view(), name="waitlist"),
    path(
        "invites/<slug:token>/",
        PodInviteRetrieveUpdateView.as_view(),
        name="pod-invite",
    ),
]

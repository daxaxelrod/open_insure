from django.urls import include, path, re_path
from rest_framework_nested import routers

from elections.views import ElectionModelViewSet, VoteModelViewSet

router = routers.DefaultRouter()

router.register(r"elections", ElectionModelViewSet)

policy_nested_router = routers.NestedSimpleRouter(router, r"elections", lookup="elections")
policy_nested_router.register(r"votes", VoteModelViewSet, basename="election-votes")

urlpatterns = [
    path("", include(policy_nested_router.urls)),
]
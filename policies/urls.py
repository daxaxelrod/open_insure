from django.urls import include, path
from rest_framework import routers

from policies.views import ClaimViewSet, PolicyViewSet, PremiumViewSet

router = routers.DefaultRouter()
router.register(r"policies", PolicyViewSet)
router.register(r"claims", ClaimViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("premiums/<int:pk>", PremiumViewSet.as_view(), name="premium_detail"),
]

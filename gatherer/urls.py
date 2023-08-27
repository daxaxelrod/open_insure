from django.urls import path
from rest_framework import routers

from gatherer.views import PolicyLinePropertyViewSet, PropertyLifeExpectancyGuessViewSet

router = routers.DefaultRouter()
router.register(r"policy-lines", PolicyLinePropertyViewSet, basename="policy-lines")
router.register(r"guess", PropertyLifeExpectancyGuessViewSet)

urlpatterns = []

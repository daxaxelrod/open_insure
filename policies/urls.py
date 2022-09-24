from django.urls import include, path
from rest_framework_nested import routers


from policies.views import (
    ClaimApprovalViewSet,
    ClaimViewSet,
    PolicyViewSet,
    PremiumViewSet,
    RiskSettingsViewSet,

    # risk
    PolicyRiskViewSet,
    RiskViewSet,
    RiskMediaViewSet,
)

router = routers.DefaultRouter()
router.register(r"policies", PolicyViewSet)
router.register(r"claims", ClaimViewSet)
router.register(r"risk", RiskViewSet, basename="risk")
router.register(r"policies/(?P<policy_id>\d+)/risk_settings", RiskSettingsViewSet, basename="premium")

risk_router = routers.NestedSimpleRouter(router, r"policies", lookup="policy")
risk_router.register(r"risk", PolicyRiskViewSet, basename="policy-risks")

urlpatterns = [
    path("premiums/<int:pk>/", PremiumViewSet.as_view(), name="premium_detail"),
    path(
        "claims/<int:claim_pk>/approvals/<int:pk>/",
        ClaimApprovalViewSet.as_view(),
        name="claim_approval_detail",
    ),
    path("media/riskPhoto/<int:photo_id>", RiskMediaViewSet.as_view()),
    path("", include(risk_router.urls)),
]

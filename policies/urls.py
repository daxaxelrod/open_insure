from django.urls import include, path, re_path
from rest_framework_nested import routers


from policies.views import (
    PolicyPremiumViewSet,
    PolicyViewSet,
    PremiumViewSet,
    RiskSettingsViewSet,
    RiskSettingsHyptotheticalApiView,

    # risk
    PolicyRiskViewSet,
    RiskViewSet,
    RiskMediaViewSet,
)

from policies.claims.views import (
    ClaimApprovalViewSet,
    ClaimViewSet,
    ClaimEvidenceAPIView,
)

router = routers.DefaultRouter()

router.register(r"policies", PolicyViewSet)
router.register(r"risk", RiskViewSet, basename="risk")

policy_nested_router = routers.NestedSimpleRouter(router, r"policies", lookup="policy")
policy_nested_router.register(r"risk", PolicyRiskViewSet, basename="policy-risks")
policy_nested_router.register(r"premiums", PolicyPremiumViewSet, basename="policy-premium")
policy_nested_router.register(r"claims", ClaimViewSet, basename="policy-claims")

urlpatterns = [
    re_path("policies/(?P<policy_id>\d+)/risk_settings/$", RiskSettingsViewSet.as_view()),
    re_path("policies/(?P<policy_id>\d+)/risk_settings/hypothetical/$", RiskSettingsHyptotheticalApiView.as_view()),
    re_path("policies/(?P<policy_pk>\d+)/claim_evidence/$", ClaimEvidenceAPIView.as_view(), name="policy-claim-evidence"), # todo, standardize to policy_pk
    path("premiums/<int:pk>/", PremiumViewSet.as_view(), name="premium_detail"),
    path(
        "claims/<int:claim_pk>/approvals/<int:pk>/",
        ClaimApprovalViewSet.as_view(),
        name="claim_approval_detail",
    ),
    path("media/riskPhoto/<int:photo_id>", RiskMediaViewSet.as_view()),
    path("", include(policy_nested_router.urls)),
]

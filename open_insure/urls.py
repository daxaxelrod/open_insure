from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from pods.urls import router as pods_router
from policies.urls import router as policy_router
from elections.urls import router as election_router
from gatherer.urls import router as gatherer_router
from . import views
from django.conf import settings
from django.conf.urls.static import static


router = DefaultRouter()
router.registry.extend(pods_router.registry)
router.registry.extend(policy_router.registry)
router.registry.extend(election_router.registry)
router.registry.extend(gatherer_router.registry)


urlpatterns = [
    path("api/v1/", include(router.urls)),
    path("api/v1/", include(("pods.urls", "pods"), namespace="pods")),
    path("api/v1/", include(("policies.urls", "policies"), namespace="policies")),
    path("api/v1/", include(("elections.urls", "elections"), namespace="elections")),
    path(
        "api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"
    ),  # aka login
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path("api/v1/settings/", views.get_instance_settings, name="instance_settings"),
    path("admin/", admin.site.urls),
]

if settings.DEBUG:
    urlpatterns = (
        urlpatterns
        + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
        + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    )


from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)
from pods.urls import router as pods_router
from policies.urls import router as policy_router
from . import views

router = DefaultRouter()
router.registry.extend(pods_router.registry)
router.registry.extend(policy_router.registry)


urlpatterns = [
    path('api/v1/', include(router.urls)),
    path('api/v1/', include(('pods.urls', 'pods'), namespace='pods')),
    path('api/v1/', include(('policies.urls', 'policies'), namespace='policies')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # aka login
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/v1/settings/', views.get_instance_settings, name='instance_settings'),
    path('admin/', admin.site.urls),
]


from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)
from . import views


urlpatterns = [
    path('api/v1/', include(('pods.urls', 'pods'), namespace='pods')),
    path('api/v1/', include(('policies.urls', 'policies'), namespace='policies')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # aka login
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/v1/settings/', views.get_instance_settings, name='instance_settings'),
    path('admin/', admin.site.urls),
]

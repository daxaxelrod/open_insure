
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('api/v1/', include('pods.urls')),
    path('api/v1/', include('policies.urls')),
    path('admin/', admin.site.urls),
]

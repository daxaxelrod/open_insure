
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('api/v1/', include(('pods.urls', 'pods'), namespace='pods')),
    path('api/v1/', include(('policies.urls', 'policies'), namespace='policies')),
    path('admin/', admin.site.urls),
]

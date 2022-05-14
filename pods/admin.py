from django.contrib import admin

from pods.models import Pod, User

# Register your models here.
admin.site.register(User)
admin.site.register(Pod)
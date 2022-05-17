from django.contrib import admin
from policies.models import Policy, Claim

# Register your models here.
admin.site.register(Policy)
admin.site.register(Claim)
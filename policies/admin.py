from django.contrib import admin
from policies.models import Policy, Premium, Claim, PolicyCloseout, ClaimEvidence, ClaimApproval

# Register your models here.
admin.site.register(Policy)
admin.site.register(Claim)
admin.site.register(Premium)
admin.site.register(PolicyCloseout)
admin.site.register(ClaimEvidence)
admin.site.register(ClaimApproval)
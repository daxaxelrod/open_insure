from django.contrib import admin
from policies.models import (
    Policy,
    Premium,
    Claim,
    PolicyCloseout,
    ClaimEvidence,
    ClaimApproval,
    Risk,
)
from policies.risk.models import PhoneRisk, AudioEquipmentRisk

# Register your models here.
admin.site.register(Policy)
admin.site.register(Claim)
admin.site.register(Premium)
admin.site.register(PolicyCloseout)
admin.site.register(ClaimEvidence)
admin.site.register(ClaimApproval)
admin.site.register(Risk)
admin.site.register(PhoneRisk)
admin.site.register(AudioEquipmentRisk)

from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html
from django.contrib.contenttypes.models import ContentType
from policies.models import (
    Policy,
    PolicyRiskSettings,
    Premium,
    Claim,
    PolicyCloseout,
    ClaimEvidence,
    ClaimApproval,
    Risk,
)

from policies.risk.models import PhoneRisk, AudioEquipmentRisk

class RiskAdmin(admin.ModelAdmin):
    readonly_fields = ('get_property_model',)

    def get_property_model(self, obj):
        content_type = ContentType.objects.get_for_model(obj.content_object._meta.model)
        url = reverse("admin:%s_%s_change" % (content_type.app_label, content_type.model), args=(obj.object_id,))
        return format_html("<a href='{url}'>{url}</a>", url=url)



class RiskInline(admin.TabularInline):
    model = Risk
    extra = 1
    verbose_name_plural = 'risks'

class PolicyAdmin(admin.ModelAdmin):
    inlines = [RiskInline]

admin.site.register(Policy, PolicyAdmin)
admin.site.register(Claim)
admin.site.register(Premium)
admin.site.register(PolicyCloseout)
admin.site.register(ClaimEvidence)
admin.site.register(ClaimApproval)
admin.site.register(Risk, RiskAdmin)
admin.site.register(PhoneRisk)
admin.site.register(AudioEquipmentRisk)
admin.site.register(PolicyRiskSettings)

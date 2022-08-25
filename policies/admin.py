from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html_join, mark_safe
from django.contrib.contenttypes.models import ContentType
from django.conf import settings
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

from policies.risk.models import (
    PhoneRisk,
    AudioEquipmentRisk,
    ImageAlbum,
    PropertyImage,
)


class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1
    readonly_fields = ("image_tag",)

    def image_tag(self, instance):
        if instance.image != "":
            return mark_safe(
                f'<img src="{settings.MEDIA_URL}{instance.image}" width="150" height="150" />'
            )


class AlbumAdmin(admin.ModelAdmin):
    inlines = [PropertyImageInline]


class RiskAdmin(admin.ModelAdmin):
    readonly_fields = ("get_property_model",)

    def get_property_model(self, obj):
        content_type = ContentType.objects.get_for_model(obj.content_object._meta.model)
        url = reverse(
            "admin:%s_%s_change" % (content_type.app_label, content_type.model),
            args=(obj.object_id,),
        )
        return format_html("<a href='{url}'>{url}</a>", url=url)


class RiskInline(admin.TabularInline):
    model = Risk
    extra = 1
    verbose_name_plural = "risks"


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
admin.site.register(ImageAlbum, AlbumAdmin)

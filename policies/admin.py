from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html, mark_safe
from django.contrib.contenttypes.models import ContentType
from django.conf import settings
from django.utils import timezone
from django import forms

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

from policies.perils.models import Peril

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
    list_display = ("__str__", "underlying_insured_type", "get_premium_amount")

    def get_property_model(self, obj):
        content_type = ContentType.objects.get_for_model(obj.content_object._meta.model)
        url = reverse(
            "admin:%s_%s_change" % (content_type.app_label, content_type.model),
            args=(obj.object_id,),
        )
        return format_html("<a href='{url}'>{url}</a>", url=url)

    def get_premium_amount(self, obj):
        if obj.premium_amount:
            return obj.premium_amount/100
        return "Not Quoted"


class RiskInline(admin.TabularInline):
    model = Risk
    extra = 1
    verbose_name_plural = "risks"


class PolicyAdmin(admin.ModelAdmin):
    inlines = [RiskInline]



class PremiumChangeForm(forms.ModelForm):
    class Meta:
        model = Premium
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super(PremiumChangeForm, self).__init__(*args, **kwargs)

    def save(self, *args, **kwargs):
        if self.cleaned_data['paid']:
            self.instance.paid_date = timezone.now()
            self.instance.save() # have to do it this way because the model form changed fields cant be edited after the form is created
        return super(PremiumChangeForm, self).save(*args, **kwargs)


class PremiumAdmin(admin.ModelAdmin):
    list_editable = ('paid',)
    list_display = ('policy', 'payer', 'amount', 'paid', 'due_date', 'paid_date')

    def get_changelist_form(self, request, **kwargs):
        return PremiumChangeForm

admin.site.register(Policy, PolicyAdmin)
admin.site.register(Claim)
admin.site.register(Premium, PremiumAdmin)
admin.site.register(PolicyCloseout)
admin.site.register(ClaimEvidence)
admin.site.register(ClaimApproval)
admin.site.register(Risk, RiskAdmin)
admin.site.register(PhoneRisk)
admin.site.register(AudioEquipmentRisk)
admin.site.register(PolicyRiskSettings)
admin.site.register(ImageAlbum, AlbumAdmin)
admin.site.register(Peril)

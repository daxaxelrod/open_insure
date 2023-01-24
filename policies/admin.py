from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html, mark_safe
from django.contrib.contenttypes.models import ContentType
from django.conf import settings
from django.shortcuts import render
from django.http import HttpResponseRedirect
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
    ClaimComment,
    Risk,
)

from policies.renewals.models import Renewal

from policies.risk.models import (
    PhoneRisk,
    AudioEquipmentRisk,
    ImageAlbum,
    PropertyImage,
)

from policies.perils.models import Peril
from policies.claims.models import ClaimView


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
            return obj.premium_amount / 100
        return "Not Quoted"


class RiskInline(admin.TabularInline):
    model = Risk
    extra = 1
    verbose_name_plural = "risks"


class RenewalForm(forms.ModelForm):
    class Meta:
        model = Renewal
        fields = ["months_extension"]


@admin.action(description="Extend Policy and create extension premiums")
def extend_policy(modeladmin, request, queryset):

    if "months_extension" in request.POST:
        form = RenewalForm(request.POST)
        if form.is_valid():
            months_extension = form.cleaned_data["months_extension"]
            modeladmin.message_user(request, "You selected - %s" % months_extension)
            # for policy in queryset:
            #     policy.coverage_duration += 12
            #     policy.save()
            #     for premium in policy.premiums.all():
            #         premium.due_date += relativedelta(months=12)
            #         premium.save()
        return HttpResponseRedirect(request.get_full_path())
    else:
        form = RenewalForm()

    return render(
        request,
        "admin/renewal_form.html",
        {"items": queryset.order_by("pk"), "form": form, "action": "extend_policy"},
    )


class PolicyAdmin(admin.ModelAdmin):
    inlines = [RiskInline]
    actions = [extend_policy]


class PremiumChangeForm(forms.ModelForm):
    class Meta:
        model = Premium
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super(PremiumChangeForm, self).__init__(*args, **kwargs)

    def save(self, *args, **kwargs):
        if self.cleaned_data["paid"]:
            self.instance.paid_date = timezone.now()
            self.instance.save()  # have to do it this way because the model form changed fields cant be edited after the form is created
        return super(PremiumChangeForm, self).save(*args, **kwargs)


class PremiumAdmin(admin.ModelAdmin):
    list_editable = ("paid",)
    list_display = (
        "policy",
        "payer",
        "amount",
        "paid",
        "due_date",
        "paid_date",
        "marked_paid_by",
    )

    def get_changelist_form(self, request, **kwargs):
        return PremiumChangeForm


class ClaimAdmin(admin.ModelAdmin):
    list_display = ("__str__", "amount", "created_at")


class RenewalAdmin(admin.ModelAdmin):
    list_display = ("id", "policy", "months_extension", "date_extension", "created_at")


admin.site.register(Policy, PolicyAdmin)
admin.site.register(Claim, ClaimAdmin)
admin.site.register(Premium, PremiumAdmin)
admin.site.register(PolicyCloseout)
admin.site.register(Renewal, RenewalAdmin)
admin.site.register(ClaimEvidence)
admin.site.register(ClaimApproval)
admin.site.register(Risk, RiskAdmin)
admin.site.register(PhoneRisk)
admin.site.register(AudioEquipmentRisk)
admin.site.register(PolicyRiskSettings)
admin.site.register(ImageAlbum, AlbumAdmin)
admin.site.register(Peril)
admin.site.register(ClaimView)
admin.site.register(ClaimComment)

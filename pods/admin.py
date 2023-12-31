from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html


from pods.models import Education, Experience, Interest, Pod, PodInvite, RegionInfo, ReputationDetails, User, WaitlistMember, UserPod, Badge, UserBadge, ReputationAudit


class MembershipInline(admin.TabularInline):
    model = Pod.members.through


class PodModelAdmin(admin.ModelAdmin):
    inlines = [MembershipInline]


class ExperienceInline(admin.StackedInline):
    model = Experience
    extra = 1


class EducationInline(admin.StackedInline):
    model = Education
    extra = 1


class InterestInline(admin.StackedInline):
    model = Interest
    extra = 1


class RegionInfoInline(admin.StackedInline):
    model = RegionInfo
    extra = 1


class UserAdmin(UserAdmin):
    model = User
    inlines = [ExperienceInline, EducationInline,
               InterestInline, RegionInfoInline]

    fieldsets = UserAdmin.fieldsets + (
        (
            "Custom Fields",
            {"fields": ("picture", "verified_email", "gender", "birthday")},
        ),
        ("Socials", {"fields": ("linkedin_url", "twitter_url")}),
    )


class BadgeAdmin(admin.ModelAdmin):
    def image_tag(self, obj):
        return format_html(
            '<img src="{}" style="height:100px;width:100px" />'.format(
                obj.picture)
        )

    image_tag.short_description = "Icon"

    list_display = [
        "image_tag",
        "__str__",
        "description",
    ]


admin.site.register(ReputationDetails)


admin.site.register(User, UserAdmin)
admin.site.register(Pod, PodModelAdmin)
admin.site.register(UserPod)
admin.site.register(PodInvite)
admin.site.register(WaitlistMember)
admin.site.register(Badge, BadgeAdmin)
admin.site.register(UserBadge)

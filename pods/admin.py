from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html


from pods.models import Pod, PodInvite, User, WaitlistMember, UserPod, Badge, UserBadge


class MembershipInline(admin.TabularInline):
    model = Pod.members.through


class PodModelAdmin(admin.ModelAdmin):
    inlines = [MembershipInline]


class UserAdmin(UserAdmin):
    model = User

    fieldsets = UserAdmin.fieldsets + (
        (None, {"fields": ("picture", "verified_email", "gender", "birthday")}),
    )


class BadgeAdmin(admin.ModelAdmin):
    def image_tag(self, obj):
        return format_html(
            '<img src="{}" style="height:100px;width:100px" />'.format(obj.picture)
        )

    image_tag.short_description = "Icon"

    list_display = [
        "image_tag",
        "__str__",
        "description",
    ]


admin.site.register(User, UserAdmin)
admin.site.register(Pod, PodModelAdmin)
admin.site.register(UserPod)
admin.site.register(PodInvite)
admin.site.register(WaitlistMember)
admin.site.register(Badge, BadgeAdmin)
admin.site.register(UserBadge)

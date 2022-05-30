from django.contrib import admin
from django.contrib.auth.admin import UserAdmin


from pods.models import Pod, User

class MembershipInline(admin.TabularInline):
    model = Pod.members.through

class PodModelAdmin(admin.ModelAdmin):
    inlines = [MembershipInline]

class UserAdmin(UserAdmin):
    model = User

    fieldsets = UserAdmin.fieldsets + (
            (None, {'fields': ('picture','verified_email')}),
    )


admin.site.register(User, UserAdmin)
admin.site.register(Pod, PodModelAdmin)
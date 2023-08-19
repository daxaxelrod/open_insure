from django import forms
from django.contrib import admin
from django.http import HttpResponseRedirect
from django.shortcuts import render
from gatherer.models import PolicyLineProperty, PropertyLifeExpectancyGuess


class MergePropertyLineForm(forms.ModelForm):
    class Meta:
        model = PolicyLineProperty
        fields = ["id"]


@admin.action(description="Merge selected PropertyLine objects")
def merge_property_lines(modeladmin, request, queryset):
    if queryset.count() < 2:
        modeladmin.message_user(
            request, "You must select at least two PropertyLine objects to merge."
        )
        return

    if "primary_line" in request.POST:
        form = MergePropertyLineForm(request.POST)
        if form.is_valid():
            primary_line = form.cleaned_data["id"]
            for line in queryset:
                if line.id != primary_line.id:
                    line.merge_into(primary_line)
            modeladmin.message_user(
                request,
                f"Merged {queryset.count()} PropertyLine objects into {primary_line}",
            )
        return HttpResponseRedirect(request.get_full_path())
    else:
        form = MergePropertyLineForm()
        return render(
            request,
            "admin/merge_property_line_form.html",
            {"items": queryset.order_by("pk"), "form": form, "action": "extend_policy"},
        )


class PropertyLineAdmin(admin.ModelAdmin):
    list_display = ("name", "description", "search_tags", "created_at")

    actions = [merge_property_lines]


admin.site.register(PolicyLineProperty, PropertyLineAdmin)
admin.site.register(PropertyLifeExpectancyGuess)

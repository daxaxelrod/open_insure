from django import forms
from django.contrib import admin
from django.http import HttpResponseRedirect
from django.shortcuts import render
from gatherer.models import (
    PolicyLineProperty,
    PropertyLifeExpectancyGuess,
    PropertyLifeLossGuess,
)


class MergePropertyLineForm(forms.Form):
    def __init__(self, qs, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["primary_line"] = forms.ModelChoiceField(queryset=qs, required=True)


@admin.action(description="Merge selected PropertyLine objects")
def merge_property_lines(modeladmin, request, queryset):
    if queryset.count() < 2:
        modeladmin.message_user(
            request, "You must select at least two PropertyLine objects to merge."
        )
        return

    if (
        "primary_line" in request.POST
        and request.POST.get("confirmation", None) == "Confirm"
    ):
        form = MergePropertyLineForm(queryset, request.POST)
        if form.is_valid():
            primary_line = form.cleaned_data["primary_line"]
            remaining_lines = queryset.exclude(id=primary_line.id)
            for line in remaining_lines:
                line.merge_into(primary_line)
            modeladmin.message_user(
                request,
                f"Merged {remaining_lines.count()} PropertyLine objects into {primary_line}",
            )
        return HttpResponseRedirect(request.get_full_path())
    else:
        form = MergePropertyLineForm(qs=queryset)
        return render(
            request,
            "admin/merge_property_line_form.html",
            {
                "items": queryset.order_by("pk"),
                "form": form,
                "action": "merge_property_lines",
            },
        )


class PropertyLineAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "num_contributions",
        "description",
        "search_tags",
    )
    actions = [merge_property_lines]
    view_on_site = True

    def num_contributions(self, obj):
        return obj.guesses.count()


class LossAdmin(admin.ModelAdmin):
    list_filter = ("guess__property_type",)
    list_display = ("__str__",)


class GuessAdmin(admin.ModelAdmin):
    list_filter = ("property_type",)


admin.site.register(PolicyLineProperty, PropertyLineAdmin)
admin.site.register(PropertyLifeLossGuess, LossAdmin)
admin.site.register(PropertyLifeExpectancyGuess, GuessAdmin)

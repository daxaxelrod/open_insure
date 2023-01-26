from django.db import models
from policies.models import Policy
from elections.models import Election
from pods.models import User


class Renewal(models.Model):
    policy = models.ForeignKey(
        Policy, related_name="renewals", on_delete=models.CASCADE
    )
    election = models.ForeignKey(
        Election,
        on_delete=models.CASCADE,
        related_name="renewals",
        null=True,
        blank=True,
    )
    months_extension = models.IntegerField(
        help_text="The number of months to extend the policy by"
    )

    initiator = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="created_renewals",
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Renewal for {self.policy} - {self.months_extension} month extension"

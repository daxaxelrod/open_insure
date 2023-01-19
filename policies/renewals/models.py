from django.db import models
from policies.models import Policy
from elections.models import Election
from pods.models import User
from dateutil.relativedelta import relativedelta


class Renewal(models.Model):
    policy = models.OneToOneField(
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

    @property
    def date_extension(self):
        return (
            self.policy.coverage_start_date
            + relativedelta(months=self.policy.coverage_duration)
            + relativedelta(months=self.months_extension)
        )

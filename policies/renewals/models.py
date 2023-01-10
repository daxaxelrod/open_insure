from django.db import models
from policies.models import Policy
from elections.models import Election
from pods.models import User

class Renewal(models.Model):
    policy = models.OneToOneField(
        Policy, related_name="renewals", on_delete=models.CASCADE
    )
    election = models.ForeignKey(Election, on_delete=models.CASCADE, related_name="renewals", null=True, blank=True)
    date_extension = models.DateTimeField(help_text="The date the policy will be extended to")
    initiator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="created_renewals", null=True, blank=True)

    # needs to update coverage_duration on the parent policy model
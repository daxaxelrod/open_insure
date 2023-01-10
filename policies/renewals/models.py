from django.db import models
from policies.models import Policy
from elections.models import Election

class Renewal(models.Model):
    policy = models.OneToOneField(
        Policy, related_name="renewals", on_delete=models.CASCADE
    )
    election = models.ForeignKey(Election, on_delete=models.CASCADE, related_name="renewals")

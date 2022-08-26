from django.db import models
from pods.models import User

# just used for display right now
# allows a policy to cover JUST cracked screens for instance.
# once a policy has started, the perils cannot be change

# there will be sensible rows already created but users are able to write their own

class Peril(models.Model):
    name = models.CharField(max_length=128)
    description = models.TextField()
    icon_name = models.CharField(max_length=64, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.name
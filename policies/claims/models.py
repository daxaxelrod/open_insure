from django.db import models
from policies.models import Claim # todo, maybe move claim related models here
from pods.models import User

class ClaimView(models.Model):
    claim = models.ForeignKey(Claim, on_delete=models.CASCADE, related_name="views")
    viewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="claim_views")
    
    source = models.CharField(max_length=128, null=True, blank=True, help_text="Where the view came from, e.g. 'email', 'app', 'web'")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.name
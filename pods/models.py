from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    picture = models.URLField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    verified_email = models.BooleanField(default=False, null=True, blank=True)

class Pod(models.Model):
    """One pod per policy"""

    name = models.CharField(max_length=50)
    description = models.CharField(max_length=200, null=True, blank=True)
    picture = models.URLField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    members = models.ManyToManyField(User, related_name='pods')

    def __str__(self):
        return f"{self.name} Pod ({self.members.count()} members)"
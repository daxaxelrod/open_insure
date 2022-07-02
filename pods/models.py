from enum import unique
from django.db import models
from django.core.exceptions import ObjectDoesNotExist

from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    email = models.EmailField(unique=True)
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
    members = models.ManyToManyField(User, related_name='pods', through='UserPod')

    # related to security and locking down a pod
    max_pod_size = models.IntegerField(null=True, blank=True, help_text="Maximum number of members in pod. If null then there is no limit.")
    allow_joiners_after_policy_start = models.BooleanField(default=True)

    def is_full(self):
        return self.members.count() >= self.max_pod_size

    def has_policy(self):
        try:
            self.policy
            return True
        except ObjectDoesNotExist:
            return False

    def __str__(self):
        return f"{self.name} Pod ({self.members.count()} members)"


class UserPod(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    pod = models.ForeignKey(Pod, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
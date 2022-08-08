from django.db import models
from django.core.exceptions import ObjectDoesNotExist

from django.contrib.auth.models import AbstractUser

from pods.utils.stringUtils import random_string_generator

GENDER_CHOICES = (("M", "Male"), ("F", "Female"), ("O", "Other"))


class User(AbstractUser):
    picture = models.URLField(null=True, blank=True)
    birthday = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    verified_email = models.BooleanField(default=False, null=True, blank=True)
    gender = models.CharField(
        max_length=1, null=True, blank=True, choices=GENDER_CHOICES
    )


class Pod(models.Model):
    """One pod per policy"""

    name = models.CharField(max_length=50)
    description = models.CharField(max_length=200, null=True, blank=True)
    picture = models.URLField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    creator = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="created_pods",
    )
    members = models.ManyToManyField(User, related_name="pods", through="UserPod")

    # related to security and locking down a pod
    max_pod_size = models.IntegerField(
        null=True,
        blank=True,
        help_text="Maximum number of members in pod. If null then there is no limit.",
    )
    allow_joiners_after_policy_start = models.BooleanField(default=True)

    def is_full(self):
        return (
            self.max_pod_size is not None and self.members.count() >= self.max_pod_size
        )

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
    is_user_friend_of_the_pod = models.BooleanField(
        default=False
    )  # is the user trusted by the rest of the POD? IE are they friends with the other members
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class PodInvite(models.Model):
    email = models.EmailField()
    pod = models.ForeignKey(Pod, on_delete=models.CASCADE)
    invitor = models.ForeignKey(
        User, related_name="pod_invites_sent", on_delete=models.CASCADE
    )

    membership = models.ForeignKey(
        UserPod,
        related_name="pod_invites",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    is_accepted = models.BooleanField(default=False)

    is_revoked_by_user = models.BooleanField(default=False)
    is_revoked_by_pod = models.BooleanField(default=False)
    is_revoked_by_admin = models.BooleanField(default=False)
    is_revoked_by_system = models.BooleanField(default=False)

    token = models.CharField(
        max_length=64, null=True, blank=True, default=random_string_generator
    )

    @property
    def is_revoked(self):
        return (
            self.is_revoked_by_user
            or self.is_revoked_by_pod
            or self.is_revoked_by_admin
            or self.is_revoked_by_system
        )

    def __str__(self):
        return f"{self.invitor} invited {self.membership.user} to {self.pod}"

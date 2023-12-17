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

    linkedin_url = models.URLField(null=True, blank=True)
    twitter_url = models.URLField(null=True, blank=True)


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
    pod = models.ForeignKey(Pod, on_delete=models.SET_NULL, null=True, blank=True)
    risk_penalty = models.IntegerField(
        default=0,
        help_text="Base penalty for user who is percieved as more risky to the group, in basis points",
    )
    is_user_friend_of_the_pod = models.BooleanField(
        default=False
    )  # is the user trusted by the rest of the POD? IE are they friends with the other members
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    left_at = models.DateTimeField(
        null=True, blank=True
    )  # when the user left the pod/policy


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
    first_read_at = models.DateTimeField(null=True, blank=True)
    last_read_at = models.DateTimeField(null=True, blank=True)
    accepted_at = models.DateTimeField(null=True, blank=True)

    is_accepted = models.BooleanField(
        default=False
    )  # if accepted then it cant be used again

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
        if self.membership:
            return f"👏 Invite Accepted: {self.invitor} invited {self.email} to {self.pod.name}"
        return f"{self.invitor} invited {self.email} to {self.pod.name}"


class WaitlistMember(models.Model):
    email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.email} is on the waitlist for "


class Badge(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=200, null=True, blank=True)
    picture = models.URLField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    owners = models.ManyToManyField(
        User,
        blank=True,
        related_name="badges",
        through="UserBadge",
    )

    def __str__(self):
        return f"{self.name} Badge"


class UserBadge(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    earn_event = models.CharField(max_length=150, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "badge")

    def __str__(self):
        return f"{self.user} has {self.badge}"

class RegionInfo(models.Model):
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="region_info")


class Institution(models.Model):
    institution_name = models.CharField(max_length=255, null=True, blank=True)
    linkedin_url = models.URLField(null=True, blank=True)
    website = models.URLField(null=True, blank=True)
    industry = models.CharField(max_length=255, null=True, blank=True)
    type = models.CharField(max_length=255, null=True, blank=True)
    headquarters = models.CharField(max_length=255, null=True, blank=True)
    company_size = models.IntegerField(null=True, blank=True)
    founded = models.IntegerField(null=True, blank=True)

    class Meta:
        abstract = True

class Experience(Institution):
    from_date = models.DateField(null=True, blank=True)
    to_date = models.DateField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    position_title = models.CharField(max_length=255, null=True, blank=True)
    duration = models.CharField(max_length=255, null=True, blank=True)
    location = models.CharField(max_length=255, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="experiences")

class Education(Institution):
    from_date = models.DateField(null=True, blank=True)
    to_date = models.DateField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    degree = models.CharField(max_length=255, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="education")

class Interest(Institution):
    title = models.CharField(max_length=255, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="interests")

class ReputationDetails(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="reputation_results"
    )
    calculated_on = models.DateTimeField()
    next_refresh_available = models.DateTimeField(
        help_text="When the next refresh is available"
    )
    total_score = models.DecimalField(max_digits=5, decimal_places=2)
    payments = models.DecimalField(
        max_digits=5, decimal_places=2, help_text="On time payments, volume of payments"
    )
    claims = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        help_text="claims made by user and how often the user is on the right side of claim votes",
    )
    background = models.DecimalField(
        max_digits=5, decimal_places=2, help_text="Profession, education, etc"
    )
    activity = models.DecimalField(
        max_digits=5, decimal_places=2, help_text="Platform activity"
    )
    lifestyle = models.DecimalField(
        max_digits=5, decimal_places=2, help_text="Location, high risk hobbies"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Reputation Details of {self.user.name} (calculated on {self.calculated_on})"
    
    verbose_name = "Reputation Details"
    verbose_name_plural = "Reputation Details"



class EmailSettings(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    updated_at = models.DateTimeField(auto_now=True)

    are_emails_enabled = models.BooleanField(default=True)
    notify_of_new_reputation_score = models.BooleanField(default=True)

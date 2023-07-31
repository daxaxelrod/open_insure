from django.db import models

from pods.models import User


class PolicyLineProperty(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    image_url = models.URLField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    orignal_creator = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True
    )


LOSS_REASON_CHOICES = [
    ("damaged", "Damaged"),
    ("lost", "lost"),
    ("stolen", "Earthquake"),
]


class PropertyLifeExpectancyGuess(models.Model):
    guesser = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="The user who made the guess, if any",
    )
    is_guessor_audited_authority = models.BooleanField(
        default=False,
        help_text="Means the user is the producer/a large consumer of the property type, and is therefore their guess is more likely to be accurate",
    )
    property_name = models.CharField(max_length=255)
    property_make = models.CharField(max_length=255, null=True, blank=True)
    property_type = models.ForeignKey(
        PolicyLineProperty, on_delete=models.CASCADE, related_name="guesses"
    )
    age_of_ownership = models.IntegerField(
        blank=True,
        null=True,
        help_text="Number of months since the property was acquired",
    )
    yearly_loss_rate_bsp = models.IntegerField(
        blank=True,
        null=True,
        help_text="The basis point representation of the property value that is lost each year, mostly calculated from the losses but could be maually set by an audited authority",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class PropertyLifeLossGuess(models.Model):
    loss_months_into_ownership = models.IntegerField()
    loss_percent = models.IntegerField()
    loss_reason = models.CharField(max_length=255, choices=LOSS_REASON_CHOICES)
    guess = models.ForeignKey(
        PropertyLifeExpectancyGuess, on_delete=models.CASCADE, related_name="losses"
    )

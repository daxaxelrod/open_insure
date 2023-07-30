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


class PropertyLifeExpectancyGuess(models.Model):
    guesser = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="The user who made the guess, if any",
    )
    property_type = models.ForeignKey(
        PolicyLineProperty, on_delete=models.CASCADE, related_name="guesses"
    )
    age_of_ownership = models.IntegerField(
        blank=True,
        null=True,
        help_text="Number of months since the property was acquired",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

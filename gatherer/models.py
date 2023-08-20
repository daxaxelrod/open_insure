from unicodedata import category
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

from pods.models import User


class PolicyLineProperty(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    search_tags = models.TextField(blank=True, null=True, help_text="comma separated")

    image_url = models.URLField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    orignal_creator = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True
    )

    def __str__(self):
        return self.name

    def merge_into(self, primary_line):
        for guess in self.guesses.all():
            guess.property_type = primary_line
            guess.save()
        self.delete()


LOSS_REASON_CHOICES = [
    ("damaged", "Damaged"),
    ("lost", "Lost"),
    ("stolen", "Stolen"),
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
    property_name = models.CharField(max_length=255, null=True, blank=True)
    property_make = models.CharField(max_length=255, null=True, blank=True)
    property_type = models.ForeignKey(
        PolicyLineProperty, on_delete=models.CASCADE, related_name="guesses"
    )
    purchase_price = models.IntegerField(
        blank=True,
        null=True,
        help_text="The original purchase price of the property, in the cents",
    )
    purchase_date = models.DateTimeField(
        help_text="The date the property was purchased", null=True, blank=True
    )
    age_of_ownership = models.IntegerField(
        blank=True,
        null=True,
        help_text="Number of days since the property was acquired",
    )
    yearly_loss_rate_bsp = models.IntegerField(
        blank=True,
        null=True,
        help_text="The basis point representation of the property value that is lost each year, mostly calculated from the losses but could be maually set by an audited authority",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.property_type} ${self.purchase_price} loss rate: {self.yearly_loss_rate_bsp} bsp/year"


class PropertyLifeLossGuess(models.Model):
    loss_date = models.DateTimeField()
    loss_months_into_ownership = models.IntegerField(null=True, blank=True)
    loss_percent = models.IntegerField(
        null=True,
        blank=True,
        help_text="in basis points, 0 - 10000",
        validators=[MinValueValidator(0), MaxValueValidator(10000)],
    )
    loss_amount = models.IntegerField(help_text="The cost of the loss in cents")
    loss_reason = models.CharField(max_length=1024)
    category = models.CharField(
        max_length=255, choices=LOSS_REASON_CHOICES, null=True, blank=True
    )
    guess = models.ForeignKey(
        PropertyLifeExpectancyGuess, on_delete=models.CASCADE, related_name="losses"
    )

    def __str__(self) -> str:
        return f"${self.loss_amount} of {self.guess.property_type} lost on {self.loss_date}"

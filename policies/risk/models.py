from django.db import models

# Data representing the underlying assets that a user wants to insure.
# there are differnt bits of information that are needed for each type of item
# These are all subsequenty organized into a single Risk model that is attached to the policy for each user via a content type
# that risk model then looks at the underlying and computes the risk score and premium for that user

CONDITION_CHOICES = [
    ("new", "Brand New"),
    ("near_perfect", "Near Perfect"),
    ("great", "Great"),
    ("good", "Good"),
    ("ok", "ok"),
]


class GenericProperty(models.Model):
    make = models.CharField(max_length=128, null=True, blank=True)
    model = models.CharField(max_length=128, null=True, blank=True)
    condition = models.CharField(max_length=64, choices=CONDITION_CHOICES, null=True, blank=True)
    market_value = models.IntegerField(help_text="in cents", null=True, blank=True)
    
    class Meta:
        abstract = True
        

class PhoneRisk(GenericProperty):
    has_screen_protector = models.BooleanField(default=False)
    has_case = models.BooleanField(default=False)


class AudioEquipmentRisk(GenericProperty):
    pass

from django.db import models
from pods.models import User

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

# reduces the need for a bunch of basically identical columns
class ImageAlbum(models.Model):
    def default(self):
        return self.images.filter(default=True).first()

    def thumbnails(self):
        return self.images.filter(width__lt=100, length_lt=100)

    def __str__(self) -> str:
        risk_id = None
        risk_name = None
        try:
            if self.audio_equipment:
                risk_id = self.audio_equipment.id
                risk_name = "Audio Equipment"
        except:
            pass
        try:
            if self.cell_phone:
                risk_id = self.cell_phone.id
                risk_name = "Cell phone"
        except:
            pass
        return f"{self.images.count()} photos - Risk photo album for risk #{risk_id} {risk_name}"


class PropertyImage(models.Model):
    image = models.ImageField(upload_to="property_images", max_length=264)
    default = models.BooleanField(default=False)
    album = models.ForeignKey(
        ImageAlbum,
        related_name="images",
        on_delete=models.CASCADE,
    )

    owner = models.ForeignKey(
        User,
        related_name="risk_photos",
        null=True,
        blank=True,
        on_delete=models.CASCADE,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class GenericProperty(models.Model):
    make = models.CharField(max_length=128, null=True, blank=True)
    model = models.CharField(max_length=128, null=True, blank=True)
    condition = models.CharField(
        max_length=64, choices=CONDITION_CHOICES, null=True, blank=True
    )
    market_value = models.IntegerField(help_text="in cents", null=True, blank=True)

    # override if a model has more text fields
    def is_filled_out(self):
        return self.make and self.model and self.condition and self.market_value

    def __str__(self) -> str:
        return f"{self.make} {self.model} {self.condition} condition"

    class Meta:
        app_label = "policies"
        abstract = True


class PhoneRisk(GenericProperty):
    album = models.OneToOneField(
        ImageAlbum,
        blank=True,
        null=True,
        related_name="cell_phone",
        on_delete=models.SET_NULL,
    )
    has_screen_protector = models.BooleanField(default=False)
    has_case = models.BooleanField(default=False)

    def __str__(self) -> str:
        return super().__str__() + " Phone Risk"


class AudioEquipmentRisk(GenericProperty):
    album = models.OneToOneField(
        ImageAlbum,
        blank=True,
        null=True,
        related_name="audio_equipment",
        on_delete=models.SET_NULL,
    )

    def __str__(self) -> str:
        return f"Audio Equipment Risk #{self.id}"


def get_model_for_risk_type(risk_type):
    if risk_type == "cell_phone":
        return PhoneRisk
    elif risk_type == "audio_equipment":
        return AudioEquipmentRisk
    else:
        raise Exception("Risk type not found")

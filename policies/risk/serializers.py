from rest_framework.serializers import ModelSerializer, RelatedField

from policies.risk.models import (
    PhoneRisk,
    AudioEquipmentRisk,
    PropertyImage,
    ImageAlbum,
)


class ImageSerializer(ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = "__all__"
        read_only_fields = ["album"]


class AlbumSerializer(ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)

    class Meta:
        model = ImageAlbum
        fields = "__all__"


class AlbumField(RelatedField):
    def to_representation(self, value):
        return ImageSerializer(value.images, many=True).data


class PhoneRiskSerializer(ModelSerializer):
    album = AlbumField(read_only=True)

    class Meta:
        model = PhoneRisk
        fields = "__all__"


class AudioEquipmentRiskSerializer(ModelSerializer):
    class Meta:
        model = AudioEquipmentRisk
        fields = "__all__"


def get_serializer_for_risk_type(risk_type):
    if risk_type == "cell_phone":
        return PhoneRiskSerializer
    elif risk_type == "audio_equipment":
        return AudioEquipmentRiskSerializer
    raise ValueError(f"Risk type {risk_type} not supported")

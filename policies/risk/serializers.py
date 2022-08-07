from rest_framework.serializers import ModelSerializer

from policies.risk.models import PhoneRisk, AudioEquipmentRisk


class PhoneRiskSerializer(ModelSerializer):
    class Meta:
        model = PhoneRisk
        fields = "__all__"


class AudioEquipmentRiskSerializer(ModelSerializer):
    class Meta:
        model = AudioEquipmentRisk
        fields = "__all__"

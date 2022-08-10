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

def get_serializer_for_risk_type(risk_type):
    if risk_type == "cell_phone":
        return PhoneRiskSerializer
    elif risk_type == "audio_equipment":
        return AudioEquipmentRiskSerializer
    raise ValueError(f"Risk type {risk_type} not supported")
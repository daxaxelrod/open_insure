from policies.risk.models import PhoneRisk, AudioEquipmentRisk, PropertyImage

from policies.risk.serializers import PhoneRiskSerializer, AudioEquipmentRiskSerializer
from rest_framework.serializers import RelatedField, ModelSerializer


class RiskContentObjectRelatedField(RelatedField):
    """
    A custom field to use for the `content_object` generic relationship in the risk db model.
    """

    def to_representation(self, value):
        if isinstance(value, PhoneRisk):
            serializer = PhoneRiskSerializer(value)
        elif isinstance(value, AudioEquipmentRisk):
            serializer = AudioEquipmentRiskSerializer(value)
        else:
            raise Exception("Unexpected type of underlying risk asset")

        return serializer.data

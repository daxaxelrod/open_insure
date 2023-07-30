from pyexpat import model
from rest_framework.serializers import Serializer

from gatherer.models import PolicyLineProperty, PropertyLifeExpectancyGuess


class PolicyLinePropertySerializer(Serializer):
    class Meta:
        model = PolicyLineProperty
        fields = "__all__"


class PropertyLifeExpectancyGuessSerializer(Serializer):
    class Meta:
        model = PropertyLifeExpectancyGuess
        fields = "__all__"

from pyexpat import model
from rest_framework.serializers import ModelSerializer

from gatherer.models import PolicyLineProperty, PropertyLifeExpectancyGuess


class PolicyLinePropertySerializer(ModelSerializer):
    class Meta:
        model = PolicyLineProperty
        fields = "__all__"


class PropertyLifeExpectancyGuessSerializer(ModelSerializer):
    class Meta:
        model = PropertyLifeExpectancyGuess
        fields = "__all__"

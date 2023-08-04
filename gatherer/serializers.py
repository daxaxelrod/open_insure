from pyexpat import model
from rest_framework.serializers import ModelSerializer

from gatherer.models import (
    PolicyLineProperty,
    PropertyLifeExpectancyGuess,
    PropertyLifeLossGuess,
)


class PolicyLinePropertySerializer(ModelSerializer):
    class Meta:
        model = PolicyLineProperty
        fields = "__all__"


class PropertyLifeLossGuessSerializer(ModelSerializer):
    class Meta:
        model = PropertyLifeLossGuess
        exclude = ["guess"]


class PropertyLifeExpectancyGuessSerializer(ModelSerializer):
    losses = PropertyLifeLossGuessSerializer(many=True)

    def create(self, validated_data):
        losses = validated_data.pop("losses")
        user = validated_data.pop("user", None)  # passed in from view

        guess = None
        if user is not None and user.is_authenticated:
            guess = self.Meta.model.objects.create(**validated_data, guesser=user)
        else:
            guess = self.Meta.model.objects.create(**validated_data)

        losses_to_create = []
        for loss in losses:
            losses_to_create.append(PropertyLifeLossGuess(**loss, guess=guess))
        PropertyLifeLossGuess.objects.bulk_create(losses_to_create)

        return guess

    class Meta:
        model = PropertyLifeExpectancyGuess
        exclude = ["is_guessor_audited_authority"]

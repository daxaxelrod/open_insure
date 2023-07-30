from rest_framework.viewsets import ModelViewSet
from gatherer.models import PolicyLineProperty, PropertyLifeExpectancyGuess
from gatherer.serializers import (
    PolicyLinePropertySerializer,
    PropertyLifeExpectancyGuessSerializer,
)


class PolicyLinePropertyViewSet(ModelViewSet):
    serializer_class = PolicyLinePropertySerializer

    class Meta:
        model = PolicyLineProperty


class PropertyLifeExpectancyGuessViewSet(ModelViewSet):
    serializer_class = PropertyLifeExpectancyGuessSerializer

    class Meta:
        model = PropertyLifeExpectancyGuess

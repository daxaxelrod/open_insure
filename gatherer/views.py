from rest_framework.viewsets import ModelViewSet
from gatherer.models import PolicyLineProperty, PropertyLifeExpectancyGuess
from gatherer.serializers import (
    PolicyLinePropertySerializer,
    PropertyLifeExpectancyGuessSerializer,
)
from pods.utils.badges import award_badge


class PolicyLinePropertyViewSet(ModelViewSet):
    serializer_class = PolicyLinePropertySerializer

    class Meta:
        model = PolicyLineProperty


class PropertyLifeExpectancyGuessViewSet(ModelViewSet):
    serializer_class = PropertyLifeExpectancyGuessSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

        # award a badge if there is an attached user
        if self.request.user:
            award_badge(self.request.user, "Actuarial Contributor")

    class Meta:
        model = PropertyLifeExpectancyGuess

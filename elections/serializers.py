from rest_framework.serializers import ModelSerializer
from elections.models import Vote, Election
from rest_framework.exceptions import MethodNotAllowed

class VoteSerializer(ModelSerializer):
    def create(self, validated_data):
        request = self.context["request"]
        return super().create(**validated_data, voter=request.user)

    class Meta:
        model = Vote
        fields = "__all__"
        
class ElectionSerializer(ModelSerializer):
    class Meta:
        model = Election
        fields = "__all__"

    def create(self, validated_data):
        raise MethodNotAllowed("POST")
from rest_framework.serializers import ModelSerializer
from pods.models import Pod
from pods.utils.custom_serializers import FieldExcludableModelSerializer


class PublicMemberSerializer(ModelSerializer):
    class Meta:
        model = Pod
        fields = ['id', 'first_name', 'last_name', 'email', 'created_at', 'updated_at']

class PodSerializer(FieldExcludableModelSerializer):
    members = PublicMemberSerializer(many=True, read_only=True)

    class Meta:
        model = Pod
        fields = ('id', 'name', 'description', 'created_at', 'updated_at', 'creator', 'members')


# Private, more permissive
class UserSerializer(ModelSerializer):
    pods = PodSerializer(many=True, read_only=True, exclude=['members'])

    class Meta:
        model = Pod
        fields = "*"
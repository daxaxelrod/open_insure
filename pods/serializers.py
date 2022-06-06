from rest_framework.serializers import ModelSerializer
from pods.models import Pod, User
from pods.utils.custom_serializers import FieldExcludableModelSerializer


class PublicMemberSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'created_at',
                  'updated_at', 'picture', 'verified_email']

class PodSerializer(FieldExcludableModelSerializer):
    members = PublicMemberSerializer(many=True, read_only=True)

    def create(self, validated_data):
        return Pod.objects.create(
            **validated_data
        )

    class Meta:
        model = Pod
        fields = ['id', 'name', 'description', 'created_at', 'updated_at', 'creator', 'members']


# Private, more permissive
class UserSerializer(ModelSerializer):
    pods = PodSerializer(many=True, read_only=True, exclude=['members'])

    class Meta:
        model = User
        fields = [
            "username",
            "first_name",
            "last_name",
            "email",
            "picture",
            "created_at",
            "updated_at",
            "verified_email",
            "pods",
        ]
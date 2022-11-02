from rest_framework.serializers import (
    ModelSerializer,
    ValidationError,
    CharField,
    Serializer,
    EmailField,
)
from pods.models import Pod, User
from pods.utils.custom_serializers import FieldExcludableModelSerializer


class PublicMemberSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "created_at",
            "updated_at",
            "picture",
            "verified_email",
        ]


class PodSerializer(FieldExcludableModelSerializer):
    members = PublicMemberSerializer(many=True, read_only=True)

    def create(self, validated_data):
        return Pod.objects.create(**validated_data)

    class Meta:
        model = Pod
        fields = "__all__"


# Private, more permissive
class UserSerializer(ModelSerializer):
    pods = PodSerializer(many=True, read_only=True, exclude=["members"])
    password = CharField(write_only=True)

    def validate_email(self, value):
        lower_email = value.lower()
        if User.objects.filter(email__iexact=lower_email).exists():
            raise ValidationError("Email already exists. Try logging in.")
        return lower_email

    def create(self, validated_data):
        user = super().create(validated_data)
        user.set_password(validated_data["password"])
        user.save()
        return user

    def update(self, instance, validated_data):
        user = super().update(instance, validated_data)
        if "password" in validated_data:
            user.set_password(validated_data["password"])
            user.save()
        return user

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "password",
            "first_name",
            "last_name",
            "email",
            "picture",
            "created_at",
            "updated_at",
            "verified_email",
            "pods",
        ]


class InviteSerializer(Serializer):
    email = EmailField()

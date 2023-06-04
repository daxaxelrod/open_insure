from django.core.files.storage import FileSystemStorage
from django.conf import settings
from rest_framework.serializers import (
    ModelSerializer,
    ValidationError,
    CharField,
    Serializer,
    EmailField,
    ImageField,
    # SerializerMethodField,
    DateTimeField,
)
from pods.models import Pod, User, UserPod

from pods.utils.custom_serializers import FieldExcludableModelSerializer


class PodMembershipSerializer(ModelSerializer):
    joined_at = DateTimeField(source="created_at")

    class Meta:
        model = UserPod
        fields = [
            "id",
            "pod",
            "user",
            "risk_penalty",
            "is_user_friend_of_the_pod",
            "joined_at",  # alias for created_at
        ]


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
    memberships = PodMembershipSerializer(
        source="userpod_set", many=True, read_only=True
    )

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


class PatchableUserSerializer(ModelSerializer):

    profile_picture = ImageField(write_only=True, required=False)

    def update(self, instance, validated_data):
        if "profile_picture" in validated_data:
            picture_name = FileSystemStorage(
                location=settings.MEDIA_ROOT + "/profile_pictures"
            ).save(
                f"user_{instance.id}_" + validated_data["profile_picture"].name,
                validated_data["profile_picture"],
            )
            validated_data["picture"] = (
                settings.MEDIA_URL + "profile_pictures/" + picture_name
            )

        user = super().update(instance, validated_data)
        if "password" in validated_data:
            user.set_password(validated_data["password"])
            user.save()
        return user

    class Meta:
        model = User
        fields = ["first_name", "last_name", "email", "picture", "profile_picture"]
        read_only_fields = ["picture"]


class InviteSerializer(Serializer):
    email = EmailField()

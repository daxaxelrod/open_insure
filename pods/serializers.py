from django.utils import timezone
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
from pods.models import Pod, PodInvite, User, UserPod

from pods.utils.custom_serializers import FieldExcludableModelSerializer
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer as SimpleTokenObtainPairSerializer,
)


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
    invite_token = CharField(write_only=True, required=False)

    def validate_email(self, value):
        lower_email = value.lower()
        if User.objects.filter(email__iexact=lower_email).exists():
            raise ValidationError("Email already exists. Try logging in.")
        return lower_email

    def create(self, validated_data):
        invite_token = None
        if "invite_token" in validated_data:
            invite_token = validated_data.pop("invite_token")

        user = super().create(validated_data)
        user.set_password(validated_data["password"])
        user.save()

        if invite_token:
            try:
                invite = PodInvite.objects.get(token=invite_token, is_accepted=False)
                if invite.email.lower() != user.email.lower():
                    user.delete()
                    raise ValidationError("Invalid invite token")
                if invite.is_revoked:
                    user.delete()
                    raise ValidationError("Invite has been revoked")

                new_membership = UserPod.objects.create(
                    user=user,
                    pod=invite.pod,
                    is_user_friend_of_the_pod=True,
                )
                invite.membership = new_membership
                invite.is_accepted = True
                invite.accepted_at = timezone.now()
                invite.save()

            except PodInvite.DoesNotExist:
                user.delete()
                raise ValidationError("Invalid invite token")

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
            "invite_token",
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


class PodInviteSerializer(ModelSerializer):
    pod = PodSerializer(read_only=True, exclude=["memberships"])
    invitor = PatchableUserSerializer(read_only=True)

    class Meta:
        model = PodInvite
        fields = [
            "email",
            "pod",
            "invitor",
            "membership",
            "created_at",
            "is_accepted",
            "is_revoked_by_user",
            "is_revoked_by_pod",
            "is_revoked_by_admin",
            "is_revoked_by_system",
        ]


class TokenObtainPairSerializer(SimpleTokenObtainPairSerializer):
    default_error_messages = {
        "no_active_account": "Username or password is incorrect",
    }

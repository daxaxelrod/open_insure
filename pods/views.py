from email import policy
from django.conf import settings
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_403_FORBIDDEN,
    HTTP_200_OK,
    HTTP_400_BAD_REQUEST,
)
from pods.models import Pod, PodInvite, User
from pods.serializers import InviteSerializer, PodSerializer, UserSerializer
from policies.premiums import remove_future_premiums
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import EmailMultiAlternatives

from django.template.loader import render_to_string
from django.utils.html import strip_tags


class PodViewSet(ModelViewSet):
    queryset = Pod.objects.all()
    serializer_class = PodSerializer

    @action(detail=True, methods=["POST"])
    def join(self, request, **kwargs):
        pod = self.get_object()
        user = request.user
        if pod.has_policy():
            if (
                pod.policy.is_policy_active()
                and not pod.allow_joiners_after_policy_start
            ):
                return Response(
                    {
                        "message": "Policy is active and does not allow for new memebers after policy start"
                    },
                    status=HTTP_403_FORBIDDEN,
                )
        if pod.is_full():
            return Response({"message": "Pod is full"}, status=HTTP_403_FORBIDDEN)
        pod.members.add(user)
        spots_remaining = -1
        if pod.max_pod_size > 0:
            spots_remaining = pod.max_pod_size - pod.members.count()
        return Response(
            {
                **self.get_serializer_class()(pod).data,
                "spots_remaining": spots_remaining,
            },
            status=HTTP_201_CREATED,
        )

    # Leaving a pod should be allowed
    #   - gives people flexibility if they cant pay premiums anymore for example
    # Just conflicted on what to do with the already paid premiums
    # Its generally better for the herd to have policies that are active not have a ton of attition
    # So as of right now a policy 'keeps' (redistributes) the premiums already paid in.
    # We also dont allow for a user to be 'booted', just them who can leave.
    #   - Blocks bad acting admins from kicking everyone out and keeping premiums for themselves
    # Happy to hear other opinions on the matter
    @action(detail=True, methods=["POST"])
    def leave(self, request, **kwargs):
        pod = self.get_object()
        user = request.user
        remove_future_premiums(user, pod.policy)
        pod.members.remove(user)
        return Response(
            {"message": "You have left the pod. You no longer owe premiums"},
            status=HTTP_200_OK,
        )

    @action(detail=True, methods=["POST"])
    def invite(self, request, **kwargs):
        pod = self.get_object()
        user = request.user
        invite_serializer = InviteSerializer(data=request.data)
        invite = PodInvite.objects.create(
            pod=pod,
            invitor=user,
        )
        if not invite_serializer.is_valid():
            return Response(invite_serializer.errors, status=HTTP_400_BAD_REQUEST)
        if pod.is_full():
            return Response({"message": "Policy is full"}, status=HTTP_403_FORBIDDEN)

        formatted_available_underlying_insured_types = (
            pod.policy.get_available_underlying_insured_types_display()
        )
        subject = f"You're invited by {user.first_name} {user.last_name} to join {pod.policy.name}"
        invite_url = f"{settings.FRONTEND_URL}/join/?invite_token={invite.token}"
        if user.gender:
            if user.gender is "F":
                possessive_pronoun = "her"
            elif user.gender is "M":
                possessive_pronoun = "his"
            else:
                possessive_pronoun = "their"
        else:
            possessive_pronoun = "their"

        html_message = render_to_string(
            "invite_to_policy.html",
            {
                "invitor": user,
                "policy": pod.policy,
                "formatted_available_underlying_insured_types": formatted_available_underlying_insured_types,
                "invite_url": invite_url,
                "possessive_pronoun": possessive_pronoun,
            },
        )
        plain_message = strip_tags(html_message)
        from_email = "Open Insure <noreply@openinsure.io>"
        to = invite_serializer.validated_data["email"]

        message = EmailMultiAlternatives(
            subject,
            plain_message,
            to=[to],
            from_email=from_email,
            reply_to=[settings.ADMIN_EMAIL],
        )
        message.attach_alternative(html_message, "text/html")

        message.send()

        return Response({"message": "Your invite has been send!"}, status=HTTP_200_OK)


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    # Register
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user = User.objects.get(
            email=response.data["email"]
        )  # id not returned but email is unique
        refresh = RefreshToken.for_user(user)
        response.data["refresh"] = str(refresh)
        response.data["access"] = str(refresh.access_token)
        return response

    @action(detail=False, methods=["GET"])
    def me(self, request):
        return Response(
            self.get_serializer_class()(request.user).data, status=HTTP_200_OK
        )

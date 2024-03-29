from django.conf import settings
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.decorators import action
from rest_framework.status import (
    HTTP_403_FORBIDDEN,
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
)
from rest_framework.permissions import IsAuthenticated, AllowAny, SAFE_METHODS
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.views import APIView
from pods.models import Pod, PodInvite, User, WaitlistMember
from pods.reputation.reputation import determine_reputation_for_user
from pods.serializers import (
    InviteSerializer,
    PodSerializer,
    ReputationSerializer,
    UserSerializer,
    PatchableUserSerializer,
    PodInviteSerializer,
)
from policies.claims.serializers import ClaimSerializer, FullClaimApprovalSerializer
from policies.models import ClaimApproval, Policy
from policies.premiums import remove_future_premiums
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import EmailMultiAlternatives
from open_insure.admin.emails import send_notif_email_to_admins

from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.db.models import F

from policies.serializers import PolicySerializer


class PodViewSet(ModelViewSet):
    queryset = Pod.objects.all()
    serializer_class = PodSerializer

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
        if not invite_serializer.is_valid():
            return Response(invite_serializer.errors, status=HTTP_400_BAD_REQUEST)
        if pod.is_full():
            return Response({"message": "Policy is full"}, status=HTTP_403_FORBIDDEN)
        invite = PodInvite.objects.create(
            pod=pod, invitor=user, email=invite_serializer.validated_data["email"]
        )

        formatted_available_underlying_insured_types = (
            pod.policy.get_available_underlying_insured_types_display()
        )
        subject = f"You're invited by {user.first_name} {user.last_name} to join {pod.policy.name}"
        invite_url = f"{settings.FRONTEND_URL}/join/?invite_token={invite.token}"
        if user.gender:
            if user.gender == "F":
                possessive_pronoun = "her"
            elif user.gender == "M":
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
        from_email = "Open Insure <noreply@openinsure.app>"
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

    def get_permissions(self):
        if self.action == "create":
            return [AllowAny()]
        return super().get_permissions()

    # Register
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user = User.objects.get(
            email=response.data["email"]
        )  # id not returned but email is unique
        refresh = RefreshToken.for_user(user)
        response.data["refresh"] = str(refresh)
        response.data["access"] = str(refresh.access_token)
        if settings.NOTIFY_ADMINS_OF_EVENTS:
            send_notif_email_to_admins(
                title="New User",
                description=f"email: {user.email}, id: {user.id} Just signed up! You should welcome them",
            )
        return response

    def perform_create(self, serializer):
        # setup default picture
        serializer.save(
            picture="https://ui-avatars.com/api/?background=0D8ABC&color=fff&size=128&name="
            + serializer.validated_data["first_name"]
            + "+"
            + serializer.validated_data["last_name"]
        )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        policies = Policy.objects.filter(pod__members__in=[instance.id])
        serialized_policies = PolicySerializer(policies, many=True)
        # if the requestor is in the same policy as the user, mark the policy 'mutual'
        instance_pods = instance.pods.prefetch_related("members")
        if (
            instance_pods.filter(members__id=request.user.id).exists()
            and request.user.id != instance.id
        ):
            requestor_pods = [
                item["id"]
                for item in instance_pods.filter(members__id=request.user.id).values(
                    "id"
                )
            ]
            for policy in serialized_policies.data:
                # mark the policy as mutual if the requestor is in the same policy as the user
                if policy["pod"] in requestor_pods:
                    policy["mutual"] = True

        claim_approvals = ClaimApproval.objects.filter(approver=instance)
        claim_approvals_serializer = FullClaimApprovalSerializer(
            claim_approvals, many=True
        )

        all_premiums = instance.premiums_paid.all()
        total_payments = all_premiums.filter(paid=True)
        on_time_premiums = total_payments.filter(
            paid=True, paid_date__lte=F("due_date")
        )

        claims = instance.claims.all()
        claims_serializer = ClaimSerializer(claims, many=True)

        return Response(
            {
                **serializer.data,
                "policies": serialized_policies.data,
                "claim_approvals": claim_approvals_serializer.data,
                "on_time_premiums": on_time_premiums.count(),
                "total_payments": total_payments.count(),
                "total_premiums_scheduled": all_premiums.count(),
                "claims": claims_serializer.data,
            }
        )

    @action(detail=True, methods=["GET"])
    def reputation(self, request, **kwargs):
        user = self.get_object()
        reputation = determine_reputation_for_user(user)
        return Response(ReputationSerializer(reputation).data, status=HTTP_200_OK)
    


class SelfView(RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in SAFE_METHODS:
            return UserSerializer
        return PatchableUserSerializer

    def get_object(self):
        return self.request.user


class PodInviteRetrieveUpdateView(RetrieveUpdateAPIView):
    permission_classes = [AllowAny]
    serializer_class = PodInviteSerializer

    def get_object(self):
        try:
            return PodInvite.objects.get(token=self.kwargs["token"], is_accepted=False)
        except PodInvite.DoesNotExist:
            raise NotFound(detail="Invite not found")


class WaitlistView(APIView):
    serializer_class = InviteSerializer

    def post(self, request, format=None):
        serializer = InviteSerializer(data=request.data)
        if serializer.is_valid():
            WaitlistMember.objects.create(email=serializer.validated_data["email"])
            if settings.NOTIFY_ADMINS_OF_EVENTS:
                send_notif_email_to_admins(
                    title="New waitlist member",
                    description=f"{serializer.validated_data['email']} joined the waitlist! Go say hello",
                )
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

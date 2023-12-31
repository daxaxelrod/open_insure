from django.shortcuts import redirect
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_400_BAD_REQUEST,
)
from rest_framework.views import APIView
from rest_framework.response import Response
from open_insure.admin.emails import send_notif_email_to_admins
from rest_framework.permissions import IsAdminUser
from django.utils import timezone
from django.contrib import messages


from pods.models import ReputationAudit
from pods.reputation.emails import notify_user_that_audit_is_complete


class ReputationAuditView(APIView):

    def post(self, request, pk):
        user = request.user
        if pk != user.id:
            return Response({"message": "You can only request a reputation audit for yourself"}, status=HTTP_400_BAD_REQUEST)
        latest_reputation = user.reputation_results.latest("created_at")

        reputation_audit, created = ReputationAudit.objects.get_or_create(
            user=user, latest_reputation=latest_reputation
        )

        send_notif_email_to_admins(
            title=f"{user.email} Reputation audit requested {'(again)' if created else ''}",
            description=f"""{user.email} requested a reputation audit. you can review it at <a href='{
                request.build_absolute_uri('/admin/pods/reputationaudit/')
            }'>/admin/pods/reputationaudit/</a>""",
        )
        payload = {
            "message": "Your request has been sent. You will be notified when the audit is complete.",
            "status": "success",
        }

        return Response(payload, status=HTTP_200_OK)


class AdminReputationAuditView(APIView):

    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        admin_user = request.user
        reputation_audit = ReputationAudit.objects.get(pk=pk)
        reputation_audit.performed_by = admin_user
        reputation_audit.performed_on = timezone.now()

        reputation_audit.save()

        notify_user_that_audit_is_complete(
            reputation_audit.user, reputation_audit)

        payload = {
            "message": "Reputation audit marked as complete",
            "status": "success",
        }
        messages.add_message(request, messages.SUCCESS,
                             "Reputation audit marked as complete")

        return redirect(request.META.get('HTTP_REFERER', '/admin/pods/reputationaudit/'))

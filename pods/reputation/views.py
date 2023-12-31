from rest_framework.status import (
    HTTP_200_OK,
    HTTP_400_BAD_REQUEST,
)
from rest_framework.views import APIView
from rest_framework.response import Response
from open_insure.admin.emails import send_notif_email_to_admins

from pods.models import ReputationAudit


class ReputationAuditView(APIView):

    def post(self, request, pk):
        user = request.user
        if pk != user.id:
            return Response({"message": "You can only request a reputation audit for yourself"}, status=HTTP_400_BAD_REQUEST)
        latest_reputation = user.reputation_results.latest("created_at")
        ReputationAudit.objects.create(user=user, current_reputation=latest_reputation)

        send_notif_email_to_admins(
            title=f"{user.email} Reputation audit requested",
            description=f"""{user.email} requested a reputation audit. you can review it at <a href='{
                request.build_absolute_uri('/admin/pods/reputationaudit/')
            }'>/admin/pods/reputationaudit/</a>""",
        )
        payload = {
            "message": "Reputation audit requested",
            "status": "success",
        }
        
        return Response(payload, status=HTTP_200_OK)
import logging

from pods.models import ReputationAudit, User


from django.core.mail import EmailMultiAlternatives
from django.conf import settings


from django.template.loader import render_to_string
from django.utils.html import strip_tags


logger = logging.getLogger(__name__)


def notify_user_that_audit_is_complete(
    user: User, audit: ReputationAudit
):
    profile_url = f"{settings.FRONTEND_URL}/members/{user.id}/"
    html_message = render_to_string(
        "reputation/audit_completion_notification.html",
        {
            "user": user,
            "audit": audit,
            "profile_url": profile_url,
        },
    )
    plain_message = strip_tags(html_message)
    from_email = "Open Insure <noreply@openinsure.app>"
    to = user.email
    subject = f"Audit Completed"

    message = EmailMultiAlternatives(
        subject,
        plain_message,
        to=[to],
        from_email=from_email,
        reply_to=[settings.ADMIN_EMAIL],
    )
    message.attach_alternative(html_message, "text/html")

    message.send()

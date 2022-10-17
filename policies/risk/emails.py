import logging

from pods.models import User
from policies.models import Policy, PolicyRiskSettings

from django.core.mail import EmailMultiAlternatives
from django.conf import settings


from django.template.loader import render_to_string
from django.utils.html import strip_tags

def send_risk_update_email(user: User, policy: Policy, changer: User, old_risk: PolicyRiskSettings, new_risk: PolicyRiskSettings):
    try:
        policy_link = f"{settings.FRONTEND_URL}/policy/{policy.id}"

        html_message = render_to_string(
            "policy_risk_settings_notification.html",
            {
                "policy_link": policy_link,
                "old_risk": old_risk,
                "new_risk": new_risk,
                "changer": changer,
            },
        )
        plain_message = strip_tags(html_message)
        from_email = "Open Insure <noreply@openinsure.io>"
        to = user.email
        subject = f"{changer.first_name} made changes to {policy.name}!"

        message = EmailMultiAlternatives(
            subject,
            plain_message,
            to=[to],
            from_email=from_email,
            reply_to=[settings.ADMIN_EMAIL],
        )
        message.attach_alternative(html_message, "text/html")

        message.send()
    except Exception as e:
        logger.warning(f"Failed to send welcome email to {user.email}: {e}")

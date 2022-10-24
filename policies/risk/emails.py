import logging

from pods.models import User
from policies.models import Policy, PolicyRiskSettings, Premium

from django.core.mail import EmailMultiAlternatives
from django.conf import settings


from django.template.loader import render_to_string
from django.utils.html import strip_tags

logger = logging.getLogger(__name__)

def send_risk_update_email(user: User, policy: Policy, changer: User, old_risk: PolicyRiskSettings, new_risk: PolicyRiskSettings):
    try:
        policy_link = f"{settings.FRONTEND_URL}/policy/{policy.id}"

        html_message = render_to_string(
            "policy_risk_settings_notification.html",
            {
                "policy_link": policy_link,
                "old_risk": old_risk,
                "new_premium": new_risk.premium_amount / 100,
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

def send_unpaid_premium_due_soon(premium: Premium):
    user = premium.payer
    policy = premium.policy
    policy_link = f"{settings.FRONTEND_URL}/policy/{policy.id}"
    
    escrow_agent = policy.escrow_manager
    if escrow_agent:
        escrow_agent_name = f"{escrow_agent.first_name} {escrow_agent.last_name}"
    else:
        escrow_agent_name = "the user responsible for managing your policy's premiums"

    html_message = render_to_string(
            "unpaid_premium_due_soon.html",
            {
                "policy_name": policy.name,
                "premium_amount": premium.amount,
                "premium_due_date": premium.due_date.strftime("%A, %B %d, %Y"),
                "escrow_agent": escrow_agent_name,
                "policy_link": policy_link
            },
    )
    plain_message = strip_tags(html_message)
    from_email = "Open Insure <noreply@openinsure.io>"
    to = user.email
    subject = f"${premium.amount} is due!"

    message = EmailMultiAlternatives(
        subject,
        plain_message,
        to=[to],
        from_email=from_email,
        reply_to=[settings.ADMIN_EMAIL],
    )
    message.attach_alternative(html_message, "text/html")

    message.send()

def send_unpaid_premium_should_have_been_marked_paid(premium: Premium):
    user = premium.payer
    pass

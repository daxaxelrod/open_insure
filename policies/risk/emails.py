import logging

from pods.models import User
from policies.models import Policy, PolicyRiskSettings, Premium

from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.utils import timezone


from django.template.loader import render_to_string
from django.utils.html import strip_tags

logger = logging.getLogger(__name__)


def send_risk_update_email(
    user: User,
    policy: Policy,
    changer: User,
    old_risk: PolicyRiskSettings,
    new_risk: PolicyRiskSettings,
):
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
        from_email = "Open Insure <noreply@openinsure.app>"
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


def get_escrow_agent_related_info(user, policy):
    escrow_agent = policy.escrow_manager

    if escrow_agent:
        is_user_the_escrow_agent = user.id == escrow_agent.id
        if is_user_the_escrow_agent:
            escrow_agent_name = "you (You're the escrow agent!)"
            reply_to_array = []
        else:
            escrow_agent_name = f"{escrow_agent.first_name} {escrow_agent.last_name}"
            reply_to_array = [escrow_agent.email]
    else:
        escrow_agent_name = "the user responsible for managing your policy's premiums"
        reply_to_array = (
            policy.pod.members.all().exclude(id=user.id).values_list("email", flat=True)
        )

    return escrow_agent_name, reply_to_array


def send_unpaid_premium_due_soon(premium: Premium):
    user = premium.payer
    policy = premium.policy
    policy_link = f"{settings.FRONTEND_URL}/policy/{policy.id}"

    escrow_agent_name, reply_to_array = get_escrow_agent_related_info(user, policy)

    premium_due = premium.amount / 100

    html_message = render_to_string(
        "premiums/unpaid_premium_due_soon.html",
        {
            "policy_name": policy.name,
            "premium_amount": premium_due,
            "premium_due_date": premium.due_date.strftime("%A, %B %d, %Y"),
            "escrow_agent": escrow_agent_name,
            "policy_link": policy_link,
        },
    )
    plain_message = strip_tags(html_message)
    from_email = "Open Insure <noreply@openinsure.app>"
    to = user.email
    subject = f"${premium_due} is due today!"

    message = EmailMultiAlternatives(
        subject,
        plain_message,
        to=[to],
        from_email=from_email,
        reply_to=[settings.ADMIN_EMAIL, *reply_to_array],
    )
    message.attach_alternative(html_message, "text/html")

    message.send()


# Think "I paid the premium but the escrow agent hasn't marked it as paid yet"
# Or also "Oh shit I havent paid yet"
def send_unpaid_premium_should_have_been_marked_paid(premium: Premium):
    user = premium.payer
    policy = premium.policy
    policy_link = f"{settings.FRONTEND_URL}/policy/{policy.id}"

    escrow_agent_name, reply_to_array = get_escrow_agent_related_info(user, policy)

    premium_due = premium.amount / 100

    logger.info(premium.due_date)

    html_message = render_to_string(
        "premiums/unpaid_premium_past_due_and_not_marked_paid.html",
        {
            "policy_name": policy.name,
            "premium_amount": premium_due,
            "premium_due_date_raw": premium.due_date,
            "escrow_agent": escrow_agent_name,
            "policy_link": policy_link,
        },
    )

    plain_message = strip_tags(html_message)
    from_email = "Open Insure <noreply@openinsure.app>"
    to = user.email
    subject = f"You risk losing coverage"

    message = EmailMultiAlternatives(
        subject,
        plain_message,
        to=[to],
        from_email=from_email,
        reply_to=[settings.ADMIN_EMAIL, *reply_to_array],
    )
    message.attach_alternative(html_message, "text/html")

    message.send()


def send_unpaid_premiums_report_to_escrow_agent(
    escrow_agent: User, premiums: list[Premium]
):
    html_message = render_to_string(
        "premiums/unpaid_premiums_report_to_escrow_agent.html",
        {
            "unpaid_premiums": premiums,
            "escrow_agent": escrow_agent,
            "policy": premiums[0].policy,
        },
    )
    plain_message = strip_tags(html_message)
    from_email = "Open Insure <noreply@openinsure.app>"
    to = escrow_agent.email
    subject = f"Unpaid premiums report for {premiums[0].policy.name}"

    message = EmailMultiAlternatives(
        subject,
        plain_message,
        to=[to],
        from_email=from_email,
        reply_to=[settings.ADMIN_EMAIL],
    )
    message.attach_alternative(html_message, "text/html")

    message.send()

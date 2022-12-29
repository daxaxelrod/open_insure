import random
import string
import logging

from pods.models import User
from policies.models import Policy
from django.core.mail import EmailMultiAlternatives
from django.conf import settings

from django.template.loader import render_to_string
from django.utils.html import strip_tags

from open_insure.admin.emails import send_notif_email_to_admins

uuid_regex = "[a-f0-9]{8}-?[a-f0-9]{4}-?4[a-f0-9]{3}-?[89ab][a-f0-9]{3}-?[a-f0-9]{12}"
hash_regex = "[0-9a-f]{64}"

logger = logging.getLogger(__name__)


def email_present(email):
    if User.objects.filter(email=email).exists():
        return True
    return False


def random_string_generator(size, chars=string.ascii_lowercase + string.digits):
    return "".join(random.choice(chars) for _ in range(size))


def unique_code_generator(instance, attr, size=16, klass=None):
    # attr is the instances's key that we are saving the code
    # allows for the lookup check
    key = random_string_generator(size)
    if klass is not None:  # allow for the user to just pass in the class reference
        Klass = klass
    else:
        Klass = instance.__class__
    qs_exists = Klass.objects.filter(**{attr: key}).exists()
    if qs_exists:
        return unique_code_generator(instance)
    return key


def send_user_welcome_email(user: User, policy: Policy):
    try:
        policy_link = f"{settings.FRONTEND_URL}/policy/{policy.id}"

        user_risk = user.risks.get(policy=policy)
        coverage_start_date = policy.coverage_start_date.strftime("%A, %B %d, %Y")

        html_message = render_to_string(
            "join_policy_welcome_email.html",
            {
                "user": user,
                "policy_link": policy_link,
                "asset_type": user_risk.content_object.model,
                "coverage_start_date": coverage_start_date,
                "escrow_address": policy.pool_address,
                "premium_amount": user_risk.premium_amount / 100,
                "policy": policy,
                "perils": policy.perils.all(),
            },
        )
        plain_message = strip_tags(html_message)
        from_email = "Open Insure <noreply@openinsure.app>"
        to = user.email
        subject = f"Welcome to {policy.name}!"

        message = EmailMultiAlternatives(
            subject,
            plain_message,
            to=[to],
            from_email=from_email,
            reply_to=[settings.ADMIN_EMAIL],
        )
        message.attach_alternative(html_message, "text/html")

        message.send()

        if settings.NOTIFY_ADMINS_OF_EVENTS:
            send_notif_email_to_admins(title="new user joined policy", description=f"User {user.email} joined {policy.name}!")

    except Exception as e:
        logger.warning(f"Failed to send welcome email to {user.email}: {e}")

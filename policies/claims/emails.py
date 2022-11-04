import logging
from typing import List

from django.conf import settings
from django.utils import timezone

from django.core.mail import EmailMultiAlternatives

from django.template.loader import render_to_string
from django.utils.html import strip_tags

from pods.models import User
from policies.models import Claim

logger = logging.getLogger(__name__)

def send_notification_of_new_claim_vote(claim: Claim, pod_members_except_claimant: List[User]):
    policy = claim.policy
    claimant = claim.claimant
    vote_due_date = claim.created_at + timezone.timedelta(days=policy.claim_approval_vote_due_number_of_days)
    for member in pod_members_except_claimant:
        logger.info(f"Sending notification to {member.id} of new claim vote")
        try:
            claim_link = f"{settings.FRONTEND_URL}/policy/{policy.id}/claims/{claim.id}"

            html_message = render_to_string(
                "policy_claim_is_now_ready_to_vote_on.html",
                {
                    "claim_link": claim_link,
                    "claimant": claimant,
                    "policy": policy,
                    "due_date": vote_due_date,
                },
            )
            plain_message = strip_tags(html_message)
            from_email = "Open Insure <noreply@openinsure.io>"
            to = member.email
            subject = f"Action Required: New claim against {policy.name}!"

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
            logger.warning(f"Failed to send vote notification to {member.email}: {e}")

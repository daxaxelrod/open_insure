from datetime import datetime
import logging
from typing import List

from django.utils import timezone
from pods.models import User
from policies.models import Policy, Premium, Risk
from dateutil.relativedelta import relativedelta
from escrow.apps import agent

logger = logging.getLogger(__name__)


def get_premium_job_id(premium, user, policy):
    return "premium_{premium.id}_user_{user.id}_policy_{policy.id}_job"


def schedule_premiums(policy: Policy, for_users: List[User] = None):
    # schedules all the premiums due for the policy
    if for_users and len(for_users) > 0:
        users = for_users
    else:
        users = policy.pod.members.all()
    # actually maybe we dont need an actual scheduler, we just specify due dates on the premiums

    premiums = Premium.objects.filter(policy=policy, payer__in=users)
    if len(premiums) > 0:
        logger.info(
            f"Premiums already scheduled for policy {policy.id}",
        )
        return

    premium_frequency = policy.premium_payment_frequency  # num months between payments
    for user in users:
        try:
            user_risk: Risk = user.risks.get(policy=policy)
        except Risk.DoesNotExist:
            logger.error(
                f"User {user.id} has no risk for policy {policy.id}. This should not happen."
            )
            continue
        except Risk.MultipleObjectsReturned:
            logger.error(
                f"User {user.id} has multiple risks for policy {policy.id}. This should not happen."
            )
            user_risk = user.risks.filter(policy=policy)[0]
            continue

        premiums_schedule = [
            Premium(
                policy=policy,
                payer=user,
                amount=user_risk.premium_amount,
                due_date=policy.coverage_start_date
                + relativedelta(months=premium_frequency * i),
            )
            for i in range(int(policy.coverage_duration / premium_frequency))
        ]

        premiums = Premium.objects.bulk_create(premiums_schedule)

        logger.info(
            f"Created premiums {len(premiums)} for policy {policy.id} for user {user.id}"
        )


# useful for when a user leaves a policy but we want to keep a record of the premiums they paid/didnt pay
def remove_future_premiums(user: User, policy: Policy):
    now = timezone.now()
    premiums = Premium.objects.filter(policy=policy, payer=user, due_date__gt=now)
    return premiums.delete()


# used for renewals
def extend_premiums(policy: Policy, user: User):
    premiums = Premium.objects.filter(policy=policy, payer=user).order_by("due_date")
    last_premium = premiums.last()
    number_of_missing_premiums = policy.coverage_duration - len(premiums)
    for month_num in range(number_of_missing_premiums):
        p = Premium.objects.create(
            policy=policy,
            payer=user,
            amount=last_premium.amount,  # maybe premiums should change in the new segment?
            due_date=last_premium.due_date + relativedelta(months=month_num + 1),
        )
        logger.info(
            f"Created premium for policy extension {p.due_date} for user {user.id}"
        )

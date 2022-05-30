from datetime import datetime
import logging

from django.utils import timezone
from policies.models import Policy, Premium
from dateutil.relativedelta import relativedelta
from escrow.apps import agent

logger = logging.getLogger(__name__)

def get_premium_job_id(premium, user, policy):
    return "premium_{premium.id}_user_{user.id}_policy_{policy.id}_job"


def schedule_premiums(policy: Policy):
    # schedules all the premiums due for the policy
    
    # actually maybe we dont need an actual scheduler, we just specify due dates on the premiums
    
    premiums = Premium.objects.filter(policy=policy)
    if len(premiums) > 0:
        logger.info(f"Premiums already scheduled for policy {policy.id}", )
        return

    premium_frequency = policy.premium_payment_frequency # num months between payments
    for user in policy.pod.members.all():
        premiums_schedule = [
            Premium(policy=policy, 
                    payer=user, 
                    amount=policy.premium_amount, 
                    due_date=policy.coverage_start_date + relativedelta(months=premium_frequency * i))
            for i in range(int(policy.coverage_duration / premium_frequency))
        ]
        
        premiums = Premium.objects.bulk_create(premiums_schedule)

        logger.info(f"Created premiums {len(premiums)} for policy {policy.id} for user {user.id}")
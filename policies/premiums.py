from datetime import datetime
import logging

from django.utils import timezone
from policies.models import Policy, Premium
from dateutil.relativedelta import relativedelta
from policies.apps import scheduler
from escrow.apps import agent

logger = logging.getLogger(__name__)

def map_premium_frequency_to_months(premium_frequency):
    # based on PREMIUM_PAYMENT_FREQUENCY_CHOICES
    if premium_frequency == 0:
        return 12 # month per interval
    elif premium_frequency == 1:
        return 1
    elif premium_frequency == 2:
        return 3

def get_premium_job_id(premium, user, policy):
    return "premium_{premium.id}_user_{user.id}_policy_{policy.id}_job"


def schedule_premiums(policy: Policy):
    # schedules all the premiums due for the policy
    
    # actually maybe we dont need an actual scheduler, we just specify due dates on the premiums

    if not scheduler:
        logger.info("Scheduler not initialized, skipping premium scheduling")
        return
    
    premiums = Premium.objects.filter(policy=policy)
    if len(premiums) > 0:
        logger.info(f"Premiums already scheduled for policy ${policy.id}", )
        return

    adjustment = map_premium_frequency_to_months(policy.premium_frequency)
    for user in policy.pod.members.all():
        premiums_schedule = [
            Premium(policy=policy, 
                    payer=user, 
                    amount=policy.premium_amount, 
                    due_date=policy.coverage_start_date + relativedelta(months=adjustment * i))
            for i in range(policy.coverage_duration / adjustment)
        ]
        
        Premium.objects.bulk_create(premiums_schedule)

        
        # scheduler.add_job(charge_premium, 
        #     'date',
        #     args=[premium],
        #     run_date=run_date,
        #     id=get_premium_job_id(premium, user, policy)
        # )
        # logger.info(f"Scheduled premium for policy ${policy.id} for user ${user.id} for ")
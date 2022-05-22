from asyncio.log import logger
import logging
from policies.models import Policy, Premium
from policies.apps import scheduler

logger = logging.getLogger(__name__)

def schedule_premiums(policy: Policy):
    # schedules all the premiums due for the policy
    # only meant to be run once

    if not scheduler:
        logger.info("Scheduler not initialized, skipping premium scheduling")
        return
    
    premiums = Premium.objects.filter(policy=policy)
    if len(premiums) > 0:
        logger.info(f"Premiums already scheduled for policy ${policy.id}", )
        return

    
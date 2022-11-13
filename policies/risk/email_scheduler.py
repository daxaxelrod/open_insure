import logging
from apscheduler.schedulers.background import BackgroundScheduler
from django.utils import timezone
from apscheduler.triggers.cron import CronTrigger
from policies.models import Premium

from policies.risk.emails import send_unpaid_premium_due_soon, send_unpaid_premium_should_have_been_marked_paid

logger = logging.getLogger(__name__)

def unpaid_premiums_due_soon_job():
    print("Running job to send premium due soon emails")
    now = timezone.now()
    # get all the unpaid premiums due withing 24 hours.
    # NOTE! This needs to have a second look once I do timezone aware policies
    # this just assumes that policy holders are in the same timezone as the server
    unpaid_premiums = Premium.objects.filter(due_date=now.date(), paid=False).prefetch_related("payer")
    logger.info(f"Found {len(unpaid_premiums)} unpaid premiums due today, sending notifications")
    for unpaid_premium in unpaid_premiums:
        send_unpaid_premium_due_soon(unpaid_premium)


# special shout out to M who sparked this and many other great ideas
def unpaid_premiums_should_have_been_marked_as_paid_job():
    print("Running job to send premium should have been marked as paid emails")
    now = timezone.now()
    three_days_ago = now - timezone.timedelta(days=3)
    # see note for unpaid_premiums... note
    premiums_that_should_have_been_marked_paid = Premium.objects.filter(due_date=three_days_ago.date(), paid=False) 
    logger.info(f"Found {len(premiums_that_should_have_been_marked_paid)} premiums that should have been marked as paid, sending notifications")
    for premium in premiums_that_should_have_been_marked_paid:
        send_unpaid_premium_should_have_been_marked_paid(premium)

def schedule_email_premium_notification_emails(scheduler: BackgroundScheduler):
    logger.info("Setting up premium email scheduling")
    scheduler.add_job(unpaid_premiums_due_soon_job, CronTrigger.from_crontab('0 18 * * *'), replace_existing=True, id="unpaid_premiums_due_soon")
    scheduler.add_job(unpaid_premiums_should_have_been_marked_as_paid_job, CronTrigger.from_crontab('0 18 * * *'), replace_existing=True, id="unpaid_premiums_should_have_been_marked_as_paid")
    
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.schedulers.base import BaseScheduler
from django_apscheduler.jobstores import DjangoJobStore


def create_scheduler() -> BaseScheduler:
    scheduler = BackgroundScheduler(
        jobstores={"default": DjangoJobStore()}, timezone="America/New_York"
    )
    scheduler.start()
    return scheduler

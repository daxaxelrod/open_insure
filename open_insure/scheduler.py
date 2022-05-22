from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore

def create_scheduler():
    scheduler = BackgroundScheduler(jobstores={'default': DjangoJobStore()})
    scheduler.start()
    return scheduler
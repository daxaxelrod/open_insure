import os
from django.apps import AppConfig
from django.conf import settings


scheduler = None


class PoliciesConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "policies"

    def ready(self) -> None:
        import policies.signals
        import policies.risk.signals
        from policies.risk.email_scheduler import (
            schedule_email_premium_notification_emails,
        )

        # setup scheduler
        if settings.IS_MAIN_SCHEDULER:
            from open_insure.scheduler import create_scheduler

            scheduler = create_scheduler()
            schedule_email_premium_notification_emails(scheduler)

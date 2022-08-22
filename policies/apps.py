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

        # setup scheduler
        if os.environ.get("RUN_MAIN") and settings.IS_MAIN_SCHEDULER:
            from open_insure.scheduler import create_scheduler

            scheduler = create_scheduler()

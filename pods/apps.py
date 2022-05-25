from django.apps import AppConfig


class PodsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'pods'

    def ready(self):
        from pods import signals

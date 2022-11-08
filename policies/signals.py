from django.db.models.signals import post_save
from django.utils import timezone
from django.dispatch import receiver
from policies.models import Policy, PolicyRiskSettings
from policies.utils import unique_code_generator


@receiver(post_save, sender=Policy)
def create_policy(sender, instance, created, **kwargs):
    if created:
        PolicyRiskSettings.objects.create(policy=instance)
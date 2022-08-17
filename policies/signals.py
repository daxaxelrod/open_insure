from django.db.models.signals import post_save
from django.dispatch import receiver
from policies.models import Policy, PolicyRiskSettings
from policies.utils import unique_code_generator
 
 
@receiver(post_save, sender=Policy)
def create_policy(sender, instance, created, **kwargs):
    if created and instance.pool_address is None:
        instance.pool_address = unique_code_generator(instance, "pool_address")
        PolicyRiskSettings.objects.create(policy=instance)
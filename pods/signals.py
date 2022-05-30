from django.db.models.signals import post_save
from django.dispatch import receiver
from pods.models import Pod

 
@receiver(post_save, sender=Pod)
def create_pod(sender, instance, created, **kwargs):
    if created and instance.creator is not None:
        instance.members.add(instance.creator)
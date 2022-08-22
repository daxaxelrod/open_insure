from django.db.models.signals import post_save
from django.dispatch import receiver
from policies.risk.models import ImageAlbum, PhoneRisk, AudioEquipmentRisk


def attach_empty_album(instance):
    if instance.album is None:
        album = ImageAlbum.objects.create()
        instance.album = album
        instance.save()


@receiver(post_save, sender=PhoneRisk)
def create_album(sender, instance, created, **kwargs):
    if created:
        attach_empty_album(instance)


@receiver(post_save, sender=AudioEquipmentRisk)
def create_album(sender, instance, created, **kwargs):
    if created:
        attach_empty_album(instance)

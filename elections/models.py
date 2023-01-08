from django.db import models
from pods.models import Pod, User
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey


class ElectionResult(models.Model):
    first_past_the_post_date = models.DateTimeField(null=True, blank=True)
    outcome = models.BooleanField(null=True, blank=True)

class Election(models.Model):
    name = models.CharField(max_length=255)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(null=True, blank=True)
    pod = models.ForeignKey(Pod, on_delete=models.CASCADE)
    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    result = models.ForeignKey(ElectionResult, on_delete=models.CASCADE, null=True, blank=True)

    object_id = models.PositiveIntegerField(null=True, blank=True)
    content_object = GenericForeignKey()


class Vote(models.Model):
    election = models.ForeignKey(Election, on_delete=models.CASCADE)
    voter = models.ForeignKey(User, on_delete=models.CASCADE, related_name="voter")
    affirmed = models.BooleanField(null=True, blank=True)
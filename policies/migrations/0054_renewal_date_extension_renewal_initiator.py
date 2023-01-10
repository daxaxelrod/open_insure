# Generated by Django 4.1.3 on 2023-01-10 04:21

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("policies", "0053_renewal"),
    ]

    operations = [
        migrations.AddField(
            model_name="renewal",
            name="date_extension",
            field=models.DateField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="renewal",
            name="initiator",
            field=models.ForeignKey(
                default=1,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="created_renewals",
                to=settings.AUTH_USER_MODEL,
            ),
            preserve_default=False,
        ),
    ]

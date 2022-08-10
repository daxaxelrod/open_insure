# Generated by Django 4.1a1 on 2022-08-01 04:11

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("pods", "0009_alter_pod_creator"),
    ]

    operations = [
        migrations.AddField(
            model_name="userpod",
            name="is_user_friend_of_the_pod",
            field=models.BooleanField(default=False),
        ),
        migrations.CreateModel(
            name="PodInvite",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("email", models.EmailField(max_length=254)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("is_accepted", models.BooleanField(default=False)),
                ("is_revoked_by_user", models.BooleanField(default=False)),
                ("is_revoked_by_pod", models.BooleanField(default=False)),
                ("is_revoked_by_admin", models.BooleanField(default=False)),
                ("is_revoked_by_system", models.BooleanField(default=False)),
                (
                    "invitor",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="pod_invites_sent",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "membership",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="pod_invites",
                        to="pods.userpod",
                    ),
                ),
                (
                    "pod",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="pods.pod"
                    ),
                ),
            ],
        ),
    ]
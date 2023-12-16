# Generated by Django 4.2.6 on 2023-12-16 21:42

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("pods", "0024_alter_reputationdetails_user"),
    ]

    operations = [
        migrations.CreateModel(
            name="RegionInfo",
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
                ("city", models.CharField(max_length=100)),
                ("state", models.CharField(max_length=100)),
                ("country", models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name="Interest",
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
                (
                    "institution_name",
                    models.CharField(blank=True, max_length=255, null=True),
                ),
                ("linkedin_url", models.URLField(blank=True, null=True)),
                ("website", models.URLField(blank=True, null=True)),
                ("industry", models.CharField(blank=True, max_length=255, null=True)),
                ("type", models.CharField(blank=True, max_length=255, null=True)),
                (
                    "headquarters",
                    models.CharField(blank=True, max_length=255, null=True),
                ),
                ("company_size", models.IntegerField(blank=True, null=True)),
                ("founded", models.IntegerField(blank=True, null=True)),
                ("title", models.CharField(blank=True, max_length=255, null=True)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="interests",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="Experience",
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
                (
                    "institution_name",
                    models.CharField(blank=True, max_length=255, null=True),
                ),
                ("linkedin_url", models.URLField(blank=True, null=True)),
                ("website", models.URLField(blank=True, null=True)),
                ("industry", models.CharField(blank=True, max_length=255, null=True)),
                ("type", models.CharField(blank=True, max_length=255, null=True)),
                (
                    "headquarters",
                    models.CharField(blank=True, max_length=255, null=True),
                ),
                ("company_size", models.IntegerField(blank=True, null=True)),
                ("founded", models.IntegerField(blank=True, null=True)),
                ("from_date", models.DateField(blank=True, null=True)),
                ("to_date", models.DateField(blank=True, null=True)),
                ("description", models.TextField(blank=True, null=True)),
                (
                    "position_title",
                    models.CharField(blank=True, max_length=255, null=True),
                ),
                ("duration", models.CharField(blank=True, max_length=255, null=True)),
                ("location", models.CharField(blank=True, max_length=255, null=True)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="experiences",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="Education",
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
                (
                    "institution_name",
                    models.CharField(blank=True, max_length=255, null=True),
                ),
                ("linkedin_url", models.URLField(blank=True, null=True)),
                ("website", models.URLField(blank=True, null=True)),
                ("industry", models.CharField(blank=True, max_length=255, null=True)),
                ("type", models.CharField(blank=True, max_length=255, null=True)),
                (
                    "headquarters",
                    models.CharField(blank=True, max_length=255, null=True),
                ),
                ("company_size", models.IntegerField(blank=True, null=True)),
                ("founded", models.IntegerField(blank=True, null=True)),
                ("from_date", models.DateField(blank=True, null=True)),
                ("to_date", models.DateField(blank=True, null=True)),
                ("description", models.TextField(blank=True, null=True)),
                ("degree", models.CharField(blank=True, max_length=255, null=True)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="educations",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
    ]

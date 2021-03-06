# Generated by Django 4.0.4 on 2022-05-14 16:04

import django.core.validators
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("pods", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Policy",
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
                ("name", models.CharField(max_length=200)),
                ("description", models.TextField()),
                (
                    "coverage_type",
                    models.CharField(
                        choices=[
                            ("m_property", "Minor Property"),
                            ("renters", "Renter's"),
                        ],
                        max_length=32,
                    ),
                ),
                (
                    "policy_type",
                    models.CharField(
                        choices=[("perpetual_pool", "Perpetual Pool")], max_length=32
                    ),
                ),
                (
                    "governance_type",
                    models.CharField(
                        choices=[
                            ("direct_democracy", "Direct Democracy"),
                            ("forced_commitee", "Forced Commitee"),
                            ("voluntary_commitee", "Voluntary Commitee"),
                        ],
                        max_length=32,
                    ),
                ),
                (
                    "max_pool_size",
                    models.IntegerField(
                        help_text="\n        Only related to Capped Pool policies.\n        The maximum size of the collected premiums. Once hit, the policy no longer collects premiums until a claim gets paid out of the pool\n        -1 means no limit.\n    ",
                        validators=[django.core.validators.MinValueValidator(-1)],
                    ),
                ),
                (
                    "claim_payout_limit",
                    models.IntegerField(
                        validators=[django.core.validators.MinValueValidator(-1)]
                    ),
                ),
                (
                    "estimated_risk",
                    models.IntegerField(
                        validators=[
                            django.core.validators.MinValueValidator(1),
                            django.core.validators.MaxValueValidator(100),
                        ]
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "pod",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="policies",
                        to="pods.pod",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Claim",
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
                    "claiment",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="claims",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "policy",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="claims",
                        to="policies.policy",
                    ),
                ),
            ],
        ),
    ]

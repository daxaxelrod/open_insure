# Generated by Django 4.1a1 on 2022-08-01 04:11

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("contenttypes", "0002_remove_content_type_name"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("policies", "0019_policy_is_public"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="policy",
            name="premium_amount",
        ),
        migrations.CreateModel(
            name="Risk",
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
                    "underlying_insured_type",
                    models.CharField(
                        choices=[
                            ("cell_phone", "Phone"),
                            ("audio_equipment", "Audio Equipment"),
                        ],
                        max_length=32,
                    ),
                ),
                (
                    "risk_score",
                    models.DecimalField(
                        decimal_places=3,
                        default=10,
                        max_digits=5,
                        validators=[
                            django.core.validators.MinValueValidator(0),
                            django.core.validators.MaxValueValidator(100),
                        ],
                    ),
                ),
                (
                    "value_at_risk",
                    models.PositiveIntegerField(
                        blank=True, help_text="In cents", null=True
                    ),
                ),
                (
                    "premium_amount",
                    models.IntegerField(
                        blank=True,
                        help_text="in cents",
                        null=True,
                        validators=[django.core.validators.MinValueValidator(100)],
                    ),
                ),
                ("object_id", models.PositiveIntegerField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "content_type",
                    models.ForeignKey(
                        limit_choices_to=models.Q(
                            models.Q(("app_label", "policies"), ("model", "phonerisk")),
                            models.Q(
                                ("app_label", "policies"),
                                ("model", "audioequipmentrisk"),
                            ),
                            _connector="OR",
                        ),
                        on_delete=django.db.models.deletion.CASCADE,
                        to="contenttypes.contenttype",
                    ),
                ),
                (
                    "policy",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="risks",
                        to="policies.policy",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="risks",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]

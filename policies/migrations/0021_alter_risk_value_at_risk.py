# Generated by Django 4.1a1 on 2022-08-01 04:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("policies", "0020_remove_policy_premium_amount_risk"),
    ]

    operations = [
        migrations.AlterField(
            model_name="risk",
            name="value_at_risk",
            field=models.PositiveIntegerField(
                blank=True,
                help_text="The market value of the item at the beginning of the policy, in cents",
                null=True,
            ),
        ),
    ]

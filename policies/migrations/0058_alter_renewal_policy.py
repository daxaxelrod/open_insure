# Generated by Django 4.1.3 on 2023-01-19 04:07

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("policies", "0057_renewal_created_at_renewal_updated_at"),
    ]

    operations = [
        migrations.AlterField(
            model_name="renewal",
            name="policy",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="renewals",
                to="policies.policy",
            ),
        ),
    ]

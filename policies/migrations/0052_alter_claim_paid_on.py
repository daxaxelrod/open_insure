# Generated by Django 4.1.3 on 2022-11-30 05:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("policies", "0051_claim_approved_on"),
    ]

    operations = [
        migrations.AlterField(
            model_name="claim",
            name="paid_on",
            field=models.DateTimeField(
                blank=True, help_text="Null means not paid yet", null=True
            ),
        ),
    ]
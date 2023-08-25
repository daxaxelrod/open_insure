# Generated by Django 4.2.2 on 2023-08-03 02:17

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("gatherer", "0004_propertylifelossguess_loss_date_and_more"),
    ]

    operations = [
        migrations.RenameField(
            model_name="propertylifelossguess",
            old_name="loss_cost",
            new_name="loss_amount",
        ),
        migrations.AlterField(
            model_name="propertylifeexpectancyguess",
            name="age_of_ownership",
            field=models.IntegerField(
                blank=True,
                help_text="Number of days since the property was acquired",
                null=True,
            ),
        ),
        migrations.AlterField(
            model_name="propertylifelossguess",
            name="loss_percent",
            field=models.IntegerField(
                blank=True,
                help_text="in basis points, 0 - 10000",
                null=True,
                validators=[
                    django.core.validators.MinValueValidator(0),
                    django.core.validators.MaxValueValidator(10000),
                ],
            ),
        ),
    ]
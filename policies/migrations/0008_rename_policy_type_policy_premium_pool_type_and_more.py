# Generated by Django 4.0.4 on 2022-05-25 04:20

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('policies', '0007_alter_policy_claim_payout_limit_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='policy',
            old_name='policy_type',
            new_name='premium_pool_type',
        ),
        migrations.AlterField(
            model_name='policy',
            name='estimated_risk',
            field=models.IntegerField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(100)]),
        ),
        migrations.AlterField(
            model_name='policy',
            name='premium_payment_frequency',
            field=models.IntegerField(choices=[(1, 'Monthly'), (3, 'Quarterly'), (12, 'Yearly')], default=1, help_text='How often premiums are due,'),
        ),
    ]

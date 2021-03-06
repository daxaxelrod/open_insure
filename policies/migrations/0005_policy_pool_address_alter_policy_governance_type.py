# Generated by Django 4.0.4 on 2022-05-22 20:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('policies', '0004_policy_coverage_duration_policy_coverage_start_date_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='policy',
            name='pool_address',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='policy',
            name='governance_type',
            field=models.CharField(choices=[('direct_democracy', 'Direct Democracy')], max_length=32),
        ),
    ]

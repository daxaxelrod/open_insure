# Generated by Django 4.1.3 on 2022-11-19 20:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("policies", "0044_alter_claimcomment_commenter"),
    ]

    operations = [
        migrations.AddField(
            model_name="claim",
            name="location_lat",
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="claim",
            name="location_long",
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="claim",
            name="occurance_date",
            field=models.DateField(blank=True, null=True),
        ),
    ]

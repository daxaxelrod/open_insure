# Generated by Django 4.2.2 on 2023-07-16 03:08

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("pods", "0018_userpod_left_at"),
    ]

    operations = [
        migrations.AddField(
            model_name="podinvite",
            name="first_read_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="podinvite",
            name="last_read_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]

# Generated by Django 4.2.2 on 2023-07-16 05:52

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("pods", "0019_podinvite_first_read_at_podinvite_last_read_at"),
    ]

    operations = [
        migrations.AddField(
            model_name="podinvite",
            name="accepted_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]

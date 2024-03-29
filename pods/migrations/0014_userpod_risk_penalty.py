# Generated by Django 4.1 on 2022-09-28 03:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("pods", "0013_user_gender"),
    ]

    operations = [
        migrations.AddField(
            model_name="userpod",
            name="risk_penalty",
            field=models.IntegerField(
                default=0,
                help_text="Base penalty for user who is percieved as more risky to the group, in basis points",
            ),
        ),
    ]

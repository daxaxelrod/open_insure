# Generated by Django 4.1a1 on 2022-06-27 13:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("pods", "0006_alter_pod_max_pod_size"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="email",
            field=models.EmailField(max_length=254, unique=True),
        ),
    ]

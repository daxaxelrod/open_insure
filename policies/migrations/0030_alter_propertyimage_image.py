# Generated by Django 4.1 on 2022-08-26 00:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("policies", "0029_imagealbum_alter_risk_value_at_risk_propertyimage_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="propertyimage",
            name="image",
            field=models.ImageField(max_length=264, upload_to="property_images"),
        ),
    ]

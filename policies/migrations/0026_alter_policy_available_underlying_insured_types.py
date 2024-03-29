# Generated by Django 4.1 on 2022-08-07 16:46

from django.db import migrations
import multiselectfield.db.fields


class Migration(migrations.Migration):

    dependencies = [
        (
            "policies",
            "0025_rename_available_underlying_insured_type_policy_available_underlying_insured_types",
        ),
    ]

    operations = [
        migrations.AlterField(
            model_name="policy",
            name="available_underlying_insured_types",
            field=multiselectfield.db.fields.MultiSelectField(
                blank=True,
                choices=[
                    ("cell_phone", "Phone"),
                    ("audio_equipment", "Audio Equipment"),
                ],
                max_length=256,
                null=True,
            ),
        ),
    ]

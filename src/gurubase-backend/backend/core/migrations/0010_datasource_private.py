# Generated by Django 4.2.13 on 2025-01-03 11:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0009_rename_widget_max_length_settings_widget_answer_max_length'),
    ]

    operations = [
        migrations.AddField(
            model_name='datasource',
            name='private',
            field=models.BooleanField(default=False),
        ),
    ]

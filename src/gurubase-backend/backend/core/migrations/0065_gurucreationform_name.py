# Generated by Django 4.2.18 on 2025-03-20 15:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0064_settings_is_youtube_key_valid_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='gurucreationform',
            name='name',
            field=models.CharField(default='unknown', max_length=100),
            preserve_default=False,
        ),
    ]

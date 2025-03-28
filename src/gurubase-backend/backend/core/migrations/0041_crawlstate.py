# Generated by Django 4.2.18 on 2025-02-19 10:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0040_alter_datasource_unique_together'),
    ]

    operations = [
        migrations.CreateModel(
            name='CrawlState',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('url', models.URLField(max_length=2000)),
                ('status', models.CharField(choices=[('RUNNING', 'Running'), ('COMPLETED', 'Completed'), ('STOPPED', 'Stopped'), ('FAILED', 'Failed')], default='RUNNING', max_length=50)),
                ('discovered_urls', models.JSONField(default=list)),
                ('error_message', models.TextField(blank=True, null=True)),
                ('start_time', models.DateTimeField(auto_now_add=True)),
                ('end_time', models.DateTimeField(blank=True, null=True)),
                ('link_limit', models.IntegerField(default=1500)),
            ],
        ),
    ]

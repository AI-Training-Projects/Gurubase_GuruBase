# Generated by Django 4.2.13 on 2024-12-25 10:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_alter_gurutype_icon_url'),
    ]

    operations = [
        migrations.RemoveConstraint(
            model_name='question',
            name='unique_binge_slug_guru',
        ),
        migrations.RemoveConstraint(
            model_name='question',
            name='unique_binge_question_guru',
        ),
        migrations.RemoveConstraint(
            model_name='question',
            name='unique_null_binge_slug_guru',
        ),
        migrations.RemoveConstraint(
            model_name='question',
            name='unique_null_binge_question_guru',
        ),
    ]

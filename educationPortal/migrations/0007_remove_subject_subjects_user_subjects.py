# Generated by Django 4.2.7 on 2023-12-29 10:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('educationPortal', '0006_remove_user_subjects_subject_subjects'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='subject',
            name='subjects',
        ),
        migrations.AddField(
            model_name='user',
            name='subjects',
            field=models.ManyToManyField(blank=True, to='educationPortal.subject'),
        ),
    ]

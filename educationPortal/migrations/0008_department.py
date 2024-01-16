# Generated by Django 4.2.7 on 2024-01-13 19:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('educationPortal', '0007_remove_subject_subjects_user_subjects'),
    ]

    operations = [
        migrations.CreateModel(
            name='Department',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('dept_name', models.CharField(max_length=300)),
                ('dept_id', models.IntegerField(unique=True)),
            ],
        ),
    ]
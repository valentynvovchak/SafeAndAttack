# Generated by Django 5.1.3 on 2024-11-19 23:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='code_expires_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='customuser',
            name='verification_code',
            field=models.CharField(blank=True, max_length=6, null=True),
        ),
    ]

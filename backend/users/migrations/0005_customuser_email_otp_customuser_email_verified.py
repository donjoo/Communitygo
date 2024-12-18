# Generated by Django 5.1.4 on 2024-12-16 17:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_alter_customuser_last_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='email_otp',
            field=models.CharField(blank=True, max_length=6, null=True),
        ),
        migrations.AddField(
            model_name='customuser',
            name='email_verified',
            field=models.BooleanField(default=False),
        ),
    ]

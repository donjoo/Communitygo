# Generated by Django 5.1.4 on 2024-12-11 00:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Delivery', '0014_courier_latitude_courier_longitude'),
    ]

    operations = [
        migrations.AddField(
            model_name='delivery',
            name='is_completed',
            field=models.BooleanField(default=False),
        ),
    ]

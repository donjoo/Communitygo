# Generated by Django 5.1.3 on 2024-12-01 13:46

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Delivery', '0007_remove_courierperformance_courier_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='courier',
            name='amount',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=10),
        ),
        migrations.AddField(
            model_name='courier',
            name='delivery',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='performance', to='Delivery.delivery'),
        ),
        migrations.AddField(
            model_name='courier',
            name='rating',
            field=models.FloatField(default=0.0),
        ),
        migrations.AlterField(
            model_name='courier',
            name='user',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='deliveriy_courier', to=settings.AUTH_USER_MODEL),
        ),
        migrations.DeleteModel(
            name='CourierPerformance',
        ),
    ]

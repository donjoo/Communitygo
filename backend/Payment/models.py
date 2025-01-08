from django.db import models
from django.conf import settings
from users.models import CustomUser
from decimal import Decimal

# Create your models here.



class Wallet(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def credit(self, amount):
        self.balance += Decimal(amount)
        self.save()

    def debit(self, amount):
        if self.balance >= amount:
            self.balance -= Decimal(amount)
            self.save()
            return True
        return False


class PlatformSettings(models.Model):
    commission_percentage = models.DecimalField(max_digits=5,decimal_places=2,default=10.00)
    razorpay_account_id = models.CharField(max_length=100)


class Transaction(models.Model):
    PENDING = 'pending'
    COMPLETED = 'completed'
    FAILED = 'failed'
    REFUNDED = 'refunded'
    TRANSFERRED = 'transfered'



    STATUS_CHOICES = [
        (PENDING,'Pending'),
        (COMPLETED,'Completed'),
        (FAILED,'Failed'),
        (REFUNDED,'Refunded'),
        (TRANSFERRED,'Transfered to Provider')
    ]


    order_id = models.CharField(max_length=100,unique=True)
    payment_id = models.CharField(max_length=100,null=True,blank=True)
    amount = models.DecimalField(max_digits=10,decimal_places=2)
    platform_commisson = models.DecimalField(max_digits=10,decimal_places=2)
    provider_amount = models.DecimalField(max_digits=10,decimal_places=2)
    status = models.CharField(max_length=20,choices=STATUS_CHOICES,default=PENDING)
    from_user = models.ForeignKey(CustomUser,related_name='payment_made',on_delete=models.CASCADE)
    to_user = models.ForeignKey(CustomUser,related_name='payment_recived',on_delete=models.CASCADE,null=True,blank=True)
    service_type = models.CharField(max_length=20)
    service_id = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)



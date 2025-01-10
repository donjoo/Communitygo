from rest_framework import serializers
from .models import Transaction,MyEarnings


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'



class MyEarningsSerializer(serializers.ModelSerializer):
    class Mera:
        model = MyEarnings
        fields = ['balance','created_at','updated_at']
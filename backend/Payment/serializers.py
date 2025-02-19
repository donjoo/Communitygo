from rest_framework import serializers
from .models import Transaction,MyEarnings,TransactionLog


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'


class MyEarningsSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyEarnings
        fields = ['user', 'total_earnings', 'earnings', 'created_at', 'updated_at']

class TransactionLogSerializer(serializers.ModelSerializer):
    transaction = serializers.PrimaryKeyRelatedField(allow_null=True, queryset=Transaction.objects.all())
    earnings = serializers.PrimaryKeyRelatedField(allow_null=True, queryset=MyEarnings.objects.all())

    class Meta:
        model = TransactionLog
        fields = ['user', 'earnings', 'transaction', 'action', 'service', 'amount', 'timestamp']
from rest_framework import serializers
from Delivery.models import Delivery, Addresses,Courier
from RideShare.models import Ride,RideRoute
from users.models import CustomUser







class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Addresses
        fields = ['city']  # Include necessary fields

class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = RideRoute  # Replace with your actual Route model name
        fields = ['starting_point', 'endpoint']  # Include necessary fields


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser  # Replace with your actual User model name
        fields = ['username']

class CourierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Courier
        fields = ['user']


class RegistrationDataSerializer(serializers.Serializer):
    month = serializers.CharField()
    users = serializers.IntegerField()
    drivers = serializers.IntegerField()
    couriers = serializers.IntegerField()

class DeliveryDataSerializer(serializers.Serializer):
    month = serializers.CharField()
    completed = serializers.IntegerField()
    cancelled = serializers.IntegerField()

class RideDataSerializer(serializers.Serializer):
    month = serializers.CharField()
    rides = serializers.IntegerField()
    bookings = serializers.IntegerField()

class PackageSizeDataSerializer(serializers.Serializer):
    name = serializers.CharField()
    value = serializers.FloatField()

class StatsSerializer(serializers.Serializer):
    total_users = serializers.IntegerField()
    active_deliveries = serializers.IntegerField()
    active_rides = serializers.IntegerField()
    revenue = serializers.FloatField()

class OngoingDeliverySerializer(serializers.ModelSerializer):
    from_address = AddressSerializer()  
    courier = CourierSerializer()

    class Meta:
        model = Delivery
        fields = ('id', 'from_address', 'to_address', 'status', 'courier')


class OngoingRideSerializer(serializers.ModelSerializer):
    route = RouteSerializer()  # Use nested serializer for Route
    user = UserSerializer()      # Use nested serializer for User

    class Meta:
        model = Ride
        fields = ('id', 'route', 'user', 'total_seats', 'available_seats')  
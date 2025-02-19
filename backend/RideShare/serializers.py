from rest_framework import serializers
from .models import Ride, RideRoute, RidePartner

class RideRouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = RideRoute
        fields = ['id', 'starting_point', 'endpoint', 'start_latitude', 'start_longitude','end_latitude','end_longitude']

class RidePartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = RidePartner
        fields = ['id', 'user','ride','seats', 'pickup', 'dropoff', 'pickup_latitude', 'pickup_longitude','dropoff_latitude','dropoff_longitude', 'is_pickedup','status','amount','distance','feedback','rating','payment_done']

class RideSerializer(serializers.ModelSerializer):
    route = RideRouteSerializer()  # Nested serializer for route
    partners = RidePartnerSerializer(many=True, read_only=True)  # Nested serializer for partners

    class Meta:
        model = Ride
        fields = ['id', 'user', 'route', 'vehicle', 'available_seats', 
                  'date', 'starting_time', 'status', 
                  'created_at', 'is_completed', 'partners',"total_seats",'amount']

    def create(self, validated_data):
        route_data = validated_data.pop('route')
        route = RideRoute.objects.create(**route_data)  # Create the ride route instance
        ride = Ride.objects.create(route=route, **validated_data)  # Create the ride instance
        return ride

    def update(self, instance, validated_data):
        route_data = validated_data.pop('route')
        
        # Update the route if necessary
        for attr, value in route_data.items():
            setattr(instance.route, attr, value)
        
        instance.route.save()  # Save updated route
        
        # Update other ride fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()  # Save updated ride
        
        return instance



class RideViewSerializer(serializers.ModelSerializer):
    route = RideRouteSerializer()  # Nested serializer for the route
    partners = RidePartnerSerializer(many=True, read_only=True)  # Nested serializer for partners

    # Add a custom field to serialize user full name
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = Ride
        fields = ['id', 'user', 'user_name', 'route', 'vehicle', 'available_seats', 
                  'date', 'starting_time', 'status', 
                  'created_at', 'is_completed', 'partners', 'total_seats', 'amount']

    def get_user_name(self, obj):
        # Assuming obj.user is a User instance (change if you're using a custom user model)
        return f"{obj.user.first_name} {obj.user.last_name}"
from rest_framework import serializers;
from .models import Addresses, Delivery, Courier
from users.models import CustomUser



class AddressesSerializers(serializers.ModelSerializer):
    class Meta:
        model = Addresses
        fields = ['id','address_line_1','address_line_2','city','state','postal_code','country','latitude','longitude']



class DeliverySerializers(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())  # Allow accepting user IDs
    from_address = serializers.JSONField(write_only=True)
    to_address = serializers.JSONField(write_only=True)
    from_address_data = AddressesSerializers(source='from_address', read_only=True)
    to_address_data = AddressesSerializers(source='to_address', read_only=True)
    courier = serializers.PrimaryKeyRelatedField(queryset=Courier.objects.all(), required=False, allow_null=True)
    # image = serializers.ImageField(required=False, allow_null=True)
    image = serializers.ImageField(required=False, allow_null=True)  # Allow image upload

    class Meta:
        model= Delivery
        fields = ['id', 'user','from_address','to_address','package_size','from_address_data','to_address_data','courier','status','delivered_at','picked_upat','created_at','updated_at','is_pickedup','pickup_otp','dropoff_otp','is_completed','length','width','height','weight', 'est_pickup', 'est_dropoff','image']

    def create(self, validated_data):
        # Extract the nested address data
        from_address_data = validated_data.pop('from_address')
        to_address_data = validated_data.pop('to_address')
      
       

        from_address = Addresses.objects.create(
            user_id=validated_data['user'].id,
            **from_address_data
        )
        to_address = Addresses.objects.create(
            user_id=validated_data['user'].id,
            **to_address_data
        )
        # Create the Delivery object
        delivery = Delivery.objects.create(
            # user = validated_data['user'],
            from_address=from_address,
            to_address=to_address,
            **validated_data
        )

        return delivery


class DeliveryViewSerializer(serializers.ModelSerializer):
    from_address = AddressesSerializers(read_only=True)
    to_address = AddressesSerializers( read_only=True)
    user = serializers.StringRelatedField()  # Display user in a readable format

    class Meta:
        model = Delivery
        fields = [
            'id', 'user', 'from_address', 'to_address', 'package_size',
            'courier', 'status', 'delivered_at', 'picked_upat', 'created_at', 
            'updated_at', 'is_pickedup', 'pickup_otp', 'dropoff_otp', 
            'is_completed', 'length', 'width', 'height', 'weight', 
            'est_pickup', 'est_dropoff', 'image'
        ]

    
class UpdateDeliveryTimeSerializer(serializers.Serializer):
    deliveryId = serializers.IntegerField(required=True)
    est_pickup = serializers.DateTimeField(required=True)
    est_dropoff = serializers.DateTimeField(required=True)


    class Meta:
        model = Delivery
        fields = ['est_pickup', 'est_dropoff']

    

class CourierSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # Displays the username
    delivery = DeliverySerializers(required=False, allow_null=True)  # Nested serializer
    class Meta:
        model = Courier
        fields = ['id', 'user', 'delivery', 'amount', 'rating','latitude','longitude']



# class CourierPerformanceSerializer(serializers.ModelSerializer):

#     courier = CourierSerializers()
#     delivery = DeliverySerializers()


#     class Meta:
#         model = CourierPerformance
#         fields = ['id','courier','delivery','amount','rating']





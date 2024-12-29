from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import DeliverySerializers, CourierSerializer,UpdateDeliveryTimeSerializer,DeliveryViewSerializer
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework import status
from users.models import CustomUser
from django.shortcuts import get_object_or_404
from .models import Delivery, Courier
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
import secrets
import string
from  django.core.exceptions  import ObjectDoesNotExist
from rest_framework.decorators import api_view
from users.serializers import UserSerializer
from django.utils.timezone import now
from rest_framework.parsers import MultiPartParser, FormParser
import json
from rest_framework.permissions import BasePermission
from rest_framework.exceptions import PermissionDenied
from datetime import datetime


User = get_user_model()


class IsEmailVerified(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False  # DRF will handle unauthenticated users with 401
        if not request.user.email_verified:
            return False
        return True




class RequestDelivery(APIView):
    permission_classes = [IsEmailVerified]

    def post(self,request):
        data = request.data
        print(data)
        serializer = DeliverySerializers(data =data, context={'request': request})
        if serializer.is_valid():
            print('delivery valid')
            data = serializer.save()
            delivery_id = data.id
            print(data.id,'deliveryy idddddddddddddddddd')
            return Response({"delivery_id":delivery_id},status=status.HTTP_200_OK)
        print(serializer.errors)
    
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    

# class RequestDelivery(APIView):
#     def post(self, request):
#         data = request.data
#         print("Incoming data:", data)
#         serializer = DeliverySerializers(data=data, context={'request': request})
        
#         if serializer.is_valid():
#             print('Delivery valid')
#             delivery_instance = serializer.save()
#             return Response({"delivery_id": delivery_instance.id}, status=status.HTTP_200_OK)
        
#         print(serializer.errors)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateTime(APIView):
    def post(self, request):
        data = request.data
        print(data)
        today = datetime.now().date()
        try:
            if 'est_pickup' in data:
                data['est_pickup'] = f"{today}T{data['est_pickup']}:00"
            if 'est_dropoff' in data:
                data['est_dropoff'] = f"{today}T{data['est_dropoff']}:00"
        except Exception as e:
            return Response({'error': 'Invalid time format'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = UpdateDeliveryTimeSerializer(data=data)
        
        if serializer.is_valid():
            try:

                
                # Retrieve the delivery object using the provided deliveryId
                delivery = Delivery.objects.get(id=serializer.validated_data['deliveryId'])
                
                # Update the estimated pickup and dropoff times
                delivery.est_pickup = serializer.validated_data['est_pickup']
                delivery.est_dropoff = serializer.validated_data['est_dropoff']
                
                # Save the updated delivery object
                delivery.save()
                
                # Return a success response
                return Response({"message": "Estimated times updated successfully."}, status=status.HTTP_200_OK)
            
            except Delivery.DoesNotExist:
                return Response({"error": "Delivery not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # Return validation errors if the serializer is not valid
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeliveryList(APIView):
    def get(self, request):
        print('helloooo')
        user_id = request.GET.get('user')  # Get the user ID from the query parameters

        if not user_id:
            return Response({"message": "User ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=user_id)  # Assuming you have a User model
            deliveries = Delivery.objects.filter(user=user)

            if deliveries.exists():
                serializer = DeliveryViewSerializer(deliveries, many=True, context={'request': request})
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"message": "No deliveries found."}, status=status.HTTP_404_NOT_FOUND)
        
        except User.DoesNotExist:
            return Response({"message": "User not found."}, status=status.HTTP_404_NOT_FOUND)

class DeliverySearch(APIView):
    permission_classes = [IsEmailVerified]

    def get(self,request):
        deliveries = Delivery.objects.filter(status = 'PENDING').exclude(user=request.user)
        if deliveries.exists():
            serializer = DeliveryViewSerializer(deliveries, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"message":"No available deliveries found"})


    
def generate_otp():
    otp = ''.join(secrets.choice(string.digits) for _ in range(4))
    return otp

class AcceptDelivery(APIView):
    permission_classes = [IsAuthenticated,IsEmailVerified]

    def post(self, request, delivery_id):
        print(delivery_id,'dleiveryyryyryr')
        print('hellooo')
        delivery = get_object_or_404(Delivery, id=delivery_id)
        print('herererererer')
        if delivery.status != 'PENDING':
            return Response({"message":"This delivery is not available for acceptance."},status = status.HTTP_400_BAD_REQUEST)
        print('111111111herererererer')
        generate_otp()
        Courier.objects.create(user=request.user,
                               delivery=delivery)
        delivery.status = 'ASSIGNED'
        delivery.pickup_otp = generate_otp()
        delivery.courier = request.user
        delivery.save()
        return Response(status=status.HTTP_200_OK)

@api_view(['POST'])
def courier_currlocation(request, delivery_id):
    try:
        deliveryId = delivery_id
        delivery = Delivery.objects.get(id = deliveryId)
        courier = Courier.objects.get(delivery = delivery)
        courier.latitude = request.data['latitude']
        courier.longitude = request.data['longitude']
        courier.save()
        return Response(status=status.HTTP_200_OK)
    except Courier.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    

@api_view(['POST'])
def Pickedup_StatusUpdate(request,delivery_id):
    try:
        delivery = Delivery.objects.get(id = delivery_id)
        delivery.picked_upat = now()
        delivery.is_pickedup = True
        delivery.dropoff_otp = generate_otp()
        delivery.status = 'PICKED_UP'
        delivery.save()
        return Response(status=status.HTTP_200_OK)
    except Delivery.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def verify_otp(request,delivery_id):
    try:
        delivery = Delivery.objects.get(id = delivery_id)
        otp = request.data.get('otp')
        method = request.data.get('method')
        print(otp)
        print(delivery.pickup_otp)
        if method == 'pickup':
            if delivery.pickup_otp == otp:
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            if delivery.dropoff_otp == otp:
                 return Response(status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)
    except Delivery.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    


@api_view(['POST'])
def Courier_completed(request,delivery_id):
    try:
        delivery = Delivery.objects.get(id = delivery_id)
        print(delivery)
        delivery.is_completed = True
        delivery.delivered_at = now()
        delivery.status = 'DELIVERED'
        delivery.save()
        return Response(status=status.HTTP_200_OK)
    except Delivery.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def Rate_courier(request,courier_id):
    try: 
        courier = Courier.objects.get(id=courier_id)
        rating = request.data.get('rating')
        feedback = request.data.get('feedback')

        if rating is None:
            return  Response({"error":"Rating is required."},status = status.HTTP_400_BAD_REQUEST)
        
        courier.rating = rating
        courier.feedback = feedback
        courier.save()
        return Response({"message":"Rating submited successfully!"}, status=status.HTTP_200_OK)
    
    except Courier.DoesNotExist:
        return Response({"error":"Courier not found"}, status = status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error":str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)







class DeliveryDetailView(APIView):
    def get(self, request, delivery_id):
        try:
            # delivery = Delivery.objects.get(id=delivery_id)
            delivery = get_object_or_404(Delivery.objects.select_related('courier'), id=delivery_id)
            serializer = DeliveryViewSerializer(delivery)

            courier_data = None

            try:
                courier = Courier.objects.get(delivery=delivery)
                courierser = CourierSerializer(courier)
                courier_data = courierser.data  # If courier exists, add the serialized data
            except Courier.DoesNotExist:
                courier_data = None  # No courier assigned
            user = User.objects.get(email = delivery.user)
            
            userser = UserSerializer(user)

            data =  {
                "delivery":serializer.data,
                "courier":courier_data,
                'user':userser.data,
            }
         
            return Response(data, status=status.HTTP_200_OK)
        except Delivery.DoesNotExist:
            return Response({"error": "Delivery not found"}, status=status.HTTP_404_NOT_FOUND)




class Courier_details(APIView):
    def get(self,request, delivery_id):
        try:
            delivery = get_object_or_404(Delivery, id=delivery_id)

            delivery = get_object_or_404(Delivery.objects.select_related('courier'), id=delivery_id)
            serializer = DeliveryViewSerializer(delivery)

            courier = Courier.objects.get(delivery = delivery)
            user = User.objects.get(email = delivery.user)
            courierser = CourierSerializer(courier)
            userser = UserSerializer(user)

            data =  {
                "delivery":serializer.data,
                "courier":courierser.data,
                'user':userser.data,
            }


            return Response(data)
        
        except Exception as e:
            return Response({"error": "Failed to fetch delivery details", "message": str(e)}, status=400)
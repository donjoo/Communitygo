from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer
from Delivery.serializers import DeliverySerializers,CourierSerializer
from Delivery.models import Delivery,Courier
from .models import UserProfile,CustomUser
# admin modules import below
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAdminUser
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from .serializers import UserProfileSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
User = get_user_model()

class SignupView(APIView):
    def post(self,request):
        print(request.data)
        data = request.data
        mapped_data = {
            "first_name": data.get("firstname"),
            "last_name": data.get("lastname"),
            "username": data.get("username"),
            "phone_number": data.get("phone_number"),
            "email": data.get("email"),
            "password": data.get("password"),
        }
        serializer = UserSerializer(data=mapped_data)
        print('helloooo')
        if serializer.is_valid():
            print('heyeyeyeyeyyey')
            user = serializer.save()
            UserProfile.objects.create(user=user)
            refresh = RefreshToken.for_user(user)
            print('heyyyy')
            return Response({
                'user': UserSerializer(user).data,
                'token': str(refresh.access_token)
            }, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self,request):
        data = request.data
        email = data.get('email')
        password = data.get('password')
        try:
            user = User.objects.get(email=email)
            if user.check_password(password):
                if not user.is_active:
                    return Response({'error':'Your account has been blocked.'}, status=status.HTTP_403_FORBIDDEN)
                refresh = RefreshToken.for_user(user)
                return Response({
                    'user': {
                        'id': user.id,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'username': user.username,
                        'email': user.email,
                    },
                    'token': str(refresh.access_token)
                })
            else:
                return Response({'error':'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
       

class UserProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, *args,**kwargs):
        try:

   
           
            user = User.objects.get(id=request.user.id)
            deliveries = Delivery.objects.filter(user=user)
            couriers = Courier.objects.filter(user=user)

            serializer = UserSerializer(user)
            deliveryserializer = DeliverySerializers(deliveries,many=True)
            courierserializer = CourierSerializer(couriers, many=True)
            print(user)
            print(courierserializer.data)
            data = {
                'user': serializer.data,
                'deliveries':deliveryserializer.data,
                'couriers':courierserializer.data
            } 
            # print(data)
            return Response(data,status= status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"details":"User not found."}, status=status.HTTP_404_NOT_FOUND)
        

        

# class user_detail(APIView):
#     def get(self,request,user_id):
#         try:
#             user = User.objects.get(id=user_id)
#             deliveries = Delivery.objects.filter(user=user)
#             print(deliveries)
#             serializer = UserSerializer(user)
#             deliveryserializer = DeliverySerializers(deliveries,many=True)
#             data = {
#                 'user':serializer.data,
#                 'deliveries':deliveryserializer.data,
#             }
#             return Response(data)
#         except User.DoesNotExist:
#             return Response({'error':"user not found"},status=status.HTTP_404_NOT_FOUND)























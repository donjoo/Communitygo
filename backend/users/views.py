from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer
from Delivery.serializers import DeliverySerializers,CourierSerializer
from Delivery.models import Delivery,Courier
from .models import UserProfile,CustomUser,OTPRecord
# admin modules import below
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAdminUser
from rest_framework.permissions import IsAuthenticated # type: ignore
from django.contrib.auth import authenticate
from .serializers import UserProfileSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
import random
from .task import sent_otp
from datetime import datetime,timedelta
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from google.oauth2 import id_token
from google.auth.transport import requests
from rest_framework.exceptions import AuthenticationFailed, ParseError
from RideShare.models import Ride,RidePartner
from RideShare.serializers import RideSerializer,RidePartnerSerializer

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
        if serializer.is_valid():
           
            user = serializer.save()
            UserProfile.objects.create(user=user)

            try:
                self.send_otp_email(serializer.data['email'])
            except Exception as e:
                print(f"Error occurred during OTP sending: {str(e)}")
                return Response({"Message":"unknown error","error":str(e)},status=500)

           
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'token': str(refresh.access_token)
            }, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def send_otp_email(self,email):
        random_num = random.randint(1000,9999)
        result = sent_otp.delay(f"{random_num} -OTP",email)
        print(result)

        otp_model_instance = OTPRecord.objects.create(
            user = User.objects.get(email=email),
            otp = random_num,
            created_at = timezone.now(),
            expires_at = timezone.now() + timedelta(minutes=5)

        )
        otp_model_instance.save()


class OTPVerificationView(APIView):
    def post(self,request):
        print('verifyingggggggggg')
        try:
            user = User.objects.get(email=request.data['email'])
            otp_instance = OTPRecord.objects.get(user=user)

        except ObjectDoesNotExist:
            return Response("User does not exist or OTP not generated", status=404)
    
        if int(otp_instance.otp) == int(request.data['otp']):
            user.is_active = True
            user.email_verified = True
            user.save()


            otp_instance.delete()

            return Response("user succcessfully verified", status=200)
        return Response("OTP is wrong",status=400)
    
class ResendOTPView(APIView):
    def post(self, request):
        try:
            user = User.objects.get(email=request.data['email'])
        except ObjectDoesNotExist:
            return Response("User does not exist", status=404)

        # Create a new OTP instance
        random_num = random.randint(1000, 9999)

        # Remove the old OTP instance if it exists
        OTPRecord.objects.filter(user=user).delete()

        # Create and save a new OTP record for the user
        otp_model_instance = OTPRecord.objects.create(
            user=user,
            otp=random_num,
            created_at=timezone.now(),
            expires_at=timezone.now() + timedelta(minutes=5)
        )

        # Optionally, send OTP email here (e.g., send_otp_email)
        try:
            sent_otp.delay(f"{random_num} - OTP", user.email)
        except Exception as e:
            print(f"Error sending OTP: {str(e)}")
            return Response({"message": "Error occurred while sending OTP", "error": str(e)}, status=500)

        return Response("New OTP sent successfully", status=200)


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
                        'phone_number':user.phone_number,
                    },
                    'token': str(refresh.access_token)
                })
            else:
                return Response({'error':'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
       


        #  google authentication

class UserGoogleAuth(APIView):
    def post(self, request):
        accountExist = True 
        GOOGLE_AUTH_API = '110059188917-861ffc7h1nuv0kpi425hh4dgc5lgt65n.apps.googleusercontent.com'

        try:
            google_request = requests.Request()
            id_info = id_token.verify_oauth2_token(
                request.data['client_id'], google_request, GOOGLE_AUTH_API)
            email = id_info['email']
            print('here is your email from google',email,id_info)


        
        except KeyError:
            raise ParseError('Check credential')
        
        print('doneee')
        if not User.objects.filter(email=email).exists():
            accountExist = False 

            user = User.objects.create(
            username=id_info['name'],
            first_name =id_info['given_name'],
            last_name =id_info['family_name'],
            email =email,
            email_verified=True,

            )

            UserProfile.objects.create(user=user)
        
        print('herrre doneee')
       
        user = User.objects.filter(email=email).first()
        print(user)
        print('user not exisrtsss')
        print('not doneee')
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
                        'phone_number':user.phone_number,
                    },
                    'token': str(refresh.access_token)
        })



class AddPhoneNumberView(APIView):
    def post(self, request):
        try:
            email = request.data.get('email')
            phone_number = request.data.get('phone_number')
            print(email)
            print(phone_number)

            if not email or not phone_number:
                return Response(
                    {"message": "Email and phone number are required."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                # Fetch the user with the provided email
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response(
                    {"message": "User not found."},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Update the user's phone number
            user.phone_number = phone_number
            user.save()

            return Response(
                {"message": "Phone number updated successfully.", "status": 200},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"message": "An error occurred.", "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



class UserProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, *args,**kwargs):
        try:

   
           
            user = User.objects.get(id=request.user.id)
            deliveries = Delivery.objects.filter(user=user).order_by('-created_at') 
            couriers = Courier.objects.filter(user=user).order_by('-id') 
            rides = Ride.objects.filter(user=user).order_by('-id')
            partner = RidePartner.objects.filter(user=user).order_by('-id')

            serializer = UserSerializer(user)
            deliveryserializer = DeliverySerializers(deliveries,many=True)
            courierserializer = CourierSerializer(couriers, many=True)
            rideserializer = RideSerializer(rides,many=True) 
            partnerserializer = RidePartnerSerializer(partner,many=True)


            print(user)
            print(courierserializer.data)
            data = {
                'user': serializer.data,
                'deliveries':deliveryserializer.data,
                'couriers':courierserializer.data,
                'rides':rideserializer.data,
                'partner':partnerserializer.data,
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























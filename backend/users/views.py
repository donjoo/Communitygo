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

























#admin
# class AdminTokenObtainView(TokenObtainPairView):
#     def post(self, request, *args, **kwargs):
#         user = authenticate(email=request.data.get('email'), password=request.data.get('password'))
#         if user and user.is_superadmin:
#             response =  super().post(request, *args, **kwargs)
#             response.data['user'] = {
#                 'email': user.email,
#                 'first_name': user.first_name,
#                 'last_name': user.last_name,
#             }
#             response.data['admin_token'] = response.data['access']
#             return response
#         return Response({"detail": "Only superusers are allowed."}, status=status.HTTP_403_FORBIDDEN)

# class AdminDashboardView(APIView):
#     permission_classes = [IsAuthenticated, IsAdminUser]

#     def get(self, request):
#         active_users = User.objects.filter(is_active=True, is_superadmin=False)
#         inactive_users = User.objects.filter(is_active=False, is_superadmin=False)
        
#         active_serializer = UserSerializer(active_users, many=True)
#         inactive_serializer = UserSerializer(inactive_users, many=True)
        
#         return Response({
#             "message": "Welcome to the admin dashboard",
#             "active_users": active_serializer.data,
#             "inactive_users": inactive_serializer.data
#         })
    
#     def post(self, request):
#         user_id = request.data.get('user_id')
#         try:
#             user = User.objects.get(id=user_id)
#             user.is_active = not user.is_active
#             user.save()
#             return Response({
#                 'status': 'success', 
#                 'user_id': user.id, 
#                 'is_active': user.is_active
#             })
#         except User.DoesNotExist:
#             return Response({
#                 'status': 'error', 
#                 'message': 'User not found'
#             }, status=status.HTTP_404_NOT_FOUND)
        
# @api_view(['POST'])
# @permission_classes([IsAuthenticated, IsAdminUser])
# def toggle_user_status(request, user_id):
#     try:
#         user = User.objects.get(id=user_id)
#         user.is_active = not user.is_active
#         user.save()
#         return Response({'status': 'success', 'is_active': user.is_active})
#     except User.DoesNotExist:
#         return Response({'status': 'error', 'message': 'User not found'}, status=404)

# class UserProfileView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self,request):
#         form = UserProfile.objects.get(user=request.user)

#         data = {
#             first_name: form.first_name,

#         }
#         return Response({
#             'username': request.user.username,
#             'profile_picture': request.build_absolute_uri(profile.profile_picture.url) if profile.profile_picture else None,
#         })
    
#     def put(self, request):
#         profile = UserProfile.objects.get(user=request.user)
#         if 'username' in request.data:
#             request.user.username = request.data['username']
#             request.user.save()
#         if 'profile_picture' in request.FILES:
#             profile.profile_picture = request.FILES['profile_picture']
#             profile.save()
#         return Response({'message': 'profile updated successfully'})
    
# @api_view(['POST'])
# @permission_classes([IsAdminUser])
# def admin_create_user(request):
#     serializer = UserSerializer(data=request.data)
#     if serializer.is_valid():
#         user = serializer.save()
#         UserProfile.objects.create(user=user)
#         return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
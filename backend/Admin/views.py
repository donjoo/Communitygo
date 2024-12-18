from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser
from rest_framework.permissions import IsAuthenticated
from users.serializers import UserSerializer
from Delivery.models import Delivery,Courier
from Delivery.serializers import DeliverySerializers, CourierSerializer
from users.models import CustomUser,UserProfile
from django.shortcuts import get_object_or_404


User = CustomUser

class AdminTokenObtainView(TokenObtainPairView):
    def post(self,request, *args, **kwargs):
        user = authenticate(email = request.data.get('email'), password=request.data.get('password'))
        if user and user.is_superadmin:
            response = super().post(request,*args, **kwargs)
            response.data['user'] = {
                'email' : user.email,
                'first_name': user.first_name,
                'last_name':user.last_name,
                'username':user.username,
            }
            response.data['admin_token'] = response.data['access']
            return response
        return Response({"detail": "Only superuser are allowed."}, status= status.HTTP_403_FORBIDDEN)
   
class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        active_users = User.objects.filter(is_active=True, is_superadmin=False)
        inactive_users = User.objects.filter(is_active=False, is_superadmin=False)
        
        active_serializer = UserSerializer(active_users, many=True)
        inactive_serializer = UserSerializer(inactive_users, many=True)
        
        return Response({
            "message": "Welcome to the admin dashboard",
            "active_users": active_serializer.data,
            "inactive_users": inactive_serializer.data
        })
    
    def post(self, request):
        user_id = request.data.get('user_id')
        try:
            user = User.objects.get(id=user_id)
            user.is_active = not user.is_active
            user.save()
            return Response({
                'status': 'success', 
                'user_id': user.id, 
                'is_active': user.is_active
            })
        except User.DoesNotExist:
            return Response({
                'status': 'error', 
                'message': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)
        


class UserList(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self,request):
    
            users = User.objects.filter(is_superadmin=False,is_deleted = False)
            user_serializer = UserSerializer(users,many=True)

            return Response({
                "users":user_serializer.data
            })
    
    
    
class DeliveryList(APIView):
    permission_classes =[IsAuthenticated,IsAdminUser]

    def get(self,request):
        deliveries = Delivery.objects.all()
        delivery_serializer = DeliverySerializers(deliveries,many=True)

        return Response({
            "deliveries":delivery_serializer.data
        })



@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def toggle_user_status(request, user_id):
    if request.method == 'POST':
        # Your logic for toggling the user's status
        try:
            # Example: Retrieve user and toggle status
            user = User.objects.get(pk=user_id)
            user.is_active = not user.is_active
            user.save()
            return Response({'success': True, 'message': 'User status updated successfully.'})
        except User.DoesNotExist:
            return Response({'success': False, 'error': 'User not found.'}, status=404)
        except Exception as e:
            return Response(
                    {"success": False, "message": str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR,)
    return Response({'success': False, 'error': 'Invalid request method.'}, status=400)

@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def delete_user(request,user_id):
    if request.method == 'POST':
        try:
            user = User.objects.get(pk = user_id)
            user.is_deleted = True
            user.save()
            return Response({'success': True , 'message': 'User status updated  successfully.'})
        except User.DoesNotExist:
            return Response({'success': False, 'error': "User not found."}, status = 404)
        except Exception as e:
            return Response({"success":False,'message':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({'success':False,'error':'Invalid resquest method.'},status=400)




class user_detail(APIView):
    def get(self,request,user_id):
        try:
            user = User.objects.get(id=user_id)
            deliveries = Delivery.objects.filter(user=user)
            couriers = Courier.objects.filter(user = user)
            print(couriers)
            serializer = UserSerializer(user)
            deliveryserializer = DeliverySerializers(deliveries,many=True)
            courierserializer = CourierSerializer(couriers,many=True)
            data = {
                'user':serializer.data,
                'deliveries':deliveryserializer.data,
                'couriers':courierserializer.data,
            }
            return Response(data)
        except User.DoesNotExist:
            return Response({'error':"user not found"},status=status.HTTP_404_NOT_FOUND)


class Create_user(APIView):
    def post(self,request):
        data = request.data
        print(data)

        serializer = UserSerializer(data = data)
        if serializer.is_valid():
            user = serializer.save()
            UserProfile.objects.create(user =user)
            return Response(status=status.HTTP_200_OK)
        print(serializer.errors)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

# @api_view(['POST'])
# @permission_classes([permissions.IsAdminUser])
# def toggle_user_status(request, user_id):
#     try:
#         user = User.objects.get(id=user_id)
#         user.is_active = not user.is_active  # Toggle the is_active status
#         user.save()
#         return Response(
#             {"success": True, "message": f"User {'blocked' if not user.is_active else 'unblocked'} successfully."},
#             status=status.HTTP_200_OK,
#         )
#     except User.DoesNotExist:
#         return Response(
#             {"success": False, "message": "User not found."},
#             status=status.HTTP_404_NOT_FOUND,
#         )
#     except Exception as e:
#         return Response(
#             {"success": False, "message": str(e)},
#             status=status.HTTP_500_INTERNAL_SERVER_ERROR,
#         )



class UpdateDeliveryStatusView(APIView):
    def patch(self, request, delivery_id):
        try:
            delivery = Delivery.objects.get(id=delivery_id)
        except Delivery.DoesNotExist:
            return Response({"error": "Delivery not found"}, status=status.HTTP_404_NOT_FOUND)

        # Validate the status
        new_status = request.data.get("status")
        valid_statuses = [choice[0] for choice in Delivery.DELIVERY_STATUS]

        if new_status not in valid_statuses:
            return Response(
                {"error": f"Invalid status. Valid options are: {valid_statuses}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update the status
        delivery.status = new_status
        delivery.save()

        return Response(
            {
                "id": delivery.id,
                "created_at": delivery.created_at,
                "from_address": delivery.from_address.address_line_1,
                "to_address": delivery.to_address.address_line_1,
                "status": delivery.status,
            },
            status=status.HTTP_200_OK
        )
    



class DeliveryDetailView(APIView):
    def get(self, request, delivery_id):
        try:
            # delivery = Delivery.objects.get(id=delivery_id)
            delivery = get_object_or_404(Delivery.objects.select_related('courier'), id=delivery_id)
            serializer = DeliverySerializers(delivery)

            courier_data = None

            try:
                courier = Courier.objects.get(delivery=delivery)
                courierser = CourierSerializer(courier)
                courier_data = courierser.data  # If courier exists, add the serialized data
            except Courier.DoesNotExist:
                courier_data = None  # No courier assigned
            user = User.objects.get(email = delivery.user)
            
            userser = UserSerializer(user)

            # userco = User.objects.get(email = delivery.courier)
            # serializercourier = UserSerializer(userco)

            data =  {
                "delivery":serializer.data,
                "courier":courier_data,
                # "courier_user":serializercourier,
                'user':userser.data,
            }
            # if delivery.courier:
            #     data["courier"] = courierser.data
                        # "id": delivery.courier.id,
                        # "username": delivery.courier.username,
                        # "phone_number": delivery.courier.phone_number,
        
         
            return Response(data, status=status.HTTP_200_OK)
        except Delivery.DoesNotExist:
            return Response({"error": "Delivery not found"}, status=status.HTTP_404_NOT_FOUND)


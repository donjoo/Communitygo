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
from Delivery.serializers import DeliverySerializers, CourierSerializer,DeliveryViewSerializer,TopCourierSerializer
from users.models import CustomUser,UserProfile
from django.shortcuts import get_object_or_404
from google.oauth2 import id_token
from google.auth.transport import requests
from rest_framework.exceptions import AuthenticationFailed, ParseError
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import (
    RegistrationDataSerializer,
    DeliveryDataSerializer,
    RideDataSerializer,
    PackageSizeDataSerializer,
    StatsSerializer,
    OngoingDeliverySerializer,
    OngoingRideSerializer,
)
from django.db.models import Count, Sum
from django.utils import timezone
from RideShare.models import Ride,RidePartner
import calendar
from django.http import JsonResponse
from Payment.models import Transaction
from rest_framework import generics
from django.utils.timezone import now
from dateutil.relativedelta import relativedelta
from datetime import datetime



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
   




class AdminGoogleAuth(APIView):
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
        
        if not User.objects.filter(email=email).exists():
            return Response({'error':'account desnot exist'},status=status.HTTP_403_FORBIDDEN)
        
       
        user = User.objects.filter(email=email).first()
    
        if getattr(user, 'is_superadmin', False):

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'username': user.username,
                },
                'admin_token': str(refresh.access_token)
            })
        return Response({"error": "Only superuser are allowed."}, status= status.HTTP_403_FORBIDDEN)










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
    
            users = User.objects.filter(is_superadmin=False,is_deleted = False).order_by('-id') 
            user_serializer = UserSerializer(users,many=True)

            return Response({
                "users":user_serializer.data
            })
    
    
    
class DeliveryList(APIView):
    permission_classes =[IsAuthenticated,IsAdminUser]

    def get(self,request):
        filter_status = request.query_params.get('filter', None)  # Get filter from query params
        print(filter_status)
        if filter_status:
            deliveries = Delivery.objects.filter(status=filter_status).order_by('-created_at') 
        else:
            deliveries = Delivery.objects.all().order_by('-created_at') 
        delivery_serializer = DeliveryViewSerializer(deliveries,many=True)

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
        




class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        now = timezone.now()
        months = [calendar.month_abbr[month] for month in range(1, now.month + 1)]

        # Registration data
        registration_data = [
            {
                'month': month,
                'users': CustomUser.objects.filter(date_joined__month=i + 1, date_joined__year=now.year, is_admin=False).count(),
                'drivers': CustomUser.objects.filter(date_joined__month=i + 1, date_joined__year=now.year, rides__isnull=False).distinct().count(),
                'couriers': CustomUser.objects.filter(date_joined__month=i + 1, date_joined__year=now.year, assigned_courier__isnull=False).distinct().count(),
            }
            for i, month in enumerate(months)
        ]

        # Serialize registration data
        registration_serializer = RegistrationDataSerializer(registration_data, many=True)

        # Delivery data
        delivery_data = [
            {
                'month': month,
                'completed': Delivery.objects.filter(status='DELIVERED', delivered_at__month=i + 1, delivered_at__year=now.year).count(),
                'cancelled': Delivery.objects.filter(status='CANCELED', updated_at__month=i + 1, updated_at__year=now.year).count(),
            }
            for i, month in enumerate(months)
        ]

        # Serialize delivery data
        delivery_serializer = DeliveryDataSerializer(delivery_data, many=True)

        # Ride data
        ride_data = [
            {
                'month': month,
                'rides': Ride.objects.filter(status='completed', created_at__month=i + 1, created_at__year=now.year).count(),
                'bookings': RidePartner.objects.filter(ride__created_at__month=i + 1, ride__created_at__year=now.year).count(),
            }
            for i, month in enumerate(months)
        ]

        # Serialize ride data
        ride_serializer = RideDataSerializer(ride_data, many=True)

        # Package size distribution
        package_sizes = Delivery.objects.filter(created_at__year=now.year).values('package_size').annotate(count=Count('id'))
        total_packages = sum(size['count'] for size in package_sizes)
        
        package_size_data = [
            {
                'name': dict(Delivery.PACKAGE_SIZES).get(size['package_size'], size['package_size']),
                'value': round((size['count'] / total_packages) * 100) if total_packages > 0 else 0
            }
            for size in package_sizes
        ]

        # Serialize package size data
        package_size_serializer = PackageSizeDataSerializer(package_size_data, many=True)

        # Stats cards data
        total_revenue = (
            Delivery.objects.filter(status='DELIVERED').aggregate(Sum('amount'))['amount__sum'] or 0 +
            Ride.objects.filter(status='completed').aggregate(Sum('amount'))['amount__sum'] or 0
        )

        stats_data = {
            'total_users': CustomUser.objects.filter(is_admin=False).count(),
            'active_deliveries': Delivery.objects.filter(status__in=['PENDING', 'ASSIGNED', 'PICKED_UP']).count(),
            'active_rides': Ride.objects.filter(status='ongoing').count(),
            'revenue': total_revenue,
        }

        # Serialize stats data
        stats_serializer = StatsSerializer(stats_data)

        # Ongoing deliveries and rides data
        ongoing_deliveries_queryset = Delivery.objects.filter(status__in=['PENDING', 'ASSIGNED', 'PICKED_UP']).select_related('user', 'courier', 'from_address', 'to_address')[:10]
        ongoing_rides_queryset = Ride.objects.filter(status='ongoing').select_related('user', 'route')[:10]

        ongoing_deliveries_serializer = OngoingDeliverySerializer(ongoing_deliveries_queryset, many=True)
        ongoing_rides_serializer = OngoingRideSerializer(ongoing_rides_queryset, many=True)

        # Prepare the final response data
        data = {
            'registration_data': registration_serializer.data,
            'delivery_data': delivery_serializer.data,
            'ride_data': ride_serializer.data,
            'package_size_data': package_size_serializer.data,
            'stats': stats_serializer.data,
            'ongoing_deliveries': ongoing_deliveries_serializer.data,
            'ongoing_rides': ongoing_rides_serializer.data,
        }

        return Response(data,status=status.HTTP_200_OK)



class CountView(APIView):
   

    def get_user_count(self):
       
        users_count = CustomUser.objects.count()
        return {'user_count': users_count}

    def get_ongoing_deliveries(self):
       
        ongoing_deliveries = Delivery.objects.filter(status__in=['ASSIGNED', 'PICKED_UP']).count()
        return {'ongoing_deliveries': ongoing_deliveries}

    def get_ongoing_rides(self):
       
        ongoing_rides = Ride.objects.filter(status='ongoing').count()
        return {'ongoing_rides': ongoing_rides}
    
    def total_revenue(self):
        print('revenuueueueue')
        total_revenue = Transaction.objects.filter(status='completed').aggregate(
        total_commission=Sum('platform_commisson')
        )
        
        # Extract the total commission, and default to 0 if no completed transactions
        total_commission = total_revenue['total_commission'] or 0
        
        print(f"Total revenue: {total_commission}")  # This will print the total commission
        
        # Return the rounded total revenue
        return {'total_revenue': round(total_commission, 2)}

    def get(self, request, *args, **kwargs):
        """
        Combines all the counts in one response.
        """
        data = {
            **self.get_user_count(),
            **self.get_ongoing_deliveries(),
            **self.get_ongoing_rides(),
            **self.total_revenue(),
        }
        return Response(data)

class RecentDeliveriesList(generics.ListAPIView):
    queryset = Delivery.objects.order_by('-created_at')[:5]  # Fetch the latest 5 deliveries
    serializer_class = DeliveryViewSerializer



class UserRegistrationStats(APIView):
    def get(self, request):
        # Get the current date
        now = timezone.now()
        # Prepare a list for the response
        monthly_data = []

        # Loop through the last 6 months
        for i in range(6):
            month_start = (now - relativedelta(months=i)).replace(day=1)
            month_end = (month_start + relativedelta(months=1)) - timezone.timedelta(days=1)

            # Count users registered in that month
            user_count = CustomUser.objects.filter(
                date_joined__gte=month_start,
                date_joined__lte=month_end
            ).count()

            monthly_data.append({
                'name': month_start.strftime('%b'),  # Month name (Jan, Feb, etc.)
                'users': user_count,
            })

        # Reverse data so it's in chronological order
        monthly_data.reverse()

        return Response(monthly_data)
    


class RideOverviewStats(APIView):
    def get(self, request):
        now = timezone.now()
        ride_data = []

        # Aggregate data for the last 6 months
        for i in range(6):
            month_start = (now - relativedelta(months=i)).replace(day=1)
            month_end = (month_start + relativedelta(months=1)) - timezone.timedelta(days=1)

            # Count rides for each status
            completed_count = Ride.objects.filter(
                status='completed', created_at__gte=month_start, created_at__lte=month_end
            ).count()
            canceled_count = Ride.objects.filter(
                status='canceled', created_at__gte=month_start, created_at__lte=month_end
            ).count()

            ride_data.append({
                'name': month_start.strftime('%b'),  # Month name
                'completed': completed_count,
                'canceled': canceled_count,
            })

        # Reverse data to show chronological order
        ride_data.reverse()

        return Response(ride_data)
    

class MonthlyRevenueStats(APIView):
    def get(self, request):
        current_date = now()
        revenue_data = []

        # Generate revenue for the past 12 months
        for i in range(12):
            month_start = (current_date - relativedelta(months=i)).replace(day=1)
            month_end = (month_start + relativedelta(months=1)) - relativedelta(days=1)

            # Calculate total revenue for the month
            total_revenue = Transaction.objects.filter(
                status='completed',
                created_at__gte=month_start,
                created_at__lte=month_end,
            ).aggregate(total=Sum('platform_commisson'))['total'] or 0

            revenue_data.append({
                'name': month_start.strftime('%b'),  # Month name (e.g., Jan, Feb)
                'total': round(total_revenue, 2),   # Rounded to 2 decimal places
            })

        # Reverse data to show chronological order
        revenue_data.reverse()

        return Response(revenue_data)


class TopCouriersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        top_couriers = Courier.objects.annotate(
            rides=Count('courier_deliveries')
        ).order_by('-rating')[:5]  # Top 5 couriers based on rating

        serializer = TopCourierSerializer(top_couriers, many=True)
        return Response(serializer.data)



class DeliveryOverview(APIView):
    def get(self, request):
        # Aggregate the data by month
        current_year = datetime.now().year
        data = []
        
        for month in range(1, 13):
            completed_count = Delivery.objects.filter(
                status='DELIVERED',
                created_at__year=current_year,
                created_at__month=month
            ).count()

            canceled_count = Delivery.objects.filter(
                status='CANCELED',
                created_at__year=current_year,
                created_at__month=month
            ).count()

            data.append({
                'name': datetime(current_year, month, 1).strftime('%b'),
                'completed': completed_count,
                'canceled': canceled_count,
            })
        
        return Response(data, status=status.HTTP_200_OK)
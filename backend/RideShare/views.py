from django.shortcuts import render
from .serializers import RideSerializer,RideRouteSerializer,RidePartnerSerializer # type: ignore
from rest_framework.views import APIView
from rest_framework.permissions import BasePermission
from rest_framework.response import Response
from rest_framework import status ,generics, filters
from django.shortcuts import get_object_or_404
from .models import Ride,RideRoute,RidePartner
from users.models import CustomUser
from users.serializers import UserSerializer
# Create your views here.

class IsEmailVerified(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if not request.user.email_verified:
            return False
        return True


class MakeRide(APIView):
    permission_classes = [IsEmailVerified]

    def post(self,request):
        data = request.data
        print(data)
        serializer = RideSerializer(data = data, context={'request':request})
        if serializer.is_valid():
            data = serializer.save()
            ride_id = data.id
            print(ride_id)
            return Response({'ride_id':ride_id},status=status.HTTP_200_OK)
        print(serializer.errors)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


    def get(self, request, ride_id):
        ride = get_object_or_404(Ride, id=ride_id)

        # Retrieve all ride partners for this ride
        ride_partners = RidePartner.objects.filter(ride=ride)

        # Filter partners into pending and accepted categories
        pending = ride_partners.filter(status="pending")
        accepted = ride_partners.exclude(status__in=["pending", "rejected",'cancled'])
        # Serialize the ride and partners
        ride_serializer = RideSerializer(ride)
        pending_serializer = RidePartnerSerializer(pending, many=True)  # Use many=True for multiple objects
        accepted_serializer = RidePartnerSerializer(accepted, many=True)  # Use many=True for multiple objects

        # Construct the response data
        data = {
            'ride': ride_serializer.data,
            'pending': pending_serializer.data,
            'partners': accepted_serializer.data,
        }

        return Response(data, status=status.HTTP_200_OK)
            

  
class RideSearch(generics.ListAPIView):
    serializer_class = RideSerializer
    permission_classes = [IsEmailVerified]  # Ensure only authenticated users can access this view


    def get_queryset(self):
        # Start with all rides that are pending
        queryset = Ride.objects.filter(status='pending')  # Use lowercase 'pending'

        # Exclude rides created by the current user
        queryset = queryset.exclude(user=self.request.user)

        # Get query parameters for filtering
        starting_point = self.request.query_params.get('starting_point', None)
        endpoint = self.request.query_params.get('endpoint', None)

        # Filter by starting point if provided
        if starting_point:
            queryset = queryset.filter(route__starting_point__icontains=starting_point)
        
        # Filter by endpoint if provided
        if endpoint:
            queryset = queryset.filter(route__endpoint__icontains=endpoint)

        return queryset
    
        #  date_param = self.request.query_params.get('date', None)

        # if date_param:
        #     try:
        #         # Convert the string to a date object for filtering
        #         ride_date = datetime.strptime(date_param, '%Y-%m-%d').date()
        #         queryset = queryset.filter(date=ride_date)


class JoinRideView(APIView):
    
    def post(self, request):
        serializer = RidePartnerSerializer(data=request.data)
        
        if serializer.is_valid():
            # Check if there are enough available seats (you may need to implement this logic)
            ride_id = request.data.get('ride')
            ride = Ride.objects.get(id=ride_id)

            if ride.available_seats == 0:
                    return Response({"error": "Ride is full."}, status=status.HTTP_400_BAD_REQUEST)


            if ride.available_seats <= serializer.validated_data['seats']:
                return Response({"error": "Not enough available seats."}, status=status.HTTP_400_BAD_REQUEST)

            # Save the ride partner instance
            ride_partner = serializer.save(ride=ride)

            # Update available seats in the Ride instance
            # ride.available_seats -= serializer.validated_data['seats']
            # ride.save()

            return Response({"partner": {"id": ride_partner.id}}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    



class AcceptRidePartnerView(APIView):
    def post(self, request, partner_id):
        try:
            ride_partner = RidePartner.objects.get(id=partner_id)
            ride = get_object_or_404(Ride,id = ride_partner.ride.id)


            ride_partner.status = 'accepted'  # Update status to accepted
            ride_partner.save()

            ride.available_seats -= ride_partner.seats
            ride.save()


            return Response(RidePartnerSerializer(ride_partner).data, status=status.HTTP_200_OK)
        except RidePartner.DoesNotExist:
            return Response({'error': 'Ride partner not found.'}, status=status.HTTP_404_NOT_FOUND)
        

class DeclineRidePartnerView(APIView):
    def post(self, request, partner_id):
        try:
            ride_partner = RidePartner.objects.get(id=partner_id)
            ride_partner.status = 'rejected'  # Update status to rejected
            ride_partner.save()
            return Response(RidePartnerSerializer(ride_partner).data, status=status.HTTP_200_OK)
        except RidePartner.DoesNotExist:
            return Response({'error': 'Ride partner not found.'}, status=status.HTTP_404_NOT_FOUND)

class PartnerDetailView(APIView):
    def get(self, request, partner_id):
        try:
            # Retrieve the ride partner by ID
            partner = RidePartner.objects.get(id=partner_id)
            user = CustomUser.objects.get(id=partner.user.id)  # Assuming RidePartner has a ForeignKey to CustomUser
            ride = Ride.objects.get(id=partner.ride.id)
            # Serialize the partner and user data
            partner_serializer = RidePartnerSerializer(partner)
            user_serializer = UserSerializer(user)
            ride_serializer = RideSerializer(ride)

            # Construct response data
            response_data = {
                'partner': partner_serializer.data,
                'user': user_serializer.data,
                'ride':ride_serializer.data,
            }

            return Response(response_data, status=status.HTTP_200_OK)
        except RidePartner.DoesNotExist:
            return Response({'error': 'Ride partner not found.'}, status=status.HTTP_404_NOT_FOUND)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        


class PickupPartner(APIView):
    def post(self, request, partner_id):
        try:
            # Retrieve the ride partner by ID
            ride_partner = RidePartner.objects.get(id=partner_id)
            
            # Update the status to 'picked_up' (or however you define it)
            ride_partner.status = 'pickedup'
            ride_partner.is_pickedup = True
            ride_partner.save()
            
            return Response({'message': 'Partner picked up successfully.'}, status=status.HTTP_200_OK)
        except RidePartner.DoesNotExist:
            return Response({'error': 'Ride partner not found.'}, status=status.HTTP_404_NOT_FOUND)
        

class DropoffPartner(APIView):
     def post(self, request, partner_id):
        try:
            # Retrieve the ride partner by ID
            ride_partner = RidePartner.objects.get(id=partner_id)
            
            # Update the status to 'picked_up' (or however you define it)
            ride_partner.status = 'dropedoff'
            ride_partner.save()
            
            return Response({'message': 'Partner picked up successfully.'}, status=status.HTTP_200_OK)
        except RidePartner.DoesNotExist:
            return Response({'error': 'Ride partner not found.'}, status=status.HTTP_404_NOT_FOUND)


class RideStart(APIView):
    def post(self,request,ride_id):
        try:
            ride = Ride.objects.get(id= ride_id)
            ride.status = 'ongoing'
            ride.save()

            return Response({'mesasage':'Ride started'},status=status.HTTP_200_OK)
        except Ride.DoesNotExist:
            return Response({'error':"ride not found"},status=status.HTTP_400_BAD_REQUEST)
        


class RideRoute(APIView):
    def get(self, request, ride_id):
        try:
            # Retrieve the ride partner by ID
            ride = Ride.objects.get(id=ride_id)
            ride_partners = RidePartner.objects.filter(ride_id=ride_id)  # Replace 'ride_id' with the actual ID of the ride
            user = CustomUser.objects.get(id=ride.user.id)  # Assuming RidePartner has a ForeignKey to CustomUser
            # Serialize the partner and user data
            partner_serializer = RidePartnerSerializer(ride_partners,many=True)
            user_serializer = UserSerializer(user)
            ride_serializer = RideSerializer(ride)

            # Construct response data
            response_data = {
                'partner': partner_serializer.data,
                'user': user_serializer.data,
                'ride':ride_serializer.data,
            }

            return Response(response_data, status=status.HTTP_200_OK)
        except RidePartner.DoesNotExist:
            return Response({'error': 'Ride partner not found.'}, status=status.HTTP_404_NOT_FOUND)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        
class  RideCompleted(APIView):
    def post(self, request, ride_id):
        try :
            ride = Ride.objects.get(id=ride_id)
            ride.status = 'completed'
            ride.is_completed = True
            ride.save()

            try:
                partners = RidePartner.objects.filter(ride=ride)
                filteredpartners = partners.filter(status="pickedup")
                
                for partner in filteredpartners:
                    partner.status = 'dropedoff'
                    partner.save()

            except RidePartner.DoesNotExist:
                pass

            return Response({'message':'ride completed'},status=status.HTTP_200_OK)
        except RidePartner.DoesNotExist:
            return Response({'error': 'Ride partner not found.'}, status=status.HTTP_404_NOT_FOUND)




class RideDetail(APIView):
    def get(self,request,partner_id):
        partner = get_object_or_404(RidePartner,id = partner_id)
        ride = get_object_or_404(Ride,id = partner.ride.id)
        user = get_object_or_404(CustomUser,id = ride.user.id)


        ride_serializer = RideSerializer(ride)
        partner_serializer = RidePartnerSerializer(partner)
        user_serializer = UserSerializer(user)

        data = {

            'ride':ride_serializer.data,
            'partner':partner_serializer.data,
            'user':user_serializer.data,

        }


        return Response(data, status=status.HTTP_200_OK)


class CancleRide(APIView):
    def post(self,request,partner_id):
    
            partner = get_object_or_404(RidePartner,id = partner_id)
            ride = get_object_or_404(Ride,id = partner.ride.id)

            partner.status = 'cancled'
            ride.total_seats += partner.seats
            ride.available_seats += partner.seats
            
            partner.save()
            ride.save()
            return Response({'message':'Cancellation succefull'},status=status.HTTP_200_OK)
       


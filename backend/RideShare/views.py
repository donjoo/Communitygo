from django.shortcuts import render
from .serializers import RideSerializer,RideRouteSerializer # type: ignore
from rest_framework.views import APIView
from rest_framework.permissions import BasePermission
from rest_framework.response import Response
from rest_framework import status ,generics, filters
from django.shortcuts import get_object_or_404
from .models import Ride,RideRoute,RidePartner

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


    def get(self,request,ride_id):


            ride = get_object_or_404(Ride,id=ride_id)
            rideserializer = RideSerializer(ride)


            # data = {
            #     ride:rideserializer.data,
            # }
            print(rideserializer.data)

            return Response(rideserializer.data,status=status.HTTP_200_OK)
       
     
class RideSearch(generics.ListAPIView):
    queryset = Ride.objects.all()
    serializer_class = RideSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        starting_point = self.request.query_params.get('starting_point', None)
        endpoint = self.request.query_params.get('endpoint', None)

        if starting_point:
            queryset = queryset.filter(route__starting_point__icontains=starting_point)
        
        if endpoint:
            queryset = queryset.filter(route__endpoint__icontains=endpoint)

        return queryset
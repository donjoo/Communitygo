from django.shortcuts import render
from .serializers import RideSerializer # type: ignore
from rest_framework.views import APIView
from rest_framework.permissions import BasePermission
from rest_framework.response import Response
from rest_framework import status


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


    
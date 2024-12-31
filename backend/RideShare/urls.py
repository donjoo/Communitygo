from django.urls import path
from .views import MakeRide

app_name='RideShare'


urlpatterns = [
    path('make_a_ride/',MakeRide.as_view(),name='make_a_ride'),
    
]

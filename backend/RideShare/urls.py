from django.urls import path
from .views import MakeRide,RideSearch

app_name='RideShare'


urlpatterns = [
    path('make_a_ride/',MakeRide.as_view(),name='make_a_ride'),
    path('<int:ride_id>/make_a_ride/', MakeRide.as_view(), name='get_ride'),
    path('joinridesearch/',RideSearch.as_view(),name='ride_search'),
    
]

from django.urls import path
from .views import MakeRide,RideSearch,JoinRideView,AcceptRidePartnerView,DeclineRidePartnerView,PartnerDetailView,PickupPartner,RideStart,RideRoute,RideCompleted,DropoffPartner

app_name='RideShare'


urlpatterns = [
    path('make_a_ride/',MakeRide.as_view(),name='make_a_ride'),
    path('<int:ride_id>/make_a_ride/', MakeRide.as_view(), name='get_ride'),
    path('joinridesearch/',RideSearch.as_view(),name='ride_search'),
    path('joinride/',JoinRideView.as_view(),name='ride_join'),
    path('ride-partner/accept/<int:partner_id>/', AcceptRidePartnerView.as_view(), name='accept_ride_partner'),
    path('ride-partner/decline/<int:partner_id>/', DeclineRidePartnerView.as_view(), name='decline_ride_partner'),
    path('<int:partner_id>/partnerdetail/', PartnerDetailView.as_view(), name='partner_detail'),
    path('partner/<int:partner_id>/pickup/',PickupPartner.as_view(),name='pickup_partner'),
    path('partner/<int:partner_id>/dropoff/',DropoffPartner.as_view(),name='pickup_partner'),
    path('ride/<int:ride_id>/start/',RideStart.as_view(),name='ride_start'),
    path('ride/<int:ride_id>/route/',RideRoute.as_view(),name="ride_route"),
    path('ride/<int:ride_id>/complete/',RideCompleted.as_view(),name='ride_completed'),
]

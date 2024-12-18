from django.urls import path
from .views import RequestDelivery,DeliveryList,DeliverySearch,AcceptDelivery,DeliveryDetailView,Courier_details,Rate_courier,Courier_completed,courier_currlocation,Pickedup_StatusUpdate,verify_otp

app_name='Delivery'

urlpatterns = [
    path('request_delivery/',RequestDelivery.as_view(),name='request_delivery'),
    path('deliverylist/',DeliveryList.as_view(),name='delivery_list'),
    path('deliverysearch/',DeliverySearch.as_view(),name="delivery_search"),
    path('courier_currlocation/<int:delivery_id>/',courier_currlocation,name='courier_currlocation'),
    path('<int:delivery_id>/acceptdelivery/',AcceptDelivery.as_view(),name='accept_delivery'),
    path('<int:delivery_id>/deliverydetail/',DeliveryDetailView.as_view(),name='delivery_detail'),
    path('<int:delivery_id>/courierdetails/',Courier_details.as_view(),name='courier_details'),
    path('<int:delivery_id>/picked_up/',Pickedup_StatusUpdate,name='pickedup_status'),
    path('<int:delivery_id>/verify-otp/',verify_otp,name='verify_otp'),
    path('<int:delivery_id>/couriercompleted/',Courier_completed,name='courier_completed'),
    path('<int:courier_id>/ratecourier',Rate_courier,name='courier_rating'),


]

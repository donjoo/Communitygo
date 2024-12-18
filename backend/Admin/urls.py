from django.urls import path
from .views import AdminTokenObtainView,AdminDashboardView,UserList,toggle_user_status,DeliveryList,UpdateDeliveryStatusView,delete_user,user_detail,Create_user,DeliveryDetailView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

app_name='Admin'

urlpatterns = [
    path('admin/token/',AdminTokenObtainView.as_view(),name='admin_token'),
    path('admin/dashboard/',AdminDashboardView.as_view(),name='admin_dashboard'),
    path('admin/userlist/',UserList.as_view(),name='userlist'),
    # path('admin/users/<int:userId>/toggle_status/', toggle_user_status, name='toggle_user_status'),
    path('<int:user_id>/toggle_status/',toggle_user_status, name='toggle_user_status'),
    path('<int:user_id>/delete_user/',delete_user,name='delete_user'),
    path('deliverylist/',DeliveryList.as_view(),name='deliverylist'),
    path('delivery/<int:delivery_id>/update-status/', UpdateDeliveryStatusView.as_view(), name='update-delivery-status'),
    path('admin/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('userdetail/<int:user_id>/', user_detail.as_view(), name='user-detail'),
    path('create_user/',Create_user.as_view(),name='create_user'),
    path('<int:delivery_id>/deliverydetail/',DeliveryDetailView.as_view(),name='delivery_detail'),

]
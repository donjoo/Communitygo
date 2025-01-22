from django.urls import path
from .views import AdminTokenObtainView,AdminDashboardView,UserList,toggle_user_status,DeliveryList,UpdateDeliveryStatusView,delete_user,user_detail,Create_user,DeliveryDetailView,AdminGoogleAuth,DashboardView,CountView,RecentDeliveriesList,UserRegistrationStats,RideOverviewStats,MonthlyRevenueStats,TopCouriersView,DeliveryOverview,PackageSizeOverview,RecentRidesOverview,RideListView,UpdateRideStatusView,RideDetail
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

app_name='Admin'

urlpatterns = [
    path('admin/token/',AdminTokenObtainView.as_view(),name='admin_token'),
    path('authgoogleadmin/',AdminGoogleAuth.as_view(),name='admin_google_auth'),
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
    path('dashboard/data/',DashboardView.as_view(),name='dashboard_data'),
    path('dashboard/user_count/', CountView.as_view(), {'data_type': 'user_count'}, name='user-count'),
    path('dashboard/deliveries_count/', CountView.as_view(), {'data_type': 'ongoing_deliveries'}, name='ongoing-deliveries'),
    path('dashboard/rides_count/', CountView.as_view(), {'data_type': 'ongoing_rides'}, name='ongoing-rides'),
    path('dashboard/revenue/', CountView.as_view(), {'data_type': 'total_revenue'}, name='total_revenue'),
    path('dashboard/recent/deliveries/',RecentDeliveriesList.as_view(),name='recent_delivery_list'),
    path('dashboard/user_registrations/', UserRegistrationStats.as_view(), name='user-registrations'),
    path('dashboard/ride_overview/',RideOverviewStats.as_view(),name='ride_overview'),
    path('dashboard/monthly_revenue/',MonthlyRevenueStats.as_view(),name='revenue_overview'),
    path('dashboard/couriers/top/', TopCouriersView.as_view(), name='top_couriers'),
    path('dashboard/delivery_overview/', DeliveryOverview.as_view(), name='delivery_overview'),
    path('dashboard/package-size-overview/', PackageSizeOverview.as_view(), name='package_size_overview'),
    path('dashboard/recent-rides/', RecentRidesOverview.as_view(), name='recent_rides_overview'),
    path('ridemanagement/rides/', RideListView.as_view(), name='ride-list'),
    path('ride/<int:pk>/update-status/', UpdateRideStatusView.as_view(), name='update-ride-status'),
    path('ride/<int:ride_Id>/ridedetail/', RideDetail.as_view(), name='update-ride-status'),





]
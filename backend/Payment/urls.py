from django.urls import path
from . import views
from .views import PaymentViewSet,Earnings
app_name='Payment'


# urlpatterns = [
#     path('create-order/', views.create_order, name='create-order'),
#     path('verify-payment/', views.verify_payment, name='verify-payment'),
#     path('complete-delivery/', views.complete_delivery, name='complete-delivery'),
#     path('complete-ride/', views.complete_ride, name='complete-ride'),
    # path('transactions/', views.TransactionListView.as_view(), name='transaction-list'),
    # path('balance/', views.WalletDetailView.as_view(), name='wallet-detail'),

# ]


urlpatterns = [
    path('create_order/', PaymentViewSet.as_view({'post': 'create_order'}), name='create-order'),
    path('verify_payment/', PaymentViewSet.as_view({'post': 'verify_payment'}), name='verify-payment'),
    path('complete_delivery/', views.complete_delivery, name='complete-delivery'),
    path('complete_ride/',views.complete_ride, name='complete-ride'),
    path('my_earnings/', Earnings.as_view(), name='my_earnings'),

]
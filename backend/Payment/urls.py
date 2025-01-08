from django.urls import path
from . import views
from.views import PaymentViewSet
app_name='Payment'


urlpatterns = [
    path('create-order/', views.create_order, name='create-order'),
    path('verify-payment/', views.verify_payment, name='verify-payment'),
    path('complete-delivery/', views.complete_delivery, name='complete-delivery'),
    path('complete-ride/', views.complete_ride, name='complete-ride'),
    # path('transactions/', views.TransactionListView.as_view(), name='transaction-list'),
    # path('balance/', views.WalletDetailView.as_view(), name='wallet-detail'),

]


urlpatterns = [
    path('create-order/', PaymentViewSet.as_view({'post': 'create_order'}), name='create-order'),
    path('verify-payment/', PaymentViewSet.as_view({'post': 'verify_payment'}), name='verify-payment'),
    path('complete-delivery/', PaymentViewSet.as_view({'post': 'complete_delivery'}), name='complete-delivery'),
    path('complete-ride/', PaymentViewSet.as_view({'post': 'complete_ride'}), name='complete-ride'),
]
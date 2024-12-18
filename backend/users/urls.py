from django.urls import path
from .views import SignupView , LoginView,UserProfileView

app_name='users'

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/',LoginView.as_view(), name='login'),
    path('profile/',UserProfileView.as_view(),name='profile'),
    
    
]    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
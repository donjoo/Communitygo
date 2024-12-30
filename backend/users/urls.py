from django.urls import path
from .views import SignupView , LoginView,UserProfileView,OTPVerificationView,ResendOTPView,UserGoogleAuth,AddPhoneNumberView

app_name='users'

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('verifyotp/',OTPVerificationView.as_view(),name='verify_otp'),
    path('resend_otp/',ResendOTPView.as_view(),name="otp_resend"),
    path('login/',LoginView.as_view(), name='login'),
    path('authgoogle/',UserGoogleAuth.as_view(),name='google_login'),
    path('addphonenumber/',AddPhoneNumberView.as_view(),name='add_phonenumber'),
    path('profile/',UserProfileView.as_view(),name='profile'),
    
    
]    
    
    
    
    
    
    
    

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
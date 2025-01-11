from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UserProfile,OTPRecord
from django.contrib.auth.hashers import make_password
from rest_framework.exceptions import ValidationError
from django.core.mail import send_mail
from django.utils.timezone import now
from datetime import timedelta


User = get_user_model()






class UserSerializer(serializers.ModelSerializer):



    class Meta:
        model = User
        fields = ('id','first_name', 'last_name', 'username','email','phone_number','password', 'is_active','is_deleted','email_verified','date_joined','last_login')
        extra_kwargs = {'password':{'write_only':True}}
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
    def validate_email(self, value):
        # Check if the email already exists in the database
        user = self.instance  # Get the current user instance
        if user and value != user.email:  # Check if the email is changing
            if User.objects.filter(email=value).exists():
                raise ValidationError('A user with this email address already exists. Please use a different email.')
        return value
    
    # def update(self, instance, validated_data):
    #     # Ensure the profile exists for the user
    #     profile_data = validated_data.pop('profile', {})
    #     profile_picture = profile_data.get('profile_picture')

    #     # Update the user's attributes
    #     for attr, value in validated_data.items():
    #         setattr(instance, attr, value)

    #     # Save the user instance
    #     instance.save()

    #     # Check if the profile exists; if not, create one
    #     if profile_picture:
    #         profile, created = UserProfile.objects.get_or_create(user=instance)
    #         profile.profile_picture = profile_picture
    #         profile.save()

    #     return instance


    

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['user', 'profile_picture']


    def update(self, instance, validated_data):
        instance.profile_picture = validated_data.get('profile_picture', instance.profile_picture)
        instance.save()
        return instance




class SendOtpSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is not associated with any account.")
        return value

    def save(self):
        email = self.validated_data['email']
        user = User.objects.get(email=email)
        
        otp_record, created = OTPRecord.objects.get_or_create(user=user,
            defaults={
        'expires_at': now() + timedelta(minutes=10),
        'created_at': now(),
    })
        otp_record.generate_otp()

        # Send OTP via email (implement your email sending logic here)
        send_mail(
            'Your OTP Code',
            f'Your OTP code is {otp_record.otp}',
            'from@example.com',  # Replace with your sender email
            [email],
            fail_silently=False,
        )

class ChangePasswordSerializer(serializers.Serializer):
    otp = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_otp(self, value):
        user = self.context['request'].user
        try:
            otp_record = user.otp_record
            if not otp_record.is_valid() or otp_record.otp != value:
                raise serializers.ValidationError("Invalid or expired OTP.")
        except OTPRecord.DoesNotExist:
            raise serializers.ValidationError("No OTP record found.")
        return value

    def save(self):
        user = self.context['request'].user
        new_password = self.validated_data['new_password']
        
        user.set_password(new_password)
        
        # Clear the OTP record after successful password change
        user.otp_record.delete()
        
        user.save()
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UserProfile
from django.contrib.auth.hashers import make_password
from rest_framework.exceptions import ValidationError


User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','first_name', 'last_name', 'username','email','phone_number','password', 'is_active',)
        extra_kwargs = {'password':{'write_only':True}}
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
    def validate_email(self, value):
        # Check if the email already exists in the database
        if User.objects.filter(email=value).exists():
            raise ValidationError('A user with this email address already exists. Please use a different email.')
        return value

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['username', 'profile_picture']

    def update(self, instance, validated_data):
        user = instance.user
        user.username = validated_data.get('username', user.username)
        user.save()
        instance.profile_picture = validated_data.get('profile_picture', instance.profile_picture)
        instance.save()
        return instance
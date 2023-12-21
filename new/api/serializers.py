# serializers.py
from rest_framework import serializers
from .models import CustomUser, Workout

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'name', 'email', 'weight', 'height', 'bmi', 'password']

class WorkoutGetSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    date = serializers.DateField(format="%Y-%m-%d")

    class Meta:
        model = Workout
        fields = ['id', 'user', 'user_email', 'date', 'duration_minutes']


class WorkoutCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = ['user', 'date', 'duration_minutes']
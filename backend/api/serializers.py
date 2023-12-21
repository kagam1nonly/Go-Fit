# serializers.py
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.contrib.auth import get_user_model, authenticate
from .models import Workout, WorkoutExercise, Exercise
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import PermissionDenied

UserModel = get_user_model()

class UserRegisterSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserModel
		fields = '__all__'
	def create(self, clean_data):
		user_obj = UserModel.objects.create_user(email=clean_data['email'], password=clean_data['password'])
		user_obj.username = clean_data['username']
		user_obj.save()
		return user_obj

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    token = serializers.CharField(read_only=True)

    def validate(self, data):
        email = data.get('email', '')
        password = data.get('password', '')

        # Your custom validation logic for email and password here

        return data

    def check_user(self, data):
        email = data.get('email', '')
        password = data.get('password', '')

        # Your authentication logic here
        user = authenticate(username=email, password=password)

        if user:
            # If authentication is successful, create or get the token for the user
            token, created = Token.objects.get_or_create(user=user)

            # Add the token to the serializer data
            self.validated_data['token'] = token.key

        return user

    def to_representation(self, instance):
        data = super().to_representation(instance)
        return data

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserModel
		fields = ('id', 'email', 'username')

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

class WorkoutExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutExercise
        fields = ['user', 'exercise', 'sets', 'repetitions', 'weight']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return {
            'user': f"{instance.user}",
            'exercise': instance.exercise.name,
            'sets': instance.sets,
            'repetitions': instance.repetitions,
            'weight': instance.weight,
        }

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = '__all__'
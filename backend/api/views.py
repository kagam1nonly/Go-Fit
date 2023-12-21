from django.contrib.auth import get_user_model, login, logout
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from .serializers import WorkoutGetSerializer, WorkoutExerciseSerializer, UserRegisterSerializer, UserLoginSerializer, UserSerializer, ExerciseSerializer
from rest_framework.authentication import SessionAuthentication
from .models import Workout, AppUser, WorkoutExercise, Exercise
from .validations import custom_validation, validate_email, validate_password
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

class WorkoutView(generics.ListCreateAPIView):
    serializer_class = WorkoutGetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filter workouts based on the current user
        return self.request.user.workouts.all()

    def perform_create(self, serializer):
        # Associate the new workout with the current user
        serializer.save(user=self.request.user)
	
class WorkoutDetailView(APIView):
    def get_object(self, pk):
        try:
            return Workout.objects.get(pk=pk)
        except Workout.DoesNotExist:
            raise status.HTTP_404_NOT_FOUND

    def get(self, request, pk, *args, **kwargs):
        workout = self.get_object(pk)
        serializer = WorkoutGetSerializer(workout)
        return Response(serializer.data)

    def put(self, request, pk, *args, **kwargs):
        workout = self.get_object(pk)
        serializer = WorkoutGetSerializer(workout, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, *args, **kwargs):
        workout = self.get_object(pk)
        workout.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class WorkoutExerciseCreateView(generics.ListCreateAPIView):
    serializer_class = WorkoutExerciseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return WorkoutExercise.objects.filter(user=self.request.user)
	
class ExerciseListCreateView(generics.ListCreateAPIView):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer


class UserRegister(APIView):
	permission_classes = (permissions.AllowAny,)
	def post(self, request):
		clean_data = custom_validation(request.data)
		serializer = UserRegisterSerializer(data=clean_data)
		if serializer.is_valid(raise_exception=True):
			user = serializer.create(clean_data)
			if user:
				return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(status=status.HTTP_400_BAD_REQUEST)

class UserLogin(APIView):
	permission_classes = (permissions.AllowAny,)
	authentication_classes = (SessionAuthentication,)
	##
	def post(self, request):
		data = request.data
		assert validate_email(data)
		assert validate_password(data)
		serializer = UserLoginSerializer(data=data)

		if serializer.is_valid(raise_exception=True):
			user = serializer.check_user(data)
			login(request, user)
			return Response(serializer.data, status=status.HTTP_200_OK)

class UserLogout(APIView):
	permission_classes = (permissions.AllowAny,)
	authentication_classes = ()
	def post(self, request):
		logout(request)
		return Response(status=status.HTTP_200_OK)

class UserView(APIView):
    # permission_classes = (permissions.IsAuthenticated,)
    # authentication_classes = (SessionAuthentication,)

    def get(self, request):
        
        # Serialize the users
        serializer = UserSerializer(request.user)
    
        # Return the serialized data
        return Response({'users': serializer.data}, status=status.HTTP_200_OK)
	
class AllUserView(APIView):

	def get(self, request):
		# Retrieve all users
		all_users = get_user_model().objects.all()
		
		# Serialize the users
		serializer = UserSerializer(all_users, many=True)
	
		# Return the serialized data
		return Response({'users': serializer.data}, status=status.HTTP_200_OK)

from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView, CreateAPIView, ListAPIView
from rest_framework.response import Response
from rest_framework import status, generics
from .serializers import CustomUserSerializer, WorkoutGetSerializer, WorkoutCreateSerializer
from .models import CustomUser, Workout, CustomToken
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.http import JsonResponse
import json
from django.shortcuts import redirect
from django.contrib.auth import get_user_model

class WorkoutView(ListCreateAPIView):
    queryset = Workout.objects.all()
    serializer_class = WorkoutGetSerializer

    def create(self, request, *args, **kwargs):
        # Convert 'duration_minutes' to an integer
        request.data['duration_minutes'] = int(request.data.get('duration_minutes', 0))
        
        # Continue with the standard create logic
        return super().create(request, *args, **kwargs)

@csrf_exempt
@require_POST
def login_view(request):
    data = json.loads(request.body)

    email = data.get('email')
    password = data.get('password')


    # Validate email and password
    if not email or not password:
        return JsonResponse({"error": "Email and password are required"}, status=400)

    # Authenticate user
    user = CustomUser.objects.filter(email=email, password=password).first()

    if user is not None and user.password == password:
        token, created = CustomToken.objects.get_or_create(user=user)
        return JsonResponse({"token": token.key, "success": "Logged in successfully!"}, status=200)
    else:
        return JsonResponse({"error": "Invalid email or password"}, status=401)

        
class AccountFormView(APIView):
    @csrf_exempt
    def post(self, request, format=None):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, pk=None, *args, **kwargs):
        if pk is not None:
            try:
                account_form = CustomUser.objects.get(id=pk)
                serializer = CustomUserSerializer(account_form)
                return Response(serializer.data)
            except CustomUser.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            # No pk provided, list all accounts.
            accounts = CustomUser.objects.all()
            serializer = CustomUserSerializer(accounts, many=True)
            return Response(serializer.data)

    def put(self, request, pk, format=None):
        try:
            account_form = CustomUser.objects.get(id=pk)
        except CustomUser.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = CustomUserSerializer(account_form, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk, format=None):
        account_form = CustomUser.objects.get(id=pk)
        serializer = CustomUserSerializer(account_form, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, *args, **kwargs):
        try:
            account_form = CustomUser.objects.get(id=pk)
            account_form.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except CustomUser.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

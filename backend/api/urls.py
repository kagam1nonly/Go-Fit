from django.urls import path
from . import views
from .views import WorkoutView, WorkoutExerciseCreateView, ExerciseListCreateView, WorkoutDetailView

urlpatterns = [
    path('register', views.UserRegister.as_view(), name='register'),
    path('login', views.UserLogin.as_view(), name='login'),
    path('logout', views.UserLogout.as_view(), name='logout'),
    path('user', views.UserView.as_view(), name='user'),
    path('users', views.AllUserView.as_view(), name='users'),
    path('exercises/', ExerciseListCreateView.as_view(), name='exercise'),
    path('workouts/', WorkoutView.as_view(), name='workouts'),
    path('workouts/<int:pk>/', WorkoutDetailView.as_view(), name='workout-detail'),
    path('workout-exercises/', WorkoutExerciseCreateView.as_view(), name='workout-exercise'),
]
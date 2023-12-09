from django.urls import path, include
from .views import AccountFormView, login_view
from rest_framework.routers import DefaultRouter
from .views import WorkoutViewSet

router = DefaultRouter()
router.register(r'workouts', WorkoutViewSet, basename='workouts')

urlpatterns = [
    path('api/account_form/', AccountFormView.as_view(), name='account_form'),
    path('api/login/', login_view, name='login'),
    path('api/', include(router.urls)),
]
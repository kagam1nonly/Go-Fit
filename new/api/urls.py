from django.urls import path, include
from .views import AccountFormView, login_view
from rest_framework.routers import DefaultRouter
from .views import WorkoutView

urlpatterns = [
    path('api/workouts/', WorkoutView.as_view(), name='workouts'),
    path('api/account_form/', AccountFormView.as_view(), name='account_form'),
    path('api/login/', login_view, name='login'),
    # path('api/', include(router.urls)),
]
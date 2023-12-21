from django.contrib import admin
from .models import CustomUser, Workout, Exercise, WorkoutExercise

class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'height', 'weight', 'bmi', 'password')

class WorkoutAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'date', 'duration_minutes')


# Register your models here.
admin.site.register(Workout, WorkoutAdmin)
admin.site.register(Exercise)
admin.site.register(WorkoutExercise)
admin.site.register(CustomUser, CustomUserAdmin)
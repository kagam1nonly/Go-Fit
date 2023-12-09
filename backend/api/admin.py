from django.contrib import admin
from .models import CustomUser, Workout, Exercise, WorkoutExercise

class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'height', 'weight', 'bmi', 'password')

# Register your models here.
admin.site.register(Workout)
admin.site.register(Exercise)
admin.site.register(WorkoutExercise)
admin.site.register(CustomUser, CustomUserAdmin)
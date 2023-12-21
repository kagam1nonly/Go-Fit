from django.contrib import admin
from .models import AppUser, Workout, Exercise, WorkoutExercise


class WorkoutAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'date', 'duration_minutes')


# Register your models here.
admin.site.register(Workout, WorkoutAdmin)
admin.site.register(Exercise)
admin.site.register(WorkoutExercise)
admin.site.register(AppUser)
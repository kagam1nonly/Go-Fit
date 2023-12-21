# models.py
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models

class AppUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('An email is required.')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class AppUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=50, unique=True)
    username = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = AppUserManager()

    def __str__(self):
        return self.username
    
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='app_users',
        related_query_name='app_user',
        blank=True,
        verbose_name='groups',
        help_text='The groups this user belongs to.',
    )
    
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='app_users',
        related_query_name='app_user',
        blank=True,
        verbose_name='user permissions',
        help_text='Specific permissions for this user.',
    )

class Workout(models.Model):
    user = models.ForeignKey('AppUser', null=True, on_delete=models.CASCADE, related_name='workouts')
    date = models.DateField()
    duration_minutes = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.user.username}'s Workout on {self.date}"

class Exercise(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name

class WorkoutExercise(models.Model):
    user = models.ForeignKey('AppUser', null=True, on_delete=models.CASCADE, related_name='workout_user')
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, related_name='workout_exercises')
    sets = models.PositiveIntegerField()
    repetitions = models.PositiveIntegerField()
    weight = models.FloatField(null=True, blank=True)

    def __str__(self):
        if self.user:
            return f"{self.user.username}'s Exercise - {self.exercise.name}"
        else:
            return f"Anonymous User's Exercise - {self.exercise.name}"
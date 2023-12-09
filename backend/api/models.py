# models.py
import binascii
import os
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils import timezone
from django.db import models

class CustomUser(models.Model):
    name = models.CharField(max_length=30, null=False, default="sample")
    email = models.EmailField(unique=True, null=False, default='example@gmail.com')
    height = models.FloatField(null=True, blank=True)
    weight = models.FloatField(null=True, blank=True)
    bmi = models.FloatField(null=True, blank=True)
    password = models.CharField(max_length=16, null=False, default="12345678")

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.email

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class CustomToken(models.Model):
    key = models.CharField(max_length=40, primary_key=True)
    user = models.OneToOneField(CustomUser, related_name='auth_token', on_delete=models.CASCADE)
    created = models.DateTimeField(default=timezone.now)

    def save(self, *args, **kwargs):
        if not self.key:
            self.key = self.generate_key()
        return super().save(*args, **kwargs)

    def generate_key(self):
        return binascii.hexlify(os.urandom(20)).decode()

    class Meta:
        ordering = ('-created',)

class Workout(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    date = models.DateField()
    duration_minutes = models.PositiveIntegerField()

class Exercise(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)

class WorkoutExercise(models.Model):
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    sets = models.PositiveIntegerField()
    repetitions = models.PositiveIntegerField()
    weight = models.FloatField(null=True, blank=True)

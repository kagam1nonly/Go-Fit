# Generated by Django 4.2.7 on 2023-12-08 16:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_remove_customuser_date_of_birth_customuser_bmi'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customuser',
            name='user',
        ),
        migrations.AddField(
            model_name='customuser',
            name='email',
            field=models.EmailField(default='example@gmail.com', max_length=254, unique=True),
        ),
        migrations.AddField(
            model_name='customuser',
            name='name',
            field=models.CharField(default='sample', max_length=30),
        ),
        migrations.AddField(
            model_name='customuser',
            name='password',
            field=models.CharField(default='12345678', max_length=16),
        ),
    ]

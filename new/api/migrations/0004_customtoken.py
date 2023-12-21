# Generated by Django 5.0 on 2023-12-09 03:33

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_remove_customuser_user_customuser_email_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomToken',
            fields=[
                ('key', models.CharField(max_length=40, primary_key=True, serialize=False)),
                ('created', models.DateTimeField(default=django.utils.timezone.now)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='auth_token', to='api.customuser')),
            ],
            options={
                'ordering': ('-created',),
            },
        ),
    ]
import random, string
from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = [('citizen', 'citizen'), ('operator', 'operator'), ('contractor', 'contractor'), ('admin', 'admin')]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='citizen')
    phone = models.CharField(max_length=20, blank=True, db_index=True)
    national_code = models.CharField(max_length=20, blank=True)
    category = models.CharField(max_length=200, blank=True)
    member_count = models.PositiveIntegerField(default=1)
    contractor_status = models.CharField(max_length=10, choices=[('FREE', 'FREE'), ('BUSY', 'BUSY')], default='FREE')


class Request(models.Model):
    STATUS = [
        ('REGISTERED', 'REGISTERED'),
        ('REVIEWED', 'REVIEWED'),
        ('IN_PROGRESS', 'IN_PROGRESS'),
        ('COMPLETED', 'COMPLETED'),
        ('REJECTED', 'REJECTED'),
    ]
    tracking_code = models.CharField(max_length=12, unique=True, editable=False)
    citizen = models.ForeignKey(User, on_delete=models.CASCADE, related_name='requests')
    name = models.CharField(max_length=150)
    phone = models.CharField(max_length=20)
    category = models.CharField(max_length=200)
    sub_category = models.CharField(max_length=200)
    description = models.TextField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    status = models.CharField(max_length=20, choices=STATUS, default='REGISTERED')
    admin_comment = models.TextField(blank=True)
    assigned_to = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='assigned_requests', limit_choices_to={'role': 'contractor'})
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.tracking_code:
            self.tracking_code = 'SH' + ''.join(random.choices(string.digits, k=8))
        super().save(*args, **kwargs)


class RequestImage(models.Model):
    request = models.ForeignKey(Request, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='requests/%Y/%m/')


class RequestStatusHistory(models.Model):
    request = models.ForeignKey(Request, related_name='history', on_delete=models.CASCADE)
    status = models.CharField(max_length=20)
    comment = models.TextField(blank=True)
    changed_by = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)


class Feedback(models.Model):
    request = models.OneToOneField(Request, on_delete=models.CASCADE, related_name='feedback')
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

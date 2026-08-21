from django.contrib import admin
from .models import User, Request, RequestImage, RequestStatusHistory, Feedback
admin.site.register([User, Request, RequestImage, RequestStatusHistory, Feedback])

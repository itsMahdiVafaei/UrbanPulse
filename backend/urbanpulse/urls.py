from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView
from core.views import MyTokenObtainPairView
urlpatterns=[path('admin/',admin.site.urls),path('api/auth/token/',MyTokenObtainPairView.as_view()),path('api/auth/token/refresh/',TokenRefreshView.as_view()),path('api/',include('core.urls'))]+static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)

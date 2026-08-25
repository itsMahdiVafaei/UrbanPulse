from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterViewSet,
    RequestViewSet,
    CitizenViewSet,
    ContractorViewSet,
    FeedbackViewSet,
    UserProfileView  # این ویو را از فایل views.py ایمپورت می‌کنیم
)

router = DefaultRouter()
router.register('register', RegisterViewSet, basename='register')
router.register('requests', RequestViewSet, basename='requests')
router.register('citizens', CitizenViewSet, basename='citizens')
router.register('contractors', ContractorViewSet, basename='contractors')
router.register('feedback', FeedbackViewSet, basename='feedback')

# ترکیب روت‌های پیش‌فرض روتر با مسیرهای سفارشی
urlpatterns = router.urls + [
    path('profile/update/', UserProfileView.as_view(), name='profile-update'),
]
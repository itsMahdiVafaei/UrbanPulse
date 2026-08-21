from rest_framework.routers import DefaultRouter
from .views import RegisterViewSet, RequestViewSet, CitizenViewSet, ContractorViewSet, FeedbackViewSet

router = DefaultRouter()
router.register('register', RegisterViewSet, basename='register')
router.register('requests', RequestViewSet, basename='requests')
router.register('citizens', CitizenViewSet, basename='citizens')
router.register('contractors', ContractorViewSet, basename='contractors')
router.register('feedback', FeedbackViewSet, basename='feedback')
urlpatterns = router.urls

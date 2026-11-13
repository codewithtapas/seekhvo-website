from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import EnrollmentViewSet, NotificationViewSet, SupportRequestViewSet

router = DefaultRouter()
router.register("enrollments", EnrollmentViewSet, basename="enrollments")
router.register("notifications", NotificationViewSet, basename="notifications")
router.register("support-requests", SupportRequestViewSet, basename="support-requests")

urlpatterns = [
    path("", include(router.urls)),
]

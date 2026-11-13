from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import AdminAnalyticsView, ContactEnquiryViewSet, DemoBookingViewSet

router = DefaultRouter()
router.register("demo-bookings", DemoBookingViewSet, basename="demo-bookings")
router.register("enquiries", ContactEnquiryViewSet, basename="enquiries")

urlpatterns = [
    path("admin/analytics/", AdminAnalyticsView.as_view(), name="admin-analytics"),
    path("", include(router.urls)),
]

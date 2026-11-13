from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import CouponViewSet, PaymentOrderViewSet, PaymentWebhookView

router = DefaultRouter()
router.register("payments", PaymentOrderViewSet, basename="payments")
router.register("coupons", CouponViewSet, basename="coupons")

urlpatterns = [
    path("payments/webhook/<str:provider>/", PaymentWebhookView.as_view(), name="payment-webhook"),
    path("", include(router.urls)),
]

from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import CertificateViewSet, PublicCertificateVerifyView

router = DefaultRouter()
router.register("certificates", CertificateViewSet, basename="certificates")

urlpatterns = [
    path("certificates/verify/<str:certificate_id>/", PublicCertificateVerifyView.as_view(), name="certificate-verify"),
    path("", include(router.urls)),
]

from django.http import HttpResponse
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import User, log_audit_action
from apps.accounts.permissions import IsAdminUserRole
from apps.enrollments.models import Notification
from .models import Certificate
from .pdf_generator import generate_certificate_pdf, generate_qr_png_bytes
from .serializers import CertificateSerializer


class CertificateViewSet(viewsets.ModelViewSet):
    serializer_class = CertificateSerializer

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            return [IsAdminUserRole()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        qs = Certificate.objects.select_related("student", "course").all()
        if user.role == User.Role.ADMIN or user.is_superuser:
            return qs
        return qs.filter(student=user, is_revoked=False)

    def perform_create(self, serializer):
        student = serializer.validated_data["student"]
        course = serializer.validated_data["course"]
        cert = serializer.save(
            issued_by=self.request.user,
            recipient_name=serializer.validated_data.get("recipient_name") or student.full_name,
            course_title=serializer.validated_data.get("course_title") or course.title,
        )
        Notification.objects.create(
            user=student,
            title=f"Certificate Issued: {cert.course_title}",
            message=f"Certificate {cert.certificate_id} is ready to download and verify.",
            link=f"/verify/{cert.certificate_id}",
        )
        log_audit_action(
            self.request,
            "CERTIFICATE_ISSUED",
            "Certificate",
            cert.certificate_id,
            {"student": student.email, "course": course.slug},
        )

    @action(detail=True, methods=["get"])
    def download_pdf(self, request, pk=None):
        cert = self.get_object()
        if cert.is_revoked and request.user.role != User.Role.ADMIN:
            return Response({"detail": "This certificate has been revoked."}, status=403)
        pdf_buffer = generate_certificate_pdf(cert)
        response = HttpResponse(pdf_buffer.getvalue(), content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="Seekhvo-{cert.certificate_id}.pdf"'
        return response

    @action(detail=True, methods=["get"])
    def qr_code(self, request, pk=None):
        cert = self.get_object()
        qr_buf = generate_qr_png_bytes(cert.verification_url)
        return HttpResponse(qr_buf.getvalue(), content_type="image/png")


class PublicCertificateVerifyView(APIView):
    """Public QR verification endpoint returning authentic certificate status."""

    permission_classes = [permissions.AllowAny]

    def get(self, request, certificate_id: str):
        try:
            cert = Certificate.objects.select_related("course").get(certificate_id=certificate_id.strip().upper())
        except Certificate.DoesNotExist:
            return Response(
                {"valid": False, "detail": "No Seekhvo certificate found matching this ID."},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(
            {
                "valid": not cert.is_revoked,
                "is_revoked": cert.is_revoked,
                "certificate_id": cert.certificate_id,
                "recipient_name": cert.recipient_name,
                "course_title": cert.course_title,
                "course_slug": cert.course.slug,
                "issued_date": cert.issued_date,
                "grade_or_remarks": cert.grade_or_remarks,
                "issuer": "Seekhvo AI Learning (seekhvo.space)",
            }
        )

from decimal import Decimal
from django.db.models import Sum
from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from apps.accounts.models import User
from apps.accounts.permissions import IsAdminUserRole
from apps.courses.models import Course
from apps.enrollments.models import Enrollment
from apps.integrations.services import EmailService, WhatsAppService
from apps.payments.models import PaymentOrder
from .models import ContactEnquiry, DemoBooking
from .serializers import (
    ContactEnquiryPublicCreateSerializer,
    ContactEnquirySerializer,
    DemoBookingPublicCreateSerializer,
    DemoBookingSerializer,
)


class DemoBookingViewSet(viewsets.ModelViewSet):
    queryset = DemoBooking.objects.select_related("course").all()
    filterset_fields = ["status"]
    search_fields = ["full_name", "email", "phone", "course_interest"]

    def get_permissions(self):
        if self.action == "create":
            return [permissions.AllowAny()]
        return [IsAdminUserRole()]

    def get_throttles(self):
        if self.action == "create":
            self.throttle_scope = "lead"
            return [ScopedRateThrottle()]
        return super().get_throttles()

    def get_serializer_class(self):
        if self.action == "create":
            return DemoBookingPublicCreateSerializer
        return DemoBookingSerializer

    def perform_create(self, serializer):
        booking = serializer.save()
        interest = booking.course_interest or (booking.course.title if booking.course else "AI Training Program")
        EmailService.send_demo_confirmation(booking.full_name, booking.email, interest)
        if booking.phone:
            WhatsAppService.send_template_message(booking.phone, "seekhvo_demo_confirmation", [booking.full_name, interest])


class ContactEnquiryViewSet(viewsets.ModelViewSet):
    queryset = ContactEnquiry.objects.all()
    filterset_fields = ["status"]
    search_fields = ["full_name", "email", "subject"]

    def get_permissions(self):
        if self.action == "create":
            return [permissions.AllowAny()]
        return [IsAdminUserRole()]

    def get_throttles(self):
        if self.action == "create":
            self.throttle_scope = "lead"
            return [ScopedRateThrottle()]
        return super().get_throttles()

    def get_serializer_class(self):
        if self.action == "create":
            return ContactEnquiryPublicCreateSerializer
        return ContactEnquirySerializer


class AdminAnalyticsView(APIView):
    """Real-time analytics for the Admin Dashboard."""

    permission_classes = [IsAdminUserRole]

    def get(self, request):
        total_students = User.objects.filter(role=User.Role.STUDENT).count()
        active_courses = Course.objects.filter(is_published=True).count()
        total_enrollments = Enrollment.objects.filter(
            status__in=[Enrollment.Status.ACTIVE, Enrollment.Status.COMPLETED]
        ).count()
        paid_total = PaymentOrder.objects.filter(status=PaymentOrder.Status.PAID).aggregate(total=Sum("final_amount"))["total"] or Decimal("0.00")
        pending_payments = PaymentOrder.objects.filter(status=PaymentOrder.Status.CREATED).count()
        demo_registrations = DemoBooking.objects.count()
        new_enquiries = ContactEnquiry.objects.filter(status=ContactEnquiry.Status.NEW).count()

        return Response(
            {
                "total_students": total_students,
                "active_courses": active_courses,
                "total_enrollments": total_enrollments,
                "revenue": float(paid_total),
                "currency": "INR",
                "pending_payments": pending_payments,
                "demo_registrations": demo_registrations,
                "new_enquiries": new_enquiries,
            }
        )

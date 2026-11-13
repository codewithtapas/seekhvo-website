from decimal import Decimal
import json
import uuid
from django.db import transaction
from django.utils import timezone
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import User, log_audit_action
from apps.accounts.permissions import IsAdminUserRole
from apps.courses.models import Course
from apps.enrollments.models import Enrollment, Notification
from apps.integrations.services import EmailService
from .gateways import SandboxPaymentGateway, get_payment_gateway
from .models import Coupon, PaymentOrder, WebhookEvent
from .serializers import CouponSerializer, PaymentOrderSerializer


def _activate_enrollment_for_order(order: PaymentOrder) -> Enrollment:
    enrollment, _ = Enrollment.objects.get_or_create(
        student=order.student,
        course=order.course,
        defaults={"status": Enrollment.Status.ACTIVE},
    )
    if enrollment.status != Enrollment.Status.ACTIVE:
        enrollment.status = Enrollment.Status.ACTIVE
        enrollment.save(update_fields=["status"])

    Notification.objects.create(
        user=order.student,
        title=f"Enrolled in {order.course.title}",
        message=f"Payment {order.order_reference} verified. Your course access is now active.",
        link="/dashboard/student",
    )
    EmailService.send_enrollment_confirmation(order.student, order.course.title)
    return enrollment


class PaymentOrderViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PaymentOrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["status", "provider"]
    search_fields = ["order_reference", "gateway_order_id", "gateway_payment_id", "student__email"]

    def get_queryset(self):
        user = self.request.user
        qs = PaymentOrder.objects.select_related("student", "course").all()
        if user.role == User.Role.ADMIN or user.is_superuser:
            return qs
        return qs.filter(student=user)

    @action(detail=False, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def create_order(self, request):
        course_id = request.data.get("course_id")
        coupon_code = (request.data.get("coupon_code") or "").strip().upper()
        try:
            course = Course.objects.get(id=course_id, is_published=True)
        except Course.DoesNotExist:
            return Response({"detail": "Course not found."}, status=404)

        base_amount = Decimal(course.effective_price)
        discount_amount = Decimal("0.00")
        coupon = None
        if coupon_code:
            try:
                coupon = Coupon.objects.get(code__iexact=coupon_code, is_active=True)
                if coupon.valid_until and coupon.valid_until < timezone.now():
                    return Response({"detail": "Coupon has expired."}, status=400)
                if coupon.times_used >= coupon.max_uses:
                    return Response({"detail": "Coupon usage limit reached."}, status=400)
                discount_amount = (base_amount * Decimal(coupon.discount_percent) / Decimal("100")).quantize(Decimal("0.01"))
            except Coupon.DoesNotExist:
                return Response({"detail": "Invalid coupon code."}, status=400)

        final_amount = max(Decimal("1.00"), base_amount - discount_amount)
        amount_paise = int(final_amount * 100)

        order = PaymentOrder.objects.create(
            student=request.user,
            course=course,
            coupon=coupon,
            currency=course.currency,
            amount=base_amount,
            discount_amount=discount_amount,
            final_amount=final_amount,
        )

        gateway = get_payment_gateway()
        order.provider = gateway.provider_name
        result = gateway.create_order(
            order_reference=order.order_reference,
            amount_paise=amount_paise,
            currency=course.currency,
            customer={"id": request.user.id, "email": request.user.email, "phone": request.user.phone},
        )
        order.gateway_order_id = result.gateway_order_id
        order.save(update_fields=["provider", "gateway_order_id"])

        return Response(
            {
                "order": PaymentOrderSerializer(order).data,
                "gateway": result.client_payload,
            },
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def verify(self, request, pk=None):
        """Verifies payment cryptographically on the backend before activating course access."""
        order = self.get_object()
        if order.student != request.user and request.user.role != User.Role.ADMIN:
            return Response({"detail": "Forbidden."}, status=403)
        if order.status == PaymentOrder.Status.PAID:
            return Response({"detail": "Order already verified.", "order": PaymentOrderSerializer(order).data})

        gateway = get_payment_gateway(order.provider)
        payload = {
            "gateway_order_id": request.data.get("gateway_order_id") or order.gateway_order_id,
            "gateway_payment_id": request.data.get("gateway_payment_id", ""),
            "signature": request.data.get("signature", ""),
        }
        if not gateway.verify_payment_signature(payload):
            order.status = PaymentOrder.Status.FAILED
            order.save(update_fields=["status"])
            return Response({"detail": "Payment signature verification failed."}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            order.gateway_payment_id = payload["gateway_payment_id"]
            order.status = PaymentOrder.Status.PAID
            order.paid_at = timezone.now()
            order.save(update_fields=["gateway_payment_id", "status", "paid_at"])
            if order.coupon:
                order.coupon.times_used += 1
                order.coupon.save(update_fields=["times_used"])
            enrollment = _activate_enrollment_for_order(order)

        return Response(
            {
                "detail": "Payment verified and enrollment activated.",
                "order": PaymentOrderSerializer(order).data,
                "enrollment_id": enrollment.id,
            }
        )

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def sandbox_simulate(self, request, pk=None):
        """Explicit sandbox-only endpoint for end-to-end checkout testing; disabled in live providers."""
        order = self.get_object()
        if order.provider != "sandbox":
            return Response({"detail": "Sandbox simulation is only available when PAYMENT_PROVIDER=sandbox."}, status=400)
        if order.student != request.user and request.user.role != User.Role.ADMIN:
            return Response({"detail": "Forbidden."}, status=403)

        gateway = SandboxPaymentGateway()
        payment_id = f"sbx_pay_{uuid.uuid4().hex[:14]}"
        signature = gateway.sign_sandbox_payment(order.gateway_order_id, payment_id)

        with transaction.atomic():
            order.gateway_payment_id = payment_id
            order.status = PaymentOrder.Status.PAID
            order.paid_at = timezone.now()
            order.save(update_fields=["gateway_payment_id", "status", "paid_at"])
            enrollment = _activate_enrollment_for_order(order)

        return Response(
            {
                "detail": "Sandbox payment verified via HMAC signature.",
                "gateway_payment_id": payment_id,
                "signature": signature,
                "order": PaymentOrderSerializer(order).data,
                "enrollment_id": enrollment.id,
            }
        )

    @action(detail=True, methods=["post"], permission_classes=[IsAdminUserRole])
    def mark_refunded(self, request, pk=None):
        order = self.get_object()
        order.status = PaymentOrder.Status.REFUNDED
        order.refund_reference = request.data.get("refund_reference", f"REF-{uuid.uuid4().hex[:8].upper()}")
        order.refund_reason = request.data.get("refund_reason", "Processed by administrator")
        order.save(update_fields=["status", "refund_reference", "refund_reason"])
        log_audit_action(
            request,
            "PAYMENT_REFUNDED",
            "PaymentOrder",
            order.id,
            {"order_reference": order.order_reference, "refund_reference": order.refund_reference},
        )
        return Response(PaymentOrderSerializer(order).data)


class PaymentWebhookView(APIView):
    """Server-to-server payment webhook endpoint verifying cryptographic signatures."""

    permission_classes = [permissions.AllowAny]

    def post(self, request, provider: str):
        raw_body = request.body
        signature = (
            request.headers.get("X-Razorpay-Signature")
            or request.headers.get("X-Webhook-Signature")
            or request.headers.get("X-Seekhvo-Signature")
        )
        gateway = get_payment_gateway(provider)
        is_valid = gateway.verify_webhook_signature(raw_body, signature)

        try:
            body_json = json.loads(raw_body.decode("utf-8")) if raw_body else {}
        except json.JSONDecodeError:
            body_json = {}

        event = WebhookEvent.objects.create(
            provider=provider,
            event_type=str(body_json.get("event", "")),
            payload=body_json,
            signature_valid=is_valid,
        )

        if not is_valid:
            return Response({"detail": "Invalid webhook signature."}, status=status.HTTP_400_BAD_REQUEST)

        gateway_order_id = (
            body_json.get("gateway_order_id")
            or body_json.get("payload", {}).get("payment", {}).get("entity", {}).get("order_id")
            or body_json.get("data", {}).get("order", {}).get("order_id")
        )
        if gateway_order_id:
            try:
                order = PaymentOrder.objects.get(gateway_order_id=gateway_order_id)
                if order.status != PaymentOrder.Status.PAID:
                    order.status = PaymentOrder.Status.PAID
                    order.paid_at = timezone.now()
                    order.save(update_fields=["status", "paid_at"])
                    _activate_enrollment_for_order(order)
                event.processed = True
                event.save(update_fields=["processed"])
            except PaymentOrder.DoesNotExist:
                pass

        return Response({"status": "accepted"})


class CouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
    permission_classes = [IsAdminUserRole]

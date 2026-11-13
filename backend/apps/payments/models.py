from decimal import Decimal
import uuid
from django.db import models
from apps.accounts.models import User
from apps.courses.models import Course


class Coupon(models.Model):
    code = models.CharField(max_length=40, unique=True)
    discount_percent = models.PositiveSmallIntegerField(default=10)
    is_active = models.BooleanField(default=True)
    valid_until = models.DateTimeField(null=True, blank=True)
    max_uses = models.PositiveIntegerField(default=500)
    times_used = models.PositiveIntegerField(default=0)

    def __str__(self) -> str:
        return f"{self.code} ({self.discount_percent}%)"


class PaymentOrder(models.Model):
    class Status(models.TextChoices):
        CREATED = "CREATED", "Created"
        PAID = "PAID", "Paid"
        FAILED = "FAILED", "Failed"
        REFUNDED = "REFUNDED", "Refunded"

    order_reference = models.CharField(max_length=60, unique=True, default="")
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="payment_orders")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="payment_orders")
    coupon = models.ForeignKey(Coupon, on_delete=models.SET_NULL, null=True, blank=True)

    provider = models.CharField(max_length=30, default="sandbox")
    gateway_order_id = models.CharField(max_length=120, blank=True, db_index=True)
    gateway_payment_id = models.CharField(max_length=120, blank=True)
    currency = models.CharField(max_length=10, default="INR")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))
    final_amount = models.DecimalField(max_digits=10, decimal_places=2)

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.CREATED, db_index=True)
    refund_reference = models.CharField(max_length=120, blank=True)
    refund_reason = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    paid_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.order_reference:
            self.order_reference = f"SKVORD-{uuid.uuid4().hex[:10].upper()}"
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.order_reference} | {self.student.email} | {self.status}"


class WebhookEvent(models.Model):
    provider = models.CharField(max_length=30)
    event_type = models.CharField(max_length=100, blank=True)
    payload = models.JSONField(default=dict)
    signature_valid = models.BooleanField(default=False)
    processed = models.BooleanField(default=False)
    received_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-received_at"]

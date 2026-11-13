from rest_framework import serializers
from .models import Coupon, PaymentOrder


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = "__all__"


class PaymentOrderSerializer(serializers.ModelSerializer):
    student_email = serializers.EmailField(source="student.email", read_only=True)
    student_name = serializers.CharField(source="student.full_name", read_only=True)
    course_title = serializers.CharField(source="course.title", read_only=True)
    course_slug = serializers.CharField(source="course.slug", read_only=True)

    class Meta:
        model = PaymentOrder
        fields = [
            "id",
            "order_reference",
            "student",
            "student_email",
            "student_name",
            "course",
            "course_title",
            "course_slug",
            "provider",
            "gateway_order_id",
            "gateway_payment_id",
            "currency",
            "amount",
            "discount_amount",
            "final_amount",
            "status",
            "refund_reference",
            "refund_reason",
            "created_at",
            "paid_at",
        ]
        read_only_fields = [
            "order_reference",
            "student",
            "provider",
            "gateway_order_id",
            "gateway_payment_id",
            "amount",
            "discount_amount",
            "final_amount",
            "status",
            "created_at",
            "paid_at",
        ]

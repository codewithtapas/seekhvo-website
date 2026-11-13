from rest_framework import serializers
from .models import ContactEnquiry, DemoBooking


class DemoBookingSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source="course.title", read_only=True, default=None)

    class Meta:
        model = DemoBooking
        fields = [
            "id",
            "full_name",
            "email",
            "phone",
            "course",
            "course_title",
            "course_interest",
            "preferred_slot",
            "experience_level",
            "notes",
            "status",
            "admin_notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class DemoBookingPublicCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DemoBooking
        fields = [
            "id",
            "full_name",
            "email",
            "phone",
            "course",
            "course_interest",
            "preferred_slot",
            "experience_level",
            "notes",
        ]


class ContactEnquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactEnquiry
        fields = "__all__"


class ContactEnquiryPublicCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactEnquiry
        fields = ["id", "full_name", "email", "phone", "subject", "message"]

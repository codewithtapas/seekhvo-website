from rest_framework import serializers
from .models import Certificate


class CertificateSerializer(serializers.ModelSerializer):
    student_email = serializers.EmailField(source="student.email", read_only=True)
    verification_url = serializers.CharField(read_only=True)

    class Meta:
        model = Certificate
        fields = [
            "id",
            "certificate_id",
            "student",
            "student_email",
            "course",
            "recipient_name",
            "course_title",
            "issued_date",
            "grade_or_remarks",
            "is_revoked",
            "verification_url",
            "created_at",
        ]
        read_only_fields = ["certificate_id", "verification_url", "created_at"]

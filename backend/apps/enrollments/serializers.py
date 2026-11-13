from rest_framework import serializers
from apps.courses.serializers import CourseListSerializer
from .models import Enrollment, LessonProgress, Notification, SupportRequest


class EnrollmentSerializer(serializers.ModelSerializer):
    course_detail = CourseListSerializer(source="course", read_only=True)
    student_name = serializers.CharField(source="student.full_name", read_only=True)
    student_email = serializers.EmailField(source="student.email", read_only=True)
    batch_name = serializers.CharField(source="batch.name", read_only=True, default=None)
    completed_lesson_ids = serializers.SerializerMethodField()

    class Meta:
        model = Enrollment
        fields = [
            "id",
            "student",
            "student_name",
            "student_email",
            "course",
            "course_detail",
            "batch",
            "batch_name",
            "status",
            "progress_percent",
            "completed_lesson_ids",
            "enrolled_at",
            "completed_at",
        ]

    def get_completed_lesson_ids(self, obj: Enrollment) -> list[int]:
        return list(obj.lesson_progress.filter(is_completed=True).values_list("lesson_id", flat=True))


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ["id", "title", "message", "link", "is_read", "created_at"]


class SupportRequestSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source="user.email", read_only=True)
    user_name = serializers.CharField(source="user.full_name", read_only=True)

    class Meta:
        model = SupportRequest
        fields = [
            "id",
            "user",
            "user_email",
            "user_name",
            "subject",
            "message",
            "status",
            "admin_reply",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["user", "status", "admin_reply", "created_at", "updated_at"]

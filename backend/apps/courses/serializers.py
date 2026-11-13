from rest_framework import serializers
from apps.integrations.services import StorageService
from .models import (
    Course,
    FAQ,
    Lesson,
    Module,
    ProjectShowcase,
    Technology,
    Testimonial,
    TrainerProfile,
)


class LessonPublicSerializer(serializers.ModelSerializer):
    """Public curriculum view: never exposes paid video URLs unless lesson is a free preview."""

    preview_video_url = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = [
            "id",
            "title",
            "summary",
            "lesson_type",
            "duration_minutes",
            "is_free_preview",
            "preview_video_url",
            "order",
        ]

    def get_preview_video_url(self, obj: Lesson) -> str | None:
        if obj.is_free_preview:
            return obj.video_url or None
        return None


class LessonEnrolledSerializer(serializers.ModelSerializer):
    """Full lesson access for enrolled students, instructors, and admins."""

    stream_url = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = [
            "id",
            "module",
            "title",
            "summary",
            "lesson_type",
            "duration_minutes",
            "video_url",
            "s3_video_key",
            "stream_url",
            "content_markdown",
            "is_free_preview",
            "order",
        ]

    def get_stream_url(self, obj: Lesson) -> str:
        if obj.s3_video_key:
            signed = StorageService.get_presigned_url(obj.s3_video_key)
            if signed:
                return signed
        return obj.video_url


class ModulePublicSerializer(serializers.ModelSerializer):
    lessons = LessonPublicSerializer(many=True, read_only=True)

    class Meta:
        model = Module
        fields = ["id", "title", "description", "order", "lessons"]


class ModuleEnrolledSerializer(serializers.ModelSerializer):
    lessons = LessonEnrolledSerializer(many=True, read_only=True)

    class Meta:
        model = Module
        fields = ["id", "course", "title", "description", "order", "lessons"]


class CourseListSerializer(serializers.ModelSerializer):
    effective_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    module_count = serializers.IntegerField(source="modules.count", read_only=True)

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "slug",
            "tagline",
            "short_description",
            "duration_weeks",
            "duration_label",
            "level",
            "delivery_mode",
            "currency",
            "price",
            "discount_price",
            "effective_price",
            "installment_available",
            "installment_summary",
            "included_features",
            "tools_covered",
            "thumbnail_url",
            "accent_color",
            "icon_name",
            "is_featured",
            "is_published",
            "display_order",
            "module_count",
        ]


class CourseDetailSerializer(CourseListSerializer):
    modules = ModulePublicSerializer(many=True, read_only=True)

    class Meta(CourseListSerializer.Meta):
        fields = CourseListSerializer.Meta.fields + ["description", "outcomes", "modules", "created_at", "updated_at"]


class CourseAdminWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = "__all__"


class TechnologySerializer(serializers.ModelSerializer):
    class Meta:
        model = Technology
        fields = "__all__"


class ProjectShowcaseSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source="course.title", read_only=True, default=None)
    course_slug = serializers.CharField(source="course.slug", read_only=True, default=None)

    class Meta:
        model = ProjectShowcase
        fields = [
            "id",
            "title",
            "slug",
            "summary",
            "architecture_notes",
            "tech_stack",
            "image_url",
            "course",
            "course_title",
            "course_slug",
            "demo_url",
            "is_published",
            "is_sample_demo",
            "display_order",
        ]


class TrainerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainerProfile
        fields = "__all__"


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = "__all__"


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = "__all__"

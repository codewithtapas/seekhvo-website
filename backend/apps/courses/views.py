from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import User, log_audit_action
from apps.accounts.permissions import IsAdminOrReadOnly, IsAdminUserRole, IsInstructorOrAdmin
from apps.enrollments.models import Enrollment
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
from .serializers import (
    CourseAdminWriteSerializer,
    CourseDetailSerializer,
    CourseListSerializer,
    FAQSerializer,
    LessonEnrolledSerializer,
    ModuleEnrolledSerializer,
    ProjectShowcaseSerializer,
    TechnologySerializer,
    TestimonialSerializer,
    TrainerProfileSerializer,
)


class CourseViewSet(viewsets.ModelViewSet):
    lookup_field = "slug"
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ["level", "delivery_mode", "is_featured", "is_published"]
    search_fields = ["title", "tagline", "short_description", "tools_covered"]

    def get_queryset(self):
        user = self.request.user
        qs = Course.objects.prefetch_related("modules__lessons").all()
        if user.is_authenticated and (user.role == User.Role.ADMIN or user.is_superuser):
            return qs
        return qs.filter(is_published=True)

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return CourseAdminWriteSerializer
        if self.action == "retrieve":
            return CourseDetailSerializer
        return CourseListSerializer

    def perform_create(self, serializer):
        course = serializer.save()
        log_audit_action(self.request, "COURSE_CREATED", "Course", course.id, {"title": course.title})

    def perform_update(self, serializer):
        course = serializer.save()
        log_audit_action(self.request, "COURSE_UPDATED", "Course", course.id, {"is_published": course.is_published})

    @action(detail=True, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def curriculum(self, request, slug=None):
        """Authorized curriculum endpoint returning full lesson video/markdown links only to enrolled users, assigned instructors, or admins."""
        course = self.get_object()
        user = request.user
        is_authorized = (
            user.role == User.Role.ADMIN
            or user.is_superuser
            or (user.role == User.Role.INSTRUCTOR and course.instructors.filter(id=user.id).exists())
            or Enrollment.objects.filter(
                student=user,
                course=course,
                status__in=[Enrollment.Status.ACTIVE, Enrollment.Status.COMPLETED],
            ).exists()
        )
        if not is_authorized:
            return Response(
                {"detail": "You must be enrolled in this course to access full lesson materials."},
                status=403,
            )
        serializer = ModuleEnrolledSerializer(course.modules.prefetch_related("lessons").all(), many=True)
        return Response({"course_id": course.id, "course_slug": course.slug, "modules": serializer.data})


class ModuleManageViewSet(viewsets.ModelViewSet):
    queryset = Module.objects.select_related("course").all()
    serializer_class = ModuleEnrolledSerializer
    permission_classes = [IsInstructorOrAdmin]
    filterset_fields = ["course"]


class LessonManageViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.select_related("module", "module__course").all()
    serializer_class = LessonEnrolledSerializer
    permission_classes = [IsInstructorOrAdmin]
    filterset_fields = ["module", "lesson_type"]


class TechnologyViewSet(viewsets.ModelViewSet):
    queryset = Technology.objects.filter(is_active=True)
    serializer_class = TechnologySerializer
    permission_classes = [IsAdminOrReadOnly]


class ProjectShowcaseViewSet(viewsets.ModelViewSet):
    lookup_field = "slug"
    serializer_class = ProjectShowcaseSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.role == User.Role.ADMIN:
            return ProjectShowcase.objects.all()
        return ProjectShowcase.objects.filter(is_published=True)


class TrainerProfileViewSet(viewsets.ModelViewSet):
    serializer_class = TrainerProfileSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.role == User.Role.ADMIN:
            return TrainerProfile.objects.all()
        return TrainerProfile.objects.filter(is_verified=True)


class TestimonialViewSet(viewsets.ModelViewSet):
    serializer_class = TestimonialSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.role == User.Role.ADMIN:
            return Testimonial.objects.all()
        return Testimonial.objects.filter(is_verified=True)


class FAQViewSet(viewsets.ModelViewSet):
    serializer_class = FAQSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.role == User.Role.ADMIN:
            return FAQ.objects.all()
        return FAQ.objects.filter(is_published=True)


class PlatformStatsView(APIView):
    """Returns real verified database counts rather than fabricated marketing numbers."""

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        published_courses = Course.objects.filter(is_published=True)
        total_lessons = Lesson.objects.filter(module__course__is_published=True).count()
        total_projects = ProjectShowcase.objects.filter(is_published=True).count()
        verified_trainers = TrainerProfile.objects.filter(is_verified=True).count()
        active_students = Enrollment.objects.filter(
            status__in=[Enrollment.Status.ACTIVE, Enrollment.Status.COMPLETED]
        ).values("student_id").distinct().count()

        return Response(
            {
                "published_courses": published_courses.count(),
                "total_lessons": total_lessons,
                "hands_on_projects": total_projects,
                "verified_trainers": verified_trainers,
                "active_learners": active_students,
                "learning_modes": ["Live Cohorts", "Recorded Labs", "1:1 Mentorship"],
            }
        )

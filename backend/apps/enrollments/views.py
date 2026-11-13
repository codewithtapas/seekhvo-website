from django.utils import timezone
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.accounts.models import User, log_audit_action
from apps.accounts.permissions import IsAdminUserRole
from apps.courses.models import Lesson
from .models import Enrollment, LessonProgress, Notification, SupportRequest
from .serializers import EnrollmentSerializer, NotificationSerializer, SupportRequestSerializer


class EnrollmentViewSet(viewsets.ModelViewSet):
    serializer_class = EnrollmentSerializer

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            return [IsAdminUserRole()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        qs = Enrollment.objects.select_related("student", "course", "batch").prefetch_related("lesson_progress").all()
        if user.role == User.Role.ADMIN or user.is_superuser:
            return qs
        if user.role == User.Role.INSTRUCTOR:
            return qs.filter(course__instructors=user).distinct()
        return qs.filter(student=user)

    def perform_create(self, serializer):
        enrollment = serializer.save()
        log_audit_action(
            self.request,
            "ENROLLMENT_CREATED_BY_ADMIN",
            "Enrollment",
            enrollment.id,
            {"student": enrollment.student.email, "course": enrollment.course.slug, "status": enrollment.status},
        )

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def toggle_lesson(self, request, pk=None):
        enrollment = self.get_object()
        if enrollment.student != request.user and request.user.role != User.Role.ADMIN:
            return Response({"detail": "Forbidden."}, status=403)
        if enrollment.status not in (Enrollment.Status.ACTIVE, Enrollment.Status.COMPLETED):
            return Response({"detail": "Enrollment is not active."}, status=400)

        lesson_id = request.data.get("lesson_id")
        try:
            lesson = Lesson.objects.get(id=lesson_id, module__course=enrollment.course)
        except Lesson.DoesNotExist:
            return Response({"detail": "Lesson not found in this course."}, status=404)

        progress, _ = LessonProgress.objects.get_or_create(enrollment=enrollment, lesson=lesson)
        progress.is_completed = not progress.is_completed
        progress.completed_at = timezone.now() if progress.is_completed else None
        progress.save()

        pct = enrollment.recalculate_progress()
        return Response({"lesson_id": lesson.id, "is_completed": progress.is_completed, "progress_percent": pct})


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=True, methods=["post"])
    def mark_read(self, request, pk=None):
        notif = self.get_object()
        notif.is_read = True
        notif.save(update_fields=["is_read"])
        return Response(NotificationSerializer(notif).data)

    @action(detail=False, methods=["post"])
    def mark_all_read(self, request):
        self.get_queryset().update(is_read=True)
        return Response({"detail": "All notifications marked read."})


class SupportRequestViewSet(viewsets.ModelViewSet):
    serializer_class = SupportRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == User.Role.ADMIN or user.is_superuser:
            return SupportRequest.objects.select_related("user").all()
        return SupportRequest.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["post"], permission_classes=[IsAdminUserRole])
    def respond(self, request, pk=None):
        ticket = self.get_object()
        ticket.admin_reply = request.data.get("admin_reply", ticket.admin_reply)
        new_status = request.data.get("status", SupportRequest.Status.RESOLVED)
        if new_status in dict(SupportRequest.Status.choices):
            ticket.status = new_status
        ticket.save()
        return Response(SupportRequestSerializer(ticket).data)

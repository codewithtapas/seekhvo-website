from django.db.models import Q
from django.utils import timezone
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.accounts.models import User, log_audit_action
from apps.accounts.permissions import IsAdminUserRole, IsInstructorOrAdmin
from apps.enrollments.models import Enrollment
from .models import (
    Assignment,
    AssignmentSubmission,
    Attendance,
    Batch,
    LearningResource,
    LiveSession,
    Quiz,
    QuizAttempt,
    QuizQuestion,
)
from .serializers import (
    AssignmentReviewSerializer,
    AssignmentSerializer,
    AssignmentSubmissionSerializer,
    AttendanceSerializer,
    BatchSerializer,
    LearningResourceSerializer,
    LiveSessionSerializer,
    QuizAttemptSerializer,
    QuizQuestionAdminSerializer,
    QuizSerializer,
)


def _enrolled_course_ids(user: User) -> list[int]:
    return list(
        Enrollment.objects.filter(
            student=user,
            status__in=[Enrollment.Status.ACTIVE, Enrollment.Status.COMPLETED],
        ).values_list("course_id", flat=True)
    )


class BatchViewSet(viewsets.ModelViewSet):
    serializer_class = BatchSerializer

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            return [IsAdminUserRole()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        qs = Batch.objects.select_related("course", "trainer").all()
        if user.role == User.Role.ADMIN or user.is_superuser:
            return qs
        if user.role == User.Role.INSTRUCTOR:
            return qs.filter(Q(trainer=user) | Q(course__instructors=user)).distinct()
        return qs.filter(enrollments__student=user, enrollments__status__in=[Enrollment.Status.ACTIVE, Enrollment.Status.COMPLETED]).distinct()

    def perform_create(self, serializer):
        batch = serializer.save()
        log_audit_action(self.request, "BATCH_CREATED", "Batch", batch.id, {"code": batch.code})


class LiveSessionViewSet(viewsets.ModelViewSet):
    serializer_class = LiveSessionSerializer

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            return [IsInstructorOrAdmin()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        qs = LiveSession.objects.select_related("batch", "batch__course").all()
        if user.role == User.Role.ADMIN or user.is_superuser:
            return qs
        if user.role == User.Role.INSTRUCTOR:
            return qs.filter(Q(batch__trainer=user) | Q(batch__course__instructors=user)).distinct()
        course_ids = _enrolled_course_ids(user)
        return qs.filter(batch__course_id__in=course_ids).distinct()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class AttendanceViewSet(viewsets.ModelViewSet):
    serializer_class = AttendanceSerializer

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            return [IsInstructorOrAdmin()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        qs = Attendance.objects.select_related("session", "student").all()
        if user.role == User.Role.ADMIN or user.is_superuser:
            return qs
        if user.role == User.Role.INSTRUCTOR:
            return qs.filter(Q(session__batch__trainer=user) | Q(session__batch__course__instructors=user)).distinct()
        return qs.filter(student=user)

    def perform_create(self, serializer):
        serializer.save(marked_by=self.request.user)


class AssignmentViewSet(viewsets.ModelViewSet):
    serializer_class = AssignmentSerializer

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            return [IsInstructorOrAdmin()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        qs = Assignment.objects.select_related("course", "batch").all()
        if user.role == User.Role.ADMIN or user.is_superuser:
            return qs
        if user.role == User.Role.INSTRUCTOR:
            return qs.filter(Q(batch__trainer=user) | Q(course__instructors=user)).distinct()
        return qs.filter(course_id__in=_enrolled_course_ids(user))

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class AssignmentSubmissionViewSet(viewsets.ModelViewSet):
    serializer_class = AssignmentSubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = AssignmentSubmission.objects.select_related("assignment", "assignment__course", "student").all()
        if user.role == User.Role.ADMIN or user.is_superuser:
            return qs
        if user.role == User.Role.INSTRUCTOR:
            return qs.filter(
                Q(assignment__batch__trainer=user) | Q(assignment__course__instructors=user)
            ).distinct()
        return qs.filter(student=user)

    def perform_create(self, serializer):
        assignment = serializer.validated_data["assignment"]
        if not Enrollment.objects.filter(
            student=self.request.user,
            course=assignment.course,
            status__in=[Enrollment.Status.ACTIVE, Enrollment.Status.COMPLETED],
        ).exists():
            raise permissions.PermissionDenied("You must be enrolled in this course to submit assignments.")
        serializer.save(student=self.request.user)

    @action(detail=True, methods=["post"], permission_classes=[IsInstructorOrAdmin])
    def review(self, request, pk=None):
        submission = self.get_object()
        serializer = AssignmentReviewSerializer(submission, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save(reviewed_at=timezone.now())
        return Response(AssignmentSubmissionSerializer(submission).data)


class LearningResourceViewSet(viewsets.ModelViewSet):
    serializer_class = LearningResourceSerializer

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            return [IsInstructorOrAdmin()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        qs = LearningResource.objects.select_related("course").all()
        if user.role == User.Role.ADMIN or user.is_superuser:
            return qs
        if user.role == User.Role.INSTRUCTOR:
            return qs.filter(course__instructors=user).distinct()
        return qs.filter(course_id__in=_enrolled_course_ids(user))


class QuizViewSet(viewsets.ModelViewSet):
    serializer_class = QuizSerializer

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            return [IsInstructorOrAdmin()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        qs = Quiz.objects.prefetch_related("questions").select_related("course").all()
        if user.role == User.Role.ADMIN or user.is_superuser:
            return qs
        if user.role == User.Role.INSTRUCTOR:
            return qs.filter(course__instructors=user).distinct()
        return qs.filter(course_id__in=_enrolled_course_ids(user), is_published=True)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def submit(self, request, pk=None):
        quiz = self.get_object()
        answers = request.data.get("answers", {})
        if not isinstance(answers, dict):
            return Response({"detail": "answers must be a mapping of question_id -> option_index."}, status=400)

        questions = list(quiz.questions.all())
        if not questions:
            return Response({"detail": "Quiz has no questions yet."}, status=400)

        correct = 0
        for q in questions:
            chosen = answers.get(str(q.id))
            if chosen is not None and int(chosen) == q.correct_option_index:
                correct += 1

        score_percent = round((correct / len(questions)) * 100, 1)
        passed = score_percent >= quiz.passing_score_percent
        attempt = QuizAttempt.objects.create(
            quiz=quiz,
            student=request.user,
            answers=answers,
            score_percent=score_percent,
            passed=passed,
        )
        return Response(QuizAttemptSerializer(attempt).data, status=status.HTTP_201_CREATED)


class QuizQuestionManageViewSet(viewsets.ModelViewSet):
    queryset = QuizQuestion.objects.all()
    serializer_class = QuizQuestionAdminSerializer
    permission_classes = [IsInstructorOrAdmin]


class QuizAttemptListViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = QuizAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in (User.Role.ADMIN, User.Role.INSTRUCTOR) or user.is_superuser:
            return QuizAttempt.objects.select_related("quiz", "student").all()
        return QuizAttempt.objects.filter(student=user).select_related("quiz")

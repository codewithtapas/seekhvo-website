from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import (
    AssignmentSubmissionViewSet,
    AssignmentViewSet,
    AttendanceViewSet,
    BatchViewSet,
    LearningResourceViewSet,
    LiveSessionViewSet,
    QuizAttemptListViewSet,
    QuizQuestionManageViewSet,
    QuizViewSet,
)

router = DefaultRouter()
router.register("batches", BatchViewSet, basename="batches")
router.register("live-sessions", LiveSessionViewSet, basename="live-sessions")
router.register("attendance", AttendanceViewSet, basename="attendance")
router.register("assignments", AssignmentViewSet, basename="assignments")
router.register("submissions", AssignmentSubmissionViewSet, basename="submissions")
router.register("resources", LearningResourceViewSet, basename="resources")
router.register("quizzes", QuizViewSet, basename="quizzes")
router.register("quiz-questions", QuizQuestionManageViewSet, basename="quiz-questions")
router.register("quiz-attempts", QuizAttemptListViewSet, basename="quiz-attempts")

urlpatterns = [
    path("", include(router.urls)),
]

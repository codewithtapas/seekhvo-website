from rest_framework import serializers
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


class BatchSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source="course.title", read_only=True)
    trainer_name = serializers.CharField(source="trainer.full_name", read_only=True, default=None)

    class Meta:
        model = Batch
        fields = [
            "id",
            "course",
            "course_title",
            "name",
            "code",
            "trainer",
            "trainer_name",
            "start_date",
            "end_date",
            "schedule_summary",
            "is_active",
            "created_at",
        ]


class LiveSessionSerializer(serializers.ModelSerializer):
    batch_name = serializers.CharField(source="batch.name", read_only=True)
    course_title = serializers.CharField(source="batch.course.title", read_only=True)

    class Meta:
        model = LiveSession
        fields = [
            "id",
            "batch",
            "batch_name",
            "course_title",
            "title",
            "description",
            "platform",
            "meeting_url",
            "scheduled_at",
            "duration_minutes",
            "recording_url",
        ]


class AttendanceSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.full_name", read_only=True)
    student_email = serializers.EmailField(source="student.email", read_only=True)

    class Meta:
        model = Attendance
        fields = ["id", "session", "student", "student_name", "student_email", "status", "marked_at"]
        read_only_fields = ["marked_at"]


class AssignmentSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source="course.title", read_only=True)

    class Meta:
        model = Assignment
        fields = ["id", "course", "course_title", "batch", "title", "instructions", "due_date", "max_score", "attachment", "created_at"]


class AssignmentSubmissionSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.full_name", read_only=True)
    assignment_title = serializers.CharField(source="assignment.title", read_only=True)

    class Meta:
        model = AssignmentSubmission
        fields = [
            "id",
            "assignment",
            "assignment_title",
            "student",
            "student_name",
            "submission_url",
            "submission_file",
            "notes",
            "status",
            "score",
            "feedback",
            "submitted_at",
            "reviewed_at",
        ]
        read_only_fields = ["student", "status", "score", "feedback", "submitted_at", "reviewed_at"]


class AssignmentReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignmentSubmission
        fields = ["status", "score", "feedback"]


class LearningResourceSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source="course.title", read_only=True)

    class Meta:
        model = LearningResource
        fields = ["id", "course", "course_title", "title", "description", "resource_url", "file", "created_at"]


class QuizQuestionStudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizQuestion
        fields = ["id", "prompt", "options", "order"]


class QuizQuestionAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizQuestion
        fields = ["id", "quiz", "prompt", "options", "correct_option_index", "order"]


class QuizSerializer(serializers.ModelSerializer):
    questions = QuizQuestionStudentSerializer(many=True, read_only=True)
    course_title = serializers.CharField(source="course.title", read_only=True)

    class Meta:
        model = Quiz
        fields = ["id", "course", "course_title", "title", "description", "passing_score_percent", "is_published", "questions"]


class QuizAttemptSerializer(serializers.ModelSerializer):
    quiz_title = serializers.CharField(source="quiz.title", read_only=True)

    class Meta:
        model = QuizAttempt
        fields = ["id", "quiz", "quiz_title", "answers", "score_percent", "passed", "attempted_at"]
        read_only_fields = ["score_percent", "passed", "attempted_at"]

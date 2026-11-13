from django.db import models
from apps.accounts.models import User
from apps.courses.models import Course
from apps.integrations.services import validate_uploaded_file


class Batch(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="batches")
    name = models.CharField(max_length=150)
    code = models.CharField(max_length=50, unique=True)
    trainer = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={"role__in": [User.Role.INSTRUCTOR, User.Role.ADMIN]},
        related_name="teaching_batches",
    )
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    schedule_summary = models.CharField(max_length=200, default="Sat & Sun • 7:00 PM IST")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-start_date"]
        verbose_name_plural = "Batches"

    def __str__(self) -> str:
        return f"{self.name} ({self.course.title})"


class LiveSession(models.Model):
    class Platform(models.TextChoices):
        GOOGLE_MEET = "GOOGLE_MEET", "Google Meet"
        ZOOM = "ZOOM", "Zoom"
        CUSTOM = "CUSTOM", "Custom Stream"

    batch = models.ForeignKey(Batch, on_delete=models.CASCADE, related_name="live_sessions")
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    platform = models.CharField(max_length=20, choices=Platform.choices, default=Platform.GOOGLE_MEET)
    meeting_url = models.URLField()
    scheduled_at = models.DateTimeField(db_index=True)
    duration_minutes = models.PositiveIntegerField(default=90)
    recording_url = models.URLField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        ordering = ["scheduled_at"]

    def __str__(self) -> str:
        return f"{self.batch.code}: {self.title}"


class Attendance(models.Model):
    class Status(models.TextChoices):
        PRESENT = "PRESENT", "Present"
        ABSENT = "ABSENT", "Absent"
        EXCUSED = "EXCUSED", "Excused"

    session = models.ForeignKey(LiveSession, on_delete=models.CASCADE, related_name="attendance_records")
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="attendance_records")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PRESENT)
    marked_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="marked_attendance")
    marked_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("session", "student")

    def __str__(self) -> str:
        return f"{self.student.email} - {self.session.title}: {self.status}"


class Assignment(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="assignments")
    batch = models.ForeignKey(Batch, on_delete=models.SET_NULL, null=True, blank=True, related_name="assignments")
    title = models.CharField(max_length=200)
    instructions = models.TextField()
    due_date = models.DateTimeField(null=True, blank=True)
    max_score = models.PositiveIntegerField(default=100)
    attachment = models.FileField(
        upload_to="assignments/prompts/",
        blank=True,
        null=True,
        validators=[validate_uploaded_file],
    )
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.course.title} — {self.title}"


class AssignmentSubmission(models.Model):
    class Status(models.TextChoices):
        SUBMITTED = "SUBMITTED", "Submitted"
        REVIEWED = "REVIEWED", "Reviewed"
        NEEDS_REVISION = "NEEDS_REVISION", "Needs Revision"

    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name="submissions")
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="assignment_submissions")
    submission_url = models.URLField(blank=True)
    submission_file = models.FileField(
        upload_to="assignments/submissions/",
        blank=True,
        null=True,
        validators=[validate_uploaded_file],
    )
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SUBMITTED)
    score = models.PositiveIntegerField(null=True, blank=True)
    feedback = models.TextField(blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ("assignment", "student")
        ordering = ["-submitted_at"]


class LearningResource(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="resources")
    title = models.CharField(max_length=200)
    description = models.CharField(max_length=300, blank=True)
    resource_url = models.URLField(blank=True)
    file = models.FileField(
        upload_to="courses/resources/",
        blank=True,
        null=True,
        validators=[validate_uploaded_file],
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]


class Quiz(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="quizzes")
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    passing_score_percent = models.PositiveSmallIntegerField(default=70)
    is_published = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "Quizzes"

    def __str__(self) -> str:
        return f"{self.course.title}: {self.title}"


class QuizQuestion(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="questions")
    prompt = models.TextField()
    options = models.JSONField(default=list)
    correct_option_index = models.PositiveSmallIntegerField(default=0)
    order = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ["order", "id"]


class QuizAttempt(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="attempts")
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="quiz_attempts")
    answers = models.JSONField(default=dict)
    score_percent = models.FloatField(default=0.0)
    passed = models.BooleanField(default=False)
    attempted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-attempted_at"]

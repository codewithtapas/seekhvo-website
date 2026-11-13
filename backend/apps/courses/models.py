from django.db import models
from django.utils.text import slugify
from apps.accounts.models import User


class Course(models.Model):
    class Level(models.TextChoices):
        BEGINNER = "BEGINNER", "Beginner"
        INTERMEDIATE = "INTERMEDIATE", "Intermediate"
        ADVANCED = "ADVANCED", "Advanced"
        ALL_LEVELS = "ALL_LEVELS", "All Levels"

    class DeliveryMode(models.TextChoices):
        LIVE = "LIVE", "Live Instructor-Led"
        RECORDED = "RECORDED", "Self-Paced Recorded"
        HYBRID = "HYBRID", "Live + Recorded Hybrid"

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    tagline = models.CharField(max_length=260, blank=True)
    short_description = models.TextField()
    description = models.TextField()
    duration_weeks = models.PositiveIntegerField(default=12)
    duration_label = models.CharField(max_length=80, default="12 Weeks")
    level = models.CharField(max_length=20, choices=Level.choices, default=Level.ALL_LEVELS)
    delivery_mode = models.CharField(max_length=20, choices=DeliveryMode.choices, default=DeliveryMode.HYBRID)

    # Pricing & Installment Options
    currency = models.CharField(max_length=10, default="INR")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    installment_available = models.BooleanField(default=True)
    installment_summary = models.CharField(max_length=120, blank=True, default="Flexible 2-3 monthly installments")
    included_features = models.JSONField(default=list, blank=True)
    outcomes = models.JSONField(default=list, blank=True)
    tools_covered = models.JSONField(default=list, blank=True)

    thumbnail_url = models.URLField(blank=True)
    accent_color = models.CharField(max_length=20, default="#00D4FF")
    icon_name = models.CharField(max_length=50, default="Cpu")

    is_featured = models.BooleanField(default=True)
    is_published = models.BooleanField(default=True, db_index=True)
    display_order = models.PositiveIntegerField(default=0)
    instructors = models.ManyToManyField(
        User,
        blank=True,
        limit_choices_to={"role__in": [User.Role.INSTRUCTOR, User.Role.ADMIN]},
        related_name="assigned_courses",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["display_order", "-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    @property
    def effective_price(self):
        if self.discount_price is not None and self.discount_price < self.price:
            return self.discount_price
        return self.price

    def __str__(self) -> str:
        return self.title


class Module(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="modules")
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self) -> str:
        return f"{self.course.title} — {self.title}"


class Lesson(models.Model):
    class LessonType(models.TextChoices):
        VIDEO = "VIDEO", "Recorded Video"
        LIVE = "LIVE", "Live Session"
        ARTICLE = "ARTICLE", "Reading / Lab"
        QUIZ = "QUIZ", "Quiz"

    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name="lessons")
    title = models.CharField(max_length=200)
    summary = models.TextField(blank=True)
    lesson_type = models.CharField(max_length=20, choices=LessonType.choices, default=LessonType.VIDEO)
    duration_minutes = models.PositiveIntegerField(default=30)
    video_url = models.URLField(blank=True)
    s3_video_key = models.CharField(max_length=350, blank=True)
    content_markdown = models.TextField(blank=True)
    is_free_preview = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self) -> str:
        return f"{self.module.title} :: {self.title}"


class Technology(models.Model):
    name = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=80, default="AI Framework")
    description = models.CharField(max_length=240, blank=True)
    icon_key = models.CharField(max_length=50, default="cpu")
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["display_order", "name"]
        verbose_name_plural = "Technologies"

    def __str__(self) -> str:
        return self.name


class ProjectShowcase(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    summary = models.TextField()
    architecture_notes = models.TextField(blank=True)
    tech_stack = models.JSONField(default=list, blank=True)
    image_url = models.URLField(blank=True)
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True, related_name="projects")
    demo_url = models.URLField(blank=True)
    is_published = models.BooleanField(default=True)
    is_sample_demo = models.BooleanField(default=False)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["display_order", "id"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.title


class TrainerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="trainer_profile")
    name = models.CharField(max_length=150)
    title = models.CharField(max_length=180)
    bio = models.TextField()
    specialties = models.JSONField(default=list, blank=True)
    years_experience = models.PositiveIntegerField(default=5)
    avatar_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    is_verified = models.BooleanField(default=False, help_text="Only verified instructors appear on the public site.")
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["display_order", "name"]

    def __str__(self) -> str:
        return f"{self.name} ({'Verified' if self.is_verified else 'Unverified'})"


class Testimonial(models.Model):
    student_name = models.CharField(max_length=120)
    program_taken = models.CharField(max_length=160)
    quote = models.TextField()
    rating = models.PositiveSmallIntegerField(default=5)
    is_verified = models.BooleanField(default=False, help_text="Only genuine verified testimonials are displayed.")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.student_name} — {self.program_taken}"


class FAQ(models.Model):
    question = models.CharField(max_length=300)
    answer = models.TextField()
    category = models.CharField(max_length=80, default="General")
    display_order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ["display_order", "id"]
        verbose_name = "FAQ"
        verbose_name_plural = "FAQs"

    def __str__(self) -> str:
        return self.question

from django.db import models
from apps.courses.models import Course


class DemoBooking(models.Model):
    class LeadStatus(models.TextChoices):
        NEW = "NEW", "New"
        CONTACTED = "CONTACTED", "Contacted"
        SCHEDULED = "SCHEDULED", "Demo Scheduled"
        CONVERTED = "CONVERTED", "Converted"
        CLOSED = "CLOSED", "Closed"

    full_name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=25)
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True, related_name="demo_bookings")
    course_interest = models.CharField(max_length=200, blank=True)
    preferred_slot = models.CharField(max_length=150, blank=True)
    experience_level = models.CharField(max_length=80, blank=True)
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=LeadStatus.choices, default=LeadStatus.NEW, db_index=True)
    admin_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.full_name} ({self.course_interest or 'General AI Demo'})"


class ContactEnquiry(models.Model):
    class Status(models.TextChoices):
        NEW = "NEW", "New"
        IN_REVIEW = "IN_REVIEW", "In Review"
        RESOLVED = "RESOLVED", "Resolved"

    full_name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=25, blank=True)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.NEW)
    admin_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "Contact Enquiries"

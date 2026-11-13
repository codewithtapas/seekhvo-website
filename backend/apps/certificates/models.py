import datetime
import secrets
from django.conf import settings
from django.db import models
from apps.accounts.models import User
from apps.courses.models import Course


def generate_certificate_id() -> str:
    year = datetime.date.today().year
    token = secrets.token_hex(3).upper()
    return f"SKV-{year}-{token}"


class Certificate(models.Model):
    certificate_id = models.CharField(max_length=40, unique=True, default=generate_certificate_id, db_index=True)
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="certificates")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="certificates")
    recipient_name = models.CharField(max_length=180)
    course_title = models.CharField(max_length=220)
    issued_date = models.DateField(default=datetime.date.today)
    grade_or_remarks = models.CharField(max_length=120, default="Successfully Completed")
    is_revoked = models.BooleanField(default=False)
    issued_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="issued_certificates")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-issued_date", "-created_at"]
        unique_together = ("student", "course")

    @property
    def verification_url(self) -> str:
        return f"{settings.SITE_URL}/verify/{self.certificate_id}"

    def __str__(self) -> str:
        return f"{self.certificate_id} — {self.recipient_name}"

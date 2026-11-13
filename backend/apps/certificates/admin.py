from django.contrib import admin
from .models import Certificate

@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ["certificate_id", "recipient_name", "course_title", "issued_date", "is_revoked"]
    search_fields = ["certificate_id", "recipient_name", "student__email"]

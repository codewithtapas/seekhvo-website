from django.contrib import admin
from .models import Enrollment, LessonProgress, Notification, SupportRequest

admin.site.register(Enrollment)
admin.site.register(LessonProgress)
admin.site.register(Notification)
admin.site.register(SupportRequest)

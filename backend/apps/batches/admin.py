from django.contrib import admin
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

admin.site.register(Batch)
admin.site.register(LiveSession)
admin.site.register(Attendance)
admin.site.register(Assignment)
admin.site.register(AssignmentSubmission)
admin.site.register(LearningResource)
admin.site.register(Quiz)
admin.site.register(QuizQuestion)
admin.site.register(QuizAttempt)

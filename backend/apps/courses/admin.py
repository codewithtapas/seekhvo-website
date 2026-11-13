from django.contrib import admin
from .models import (
    Course,
    FAQ,
    Lesson,
    Module,
    ProjectShowcase,
    Technology,
    Testimonial,
    TrainerProfile,
)


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ["title", "level", "delivery_mode", "price", "discount_price", "is_published", "display_order"]
    prepopulated_fields = {"slug": ("title",)}
    list_filter = ["level", "delivery_mode", "is_published", "is_featured"]


admin.site.register(Module)
admin.site.register(Lesson)
admin.site.register(Technology)
admin.site.register(ProjectShowcase)
admin.site.register(TrainerProfile)
admin.site.register(Testimonial)
admin.site.register(FAQ)

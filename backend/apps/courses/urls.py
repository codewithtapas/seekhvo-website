from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import (
    CourseViewSet,
    FAQViewSet,
    LessonManageViewSet,
    ModuleManageViewSet,
    PlatformStatsView,
    ProjectShowcaseViewSet,
    TechnologyViewSet,
    TestimonialViewSet,
    TrainerProfileViewSet,
)

router = DefaultRouter()
router.register("courses", CourseViewSet, basename="courses")
router.register("modules", ModuleManageViewSet, basename="modules")
router.register("lessons", LessonManageViewSet, basename="lessons")
router.register("technologies", TechnologyViewSet, basename="technologies")
router.register("projects", ProjectShowcaseViewSet, basename="projects")
router.register("trainers", TrainerProfileViewSet, basename="trainers")
router.register("testimonials", TestimonialViewSet, basename="testimonials")
router.register("faqs", FAQViewSet, basename="faqs")

urlpatterns = [
    path("stats/", PlatformStatsView.as_view(), name="platform-stats"),
    path("", include(router.urls)),
]

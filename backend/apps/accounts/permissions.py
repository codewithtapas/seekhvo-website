from rest_framework.permissions import BasePermission, SAFE_METHODS
from .models import User


class IsAdminUserRole(BasePermission):
    """Allows access only to users with ADMIN role or Django superuser status."""

    def has_permission(self, request, view) -> bool:
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and user.is_active
            and (user.role == User.Role.ADMIN or user.is_superuser)
        )


class IsInstructorOrAdmin(BasePermission):
    """Allows access to INSTRUCTOR or ADMIN users."""

    def has_permission(self, request, view) -> bool:
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and user.is_active
            and (user.role in (User.Role.INSTRUCTOR, User.Role.ADMIN) or user.is_superuser)
        )


class IsStudentOrAbove(BasePermission):
    """Allows any authenticated active user."""

    def has_permission(self, request, view) -> bool:
        user = request.user
        return bool(user and user.is_authenticated and user.is_active)


class IsAdminOrReadOnly(BasePermission):
    """Public read access for published catalog resources; ADMIN required for mutations."""

    def has_permission(self, request, view) -> bool:
        if request.method in SAFE_METHODS:
            return True
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and user.is_active
            and (user.role == User.Role.ADMIN or user.is_superuser)
        )

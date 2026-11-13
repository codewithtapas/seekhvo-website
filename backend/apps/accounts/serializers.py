from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import AuditLog, User


class UserPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "full_name",
            "phone",
            "role",
            "headline",
            "bio",
            "avatar_url",
            "city",
            "country",
            "email_verified",
            "is_active",
            "date_joined",
        ]
        read_only_fields = ["id", "email", "role", "email_verified", "is_active", "date_joined"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["email", "full_name", "phone", "city", "country", "password", "confirm_password"]

    def validate_email(self, value: str) -> str:
        email = value.strip().lower()
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return email

    def validate(self, attrs: dict) -> dict:
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        validate_password(attrs["password"])
        return attrs

    def create(self, validated_data: dict) -> User:
        validated_data.pop("confirm_password")
        password = validated_data.pop("password")
        # Public registration always creates STUDENT accounts (never ADMIN/INSTRUCTOR).
        return User.objects.create_user(
            password=password,
            role=User.Role.STUDENT,
            **validated_data,
        )


class SeekhvoTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user: User):
        token = super().get_token(user)
        token["email"] = user.email
        token["role"] = user.role
        token["full_name"] = user.full_name
        return token

    def validate(self, attrs: dict) -> dict:
        if "email" in attrs and isinstance(attrs["email"], str):
            attrs["email"] = attrs["email"].strip().lower()
        data = super().validate(attrs)
        data["user"] = UserPublicSerializer(self.user).data
        return data


class AdminUserManageSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, min_length=8)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "full_name",
            "phone",
            "role",
            "headline",
            "bio",
            "avatar_url",
            "city",
            "country",
            "email_verified",
            "is_active",
            "date_joined",
            "password",
        ]
        read_only_fields = ["id", "date_joined"]

    def create(self, validated_data: dict) -> User:
        password = validated_data.pop("password", None)
        if password:
            validate_password(password)
        return User.objects.create_user(password=password, **validated_data)

    def update(self, instance: User, validated_data: dict) -> User:
        password = validated_data.pop("password", None)
        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        if password:
            validate_password(password)
            instance.set_password(password)
        instance.save()
        return instance


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate_new_password(self, value: str) -> str:
        validate_password(value)
        return value


class AuditLogSerializer(serializers.ModelSerializer):
    actor_email = serializers.CharField(source="actor.email", read_only=True, default=None)

    class Meta:
        model = AuditLog
        fields = ["id", "actor", "actor_email", "action", "target_model", "target_id", "metadata", "ip_address", "created_at"]

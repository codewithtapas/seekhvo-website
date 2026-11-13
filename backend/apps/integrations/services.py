import logging
import os
from pathlib import Path
from urllib.parse import quote
import boto3
import requests
from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


def validate_uploaded_file(uploaded_file) -> None:
    """Validates file extension and size against platform security limits."""
    ext = Path(uploaded_file.name).suffix.lower()
    if ext not in settings.ALLOWED_UPLOAD_EXTENSIONS:
        raise ValidationError(
            f"Unsupported file type '{ext}'. Allowed: {', '.join(sorted(settings.ALLOWED_UPLOAD_EXTENSIONS))}"
        )
    if uploaded_file.size > settings.FILE_UPLOAD_MAX_MEMORY_SIZE:
        raise ValidationError("File size exceeds the 10 MB limit.")


class EmailService:
    """Configurable transactional email service supporting Console, SMTP, and Resend."""

    @staticmethod
    def send(to_email: str, subject: str, body_text: str, body_html: str | None = None) -> bool:
        provider = getattr(settings, "EMAIL_PROVIDER", "console").lower()
        from_email = settings.DEFAULT_FROM_EMAIL

        if provider == "console":
            logger.info("[EMAIL-CONSOLE] To=%s | Subject=%s\n%s", to_email, subject, body_text)
            return True

        if provider == "resend":
            api_key = getattr(settings, "RESEND_API_KEY", "")
            if not api_key:
                logger.warning("RESEND_API_KEY missing; falling back to log.")
                return False
            resp = requests.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "from": from_email,
                    "to": [to_email],
                    "subject": subject,
                    "text": body_text,
                    **({"html": body_html} if body_html else {}),
                },
                timeout=10,
            )
            return 200 <= resp.status_code < 300

        # Default SMTP via Django's send_mail
        try:
            send_mail(
                subject=subject,
                message=body_text,
                from_email=from_email,
                recipient_list=[to_email],
                html_message=body_html,
                fail_silently=False,
            )
            return True
        except Exception as exc:
            logger.exception("SMTP send failed: %s", exc)
            return False

    @classmethod
    def send_welcome_email(cls, user) -> bool:
        return cls.send(
            to_email=user.email,
            subject="Welcome to Seekhvo AI Learning",
            body_text=(
                f"Hi {user.full_name},\n\n"
                "Welcome to Seekhvo AI Learning (seekhvo.space).\n"
                "Your student account is ready. Log in to explore AI programs, live cohorts, and hands-on labs.\n\n"
                "— Team Seekhvo"
            ),
        )

    @classmethod
    def send_enrollment_confirmation(cls, user, course_title: str) -> bool:
        return cls.send(
            to_email=user.email,
            subject=f"Enrollment Confirmed: {course_title}",
            body_text=(
                f"Hi {user.full_name},\n\n"
                f"Your enrollment in '{course_title}' is now active.\n"
                f"Access your dashboard here: {settings.SITE_URL}/dashboard/student\n\n"
                "— Seekhvo AI Learning"
            ),
        )

    @classmethod
    def send_demo_confirmation(cls, name: str, email: str, course_interest: str) -> bool:
        return cls.send(
            to_email=email,
            subject="Your Seekhvo Free AI Demo Request is Confirmed",
            body_text=(
                f"Hi {name},\n\n"
                f"Thank you for booking a free live AI demo for '{course_interest}' with Seekhvo AI Learning.\n"
                "Our academic team will share your session schedule shortly.\n\n"
                "— Team Seekhvo (seekhvo.space)"
            ),
        )


class WhatsAppService:
    """Server-side WhatsApp Business Cloud API adapter + safe click-to-chat builder."""

    @staticmethod
    def build_chat_link(message: str) -> str:
        phone = getattr(settings, "WHATSAPP_PUBLIC_NUMBER", "918280765204").lstrip("+")
        return f"https://wa.me/{phone}?text={quote(message)}"

    @staticmethod
    def send_template_message(to_phone: str, template_name: str, parameters: list[str] | None = None) -> bool:
        if not getattr(settings, "WHATSAPP_API_ENABLED", False):
            logger.info("[WHATSAPP-DISABLED] Would send '%s' to %s", template_name, to_phone)
            return False
        phone_id = getattr(settings, "WHATSAPP_PHONE_NUMBER_ID", "")
        token = getattr(settings, "WHATSAPP_ACCESS_TOKEN", "")
        if not phone_id or not token:
            logger.warning("WhatsApp Business credentials are incomplete.")
            return False

        clean_phone = "".join(ch for ch in to_phone if ch.isdigit())
        payload = {
            "messaging_product": "whatsapp",
            "to": clean_phone,
            "type": "template",
            "template": {
                "name": template_name,
                "language": {"code": "en"},
                "components": [
                    {
                        "type": "body",
                        "parameters": [{"type": "text", "text": p} for p in (parameters or [])],
                    }
                ],
            },
        }
        try:
            resp = requests.post(
                f"https://graph.facebook.com/v20.0/{phone_id}/messages",
                headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
                json=payload,
                timeout=10,
            )
            return 200 <= resp.status_code < 300
        except Exception as exc:
            logger.exception("WhatsApp API error: %s", exc)
            return False


class StorageService:
    """S3-compatible presigned URL generator for private course assets."""

    @staticmethod
    def get_presigned_url(object_key: str, expires_in: int = 3600) -> str | None:
        if not getattr(settings, "USE_S3_STORAGE", False):
            return None
        try:
            client = boto3.client(
                "s3",
                endpoint_url=settings.AWS_S3_ENDPOINT_URL,
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_S3_REGION_NAME,
            )
            return client.generate_presigned_url(
                "get_object",
                Params={"Bucket": settings.AWS_STORAGE_BUCKET_NAME, "Key": object_key},
                ExpiresIn=expires_in,
            )
        except Exception as exc:
            logger.exception("Presigned URL generation failed: %s", exc)
            return None

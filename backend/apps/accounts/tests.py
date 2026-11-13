from decimal import Decimal
import hashlib
import hmac
import json
from django.conf import settings
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from apps.accounts.models import User
from apps.certificates.models import Certificate
from apps.courses.models import Course, Lesson, Module
from apps.enrollments.models import Enrollment
from apps.payments.models import Coupon, PaymentOrder


class SeekhvoPlatformTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(
            email="testadmin@seekhvo.space",
            password="StrongPassword123!",
            full_name="Test Admin",
            role=User.Role.ADMIN,
            is_staff=True,
        )
        self.instructor = User.objects.create_user(
            email="testinstructor@seekhvo.space",
            password="StrongPassword123!",
            full_name="Test Instructor",
            role=User.Role.INSTRUCTOR,
        )
        self.student = User.objects.create_user(
            email="teststudent@seekhvo.space",
            password="StrongPassword123!",
            full_name="Test Student",
            role=User.Role.STUDENT,
        )
        self.course = Course.objects.create(
            title="Generative AI Test",
            slug="generative-ai-test",
            short_description="Test course",
            description="Full description",
            price=Decimal("20000.00"),
            discount_price=Decimal("15000.00"),
            is_published=True,
        )
        self.module = Module.objects.create(course=self.course, title="Mod 1", order=1)
        self.lesson = Lesson.objects.create(
            module=self.module,
            title="Private Lesson",
            video_url="https://cdn.seekhvo.space/private.mp4",
            is_free_preview=False,
            order=1,
        )
        self.coupon = Coupon.objects.create(code="TEST10", discount_percent=10, is_active=True)

    def test_public_registration_always_creates_student_and_issues_jwt(self):
        resp = self.client.post(
            "/api/v1/auth/register/",
            {
                "email": "newlearner@seekhvo.space",
                "full_name": "New Learner",
                "phone": "9876543210",
                "role": "ADMIN",  # Must be ignored by public registration
                "password": "StrongPassword123!",
                "confirm_password": "StrongPassword123!",
            },
            format="json",
        )
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data["user"]["role"], User.Role.STUDENT)
        self.assertIn("access", resp.data)
        self.assertIn("refresh", resp.data)

    def test_rbac_blocks_student_and_instructor_from_admin_analytics(self):
        self.client.force_authenticate(user=self.student)
        self.assertEqual(self.client.get("/api/v1/admin/analytics/").status_code, status.HTTP_403_FORBIDDEN)

        self.client.force_authenticate(user=self.instructor)
        self.assertEqual(self.client.get("/api/v1/admin/analytics/").status_code, status.HTTP_403_FORBIDDEN)

        self.client.force_authenticate(user=self.admin)
        resp = self.client.get("/api/v1/admin/analytics/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn("total_students", resp.data)

    def test_course_curriculum_authorization(self):
        self.client.force_authenticate(user=self.student)
        # Unenrolled student must be denied full curriculum
        resp = self.client.get(f"/api/v1/courses/{self.course.slug}/curriculum/")
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

        # Enrolled student gets full curriculum
        Enrollment.objects.create(student=self.student, course=self.course, status=Enrollment.Status.ACTIVE)
        resp_ok = self.client.get(f"/api/v1/courses/{self.course.slug}/curriculum/")
        self.assertEqual(resp_ok.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resp_ok.data["modules"]), 1)

    def test_payment_signature_verification_and_enrollment_activation(self):
        self.client.force_authenticate(user=self.student)
        order_resp = self.client.post(
            "/api/v1/payments/create_order/",
            {"course_id": self.course.id, "coupon_code": "TEST10"},
            format="json",
        )
        self.assertEqual(order_resp.status_code, status.HTTP_201_CREATED)
        order_id = order_resp.data["order"]["id"]
        # 15000 - 10% = 13500.00
        self.assertEqual(Decimal(order_resp.data["order"]["final_amount"]), Decimal("13500.00"))

        # Spoofed signature must fail
        bad_verify = self.client.post(
            f"/api/v1/payments/{order_id}/verify/",
            {"gateway_payment_id": "fake_pay", "signature": "forged"},
            format="json",
        )
        self.assertEqual(bad_verify.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(Enrollment.objects.filter(student=self.student, course=self.course).exists())

        # Valid sandbox simulate activates enrollment
        sim_resp = self.client.post(f"/api/v1/payments/{order_id}/sandbox_simulate/", format="json")
        self.assertEqual(sim_resp.status_code, status.HTTP_200_OK)
        self.assertTrue(
            Enrollment.objects.filter(
                student=self.student, course=self.course, status=Enrollment.Status.ACTIVE
            ).exists()
        )

    def test_webhook_hmac_verification(self):
        order = PaymentOrder.objects.create(
            student=self.student,
            course=self.course,
            provider="sandbox",
            gateway_order_id="sbx_wh_order_1",
            amount=Decimal("15000.00"),
            final_amount=Decimal("15000.00"),
        )
        payload = json.dumps({"event": "payment.captured", "gateway_order_id": order.gateway_order_id}).encode("utf-8")
        # Invalid signature rejected
        bad = self.client.post(
            "/api/v1/payments/webhook/sandbox/",
            data=payload,
            content_type="application/json",
            HTTP_X_WEBHOOK_SIGNATURE="invalid",
        )
        self.assertEqual(bad.status_code, status.HTTP_400_BAD_REQUEST)

        # Valid signature accepted and activates enrollment
        sig = hmac.new(settings.SANDBOX_WEBHOOK_SECRET.encode("utf-8"), payload, hashlib.sha256).hexdigest()
        ok = self.client.post(
            "/api/v1/payments/webhook/sandbox/",
            data=payload,
            content_type="application/json",
            HTTP_X_WEBHOOK_SIGNATURE=sig,
        )
        self.assertEqual(ok.status_code, status.HTTP_200_OK)
        order.refresh_from_db()
        self.assertEqual(order.status, PaymentOrder.Status.PAID)

    def test_certificate_pdf_and_public_qr_verification(self):
        cert = Certificate.objects.create(
            student=self.student,
            course=self.course,
            recipient_name=self.student.full_name,
            course_title=self.course.title,
            issued_by=self.admin,
        )
        # Public verify
        verify_resp = self.client.get(f"/api/v1/certificates/verify/{cert.certificate_id}/")
        self.assertEqual(verify_resp.status_code, status.HTTP_200_OK)
        self.assertTrue(verify_resp.data["valid"])
        self.assertEqual(verify_resp.data["recipient_name"], "Test Student")

        # PDF download as owner
        self.client.force_authenticate(user=self.student)
        pdf_resp = self.client.get(f"/api/v1/certificates/{cert.id}/download_pdf/")
        self.assertEqual(pdf_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(pdf_resp["Content-Type"], "application/pdf")
        self.assertTrue(pdf_resp.content.startswith(b"%PDF"))

    def test_demo_booking_creation(self):
        resp = self.client.post(
            "/api/v1/demo-bookings/",
            {
                "full_name": "Aarav Sharma",
                "email": "aarav@example.com",
                "phone": "+919876543210",
                "course": self.course.id,
                "course_interest": "Generative AI",
                "preferred_slot": "Weekend Evening",
            },
            format="json",
        )
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)

    def test_student_progress_quiz_support_and_instructor_permissions(self):
        from apps.batches.models import Batch, LiveSession, Quiz, QuizQuestion
        from apps.enrollments.models import SupportRequest
        from django.utils import timezone
        from datetime import date

        self.course.instructors.add(self.instructor)
        batch = Batch.objects.create(
            course=self.course,
            name="Batch Alpha",
            code="BATCH-A1",
            trainer=self.instructor,
            start_date=date.today(),
        )
        enr = Enrollment.objects.create(
            student=self.student, course=self.course, batch=batch, status=Enrollment.Status.ACTIVE
        )

        # Student toggles lesson progress
        self.client.force_authenticate(user=self.student)
        prog_resp = self.client.post(
            f"/api/v1/enrollments/{enr.id}/toggle_lesson/",
            {"lesson_id": self.lesson.id},
            format="json",
        )
        self.assertEqual(prog_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(prog_resp.data["progress_percent"], 100.0)

        # Student submits quiz
        quiz = Quiz.objects.create(course=self.course, title="GenAI Quiz", passing_score_percent=50)
        q1 = QuizQuestion.objects.create(
            quiz=quiz, prompt="2+2?", options=["3", "4"], correct_option_index=1, order=1
        )
        quiz_resp = self.client.post(
            f"/api/v1/quizzes/{quiz.id}/submit/",
            {"answers": {str(q1.id): 1}},
            format="json",
        )
        self.assertEqual(quiz_resp.status_code, status.HTTP_201_CREATED)
        self.assertTrue(quiz_resp.data["passed"])
        self.assertEqual(quiz_resp.data["score_percent"], 100.0)

        # Instructor schedules live session, cannot create users or access admin analytics
        self.client.force_authenticate(user=self.instructor)
        ses_resp = self.client.post(
            "/api/v1/live-sessions/",
            {
                "batch": batch.id,
                "title": "Live Q&A",
                "platform": "GOOGLE_MEET",
                "meeting_url": "https://meet.google.com/abc-defg-hij",
                "scheduled_at": timezone.now().isoformat(),
                "duration_minutes": 60,
            },
            format="json",
        )
        self.assertEqual(ses_resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.client.get("/api/v1/admin/users/").status_code, status.HTTP_403_FORBIDDEN)

        # Support ticket flow
        self.client.force_authenticate(user=self.student)
        tkt = self.client.post(
            "/api/v1/support-requests/",
            {"subject": "Need lab link", "message": "Please share Colab link"},
            format="json",
        )
        self.assertEqual(tkt.status_code, status.HTTP_201_CREATED)
        self.assertEqual(SupportRequest.objects.count(), 1)

        # OpenAPI schema check
        schema_resp = self.client.get("/api/schema/")
        self.assertEqual(schema_resp.status_code, status.HTTP_200_OK)


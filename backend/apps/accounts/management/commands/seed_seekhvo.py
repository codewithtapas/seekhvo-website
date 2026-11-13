from datetime import date, timedelta
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.accounts.models import User
from apps.batches.models import Assignment, Batch, LearningResource, LiveSession, Quiz, QuizQuestion
from apps.certificates.models import Certificate
from apps.courses.models import Course, FAQ, Lesson, Module, ProjectShowcase, Technology
from apps.enrollments.models import Enrollment, Notification
from apps.payments.models import Coupon


class Command(BaseCommand):
    help = "Seeds initial Seekhvo AI Learning courses, curriculum, technologies, FAQs, and dev test users."

    def handle(self, *args, **options):
        self.stdout.write("Seeding Seekhvo AI Learning development database...")

        # 1. Development Test Users (clearly identified for dev/sandbox testing)
        admin_user, _ = User.objects.get_or_create(
            email="admin@seekhvo.space",
            defaults={
                "full_name": "Seekhvo Admin",
                "role": User.Role.ADMIN,
                "is_staff": True,
                "is_superuser": True,
                "email_verified": True,
            },
        )
        admin_user.set_password("SeekhvoAdmin!2026")
        admin_user.save()

        instructor_user, _ = User.objects.get_or_create(
            email="instructor@seekhvo.space",
            defaults={
                "full_name": "Seekhvo Lead Instructor",
                "role": User.Role.INSTRUCTOR,
                "headline": "AI Systems Architect (Dev Test Account)",
                "email_verified": True,
            },
        )
        instructor_user.set_password("SeekhvoMentor!2026")
        instructor_user.save()

        student_user, _ = User.objects.get_or_create(
            email="student@seekhvo.space",
            defaults={
                "full_name": "Demo Learner",
                "role": User.Role.STUDENT,
                "city": "Bengaluru",
                "email_verified": True,
            },
        )
        student_user.set_password("SeekhvoStudent!2026")
        student_user.save()

        # 2. Technologies
        technologies = [
            ("Python", "Core Language", "Primary language for AI engineering, scripting, and data pipelines.", "code", 1),
            ("TensorFlow", "Deep Learning", "Production deep learning framework for training and deploying neural models.", "layers", 2),
            ("PyTorch", "Deep Learning", "Dynamic tensor computation and research-to-production neural architectures.", "flame", 3),
            ("Scikit-learn", "Classical ML", "Supervised, unsupervised learning, pipelines, and model evaluation.", "bar-chart", 4),
            ("LangChain", "LLM Orchestration", "Composable chains, retrieval pipelines, and tool-calling workflows.", "link", 5),
            ("Hugging Face", "Open Models", "Transformers, embeddings, datasets, and fine-tuning ecosystems.", "sparkles", 6),
            ("OpenAI APIs", "Foundation Models", "Structured outputs, reasoning models, embeddings, and function calling.", "cpu", 7),
            ("Vector Databases", "Retrieval & Memory", "Semantic search, hybrid indexing, and RAG knowledge stores.", "database", 8),
            ("Generative AI", "Applied GenAI", "Prompt engineering, RAG architectures, multimodal systems, and evals.", "wand", 9),
            ("Agentic AI", "Autonomous Agents", "Multi-agent orchestration, memory, tool execution, and guardrails.", "network", 10),
        ]
        for name, cat, desc, icon, order in technologies:
            Technology.objects.update_or_create(
                name=name,
                defaults={"category": cat, "description": desc, "icon_key": icon, "display_order": order, "is_active": True},
            )

        # 3. Initial 6 Courses
        courses_data = [
            {
                "title": "AI Engineer Program",
                "slug": "ai-engineer-program",
                "tagline": "End-to-end engineering from Python & ML foundations to production LLM & Agentic systems.",
                "short_description": "Comprehensive flagship program covering Python, Machine Learning, Deep Learning, Generative AI, RAG, and production deployment.",
                "description": "Designed for aspiring AI Engineers, this flagship track builds rigorous engineering capability across classical ML, neural networks, transformer fine-tuning, retrieval-augmented generation, evaluation frameworks, and scalable API deployment.",
                "duration_weeks": 24,
                "duration_label": "24 Weeks",
                "level": Course.Level.ALL_LEVELS,
                "delivery_mode": Course.DeliveryMode.HYBRID,
                "price": Decimal("49999.00"),
                "discount_price": Decimal("39999.00"),
                "accent_color": "#00D4FF",
                "icon_name": "Cpu",
                "display_order": 1,
                "tools_covered": ["Python", "PyTorch", "Scikit-learn", "LangChain", "Vector DBs", "FastAPI", "Docker"],
                "included_features": [
                    "Live instructor-led sessions & doubt clinics",
                    "Hands-on graded assignments & code reviews",
                    "6 end-to-end production AI capstone labs",
                    "QR-verified Seekhvo completion certificate",
                ],
                "outcomes": [
                    "Design, train, and evaluate ML and deep learning models",
                    "Architect production RAG & Agentic AI microservices",
                    "Deploy containerized AI backends with observability",
                ],
            },
            {
                "title": "Generative AI",
                "slug": "generative-ai",
                "tagline": "Build reliable LLM applications, RAG architectures, and multimodal pipelines.",
                "short_description": "Master foundation models, embeddings, vector databases, prompt engineering, fine-tuning, and LLM evaluation.",
                "description": "Learn how modern Generative AI systems work under the hood and how to engineer reliable, low-hallucination LLM products with structured outputs, hybrid search, and automated evaluation suites.",
                "duration_weeks": 12,
                "duration_label": "12 Weeks",
                "level": Course.Level.INTERMEDIATE,
                "delivery_mode": Course.DeliveryMode.HYBRID,
                "price": Decimal("29999.00"),
                "discount_price": Decimal("24999.00"),
                "accent_color": "#087BFF",
                "icon_name": "Sparkles",
                "display_order": 2,
                "tools_covered": ["OpenAI APIs", "Hugging Face", "LangChain", "Vector Databases", "Python"],
                "included_features": [
                    "Live architecture walkthroughs",
                    "Real-world RAG & multimodal labs",
                    "Prompt & retrieval evaluation playbooks",
                    "QR-verified completion certificate",
                ],
                "outcomes": [
                    "Build production RAG pipelines over private documents",
                    "Fine-tune open-weights models with LoRA/QLoRA",
                    "Measure latency, cost, and answer faithfulness",
                ],
            },
            {
                "title": "Machine Learning",
                "slug": "machine-learning",
                "tagline": "From mathematical intuition to production-grade predictive models.",
                "short_description": "Master supervised & unsupervised learning, feature engineering, model tuning, and MLOps fundamentals.",
                "description": "Develop deep intuition for regression, tree ensembles, clustering, dimensionality reduction, cross-validation, and deploying reproducible machine learning pipelines.",
                "duration_weeks": 14,
                "duration_label": "14 Weeks",
                "level": Course.Level.INTERMEDIATE,
                "delivery_mode": Course.DeliveryMode.HYBRID,
                "price": Decimal("27999.00"),
                "discount_price": Decimal("21999.00"),
                "accent_color": "#42A5FF",
                "icon_name": "BrainCircuit",
                "display_order": 3,
                "tools_covered": ["Python", "Scikit-learn", "XGBoost", "TensorFlow", "PyTorch"],
                "included_features": [
                    "Weekly live coding & math intuition classes",
                    "Real dataset modeling assignments",
                    "Instructor code feedback",
                    "QR-verified completion certificate",
                ],
                "outcomes": [
                    "Engineer features and prevent data leakage",
                    "Train gradient boosting & neural architectures",
                    "Package and serve ML models cleanly",
                ],
            },
            {
                "title": "Python Programming",
                "slug": "python-programming",
                "tagline": "Clean, modern Python engineering tailored for AI, automation, and data.",
                "short_description": "Build rock-solid Python fundamentals: data structures, OOP, APIs, NumPy, Pandas, and software engineering habits.",
                "description": "Start from zero or sharpen your engineering foundation with practical Python programming built specifically as the launchpad for AI and Data Science.",
                "duration_weeks": 8,
                "duration_label": "8 Weeks",
                "level": Course.Level.BEGINNER,
                "delivery_mode": Course.DeliveryMode.HYBRID,
                "price": Decimal("14999.00"),
                "discount_price": Decimal("11999.00"),
                "accent_color": "#00D4FF",
                "icon_name": "Code2",
                "display_order": 4,
                "tools_covered": ["Python", "Git", "REST APIs", "Pandas", "NumPy"],
                "included_features": [
                    "Beginner-friendly live guided sessions",
                    "30+ structured coding exercises",
                    "Mentor code reviews",
                    "QR-verified completion certificate",
                ],
                "outcomes": [
                    "Write clean, modular, type-annotated Python",
                    "Consume REST APIs and manipulate tabular datasets",
                    "Transition smoothly into ML and AI engineering",
                ],
            },
            {
                "title": "Data Science",
                "slug": "data-science",
                "tagline": "Turn messy real-world datasets into clear statistical insights and models.",
                "short_description": "Learn SQL, exploratory analysis, statistical testing, visualization, and applied predictive analytics.",
                "description": "Bridge business decision-making and quantitative modeling through rigorous data cleaning, hypothesis testing, storytelling dashboards, and predictive analytics.",
                "duration_weeks": 16,
                "duration_label": "16 Weeks",
                "level": Course.Level.BEGINNER,
                "delivery_mode": Course.DeliveryMode.HYBRID,
                "price": Decimal("32999.00"),
                "discount_price": Decimal("26999.00"),
                "accent_color": "#087BFF",
                "icon_name": "Database",
                "display_order": 5,
                "tools_covered": ["Python", "SQL", "Pandas", "Scikit-learn", "Statistics"],
                "included_features": [
                    "Live analytical case studies",
                    "Statistical testing & SQL workshops",
                    "Portfolio-ready capstone analysis",
                    "QR-verified completion certificate",
                ],
                "outcomes": [
                    "Perform rigorous exploratory & statistical analysis",
                    "Build predictive models and evaluate business metrics",
                    "Communicate technical findings clearly",
                ],
            },
            {
                "title": "Agentic AI",
                "slug": "agentic-ai",
                "tagline": "Architect autonomous multi-agent workflows with memory, tools, and guardrails.",
                "short_description": "Design tool-using AI agents, multi-agent orchestration, stateful graphs, human-in-the-loop safety, and evaluation.",
                "description": "Go beyond single-turn chat interfaces. Build stateful autonomous agents capable of planning, executing tools safely, coordinating across sub-agents, and operating in production environments.",
                "duration_weeks": 10,
                "duration_label": "10 Weeks",
                "level": Course.Level.ADVANCED,
                "delivery_mode": Course.DeliveryMode.HYBRID,
                "price": Decimal("34999.00"),
                "discount_price": Decimal("27999.00"),
                "accent_color": "#00D4FF",
                "icon_name": "Network",
                "display_order": 6,
                "tools_covered": ["Agentic AI", "LangChain", "OpenAI APIs", "Vector Databases", "Python"],
                "included_features": [
                    "Live multi-agent architecture labs",
                    "Tool-calling & guardrail engineering",
                    "Agent tracing & evaluation capstone",
                    "QR-verified completion certificate",
                ],
                "outcomes": [
                    "Implement ReAct, planner-executor, and supervisor agent graphs",
                    "Add persistent memory, sandboxing, and human approval gates",
                    "Evaluate agent reliability and tool accuracy",
                ],
            },
        ]

        created_courses: list[Course] = []
        for cdata in courses_data:
            course, _ = Course.objects.update_or_create(slug=cdata["slug"], defaults=cdata)
            course.instructors.add(instructor_user)
            created_courses.append(course)

            # Seed sample modules & lessons if none exist
            if course.modules.count() == 0:
                m1 = Module.objects.create(
                    course=course,
                    title="Module 1: Core Foundations & Architecture",
                    description="Establish engineering clarity, setup, and core mental models.",
                    order=1,
                )
                m2 = Module.objects.create(
                    course=course,
                    title="Module 2: Applied Systems & Real-World Labs",
                    description="Hands-on implementation, evaluation, and deployment patterns.",
                    order=2,
                )
                Lesson.objects.create(
                    module=m1,
                    title=f"Welcome & Roadmap: {course.title}",
                    summary="Orientation, environment setup, and practical project workflow.",
                    lesson_type=Lesson.LessonType.VIDEO,
                    duration_minutes=25,
                    content_markdown=f"### {course.title} Orientation\nWelcome to Seekhvo AI Learning. In this preview session, we review the architecture, tooling, and milestone projects.",
                    is_free_preview=True,
                    order=1,
                )
                Lesson.objects.create(
                    module=m1,
                    title="Engineering Setup & Core Concepts",
                    summary="Deep dive into foundational structures and reproducible notebooks.",
                    lesson_type=Lesson.LessonType.ARTICLE,
                    duration_minutes=45,
                    content_markdown="### Core Engineering Setup\nConfigure Python 3.12, virtual environments, API keys safely via `.env`, and structured testing.",
                    is_free_preview=False,
                    order=2,
                )
                Lesson.objects.create(
                    module=m2,
                    title="Production Pipeline & Evaluation Lab",
                    summary="Build, benchmark, and harden an end-to-end AI component.",
                    lesson_type=Lesson.LessonType.VIDEO,
                    duration_minutes=60,
                    content_markdown="### Production Evaluation\nMeasure latency, accuracy, edge cases, and error handling before shipping.",
                    is_free_preview=False,
                    order=1,
                )

        # 4. Sample Capstone Projects (flagged is_sample_demo=True for clarity)
        ai_course = created_courses[0]
        agent_course = created_courses[5]
        genai_course = created_courses[1]

        projects = [
            {
                "title": "Enterprise Hybrid RAG Knowledge Assistant",
                "slug": "enterprise-hybrid-rag-assistant",
                "summary": "Document ingestion, semantic + BM25 hybrid retrieval, citation grounding, and automated faithfulness scoring.",
                "architecture_notes": "Python + FastAPI + Vector DB + OpenAI/Hugging Face embeddings with citation verification.",
                "tech_stack": ["Python", "LangChain", "Vector Databases", "OpenAI APIs", "FastAPI"],
                "course": genai_course,
                "is_sample_demo": True,
                "display_order": 1,
            },
            {
                "title": "Multi-Agent Research & Workflow Orchestrator",
                "slug": "multi-agent-workflow-orchestrator",
                "summary": "Supervisor-worker agent graph executing structured web/API tool calls with human-in-the-loop checkpoints.",
                "architecture_notes": "Stateful planner-executor pattern with strict schema validation and execution traces.",
                "tech_stack": ["Agentic AI", "Python", "LangChain", "Vector Databases"],
                "course": agent_course,
                "is_sample_demo": True,
                "display_order": 2,
            },
            {
                "title": "Predictive Telemetry & Anomaly Detection Engine",
                "slug": "predictive-telemetry-anomaly-engine",
                "summary": "End-to-end feature store, gradient-boosted anomaly scoring, and real-time drift monitoring API.",
                "architecture_notes": "Scikit-learn & PyTorch pipeline packaged in Docker with automated threshold alerts.",
                "tech_stack": ["Python", "Scikit-learn", "PyTorch", "Docker"],
                "course": ai_course,
                "is_sample_demo": True,
                "display_order": 3,
            },
        ]
        for pdata in projects:
            ProjectShowcase.objects.update_or_create(slug=pdata["slug"], defaults=pdata)

        # 5. FAQs
        faqs = [
            (
                "Who are Seekhvo AI Learning programs built for?",
                "Our programs are designed for students, software developers, analysts, and working professionals who want practical, project-driven mastery in Python, Machine Learning, Generative AI, and Agentic AI.",
                "Programs",
                1,
            ),
            (
                "Are classes live, recorded, or both?",
                "Seekhvo follows a hybrid format: interactive live instructor-led sessions via Google Meet or Zoom paired with structured recorded lessons, code labs, and assignments accessible anytime in your Student Dashboard.",
                "Learning Mode",
                2,
            ),
            (
                "How do Seekhvo certificates work?",
                "Upon successful completion, Seekhvo issues a downloadable PDF certificate containing a unique Certificate ID and scannable QR code linked directly to our public verification page at seekhvo.space/verify.",
                "Certification",
                3,
            ),
            (
                "Does Seekhvo guarantee a job or placement?",
                "No ethical academy should promise guaranteed employment. Seekhvo provides industry-oriented training, real-world AI projects, portfolio guidance, and career preparation to help you build genuine, demonstrable capability.",
                "Career Support",
                4,
            ),
            (
                "Can I book a free demo before enrolling?",
                "Yes. Click 'Book Free Demo' anywhere on the site to schedule a live walkthrough of our curriculum, labs, and teaching approach.",
                "Admissions",
                5,
            ),
        ]
        for q, a, cat, order in faqs:
            FAQ.objects.update_or_create(
                question=q,
                defaults={"answer": a, "category": cat, "display_order": order, "is_published": True},
            )

        # 6. Dev Coupon & Demo Batch/Enrollment for student@seekhvo.space
        Coupon.objects.update_or_create(
            code="SEEKHVO10",
            defaults={"discount_percent": 10, "is_active": True, "max_uses": 500},
        )

        batch, _ = Batch.objects.update_or_create(
            code="SKV-AI-COHORT-01",
            defaults={
                "course": ai_course,
                "name": "AI Engineer — Weekend Cohort",
                "trainer": instructor_user,
                "start_date": date.today(),
                "end_date": date.today() + timedelta(weeks=24),
                "schedule_summary": "Sat & Sun • 7:00 PM IST",
                "is_active": True,
            },
        )

        if not LiveSession.objects.filter(batch=batch).exists():
            LiveSession.objects.create(
                batch=batch,
                title="Kickoff: Modern AI Engineering Stack & RAG Architecture",
                description="Live orientation and architectural blueprint walkthrough.",
                platform=LiveSession.Platform.GOOGLE_MEET,
                meeting_url="https://meet.google.com/new",
                scheduled_at=timezone.now() + timedelta(days=2),
                duration_minutes=90,
                created_by=instructor_user,
            )

        if not Assignment.objects.filter(course=ai_course).exists():
            Assignment.objects.create(
                course=ai_course,
                batch=batch,
                title="Lab 01: Build a Hybrid Document Chunker & Vector Index",
                instructions="Submit a GitHub repository URL or Python script demonstrating semantic chunking and cosine similarity retrieval.",
                due_date=timezone.now() + timedelta(days=10),
                max_score=100,
                created_by=instructor_user,
            )

        if not LearningResource.objects.filter(course=ai_course).exists():
            LearningResource.objects.create(
                course=ai_course,
                title="Seekhvo AI Engineering Handbook & Setup Checklist",
                description="Step-by-step environment, Python, and vector DB setup reference.",
                resource_url="https://seekhvo.space/courses/ai-engineer-program",
            )

        if not Quiz.objects.filter(course=ai_course).exists():
            quiz = Quiz.objects.create(
                course=ai_course,
                title="Module 1 Checkpoint: AI & LLM Engineering",
                description="Verify core engineering concepts from Module 1.",
                passing_score_percent=70,
                is_published=True,
            )
            QuizQuestion.objects.create(
                quiz=quiz,
                prompt="Which technique reduces LLM hallucinations by grounding responses in retrieved private documents?",
                options=["Zero-shot temperature scaling", "Retrieval-Augmented Generation (RAG)", "Gradient clipping", "Batch normalization"],
                correct_option_index=1,
                order=1,
            )
            QuizQuestion.objects.create(
                quiz=quiz,
                prompt="Why should payment webhook signatures always be verified on the backend?",
                options=[
                    "To speed up CSS rendering",
                    "To prevent spoofed client requests from activating unpaid enrollments",
                    "To compress PostgreSQL tables",
                    "To bypass CORS headers",
                ],
                correct_option_index=1,
                order=2,
            )

        enrollment, _ = Enrollment.objects.update_or_create(
            student=student_user,
            course=ai_course,
            defaults={"batch": batch, "status": Enrollment.Status.ACTIVE},
        )
        enrollment.recalculate_progress()

        Notification.objects.get_or_create(
            user=student_user,
            title="Welcome to Seekhvo Student Portal",
            defaults={
                "message": "Your AI Engineer Program cohort schedule, labs, and quizzes are ready.",
                "link": "/dashboard/student",
            },
        )

        Certificate.objects.get_or_create(
            student=student_user,
            course=ai_course,
            defaults={
                "certificate_id": "SKV-2026-DEMO01",
                "recipient_name": student_user.full_name,
                "course_title": ai_course.title,
                "grade_or_remarks": "Distinction (Dev Sample)",
                "issued_by": admin_user,
            },
        )

        self.stdout.write(self.style.SUCCESS("Seekhvo database seeded successfully!"))

import type { CourseItem } from "@/lib/types";

export const STATIC_COURSES: CourseItem[] = [
  {
    "id": 1,
    "title": "AI Engineer Program",
    "slug": "ai-engineer-program",
    "tagline": "End-to-end engineering from Python & ML foundations to production LLM & Agentic systems.",
    "short_description": "Comprehensive flagship program covering Python, Machine Learning, Deep Learning, Generative AI, RAG, and production deployment.",
    "description": "Designed for aspiring AI Engineers, this flagship track builds rigorous engineering capability across classical ML, neural networks, transformer fine-tuning, retrieval-augmented generation, evaluation frameworks, and scalable API deployment.",
    "duration_weeks": 24,
    "duration_label": "24 Weeks",
    "level": "ALL_LEVELS",
    "delivery_mode": "HYBRID",
    "currency": "INR",
    "price": "49999",
    "discount_price": "39999",
    "effective_price": "39999",
    "installment_available": true,
    "installment_summary": "Flexible 2-3 monthly installments",
    "included_features": [
      "Live instructor-led sessions & doubt clinics",
      "Hands-on graded assignments & code reviews",
      "6 end-to-end production AI capstone labs",
      "QR-verified Seekhvo completion certificate"
    ],
    "outcomes": [
      "Design, train, and evaluate ML and deep learning models",
      "Architect production RAG & Agentic AI microservices",
      "Deploy containerized AI backends with observability"
    ],
    "tools_covered": [
      "Python",
      "PyTorch",
      "Scikit-learn",
      "LangChain",
      "Vector DBs",
      "FastAPI",
      "Docker"
    ],
    "thumbnail_url": "/images/seekhvo-logo.png",
    "accent_color": "#00D4FF",
    "icon_name": "Cpu",
    "is_featured": true,
    "is_published": true,
    "display_order": 1,
    "module_count": 2,
    "modules": [
      {
        "id": 1,
        "title": "Module 1: Core Foundations & Architecture",
        "description": "Establish engineering clarity, setup, and core mental models.",
        "order": 1,
        "lessons": [
          {
            "id": 1,
            "title": "Welcome & Roadmap: AI Engineer Program",
            "summary": "Orientation, environment setup, and practical project workflow.",
            "lesson_type": "VIDEO",
            "duration_minutes": 25,
            "is_free_preview": true,
            "preview_video_url": null,
            "order": 1
          },
          {
            "id": 2,
            "title": "Engineering Setup & Core Concepts",
            "summary": "Deep dive into foundational structures and reproducible notebooks.",
            "lesson_type": "ARTICLE",
            "duration_minutes": 45,
            "is_free_preview": false,
            "preview_video_url": null,
            "order": 2
          }
        ]
      },
      {
        "id": 2,
        "title": "Module 2: Applied Systems & Real-World Labs",
        "description": "Hands-on implementation, evaluation, and deployment patterns.",
        "order": 2,
        "lessons": [
          {
            "id": 3,
            "title": "Production Pipeline & Evaluation Lab",
            "summary": "Build, benchmark, and harden an end-to-end AI component.",
            "lesson_type": "VIDEO",
            "duration_minutes": 60,
            "is_free_preview": false,
            "preview_video_url": null,
            "order": 1
          }
        ]
      }
    ]
  },
  {
    "id": 2,
    "title": "Generative AI",
    "slug": "generative-ai",
    "tagline": "Build reliable LLM applications, RAG architectures, and multimodal pipelines.",
    "short_description": "Master foundation models, embeddings, vector databases, prompt engineering, fine-tuning, and LLM evaluation.",
    "description": "Learn how modern Generative AI systems work under the hood and how to engineer reliable, low-hallucination LLM products with structured outputs, hybrid search, and automated evaluation suites.",
    "duration_weeks": 12,
    "duration_label": "12 Weeks",
    "level": "INTERMEDIATE",
    "delivery_mode": "HYBRID",
    "currency": "INR",
    "price": "29999",
    "discount_price": "24999",
    "effective_price": "24999",
    "installment_available": true,
    "installment_summary": "Flexible 2-3 monthly installments",
    "included_features": [
      "Live architecture walkthroughs",
      "Real-world RAG & multimodal labs",
      "Prompt & retrieval evaluation playbooks",
      "QR-verified completion certificate"
    ],
    "outcomes": [
      "Build production RAG pipelines over private documents",
      "Fine-tune open-weights models with LoRA/QLoRA",
      "Measure latency, cost, and answer faithfulness"
    ],
    "tools_covered": [
      "OpenAI APIs",
      "Hugging Face",
      "LangChain",
      "Vector Databases",
      "Python"
    ],
    "thumbnail_url": "/images/seekhvo-logo.png",
    "accent_color": "#087BFF",
    "icon_name": "Sparkles",
    "is_featured": true,
    "is_published": true,
    "display_order": 2,
    "module_count": 2,
    "modules": [
      {
        "id": 3,
        "title": "Module 1: Core Foundations & Architecture",
        "description": "Establish engineering clarity, setup, and core mental models.",
        "order": 1,
        "lessons": [
          {
            "id": 4,
            "title": "Welcome & Roadmap: Generative AI",
            "summary": "Orientation, environment setup, and practical project workflow.",
            "lesson_type": "VIDEO",
            "duration_minutes": 25,
            "is_free_preview": true,
            "preview_video_url": null,
            "order": 1
          },
          {
            "id": 5,
            "title": "Engineering Setup & Core Concepts",
            "summary": "Deep dive into foundational structures and reproducible notebooks.",
            "lesson_type": "ARTICLE",
            "duration_minutes": 45,
            "is_free_preview": false,
            "preview_video_url": null,
            "order": 2
          }
        ]
      },
      {
        "id": 4,
        "title": "Module 2: Applied Systems & Real-World Labs",
        "description": "Hands-on implementation, evaluation, and deployment patterns.",
        "order": 2,
        "lessons": [
          {
            "id": 6,
            "title": "Production Pipeline & Evaluation Lab",
            "summary": "Build, benchmark, and harden an end-to-end AI component.",
            "lesson_type": "VIDEO",
            "duration_minutes": 60,
            "is_free_preview": false,
            "preview_video_url": null,
            "order": 1
          }
        ]
      }
    ]
  },
  {
    "id": 3,
    "title": "Machine Learning",
    "slug": "machine-learning",
    "tagline": "From mathematical intuition to production-grade predictive models.",
    "short_description": "Master supervised & unsupervised learning, feature engineering, model tuning, and MLOps fundamentals.",
    "description": "Develop deep intuition for regression, tree ensembles, clustering, dimensionality reduction, cross-validation, and deploying reproducible machine learning pipelines.",
    "duration_weeks": 14,
    "duration_label": "14 Weeks",
    "level": "INTERMEDIATE",
    "delivery_mode": "HYBRID",
    "currency": "INR",
    "price": "27999",
    "discount_price": "21999",
    "effective_price": "21999",
    "installment_available": true,
    "installment_summary": "Flexible 2-3 monthly installments",
    "included_features": [
      "Weekly live coding & math intuition classes",
      "Real dataset modeling assignments",
      "Instructor code feedback",
      "QR-verified completion certificate"
    ],
    "outcomes": [
      "Engineer features and prevent data leakage",
      "Train gradient boosting & neural architectures",
      "Package and serve ML models cleanly"
    ],
    "tools_covered": [
      "Python",
      "Scikit-learn",
      "XGBoost",
      "TensorFlow",
      "PyTorch"
    ],
    "thumbnail_url": "/images/seekhvo-logo.png",
    "accent_color": "#42A5FF",
    "icon_name": "BrainCircuit",
    "is_featured": true,
    "is_published": true,
    "display_order": 3,
    "module_count": 2,
    "modules": [
      {
        "id": 5,
        "title": "Module 1: Core Foundations & Architecture",
        "description": "Establish engineering clarity, setup, and core mental models.",
        "order": 1,
        "lessons": [
          {
            "id": 7,
            "title": "Welcome & Roadmap: Machine Learning",
            "summary": "Orientation, environment setup, and practical project workflow.",
            "lesson_type": "VIDEO",
            "duration_minutes": 25,
            "is_free_preview": true,
            "preview_video_url": null,
            "order": 1
          },
          {
            "id": 8,
            "title": "Engineering Setup & Core Concepts",
            "summary": "Deep dive into foundational structures and reproducible notebooks.",
            "lesson_type": "ARTICLE",
            "duration_minutes": 45,
            "is_free_preview": false,
            "preview_video_url": null,
            "order": 2
          }
        ]
      },
      {
        "id": 6,
        "title": "Module 2: Applied Systems & Real-World Labs",
        "description": "Hands-on implementation, evaluation, and deployment patterns.",
        "order": 2,
        "lessons": [
          {
            "id": 9,
            "title": "Production Pipeline & Evaluation Lab",
            "summary": "Build, benchmark, and harden an end-to-end AI component.",
            "lesson_type": "VIDEO",
            "duration_minutes": 60,
            "is_free_preview": false,
            "preview_video_url": null,
            "order": 1
          }
        ]
      }
    ]
  },
  {
    "id": 4,
    "title": "Python Programming",
    "slug": "python-programming",
    "tagline": "Clean, modern Python engineering tailored for AI, automation, and data.",
    "short_description": "Build rock-solid Python fundamentals: data structures, OOP, APIs, NumPy, Pandas, and software engineering habits.",
    "description": "Start from zero or sharpen your engineering foundation with practical Python programming built specifically as the launchpad for AI and Data Science.",
    "duration_weeks": 8,
    "duration_label": "8 Weeks",
    "level": "BEGINNER",
    "delivery_mode": "HYBRID",
    "currency": "INR",
    "price": "14999",
    "discount_price": "11999",
    "effective_price": "11999",
    "installment_available": true,
    "installment_summary": "Flexible 2-3 monthly installments",
    "included_features": [
      "Beginner-friendly live guided sessions",
      "30+ structured coding exercises",
      "Mentor code reviews",
      "QR-verified completion certificate"
    ],
    "outcomes": [
      "Write clean, modular, type-annotated Python",
      "Consume REST APIs and manipulate tabular datasets",
      "Transition smoothly into ML and AI engineering"
    ],
    "tools_covered": [
      "Python",
      "Git",
      "REST APIs",
      "Pandas",
      "NumPy"
    ],
    "thumbnail_url": "/images/seekhvo-logo.png",
    "accent_color": "#00D4FF",
    "icon_name": "Code2",
    "is_featured": true,
    "is_published": true,
    "display_order": 4,
    "module_count": 2,
    "modules": [
      {
        "id": 7,
        "title": "Module 1: Core Foundations & Architecture",
        "description": "Establish engineering clarity, setup, and core mental models.",
        "order": 1,
        "lessons": [
          {
            "id": 10,
            "title": "Welcome & Roadmap: Python Programming",
            "summary": "Orientation, environment setup, and practical project workflow.",
            "lesson_type": "VIDEO",
            "duration_minutes": 25,
            "is_free_preview": true,
            "preview_video_url": null,
            "order": 1
          },
          {
            "id": 11,
            "title": "Engineering Setup & Core Concepts",
            "summary": "Deep dive into foundational structures and reproducible notebooks.",
            "lesson_type": "ARTICLE",
            "duration_minutes": 45,
            "is_free_preview": false,
            "preview_video_url": null,
            "order": 2
          }
        ]
      },
      {
        "id": 8,
        "title": "Module 2: Applied Systems & Real-World Labs",
        "description": "Hands-on implementation, evaluation, and deployment patterns.",
        "order": 2,
        "lessons": [
          {
            "id": 12,
            "title": "Production Pipeline & Evaluation Lab",
            "summary": "Build, benchmark, and harden an end-to-end AI component.",
            "lesson_type": "VIDEO",
            "duration_minutes": 60,
            "is_free_preview": false,
            "preview_video_url": null,
            "order": 1
          }
        ]
      }
    ]
  },
  {
    "id": 5,
    "title": "Data Science",
    "slug": "data-science",
    "tagline": "Turn messy real-world datasets into clear statistical insights and models.",
    "short_description": "Learn SQL, exploratory analysis, statistical testing, visualization, and applied predictive analytics.",
    "description": "Bridge business decision-making and quantitative modeling through rigorous data cleaning, hypothesis testing, storytelling dashboards, and predictive analytics.",
    "duration_weeks": 16,
    "duration_label": "16 Weeks",
    "level": "BEGINNER",
    "delivery_mode": "HYBRID",
    "currency": "INR",
    "price": "32999",
    "discount_price": "26999",
    "effective_price": "26999",
    "installment_available": true,
    "installment_summary": "Flexible 2-3 monthly installments",
    "included_features": [
      "Live analytical case studies",
      "Statistical testing & SQL workshops",
      "Portfolio-ready capstone analysis",
      "QR-verified completion certificate"
    ],
    "outcomes": [
      "Perform rigorous exploratory & statistical analysis",
      "Build predictive models and evaluate business metrics",
      "Communicate technical findings clearly"
    ],
    "tools_covered": [
      "Python",
      "SQL",
      "Pandas",
      "Scikit-learn",
      "Statistics"
    ],
    "thumbnail_url": "/images/seekhvo-logo.png",
    "accent_color": "#087BFF",
    "icon_name": "Database",
    "is_featured": true,
    "is_published": true,
    "display_order": 5,
    "module_count": 2,
    "modules": [
      {
        "id": 9,
        "title": "Module 1: Core Foundations & Architecture",
        "description": "Establish engineering clarity, setup, and core mental models.",
        "order": 1,
        "lessons": [
          {
            "id": 13,
            "title": "Welcome & Roadmap: Data Science",
            "summary": "Orientation, environment setup, and practical project workflow.",
            "lesson_type": "VIDEO",
            "duration_minutes": 25,
            "is_free_preview": true,
            "preview_video_url": null,
            "order": 1
          },
          {
            "id": 14,
            "title": "Engineering Setup & Core Concepts",
            "summary": "Deep dive into foundational structures and reproducible notebooks.",
            "lesson_type": "ARTICLE",
            "duration_minutes": 45,
            "is_free_preview": false,
            "preview_video_url": null,
            "order": 2
          }
        ]
      },
      {
        "id": 10,
        "title": "Module 2: Applied Systems & Real-World Labs",
        "description": "Hands-on implementation, evaluation, and deployment patterns.",
        "order": 2,
        "lessons": [
          {
            "id": 15,
            "title": "Production Pipeline & Evaluation Lab",
            "summary": "Build, benchmark, and harden an end-to-end AI component.",
            "lesson_type": "VIDEO",
            "duration_minutes": 60,
            "is_free_preview": false,
            "preview_video_url": null,
            "order": 1
          }
        ]
      }
    ]
  },
  {
    "id": 6,
    "title": "Agentic AI",
    "slug": "agentic-ai",
    "tagline": "Architect autonomous multi-agent workflows with memory, tools, and guardrails.",
    "short_description": "Design tool-using AI agents, multi-agent orchestration, stateful graphs, human-in-the-loop safety, and evaluation.",
    "description": "Go beyond single-turn chat interfaces. Build stateful autonomous agents capable of planning, executing tools safely, coordinating across sub-agents, and operating in production environments.",
    "duration_weeks": 10,
    "duration_label": "10 Weeks",
    "level": "ADVANCED",
    "delivery_mode": "HYBRID",
    "currency": "INR",
    "price": "34999",
    "discount_price": "27999",
    "effective_price": "27999",
    "installment_available": true,
    "installment_summary": "Flexible 2-3 monthly installments",
    "included_features": [
      "Live multi-agent architecture labs",
      "Tool-calling & guardrail engineering",
      "Agent tracing & evaluation capstone",
      "QR-verified completion certificate"
    ],
    "outcomes": [
      "Implement ReAct, planner-executor, and supervisor agent graphs",
      "Add persistent memory, sandboxing, and human approval gates",
      "Evaluate agent reliability and tool accuracy"
    ],
    "tools_covered": [
      "Agentic AI",
      "LangChain",
      "OpenAI APIs",
      "Vector Databases",
      "Python"
    ],
    "thumbnail_url": "/images/seekhvo-logo.png",
    "accent_color": "#00D4FF",
    "icon_name": "Network",
    "is_featured": true,
    "is_published": true,
    "display_order": 6,
    "module_count": 2,
    "modules": [
      {
        "id": 11,
        "title": "Module 1: Core Foundations & Architecture",
        "description": "Establish engineering clarity, setup, and core mental models.",
        "order": 1,
        "lessons": [
          {
            "id": 16,
            "title": "Welcome & Roadmap: Agentic AI",
            "summary": "Orientation, environment setup, and practical project workflow.",
            "lesson_type": "VIDEO",
            "duration_minutes": 25,
            "is_free_preview": true,
            "preview_video_url": null,
            "order": 1
          },
          {
            "id": 17,
            "title": "Engineering Setup & Core Concepts",
            "summary": "Deep dive into foundational structures and reproducible notebooks.",
            "lesson_type": "ARTICLE",
            "duration_minutes": 45,
            "is_free_preview": false,
            "preview_video_url": null,
            "order": 2
          }
        ]
      },
      {
        "id": 12,
        "title": "Module 2: Applied Systems & Real-World Labs",
        "description": "Hands-on implementation, evaluation, and deployment patterns.",
        "order": 2,
        "lessons": [
          {
            "id": 18,
            "title": "Production Pipeline & Evaluation Lab",
            "summary": "Build, benchmark, and harden an end-to-end AI component.",
            "lesson_type": "VIDEO",
            "duration_minutes": 60,
            "is_free_preview": false,
            "preview_video_url": null,
            "order": 1
          }
        ]
      }
    ]
  }
];

export function getStaticCourseBySlug(slug: string): CourseItem | undefined {
  return STATIC_COURSES.find((c) => c.slug === slug);
}

import React from "react";
import Link from "next/link";
import {
  Cpu,
  Terminal,
  Layers,
  ArrowRight,
  MessageCircle,
  Clock,
  HelpCircle,
  Building2,
  Code2,
  Laptop,
} from "lucide-react";
import { STATIC_COURSES } from "@/lib/coursesData";

export default function AiTrainingBhubaneswarPage() {
  const whatsappHref = `https://wa.me/918280765204?text=${encodeURIComponent(
    "Hello Seekhvo Team, I am interested in AI training programs in Bhubaneswar. Please share cohort information."
  )}`;

  return (
    <div className="pt-32 pb-24 bg-[#030B20] cyber-grid-bg min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Tag & Hero */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-[#071A3D] px-3.5 py-1 text-xs font-semibold text-[#00D4FF]">
            <Building2 className="h-4 w-4" /> BHUBANESWAR TECH TALENT INITIATIVE
          </div>
          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Applied AI Training in <span className="neon-text-gradient">Bhubaneswar</span>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#A8B8D8] sm:text-lg">
            Designed for software engineers, backend developers, QA engineers, and ambitious graduates in Bhubaneswar looking to upskill into Generative AI, Machine Learning, and Agentic workflows. Live interactive cohorts led by experienced practitioners.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#087BFF] to-[#00D4FF] px-6 py-3 text-sm font-semibold text-white shadow-neon hover:brightness-110 transition"
            >
              Explore AI Curricula <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/book-demo"
              className="rounded-full border border-cyan-400/35 px-6 py-3 text-sm font-semibold text-white hover:border-[#00D4FF] transition"
            >
              Book Free Live Demo
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/20 transition"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp Academic Desk
            </a>
          </div>
        </div>

        {/* Tailored for Working Developers & Tech Graduates */}
        <div className="mt-16">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#00D4FF]">
            PRACTICAL SPECIALIZATION
          </span>
          <h2 className="mt-2 font-heading text-3xl font-bold text-white">
            Built for Engineers in Bhubaneswar’s IT Hub
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                title: "From Web/QA to AI Engineering",
                desc: "Transition smoothly from legacy development, Java/Python scripting, or quality assurance into high-demand AI roles, mastering vector databases and model inference.",
                icon: Terminal,
              },
              {
                title: "Production RAG & Agentic Labs",
                desc: "Implement enterprise Retrieval-Augmented Generation, fine-tuning using LoRA, and autonomous multi-agent systems with real-world architectural evaluation.",
                icon: Code2,
              },
              {
                title: "Weekend & Evening Live Cohorts",
                desc: "Structured live classes via Zoom/Google Meet that fit around workday schedules at Infocity, Chandaka, and DLF Cybercity tech offices.",
                icon: Laptop,
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="glass-panel rounded-2xl p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#071A3D] border border-cyan-400/25 text-[#00D4FF]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-heading text-xl font-bold text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#A8B8D8]">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Featured Programs */}
        <div className="mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#00D4FF]">
                LEARNING TRACKS
              </span>
              <h2 className="mt-2 font-heading text-3xl font-bold text-white">
                Core Courses Available in Bhubaneswar
              </h2>
            </div>
            <Link href="/courses" className="text-sm font-semibold text-[#42A5FF] hover:text-[#00D4FF] inline-flex items-center gap-1">
              View all 6 programs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {STATIC_COURSES.map((course) => (
              <div key={course.id} className="glass-panel flex flex-col justify-between rounded-3xl p-7 border border-cyan-400/15 hover:border-cyan-400/40 transition">
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="rounded-full border border-cyan-400/30 bg-[#071A3D] px-2.5 py-0.5 font-semibold text-[#00D4FF]">
                      {course.level.replace("_", " ")}
                    </span>
                    <span className="text-[#A8B8D8] flex items-center gap-1">
                      <Clock className="h-3 w-3 text-[#00D4FF]" /> {course.duration_label}
                    </span>
                  </div>
                  <h3 className="mt-4 font-heading text-2xl font-bold text-white">
                    {course.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#A8B8D8]">
                    {course.short_description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {course.tools_covered.slice(0, 4).map((tool) => (
                      <span key={tool} className="rounded bg-[#0A1D40] px-2 py-0.5 text-[10px] font-medium text-white border border-white/5">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 border-t border-white/10 pt-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-[10px] text-[#A8B8D8] uppercase tracking-wider">Tuition Fee</div>
                      <div className="font-heading text-xl font-bold text-white">
                        ₹{parseInt(course.discount_price || course.price, 10).toLocaleString("en-IN")}
                      </div>
                    </div>
                    <Link
                      href={`/courses/${course.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#00D4FF] hover:underline"
                    >
                      Syllabus Details <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bhubaneswar FAQs */}
        <div className="mt-20">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#00D4FF]">
              CLEAR ANSWERS
            </span>
            <h2 className="mt-2 font-heading text-3xl font-bold text-white">
              FAQs for Bhubaneswar Tech Learners
            </h2>
          </div>

          <div className="mt-8 space-y-4 max-w-4xl">
            {[
              {
                q: "How does Seekhvo deliver AI training to developers in Bhubaneswar?",
                a: "All training is delivered through live online cohort classes with interactive screen sharing, real-time code reviews, and structured weekend doubt clinics. You get direct access to instructors without commuting across town.",
              },
              {
                q: "I work full-time at an IT company in Infocity/Chandaka. Can I balance this course?",
                a: "Yes. Our cohort schedules are specifically designed for working professionals, with primary classes scheduled on Saturday and Sunday mornings/evenings and asynchronous mentor clinics during the week.",
              },
              {
                q: "What kind of capstone projects will I build?",
                a: "You will build production-grade, deployable applications: asynchronous inference backends with FastAPI and Docker, hybrid dense-sparse vector search pipelines, and autonomous multi-agent customer workflows.",
              },
              {
                q: "Can I attend a sample session before enrolling?",
                a: "Yes. You can book a free live demo session at seekhvo.space/book-demo to experience our teaching methodology and review the detailed curriculum with an instructor.",
              },
              {
                q: "Is prior knowledge of Machine Learning required for the Generative AI course?",
                a: "Basic Python proficiency is recommended. We provide introductory modules covering vectors, matrix multiplication, and core transformer concepts to ensure all learners start on solid footing.",
              },
            ].map((faq) => (
              <details key={faq.q} className="glass-panel group rounded-2xl p-6 open:border-[#00D4FF]/45">
                <summary className="cursor-pointer list-none font-heading text-lg font-semibold text-white flex items-center justify-between gap-4">
                  <span>{faq.q}</span>
                  <HelpCircle className="h-5 w-5 text-[#00D4FF] shrink-0 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-[#A8B8D8] border-t border-white/5 pt-3">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* CTA Bar */}
        <div className="mt-16 glass-panel rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-heading text-2xl font-bold text-white">
              Ready to Accelerate Your Career in Bhubaneswar?
            </h3>
            <p className="mt-2 text-sm text-[#A8B8D8]">
              Reserve your seat for an upcoming cohort or join a free live demo session.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/book-demo"
              className="rounded-full bg-gradient-to-r from-[#087BFF] to-[#00D4FF] px-6 py-3 text-sm font-semibold text-white shadow-neon"
            >
              Book Free Demo
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-6 py-3 text-sm font-semibold text-emerald-300"
            >
              WhatsApp Advisor
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import Link from "next/link";
import {
  Cpu,
  Sparkles,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  MessageCircle,
  HelpCircle,
  ShieldCheck,
  Layers,
  GraduationCap,
} from "lucide-react";
import { STATIC_COURSES } from "@/lib/coursesData";

export default function AiCoursesOdishaPage() {
  const whatsappHref = `https://wa.me/918280765204?text=${encodeURIComponent(
    "Hello Seekhvo Team, I am looking for AI courses in Odisha. Please share cohort details."
  )}`;

  return (
    <div className="pt-32 pb-24 bg-[#030B20] cyber-grid-bg min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Tag */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-[#071A3D] px-3.5 py-1 text-xs font-semibold text-[#00D4FF]">
            <GraduationCap className="h-4 w-4" /> REGIONAL AI EDUCATION • ODISHA
          </div>
          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Practical AI Courses in <span className="neon-text-gradient">Odisha</span>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#A8B8D8] sm:text-lg">
            Empowering engineering college students and tech professionals across Odisha with hands-on Artificial Intelligence, Generative AI, and Machine Learning engineering cohorts. Designed to bridge the gap between academic theory and production systems.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#087BFF] to-[#00D4FF] px-6 py-3 text-sm font-semibold text-white shadow-neon hover:brightness-110 transition"
            >
              Browse All Programs <ArrowRight className="h-4 w-4" />
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
              <MessageCircle className="h-4 w-4" /> Contact Academic Advisor
            </a>
          </div>
        </div>

        {/* Why Odisha Students Choose Seekhvo */}
        <div className="mt-16">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#00D4FF]">
            ENGINEERING-FIRST CURRICULUM
          </span>
          <h2 className="mt-2 font-heading text-3xl font-bold text-white">
            Designed for College Schedules & Real-World Rigor
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                title: "Flexible Cohort Timings",
                desc: "Live evening and weekend sessions scheduled so college students across Odisha can attend without clashing with semester classes or lab exams.",
                icon: Clock,
              },
              {
                title: "Bilingual Doubt Resolution",
                desc: "Live doubt clearing clinics with mentors fluent in English, Odia, and Hindi to ensure conceptual clarity on complex math and neural architectures.",
                icon: MessageCircle,
              },
              {
                title: "End-to-End Capstones",
                desc: "Build verified production AI systems using FastAPI, PyTorch, LangChain, and Docker instead of superficial textbook notebook code.",
                icon: Layers,
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="glass-panel rounded-2xl p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#071A3D] border border-cyan-400/25 text-[#00D4FF]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-heading text-xl font-bold text-white">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#A8B8D8]">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Available AI Tracks */}
        <div className="mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#00D4FF]">
                STRUCTURED PATHWAYS
              </span>
              <h2 className="mt-2 font-heading text-3xl font-bold text-white">
                Available AI Engineering Programs
              </h2>
            </div>
            <Link href="/courses" className="text-sm font-semibold text-[#42A5FF] hover:text-[#00D4FF] inline-flex items-center gap-1">
              View complete syllabus details <ArrowRight className="h-4 w-4" />
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
                      View Syllabus <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional FAQs */}
        <div className="mt-20">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#00D4FF]">
              COMMON QUESTIONS
            </span>
            <h2 className="mt-2 font-heading text-3xl font-bold text-white">
              FAQs About AI Training in Odisha
            </h2>
          </div>

          <div className="mt-8 space-y-4 max-w-4xl">
            {[
              {
                q: "Are Seekhvo classes conducted online or in an offline classroom in Odisha?",
                a: "Seekhvo conducts live, interactive instructor-led cohorts online via Zoom and Google Meet. This allows students across all districts of Odisha (Bhubaneswar, Cuttack, Rourkela, Berhampur, Sambalpur) to learn directly from experienced AI practitioners without relocation costs.",
              },
              {
                q: "Can college students in Odisha manage these courses alongside regular semester exams?",
                a: "Yes. All live classes are held during evenings and weekends. If you have internal college exams or semester practicals, recorded high-definition sessions and mentor clinics are available so you never fall behind.",
              },
              {
                q: "What are the prerequisites to enroll in Seekhvo AI programs?",
                a: "Our Python Programming track assumes zero prior coding experience. Advanced tracks like the AI Engineer Program and Generative AI require basic familiarity with programming logic. We provide preparatory foundational modules for all enrolled learners.",
              },
              {
                q: "How is the Seekhvo certificate verified?",
                a: "Every graduate receives an authentic digital certificate equipped with a secure QR code that links directly to our public verification portal at seekhvo.space/verify.",
              },
              {
                q: "Is installment payment available for students in Odisha?",
                a: "Yes. Flexible 2-3 monthly installment plans are available across our multi-week programs to support engineering college students and young professionals.",
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
              Ready to Start Your AI Journey in Odisha?
            </h3>
            <p className="mt-2 text-sm text-[#A8B8D8]">
              Experience a live interactive class before enrolling. Book a free demo walkthrough with an instructor.
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
              WhatsApp Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

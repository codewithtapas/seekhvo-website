import type { Metadata } from "next";
import Link from "next/link";
import { Cpu, ShieldCheck, Layers, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Seekhvo AI Learning (seekhvo.space) — practical Artificial Intelligence education built around engineering rigor.",
};

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24 bg-[#030B20] cyber-grid-bg">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#00D4FF]">
          ABOUT SEEKHVO
        </span>
        <h1 className="mt-3 font-heading text-4xl font-bold text-white sm:text-5xl">
          Practical AI Education Built for <span className="neon-text-gradient">Real Builders</span>
        </h1>
        <p className="mt-6 text-base leading-relaxed text-[#A8B8D8] sm:text-lg">
          Seekhvo AI Learning (seekhvo.space) exists to turn curiosity about Artificial Intelligence into verified, production-ready engineering capability. We combine live instructor-led cohorts, structured Python & ML labs, and modern Generative and Agentic AI projects.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              title: "Engineering First",
              desc: "We teach clean code, evaluation metrics, APIs, and architectures rather than shallow prompt tricks.",
              icon: Cpu,
            },
            {
              title: "Structured Hybrid LMS",
              desc: "Live classes via Google Meet/Zoom seamlessly paired with recorded modules, quizzes, and assignments.",
              icon: Layers,
            },
            {
              title: "Transparent & Ethical",
              desc: "Zero fake placement guarantees or inflated metrics — only real projects and QR-verified skill credentials.",
              icon: ShieldCheck,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="glass-panel rounded-2xl p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#071A3D] border border-cyan-400/25 text-[#00D4FF]">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 font-heading text-xl font-bold text-white">{item.title}</h2>
                <p className="mt-2 text-sm text-[#A8B8D8] leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-14 glass-panel rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-heading text-2xl font-bold text-white">Ready to explore our AI tracks?</h2>
            <p className="mt-1 text-sm text-[#A8B8D8]">Join a free live demo walkthrough or browse our curriculum.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/courses" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#087BFF] to-[#00D4FF] px-6 py-3 text-sm font-semibold text-white">
              Explore Courses <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/book-demo" className="rounded-full border border-cyan-400/35 px-6 py-3 text-sm font-semibold text-white hover:border-[#00D4FF]">
              Book Free Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


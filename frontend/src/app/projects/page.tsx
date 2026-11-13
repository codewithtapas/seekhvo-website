import type { Metadata } from "next";
import Link from "next/link";
import { TerminalSquare, ArrowRight } from "lucide-react";
import { apiFetch, type PaginatedResponse } from "@/lib/api";
import type { ProjectShowcaseItem } from "@/lib/types";

export const metadata: Metadata = {
  title: "Projects Showcase",
  description: "Applied Generative AI, Machine Learning, and Agentic AI capstone projects at Seekhvo.",
};

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await apiFetch<PaginatedResponse<ProjectShowcaseItem>>("/projects/")
    .then((r) => r.results || [])
    .catch(() => []);

  return (
    <div className="pt-32 pb-24 bg-[#030B20] cyber-grid-bg min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#00D4FF]">
          APPLIED AI LABS
        </span>
        <h1 className="mt-2 font-heading text-4xl font-bold text-white sm:text-5xl">
          AI Systems & <span className="neon-text-gradient">Capstone Projects</span>
        </h1>
        <p className="mt-3 max-w-2xl text-base text-[#A8B8D8]">
          Explore the practical engineering blueprints learners build across our programs.
        </p>

        <div className="mt-12 space-y-6">
          {projects.map((p) => (
            <div key={p.id} id={p.slug} className="glass-panel rounded-3xl p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#071A3D] border border-cyan-400/25 text-[#00D4FF]">
                    <TerminalSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-heading text-2xl font-bold text-white">{p.title}</h2>
                    {p.course_title && (
                      <Link href={`/courses/${p.course_slug}`} className="text-xs text-[#42A5FF] hover:text-[#00D4FF]">
                        Part of {p.course_title} →
                      </Link>
                    )}
                  </div>
                </div>
                {p.is_sample_demo && (
                  <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">
                    Sample Curriculum Blueprint
                  </span>
                )}
              </div>

              <p className="mt-4 text-sm leading-relaxed text-[#A8B8D8] sm:text-base">{p.summary}</p>
              {p.architecture_notes && (
                <div className="mt-4 rounded-2xl border border-white/10 bg-[#030B20]/70 p-4 text-xs text-[#A8B8D8]">
                  <strong className="text-white">Architecture:</strong> {p.architecture_notes}
                </div>
              )}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {p.tech_stack.map((tech) => (
                    <span key={tech} className="rounded-md border border-cyan-400/20 bg-[#071A3D] px-3 py-1 text-xs text-[#42A5FF]">
                      {tech}
                    </span>
                  ))}
                </div>
                <Link
                  href="/book-demo"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00D4FF] hover:text-white"
                >
                  Build This With Mentors <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


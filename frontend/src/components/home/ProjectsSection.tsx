"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, TerminalSquare } from "lucide-react";
import type { ProjectShowcaseItem } from "@/lib/types";

export function ProjectsSection({ projects }: { projects: ProjectShowcaseItem[] }) {
  return (
    <section className="relative py-24 bg-[#071A3D]/30 border-t border-cyan-400/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#00D4FF]">
              HANDS-ON CAPSTONES
            </span>
            <h2 className="mt-2 font-heading text-3xl font-bold text-white sm:text-4xl">
              Real-World AI <span className="neon-text-gradient">Projects Showcase</span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-[#A8B8D8] sm:text-base">
              Every Seekhvo learner builds production-inspired architectures with clean APIs, evaluation metrics, and documented repositories.
            </p>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 self-start rounded-full border border-cyan-400/35 bg-[#0A1D40]/80 px-5 py-2.5 text-sm font-medium text-white hover:border-[#00D4FF] transition"
          >
            All Projects
            <ArrowUpRight className="h-4 w-4 text-[#00D4FF]" />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="glass-panel glass-panel-hover flex flex-col justify-between rounded-2xl overflow-hidden"
            >
              {/* Visual blueprint header */}
              <div className="relative h-44 bg-gradient-to-br from-[#071A3D] via-[#0A1D40] to-[#030B20] p-6 flex flex-col justify-between border-b border-cyan-400/15">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/30 bg-[#030B20]/80 text-[#00D4FF]">
                    <TerminalSquare className="h-5 w-5" />
                  </div>
                  {project.is_sample_demo && (
                    <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-amber-300">
                      Sample Lab Blueprint
                    </span>
                  )}
                </div>
                <div className="font-heading text-lg font-bold text-white leading-snug">
                  {project.title}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-sm leading-relaxed text-[#A8B8D8]">{project.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.tech_stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-cyan-400/20 bg-[#030B20]/70 px-2.5 py-1 text-[11px] font-medium text-[#42A5FF]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-[#A8B8D8]">
                    {project.course_title || "Seekhvo Capstone"}
                  </span>
                  <Link
                    href={`/projects#${project.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#00D4FF] hover:text-white transition"
                  >
                    View Details
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


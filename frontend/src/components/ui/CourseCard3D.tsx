"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Cpu,
  Sparkles,
  BrainCircuit,
  Code2,
  Database,
  Network,
  Clock,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import type { CourseItem } from "@/lib/types";
import { formatPrice } from "@/lib/api";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Cpu,
  Sparkles,
  BrainCircuit,
  Code2,
  Database,
  Network,
};

const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  ALL_LEVELS: "All Levels",
};

export function CourseCard3D({ course }: { course: CourseItem }) {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const IconComp = ICON_MAP[course.icon_name] || Cpu;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -y * 8, ry: x * 8 });
  };

  const handleMouseLeave = () => setTilt({ rx: 0, ry: 0 });

  const hasDiscount =
    course.discount_price !== null &&
    parseFloat(course.discount_price) < parseFloat(course.price);

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(0)`,
      }}
      className="group glass-panel glass-panel-hover relative flex flex-col justify-between rounded-2xl p-6 transition-transform duration-200 will-change-transform"
    >
      {/* Subtle animated neon corner accent */}
      <div
        className="pointer-events-none absolute -top-px left-8 right-8 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "linear-gradient(90deg, transparent, #00D4FF, transparent)" }}
      />

      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/30 bg-[#071A3D] text-[#00D4FF] transition-transform duration-300 group-hover:scale-110 group-hover:shadow-neon">
            <IconComp className="h-6 w-6" />
          </div>
          <span className="rounded-full border border-cyan-400/25 bg-[#071A3D]/80 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-[#42A5FF]">
            {LEVEL_LABELS[course.level] || course.level}
          </span>
        </div>

        <h3 className="mt-5 font-heading text-xl font-bold text-white group-hover:text-[#00D4FF] transition-colors">
          {course.title}
        </h3>

        <p className="mt-2.5 text-sm leading-relaxed text-[#A8B8D8] line-clamp-3">
          {course.short_description}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {course.tools_covered?.slice(0, 4).map((tool) => (
            <span
              key={tool}
              className="rounded-md border border-white/10 bg-[#030B20]/70 px-2 py-0.5 text-[11px] text-[#A8B8D8]"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 border-t border-white/10 pt-5">
        <div className="flex items-center justify-between text-xs text-[#A8B8D8]">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-[#00D4FF]" />
            {course.duration_label}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-[#42A5FF]" />
            {course.module_count} Modules
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <div className="font-heading text-xl font-bold text-white">
              {formatPrice(course.effective_price, course.currency)}
            </div>
            {hasDiscount && (
              <div className="text-xs text-[#A8B8D8] line-through">
                {formatPrice(course.price, course.currency)}
              </div>
            )}
          </div>

          <Link
            href={`/courses/${course.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/35 bg-[#087BFF]/15 px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#087BFF] hover:border-[#00D4FF]"
          >
            View Course
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}


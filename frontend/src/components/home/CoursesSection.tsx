"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CourseItem } from "@/lib/types";
import { CourseCard3D } from "@/components/ui/CourseCard3D";

export function CoursesSection({ courses }: { courses: CourseItem[] }) {
  return (
    <section id="courses" className="relative py-24 bg-[#071A3D]/35 border-t border-cyan-400/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#00D4FF]">
              CURRICULUM TRACKS
            </span>
            <h2 className="mt-2 font-heading text-3xl font-bold text-white sm:text-4xl">
              Explore Our <span className="neon-text-gradient">AI Programs</span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-[#A8B8D8] sm:text-base">
              Dynamically managed, hands-on programs designed for progressive mastery — from Python foundations to Agentic AI architectures.
            </p>
          </div>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 self-start rounded-full border border-cyan-400/35 bg-[#0A1D40]/80 px-5 py-2.5 text-sm font-medium text-white hover:border-[#00D4FF] transition"
          >
            View All Courses
            <ArrowRight className="h-4 w-4 text-[#00D4FF]" />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard3D key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}


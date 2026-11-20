"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Search, MessageCircle } from "lucide-react";
import { apiFetch, type PaginatedResponse } from "@/lib/api";
import type { CourseItem } from "@/lib/types";
import { STATIC_COURSES } from "@/lib/coursesData";
import { CourseCard3D } from "@/components/ui/CourseCard3D";

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseItem[]>(STATIC_COURSES);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("ALL");

  useEffect(() => {
    apiFetch<PaginatedResponse<CourseItem>>("/courses/")
      .then((res) => {
        if (res.results && res.results.length > 0) {
          setCourses(res.results);
        }
      })
      .catch(() => {
        // Retain STATIC_COURSES if backend is unreachable
      });
  }, []);

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchesLevel = level === "ALL" || c.level === level;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.short_description.toLowerCase().includes(q) ||
        c.tools_covered.some((t) => t.toLowerCase().includes(q));
      return matchesLevel && matchesQuery;
    });
  }, [courses, level, query]);

  return (
    <div className="pt-32 pb-24 bg-[#030B20] cyber-grid-bg min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#00D4FF]">
            ALL PROGRAMS
          </span>
          <h1 className="mt-2 font-heading text-4xl font-bold text-white sm:text-5xl">
            AI Engineering & <span className="neon-text-gradient">Training Tracks</span>
          </h1>
          <p className="mt-3 text-base text-[#A8B8D8]">
            Choose a focused module or our complete flagship AI Engineer Program.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A8B8D8]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses or tools (e.g., PyTorch, Agentic, RAG)..."
              className="w-full rounded-full border border-cyan-400/25 bg-[#0A1D40]/80 pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#A8B8D8]/60 focus:border-[#00D4FF] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {["ALL", "BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevel(lvl)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  level === lvl
                    ? "bg-[#087BFF] text-white shadow-neon"
                    : "border border-white/10 bg-[#0A1D40]/60 text-[#A8B8D8] hover:text-white"
                }`}
              >
                {lvl === "ALL" ? "All Tracks" : lvl.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="glass-panel h-80 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-12 glass-panel rounded-2xl p-12 text-center text-[#A8B8D8]">
            No courses matched your current filter.
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course) => (
              <CourseCard3D key={course.id} course={course} />
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <div className="glass-panel mx-auto max-w-2xl rounded-2xl p-6 sm:p-8">
            <h3 className="font-heading text-lg font-bold text-white">Need Customized Corporate or Group AI Training?</h3>
            <p className="mt-2 text-xs sm:text-sm text-[#A8B8D8]">
              We design bespoke generative & agentic AI curricula for engineering teams and enterprise cohorts.
            </p>
            <a
              href="https://wa.me/918280765204?text=Hello%20Seekhvo%20Team%2C%20I%20am%20interested%20in%20custom%20team%20AI%20training%20details."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-6 py-2.5 text-xs sm:text-sm font-semibold text-emerald-300 hover:bg-emerald-500/25 transition"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp (+91 8280765204)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}


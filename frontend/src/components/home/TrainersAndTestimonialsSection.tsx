"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Star, ChevronLeft, ChevronRight, UserCheck, MessageSquareQuote } from "lucide-react";
import type { TestimonialItem, TrainerProfileItem } from "@/lib/types";

export function TrainersAndTestimonialsSection({
  trainers,
  testimonials,
}: {
  trainers: TrainerProfileItem[];
  testimonials: TestimonialItem[];
}) {
  const [slide, setSlide] = useState(0);

  return (
    <section className="relative py-24 bg-[#030B20] border-t border-cyan-400/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Section 7: Verified Trainers */}
        <div>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#00D4FF]">
                EXPERT MENTORSHIP
              </span>
              <h2 className="mt-2 font-heading text-3xl font-bold text-white sm:text-4xl">
                Verified <span className="neon-text-gradient">AI Trainers</span>
              </h2>
            </div>
            <Link href="/trainers" className="text-sm font-medium text-[#42A5FF] hover:text-[#00D4FF]">
              Meet Faculty →
            </Link>
          </div>

          {trainers.length > 0 ? (
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {trainers.map((t) => (
                <div key={t.id} className="glass-panel rounded-2xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/35 bg-[#071A3D] font-heading text-xl font-bold text-[#00D4FF]">
                      {t.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-heading text-lg font-bold text-white">{t.name}</h3>
                        <ShieldCheck className="h-4 w-4 text-[#00D4FF]" />
                      </div>
                      <p className="text-xs text-[#42A5FF]">{t.title}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[#A8B8D8]">{t.bio}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {t.specialties.map((s) => (
                      <span key={s} className="rounded-md bg-[#071A3D] px-2.5 py-1 text-[11px] text-[#A8B8D8]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-10 glass-panel rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-[#071A3D] text-[#00D4FF]">
                  <UserCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-white">
                    Verified Faculty Profiles Only
                  </h3>
                  <p className="mt-1 text-sm text-[#A8B8D8] max-w-2xl">
                    Seekhvo publishes only verified instructor credentials managed via our Admin Portal — we never display fictional profiles. Book a live demo to meet our lead AI instructor directly.
                  </p>
                </div>
              </div>
              <Link
                href="/book-demo"
                className="shrink-0 rounded-full border border-cyan-400/35 bg-[#087BFF]/20 px-5 py-2.5 text-sm font-medium text-white hover:bg-[#087BFF] transition"
              >
                Meet in Free Demo
              </Link>
            </div>
          )}
        </div>

        {/* Section 8: Genuine Student Testimonials */}
        <div>
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#00D4FF]">
              LEARNER FEEDBACK
            </span>
            <h2 className="mt-2 font-heading text-3xl font-bold text-white sm:text-4xl">
              Student <span className="neon-text-gradient">Testimonials</span>
            </h2>
          </div>

          {testimonials.length > 0 ? (
            <div className="mt-10 glass-panel rounded-3xl p-8 sm:p-10 max-w-3xl mx-auto relative">
              <div className="flex items-center gap-1 text-[#00D4FF]">
                {Array.from({ length: testimonials[slide].rating }).map((_, idx) => (
                  <Star key={idx} className="h-4 w-4 fill-[#00D4FF]" />
                ))}
              </div>
              <blockquote className="mt-5 text-lg leading-relaxed text-white sm:text-xl">
                “{testimonials[slide].quote}”
              </blockquote>
              <div className="mt-6 flex items-center justify-between">
                <div>
                  <div className="font-heading font-semibold text-white">
                    {testimonials[slide].student_name}
                  </div>
                  <div className="text-xs text-[#42A5FF]">{testimonials[slide].program_taken}</div>
                </div>
                {testimonials.length > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSlide((s) => (s - 1 + testimonials.length) % testimonials.length)}
                      className="rounded-full border border-white/15 p-2 text-[#A8B8D8] hover:text-white"
                      aria-label="Previous testimonial"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setSlide((s) => (s + 1) % testimonials.length)}
                      className="rounded-full border border-white/15 p-2 text-[#A8B8D8] hover:text-white"
                      aria-label="Next testimonial"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-10 glass-panel rounded-2xl p-8 max-w-3xl mx-auto text-center">
              <MessageSquareQuote className="mx-auto h-8 w-8 text-[#00D4FF]" />
              <h3 className="mt-3 font-heading text-lg font-semibold text-white">
                Genuine Reviews Only — Zero Fabricated Stories
              </h3>
              <p className="mt-2 text-sm text-[#A8B8D8]">
                Verified learner feedback appears here automatically once approved in the Seekhvo Admin Portal. We never invent student names, photos, or outcome claims.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


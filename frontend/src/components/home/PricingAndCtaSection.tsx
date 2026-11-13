"use client";

import React from "react";
import Link from "next/link";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import type { CourseItem } from "@/lib/types";
import { formatPrice } from "@/lib/api";

export function PricingAndCtaSection({ courses }: { courses: CourseItem[] }) {
  const featuredPlans = courses.slice(0, 3);

  return (
    <>
      {/* Section 9: Dynamic Pricing */}
      <section id="pricing" className="relative py-24 bg-[#071A3D]/35 border-t border-cyan-400/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#00D4FF]">
              TRANSPARENT TUITION
            </span>
            <h2 className="mt-2 font-heading text-3xl font-bold text-white sm:text-4xl">
              Program <span className="neon-text-gradient">Pricing & Plans</span>
            </h2>
            <p className="mt-3 text-sm text-[#A8B8D8] sm:text-base">
              All fees, cohort discounts, and installment plans are managed dynamically with instant verified enrollment upon checkout.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {featuredPlans.map((plan, index) => {
              const highlight = index === 0;
              const hasDiscount =
                plan.discount_price !== null &&
                parseFloat(plan.discount_price) < parseFloat(plan.price);
              return (
                <div
                  key={plan.id}
                  className={`glass-panel rounded-3xl p-8 flex flex-col justify-between ${
                    highlight ? "border-[#00D4FF]/55 shadow-neon-strong" : ""
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#42A5FF]">
                        {plan.duration_label}
                      </span>
                      {highlight && (
                        <span className="rounded-full bg-[#00D4FF]/15 border border-[#00D4FF]/40 px-3 py-0.5 text-[11px] font-semibold text-[#00D4FF]">
                          Flagship Track
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 font-heading text-2xl font-bold text-white">{plan.title}</h3>

                    <div className="mt-5 flex items-baseline gap-3">
                      <span className="font-heading text-4xl font-bold text-white">
                        {formatPrice(plan.effective_price, plan.currency)}
                      </span>
                      {hasDiscount && (
                        <span className="text-sm text-[#A8B8D8] line-through">
                          {formatPrice(plan.price, plan.currency)}
                        </span>
                      )}
                    </div>

                    {plan.installment_available && (
                      <p className="mt-2 text-xs text-[#00D4FF]">{plan.installment_summary}</p>
                    )}

                    <ul className="mt-6 space-y-3 border-t border-white/10 pt-6">
                      {plan.included_features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2.5 text-sm text-[#A8B8D8]">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#00D4FF]" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 flex flex-col gap-2.5">
                    <Link
                      href={`/courses/${plan.slug}`}
                      className={`w-full rounded-full py-3 text-center text-sm font-semibold transition ${
                        highlight
                          ? "bg-gradient-to-r from-[#087BFF] to-[#00D4FF] text-white shadow-neon hover:brightness-110"
                          : "border border-cyan-400/35 bg-[#0A1D40] text-white hover:border-[#00D4FF]"
                      }`}
                    >
                      Enroll / View Syllabus
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 10: Final CTA */}
      <section className="relative py-24 bg-[#030B20] border-t border-cyan-400/10 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(0,212,255,0.14) 0%, rgba(3,11,32,0) 65%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="glass-panel rounded-3xl p-10 sm:p-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-[#071A3D] px-4 py-1 text-xs font-medium text-[#00D4FF]">
              <Sparkles className="h-3.5 w-3.5" />
              SEEKHVO AI LEARNING
            </div>
            <h2 className="mt-5 font-heading text-3xl font-bold tracking-tight text-white sm:text-5xl">
              YOUR AI JOURNEY STARTS <span className="neon-text-gradient">HERE.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-[#A8B8D8]">
              Start learning today and build the skills of tomorrow.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/courses"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#087BFF] to-[#00D4FF] px-7 py-3.5 text-sm font-semibold text-white shadow-neon hover:brightness-110 transition"
              >
                EXPLORE PROGRAMS
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/book-demo"
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-cyan-400/40 bg-[#0A1D40]/80 px-7 py-3.5 text-sm font-semibold text-white hover:border-[#00D4FF] transition"
              >
                BOOK FREE DEMO
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, BookOpen, Hammer, Sparkles, Award } from "lucide-react";

const STEPS = [
  {
    step: "01",
    label: "DISCOVER",
    detail: "Assess your goals and attend a live demo walkthrough.",
    icon: Search,
  },
  {
    step: "02",
    label: "LEARN",
    detail: "Master foundations through live classes & recorded labs.",
    icon: BookOpen,
  },
  {
    step: "03",
    label: "BUILD",
    detail: "Architect real AI pipelines, APIs, and agent systems.",
    icon: Hammer,
  },
  {
    step: "04",
    label: "INNOVATE",
    detail: "Refine evaluations, optimize latency, and ship capstones.",
    icon: Sparkles,
  },
  {
    step: "05",
    label: "GET CERTIFIED",
    detail: "Earn a QR-verified Seekhvo completion credential.",
    icon: Award,
  },
];

export function LearningJourneySection() {
  return (
    <section className="relative py-24 bg-[#071A3D]/30 border-t border-cyan-400/10 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#00D4FF]">
            YOUR PROGRESSION
          </span>
          <h2 className="mt-2 font-heading text-3xl font-bold text-white sm:text-4xl">
            The Seekhvo <span className="neon-text-gradient">Learning Journey</span>
          </h2>
        </div>

        <div className="relative mt-16">
          {/* Glowing horizontal connector on desktop */}
          <div className="hidden lg:block absolute top-11 left-12 right-12 h-0.5 bg-gradient-to-r from-[#087BFF]/30 via-[#00D4FF] to-[#087BFF]/30" />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((node, index) => {
              const Icon = node.icon;
              return (
                <motion.div
                  key={node.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.1 }}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="relative z-10 flex h-22 w-22 items-center justify-center rounded-2xl border border-cyan-400/45 bg-[#030B20] p-5 shadow-neon">
                    <Icon className="h-8 w-8 text-[#00D4FF]" />
                    <span className="absolute -top-2.5 -right-2.5 rounded-full bg-[#087BFF] px-2 py-0.5 text-[10px] font-bold text-white">
                      {node.step}
                    </span>
                  </div>
                  <h3 className="mt-5 font-heading text-base font-bold tracking-wider text-white">
                    {node.label}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#A8B8D8] max-w-[210px]">
                    {node.detail}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}


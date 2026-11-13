"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Compass,
  Video,
  Cpu,
  FileCode2,
  Users,
  Briefcase,
  Award,
} from "lucide-react";

const PILLARS = [
  {
    title: "Industry-Oriented Curriculum",
    description: "Updated around real engineering workflows: transformers, RAG evaluation, MLOps, and multi-agent systems.",
    icon: Compass,
  },
  {
    title: "Live Instructor-Led Training",
    description: "Interactive live cohorts via Google Meet and Zoom paired with structured on-demand recordings.",
    icon: Video,
  },
  {
    title: "Practical AI Projects",
    description: "Build working applications instead of toy notebooks — from vector search APIs to stateful agents.",
    icon: Cpu,
  },
  {
    title: "Hands-On Assignments",
    description: "Weekly lab submissions reviewed directly by instructors with actionable architectural feedback.",
    icon: FileCode2,
  },
  {
    title: "Expert Mentorship",
    description: "Direct doubt resolution, debugging clinics, and code walkthroughs with AI practitioners.",
    icon: Users,
  },
  {
    title: "Career Preparation",
    description: "Portfolio reviews, technical interview readiness, and system design practice without false guarantees.",
    icon: Briefcase,
  },
  {
    title: "QR-Verified Certification",
    description: "Receive a tamper-resistant PDF credential verifiable anytime on seekhvo.space/verify.",
    icon: Award,
  },
];

export function WhySeekhvoSection() {
  return (
    <section className="relative py-24 bg-[#030B20] border-t border-cyan-400/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#00D4FF]">
            WHY SEEKHVO?
          </span>
          <h2 className="mt-2 font-heading text-3xl font-bold text-white sm:text-4xl">
            Engineered for Real <span className="neon-text-gradient">Skill Mastery</span>
          </h2>
          <p className="mt-3 text-sm text-[#A8B8D8] sm:text-base">
            We focus on genuine engineering competence, transparent expectations, and measurable project execution.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className={`glass-panel glass-panel-hover rounded-2xl p-6 ${
                  idx === PILLARS.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/30 bg-[#071A3D] text-[#00D4FF]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#A8B8D8]">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


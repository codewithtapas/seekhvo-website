"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Code2, Layers, ShieldCheck } from "lucide-react";
import type { PlatformStats } from "@/lib/types";

function AnimatedNumber({ target }: { target: number }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (target <= 0) {
      setVal(0);
      return;
    }
    let start = 0;
    const duration = 900;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setVal(target);
        clearInterval(timer);
      } else {
        setVal(Math.floor(start));
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [target]);

  return <span>{val}</span>;
}

export function IntroStatsSection({ stats }: { stats: PlatformStats | null }) {
  const cards = [
    {
      label: "Active AI Programs",
      value: stats?.published_courses ?? 6,
      icon: BookOpen,
      note: "Structured tracks live in catalog",
    },
    {
      label: "Curriculum Lessons",
      value: stats?.total_lessons ?? 18,
      icon: Layers,
      note: "Video lectures, labs & checkpoints",
    },
    {
      label: "Applied AI Labs",
      value: stats?.hands_on_projects ?? 3,
      icon: Code2,
      note: "Portfolio architecture blueprints",
    },
    {
      label: "QR-Verified Credentials",
      value: 100,
      suffix: "%",
      icon: ShieldCheck,
      note: "Cryptographically verifiable IDs",
    },
  ];

  return (
    <section id="introduction" className="relative py-24 bg-[#030B20] cyber-grid-bg border-t border-cyan-400/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#00D4FF]">
            PRACTICAL AI EDUCATION
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-white sm:text-5xl">
            THE FUTURE IS BUILT BY THOSE WHO <span className="neon-text-gradient">LEARN.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[#A8B8D8] sm:text-lg">
            Seekhvo bridges the gap between theoretical AI buzzwords and real production engineering. Every cohort combines live instructor walkthroughs, structured Python & ML labs, and real-world system builds.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="glass-panel rounded-2xl p-6 text-left"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#071A3D] border border-cyan-400/25 text-[#00D4FF]">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-5 font-heading text-3xl font-bold text-white">
                  <AnimatedNumber target={card.value} />
                  {card.suffix || ""}
                </div>
                <div className="mt-1 text-sm font-semibold text-[#42A5FF]">{card.label}</div>
                <p className="mt-1 text-xs text-[#A8B8D8]">{card.note}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


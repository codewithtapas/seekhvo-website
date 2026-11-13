"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Code2,
  Layers,
  Flame,
  BarChart3,
  Link2,
  Sparkles,
  Cpu,
  Database,
  Wand2,
  Network,
} from "lucide-react";
import type { TechnologyItem } from "@/lib/types";

const TECH_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  code: Code2,
  layers: Layers,
  flame: Flame,
  "bar-chart": BarChart3,
  link: Link2,
  sparkles: Sparkles,
  cpu: Cpu,
  database: Database,
  wand: Wand2,
  network: Network,
};

export function TechnologiesSection({ technologies }: { technologies: TechnologyItem[] }) {
  return (
    <section className="relative py-24 bg-[#030B20] border-t border-cyan-400/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#00D4FF]">
            MODERN AI STACK
          </span>
          <h2 className="mt-2 font-heading text-3xl font-bold text-white sm:text-4xl">
            Technologies You Will <span className="neon-text-gradient">Master</span>
          </h2>
          <p className="mt-3 text-sm text-[#A8B8D8] sm:text-base">
            Train with the exact frameworks and model orchestration ecosystems used by modern AI engineering teams.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {technologies.map((tech, idx) => {
            const Icon = TECH_ICONS[tech.icon_key] || Cpu;
            return (
              <motion.div
                key={tech.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                className="glass-panel glass-panel-hover group rounded-2xl p-5 flex flex-col items-start"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/25 bg-[#071A3D] text-[#00D4FF] group-hover:scale-110 transition-transform">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-heading text-base font-bold text-white">{tech.name}</h3>
                <span className="mt-0.5 text-[11px] font-medium text-[#42A5FF]">{tech.category}</span>
                <p className="mt-2 text-xs leading-relaxed text-[#A8B8D8] line-clamp-2">{tech.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


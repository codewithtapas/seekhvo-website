import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, UserCheck } from "lucide-react";
import { apiFetch, type PaginatedResponse } from "@/lib/api";
import type { TrainerProfileItem } from "@/lib/types";

export const metadata: Metadata = {
  title: "Trainers",
  description: "Verified AI instructors and mentors at Seekhvo AI Learning.",
};

export const dynamic = "force-dynamic";

export default async function TrainersPage() {
  const trainers = await apiFetch<PaginatedResponse<TrainerProfileItem>>("/trainers/")
    .then((r) => r.results || [])
    .catch(() => []);

  return (
    <div className="pt-32 pb-24 bg-[#030B20] cyber-grid-bg min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#00D4FF]">
          FACULTY & MENTORS
        </span>
        <h1 className="mt-2 font-heading text-4xl font-bold text-white sm:text-5xl">
          Verified Seekhvo <span className="neon-text-gradient">AI Trainers</span>
        </h1>
        <p className="mt-3 max-w-2xl text-base text-[#A8B8D8]">
          We strictly display verified instructor profiles approved through our Admin Portal.
        </p>

        {trainers.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trainers.map((t) => (
              <div key={t.id} className="glass-panel rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#071A3D] border border-cyan-400/30 font-heading font-bold text-[#00D4FF]">
                    {t.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-heading text-lg font-bold text-white flex items-center gap-1.5">
                      {t.name} <ShieldCheck className="h-4 w-4 text-[#00D4FF]" />
                    </h2>
                    <p className="text-xs text-[#42A5FF]">{t.title}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-[#A8B8D8] leading-relaxed">{t.bio}</p>
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
          <div className="mt-12 glass-panel rounded-3xl p-10 flex flex-col items-center text-center">
            <UserCheck className="h-12 w-12 text-[#00D4FF]" />
            <h2 className="mt-4 font-heading text-2xl font-bold text-white">
              Verified Trainer Directory Ready for Admin Publishing
            </h2>
            <p className="mt-2 max-w-xl text-sm text-[#A8B8D8]">
              Seekhvo never publishes synthetic instructor bios or stock photos. Verified instructor profiles can be published anytime from the Admin Dashboard.
            </p>
            <Link
              href="/book-demo"
              className="mt-6 rounded-full bg-gradient-to-r from-[#087BFF] to-[#00D4FF] px-6 py-3 text-sm font-semibold text-white"
            >
              Book a Live Demo Session
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}


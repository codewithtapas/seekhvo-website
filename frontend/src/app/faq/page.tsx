import type { Metadata } from "next";
import Link from "next/link";
import { apiFetch, type PaginatedResponse } from "@/lib/api";
import type { FAQItem } from "@/lib/types";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Seekhvo AI Learning programs, live classes, and certificates.",
};

export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const faqs = await apiFetch<PaginatedResponse<FAQItem>>("/faqs/")
    .then((r) => r.results || [])
    .catch(() => []);

  return (
    <div className="pt-32 pb-24 bg-[#030B20] cyber-grid-bg min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#00D4FF]">
          ANSWERS & CLARITY
        </span>
        <h1 className="mt-2 font-heading text-4xl font-bold text-white sm:text-5xl">
          Frequently Asked <span className="neon-text-gradient">Questions</span>
        </h1>

        <div className="mt-10 space-y-4">
          {faqs.map((item) => (
            <details key={item.id} className="glass-panel group rounded-2xl p-6 open:border-[#00D4FF]/45">
              <summary className="cursor-pointer list-none font-heading text-lg font-semibold text-white flex items-center justify-between gap-4">
                <span>{item.question}</span>
                <span className="text-xs font-medium text-[#00D4FF]">{item.category}</span>
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-[#A8B8D8]">{item.answer}</p>
            </details>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/contact" className="text-sm font-semibold text-[#00D4FF] hover:underline">
            Still have questions? Contact our academic team →
          </Link>
        </div>
      </div>
    </div>
  );
}


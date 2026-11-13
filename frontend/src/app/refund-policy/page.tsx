import type { Metadata } from "next";

export const metadata: Metadata = { title: "Refund Policy" };

export default function RefundPolicyPage() {
  return (
    <div className="pt-32 pb-24 bg-[#030B20] min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6 text-sm leading-relaxed text-[#A8B8D8]">
        <h1 className="font-heading text-4xl font-bold text-white">Refund Policy</h1>
        <section className="glass-panel rounded-2xl p-6 space-y-3">
          <h2 className="font-heading text-xl font-semibold text-white">Eligibility & Processing</h2>
          <p>Refund requests may be submitted within 7 calendar days of enrollment if less than 20% of course modules have been accessed, or if a live cohort is cancelled by Seekhvo. Approved refunds are processed back to the original payment method and tracked with a reference ID inside your Payment History.</p>
        </section>
      </div>
    </div>
  );
}


import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for enrollment and educational services on Seekhvo AI Learning (seekhvo.space).",
  alternates: {
    canonical: "https://seekhvo.space/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <div className="pt-32 pb-24 bg-[#030B20] min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6 text-sm leading-relaxed text-[#A8B8D8]">
        <h1 className="font-heading text-4xl font-bold text-white">Terms & Conditions</h1>
        <section className="glass-panel rounded-2xl p-6 space-y-3">
          <h2 className="font-heading text-xl font-semibold text-white">1. Enrollment & Course Access</h2>
          <p>Course access on Seekhvo AI Learning (seekhvo.space) is granted strictly to the enrolled account holder upon verified payment or administrator activation. Sharing credentials or redistributing proprietary recordings is prohibited.</p>
        </section>
        <section className="glass-panel rounded-2xl p-6 space-y-3">
          <h2 className="font-heading text-xl font-semibold text-white">2. Educational Outcomes</h2>
          <p>Seekhvo provides practical instruction, mentorship, and career preparation guidance. Enrollment does not constitute a guarantee of employment or placement.</p>
        </section>
      </div>
    </div>
  );
}

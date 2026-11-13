import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-32 pb-24 bg-[#030B20] min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6 text-sm leading-relaxed text-[#A8B8D8]">
        <h1 className="font-heading text-4xl font-bold text-white">Privacy Policy</h1>
        <p>Effective for Seekhvo AI Learning (<strong className="text-white">seekhvo.space</strong>).</p>
        <section className="glass-panel rounded-2xl p-6 space-y-3">
          <h2 className="font-heading text-xl font-semibold text-white">1. Data We Collect</h2>
          <p>We collect account registration details (name, email, phone, city), course enrollment progress, assignment submissions, and payment order references necessary to deliver our LMS services.</p>
        </section>
        <section className="glass-panel rounded-2xl p-6 space-y-3">
          <h2 className="font-heading text-xl font-semibold text-white">2. Security & Payment Processing</h2>
          <p>Passwords are hashed using Argon2/PBKDF2 and never stored in plaintext. Payment card and UPI details are processed securely by our configured payment gateway partner and verified via cryptographic server-side signatures.</p>
        </section>
        <section className="glass-panel rounded-2xl p-6 space-y-3">
          <h2 className="font-heading text-xl font-semibold text-white">3. Certificate Verification</h2>
          <p>Issued certificates include a public verification record containing recipient name, course title, issue date, and certificate ID at seekhvo.space/verify.</p>
        </section>
      </div>
    </div>
  );
}


"use client";

import React, { useState } from "react";
import { Mail, MessageCircle, Send, CheckCircle2, Phone } from "lucide-react";
import { apiFetch, ApiError } from "@/lib/api";

export default function ContactPage() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await apiFetch("/enquiries/", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setSuccess(true);
      setForm({ full_name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not submit your message.");
    } finally {
      setSubmitting(false);
    }
  };

  const whatsapp = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918280765204").replace(/\D/g, "");
  const whatsappHref = `https://wa.me/${whatsapp}?text=${encodeURIComponent(
    "Hello Seekhvo Team, I am interested in your AI courses. Please share the details."
  )}`;

  return (
    <div className="pt-32 pb-24 bg-[#030B20] cyber-grid-bg min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-6">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#00D4FF]">
              CONTACT SEEKHVO
            </span>
            <h1 className="font-heading text-4xl font-bold text-white">
              Let’s Talk About Your <span className="neon-text-gradient">AI Goals</span>
            </h1>
            <p className="text-sm leading-relaxed text-[#A8B8D8]">
              Have questions about cohort schedules, curriculum prerequisites, or team training? Reach our academic advisors directly.
            </p>

            <div className="glass-panel rounded-2xl p-5 space-y-4">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm font-semibold text-emerald-300 hover:text-emerald-200 transition"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-[#A8B8D8]">Official WhatsApp Support</div>
                  <div>+91 8280765204</div>
                </div>
              </a>

              <a
                href="mailto:hello@seekhvo.space"
                className="flex items-center gap-3 text-sm text-[#42A5FF] hover:text-white transition"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/20 text-[#00D4FF]">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-[#A8B8D8]">Official Email</div>
                  <div>hello@seekhvo.space</div>
                </div>
              </a>
            </div>
          </div>

          <div className="lg:col-span-3">
            <form onSubmit={(e) => void handleSubmit(e)} className="glass-panel rounded-3xl p-8 space-y-4">
              {success ? (
                <div className="py-10 text-center space-y-3">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
                  <h2 className="font-heading text-2xl font-bold text-white">Enquiry Received</h2>
                  <p className="text-sm text-[#A8B8D8]">
                    Our team will respond to your query shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    className="mt-4 rounded-full border border-cyan-400/35 px-5 py-2 text-xs font-semibold text-white"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="font-heading text-2xl font-bold text-white">Send a Message</h2>
                  {error && (
                    <div className="rounded-xl border border-red-400/40 bg-red-500/10 p-3 text-xs text-red-200">
                      {error}
                    </div>
                  )}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <input
                      required
                      value={form.full_name}
                      onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                      placeholder="Full Name"
                      className="rounded-xl border border-cyan-400/20 bg-[#030B20] px-4 py-3 text-sm text-white focus:border-[#00D4FF] focus:outline-none"
                    />
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="Email Address"
                      className="rounded-xl border border-cyan-400/20 bg-[#030B20] px-4 py-3 text-sm text-white focus:border-[#00D4FF] focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="Phone / WhatsApp (Optional)"
                      className="rounded-xl border border-cyan-400/20 bg-[#030B20] px-4 py-3 text-sm text-white focus:border-[#00D4FF] focus:outline-none"
                    />
                    <input
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="Subject"
                      className="rounded-xl border border-cyan-400/20 bg-[#030B20] px-4 py-3 text-sm text-white focus:border-[#00D4FF] focus:outline-none"
                    />
                  </div>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="How can we help?"
                    className="w-full rounded-xl border border-cyan-400/20 bg-[#030B20] px-4 py-3 text-sm text-white focus:border-[#00D4FF] focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#087BFF] to-[#00D4FF] py-3.5 text-sm font-semibold text-white shadow-neon hover:brightness-110 disabled:opacity-60"
                  >
                    <Send className="h-4 w-4" />
                    {submitting ? "Sending..." : "Submit Enquiry"}
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

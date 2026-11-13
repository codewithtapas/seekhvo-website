"use client";

import React, { useEffect, useState } from "react";
import { CalendarClock, CheckCircle2, Sparkles, MessageCircle } from "lucide-react";
import { apiFetch, ApiError, type PaginatedResponse } from "@/lib/api";
import type { CourseItem } from "@/lib/types";

export default function BookDemoPage() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    course: "",
    course_interest: "AI Engineer Program",
    preferred_slot: "Weekend Evening (7:00 PM IST)",
    experience_level: "Beginner / Career Switcher",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<PaginatedResponse<CourseItem>>("/courses/")
      .then((res) => setCourses(res.results || []))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const selectedCourse = courses.find((c) => String(c.id) === form.course);
      await apiFetch("/demo-bookings/", {
        method: "POST",
        body: JSON.stringify({
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
          course: form.course ? Number(form.course) : null,
          course_interest: selectedCourse ? selectedCourse.title : form.course_interest,
          preferred_slot: form.preferred_slot,
          experience_level: form.experience_level,
          notes: form.notes,
        }),
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not book demo. Please check your details.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 bg-[#030B20] cyber-grid-bg min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-[#071A3D] px-4 py-1 text-xs font-semibold text-[#00D4FF]">
            <Sparkles className="h-3.5 w-3.5" /> LIVE INTERACTIVE WALKTHROUGH
          </div>
          <h1 className="mt-4 font-heading text-4xl font-bold text-white sm:text-5xl">
            Book Your <span className="neon-text-gradient">Free AI Demo</span>
          </h1>
          <p className="mt-3 text-sm text-[#A8B8D8] sm:text-base">
            Experience how Seekhvo teaches Python, Machine Learning, Generative AI, and Agentic AI with real code and live mentorship.
          </p>
        </div>

        <div className="mt-10 glass-panel rounded-3xl p-8 sm:p-10">
          {done ? (
            <div className="py-10 text-center space-y-4">
              <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-400" />
              <h2 className="font-heading text-2xl font-bold text-white">Demo Request Confirmed!</h2>
              <p className="text-sm text-[#A8B8D8] max-w-md mx-auto">
                We have registered your free demo request and sent a confirmation notification. Our team will share your Google Meet / Zoom invite shortly.
              </p>
              <div className="pt-4">
                <a
                  href="https://wa.me/918280765204?text=Hello%20Seekhvo%20Team%2C%20I%20have%20submitted%20a%20demo%20booking%20and%20would%20like%20to%20confirm%20my%20slot."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-6 py-3 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/25 transition"
                >
                  <MessageCircle className="h-4 w-4" />
                  Connect with Academic Advisor on WhatsApp (+91 8280765204)
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
              {error && (
                <div className="rounded-xl border border-red-400/40 bg-red-500/10 p-3 text-xs text-red-200">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#A8B8D8]">Full Name *</label>
                  <input
                    required
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-cyan-400/20 bg-[#030B20] px-4 py-3 text-sm text-white focus:border-[#00D4FF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#A8B8D8]">Email Address *</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-cyan-400/20 bg-[#030B20] px-4 py-3 text-sm text-white focus:border-[#00D4FF] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#A8B8D8]">Phone / WhatsApp *</label>
                  <input
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-cyan-400/20 bg-[#030B20] px-4 py-3 text-sm text-white focus:border-[#00D4FF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#A8B8D8]">Program of Interest</label>
                  <select
                    value={form.course}
                    onChange={(e) => setForm({ ...form, course: e.target.value })}
                    className="w-full rounded-xl border border-cyan-400/20 bg-[#030B20] px-4 py-3 text-sm text-white focus:border-[#00D4FF] focus:outline-none"
                  >
                    <option value="">General AI Track Guidance</option>
                    {courses.map((c) => (
                      <option key={c.id} value={String(c.id)}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#A8B8D8]">Preferred Slot</label>
                  <select
                    value={form.preferred_slot}
                    onChange={(e) => setForm({ ...form, preferred_slot: e.target.value })}
                    className="w-full rounded-xl border border-cyan-400/20 bg-[#030B20] px-4 py-3 text-sm text-white focus:border-[#00D4FF] focus:outline-none"
                  >
                    <option>Weekday Evening (7:30 PM IST)</option>
                    <option>Weekend Morning (11:00 AM IST)</option>
                    <option>Weekend Evening (7:00 PM IST)</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#A8B8D8]">Current Experience</label>
                  <select
                    value={form.experience_level}
                    onChange={(e) => setForm({ ...form, experience_level: e.target.value })}
                    className="w-full rounded-xl border border-cyan-400/20 bg-[#030B20] px-4 py-3 text-sm text-white focus:border-[#00D4FF] focus:outline-none"
                  >
                    <option>Beginner / Non-Coding Background</option>
                    <option>Student / Fresh Graduate</option>
                    <option>Software Developer / Data Analyst</option>
                    <option>Experienced Engineer Upskilling in GenAI</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#A8B8D8]">Learning Goals (Optional)</label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Tell us what you want to learn or build..."
                  className="w-full rounded-xl border border-cyan-400/20 bg-[#030B20] px-4 py-3 text-sm text-white focus:border-[#00D4FF] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#087BFF] to-[#00D4FF] py-3.5 text-sm font-semibold text-white shadow-neon hover:brightness-110 disabled:opacity-60"
              >
                <CalendarClock className="h-4 w-4" />
                {submitting ? "Booking Slot..." : "Confirm Free Demo Booking"}
              </button>

              <div className="pt-2 text-center">
                <p className="text-xs text-[#A8B8D8]">
                  Prefer instant WhatsApp booking?{" "}
                  <a
                    href="https://wa.me/918280765204?text=Hello%20Seekhvo%20Team%2C%20I%20am%20interested%20in%20your%20AI%20courses.%20Please%20share%20the%20details."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-emerald-300 hover:text-emerald-200 underline underline-offset-4 inline-flex items-center gap-1"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    Chat on WhatsApp (+91 8280765204)
                  </a>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}


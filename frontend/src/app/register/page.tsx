"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { SeekhvoLogo } from "@/components/ui/SeekhvoLogo";
import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    city: "",
    password: "",
    confirm_password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm_password) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await register(form);
      router.push("/dashboard/student");
    } catch (err) {
      if (err instanceof ApiError && typeof err.payload === "object" && err.payload !== null) {
        const firstVal = Object.values(err.payload as Record<string, unknown>)[0];
        setError(Array.isArray(firstVal) ? String(firstVal[0]) : err.message);
      } else {
        setError("Registration failed. Please check your inputs.");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="pt-32 pb-24 bg-[#030B20] cyber-grid-bg min-h-screen flex items-center justify-center px-4">
      <div className="glass-panel w-full max-w-lg rounded-3xl p-8 sm:p-10">
        <div className="text-center">
          <div className="flex justify-center">
            <SeekhvoLogo height={52} href="" />
          </div>
          <h1 className="mt-5 font-heading text-2xl font-bold text-white">Create Student Account</h1>
          <p className="mt-1.5 text-sm text-[#A8B8D8]">Join Seekhvo AI Learning at seekhvo.space</p>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="mt-7 space-y-4">
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
              <label className="mb-1.5 block text-xs font-medium text-[#A8B8D8]">Phone / WhatsApp</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full rounded-xl border border-cyan-400/20 bg-[#030B20] px-4 py-3 text-sm text-white focus:border-[#00D4FF] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#A8B8D8]">City</label>
              <input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Bengaluru / Remote"
                className="w-full rounded-xl border border-cyan-400/20 bg-[#030B20] px-4 py-3 text-sm text-white focus:border-[#00D4FF] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#A8B8D8]">Password *</label>
              <input
                required
                minLength={8}
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min. 8 characters"
                className="w-full rounded-xl border border-cyan-400/20 bg-[#030B20] px-4 py-3 text-sm text-white focus:border-[#00D4FF] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#A8B8D8]">Confirm Password *</label>
              <input
                required
                minLength={8}
                type="password"
                value={form.confirm_password}
                onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
                placeholder="Re-enter password"
                className="w-full rounded-xl border border-cyan-400/20 bg-[#030B20] px-4 py-3 text-sm text-white focus:border-[#00D4FF] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#087BFF] to-[#00D4FF] py-3.5 text-sm font-semibold text-white shadow-neon hover:brightness-110 disabled:opacity-60"
          >
            <UserPlus className="h-4 w-4" />
            {busy ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[#A8B8D8]">
          Already registered?{" "}
          <Link href="/login" className="font-semibold text-[#00D4FF] hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}


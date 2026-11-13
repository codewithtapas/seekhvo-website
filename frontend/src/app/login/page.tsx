"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, ArrowRight } from "lucide-react";
import { SeekhvoLogo } from "@/components/ui/SeekhvoLogo";
import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const user = await login(email, password);
      if (user.role === "ADMIN") router.push("/dashboard/admin");
      else if (user.role === "INSTRUCTOR") router.push("/dashboard/instructor");
      else router.push("/dashboard/student");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Invalid email or password.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="pt-32 pb-24 bg-[#030B20] cyber-grid-bg min-h-screen flex items-center justify-center px-4">
      <div className="glass-panel w-full max-w-md rounded-3xl p-8 sm:p-10">
        <div className="text-center">
          <div className="flex justify-center">
            <SeekhvoLogo height={52} href="" />
          </div>
          <h1 className="mt-5 font-heading text-2xl font-bold text-white">Sign In to Seekhvo</h1>
          <p className="mt-1.5 text-sm text-[#A8B8D8]">Access your courses, live sessions, and labs.</p>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="mt-7 space-y-4">
          {error && (
            <div className="rounded-xl border border-red-400/40 bg-red-500/10 p-3 text-xs text-red-200">
              {error}
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#A8B8D8]">Email Address</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@seekhvo.space"
              className="w-full rounded-xl border border-cyan-400/20 bg-[#030B20] px-4 py-3 text-sm text-white focus:border-[#00D4FF] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#A8B8D8]">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-cyan-400/20 bg-[#030B20] px-4 py-3 text-sm text-white focus:border-[#00D4FF] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#087BFF] to-[#00D4FF] py-3.5 text-sm font-semibold text-white shadow-neon hover:brightness-110 disabled:opacity-60"
          >
            <LogIn className="h-4 w-4" />
            {busy ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[#A8B8D8]">
          New to Seekhvo?{" "}
          <Link href="/register" className="font-semibold text-[#00D4FF] hover:underline inline-flex items-center gap-1">
            Create Student Account <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}


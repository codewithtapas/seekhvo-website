"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Search } from "lucide-react";

export default function VerifyIndexPage() {
  const router = useRouter();
  const [certId, setCertId] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (certId.trim()) {
      router.push(`/verify/${encodeURIComponent(certId.trim().toUpperCase())}`);
    }
  };

  return (
    <div className="pt-32 pb-24 bg-[#030B20] cyber-grid-bg min-h-screen flex items-center justify-center px-4">
      <div className="glass-panel w-full max-w-lg rounded-3xl p-8 sm:p-10 text-center">
        <ShieldCheck className="mx-auto h-12 w-12 text-[#00D4FF]" />
        <h1 className="mt-4 font-heading text-3xl font-bold text-white">Verify a Seekhvo Certificate</h1>
        <p className="mt-2 text-sm text-[#A8B8D8]">
          Enter a Certificate ID (e.g., <code className="text-[#00D4FF]">SKV-2026-DEMO01</code>) or scan the QR code printed on any Seekhvo certificate.
        </p>

        <form onSubmit={handleSearch} className="mt-7 flex gap-2">
          <input
            required
            value={certId}
            onChange={(e) => setCertId(e.target.value)}
            placeholder="SKV-2026-XXXXXX"
            className="flex-1 rounded-full border border-cyan-400/30 bg-[#030B20] px-5 py-3 text-sm text-white focus:border-[#00D4FF] focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#087BFF] to-[#00D4FF] px-6 py-3 text-sm font-semibold text-white"
          >
            <Search className="h-4 w-4" />
            Verify
          </button>
        </form>
      </div>
    </div>
  );
}


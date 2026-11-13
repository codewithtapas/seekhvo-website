"use client";

import { MessageCircle } from "lucide-react";

export function WhatsAppWidget() {
  const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918280765204").replace(/\D/g, "");
  const href = `https://wa.me/${number}?text=${encodeURIComponent(
    "Hello Seekhvo Team, I am interested in your AI courses. Please share the details."
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp +91 8280765204"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-[#071A3D]/95 px-4 py-3 text-sm font-medium text-emerald-300 shadow-lg backdrop-blur-xl transition hover:scale-105 hover:border-emerald-300 hover:bg-emerald-500/20"
    >
      <MessageCircle className="h-5 w-5 text-emerald-400" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}

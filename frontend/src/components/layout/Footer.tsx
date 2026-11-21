import Link from "next/link";
import { MessageCircle, Mail, ShieldCheck, Globe, Phone } from "lucide-react";
import { SeekhvoLogo } from "@/components/ui/SeekhvoLogo";

export function Footer() {
  const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918280765204").replace(/\D/g, "");
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hello Seekhvo Team, I am interested in your AI courses. Please share the details."
  )}`;

  return (
    <footer className="border-t border-cyan-400/15 bg-[#030B20] pt-16 pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <SeekhvoLogo height={52} />
            <p className="text-sm leading-relaxed text-[#A8B8D8]">
              Practical Artificial Intelligence education built around live engineering mentorship, hands-on projects, and verified technical capability.
            </p>
            <div className="flex items-center gap-3 text-xs text-[#A8B8D8]">
              <Globe className="h-4 w-4 text-[#00D4FF]" />
              <span>seekhvo.space</span>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">Programs</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-[#A8B8D8]">
              <li><Link href="/courses" className="hover:text-[#00D4FF] transition">All AI Programs</Link></li>
              <li><Link href="/ai-courses-odisha" className="hover:text-[#00D4FF] transition">AI Courses in Odisha</Link></li>
              <li><Link href="/ai-training-bhubaneswar" className="hover:text-[#00D4FF] transition">AI Training in Bhubaneswar</Link></li>
              <li><Link href="/courses/ai-engineer-program" className="hover:text-[#00D4FF] transition">AI Engineer Program</Link></li>
              <li><Link href="/courses/generative-ai" className="hover:text-[#00D4FF] transition">Generative AI</Link></li>
              <li><Link href="/projects" className="hover:text-[#00D4FF] transition">AI Projects</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">Platform</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-[#A8B8D8]">
              <li><Link href="/about" className="hover:text-[#00D4FF] transition">About Seekhvo</Link></li>
              <li><Link href="/blog" className="hover:text-[#00D4FF] transition">Engineering Blog</Link></li>
              <li><Link href="/trainers" className="hover:text-[#00D4FF] transition">Trainers</Link></li>
              <li><Link href="/book-demo" className="hover:text-[#00D4FF] transition">Book Free Demo</Link></li>
              <li><Link href="/verify" className="hover:text-[#00D4FF] transition inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-[#00D4FF]" />Verify Certificate</Link></li>
              <li><Link href="/faq" className="hover:text-[#00D4FF] transition">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">Official Contact</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-[#A8B8D8]">
              <li><Link href="/contact" className="hover:text-[#00D4FF] transition">Contact Us</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-[#00D4FF] transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#00D4FF] transition">Terms & Conditions</Link></li>
              <li><Link href="/refund-policy" className="hover:text-[#00D4FF] transition">Refund Policy</Link></li>
            </ul>
            <div className="mt-5 flex flex-col gap-2">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition"
              >
                <MessageCircle className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>WhatsApp: +91 8280765204</span>
              </a>
              <a
                href="mailto:hello@seekhvo.space"
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-[#0A1D40] px-3.5 py-2 text-xs font-medium text-[#42A5FF] hover:text-white transition"
              >
                <Mail className="h-4 w-4 shrink-0" />
                <span>hello@seekhvo.space</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-[#A8B8D8] sm:flex-row">
          <p>© {new Date().getFullYear()} Seekhvo AI Learning (seekhvo.space). All rights reserved.</p>
          <p>Official Helpline & WhatsApp: +91 8280765204</p>
        </div>
      </div>
    </footer>
  );
}

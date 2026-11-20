"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown, Sparkles, ArrowRight } from "lucide-react";
import { SeekhvoParticleHero } from "@/components/three/SeekhvoParticleHero";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!sectionRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      if (!prefersReduced) {
        gsap.fromTo(
          contentRef.current,
          { opacity: 0.15, y: 18 },
          { opacity: 1, y: 0, duration: 0.9, delay: 0.25, ease: "power3.out" }
        );
      }

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          scrollProgressRef.current = self.progress;
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-screen min-h-[700px] w-full items-center justify-center overflow-hidden bg-[#030B20] pt-20"
    >
      {/* Radial depth vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(8,123,255,0.20) 0%, rgba(3,11,32,0.88) 58%, #030B20 100%)",
        }}
      />

      {/* Real-time WebGL Procedural 3D Particle Mandala */}
      <div className="absolute inset-0 z-10 h-full w-full">
        <SeekhvoParticleHero scrollProgressRef={scrollProgressRef} />
      </div>

      {/* Center Typography & CTAs framed inside the particle mandala eye */}
      <div
        ref={contentRef}
        className="relative z-20 mx-auto max-w-xl px-6 text-center pointer-events-auto"
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-[#0A1D40]/75 px-3.5 py-1 text-[11px] font-medium tracking-wider text-[#00D4FF] backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5" />
          NEXT-GEN AI EDUCATION • SEEKHVO.SPACE
        </div>

        <h1 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-[3.2rem] leading-[1.08]">
          Seekhvo AI Learning — <span className="neon-text-gradient">Learn Beyond Limits</span>
        </h1>

        <p className="mt-3 font-heading text-base font-medium text-[#42A5FF] sm:text-lg">
          AI Learning Platform for Artificial Intelligence, Generative AI & Machine Learning Engineering
        </p>

        <p className="mx-auto mt-3 max-w-md text-xs leading-relaxed text-[#A8B8D8] sm:text-sm">
          Discover practical AI education through expert-led training, real-world projects and future-ready skills.
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/courses"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#087BFF] to-[#00D4FF] px-6 py-3 text-xs sm:text-sm font-semibold tracking-wide text-white shadow-neon-strong transition hover:scale-[1.03] hover:brightness-110"
          >
            EXPLORE COURSES
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/book-demo"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-cyan-400/40 bg-[#0A1D40]/75 px-6 py-3 text-xs sm:text-sm font-semibold tracking-wide text-white backdrop-blur-md transition hover:border-[#00D4FF] hover:bg-[#0A1D40]"
          >
            BOOK FREE DEMO
          </Link>
        </div>
      </div>

      {/* Animated Bottom Scroll Indicator */}
      <a
        href="#introduction"
        className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-1 text-[10px] font-medium tracking-[0.22em] text-[#A8B8D8] hover:text-[#00D4FF] transition"
      >
        <span>SCROLL DOWN</span>
        <ChevronDown className="h-4 w-4 animate-bounce text-[#00D4FF]" />
      </a>
    </section>
  );
}

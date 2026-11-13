"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  Layers,
  CheckCircle2,
  PlayCircle,
  Lock,
  ShieldCheck,
  Tag,
  ArrowLeft,
} from "lucide-react";
import { apiFetch, formatPrice, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { CourseItem, PaymentOrderItem } from "@/lib/types";

export default function CourseDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [course, setCourse] = useState<CourseItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [checkoutMsg, setCheckoutMsg] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.slug) return;
    apiFetch<CourseItem>(`/courses/${params.slug}/`)
      .then(setCourse)
      .catch(() => setCourse(null))
      .finally(() => setLoading(false));
  }, [params?.slug]);

  const handleEnrollCheckout = async () => {
    if (!course) return;
    if (!user) {
      router.push(`/login?next=/courses/${course.slug}`);
      return;
    }
    setCheckoutBusy(true);
    setCheckoutError(null);
    setCheckoutMsg(null);
    try {
      const created = await apiFetch<{
        order: PaymentOrderItem;
        gateway: { mode: string; gateway_order_id: string };
      }>("/payments/create_order/", {
        method: "POST",
        auth: true,
        body: JSON.stringify({ course_id: course.id, coupon_code: couponCode }),
      });

      if (created.gateway.mode === "sandbox") {
        // Complete sandbox HMAC-signed verification on the server
        await apiFetch(`/payments/${created.order.id}/sandbox_simulate/`, {
          method: "POST",
          auth: true,
        });
        setCheckoutMsg(
          `Sandbox payment verified (${created.order.order_reference}). Redirecting to your Student Dashboard...`
        );
        setTimeout(() => router.push("/dashboard/student"), 1200);
      } else {
        setCheckoutMsg(
          `Order ${created.order.order_reference} created via ${created.gateway.mode}. Complete checkout in the gateway modal.`
        );
      }
    } catch (err) {
      setCheckoutError(err instanceof ApiError ? err.message : "Unable to start checkout.");
    } finally {
      setCheckoutBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-[#030B20] flex items-center justify-center text-[#A8B8D8]">
        Loading course syllabus...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-[#030B20] text-center px-4">
        <h1 className="font-heading text-3xl font-bold text-white">Course Not Found</h1>
        <Link href="/courses" className="mt-6 inline-block rounded-full bg-[#087BFF] px-6 py-3 text-sm font-semibold text-white">
          Back to Courses
        </Link>
      </div>
    );
  }

  const hasDiscount =
    course.discount_price !== null &&
    parseFloat(course.discount_price) < parseFloat(course.price);

  return (
    <div className="pt-28 pb-24 bg-[#030B20] cyber-grid-bg min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link href="/courses" className="inline-flex items-center gap-1.5 text-sm text-[#42A5FF] hover:text-[#00D4FF]">
          <ArrowLeft className="h-4 w-4" /> All Courses
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Main Curriculum & Overview */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-panel rounded-3xl p-8">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="rounded-full border border-cyan-400/30 bg-[#071A3D] px-3 py-1 font-semibold text-[#00D4FF]">
                  {course.level.replace("_", " ")}
                </span>
                <span className="rounded-full border border-white/15 bg-[#030B20] px-3 py-1 text-[#A8B8D8]">
                  {course.delivery_mode}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[#A8B8D8]">
                  <Clock className="h-3.5 w-3.5 text-[#00D4FF]" /> {course.duration_label}
                </span>
              </div>

              <h1 className="mt-4 font-heading text-3xl font-bold text-white sm:text-4xl">
                {course.title}
              </h1>
              <p className="mt-2 text-lg text-[#42A5FF]">{course.tagline}</p>
              <p className="mt-4 text-sm leading-relaxed text-[#A8B8D8] sm:text-base">
                {course.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {course.tools_covered.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-lg border border-cyan-400/20 bg-[#071A3D]/80 px-3 py-1 text-xs font-medium text-white"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {course.outcomes && course.outcomes.length > 0 && (
              <div className="glass-panel rounded-3xl p-8">
                <h2 className="font-heading text-2xl font-bold text-white">What You Will Build & Master</h2>
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {course.outcomes.map((out) => (
                    <div key={out} className="flex items-start gap-2.5 text-sm text-[#A8B8D8]">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#00D4FF]" />
                      <span>{out}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modules & Lessons */}
            <div className="glass-panel rounded-3xl p-8">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-2xl font-bold text-white">Curriculum Syllabus</h2>
                <span className="inline-flex items-center gap-1.5 text-xs text-[#42A5FF]">
                  <Layers className="h-4 w-4" /> {course.modules?.length || 0} Modules
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {(course.modules || []).map((mod) => (
                  <div key={mod.id} className="rounded-2xl border border-cyan-400/15 bg-[#030B20]/75 p-5">
                    <h3 className="font-heading text-lg font-semibold text-white">{mod.title}</h3>
                    {mod.description && <p className="mt-1 text-xs text-[#A8B8D8]">{mod.description}</p>}
                    <ul className="mt-4 space-y-2.5">
                      {mod.lessons.map((lesson) => (
                        <li
                          key={lesson.id}
                          className="flex items-center justify-between rounded-xl border border-white/5 bg-[#0A1D40]/60 px-4 py-2.5 text-sm"
                        >
                          <div className="flex items-center gap-3">
                            {lesson.is_free_preview ? (
                              <PlayCircle className="h-4 w-4 text-[#00D4FF]" />
                            ) : (
                              <Lock className="h-4 w-4 text-[#A8B8D8]/60" />
                            )}
                            <span className="text-white">{lesson.title}</span>
                            {lesson.is_free_preview && (
                              <span className="rounded-full bg-[#00D4FF]/15 px-2 py-0.5 text-[10px] font-semibold text-[#00D4FF]">
                                Preview
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-[#A8B8D8]">{lesson.duration_minutes} min</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Enrollment & Payment Card */}
          <div>
            <div className="glass-panel sticky top-28 rounded-3xl p-7 space-y-5">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-[#00D4FF]">
                  PROGRAM TUITION
                </div>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="font-heading text-4xl font-bold text-white">
                    {formatPrice(course.effective_price, course.currency)}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-[#A8B8D8] line-through">
                      {formatPrice(course.price, course.currency)}
                    </span>
                  )}
                </div>
                {course.installment_available && (
                  <p className="mt-1.5 text-xs text-[#42A5FF]">{course.installment_summary}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-[#A8B8D8] flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-[#00D4FF]" />
                  Have a coupon? (Dev test code: <code className="text-white">SEEKHVO10</code>)
                </label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="w-full rounded-xl border border-cyan-400/25 bg-[#030B20] px-3.5 py-2.5 text-sm text-white placeholder-[#A8B8D8]/50 focus:border-[#00D4FF] focus:outline-none"
                />
              </div>

              {checkoutError && (
                <div className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-xs text-red-200">
                  {checkoutError}
                </div>
              )}
              {checkoutMsg && (
                <div className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-200">
                  {checkoutMsg}
                </div>
              )}

              <button
                onClick={() => void handleEnrollCheckout()}
                disabled={checkoutBusy}
                className="w-full rounded-full bg-gradient-to-r from-[#087BFF] to-[#00D4FF] py-3.5 text-sm font-semibold text-white shadow-neon hover:brightness-110 transition disabled:opacity-60"
              >
                {checkoutBusy ? "Creating Secure Order..." : user ? "Enroll Now (Sandbox / Gateway)" : "Sign In to Enroll"}
              </button>

              <Link
                href={`/book-demo?course=${course.id}`}
                className="block w-full rounded-full border border-cyan-400/35 py-3 text-center text-sm font-semibold text-white hover:border-[#00D4FF] transition"
              >
                Book Free Demo First
              </Link>

              <div className="border-t border-white/10 pt-4 space-y-2.5">
                {course.included_features.map((feat) => (
                  <div key={feat} className="flex items-start gap-2 text-xs text-[#A8B8D8]">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-[#00D4FF]" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


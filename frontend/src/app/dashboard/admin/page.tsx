"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  BookOpen,
  CreditCard,
  Award,
  TrendingUp,
  UserPlus,
  Layers,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { apiFetch, formatPrice, type PaginatedResponse } from "@/lib/api";
import type {
  AdminAnalytics,
  CertificateItem,
  CourseItem,
  DemoBookingItem,
  PaymentOrderItem,
  UserProfile,
} from "@/lib/types";

type AdminTab = "analytics" | "students" | "courses" | "payments" | "certificates" | "leads";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [tab, setTab] = useState<AdminTab>("analytics");

  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [payments, setPayments] = useState<PaymentOrderItem[]>([]);
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [leads, setLeads] = useState<DemoBookingItem[]>([]);
  const [banner, setBanner] = useState<string | null>(null);

  // Forms
  const [newCourse, setNewCourse] = useState({
    title: "",
    slug: "",
    short_description: "",
    description: "",
    duration_label: "12 Weeks",
    price: "24999",
  });
  const [certForm, setCertForm] = useState({ student: "", course: "", grade_or_remarks: "Distinction" });

  const loadAdminData = useCallback(async () => {
    const [an, usr, crs, pay, crt, ld] = await Promise.all([
      apiFetch<AdminAnalytics>("/admin/analytics/", { auth: true }).catch(() => null),
      apiFetch<PaginatedResponse<UserProfile>>("/admin/users/", { auth: true }).catch(() => ({ results: [] })),
      apiFetch<PaginatedResponse<CourseItem>>("/courses/", { auth: true }).catch(() => ({ results: [] })),
      apiFetch<PaginatedResponse<PaymentOrderItem>>("/payments/", { auth: true }).catch(() => ({ results: [] })),
      apiFetch<PaginatedResponse<CertificateItem>>("/certificates/", { auth: true }).catch(() => ({ results: [] })),
      apiFetch<PaginatedResponse<DemoBookingItem>>("/demo-bookings/", { auth: true }).catch(() => ({ results: [] })),
    ]);
    setAnalytics(an);
    setUsers(usr.results || []);
    setCourses(crs.results || []);
    setPayments(pay.results || []);
    setCertificates(crt.results || []);
    setLeads(ld.results || []);
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
        return;
      }
      if (user.role !== "ADMIN") {
        router.push(user.role === "INSTRUCTOR" ? "/dashboard/instructor" : "/dashboard/student");
        return;
      }
      void loadAdminData();
    }
  }, [loading, user, router, loadAdminData]);

  const toggleUserActive = async (u: UserProfile) => {
    await apiFetch(`/admin/users/${u.id}/`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify({ is_active: !u.is_active }),
    });
    setBanner(`Updated account status for ${u.email}.`);
    await loadAdminData();
  };

  const toggleCoursePublish = async (c: CourseItem) => {
    await apiFetch(`/courses/${c.slug}/`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify({ is_published: !c.is_published }),
    });
    setBanner(`Course '${c.title}' publish status updated.`);
    await loadAdminData();
  };

  const createCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug =
      newCourse.slug ||
      newCourse.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    await apiFetch("/courses/", {
      method: "POST",
      auth: true,
      body: JSON.stringify({ ...newCourse, slug, is_published: true }),
    });
    setNewCourse({ title: "", slug: "", short_description: "", description: "", duration_label: "12 Weeks", price: "24999" });
    setBanner("New course published.");
    await loadAdminData();
  };

  const issueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch("/certificates/", {
      method: "POST",
      auth: true,
      body: JSON.stringify({
        student: Number(certForm.student),
        course: Number(certForm.course),
        grade_or_remarks: certForm.grade_or_remarks,
      }),
    });
    setBanner("Certificate generated with QR verification code.");
    await loadAdminData();
  };

  const updateLeadStatus = async (leadId: number, statusVal: string) => {
    await apiFetch(`/demo-bookings/${leadId}/`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify({ status: statusVal }),
    });
    setBanner("Lead status updated.");
    await loadAdminData();
  };

  if (loading || !user) {
    return <div className="pt-32 min-h-screen bg-[#030B20] text-center text-[#A8B8D8]">Loading Admin Console...</div>;
  }

  return (
    <div className="pt-28 pb-20 bg-[#030B20] cyber-grid-bg min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00D4FF]">ADMINISTRATION & CRM</span>
            <h1 className="mt-1 font-heading text-3xl font-bold text-white">Seekhvo Control Center</h1>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/35 bg-[#0A1D40] px-4 py-1.5 text-xs text-[#00D4FF]">
            <ShieldCheck className="h-4 w-4" /> Role: {user.role}
          </span>
        </div>

        {banner && (
          <div className="rounded-xl border border-cyan-400/35 bg-[#0A1D40] px-4 py-3 text-xs text-[#00D4FF]">
            {banner}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {(
            [
              ["analytics", "Analytics", TrendingUp],
              ["students", "Students & Users", Users],
              ["courses", "Courses", BookOpen],
              ["payments", "Payments", CreditCard],
              ["certificates", "Certificates", Award],
              ["leads", "Demo Leads", UserPlus],
            ] as const
          ).map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
                tab === key ? "bg-[#087BFF] text-white shadow-neon" : "glass-panel text-[#A8B8D8] hover:text-white"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        {tab === "analytics" && analytics && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Total Students", analytics.total_students],
              ["Active Courses", analytics.active_courses],
              ["Total Enrollments", analytics.total_enrollments],
              ["Verified Revenue", formatPrice(analytics.revenue, analytics.currency)],
              ["Pending Payments", analytics.pending_payments],
              ["Demo Registrations", analytics.demo_registrations],
            ].map(([label, val]) => (
              <div key={String(label)} className="glass-panel rounded-2xl p-6">
                <div className="text-xs text-[#42A5FF] uppercase tracking-wider">{label}</div>
                <div className="mt-3 font-heading text-3xl font-bold text-white">{val}</div>
              </div>
            ))}
          </div>
        )}

        {tab === "students" && (
          <div className="glass-panel rounded-2xl overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-[#A8B8D8]">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="p-4 font-semibold text-white">{u.full_name}</td>
                    <td className="p-4 text-[#A8B8D8]">{u.email}</td>
                    <td className="p-4 text-[#42A5FF]">{u.role}</td>
                    <td className="p-4">{u.is_active ? "Active" : "Deactivated"}</td>
                    <td className="p-4">
                      <button
                        onClick={() => void toggleUserActive(u)}
                        className="rounded-full border border-cyan-400/30 px-3 py-1 text-white hover:border-[#00D4FF]"
                      >
                        {u.is_active ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "courses" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <form onSubmit={(e) => void createCourse(e)} className="glass-panel rounded-2xl p-6 space-y-3">
              <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#00D4FF]" /> Create Course
              </h2>
              <input
                required
                value={newCourse.title}
                onChange={(e) => setNewCourse((c) => ({ ...c, title: e.target.value }))}
                placeholder="Course Title"
                className="w-full rounded-xl border border-cyan-400/20 bg-[#030B20] px-3.5 py-2.5 text-sm text-white"
              />
              <input
                required
                value={newCourse.duration_label}
                onChange={(e) => setNewCourse((c) => ({ ...c, duration_label: e.target.value }))}
                placeholder="Duration (e.g. 12 Weeks)"
                className="w-full rounded-xl border border-cyan-400/20 bg-[#030B20] px-3.5 py-2.5 text-sm text-white"
              />
              <input
                required
                type="number"
                value={newCourse.price}
                onChange={(e) => setNewCourse((c) => ({ ...c, price: e.target.value }))}
                placeholder="Price (INR)"
                className="w-full rounded-xl border border-cyan-400/20 bg-[#030B20] px-3.5 py-2.5 text-sm text-white"
              />
              <textarea
                required
                rows={2}
                value={newCourse.short_description}
                onChange={(e) => setNewCourse((c) => ({ ...c, short_description: e.target.value, description: e.target.value }))}
                placeholder="Short description"
                className="w-full rounded-xl border border-cyan-400/20 bg-[#030B20] px-3.5 py-2.5 text-sm text-white"
              />
              <button className="w-full rounded-full bg-[#087BFF] py-2.5 text-xs font-semibold text-white">
                Save & Publish Course
              </button>
            </form>

            <div className="lg:col-span-2 space-y-3">
              {courses.map((c) => (
                <div key={c.id} className="glass-panel rounded-2xl p-5 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-heading font-bold text-white">{c.title}</h3>
                    <p className="text-xs text-[#A8B8D8]">{c.duration_label} • {formatPrice(c.effective_price, c.currency)}</p>
                  </div>
                  <button
                    onClick={() => void toggleCoursePublish(c)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold ${
                      c.is_published ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"
                    }`}
                  >
                    {c.is_published ? "Published" : "Draft"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "payments" && (
          <div className="glass-panel rounded-2xl overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-[#A8B8D8]">
                <tr>
                  <th className="p-4">Order Ref</th>
                  <th className="p-4">Student</th>
                  <th className="p-4">Course</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td className="p-4 font-mono text-white">{p.order_reference}</td>
                    <td className="p-4 text-[#A8B8D8]">{p.student_email}</td>
                    <td className="p-4 text-white">{p.course_title}</td>
                    <td className="p-4 text-white">{formatPrice(p.final_amount, p.currency)}</td>
                    <td className="p-4 text-[#00D4FF]">{p.status}</td>
                    <td className="p-4">
                      {p.status === "PAID" && (
                        <button
                          onClick={async () => {
                            await apiFetch(`/payments/${p.id}/mark_refunded/`, { method: "POST", auth: true });
                            await loadAdminData();
                          }}
                          className="rounded-full border border-red-400/35 px-3 py-1 text-red-300"
                        >
                          Mark Refunded
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "certificates" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <form onSubmit={(e) => void issueCertificate(e)} className="glass-panel rounded-2xl p-6 space-y-3">
              <h2 className="font-heading text-lg font-bold text-white">Issue Certificate</h2>
              <select
                required
                value={certForm.student}
                onChange={(e) => setCertForm((f) => ({ ...f, student: e.target.value }))}
                className="w-full rounded-xl border border-cyan-400/20 bg-[#030B20] px-3.5 py-2.5 text-sm text-white"
              >
                <option value="">Select Student</option>
                {users.filter((u) => u.role === "STUDENT").map((u) => (
                  <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>
                ))}
              </select>
              <select
                required
                value={certForm.course}
                onChange={(e) => setCertForm((f) => ({ ...f, course: e.target.value }))}
                className="w-full rounded-xl border border-cyan-400/20 bg-[#030B20] px-3.5 py-2.5 text-sm text-white"
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
              <input
                value={certForm.grade_or_remarks}
                onChange={(e) => setCertForm((f) => ({ ...f, grade_or_remarks: e.target.value }))}
                placeholder="Remarks (e.g. Distinction)"
                className="w-full rounded-xl border border-cyan-400/20 bg-[#030B20] px-3.5 py-2.5 text-sm text-white"
              />
              <button className="w-full rounded-full bg-[#087BFF] py-2.5 text-xs font-semibold text-white">
                Generate Certificate & QR
              </button>
            </form>

            <div className="lg:col-span-2 space-y-3">
              {certificates.map((c) => (
                <div key={c.id} className="glass-panel rounded-2xl p-5 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="font-mono text-[#00D4FF]">{c.certificate_id}</div>
                    <div className="font-heading text-base font-bold text-white">{c.recipient_name} — {c.course_title}</div>
                  </div>
                  <span className="text-[#A8B8D8]">{c.issued_date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "leads" && (
          <div className="glass-panel rounded-2xl overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-[#A8B8D8]">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Interest</th>
                  <th className="p-4">Slot</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leads.map((l) => (
                  <tr key={l.id}>
                    <td className="p-4 font-semibold text-white">{l.full_name}</td>
                    <td className="p-4 text-[#A8B8D8]">{l.email}<br />{l.phone}</td>
                    <td className="p-4 text-white">{l.course_title || l.course_interest}</td>
                    <td className="p-4 text-[#A8B8D8]">{l.preferred_slot}</td>
                    <td className="p-4">
                      <select
                        value={l.status}
                        onChange={(e) => void updateLeadStatus(l.id, e.target.value)}
                        className="rounded-lg border border-cyan-400/25 bg-[#030B20] px-2.5 py-1 text-white"
                      >
                        <option value="NEW">NEW</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="SCHEDULED">SCHEDULED</option>
                        <option value="CONVERTED">CONVERTED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


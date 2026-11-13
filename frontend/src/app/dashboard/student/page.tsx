"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Calendar,
  FileText,
  Award,
  CreditCard,
  Bell,
  LifeBuoy,
  CheckCircle2,
  Circle,
  ExternalLink,
  Download,
  HelpCircle,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { apiFetch, formatPrice, getApiBase, tokenStore, type PaginatedResponse } from "@/lib/api";
import type {
  AssignmentItem,
  AssignmentSubmissionItem,
  CertificateItem,
  EnrollmentItem,
  LiveSessionItem,
  ModuleItem,
  NotificationItem,
  PaymentOrderItem,
  QuizItem,
  SupportRequestItem,
} from "@/lib/types";

type TabKey = "courses" | "live" | "assignments" | "quizzes" | "certificates" | "payments" | "notifications" | "support" | "profile";

export default function StudentDashboardPage() {
  const router = useRouter();
  const { user, loading, refreshUser } = useAuth();
  const [tab, setTab] = useState<TabKey>("courses");

  const [enrollments, setEnrollments] = useState<EnrollmentItem[]>([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentItem | null>(null);
  const [curriculum, setCurriculum] = useState<ModuleItem[]>([]);
  const [sessions, setSessions] = useState<LiveSessionItem[]>([]);
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmissionItem[]>([]);
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [payments, setPayments] = useState<PaymentOrderItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [tickets, setTickets] = useState<SupportRequestItem[]>([]);

  // Interactive form states
  const [subUrl, setSubUrl] = useState<Record<number, string>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<number, Record<number, number>>>({});
  const [quizResult, setQuizResult] = useState<string | null>(null);
  const [ticketForm, setTicketForm] = useState({ subject: "", message: "" });
  const [profileForm, setProfileForm] = useState({ full_name: "", phone: "", city: "" });
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    const [enr, ses, asg, sub, qz, cert, pay, notf, tkt] = await Promise.all([
      apiFetch<PaginatedResponse<EnrollmentItem>>("/enrollments/", { auth: true }).catch(() => ({ results: [] })),
      apiFetch<PaginatedResponse<LiveSessionItem>>("/live-sessions/", { auth: true }).catch(() => ({ results: [] })),
      apiFetch<PaginatedResponse<AssignmentItem>>("/assignments/", { auth: true }).catch(() => ({ results: [] })),
      apiFetch<PaginatedResponse<AssignmentSubmissionItem>>("/submissions/", { auth: true }).catch(() => ({ results: [] })),
      apiFetch<PaginatedResponse<QuizItem>>("/quizzes/", { auth: true }).catch(() => ({ results: [] })),
      apiFetch<PaginatedResponse<CertificateItem>>("/certificates/", { auth: true }).catch(() => ({ results: [] })),
      apiFetch<PaginatedResponse<PaymentOrderItem>>("/payments/", { auth: true }).catch(() => ({ results: [] })),
      apiFetch<PaginatedResponse<NotificationItem>>("/notifications/", { auth: true }).catch(() => ({ results: [] })),
      apiFetch<PaginatedResponse<SupportRequestItem>>("/support-requests/", { auth: true }).catch(() => ({ results: [] })),
    ]);

    const enrList = enr.results || [];
    setEnrollments(enrList);
    if (enrList.length > 0 && !selectedEnrollment) {
      setSelectedEnrollment(enrList[0]);
    }
    setSessions(ses.results || []);
    setAssignments(asg.results || []);
    setSubmissions(sub.results || []);
    setQuizzes(qz.results || []);
    setCertificates(cert.results || []);
    setPayments(pay.results || []);
    setNotifications(notf.results || []);
    setTickets(tkt.results || []);
  }, [selectedEnrollment]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }
    if (user) {
      setProfileForm({ full_name: user.full_name, phone: user.phone, city: user.city });
      void loadAll();
    }
  }, [loading, user, router, loadAll]);

  useEffect(() => {
    if (!selectedEnrollment) return;
    apiFetch<{ modules: ModuleItem[] }>(`/courses/${selectedEnrollment.course_detail.slug}/curriculum/`, { auth: true })
      .then((res) => setCurriculum(res.modules || []))
      .catch(() => setCurriculum([]));
  }, [selectedEnrollment]);

  const toggleLesson = async (enrollmentId: number, lessonId: number) => {
    const res = await apiFetch<{ lesson_id: number; is_completed: boolean; progress_percent: number }>(
      `/enrollments/${enrollmentId}/toggle_lesson/`,
      { method: "POST", auth: true, body: JSON.stringify({ lesson_id: lessonId }) }
    );
    setEnrollments((prev) =>
      prev.map((e) => {
        if (e.id !== enrollmentId) return e;
        const ids = res.is_completed
          ? [...new Set([...e.completed_lesson_ids, lessonId])]
          : e.completed_lesson_ids.filter((id) => id !== lessonId);
        const updated = { ...e, progress_percent: res.progress_percent, completed_lesson_ids: ids };
        if (selectedEnrollment?.id === enrollmentId) setSelectedEnrollment(updated);
        return updated;
      })
    );
  };

  const submitAssignment = async (assignmentId: number) => {
    const url = (subUrl[assignmentId] || "").trim();
    if (!url) return;
    await apiFetch("/submissions/", {
      method: "POST",
      auth: true,
      body: JSON.stringify({ assignment: assignmentId, submission_url: url, notes: "Submitted from Student Dashboard" }),
    });
    setStatusBanner("Assignment submitted successfully.");
    await loadAll();
  };

  const submitQuiz = async (quizId: number) => {
    const ans = quizAnswers[quizId] || {};
    const res = await apiFetch<{ score_percent: number; passed: boolean }>(`/quizzes/${quizId}/submit/`, {
      method: "POST",
      auth: true,
      body: JSON.stringify({ answers: ans }),
    });
    setQuizResult(`Score: ${res.score_percent}% — ${res.passed ? "Passed!" : "Keep practicing and retry."}`);
  };

  const downloadCertificate = async (certId: number, certCode: string) => {
    const token = tokenStore.getAccess();
    const res = await fetch(`${getApiBase()}/certificates/${certId}/download_pdf/`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Seekhvo-${certCode}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const createTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch("/support-requests/", { method: "POST", auth: true, body: JSON.stringify(ticketForm) });
    setTicketForm({ subject: "", message: "" });
    setStatusBanner("Support ticket opened.");
    await loadAll();
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch("/auth/me/", { method: "PATCH", auth: true, body: JSON.stringify(profileForm) });
    await refreshUser();
    setStatusBanner("Profile updated.");
  };

  if (loading || !user) {
    return <div className="pt-32 min-h-screen bg-[#030B20] text-center text-[#A8B8D8]">Loading Student Portal...</div>;
  }

  const tabs: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "courses", label: "My Courses", icon: BookOpen },
    { key: "live", label: "Live Classes", icon: Calendar },
    { key: "assignments", label: "Assignments", icon: FileText },
    { key: "quizzes", label: "Quizzes", icon: HelpCircle },
    { key: "certificates", label: "Certificates", icon: Award },
    { key: "payments", label: "Payments", icon: CreditCard },
    { key: "notifications", label: `Alerts (${notifications.filter((n) => !n.is_read).length})`, icon: Bell },
    { key: "support", label: "Support", icon: LifeBuoy },
    { key: "profile", label: "Profile", icon: CheckCircle2 },
  ];

  return (
    <div className="pt-28 pb-20 bg-[#030B20] cyber-grid-bg min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00D4FF]">STUDENT LMS PORTAL</span>
            <h1 className="mt-1 font-heading text-3xl font-bold text-white">Welcome, {user.full_name}</h1>
          </div>
          <Link href="/courses" className="rounded-full border border-cyan-400/35 px-5 py-2 text-xs font-semibold text-white hover:border-[#00D4FF]">
            Browse More Courses
          </Link>
        </div>

        {statusBanner && (
          <div className="mt-4 rounded-xl border border-cyan-400/35 bg-[#0A1D40] px-4 py-3 text-xs text-[#00D4FF]">
            {statusBanner}
          </div>
        )}

        <div className="mt-7 flex flex-wrap gap-2">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
                  tab === t.key ? "bg-[#087BFF] text-white shadow-neon" : "glass-panel text-[#A8B8D8] hover:text-white"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="mt-8">
          {tab === "courses" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-4">
                {enrollments.length === 0 ? (
                  <div className="glass-panel rounded-2xl p-6 text-sm text-[#A8B8D8]">
                    You have no active enrollments yet.{" "}
                    <Link href="/courses" className="text-[#00D4FF] underline">Explore programs →</Link>
                  </div>
                ) : (
                  enrollments.map((enr) => (
                    <button
                      key={enr.id}
                      onClick={() => setSelectedEnrollment(enr)}
                      className={`w-full text-left glass-panel rounded-2xl p-5 transition ${
                        selectedEnrollment?.id === enr.id ? "border-[#00D4FF] shadow-neon" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs text-[#42A5FF]">
                        <span>{enr.status}</span>
                        <span>{enr.progress_percent}% Complete</span>
                      </div>
                      <h3 className="mt-2 font-heading text-lg font-bold text-white">{enr.course_detail.title}</h3>
                      <div className="mt-3 h-1.5 w-full rounded-full bg-[#030B20]">
                        <div className="h-1.5 rounded-full bg-[#00D4FF]" style={{ width: `${enr.progress_percent}%` }} />
                      </div>
                    </button>
                  ))
                )}
              </div>

              <div className="lg:col-span-2">
                {selectedEnrollment ? (
                  <div className="glass-panel rounded-3xl p-7 space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h2 className="font-heading text-2xl font-bold text-white">{selectedEnrollment.course_detail.title}</h2>
                        <p className="text-xs text-[#A8B8D8]">
                          Cohort: {selectedEnrollment.batch_name || "Self-Paced / Standard"}
                        </p>
                      </div>
                      <span className="rounded-full bg-[#00D4FF]/15 px-3 py-1 text-xs font-semibold text-[#00D4FF]">
                        {selectedEnrollment.progress_percent}% Done
                      </span>
                    </div>

                    {curriculum.map((mod) => (
                      <div key={mod.id} className="rounded-2xl border border-white/10 bg-[#030B20]/70 p-5 space-y-3">
                        <h3 className="font-heading text-base font-bold text-white">{mod.title}</h3>
                        {mod.lessons.map((lesson) => {
                          const completed = selectedEnrollment.completed_lesson_ids.includes(lesson.id);
                          return (
                            <div key={lesson.id} className="flex items-start justify-between gap-4 rounded-xl bg-[#0A1D40]/60 p-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <button onClick={() => void toggleLesson(selectedEnrollment.id, lesson.id)}>
                                    {completed ? (
                                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                    ) : (
                                      <Circle className="h-5 w-5 text-[#A8B8D8]" />
                                    )}
                                  </button>
                                  <span className="font-medium text-sm text-white">{lesson.title}</span>
                                </div>
                                <p className="text-xs text-[#A8B8D8] pl-7">{lesson.summary}</p>
                                {lesson.stream_url && (
                                  <a
                                    href={lesson.stream_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 pl-7 text-xs text-[#00D4FF] hover:underline"
                                  >
                                    Open Video Stream <ExternalLink className="h-3 w-3" />
                                  </a>
                                )}
                              </div>
                              <span className="text-xs text-[#A8B8D8] shrink-0">{lesson.duration_minutes}m</span>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glass-panel rounded-3xl p-8 text-sm text-[#A8B8D8]">Select an enrolled course to view lessons.</div>
                )}
              </div>
            </div>
          )}

          {tab === "live" && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {sessions.length === 0 ? (
                <div className="glass-panel rounded-2xl p-6 text-sm text-[#A8B8D8]">No live classes scheduled yet.</div>
              ) : (
                sessions.map((s) => (
                  <div key={s.id} className="glass-panel rounded-2xl p-6 space-y-3">
                    <div className="flex justify-between text-xs text-[#00D4FF]">
                      <span>{s.course_title}</span>
                      <span>{s.platform}</span>
                    </div>
                    <h3 className="font-heading text-lg font-bold text-white">{s.title}</h3>
                    <p className="text-xs text-[#A8B8D8]">{new Date(s.scheduled_at).toLocaleString()} • {s.duration_minutes} min</p>
                    <a
                      href={s.meeting_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-[#087BFF] px-4 py-2 text-xs font-semibold text-white"
                    >
                      Join Live Session <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "assignments" && (
            <div className="space-y-4">
              {assignments.map((a) => {
                const sub = submissions.find((s) => s.assignment === a.id);
                return (
                  <div key={a.id} className="glass-panel rounded-2xl p-6 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-xs text-[#42A5FF]">{a.course_title}</span>
                      <span className="text-xs text-[#A8B8D8]">Max Score: {a.max_score}</span>
                    </div>
                    <h3 className="font-heading text-lg font-bold text-white">{a.title}</h3>
                    <p className="text-sm text-[#A8B8D8]">{a.instructions}</p>
                    {sub ? (
                      <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-xs text-emerald-200">
                        Status: <strong>{sub.status}</strong> • URL: {sub.submission_url}
                        {sub.score !== null && ` • Score: ${sub.score}/${a.max_score}`}
                        {sub.feedback && <p className="mt-1">Feedback: {sub.feedback}</p>}
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          value={subUrl[a.id] || ""}
                          onChange={(e) => setSubUrl((prev) => ({ ...prev, [a.id]: e.target.value }))}
                          placeholder="Paste GitHub / Colab / Drive URL"
                          className="flex-1 rounded-xl border border-cyan-400/25 bg-[#030B20] px-4 py-2 text-sm text-white"
                        />
                        <button
                          onClick={() => void submitAssignment(a.id)}
                          className="rounded-full bg-[#087BFF] px-5 py-2 text-xs font-semibold text-white"
                        >
                          Submit Lab
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {tab === "quizzes" && (
            <div className="space-y-6">
              {quizResult && (
                <div className="rounded-xl border border-cyan-400/40 bg-[#0A1D40] p-4 text-sm font-semibold text-[#00D4FF]">
                  {quizResult}
                </div>
              )}
              {quizzes.map((q) => (
                <div key={q.id} className="glass-panel rounded-3xl p-7 space-y-5">
                  <div>
                    <span className="text-xs text-[#42A5FF]">{q.course_title} • Passing: {q.passing_score_percent}%</span>
                    <h3 className="font-heading text-xl font-bold text-white">{q.title}</h3>
                  </div>
                  {q.questions.map((question, idx) => (
                    <div key={question.id} className="rounded-2xl bg-[#030B20]/80 p-4 space-y-2.5">
                      <p className="text-sm font-medium text-white">{idx + 1}. {question.prompt}</p>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {question.options.map((opt, optIdx) => {
                          const chosen = quizAnswers[q.id]?.[question.id] === optIdx;
                          return (
                            <button
                              key={opt}
                              onClick={() =>
                                setQuizAnswers((prev) => ({
                                  ...prev,
                                  [q.id]: { ...(prev[q.id] || {}), [question.id]: optIdx },
                                }))
                              }
                              className={`text-left rounded-xl border px-3.5 py-2 text-xs transition ${
                                chosen ? "border-[#00D4FF] bg-[#087BFF]/25 text-white" : "border-white/10 text-[#A8B8D8]"
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => void submitQuiz(q.id)}
                    className="rounded-full bg-gradient-to-r from-[#087BFF] to-[#00D4FF] px-6 py-2.5 text-xs font-semibold text-white"
                  >
                    Submit Quiz
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab === "certificates" && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {certificates.map((c) => (
                <div key={c.id} className="glass-panel rounded-2xl p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#00D4FF]">
                    <span>{c.certificate_id}</span>
                    <span>{c.issued_date}</span>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-white">{c.course_title}</h3>
                  <p className="text-xs text-[#A8B8D8]">Issued to {c.recipient_name} • {c.grade_or_remarks}</p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={() => void downloadCertificate(c.id, c.certificate_id)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#087BFF] px-4 py-2 text-xs font-semibold text-white"
                    >
                      <Download className="h-3.5 w-3.5" /> Download PDF
                    </button>
                    <Link
                      href={`/verify/${c.certificate_id}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/35 px-4 py-2 text-xs font-semibold text-white"
                    >
                      Verify QR Page <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "payments" && (
            <div className="glass-panel rounded-2xl overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/10 text-[#A8B8D8]">
                  <tr>
                    <th className="p-4">Order Ref</th>
                    <th className="p-4">Course</th>
                    <th className="p-4">Provider</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {payments.map((p) => (
                    <tr key={p.id}>
                      <td className="p-4 font-mono text-white">{p.order_reference}</td>
                      <td className="p-4 text-white">{p.course_title}</td>
                      <td className="p-4 uppercase text-[#A8B8D8]">{p.provider}</td>
                      <td className="p-4 text-white">{formatPrice(p.final_amount, p.currency)}</td>
                      <td className="p-4 font-semibold text-[#00D4FF]">{p.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "notifications" && (
            <div className="space-y-3">
              {notifications.map((n) => (
                <div key={n.id} className="glass-panel rounded-2xl p-5 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-heading font-semibold text-white">{n.title}</h4>
                    <p className="text-xs text-[#A8B8D8] mt-1">{n.message}</p>
                  </div>
                  {!n.is_read && (
                    <button
                      onClick={async () => {
                        await apiFetch(`/notifications/${n.id}/mark_read/`, { method: "POST", auth: true });
                        await loadAll();
                      }}
                      className="rounded-full border border-cyan-400/30 px-3 py-1 text-xs text-[#00D4FF]"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === "support" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <form onSubmit={(e) => void createTicket(e)} className="glass-panel rounded-2xl p-6 space-y-4">
                <h3 className="font-heading text-lg font-bold text-white">Open Support Request</h3>
                <input
                  required
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm((f) => ({ ...f, subject: e.target.value }))}
                  placeholder="Subject"
                  className="w-full rounded-xl border border-cyan-400/20 bg-[#030B20] px-4 py-2.5 text-sm text-white"
                />
                <textarea
                  required
                  rows={4}
                  value={ticketForm.message}
                  onChange={(e) => setTicketForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="Describe your question or issue..."
                  className="w-full rounded-xl border border-cyan-400/20 bg-[#030B20] px-4 py-2.5 text-sm text-white"
                />
                <button className="rounded-full bg-[#087BFF] px-5 py-2.5 text-xs font-semibold text-white">
                  Submit Request
                </button>
              </form>
              <div className="space-y-3">
                {tickets.map((t) => (
                  <div key={t.id} className="glass-panel rounded-2xl p-5 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-white">{t.subject}</span>
                      <span className="text-[#00D4FF]">{t.status}</span>
                    </div>
                    <p className="text-xs text-[#A8B8D8]">{t.message}</p>
                    {t.admin_reply && (
                      <div className="rounded-xl bg-[#030B20] p-3 text-xs text-emerald-300">
                        Reply: {t.admin_reply}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "profile" && (
            <form onSubmit={(e) => void saveProfile(e)} className="glass-panel max-w-lg rounded-2xl p-6 space-y-4">
              <h3 className="font-heading text-lg font-bold text-white">Account Profile</h3>
              <input
                value={profileForm.full_name}
                onChange={(e) => setProfileForm((f) => ({ ...f, full_name: e.target.value }))}
                placeholder="Full Name"
                className="w-full rounded-xl border border-cyan-400/20 bg-[#030B20] px-4 py-2.5 text-sm text-white"
              />
              <input
                value={profileForm.phone}
                onChange={(e) => setProfileForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="Phone"
                className="w-full rounded-xl border border-cyan-400/20 bg-[#030B20] px-4 py-2.5 text-sm text-white"
              />
              <input
                value={profileForm.city}
                onChange={(e) => setProfileForm((f) => ({ ...f, city: e.target.value }))}
                placeholder="City"
                className="w-full rounded-xl border border-cyan-400/20 bg-[#030B20] px-4 py-2.5 text-sm text-white"
              />
              <button className="rounded-full bg-[#087BFF] px-5 py-2.5 text-xs font-semibold text-white">
                Save Profile
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}


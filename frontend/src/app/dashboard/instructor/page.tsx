"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Video, FileText, Users, CheckSquare } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { apiFetch, type PaginatedResponse } from "@/lib/api";
import type {
  AssignmentItem,
  AssignmentSubmissionItem,
  CourseItem,
  EnrollmentItem,
  LiveSessionItem,
} from "@/lib/types";

interface BatchItem {
  id: number;
  course: number;
  course_title: string;
  name: string;
  code: string;
  schedule_summary: string;
}

export default function InstructorDashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [sessions, setSessions] = useState<LiveSessionItem[]>([]);
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmissionItem[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentItem[]>([]);
  const [banner, setBanner] = useState<string | null>(null);

  const [sessionForm, setSessionForm] = useState({
    batch: "",
    title: "",
    platform: "GOOGLE_MEET",
    meeting_url: "https://meet.google.com/",
    scheduled_at: "",
    duration_minutes: 90,
  });

  const [assignForm, setAssignForm] = useState({
    course: "",
    title: "",
    instructions: "",
    max_score: 100,
  });

  const loadData = useCallback(async () => {
    const [c, b, s, a, sub, e] = await Promise.all([
      apiFetch<PaginatedResponse<CourseItem>>("/courses/", { auth: true }).catch(() => ({ results: [] })),
      apiFetch<PaginatedResponse<BatchItem>>("/batches/", { auth: true }).catch(() => ({ results: [] })),
      apiFetch<PaginatedResponse<LiveSessionItem>>("/live-sessions/", { auth: true }).catch(() => ({ results: [] })),
      apiFetch<PaginatedResponse<AssignmentItem>>("/assignments/", { auth: true }).catch(() => ({ results: [] })),
      apiFetch<PaginatedResponse<AssignmentSubmissionItem>>("/submissions/", { auth: true }).catch(() => ({ results: [] })),
      apiFetch<PaginatedResponse<EnrollmentItem>>("/enrollments/", { auth: true }).catch(() => ({ results: [] })),
    ]);
    setCourses(c.results || []);
    setBatches(b.results || []);
    setSessions(s.results || []);
    setAssignments(a.results || []);
    setSubmissions(sub.results || []);
    setEnrollments(e.results || []);
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
        return;
      }
      if (user.role !== "INSTRUCTOR" && user.role !== "ADMIN") {
        router.push("/dashboard/student");
        return;
      }
      void loadData();
    }
  }, [loading, user, router, loadData]);

  const scheduleSession = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch("/live-sessions/", {
      method: "POST",
      auth: true,
      body: JSON.stringify({ ...sessionForm, batch: Number(sessionForm.batch) }),
    });
    setBanner("Live session scheduled.");
    setSessionForm((p) => ({ ...p, title: "" }));
    await loadData();
  };

  const createAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch("/assignments/", {
      method: "POST",
      auth: true,
      body: JSON.stringify({ ...assignForm, course: Number(assignForm.course) }),
    });
    setBanner("Assignment published to enrolled students.");
    setAssignForm((p) => ({ ...p, title: "", instructions: "" }));
    await loadData();
  };

  const gradeSubmission = async (id: number) => {
    await apiFetch(`/submissions/${id}/review/`, {
      method: "POST",
      auth: true,
      body: JSON.stringify({ status: "REVIEWED", score: 92, feedback: "Reviewed by instructor." }),
    });
    setBanner("Submission reviewed.");
    await loadData();
  };

  if (loading || !user) {
    return <div className="pt-32 min-h-screen bg-[#030B20] text-center text-[#A8B8D8]">Loading Instructor Console...</div>;
  }

  return (
    <div className="pt-28 pb-20 bg-[#030B20] cyber-grid-bg min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00D4FF]">INSTRUCTOR WORKSPACE</span>
          <h1 className="mt-1 font-heading text-3xl font-bold text-white">Welcome, {user.full_name}</h1>
        </div>

        {banner && (
          <div className="rounded-xl border border-cyan-400/35 bg-[#0A1D40] px-4 py-3 text-xs text-[#00D4FF]">
            {banner}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="glass-panel rounded-2xl p-5">
            <Video className="h-5 w-5 text-[#00D4FF]" />
            <div className="mt-3 font-heading text-2xl font-bold text-white">{batches.length}</div>
            <div className="text-xs text-[#A8B8D8]">Assigned Batches</div>
          </div>
          <div className="glass-panel rounded-2xl p-5">
            <Users className="h-5 w-5 text-[#42A5FF]" />
            <div className="mt-3 font-heading text-2xl font-bold text-white">{enrollments.length}</div>
            <div className="text-xs text-[#A8B8D8]">Enrolled Students</div>
          </div>
          <div className="glass-panel rounded-2xl p-5">
            <FileText className="h-5 w-5 text-[#00D4FF]" />
            <div className="mt-3 font-heading text-2xl font-bold text-white">{assignments.length}</div>
            <div className="text-xs text-[#A8B8D8]">Assignments</div>
          </div>
          <div className="glass-panel rounded-2xl p-5">
            <CheckSquare className="h-5 w-5 text-emerald-400" />
            <div className="mt-3 font-heading text-2xl font-bold text-white">{submissions.length}</div>
            <div className="text-xs text-[#A8B8D8]">Student Submissions</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <form onSubmit={(e) => void scheduleSession(e)} className="glass-panel rounded-2xl p-6 space-y-4">
            <h2 className="font-heading text-lg font-bold text-white">Schedule Live Class</h2>
            <select
              required
              value={sessionForm.batch}
              onChange={(e) => setSessionForm((f) => ({ ...f, batch: e.target.value }))}
              className="w-full rounded-xl border border-cyan-400/20 bg-[#030B20] px-4 py-2.5 text-sm text-white"
            >
              <option value="">Select Batch</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>{b.name} ({b.course_title})</option>
              ))}
            </select>
            <input
              required
              value={sessionForm.title}
              onChange={(e) => setSessionForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Session Topic"
              className="w-full rounded-xl border border-cyan-400/20 bg-[#030B20] px-4 py-2.5 text-sm text-white"
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                value={sessionForm.platform}
                onChange={(e) => setSessionForm((f) => ({ ...f, platform: e.target.value }))}
                className="rounded-xl border border-cyan-400/20 bg-[#030B20] px-3 py-2.5 text-sm text-white"
              >
                <option value="GOOGLE_MEET">Google Meet</option>
                <option value="ZOOM">Zoom</option>
              </select>
              <input
                required
                type="datetime-local"
                value={sessionForm.scheduled_at}
                onChange={(e) => setSessionForm((f) => ({ ...f, scheduled_at: e.target.value }))}
                className="rounded-xl border border-cyan-400/20 bg-[#030B20] px-3 py-2.5 text-sm text-white"
              />
            </div>
            <input
              required
              type="url"
              value={sessionForm.meeting_url}
              onChange={(e) => setSessionForm((f) => ({ ...f, meeting_url: e.target.value }))}
              placeholder="Meeting Join URL"
              className="w-full rounded-xl border border-cyan-400/20 bg-[#030B20] px-4 py-2.5 text-sm text-white"
            />
            <button className="rounded-full bg-[#087BFF] px-5 py-2.5 text-xs font-semibold text-white">
              Publish Live Session
            </button>
          </form>

          <form onSubmit={(e) => void createAssignment(e)} className="glass-panel rounded-2xl p-6 space-y-4">
            <h2 className="font-heading text-lg font-bold text-white">Create Assignment</h2>
            <select
              required
              value={assignForm.course}
              onChange={(e) => setAssignForm((f) => ({ ...f, course: e.target.value }))}
              className="w-full rounded-xl border border-cyan-400/20 bg-[#030B20] px-4 py-2.5 text-sm text-white"
            >
              <option value="">Select Course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
            <input
              required
              value={assignForm.title}
              onChange={(e) => setAssignForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Assignment Title"
              className="w-full rounded-xl border border-cyan-400/20 bg-[#030B20] px-4 py-2.5 text-sm text-white"
            />
            <textarea
              required
              rows={3}
              value={assignForm.instructions}
              onChange={(e) => setAssignForm((f) => ({ ...f, instructions: e.target.value }))}
              placeholder="Instructions & evaluation criteria"
              className="w-full rounded-xl border border-cyan-400/20 bg-[#030B20] px-4 py-2.5 text-sm text-white"
            />
            <button className="rounded-full bg-[#087BFF] px-5 py-2.5 text-xs font-semibold text-white">
              Create Assignment
            </button>
          </form>
        </div>

        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <h2 className="font-heading text-lg font-bold text-white">Student Submissions & Upcoming Sessions ({sessions.length})</h2>
          {submissions.length === 0 ? (
            <p className="text-xs text-[#A8B8D8]">No submissions to review yet.</p>
          ) : (
            <div className="space-y-3">
              {submissions.map((s) => (
                <div key={s.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-[#030B20]/80 p-4 text-xs">
                  <div>
                    <div className="font-semibold text-white">{s.student_name} — {s.assignment_title}</div>
                    <div className="text-[#42A5FF]">{s.submission_url}</div>
                  </div>
                  {s.status === "SUBMITTED" ? (
                    <button
                      onClick={() => void gradeSubmission(s.id)}
                      className="rounded-full bg-emerald-500/20 border border-emerald-400/40 px-4 py-1.5 font-semibold text-emerald-300"
                    >
                      Approve & Grade
                    </button>
                  ) : (
                    <span className="text-emerald-300">{s.status} ({s.score}/100)</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


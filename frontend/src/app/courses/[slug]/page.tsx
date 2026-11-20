import React from "react";
import Link from "next/link";
import { getStaticCourseBySlug } from "@/lib/coursesData";
import { apiFetch } from "@/lib/api";
import type { CourseItem } from "@/lib/types";
import CourseDetailClient from "./CourseDetailClient";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let course: CourseItem | null = getStaticCourseBySlug(slug) || null;

  // Attempt live API fetch with fallback
  try {
    const liveCourse = await apiFetch<CourseItem>(`/courses/${slug}/`);
    if (liveCourse && liveCourse.id) {
      course = liveCourse;
    }
  } catch {
    // Graceful fallback to static data
  }

  if (!course) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-[#030B20] text-center px-4">
        <h1 className="font-heading text-3xl font-bold text-white">Course Not Found</h1>
        <p className="mt-2 text-sm text-[#A8B8D8]">The requested course syllabus could not be found.</p>
        <Link
          href="/courses"
          className="mt-6 inline-block rounded-full bg-[#087BFF] px-6 py-3 text-sm font-semibold text-white"
        >
          Back to Courses
        </Link>
      </div>
    );
  }

  return <CourseDetailClient initialCourse={course} slug={slug} />;
}

import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { IntroStatsSection } from "@/components/home/IntroStatsSection";
import { CoursesSection } from "@/components/home/CoursesSection";
import { WhySeekhvoSection } from "@/components/home/WhySeekhvoSection";
import { LearningJourneySection } from "@/components/home/LearningJourneySection";
import { TechnologiesSection } from "@/components/home/TechnologiesSection";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { TrainersAndTestimonialsSection } from "@/components/home/TrainersAndTestimonialsSection";
import { PricingAndCtaSection } from "@/components/home/PricingAndCtaSection";
import { apiFetch, type PaginatedResponse } from "@/lib/api";
import type {
  CourseItem,
  PlatformStats,
  ProjectShowcaseItem,
  TechnologyItem,
  TestimonialItem,
  TrainerProfileItem,
} from "@/lib/types";

export const dynamic = "force-dynamic";

async function loadHomeData() {
  try {
    const [coursesRes, techRes, projectsRes, trainersRes, testimonialsRes, stats] = await Promise.all([
      apiFetch<PaginatedResponse<CourseItem>>("/courses/").catch(() => ({ results: [] })),
      apiFetch<PaginatedResponse<TechnologyItem>>("/technologies/").catch(() => ({ results: [] })),
      apiFetch<PaginatedResponse<ProjectShowcaseItem>>("/projects/").catch(() => ({ results: [] })),
      apiFetch<PaginatedResponse<TrainerProfileItem>>("/trainers/").catch(() => ({ results: [] })),
      apiFetch<PaginatedResponse<TestimonialItem>>("/testimonials/").catch(() => ({ results: [] })),
      apiFetch<PlatformStats>("/stats/").catch(() => null),
    ]);
    return {
      courses: coursesRes.results || [],
      technologies: techRes.results || [],
      projects: projectsRes.results || [],
      trainers: trainersRes.results || [],
      testimonials: testimonialsRes.results || [],
      stats,
    };
  } catch {
    return {
      courses: [],
      technologies: [],
      projects: [],
      trainers: [],
      testimonials: [],
      stats: null,
    };
  }
}

export default async function HomePage() {
  const { courses, technologies, projects, trainers, testimonials, stats } = await loadHomeData();

  return (
    <>
      <HeroSection />
      <IntroStatsSection stats={stats} />
      <CoursesSection courses={courses} />
      <WhySeekhvoSection />
      <LearningJourneySection />
      <TechnologiesSection technologies={technologies} />
      <ProjectsSection projects={projects} />
      <TrainersAndTestimonialsSection trainers={trainers} testimonials={testimonials} />
      <PricingAndCtaSection courses={courses} />
    </>
  );
}


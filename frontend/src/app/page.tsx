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
import { STATIC_COURSES } from "@/lib/coursesData";
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

    const activeCourses = (coursesRes.results && coursesRes.results.length > 0)
      ? coursesRes.results
      : STATIC_COURSES;

    return {
      courses: activeCourses,
      technologies: techRes.results || [],
      projects: projectsRes.results || [],
      trainers: trainersRes.results || [],
      testimonials: testimonialsRes.results || [],
      stats,
    };
  } catch {
    return {
      courses: STATIC_COURSES,
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

  // Structured Data for Course Catalog
  const courseListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Featured AI Courses & Programs at Seekhvo",
    "itemListElement": courses.map((c, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "Course",
        "name": c.title,
        "description": c.short_description,
        "url": `https://seekhvo.space/courses/${c.slug}`,
        "provider": {
          "@type": "EducationalOrganization",
          "name": "Seekhvo AI Learning",
          "sameAs": "https://seekhvo.space"
        },
        "educationalLevel": c.level ? c.level.replace("_", " ") : "All Levels",
        "hasCourseInstance": {
          "@type": "CourseInstance",
          "courseMode": c.delivery_mode === "HYBRID" ? "blended" : (c.delivery_mode || "online").toLowerCase(),
          "courseWorkload": `${c.duration_weeks} Weeks`
        },
        "offers": {
          "@type": "Offer",
          "price": c.discount_price || c.price,
          "priceCurrency": c.currency || "INR",
          "availability": "https://schema.org/InStock"
        }
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseListSchema) }}
      />
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

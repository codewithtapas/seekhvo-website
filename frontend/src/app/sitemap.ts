import type { MetadataRoute } from "next";
import { getApiBase, type PaginatedResponse } from "@/lib/api";
import type { CourseItem } from "@/lib/types";
import { STATIC_COURSES } from "@/lib/coursesData";

// Fallback published courses verified from the project database
const FALLBACK_COURSE_SLUGS = [
  "ai-engineer-program",
  "generative-ai",
  "machine-learning",
  "python-programming",
  "data-science",
  "agentic-ai",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://seekhvo.space";
  const now = new Date();

  // All relevant public routes (excluding private auth & dashboard routes)
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/book-demo`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/trainers`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/refund-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Dynamically load active courses from backend if available, fallback to verified project data
  let courseSlugs = STATIC_COURSES.map((c) => c.slug);
  try {
    const res = await fetch(`${getApiBase()}/courses/`, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const data: PaginatedResponse<CourseItem> = await res.json();
      if (Array.isArray(data.results) && data.results.length > 0) {
        courseSlugs = data.results.map((c: CourseItem) => c.slug);
      }
    }
  } catch {
    // Graceful fallback to verified project data
  }

  const courseRoutes: MetadataRoute.Sitemap = courseSlugs.map((slug) => ({
    url: `${baseUrl}/courses/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...courseRoutes];
}

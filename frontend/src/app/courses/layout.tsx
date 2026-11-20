import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Engineering, Machine Learning & Generative AI Courses",
  description:
    "Explore industry-leading Artificial Intelligence courses at Seekhvo AI Learning. Flagship training tracks in AI Engineering, Generative AI, Machine Learning, Python, and Agentic AI with live mentor support and real capstones.",
  alternates: {
    canonical: "https://seekhvo.space/courses",
  },
  openGraph: {
    title: "AI Engineering & Machine Learning Courses | Seekhvo AI Learning",
    description:
      "Explore comprehensive Artificial Intelligence training tracks designed for software engineers, students, and professionals in India.",
    url: "https://seekhvo.space/courses",
    images: [{ url: "https://seekhvo.space/images/seekhvo-logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Engineering & Machine Learning Courses | Seekhvo AI Learning",
    description: "Industry-aligned Artificial Intelligence training programs with live hands-on cohorts.",
    images: ["https://seekhvo.space/images/seekhvo-logo.png"],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://seekhvo.space"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Courses",
      "item": "https://seekhvo.space/courses"
    }
  ]
};

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}

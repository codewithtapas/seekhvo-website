import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Courses in Odisha | Seekhvo AI Learning",
  description:
    "Comprehensive Artificial Intelligence, Generative AI, and Machine Learning courses in Odisha. Live instructor-led cohorts, practical capstone projects, and QR-verified certification.",
  alternates: {
    canonical: "https://seekhvo.space/ai-courses-odisha",
  },
  openGraph: {
    title: "AI Courses in Odisha | Seekhvo AI Learning",
    description:
      "Industry-aligned Artificial Intelligence training programs for engineering students and technology professionals across Odisha. Flexible evening & weekend cohorts.",
    url: "https://seekhvo.space/ai-courses-odisha",
    images: [{ url: "https://seekhvo.space/images/seekhvo-logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Courses in Odisha | Seekhvo AI Learning",
    description:
      "Master AI Engineering, Generative AI, and Machine Learning with live interactive cohorts in Odisha.",
    images: ["https://seekhvo.space/images/seekhvo-logo.png"],
  },
};

const regionalSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": "https://seekhvo.space/ai-courses-odisha#organization",
  name: "Seekhvo AI Learning — Odisha AI Programs",
  url: "https://seekhvo.space/ai-courses-odisha",
  logo: "https://seekhvo.space/images/seekhvo-logo.png",
  description:
    "Premier Artificial Intelligence and Machine Learning education platform delivering live cohort training to students and professionals across Odisha.",
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Odisha",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-8280765204",
    contactType: "admissions & academic counseling",
    areaServed: "IN-OR",
    availableLanguage: ["English", "Odia", "Hindi"],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://seekhvo.space",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "AI Courses in Odisha",
      item: "https://seekhvo.space/ai-courses-odisha",
    },
  ],
};

export default function AiCoursesOdishaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(regionalSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}

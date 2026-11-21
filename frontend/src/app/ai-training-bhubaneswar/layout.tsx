import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Training in Bhubaneswar | Seekhvo AI Learning",
  description:
    "Advanced Artificial Intelligence and Machine Learning training in Bhubaneswar. Live cohort-based instruction in Generative AI, PyTorch, MLOps, and Agentic AI for tech professionals and engineering graduates.",
  alternates: {
    canonical: "https://seekhvo.space/ai-training-bhubaneswar",
  },
  openGraph: {
    title: "AI Training in Bhubaneswar | Seekhvo AI Learning",
    description:
      "Master Generative AI, PyTorch, and Agentic workflows with live mentorship in Bhubaneswar. Build real production capstones.",
    url: "https://seekhvo.space/ai-training-bhubaneswar",
    images: [{ url: "https://seekhvo.space/images/seekhvo-logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Training in Bhubaneswar | Seekhvo AI Learning",
    description:
      "Practical AI Engineering and Generative AI cohorts tailored for Bhubaneswar software engineers and graduates.",
    images: ["https://seekhvo.space/images/seekhvo-logo.png"],
  },
};

const bhubaneswarSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": "https://seekhvo.space/ai-training-bhubaneswar#organization",
  name: "Seekhvo AI Learning — Bhubaneswar Programs",
  url: "https://seekhvo.space/ai-training-bhubaneswar",
  logo: "https://seekhvo.space/images/seekhvo-logo.png",
  description:
    "Advanced Artificial Intelligence education platform providing hands-on Generative AI and Machine Learning live cohorts to Bhubaneswar's technology workforce and graduates.",
  areaServed: {
    "@type": "City",
    name: "Bhubaneswar",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-8280765204",
    contactType: "academic counseling",
    areaServed: "IN",
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
      name: "AI Training in Bhubaneswar",
      item: "https://seekhvo.space/ai-training-bhubaneswar",
    },
  ],
};

export default function AiTrainingBhubaneswarLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bhubaneswarSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}

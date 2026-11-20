import type { Metadata } from "next";
import { getStaticCourseBySlug } from "@/lib/coursesData";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const course = getStaticCourseBySlug(resolvedParams.slug);

  if (!course) {
    return {
      title: "Course Details | Seekhvo AI Learning",
      description: "Explore advanced Artificial Intelligence and Machine Learning courses at Seekhvo AI Learning.",
      alternates: {
        canonical: `https://seekhvo.space/courses/${resolvedParams.slug}`,
      },
    };
  }

  const title = `${course.title} Course | Seekhvo AI Learning`;
  const description = `${course.short_description} Join our live cohort at Seekhvo AI Learning for comprehensive hands-on training.`;
  const canonicalUrl = `https://seekhvo.space/courses/${course.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: "https://seekhvo.space/images/seekhvo-logo.png",
          width: 1200,
          height: 630,
          alt: course.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://seekhvo.space/images/seekhvo-logo.png"],
    },
  };
}

export default async function CourseDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const course = getStaticCourseBySlug(resolvedParams.slug);

  const courseSchema = course
    ? {
        "@context": "https://schema.org",
        "@type": "Course",
        "@id": `https://seekhvo.space/courses/${course.slug}#course`,
        name: course.title,
        description: course.short_description,
        url: `https://seekhvo.space/courses/${course.slug}`,
        courseCode: course.slug,
        educationalLevel: course.level.replace("_", " "),
        inLanguage: "en",
        provider: {
          "@type": "EducationalOrganization",
          name: "Seekhvo AI Learning",
          sameAs: "https://seekhvo.space",
          url: "https://seekhvo.space",
        },
        offers: {
          "@type": "Offer",
          price: course.discount_price || course.price,
          priceCurrency: course.currency || "INR",
          availability: "https://schema.org/InStock",
          url: `https://seekhvo.space/courses/${course.slug}`,
          category: "Paid",
        },
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: course.delivery_mode === "HYBRID" ? "blended" : course.delivery_mode.toLowerCase(),
          courseWorkload: `${course.duration_weeks} Weeks`,
        },
        teaches: course.outcomes || [],
        about: course.tools_covered || [],
      }
    : null;

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
        name: "Courses",
        item: "https://seekhvo.space/courses",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: course ? course.title : resolvedParams.slug,
        item: `https://seekhvo.space/courses/${resolvedParams.slug}`,
      },
    ],
  };

  return (
    <>
      {courseSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}

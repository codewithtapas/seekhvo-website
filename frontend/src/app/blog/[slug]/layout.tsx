import type { Metadata } from "next";
import { getBlogPostBySlug } from "@/lib/blogData";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found | Seekhvo AI Learning",
      description: "The requested technical article could not be found.",
      alternates: {
        canonical: `https://seekhvo.space/blog/${slug}`,
      },
    };
  }

  const canonicalUrl = `https://seekhvo.space/blog/${post.slug}`;

  return {
    title: post.seoTitle,
    description: post.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: canonicalUrl,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      tags: post.tags,
      images: [
        {
          url: "https://seekhvo.space/images/seekhvo-logo.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: ["https://seekhvo.space/images/seekhvo-logo.png"],
    },
  };
}

export default async function BlogPostLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  const articleSchema = post
    ? {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "@id": `https://seekhvo.space/blog/${post.slug}#article`,
        headline: post.title,
        description: post.description,
        image: "https://seekhvo.space/images/seekhvo-logo.png",
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        author: {
          "@type": "Person",
          name: post.author.name,
          jobTitle: post.author.role,
          url: post.author.url,
        },
        publisher: {
          "@type": "EducationalOrganization",
          name: "Seekhvo AI Learning",
          url: "https://seekhvo.space",
          logo: {
            "@type": "ImageObject",
            url: "https://seekhvo.space/images/seekhvo-logo.png",
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://seekhvo.space/blog/${post.slug}`,
        },
        about: post.tags,
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
        name: "Blog",
        item: "https://seekhvo.space/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post ? post.title : slug,
        item: `https://seekhvo.space/blog/${slug}`,
      },
    ],
  };

  return (
    <>
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
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

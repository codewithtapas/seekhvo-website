import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { BookOpen, Clock, Calendar, ArrowRight, UserCheck, Sparkles } from "lucide-react";
import { BLOG_POSTS } from "@/lib/blogData";

export const metadata: Metadata = {
  title: "AI Engineering & Machine Learning Blog | Seekhvo AI Learning",
  description:
    "Practical engineering guides, roadmaps, and architectural tutorials on Artificial Intelligence, Generative AI, PyTorch, and Machine Learning from Seekhvo AI Learning instructors.",
  alternates: {
    canonical: "https://seekhvo.space/blog",
  },
  openGraph: {
    title: "AI Engineering & Machine Learning Blog | Seekhvo AI Learning",
    description:
      "Original technical guides, roadmaps, and tutorials on AI Engineering, LLMs, and Machine Learning.",
    url: "https://seekhvo.space/blog",
    images: [{ url: "https://seekhvo.space/images/seekhvo-logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Engineering Blog | Seekhvo AI Learning",
    description: "In-depth technical guides and career roadmaps for ambitious AI Engineers.",
    images: ["https://seekhvo.space/images/seekhvo-logo.png"],
  },
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://seekhvo.space/blog#webpage",
  url: "https://seekhvo.space/blog",
  name: "Seekhvo AI Engineering Blog",
  description: "Technical articles and roadmaps covering Artificial Intelligence, Generative AI, and Machine Learning.",
  publisher: {
    "@type": "EducationalOrganization",
    name: "Seekhvo AI Learning",
    url: "https://seekhvo.space",
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
      name: "Blog",
      item: "https://seekhvo.space/blog",
    },
  ],
};

export default function BlogIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="pt-32 pb-24 bg-[#030B20] cyber-grid-bg min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-[#071A3D] px-3.5 py-1 text-xs font-semibold text-[#00D4FF]">
              <Sparkles className="h-4 w-4" /> SEEKHVO ENGINEERING INSIGHTS
            </div>
            <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              AI Engineering & <span className="neon-text-gradient">Technical Guides</span>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-[#A8B8D8] sm:text-lg">
              Explore in-depth architectural roadmaps, code tutorials, and career blueprints written by practicing AI engineers and Seekhvo instructors. Zero shallow prompts, 100% production engineering.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {BLOG_POSTS.map((post) => (
              <article
                key={post.slug}
                className="glass-panel flex flex-col justify-between rounded-3xl p-7 border border-cyan-400/15 hover:border-cyan-400/40 transition group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="rounded-full border border-cyan-400/30 bg-[#071A3D] px-2.5 py-0.5 font-semibold text-[#00D4FF]">
                      {post.category}
                    </span>
                    <span className="text-[#A8B8D8] flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-[#00D4FF]" /> {post.readTime}
                    </span>
                  </div>

                  <h2 className="mt-4 font-heading text-2xl font-bold text-white group-hover:text-[#00D4FF] transition">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>

                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#A8B8D8]">
                    {post.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-[#0A1D40] px-2 py-0.5 text-[10px] font-medium text-[#A8B8D8] border border-white/5"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 border-t border-white/10 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[#A8B8D8]">
                    <UserCheck className="h-3.5 w-3.5 text-[#00D4FF]" />
                    <span>{post.author.name}</span>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00D4FF] hover:underline"
                  >
                    Read Guide <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

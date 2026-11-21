import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock,
  Calendar,
  ArrowLeft,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  Sparkles,
  BookOpen,
  MessageCircle,
  Share2,
} from "lucide-react";
import { getBlogPostBySlug, BLOG_POSTS } from "@/lib/blogData";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-[#030B20] text-center px-4">
        <h1 className="font-heading text-3xl font-bold text-white">Article Not Found</h1>
        <p className="mt-2 text-sm text-[#A8B8D8]">The requested technical guide does not exist.</p>
        <Link
          href="/blog"
          className="mt-6 inline-block rounded-full bg-[#087BFF] px-6 py-3 text-sm font-semibold text-white"
        >
          Back to Blog
        </Link>
      </div>
    );
  }

  const otherPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug);

  return (
    <article className="pt-32 pb-24 bg-[#030B20] cyber-grid-bg min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#42A5FF] hover:text-[#00D4FF] transition"
        >
          <ArrowLeft className="h-4 w-4" /> All Technical Articles
        </Link>

        {/* Article Meta Bar */}
        <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
          <span className="rounded-full border border-cyan-400/30 bg-[#071A3D] px-3 py-1 font-semibold text-[#00D4FF]">
            {post.category}
          </span>
          <span className="text-[#A8B8D8] flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-[#00D4FF]" /> {post.readTime}
          </span>
          <span className="text-[#A8B8D8] flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-[#00D4FF]" /> {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>

        {/* Headline */}
        <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
          {post.title}
        </h1>

        {/* Author Bio Header */}
        <div className="mt-6 flex items-center gap-3 border-y border-white/10 py-4">
          <div className="h-10 w-10 rounded-full bg-[#071A3D] border border-cyan-400/30 flex items-center justify-center text-[#00D4FF]">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{post.author.name}</div>
            <div className="text-xs text-[#A8B8D8]">{post.author.role}</div>
          </div>
        </div>

        {/* Lead Summary */}
        <div className="mt-8 rounded-2xl border border-cyan-400/20 bg-[#071A3D]/40 p-6 text-sm sm:text-base leading-relaxed text-[#D2E2FF] italic">
          {post.content.lead}
        </div>

        {/* Article Sections */}
        <div className="mt-10 space-y-10">
          {post.content.sections.map((section, idx) => (
            <section key={idx} className="space-y-4">
              <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
                {section.heading}
              </h2>
              {section.subheading && (
                <h3 className="font-heading text-lg font-semibold text-[#42A5FF]">
                  {section.subheading}
                </h3>
              )}

              {section.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className="text-sm sm:text-base leading-relaxed text-[#A8B8D8]">
                  {p}
                </p>
              ))}

              {section.bulletPoints && (
                <ul className="mt-4 space-y-2.5 rounded-2xl border border-white/5 bg-[#030B20]/60 p-5">
                  {section.bulletPoints.map((bp, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#A8B8D8]">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#00D4FF]" />
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>
              )}

              {section.codeSnippet && (
                <div className="mt-4 overflow-hidden rounded-2xl border border-cyan-400/25 bg-[#010614]">
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-xs text-[#A8B8D8]">
                    <span>{section.codeSnippet.caption || "Python Example"}</span>
                    <span className="font-mono uppercase text-[#00D4FF]">{section.codeSnippet.language}</span>
                  </div>
                  <pre className="overflow-x-auto p-4 font-mono text-xs sm:text-sm text-cyan-200">
                    <code>{section.codeSnippet.code}</code>
                  </pre>
                </div>
              )}

              {section.callout && (
                <div className="rounded-2xl border-l-4 border-l-[#00D4FF] border border-cyan-400/20 bg-[#071A3D]/70 p-5 space-y-1.5">
                  <div className="font-heading text-sm font-bold text-white">{section.callout.title}</div>
                  <p className="text-xs sm:text-sm text-[#A8B8D8] leading-relaxed">{section.callout.text}</p>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Key Takeaways */}
        <div className="mt-14 glass-panel rounded-3xl p-8 border border-cyan-400/20">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#00D4FF]">
            <Sparkles className="h-4 w-4" /> KEY ARCHITECTURAL TAKEAWAYS
          </div>
          <ul className="mt-4 space-y-3">
            {post.content.takeaways.map((takeaway, tIdx) => (
              <li key={tIdx} className="flex items-start gap-2.5 text-sm text-white">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#00D4FF]" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contextual Course Alignment Card */}
        <div className="mt-12 rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-[#071A3D] to-[#0A265C] p-8 shadow-neon">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#00D4FF]">
                RECOMMENDED LIVE COHORT
              </span>
              <h3 className="mt-1 font-heading text-2xl font-bold text-white">
                {post.targetCourse.title}
              </h3>
              <p className="mt-1 text-xs text-[#A8B8D8]">
                Master the concepts in this article through hands-on mentorship, code reviews, and production capstone labs.
              </p>
            </div>
            <div className="flex flex-col sm:items-end gap-2 shrink-0">
              <div className="font-heading text-xl font-bold text-white">
                {post.targetCourse.price}
              </div>
              <Link
                href={`/courses/${post.targetCourse.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#087BFF] to-[#00D4FF] px-6 py-2.5 text-xs font-semibold text-white shadow-neon hover:brightness-110 transition"
              >
                View Syllabus & Enroll <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Free Demo CTA */}
        <div className="mt-12 glass-panel rounded-3xl p-6 text-center space-y-3">
          <h4 className="font-heading text-lg font-bold text-white">Experience Our Teaching Methodology</h4>
          <p className="text-xs text-[#A8B8D8] max-w-md mx-auto">
            Book a free live demo session to walk through code examples with an instructor before enrolling.
          </p>
          <div className="flex justify-center gap-3 pt-1">
            <Link
              href="/book-demo"
              className="rounded-full border border-cyan-400/35 px-5 py-2 text-xs font-semibold text-white hover:border-[#00D4FF] transition"
            >
              Book Free Demo
            </Link>
            <a
              href={`https://wa.me/918280765204?text=${encodeURIComponent(
                `Hello Seekhvo Team, I read your article "${post.title}" and would like to learn more about the ${post.targetCourse.title} course.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-5 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition"
            >
              <MessageCircle className="h-3.5 w-3.5" /> Enquire on WhatsApp
            </a>
          </div>
        </div>

        {/* Related Articles */}
        {otherPosts.length > 0 && (
          <div className="mt-16 border-t border-white/10 pt-10">
            <h3 className="font-heading text-xl font-bold text-white">More Technical Guides</h3>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {otherPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="glass-panel group block rounded-2xl p-5 border border-cyan-400/15 hover:border-cyan-400/40 transition"
                >
                  <span className="text-[10px] font-semibold text-[#00D4FF] uppercase tracking-wider">
                    {related.category}
                  </span>
                  <h4 className="mt-2 font-heading text-base font-bold text-white group-hover:text-[#00D4FF] transition">
                    {related.title}
                  </h4>
                  <p className="mt-1 text-xs text-[#A8B8D8] line-clamp-2">
                    {related.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

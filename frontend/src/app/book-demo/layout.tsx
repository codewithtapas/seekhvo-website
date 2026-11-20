import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Free AI Demo Class",
  description:
    "Reserve your seat for a live, interactive demo session with Seekhvo AI Learning mentors. Explore our AI Engineering curriculum, live projects, and hands-on labs.",
  alternates: {
    canonical: "https://seekhvo.space/book-demo",
  },
  openGraph: {
    title: "Book a Free AI Demo Class | Seekhvo AI Learning",
    description: "Experience live AI coding, project walkthroughs, and mentor Q&A before enrolling.",
    url: "https://seekhvo.space/book-demo",
    images: [{ url: "https://seekhvo.space/images/seekhvo-logo.png" }],
  },
};

export default function BookDemoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

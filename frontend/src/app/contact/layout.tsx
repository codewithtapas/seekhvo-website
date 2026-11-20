import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Seekhvo AI Learning admissions, enterprise training, and student support. Contact our AI education team via WhatsApp, phone (+91 8280765204), or email.",
  alternates: {
    canonical: "https://seekhvo.space/contact",
  },
  openGraph: {
    title: "Contact Us | Seekhvo AI Learning Admissions & Support",
    description: "Connect with Seekhvo AI Learning for course counseling, batch schedules, and corporate cohorts.",
    url: "https://seekhvo.space/contact",
    images: [{ url: "https://seekhvo.space/images/seekhvo-logo.png" }],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

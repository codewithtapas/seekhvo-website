import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Certificate",
  description: "Verify authentic Seekhvo AI Learning credentials, certificates, and student achievements.",
  alternates: {
    canonical: "https://seekhvo.space/verify",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function VerifyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppWidget } from "@/components/layout/WhatsAppWidget";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = "https://seekhvo.space";
const gscCode = "IJGcJzed_9jiG9WHe-HIScowgVozjWM7FSkJH7s-OIU";
const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Seekhvo AI Learning | Artificial Intelligence & Generative AI Courses",
    template: "%s | Seekhvo AI Learning",
  },
  description:
    "Seekhvo AI Learning is a premier Artificial Intelligence education and training platform. Master Generative AI, Machine Learning, Python, and Agentic AI through live cohorts, real-world capstone projects, and industry-recognized certification.",
  keywords: [
    "Seekhvo",
    "Seekhvo AI",
    "Seekhvo AI Learning",
    "AI Learning Platform",
    "Artificial Intelligence Courses",
    "Generative AI Courses",
    "AI Engineering Training",
    "Machine Learning Courses",
    "Learn Artificial Intelligence Online",
    "AI Courses for Students in India",
    "Agentic AI",
    "Python for AI",
    "seekhvo.space",
  ],
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Seekhvo AI Learning",
    title: "Seekhvo AI Learning | Artificial Intelligence & Generative AI Courses",
    description:
      "Master Generative AI, Machine Learning, Python, and Agentic AI through live cohorts, real-world projects, and career-focused engineering tracks.",
    images: [
      {
        url: `${siteUrl}/images/seekhvo-logo.png`,
        width: 1200,
        height: 630,
        alt: "Seekhvo AI Learning — Next-Gen AI Education",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Seekhvo AI Learning | Artificial Intelligence & Generative AI Courses",
    description:
      "Explore Artificial Intelligence. Build Real Skills. Shape the Future with Seekhvo AI Learning.",
    images: [`${siteUrl}/images/seekhvo-logo.png`],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  verification: {
    google: gscCode,
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": "https://seekhvo.space/#organization",
  name: "Seekhvo AI Learning",
  alternateName: ["Seekhvo", "Seekhvo AI", "Seekhvo.space"],
  url: "https://seekhvo.space",
  logo: "https://seekhvo.space/images/seekhvo-logo.png",
  description:
    "Seekhvo AI Learning is an advanced Artificial Intelligence education and engineering training platform offering industry-aligned courses in Generative AI, Machine Learning, Python, and Agentic AI.",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-8280765204",
    contactType: "customer service",
    areaServed: "IN",
    availableLanguage: ["English", "Hindi"],
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://seekhvo.space/#website",
  url: "https://seekhvo.space",
  name: "Seekhvo AI Learning",
  alternateName: ["Seekhvo", "Seekhvo AI"],
  publisher: {
    "@id": "https://seekhvo.space/#organization",
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://seekhvo.space/courses?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} dark`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-screen bg-[#030B20] text-white antialiased selection:bg-[#00D4FF]/30 selection:text-white">
        {gaId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${gaId}');`}
            </Script>
          </>
        ) : null}
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <WhatsAppWidget />
        </AuthProvider>
      </body>
    </html>
  );
}

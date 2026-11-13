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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://seekhvo.space";
const gscCode = process.env.NEXT_PUBLIC_GSC_VERIFICATION;
const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Seekhvo AI Learning | Learn Beyond Limits",
    template: "%s | Seekhvo AI Learning",
  },
  description:
    "Discover practical AI education through expert-led training, real-world projects, and future-ready skills in Generative AI, Machine Learning, Python, Data Science, and Agentic AI.",
  keywords: [
    "Seekhvo",
    "AI Learning",
    "Generative AI Course",
    "Agentic AI",
    "Machine Learning Training",
    "AI Engineer Program",
    "Python for AI",
    "seekhvo.space",
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Seekhvo AI Learning",
    title: "Seekhvo AI Learning — Futuristic 3D AI Education Platform",
    description:
      "Explore Artificial Intelligence. Build Real Skills. Shape the Future.",
  },
  verification: gscCode ? { google: gscCode } : undefined,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} dark`}>
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


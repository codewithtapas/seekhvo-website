import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, ShieldAlert, ArrowLeft } from "lucide-react";
import { apiFetch } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ certificateId: string }>;
}): Promise<Metadata> {
  const { certificateId } = await params;
  return {
    title: `Verify Certificate ${certificateId} | Seekhvo AI Learning`,
    description: "Seekhvo authentic credential and certificate verification record.",
    alternates: {
      canonical: `https://seekhvo.space/verify/${encodeURIComponent(certificateId)}`,
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

interface VerifyResponse {
  valid: boolean;
  is_revoked: boolean;
  certificate_id: string;
  recipient_name: string;
  course_title: string;
  course_slug: string;
  issued_date: string;
  grade_or_remarks: string;
  issuer: string;
}

export default async function VerifyCertificateDetailPage({
  params,
}: {
  params: Promise<{ certificateId: string }>;
}) {
  const { certificateId } = await params;
  const result = await apiFetch<VerifyResponse>(
    `/certificates/verify/${encodeURIComponent(certificateId)}/`
  ).catch(() => null);

  return (
    <div className="pt-32 pb-24 bg-[#030B20] cyber-grid-bg min-h-screen flex items-center justify-center px-4">
      <div className="glass-panel w-full max-w-xl rounded-3xl p-8 sm:p-10">
        <Link href="/verify" className="inline-flex items-center gap-1.5 text-xs text-[#42A5FF] hover:text-[#00D4FF]">
          <ArrowLeft className="h-3.5 w-3.5" /> Verify Another ID
        </Link>

        {result && result.valid ? (
          <div className="mt-6 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-4 py-1.5 text-xs font-semibold text-emerald-300">
              <ShieldCheck className="h-4 w-4" />
              AUTHENTIC SEEKHVO CREDENTIAL
            </div>

            <h1 className="font-heading text-3xl font-bold text-white">{result.recipient_name}</h1>
            <p className="text-sm text-[#A8B8D8]">
              Successfully completed <strong className="text-[#00D4FF]">{result.course_title}</strong>
            </p>

            <div className="rounded-2xl border border-cyan-400/20 bg-[#030B20]/80 p-5 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-[#A8B8D8]">Certificate ID</span>
                <span className="font-mono font-semibold text-white">{result.certificate_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A8B8D8]">Issued Date</span>
                <span className="text-white">{result.issued_date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A8B8D8]">Standing</span>
                <span className="text-white">{result.grade_or_remarks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A8B8D8]">Issuer</span>
                <span className="text-[#42A5FF]">{result.issuer}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 text-center space-y-3 py-6">
            <ShieldAlert className="mx-auto h-12 w-12 text-red-400" />
            <h1 className="font-heading text-2xl font-bold text-white">Certificate Not Valid</h1>
            <p className="text-sm text-[#A8B8D8]">
              {result?.is_revoked
                ? `Certificate ${certificateId} has been revoked.`
                : `No active Seekhvo certificate found for ID "${certificateId}".`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


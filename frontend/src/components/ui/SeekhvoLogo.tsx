import Image from "next/image";
import Link from "next/link";

interface SeekhvoLogoProps {
  height?: number;
  href?: string;
  className?: string;
}

/**
 * Official Seekhvo AI Learning logo.
 * Preserves the exact cropped 702x186 (~3.774:1) artwork proportions without distortion.
 */
export function SeekhvoLogo({ height = 46, href = "/", className = "" }: SeekhvoLogoProps) {
  const width = Math.round((height * 702) / 186);

  const img = (
    <Image
      src="/images/seekhvo-logo.png"
      alt="Seekhvo AI Learning"
      width={width}
      height={height}
      priority
      className={`object-contain select-none ${className}`}
      style={{ height: `${height}px`, width: `${width}px` }}
    />
  );

  if (!href) return img;
  return (
    <Link href={href} className="inline-flex items-center shrink-0 focus:outline-none">
      {img}
    </Link>
  );
}

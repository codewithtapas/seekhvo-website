export type PerformanceTier = "high" | "medium" | "low" | "reduced";

export interface DeviceCapabilities {
  tier: PerformanceTier;
  particleCount: number;
  ringCount: number;
  webglSupported: boolean;
  prefersReducedMotion: boolean;
}

export function detectWebGLSupport(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export function detectDeviceCapabilities(): DeviceCapabilities {
  if (typeof window === "undefined") {
    return {
      tier: "high",
      particleCount: 9500,
      ringCount: 16,
      webglSupported: true,
      prefersReducedMotion: false,
    };
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const webglSupported = detectWebGLSupport();

  if (prefersReducedMotion) {
    return {
      tier: "reduced",
      particleCount: 2800,
      ringCount: 10,
      webglSupported,
      prefersReducedMotion: true,
    };
  }

  const cores = navigator.hardwareConcurrency || 4;
  const isMobile = window.innerWidth < 768;
  const dpr = window.devicePixelRatio || 1;

  if (isMobile || cores <= 4) {
    return {
      tier: "low",
      particleCount: 4200,
      ringCount: 12,
      webglSupported,
      prefersReducedMotion: false,
    };
  }

  if (cores <= 6 || dpr > 2.2) {
    return {
      tier: "medium",
      particleCount: 7200,
      ringCount: 14,
      webglSupported,
      prefersReducedMotion: false,
    };
  }

  return {
    tier: "high",
    particleCount: 11000,
    ringCount: 18,
    webglSupported,
    prefersReducedMotion: false,
  };
}


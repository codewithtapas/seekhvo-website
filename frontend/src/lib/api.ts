const PUBLIC_API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
const SERVER_API_BASE = process.env.INTERNAL_API_URL || PUBLIC_API_BASE;

export function getApiBase(): string {
  return typeof window === "undefined" ? SERVER_API_BASE : PUBLIC_API_BASE;
}

const ACCESS_KEY = "seekhvo_access_token";
const REFRESH_KEY = "seekhvo_refresh_token";

export const tokenStore = {
  getAccess(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_KEY);
  },
  getRefresh(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_KEY);
  },
  setTokens(access: string, refresh: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

export class ApiError extends Error {
  status: number;
  payload: unknown;
  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

async function tryRefreshToken(): Promise<string | null> {
  const refresh = tokenStore.getRefresh();
  if (!refresh) return null;
  try {
    const res = await fetch(`${getApiBase()}/auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) {
      tokenStore.clear();
      return null;
    }
    const data = (await res.json()) as { access: string; refresh?: string };
    tokenStore.setTokens(data.access, data.refresh || refresh);
    return data.access;
  } catch {
    return null;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { auth?: boolean; retryOn401?: boolean } = {}
): Promise<T> {
  const { auth = false, retryOn401 = true, headers, ...rest } = options;
  const reqHeaders = new Headers(headers);

  if (!(rest.body instanceof FormData) && !reqHeaders.has("Content-Type")) {
    reqHeaders.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = tokenStore.getAccess();
    if (token) {
      reqHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${getApiBase()}${path}`, {
    ...rest,
    headers: reqHeaders,
    cache: rest.cache ?? "no-store",
  });

  if (response.status === 401 && auth && retryOn401 && typeof window !== "undefined") {
    const newAccess = await tryRefreshToken();
    if (newAccess) {
      return apiFetch<T>(path, { ...options, retryOn401: false });
    }
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    const msg =
      typeof data === "object" && data !== null && "detail" in data
        ? String((data as { detail: unknown }).detail)
        : `Request failed (${response.status})`;
    throw new ApiError(msg, response.status, data);
  }

  return data as T;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export function formatPrice(amount: string | number, currency = "INR"): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (Number.isNaN(num)) return String(amount);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(num);
}


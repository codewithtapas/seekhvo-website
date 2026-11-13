"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiFetch, tokenStore } from "./api";
import type { UserProfile } from "./types";

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<UserProfile>;
  register: (payload: {
    email: string;
    full_name: string;
    phone: string;
    city?: string;
    password: string;
    confirm_password: string;
  }) => Promise<UserProfile>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = tokenStore.getAccess();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const profile = await apiFetch<UserProfile>("/auth/me/", { auth: true });
      setUser(profile);
    } catch {
      tokenStore.clear();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiFetch<{ access: string; refresh: string; user: UserProfile }>("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    tokenStore.setTokens(data.access, data.refresh);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(
    async (payload: {
      email: string;
      full_name: string;
      phone: string;
      city?: string;
      password: string;
      confirm_password: string;
    }) => {
      const data = await apiFetch<{ access: string; refresh: string; user: UserProfile }>("/auth/register/", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      tokenStore.setTokens(data.access, data.refresh);
      setUser(data.user);
      return data.user;
    },
    []
  );

  const logout = useCallback(async () => {
    const refresh = tokenStore.getRefresh();
    try {
      if (refresh) {
        await apiFetch("/auth/logout/", {
          method: "POST",
          auth: true,
          body: JSON.stringify({ refresh }),
        });
      }
    } catch {
      // Ignore logout network failures and clear client tokens
    } finally {
      tokenStore.clear();
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}


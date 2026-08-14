"use client";

import { useState, useEffect, useCallback } from "react";
import { isNteMode } from "@/lib/mode";

interface NteSession {
  nte: string | null;
  loading: boolean;
  logout: () => Promise<void>;
}

export function useNteSession(): NteSession {
  const [nte, setNte] = useState<string | null>(null);
  const [loading, setLoading] = useState(isNteMode());

  useEffect(() => {
    if (!isNteMode()) return;
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((d) => setNte(d.nte ?? null))
      .finally(() => setLoading(false));
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }, []);

  return { nte, loading, logout };
}

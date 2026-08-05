"use client";

import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "painel_ideb_auth";
const STORAGE_PERFIL = "painel_ideb_perfil";

interface UseAuthReturn {
  isAuthenticated: boolean;
  perfil: string | null;
  login: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

export function useAuth(): UseAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [perfil, setPerfil] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored === "true") {
      setIsAuthenticated(true);
      setPerfil(sessionStorage.getItem(STORAGE_PERFIL));
    }
    setLoaded(true);
  }, []);

  const login = useCallback(
    async (
      password: string
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        });

        const json = await res.json();

        if (json.success) {
          setIsAuthenticated(true);
          setPerfil(json.perfil);
          sessionStorage.setItem(STORAGE_KEY, "true");
          sessionStorage.setItem(STORAGE_PERFIL, json.perfil);
          return { success: true };
        }

        return { success: false, error: json.error || "Senha incorreta" };
      } catch {
        return { success: false, error: "Erro ao conectar ao servidor" };
      }
    },
    []
  );

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setPerfil(null);
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_PERFIL);
  }, []);

  if (!loaded) {
    return { isAuthenticated: false, perfil: null, login, logout };
  }

  return { isAuthenticated, perfil, login, logout };
}

"use client";

import { useState, useCallback, useEffect } from "react";

const SESSION_KEY = "painel_ideb_auth";
const SESSION_PERFIL = "painel_ideb_perfil";
const PERSIST_KEY = "painel_ideb_auth_persist";
const PERSIST_PERFIL = "painel_ideb_perfil_persist";

interface UseAuthReturn {
  isAuthenticated: boolean;
  perfil: string | null;
  login: (
    password: string,
    remember: boolean
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

export function useAuth(): UseAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [perfil, setPerfil] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const session = sessionStorage.getItem(SESSION_KEY);
    const persisted = localStorage.getItem(PERSIST_KEY);
    if (session === "true") {
      setIsAuthenticated(true);
      setPerfil(sessionStorage.getItem(SESSION_PERFIL));
    } else if (persisted === "true") {
      setIsAuthenticated(true);
      setPerfil(localStorage.getItem(PERSIST_PERFIL));
      sessionStorage.setItem(SESSION_KEY, "true");
      sessionStorage.setItem(
        SESSION_PERFIL,
        localStorage.getItem(PERSIST_PERFIL) || ""
      );
    }
    setLoaded(true);
  }, []);

  const login = useCallback(
    async (
      password: string,
      remember: boolean
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
          sessionStorage.setItem(SESSION_KEY, "true");
          sessionStorage.setItem(SESSION_PERFIL, json.perfil);
          if (remember) {
            localStorage.setItem(PERSIST_KEY, "true");
            localStorage.setItem(PERSIST_PERFIL, json.perfil);
          }
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
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_PERFIL);
    localStorage.removeItem(PERSIST_KEY);
    localStorage.removeItem(PERSIST_PERFIL);
  }, []);

  if (!loaded) {
    return { isAuthenticated: false, perfil: null, login, logout };
  }

  return { isAuthenticated, perfil, login, logout };
}

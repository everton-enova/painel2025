"use client";

import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "painel_ideb_auth";
const VALID_PASSWORD = "eX23s11Qt";

interface UseAuthReturn {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  error: string | null;
}

export function useAuth(): UseAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored === "true") {
      setIsAuthenticated(true);
    }
    setLoaded(true);
  }, []);

  const login = useCallback((password: string): boolean => {
    if (password === VALID_PASSWORD) {
      setIsAuthenticated(true);
      setError(null);
      sessionStorage.setItem(STORAGE_KEY, "true");
      return true;
    }
    setError("Senha incorreta");
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  if (!loaded) {
    return { isAuthenticated: false, login, logout, error };
  }

  return { isAuthenticated, login, logout, error };
}

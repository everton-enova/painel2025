"use client";

import { useState, useEffect } from "react";
import { IdebRecord } from "@/types/ideb";

interface UseIdebDataReturn {
  data: IdebRecord[];
  updatedAt: string | null;
  source: "sheet" | "mock" | null;
  isLoading: boolean;
  error: string | null;
}

export function useIdebData(): UseIdebDataReturn {
  const [data, setData] = useState<IdebRecord[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [source, setSource] = useState<"sheet" | "mock" | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/dados-ideb");
        if (!res.ok) throw new Error(`Erro ao carregar dados: ${res.status}`);
        const json = await res.json();
        if (!cancelled) {
          setData(json.data);
          setUpdatedAt(json.updatedAt);
          setSource(json.source);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Erro desconhecido"
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, updatedAt, source, isLoading, error };
}

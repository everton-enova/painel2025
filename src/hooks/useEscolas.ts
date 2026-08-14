"use client";

import { useState, useEffect, useRef } from "react";
import { EscolaRecord } from "@/types/ideb";

interface UseEscolasReturn {
  escolas: EscolaRecord[];
  isLoading: boolean;
  error: string | null;
  escolasUnicas: { codigo: string; nome: string; rede: string; etapas: string[] }[];
}

export function useEscolas(codigoMunicipio: string | null): UseEscolasReturn {
  const [escolas, setEscolas] = useState<EscolaRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const prevCode = useRef<string | null>(null);

  useEffect(() => {
    if (!codigoMunicipio || codigoMunicipio === "29") {
      setEscolas([]);
      setError(null);
      prevCode.current = codigoMunicipio ?? null;
      return;
    }

    if (codigoMunicipio === prevCode.current) return;
    prevCode.current = codigoMunicipio;

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetch(`/api/escolas?municipio=${codigoMunicipio}`)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        setEscolas(json.data ?? []);
        setIsLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [codigoMunicipio]);

  const escolasUnicas = escolas.length > 0
    ? (() => {
        const map = new Map<string, { codigo: string; nome: string; rede: string; etapas: Set<string> }>();
        for (const e of escolas) {
          const existing = map.get(e.codigo_escola);
          if (existing) {
            existing.etapas.add(e.etapa);
          } else {
            map.set(e.codigo_escola, {
              codigo: e.codigo_escola,
              nome: e.escola,
              rede: e.rede,
              etapas: new Set([e.etapa]),
            });
          }
        }
        return [...map.values()]
          .map((e) => ({ ...e, etapas: [...e.etapas].sort() }))
          .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
      })()
    : [];

  return { escolas, isLoading, error, escolasUnicas };
}

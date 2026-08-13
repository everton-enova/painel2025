"use client";

import { useState, useEffect, useRef } from "react";
import { EscolaRecord } from "@/types/ideb";

interface UseEscolasReturn {
  escolas: EscolaRecord[];
  isLoading: boolean;
  error: string | null;
  escolasUnicas: { codigo: string; nome: string; rede: string }[];
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
    ? [
        ...new Map(
          escolas.map((e) => [
            e.codigo_escola,
            { codigo: e.codigo_escola, nome: e.escola, rede: e.rede },
          ])
        ).values(),
      ].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
    : [];

  return { escolas, isLoading, error, escolasUnicas };
}

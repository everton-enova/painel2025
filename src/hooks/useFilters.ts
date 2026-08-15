"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { IdebRecord, FilterState } from "@/types/ideb";
import { EDICOES_VIGENTES, MAX_COMPARACAO } from "@/lib/constants";
import { isNteMode } from "@/lib/mode";

interface FilterOptions {
  ntes: string[];
  municipios: string[];
  redes: string[];
  etapas: string[];
}

/** Campos de múltipla escolha; lista vazia equivale a "todos". */
type ChaveMulti = "municipios" | "redes" | "etapas";

interface UseFiltersReturn {
  filters: FilterState;
  setNte: (value: string | null) => void;
  toggle: (key: ChaveMulti, valor: string) => void;
  clearKey: (key: ChaveMulti) => void;
  clearFilters: () => void;
  filteredData: IdebRecord[];
  filterOptions: FilterOptions;
  hasActiveFilter: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  bahiaDisponivel: boolean;
  bahiaSelecionada: boolean;
  toggleBahia: () => void;
}

const INITIAL_FILTERS: FilterState = {
  nte: null,
  municipios: [],
  redes: [],
  etapas: [],
};

// "NTE 3" e "NTE 12" precisam sair em ordem numérica, não alfabética
function ordenaNte(a: string, b: string): number {
  const n = (s: string) => parseInt(s.replace(/\D/g, ""), 10) || 0;
  return n(a) - n(b);
}

/** Lista vazia significa "todos", então não filtra nada. */
function aceita(selecionados: string[], valor: string): boolean {
  return selecionados.length === 0 || selecionados.includes(valor);
}

export function useFilters(data: IdebRecord[]): UseFiltersReturn {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [searchTerm, setSearchTerm] = useState("");

  const setNte = useCallback((value: string | null) => {
    setFilters((prev) => ({ ...prev, nte: value }));
  }, []);

  const toggle = useCallback((key: ChaveMulti, valor: string) => {
    setFilters((prev) => {
      const atual = prev[key];
      if (atual.includes(valor)) {
        return { ...prev, [key]: atual.filter((v) => v !== valor) };
      }
      // Só a lista de municípios tem teto — é ela que alimenta o comparativo
      if (key === "municipios" && atual.length >= MAX_COMPARACAO) return prev;
      return { ...prev, [key]: [...atual, valor] };
    });
  }, []);

  const clearKey = useCallback((key: ChaveMulti) => {
    setFilters((prev) => ({ ...prev, [key]: [] }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setSearchTerm("");
  }, []);

  const hasActiveFilter =
    filters.nte !== null ||
    filters.municipios.length > 0 ||
    filters.redes.length > 0 ||
    filters.etapas.length > 0 ||
    searchTerm.length > 0;

  const filteredData = useMemo(() => {
    return data.filter((record) => {
      if (filters.nte && record.nte !== filters.nte) {
        if (record.municipio === "Bahia" && filters.municipios.includes("Bahia")) {
          // Bahia passa se explicitamente selecionada pelo botão
        } else if (record.municipio === "Bahia") {
          return false;
        } else {
          return false;
        }
      }
      if (!aceita(filters.municipios, record.municipio)) return false;
      if (!aceita(filters.redes, record.rede)) return false;
      if (!aceita(filters.etapas, record.etapa)) return false;
      // A busca livre só filtra a tabela enquanto nada foi selecionado
      if (
        searchTerm &&
        filters.municipios.length === 0 &&
        !record.municipio.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false;
      return true;
    });
  }, [data, filters, searchTerm]);

  // As opções refletem as edições vigentes (2023 e 2025): uma etapa
  // descontinuada há tempos some do filtro, mas quem teve resultado em 2023
  // e não em 2025 continua visível — é justamente o caso que se quer enxergar.
  const opcoesBase = useMemo(
    () => data.filter((r) => EDICOES_VIGENTES.includes(r.ano)),
    [data]
  );

  // Cascata: NTE restringe os municípios, os municípios restringem as redes e
  // as redes restringem as etapas. Cada nível parte do recorte do anterior.
  const filterOptions = useMemo((): FilterOptions => {
    const unique = (arr: string[]) =>
      [...new Set(arr)].sort((a, b) =>
        a.localeCompare(b, "pt-BR", { sensitivity: "base" })
      );

    const paraMunicipios = filters.nte
      ? opcoesBase.filter((r) => r.nte === filters.nte || r.municipio === "Bahia")
      : opcoesBase;

    const paraRedes = paraMunicipios.filter((r) =>
      aceita(filters.municipios, r.municipio)
    );

    const paraEtapas = paraRedes.filter((r) => aceita(filters.redes, r.rede));

    return {
      ntes: [...new Set(opcoesBase.map((r) => r.nte).filter(Boolean))].sort(
        ordenaNte
      ),
      municipios: unique(paraMunicipios.map((r) => r.municipio).filter((m) => m && m !== "Bahia")),
      redes: unique(paraRedes.map((r) => r.rede).filter(Boolean)),
      etapas: unique(paraEtapas.map((r) => r.etapa).filter(Boolean)),
    };
  }, [opcoesBase, filters.nte, filters.municipios, filters.redes]);

  // Uma seleção pode ficar inválida ao mudar um filtro acima na cascata (ex.:
  // trocar de NTE com municípios de outro núcleo escolhidos, ou manter
  // "Anos Finais" numa rede que não oferta essa etapa). Descarta o que
  // deixou de existir, preservando o resto da escolha.
  useEffect(() => {
    setFilters((prev) => {
      const municipios = prev.municipios.filter((m) =>
        m === "Bahia" || filterOptions.municipios.includes(m)
      );
      const redes = prev.redes.filter((r) => filterOptions.redes.includes(r));
      const etapas = prev.etapas.filter((e) =>
        filterOptions.etapas.includes(e)
      );
      if (
        municipios.length === prev.municipios.length &&
        redes.length === prev.redes.length &&
        etapas.length === prev.etapas.length
      ) {
        return prev;
      }
      return { ...prev, municipios, redes, etapas };
    });
  }, [filterOptions.municipios, filterOptions.redes, filterOptions.etapas]);

  const bahiaDisponivel = opcoesBase.some((r) => r.municipio === "Bahia");
  const bahiaSelecionada = filters.municipios.includes("Bahia");
  const toggleBahia = useCallback(() => {
    toggle("municipios", "Bahia");
  }, [toggle]);

  return {
    filters,
    setNte,
    toggle,
    clearKey,
    clearFilters,
    filteredData,
    filterOptions,
    hasActiveFilter,
    searchTerm,
    setSearchTerm,
    bahiaDisponivel,
    bahiaSelecionada,
    toggleBahia,
  };
}

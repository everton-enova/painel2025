"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { IdebRecord, FilterState } from "@/types/ideb";
import { EDICOES_VIGENTES } from "@/lib/constants";

interface FilterOptions {
  municipios: string[];
  redes: string[];
  etapas: string[];
}

interface UseFiltersReturn {
  filters: FilterState;
  setFilter: (key: keyof FilterState, value: string | null) => void;
  clearFilters: () => void;
  filteredData: IdebRecord[];
  filterOptions: FilterOptions;
  hasActiveFilter: boolean;
  allFiltersSet: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const INITIAL_FILTERS: FilterState = {
  municipio: null,
  rede: null,
  etapa: null,
};

export function useFilters(data: IdebRecord[]): UseFiltersReturn {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [searchTerm, setSearchTerm] = useState("");

  const setFilter = useCallback(
    (key: keyof FilterState, value: string | null) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const clearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setSearchTerm("");
  }, []);

  const hasActiveFilter =
    Object.values(filters).some((v) => v !== null) || searchTerm.length > 0;

  const allFiltersSet =
    filters.municipio !== null &&
    filters.rede !== null &&
    filters.etapa !== null;

  const filteredData = useMemo(() => {
    return data.filter((record) => {
      if (filters.municipio && record.municipio !== filters.municipio)
        return false;
      if (filters.rede && record.rede !== filters.rede) return false;
      if (filters.etapa && record.etapa !== filters.etapa) return false;
      if (
        searchTerm &&
        !filters.municipio &&
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

  // Filtros em cascata: rede depende do município, etapa depende de ambos.
  const filterOptions = useMemo((): FilterOptions => {
    const unique = (arr: string[]) =>
      [...new Set(arr)].sort((a, b) =>
        a.localeCompare(b, "pt-BR", { sensitivity: "base" })
      );

    const paraRedes = filters.municipio
      ? opcoesBase.filter((r) => r.municipio === filters.municipio)
      : opcoesBase;

    const paraEtapas = filters.rede
      ? paraRedes.filter((r) => r.rede === filters.rede)
      : paraRedes;

    return {
      municipios: unique(opcoesBase.map((r) => r.municipio).filter(Boolean)),
      redes: unique(paraRedes.map((r) => r.rede).filter(Boolean)),
      etapas: unique(paraEtapas.map((r) => r.etapa).filter(Boolean)),
    };
  }, [opcoesBase, filters.municipio, filters.rede]);

  // Uma seleção pode ficar inválida ao trocar de município (ex.: "Estadual —
  // Anos Finais" não existe em Cipó). Nesse caso, limpa o que não se aplica.
  useEffect(() => {
    setFilters((prev) => {
      const redeInvalida =
        prev.rede !== null && !filterOptions.redes.includes(prev.rede);
      const etapaInvalida =
        prev.etapa !== null && !filterOptions.etapas.includes(prev.etapa);
      if (!redeInvalida && !etapaInvalida) return prev;
      return {
        ...prev,
        rede: redeInvalida ? null : prev.rede,
        etapa: etapaInvalida ? null : prev.etapa,
      };
    });
  }, [filterOptions.redes, filterOptions.etapas]);

  return {
    filters,
    setFilter,
    clearFilters,
    filteredData,
    filterOptions,
    hasActiveFilter,
    allFiltersSet,
    searchTerm,
    setSearchTerm,
  };
}

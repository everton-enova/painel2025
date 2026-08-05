"use client";

import { useState, useMemo, useCallback } from "react";
import { IdebRecord, FilterState } from "@/types/ideb";

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

  const filteredByRede = useMemo(
    () => data.filter((r) => r.rede === "Estadual"),
    [data]
  );

  const filteredData = useMemo(() => {
    return filteredByRede.filter((record) => {
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
  }, [filteredByRede, filters, searchTerm]);

  const filterOptions = useMemo((): FilterOptions => {
    const unique = (arr: string[]) =>
      [...new Set(arr)].sort((a, b) =>
        a.localeCompare(b, "pt-BR", { sensitivity: "base" })
      );
    return {
      municipios: unique(filteredByRede.map((r) => r.municipio).filter(Boolean)),
      redes: ["Estadual"],
      etapas: unique(filteredByRede.map((r) => r.etapa).filter(Boolean)),
    };
  }, [filteredByRede]);

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

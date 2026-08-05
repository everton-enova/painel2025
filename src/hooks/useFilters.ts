"use client";

import { useState, useMemo, useCallback } from "react";
import { IdebRecord, FilterState } from "@/types/ideb";

interface FilterOptions {
  anos: string[];
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
}

const INITIAL_FILTERS: FilterState = {
  ano: null,
  municipio: null,
  rede: null,
  etapa: null,
};

export function useFilters(data: IdebRecord[]): UseFiltersReturn {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  const setFilter = useCallback(
    (key: keyof FilterState, value: string | null) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const clearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((record) => {
      if (filters.ano && record.ano !== parseInt(filters.ano, 10)) return false;
      if (filters.municipio && record.municipio !== filters.municipio)
        return false;
      if (filters.rede && record.rede !== filters.rede) return false;
      if (filters.etapa && record.etapa !== filters.etapa) return false;
      return true;
    });
  }, [data, filters]);

  const filterOptions = useMemo((): FilterOptions => {
    const unique = <T>(arr: T[]) => [...new Set(arr)].sort();
    return {
      anos: unique(data.map((r) => String(r.ano))),
      municipios: unique(data.map((r) => r.municipio).filter(Boolean)),
      redes: unique(data.map((r) => r.rede).filter(Boolean)),
      etapas: unique(data.map((r) => r.etapa).filter(Boolean)),
    };
  }, [data]);

  return { filters, setFilter, clearFilters, filteredData, filterOptions };
}

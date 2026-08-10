"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { IdebRecord, FilterState } from "@/types/ideb";
import { EDICOES_VIGENTES, MAX_COMPARACAO } from "@/lib/constants";

interface FilterOptions {
  ntes: string[];
  municipios: string[];
  redes: string[];
  etapas: string[];
}

interface UseFiltersReturn {
  filters: FilterState;
  setFilter: (key: "nte" | "rede" | "etapa", value: string | null) => void;
  toggleMunicipio: (municipio: string) => void;
  clearMunicipios: () => void;
  clearFilters: () => void;
  filteredData: IdebRecord[];
  filterOptions: FilterOptions;
  hasActiveFilter: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const INITIAL_FILTERS: FilterState = {
  nte: null,
  municipios: [],
  rede: null,
  etapa: null,
};

// "NTE 3" e "NTE 12" precisam sair em ordem numérica, não alfabética
function ordenaNte(a: string, b: string): number {
  const n = (s: string) => parseInt(s.replace(/\D/g, ""), 10) || 0;
  return n(a) - n(b);
}

export function useFilters(data: IdebRecord[]): UseFiltersReturn {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [searchTerm, setSearchTerm] = useState("");

  const setFilter = useCallback(
    (key: "nte" | "rede" | "etapa", value: string | null) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const toggleMunicipio = useCallback((municipio: string) => {
    setFilters((prev) => {
      const jaTem = prev.municipios.includes(municipio);
      if (jaTem) {
        return {
          ...prev,
          municipios: prev.municipios.filter((m) => m !== municipio),
        };
      }
      if (prev.municipios.length >= MAX_COMPARACAO) return prev;
      return { ...prev, municipios: [...prev.municipios, municipio] };
    });
  }, []);

  const clearMunicipios = useCallback(() => {
    setFilters((prev) => ({ ...prev, municipios: [] }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setSearchTerm("");
  }, []);

  const hasActiveFilter =
    filters.nte !== null ||
    filters.rede !== null ||
    filters.etapa !== null ||
    filters.municipios.length > 0 ||
    searchTerm.length > 0;

  const filteredData = useMemo(() => {
    return data.filter((record) => {
      if (filters.nte && record.nte !== filters.nte) return false;
      if (
        filters.municipios.length > 0 &&
        !filters.municipios.includes(record.municipio)
      )
        return false;
      if (filters.rede && record.rede !== filters.rede) return false;
      if (filters.etapa && record.etapa !== filters.etapa) return false;
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
  // a rede restringe as etapas. Cada nível parte do recorte do nível anterior.
  const filterOptions = useMemo((): FilterOptions => {
    const unique = (arr: string[]) =>
      [...new Set(arr)].sort((a, b) =>
        a.localeCompare(b, "pt-BR", { sensitivity: "base" })
      );

    const paraMunicipios = filters.nte
      ? opcoesBase.filter((r) => r.nte === filters.nte)
      : opcoesBase;

    const paraRedes =
      filters.municipios.length > 0
        ? paraMunicipios.filter((r) => filters.municipios.includes(r.municipio))
        : paraMunicipios;

    const paraEtapas = filters.rede
      ? paraRedes.filter((r) => r.rede === filters.rede)
      : paraRedes;

    return {
      ntes: [...new Set(opcoesBase.map((r) => r.nte).filter(Boolean))].sort(
        ordenaNte
      ),
      municipios: unique(paraMunicipios.map((r) => r.municipio).filter(Boolean)),
      redes: unique(paraRedes.map((r) => r.rede).filter(Boolean)),
      etapas: unique(paraEtapas.map((r) => r.etapa).filter(Boolean)),
    };
  }, [opcoesBase, filters.nte, filters.municipios, filters.rede]);

  // Uma seleção pode ficar inválida ao mudar um filtro acima na cascata (ex.:
  // trocar de NTE com municípios de outro núcleo escolhidos, ou "Estadual —
  // Anos Finais", que não existe em Cipó). Limpa o que deixou de se aplicar.
  useEffect(() => {
    setFilters((prev) => {
      const municipiosValidos = prev.municipios.filter((m) =>
        filterOptions.municipios.includes(m)
      );
      const municipioMudou =
        municipiosValidos.length !== prev.municipios.length;
      const redeInvalida =
        prev.rede !== null && !filterOptions.redes.includes(prev.rede);
      const etapaInvalida =
        prev.etapa !== null && !filterOptions.etapas.includes(prev.etapa);
      if (!municipioMudou && !redeInvalida && !etapaInvalida) return prev;
      return {
        ...prev,
        municipios: municipiosValidos,
        rede: redeInvalida ? null : prev.rede,
        etapa: etapaInvalida ? null : prev.etapa,
      };
    });
  }, [filterOptions.municipios, filterOptions.redes, filterOptions.etapas]);

  return {
    filters,
    setFilter,
    toggleMunicipio,
    clearMunicipios,
    clearFilters,
    filteredData,
    filterOptions,
    hasActiveFilter,
    searchTerm,
    setSearchTerm,
  };
}

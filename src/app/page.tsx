"use client";

import { useIdebData } from "@/hooks/useIdebData";
import { useFilters } from "@/hooks/useFilters";
import { Header } from "@/components/Header";
import { Filters } from "@/components/Filters";
import { ChartSections } from "@/components/ChartSections";
import { DataTable } from "@/components/DataTable";
import { RankingTable } from "@/components/RankingTable";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { OnboardingTour } from "@/components/OnboardingTour";
import { ComparativoMunicipios } from "@/components/ComparativoMunicipios";

export default function Home() {
  const { data, updatedAt, source, isLoading, error } = useIdebData();
  const {
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
  } = useFilters(data);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8">
        <LoadingSpinner />
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm font-medium text-red-800">
            Erro ao carregar dados
          </p>
          <p className="mt-1 text-xs text-red-600">{error}</p>
        </div>
      </main>
    );
  }

  const selectedLabel = [
    filters.nte,
    filters.municipios.length === 1 ? filters.municipios[0] : null,
    filters.redes.length === 1 ? filters.redes[0] : null,
    filters.etapas.length === 1 ? filters.etapas[0] : null,
  ]
    .filter(Boolean)
    .join(" \u2014 ");

  const comparando = filters.municipios.length >= 2;

  return (
    <main className="mx-auto w-full min-w-0 max-w-7xl px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
      <OnboardingTour />

      <Header updatedAt={updatedAt} source={source} />

      <Filters
        filters={filters}
        options={filterOptions}
        onNteChange={setNte}
        onToggle={toggle}
        onClearKey={clearKey}
        onClear={clearFilters}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {!comparando && hasActiveFilter && selectedLabel && (
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">
          {selectedLabel}
        </h2>
      )}

      {comparando ? (
        <ComparativoMunicipios
          data={data}
          municipios={filters.municipios}
          redes={filters.redes}
          etapas={filters.etapas}
        />
      ) : (
        filters.municipios.length === 1 && (
          <ChartSections data={filteredData} filters={filters} />
        )
      )}

      {hasActiveFilter && (
        <>
          <DataTable data={filteredData} ano={2025} title="Resultado 2025" />
          <RankingTable data={filteredData} />
        </>
      )}
    </main>
  );
}

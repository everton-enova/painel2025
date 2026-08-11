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
      <main className="mx-auto max-w-7xl px-6 py-8">
        <LoadingSpinner />
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-2xl bg-[#fce8e8] p-8 text-center">
          <p className="text-[15px] font-medium text-[#d03b3b]">
            Erro ao carregar dados
          </p>
          <p className="mt-1 text-[13px] text-[#d03b3b]/70">{error}</p>
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
    .join(" — ");

  const comparando = filters.municipios.length >= 2;

  return (
    <main className="mx-auto w-full min-w-0 max-w-7xl px-4 sm:px-6 py-5 sm:py-8 space-y-5 sm:space-y-7">
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
        <h2 className="text-[18px] sm:text-[22px] font-semibold text-[var(--foreground)] tracking-tight">
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

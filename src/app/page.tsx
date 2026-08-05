"use client";

import { useIdebData } from "@/hooks/useIdebData";
import { useFilters } from "@/hooks/useFilters";
import { computeKPIs } from "@/lib/aggregations";
import { Header } from "@/components/Header";
import { Filters } from "@/components/Filters";
import { SummaryCards } from "@/components/SummaryCards";
import { DataTable } from "@/components/DataTable";
import { RankingTable } from "@/components/RankingTable";
import { ChartEvolucao } from "@/components/ChartEvolucao";
import { ChartComparativo } from "@/components/ChartComparativo";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";

export default function Home() {
  const { data, updatedAt, source, isLoading, error } = useIdebData();
  const { filters, setFilter, clearFilters, filteredData, filterOptions, hasActiveFilter } =
    useFilters(data);

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

  const data2023 = filteredData.filter((r) => r.ano === 2023);
  const data2025 = filteredData.filter((r) => r.ano === 2025);
  const kpis2023 = computeKPIs(data2023);
  const kpis2025 = computeKPIs(data2025);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      <Header updatedAt={updatedAt} source={source} />

      <Filters
        filters={filters}
        options={filterOptions}
        onFilterChange={setFilter}
        onClear={clearFilters}
      />

      {!hasActiveFilter ? (
        <EmptyState message="Selecione ao menos um filtro para visualizar os dados" />
      ) : filteredData.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <SummaryCards kpis2023={kpis2023} kpis2025={kpis2025} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartEvolucao data={filteredData} />
            <ChartComparativo data={filteredData} />
          </div>

          <DataTable data={filteredData} ano={2025} title="Dados IDEB 2025" />
          <DataTable data={filteredData} ano={2023} title="Dados IDEB 2023" />

          <RankingTable data={filteredData} />
        </>
      )}
    </main>
  );
}

"use client";

import { useIdebData } from "@/hooks/useIdebData";
import { useFilters } from "@/hooks/useFilters";
import { computeKPIs } from "@/lib/aggregations";
import { Header } from "@/components/Header";
import { Filters } from "@/components/Filters";
import { SummaryCards } from "@/components/SummaryCards";
import { DataTable } from "@/components/DataTable";
import { ChartEvolucao } from "@/components/ChartEvolucao";
import { ChartComparativo } from "@/components/ChartComparativo";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";

export default function Home() {
  const { data, updatedAt, source, isLoading, error } = useIdebData();
  const { filters, setFilter, clearFilters, filteredData, filterOptions } =
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

  const kpis = computeKPIs(filteredData);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      <Header updatedAt={updatedAt} source={source} />

      <Filters
        filters={filters}
        options={filterOptions}
        onFilterChange={setFilter}
        onClear={clearFilters}
      />

      {filteredData.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <SummaryCards kpis={kpis} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartEvolucao data={filteredData} />
            <ChartComparativo data={filteredData} />
          </div>

          <DataTable data={filteredData} />
        </>
      )}
    </main>
  );
}

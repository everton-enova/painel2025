"use client";

import { useAuth } from "@/hooks/useAuth";
import { useIdebData } from "@/hooks/useIdebData";
import { useFilters } from "@/hooks/useFilters";
import { computeKPIs } from "@/lib/aggregations";
import { Header } from "@/components/Header";
import { Filters } from "@/components/Filters";
import { SummaryCards } from "@/components/SummaryCards";
import { DataTable } from "@/components/DataTable";
import { RankingTable } from "@/components/RankingTable";
import { ChartIndicador } from "@/components/ChartIndicador";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { LoginScreen } from "@/components/LoginScreen";

export default function Home() {
  const { isAuthenticated, login, logout } = useAuth();
  const { data, updatedAt, source, isLoading, error } = useIdebData();
  const {
    filters,
    setFilter,
    clearFilters,
    filteredData,
    filterOptions,
    hasActiveFilter,
    allFiltersSet,
    searchTerm,
    setSearchTerm,
  } = useFilters(data);

  if (!isAuthenticated) {
    return <LoginScreen onLogin={login} />;
  }

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

  const activeData = hasActiveFilter ? filteredData : data;
  const data2023 = activeData.filter((r) => r.ano === 2023);
  const data2025 = activeData.filter((r) => r.ano === 2025);
  const kpis2023 = computeKPIs(data2023);
  const kpis2025 = computeKPIs(data2025);

  const selectedLabel = [
    filters.municipio,
    filters.rede,
    filters.etapa,
  ]
    .filter(Boolean)
    .join(" — ");

  return (
    <main className="mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
      <Header updatedAt={updatedAt} source={source} onLogout={logout} />

      <Filters
        filters={filters}
        options={filterOptions}
        onFilterChange={setFilter}
        onClear={clearFilters}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {hasActiveFilter && (
        <>
          {selectedLabel && (
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              {selectedLabel}
            </h2>
          )}

          <div>
            <p className="text-xs text-gray-500 mb-3 italic">
              Variação em relação à edição anterior (2023)
            </p>
            <SummaryCards kpis2023={kpis2023} kpis2025={kpis2025} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <ChartIndicador
              data={filteredData}
              field="ideb"
              title="Ideb"
              color="#2563eb"
            />
            <ChartIndicador
              data={filteredData}
              field="indicador_rendimento"
              title="Indicador de Rendimento"
              color="#f59e0b"
            />
            <ChartIndicador
              data={filteredData}
              field="nota_padronizada"
              title="Nota Padronizada"
              color="#7c3aed"
            />
            <ChartIndicador
              data={filteredData}
              field="proficiencia_mat"
              title="Proficiência Matemática"
              color="#0d9488"
            />
            <ChartIndicador
              data={filteredData}
              field="proficiencia_lp"
              title="Proficiência Língua Portuguesa"
              color="#e11d48"
            />
          </div>
        </>
      )}

      {allFiltersSet && (
        <>
          <DataTable data={activeData} ano={2025} title="Resultado 2025" />
          <RankingTable data={filteredData} />
        </>
      )}
    </main>
  );
}

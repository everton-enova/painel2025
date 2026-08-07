"use client";

import { useAuth } from "@/hooks/useAuth";
import { useIdebData } from "@/hooks/useIdebData";
import { useFilters } from "@/hooks/useFilters";
import { Header } from "@/components/Header";
import { Filters } from "@/components/Filters";
import { ChartSections } from "@/components/ChartSections";
import { DataTable } from "@/components/DataTable";
import { RankingTable } from "@/components/RankingTable";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { LoginScreen } from "@/components/LoginScreen";
import { OnboardingTour } from "@/components/OnboardingTour";

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

  const selectedLabel = [
    filters.nte,
    filters.municipio,
    filters.rede,
    filters.etapa,
  ]
    .filter(Boolean)
    .join(" — ");

  return (
    <main className="mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
      <OnboardingTour />

      <Header updatedAt={updatedAt} source={source} onLogout={logout} />

      <Filters
        filters={filters}
        options={filterOptions}
        onFilterChange={setFilter}
        onClear={clearFilters}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {hasActiveFilter && selectedLabel && (
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">
          {selectedLabel}
        </h2>
      )}

      {filters.municipio && (
        <ChartSections data={filteredData} filters={filters} />
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

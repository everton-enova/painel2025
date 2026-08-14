"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useIdebData } from "@/hooks/useIdebData";
import { useFilters } from "@/hooks/useFilters";
import { useEscolas } from "@/hooks/useEscolas";
import { useNteSession } from "@/hooks/useNteSession";
import { isNteMode } from "@/lib/mode";
import { Header } from "@/components/Header";
import { Filters } from "@/components/Filters";
import { ChartSections } from "@/components/ChartSections";
import { DataTable } from "@/components/DataTable";
import { RankingTable } from "@/components/RankingTable";
import { OnboardingTour } from "@/components/OnboardingTour";
import { ComparativoMunicipios } from "@/components/ComparativoMunicipios";
import { EscolaPanel } from "@/components/EscolaPanel";
import { SplashScreen } from "@/components/SplashScreen";

export default function Home() {
  const { data, updatedAt, source, isLoading, error } = useIdebData();
  const [splashDone, setSplashDone] = useState(false);
  const handleSplashFinish = useCallback(() => setSplashDone(true), []);
  const nteSession = useNteSession();
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
    bahiaDisponivel,
    bahiaSelecionada,
    toggleBahia,
  } = useFilters(data);

  // No modo NTE, fixa o filtro no NTE do usuário logado
  useEffect(() => {
    if (isNteMode() && nteSession.nte && filters.nte !== nteSession.nte) {
      setNte(nteSession.nte);
    }
  }, [nteSession.nte, filters.nte, setNte]);

  const municipiosComEscola = filters.municipios.filter((m) => m !== "Bahia");
  const [escolaTab, setEscolaTab] = useState<string | null>(null);

  useEffect(() => {
    if (municipiosComEscola.length > 0 && (!escolaTab || !municipiosComEscola.includes(escolaTab))) {
      setEscolaTab(municipiosComEscola[0]);
    } else if (municipiosComEscola.length === 0) {
      setEscolaTab(null);
    }
  }, [municipiosComEscola.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  const codigoMunicipio = useMemo(() => {
    if (!escolaTab) return null;
    const rec = data.find((r) => r.municipio === escolaTab);
    return rec?.codigo_municipio ?? null;
  }, [data, escolaTab]);

  const { escolas, isLoading: escolasLoading, escolasUnicas } =
    useEscolas(codigoMunicipio);

  if (isLoading || !splashDone) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  if (error) {
    return (
      <main className="mx-auto px-6 lg:px-10 xl:px-16 py-8">
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

  const municipiosSemBahia = filters.municipios.filter((m) => m !== "Bahia");
  const comparando = filters.municipios.length >= 2;

  return (
    <main className="mx-auto w-full min-w-0 px-4 sm:px-6 lg:px-10 xl:px-16 py-5 sm:py-8 space-y-5 sm:space-y-7">
      <OnboardingTour />

      <Header
        updatedAt={updatedAt}
        source={source}
        nteSession={isNteMode() ? nteSession : undefined}
      />

      <Filters
        filters={filters}
        options={filterOptions}
        onNteChange={setNte}
        nteFixed={isNteMode()}
        onToggle={toggle}
        onClearKey={clearKey}
        onClear={clearFilters}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        bahiaDisponivel={bahiaDisponivel}
        bahiaSelecionada={bahiaSelecionada}
        onToggleBahia={toggleBahia}
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
        municipiosSemBahia.length === 1 && (
          <ChartSections data={filteredData} filters={filters} />
        )
      )}

      {escolaTab && (
        <>
          {municipiosComEscola.length >= 2 && (
            <div className="flex flex-wrap gap-1.5">
              {municipiosComEscola.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setEscolaTab(m)}
                  className={`rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-200 ${
                    escolaTab === m
                      ? "bg-[var(--accent)] text-white shadow-sm"
                      : "bg-[#f0f0f0] text-[var(--text-secondary)] hover:bg-[#e5e5e5]"
                  }`}
                >
                  Escolas — {m}
                </button>
              ))}
            </div>
          )}
          <EscolaPanel
            escolas={escolas}
            escolasUnicas={escolasUnicas}
            isLoading={escolasLoading}
            municipio={escolaTab}
          />
        </>
      )}

      {hasActiveFilter && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-7">
          <DataTable data={filteredData} ano={2025} title="Resultado 2025" />
          <RankingTable data={filteredData} />
        </div>
      )}
    </main>
  );
}

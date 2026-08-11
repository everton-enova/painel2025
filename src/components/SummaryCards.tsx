"use client";

import { IdebValue, KPIData } from "@/types/ideb";

interface SummaryCardsProps {
  kpis2023: KPIData;
  kpis2025: KPIData;
}

function formatNumber(n: IdebValue, decimals = 2): string {
  if (n === null) return "—";
  if (n === "ND") return "ND";
  return n.toFixed(decimals).replace(".", ",");
}

function VariationBadge({
  v2023,
  v2025,
}: {
  v2023: IdebValue;
  v2025: IdebValue;
}) {
  if (typeof v2023 !== "number" || typeof v2025 !== "number") return null;
  const diff = v2025 - v2023;
  const isPositive = diff > 0;
  const isNeutral = diff === 0;

  const style = isPositive
    ? "bg-[#e8f8ee] text-[#1a7f37]"
    : isNeutral
      ? "bg-[#f0f0f0] text-[#86868b]"
      : "bg-[#fce8e8] text-[#d03b3b]";

  const arrow = isPositive ? "↑" : isNeutral ? "–" : "↓";

  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${style}`}
    >
      {arrow} {Math.abs(diff).toFixed(2).replace(".", ",")}
    </span>
  );
}

function Card({
  label,
  value2025,
  value2023,
  accentColor,
}: {
  label: string;
  value2025: IdebValue;
  value2023: IdebValue;
  accentColor: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col gap-2 sm:gap-3 transition-shadow duration-300 hover:shadow-[var(--card-shadow-hover)]" style={{ boxShadow: "var(--card-shadow)" }}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] sm:text-xs font-medium text-[var(--text-secondary)] tracking-wide">
          {label}
        </span>
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
      </div>
      <div className="flex items-end gap-2 sm:gap-3">
        <p
          className={`font-semibold tracking-tight ${
            value2025 === "ND"
              ? "text-xl sm:text-2xl text-[var(--text-tertiary)]"
              : "text-2xl sm:text-[2rem] text-[var(--foreground)]"
          }`}
          title={
            value2025 === "ND"
              ? "Nota Não Divulgada: taxa de participação inferior a 80%"
              : undefined
          }
        >
          {formatNumber(value2025)}
        </p>
        <VariationBadge v2023={value2023} v2025={value2025} />
      </div>
    </div>
  );
}

export function SummaryCards({ kpis2023, kpis2025 }: SummaryCardsProps) {
  const hasNd = [
    kpis2025.mediaIdeb,
    kpis2025.mediaNotaPadronizada,
    kpis2025.mediaProficienciaMat,
    kpis2025.mediaProficienciaLp,
    kpis2025.mediaIndicadorRendimento,
  ].some((v) => v === "ND");

  return (
    <>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      <Card
        label="Ideb"
        value2025={kpis2025.mediaIdeb}
        value2023={kpis2023.mediaIdeb}
        accentColor="#007aff"
      />
      <Card
        label="Nota Padronizada"
        value2025={kpis2025.mediaNotaPadronizada}
        value2023={kpis2023.mediaNotaPadronizada}
        accentColor="#5856d6"
      />
      <Card
        label="Prof. MAT"
        value2025={kpis2025.mediaProficienciaMat}
        value2023={kpis2023.mediaProficienciaMat}
        accentColor="#30b0c7"
      />
      <Card
        label="Prof. LP"
        value2025={kpis2025.mediaProficienciaLp}
        value2023={kpis2023.mediaProficienciaLp}
        accentColor="#af52de"
      />
      <Card
        label="Ind. Rendimento"
        value2025={kpis2025.mediaIndicadorRendimento}
        value2023={kpis2023.mediaIndicadorRendimento}
        accentColor="#ff9500"
      />
    </div>
    {hasNd && (
      <p className="mt-2 text-[11px] sm:text-xs text-[var(--text-tertiary)]">
        ND — Nota Não Divulgada: o município não atingiu a taxa mínima de
        participação de 80% dos estudantes no SAEB.
      </p>
    )}
    </>
  );
}

"use client";

import { KPIData } from "@/types/ideb";

interface SummaryCardsProps {
  kpis2023: KPIData;
  kpis2025: KPIData;
}

function formatNumber(n: number | null, decimals = 2): string {
  if (n === null) return "—";
  return n.toFixed(decimals).replace(".", ",");
}

function VariationBadge({
  v2023,
  v2025,
}: {
  v2023: number | null;
  v2025: number | null;
}) {
  if (v2023 === null || v2025 === null) return null;
  const diff = v2025 - v2023;
  const isPositive = diff > 0;
  const isNeutral = diff === 0;

  const bgColor = isPositive
    ? "bg-green-100 text-green-700"
    : isNeutral
      ? "bg-gray-100 text-gray-600"
      : "bg-red-100 text-red-700";

  const arrow = isPositive ? "▲" : isNeutral ? "—" : "▼";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${bgColor}`}
    >
      {arrow} {Math.abs(diff).toFixed(2).replace(".", ",")}
    </span>
  );
}

function Card({
  label,
  value2025,
  value2023,
  icon,
  accentColor,
}: {
  label: string;
  value2025: number | null;
  value2023: number | null;
  icon: string;
  accentColor: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {label}
        </span>
        <span
          className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${accentColor}`}
        >
          {icon}
        </span>
      </div>
      <div className="flex items-end gap-3">
        <p className="text-3xl font-bold text-gray-900">
          {formatNumber(value2025)}
        </p>
        <VariationBadge v2023={value2023} v2025={value2025} />
      </div>
      <p className="text-xs text-gray-400">vs 2023</p>
    </div>
  );
}

export function SummaryCards({ kpis2023, kpis2025 }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card
        label="IDEB"
        value2025={kpis2025.mediaIdeb}
        value2023={kpis2023.mediaIdeb}
        icon="📊"
        accentColor="bg-blue-100 text-blue-600"
      />
      <Card
        label="Nota Padronizada"
        value2025={kpis2025.mediaNotaPadronizada}
        value2023={kpis2023.mediaNotaPadronizada}
        icon="📝"
        accentColor="bg-indigo-100 text-indigo-600"
      />
      <Card
        label="Prof. MAT"
        value2025={kpis2025.mediaProficienciaMat}
        value2023={kpis2023.mediaProficienciaMat}
        icon="📐"
        accentColor="bg-teal-100 text-teal-600"
      />
      <Card
        label="Prof. LP"
        value2025={kpis2025.mediaProficienciaLp}
        value2023={kpis2023.mediaProficienciaLp}
        icon="📖"
        accentColor="bg-purple-100 text-purple-600"
      />
      <Card
        label="Ind. Rendimento"
        value2025={kpis2025.mediaIndicadorRendimento}
        value2023={kpis2023.mediaIndicadorRendimento}
        icon="📈"
        accentColor="bg-amber-100 text-amber-600"
      />
    </div>
  );
}

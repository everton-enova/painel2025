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

function Variation({ v2023, v2025 }: { v2023: number | null; v2025: number | null }) {
  if (v2023 === null || v2025 === null) return null;
  const diff = v2025 - v2023;
  const sign = diff >= 0 ? "+" : "";
  const color = diff > 0 ? "text-green-600" : diff < 0 ? "text-red-600" : "text-gray-500";
  return (
    <span className={`text-xs font-medium ${color}`}>
      {sign}{diff.toFixed(2).replace(".", ",")}
    </span>
  );
}

function Card({
  label,
  value2023,
  value2025,
  color,
}: {
  label: string;
  value2023: number | null;
  value2025: number | null;
  color: string;
}) {
  return (
    <div className={`rounded-xl border p-4 shadow-sm ${color}`}>
      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
        {label}
      </p>
      <div className="mt-2 flex items-end gap-3">
        <div>
          <p className="text-xs text-gray-400">2025</p>
          <p className="text-2xl font-bold text-gray-900">{formatNumber(value2025)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">2023</p>
          <p className="text-sm text-gray-500">{formatNumber(value2023)}</p>
        </div>
      </div>
      <div className="mt-1">
        <Variation v2023={value2023} v2025={value2025} />
      </div>
    </div>
  );
}

export function SummaryCards({ kpis2023, kpis2025 }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      <Card
        label="IDEB"
        value2023={kpis2023.mediaIdeb}
        value2025={kpis2025.mediaIdeb}
        color="bg-blue-50 border-blue-200"
      />
      <Card
        label="Nota Padronizada"
        value2023={kpis2023.mediaNotaPadronizada}
        value2025={kpis2025.mediaNotaPadronizada}
        color="bg-indigo-50 border-indigo-200"
      />
      <Card
        label="Proficiência MAT"
        value2023={kpis2023.mediaProficienciaMat}
        value2025={kpis2025.mediaProficienciaMat}
        color="bg-teal-50 border-teal-200"
      />
      <Card
        label="Proficiência LP"
        value2023={kpis2023.mediaProficienciaLp}
        value2025={kpis2025.mediaProficienciaLp}
        color="bg-purple-50 border-purple-200"
      />
      <Card
        label="Ind. Rendimento"
        value2023={kpis2023.mediaIndicadorRendimento}
        value2025={kpis2025.mediaIndicadorRendimento}
        color="bg-amber-50 border-amber-200"
      />
    </div>
  );
}

"use client";

import { KPIData } from "@/types/ideb";

interface SummaryCardsProps {
  kpis: KPIData;
}

function Card({
  label,
  value,
  subtitle,
  color,
}: {
  label: string;
  value: string;
  subtitle?: string;
  color: string;
}) {
  return (
    <div
      className={`rounded-xl border p-4 shadow-sm ${color}`}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
      {subtitle && (
        <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
      )}
    </div>
  );
}

function formatNumber(n: number | null, decimals = 2): string {
  if (n === null) return "—";
  return n.toFixed(decimals).replace(".", ",");
}

export function SummaryCards({ kpis }: SummaryCardsProps) {
  const percentColor =
    kpis.percentualAtingiu !== null
      ? kpis.percentualAtingiu >= 60
        ? "bg-green-50 border-green-200"
        : kpis.percentualAtingiu >= 40
          ? "bg-yellow-50 border-yellow-200"
          : "bg-red-50 border-red-200"
      : "bg-gray-50 border-gray-200";

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      <Card
        label="IDEB Médio"
        value={formatNumber(kpis.mediaIdeb)}
        subtitle="Observado"
        color="bg-blue-50 border-blue-200"
      />
      <Card
        label="Meta Média"
        value={formatNumber(kpis.mediaMeta)}
        subtitle="Projetada"
        color="bg-indigo-50 border-indigo-200"
      />
      <Card
        label="Atingiram Meta"
        value={
          kpis.percentualAtingiu !== null
            ? `${formatNumber(kpis.percentualAtingiu, 1)}%`
            : "—"
        }
        subtitle="dos registros"
        color={percentColor}
      />
      <Card
        label="Registros"
        value={String(kpis.totalRegistros)}
        color="bg-gray-50 border-gray-200"
      />
      <Card
        label="Aprendizado"
        value={formatNumber(kpis.mediaAprendizado)}
        subtitle="Média"
        color="bg-teal-50 border-teal-200"
      />
      <Card
        label="Fluxo"
        value={formatNumber(kpis.mediaFluxo)}
        subtitle="Média"
        color="bg-purple-50 border-purple-200"
      />
    </div>
  );
}

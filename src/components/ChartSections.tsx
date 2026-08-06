"use client";

import { IdebRecord, FilterState } from "@/types/ideb";
import { ChartIndicador } from "./ChartIndicador";
import { SummaryCards } from "./SummaryCards";
import { computeKPIs } from "@/lib/aggregations";
import { EDICOES_VIGENTES } from "@/lib/constants";

interface ChartSectionsProps {
  data: IdebRecord[];
  filters: FilterState;
}

const CHART_CONFIG = [
  { field: "ideb" as const, title: "Ideb", color: "#2563eb" },
  { field: "indicador_rendimento" as const, title: "Indicador de Rendimento", color: "#f59e0b" },
  { field: "nota_padronizada" as const, title: "Nota Padronizada", color: "#7c3aed" },
  { field: "proficiencia_mat" as const, title: "Proficiência Matemática", color: "#0d9488" },
  { field: "proficiencia_lp" as const, title: "Proficiência Língua Portuguesa", color: "#e11d48" },
];

function SectionContent({ data, suffix }: { data: IdebRecord[]; suffix: string }) {
  const data2023 = data.filter((r) => r.ano === 2023);
  const data2025 = data.filter((r) => r.ano === 2025);
  const kpis2023 = computeKPIs(data2023);
  const kpis2025 = computeKPIs(data2025);

  return (
    <>
      <div>
        <p className="text-xs text-gray-500 mb-3 italic">
          Variação em relação à edição anterior (2023)
        </p>
        <SummaryCards kpis2023={kpis2023} kpis2025={kpis2025} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {CHART_CONFIG.map((c) => (
          <ChartIndicador
            key={`${c.field}-${suffix}`}
            data={data}
            field={c.field}
            title={c.title}
            color={c.color}
          />
        ))}
      </div>
    </>
  );
}

export function ChartSections({ data, filters }: ChartSectionsProps) {
  const needsSplit = !filters.rede || !filters.etapa;

  if (!needsSplit) {
    if (!data.some((r) => EDICOES_VIGENTES.includes(r.ano))) return null;
    return (
      <div className="space-y-4 sm:space-y-6">
        <SectionContent data={data} suffix="single" />
      </div>
    );
  }

  const redes = filters.rede
    ? [filters.rede]
    : [...new Set(data.map((r) => r.rede))].sort();
  const etapas = filters.etapa
    ? [filters.etapa]
    : [...new Set(data.map((r) => r.etapa))].sort();

  const groups: { label: string; records: IdebRecord[] }[] = [];

  for (const rede of redes) {
    for (const etapa of etapas) {
      const records = data.filter((r) => r.rede === rede && r.etapa === etapa);
      // Só monta a seção se houver dados numa edição vigente — combinações
      // descontinuadas (só com histórico antigo) ficam de fora.
      if (records.some((r) => EDICOES_VIGENTES.includes(r.ano))) {
        groups.push({ label: `${rede} — ${etapa}`, records });
      }
    }
  }

  if (groups.length === 0) return null;

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <div key={group.label} className="space-y-4 sm:space-y-6">
          <h3 className="text-sm sm:text-base font-semibold text-gray-600 border-l-4 border-blue-500 pl-3">
            {group.label}
          </h3>
          <SectionContent data={group.records} suffix={group.label} />
        </div>
      ))}
    </div>
  );
}

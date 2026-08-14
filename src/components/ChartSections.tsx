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
  { field: "ideb" as const, title: "Ideb", color: "#007aff" },
  { field: "indicador_rendimento" as const, title: "Indicador de Rendimento", color: "#ff9500" },
  { field: "nota_padronizada" as const, title: "Nota Padronizada", color: "#5856d6" },
  { field: "proficiencia_mat" as const, title: "Proficiência Matemática", color: "#30b0c7" },
  { field: "proficiencia_lp" as const, title: "Proficiência Língua Portuguesa", color: "#af52de" },
];

function SectionContent({ data, suffix }: { data: IdebRecord[]; suffix: string }) {
  const data2023 = data.filter((r) => r.ano === 2023);
  const data2025 = data.filter((r) => r.ano === 2025);
  const kpis2023 = computeKPIs(data2023);
  const kpis2025 = computeKPIs(data2025);

  const ideb = CHART_CONFIG[0];
  const rest = CHART_CONFIG.slice(1);

  return (
    <>
      <div>
        <p className="text-[11px] text-[var(--text-tertiary)] mb-3">
          Variação em relação à edição anterior (2023)
        </p>
        <SummaryCards kpis2023={kpis2023} kpis2025={kpis2025} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="lg:col-span-2">
          <ChartIndicador
            key={`${ideb.field}-${suffix}`}
            data={data}
            field={ideb.field}
            title={ideb.title}
            color={ideb.color}
            tall
          />
        </div>
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {rest.map((c) => (
            <ChartIndicador
              key={`${c.field}-${suffix}`}
              data={data}
              field={c.field}
              title={c.title}
              color={c.color}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export function ChartSections({ data, filters }: ChartSectionsProps) {
  const umaSo = filters.redes.length === 1 && filters.etapas.length === 1;

  if (umaSo) {
    if (!data.some((r) => EDICOES_VIGENTES.includes(r.ano))) return null;
    return (
      <div className="space-y-5 sm:space-y-6">
        <SectionContent data={data} suffix="single" />
      </div>
    );
  }

  const redes =
    filters.redes.length > 0
      ? [...filters.redes].sort()
      : [...new Set(data.map((r) => r.rede))].sort();
  const etapas =
    filters.etapas.length > 0
      ? [...filters.etapas].sort()
      : [...new Set(data.map((r) => r.etapa))].sort();

  const groups: { label: string; records: IdebRecord[] }[] = [];

  for (const rede of redes) {
    for (const etapa of etapas) {
      const records = data.filter((r) => r.rede === rede && r.etapa === etapa);
      if (records.some((r) => EDICOES_VIGENTES.includes(r.ano))) {
        groups.push({ label: `${rede} — ${etapa}`, records });
      }
    }
  }

  if (groups.length === 0) return null;

  return (
    <div className="space-y-10">
      {groups.map((group) => (
        <div key={group.label} className="space-y-5 sm:space-y-6">
          <h3 className="text-[15px] font-semibold text-[var(--foreground)] border-l-[3px] border-[var(--accent)] pl-3">
            {group.label}
          </h3>
          <SectionContent data={group.records} suffix={group.label} />
        </div>
      ))}
    </div>
  );
}

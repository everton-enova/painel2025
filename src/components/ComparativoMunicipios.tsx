"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Customized,
} from "recharts";
import { IdebRecord, IdebValue } from "@/types/ideb";
import {
  EDICAO_ATUAL,
  EDICAO_ANTERIOR,
  EDICOES_VIGENTES,
  SERIES_COLORS,
  BAHIA_COLOR,
} from "@/lib/constants";
import { dominioDinamico, marcasDoDominio } from "@/lib/escala";
import { useIsMobile } from "@/hooks/useIsMobile";

const ANO_INICIAL_GRAFICO = 2019;

const LABEL_H = 16;
const MIN_GAP = 18;

interface SmartLabelsProps {
  formattedGraphicalItems?: Array<{
    props: { points: Array<{ x: number; y: number; value: number | null }> };
    item: { props: { stroke: string } };
  }>;
  casas: number;
}

function SmartLabels({ formattedGraphicalItems, casas }: SmartLabelsProps) {
  if (!formattedGraphicalItems || formattedGraphicalItems.length === 0) return null;

  const items = formattedGraphicalItems;
  const numPoints = items[0]?.props?.points?.length ?? 0;
  if (numPoints === 0) return null;

  const elements: React.ReactElement[] = [];

  for (let ptIdx = 0; ptIdx < numPoints; ptIdx++) {
    const isFirst = ptIdx === 0;
    const isLast = ptIdx === numPoints - 1;
    const anchor = isFirst ? "start" : isLast ? "end" : "middle";

    const labels: { x: number; y: number; value: number; color: string }[] = [];
    for (const item of items) {
      const pt = item.props.points[ptIdx];
      if (!pt || pt.value === null || pt.value === undefined) continue;
      labels.push({ x: pt.x, y: pt.y, value: pt.value, color: item.item.props.stroke });
    }

    labels.sort((a, b) => a.y - b.y);

    const slots: number[] = [];
    for (let i = 0; i < labels.length; i++) {
      let slot = labels[i].y - LABEL_H;
      if (i > 0 && slot < slots[i - 1] + MIN_GAP) {
        slot = slots[i - 1] + MIN_GAP;
      }
      slots.push(slot);
    }

    for (let i = 0; i < labels.length; i++) {
      const { x, y: pointY, value, color } = labels[i];
      const labelY = slots[i];
      const text = value.toFixed(casas).replace(".", ",");
      const needsLine = Math.abs(labelY - (pointY - LABEL_H)) > 4;

      const charW = 6.5;
      const padX = 3;
      const padY = 2;
      const w = text.length * charW + padX * 2;
      const h = 13 + padY * 2;
      const rx = anchor === "start" ? x - padX : anchor === "end" ? x - w + padX : x - w / 2;

      elements.push(
        <g key={`${ptIdx}-${i}`}>
          {needsLine && (
            <line
              x1={x} y1={pointY - 3}
              x2={x} y2={labelY + 6}
              stroke={color} strokeWidth={1} strokeDasharray="2 2" opacity={0.4}
            />
          )}
          <rect x={rx} y={labelY - padY} width={w} height={h} rx={4} fill="white" fillOpacity={0.94} />
          <text x={x} y={labelY + 11} textAnchor={anchor} fontSize={11} fontWeight={600} fill={color}>
            {text}
          </text>
        </g>
      );
    }
  }

  return <g>{elements}</g>;
}

type FieldKey =
  | "ideb"
  | "nota_padronizada"
  | "proficiencia_mat"
  | "proficiencia_lp"
  | "indicador_rendimento";

const INDICADORES: { field: FieldKey; label: string; curto: string; limite: [number, number]; casas: number }[] = [
  { field: "ideb", label: "Ideb", curto: "Ideb", limite: [0, 10], casas: 1 },
  { field: "nota_padronizada", label: "Nota Padronizada", curto: "Nota Pad.", limite: [0, 10], casas: 1 },
  { field: "proficiencia_mat", label: "Proficiência Matemática", curto: "Prof. MAT", limite: [0, 500], casas: 0 },
  { field: "proficiencia_lp", label: "Proficiência Língua Portuguesa", curto: "Prof. LP", limite: [0, 500], casas: 0 },
  { field: "indicador_rendimento", label: "Indicador de Rendimento", curto: "Ind. Rend.", limite: [0, 1], casas: 2 },
];

function fmt(v: IdebValue, casas = 2): string {
  if (v === null) return "—";
  if (v === "ND") return "ND";
  return v.toFixed(casas).replace(".", ",");
}

function num(v: IdebValue): number | null {
  return typeof v === "number" ? v : null;
}

interface ComparativoProps {
  data: IdebRecord[];
  municipios: string[];
  redes: string[];
  etapas: string[];
}

export function ComparativoMunicipios({
  data,
  municipios,
  redes: redesSel,
  etapas: etapasSel,
}: ComparativoProps) {
  const corDe = (municipio: string) => {
    if (municipio === "Bahia") return BAHIA_COLOR;
    const semBahia = municipios.filter((m) => m !== "Bahia");
    return SERIES_COLORS[semBahia.indexOf(municipio) % SERIES_COLORS.length];
  };

  const blocos = useMemo(() => {
    const doSelecionado = data.filter((r) => municipios.includes(r.municipio));
    const redes =
      redesSel.length > 0
        ? [...redesSel].sort((a, b) => a.localeCompare(b, "pt-BR"))
        : [...new Set(doSelecionado.map((r) => r.rede))].sort((a, b) =>
            a.localeCompare(b, "pt-BR")
          );
    const etapas =
      etapasSel.length > 0
        ? [...etapasSel].sort((a, b) => a.localeCompare(b, "pt-BR"))
        : [...new Set(doSelecionado.map((r) => r.etapa))].sort((a, b) =>
            a.localeCompare(b, "pt-BR")
          );

    const res: { rede: string; etapa: string; registros: IdebRecord[] }[] = [];
    for (const rd of redes) {
      for (const et of etapas) {
        const registros = doSelecionado.filter(
          (r) => r.rede === rd && r.etapa === et
        );
        const quantos = new Set(
          registros
            .filter((r) => EDICOES_VIGENTES.includes(r.ano))
            .map((r) => r.municipio)
        ).size;
        if (quantos >= 2) res.push({ rede: rd, etapa: et, registros });
      }
    }
    return res;
  }, [data, municipios, redesSel, etapasSel]);

  if (blocos.length === 0) {
    return (
      <section className="bg-white rounded-2xl p-8 text-center" style={{ boxShadow: "var(--card-shadow)" }}>
        <p className="text-[13px] text-[var(--text-secondary)]">
          Os municípios escolhidos não têm uma rede e etapa em comum para
          comparar.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {blocos.map((b) => (
        <BlocoComparativo
          key={`${b.rede}|${b.etapa}`}
          registros={b.registros}
          municipios={municipios}
          rede={b.rede}
          etapa={b.etapa}
          corDe={corDe}
          unico={blocos.length === 1}
        />
      ))}
    </div>
  );
}

function BlocoComparativo({
  registros,
  municipios,
  rede,
  etapa,
  corDe,
  unico,
}: {
  registros: IdebRecord[];
  municipios: string[];
  rede: string;
  etapa: string;
  corDe: (m: string) => string;
  unico: boolean;
}) {
  const mobile = useIsMobile();
  const espessura = mobile ? 1.25 : 2;

  const anos = useMemo(
    () =>
      [...new Set(registros.map((r) => r.ano))]
        .filter((a) => a >= ANO_INICIAL_GRAFICO)
        .sort(),
    [registros]
  );

  const presentes = useMemo(
    () => municipios
      .filter((m) => registros.some((r) => r.municipio === m))
      .sort((a, b) => (a === "Bahia" ? -1 : b === "Bahia" ? 1 : 0)),
    [municipios, registros]
  );

  const dadosGrafico = (field: FieldKey) =>
    anos.map((ano) => {
      const linha: Record<string, string | number | null> = { ano: String(ano) };
      for (const m of presentes) {
        const reg = registros.find((r) => r.municipio === m && r.ano === ano);
        linha[m] = reg ? num(reg[field]) : null;
      }
      return linha;
    });

  const valorDe = (municipio: string, field: FieldKey, ano: number): IdebValue => {
    const reg = registros.find((r) => r.municipio === municipio && r.ano === ano);
    return reg ? reg[field] : null;
  };

  const dominioDe = (field: FieldKey, limite: [number, number]) =>
    dominioDinamico(
      registros
        .filter((r) => anos.includes(r.ano) && presentes.includes(r.municipio))
        .map((r) => r[field])
        .filter((v): v is number => typeof v === "number"),
      limite
    );

  const renderChart = (ind: typeof INDICADORES[number], tall = false) => {
    const dominio = dominioDe(ind.field, ind.limite);
    return (
      <div key={ind.field} className="rounded-2xl bg-white p-4 sm:p-5 flex flex-col" style={{ boxShadow: "var(--card-shadow)" }}>
        <h4 className="text-[13px] font-semibold text-[var(--foreground)] mb-3">
          {ind.label}
        </h4>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height={tall ? 280 : 210}>
            <LineChart
              data={dadosGrafico(ind.field)}
              margin={{ top: 28, right: 8, left: -12, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--separator)" />
              <XAxis dataKey="ano" tick={{ fontSize: 11, fill: "#aeaeb2" }} axisLine={{ stroke: "var(--separator)" }} tickLine={false} />
              <YAxis
                domain={dominio}
                ticks={marcasDoDominio(dominio)}
                tick={{ fontSize: 11, fill: "#aeaeb2" }}
                tickFormatter={(v: number) =>
                  v.toFixed(ind.casas).replace(".", ",")
                }
                width={44}
                allowDecimals
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value, name) => [
                  fmt(value as number, ind.casas === 0 ? 1 : 2),
                  name as string,
                ]}
                labelFormatter={(l) => `Ano: ${l}`}
                contentStyle={{ fontSize: 12, borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}
              />
              {presentes.map((m) => (
                <Line
                  key={m}
                  type="monotone"
                  dataKey={m}
                  name={m}
                  stroke={corDe(m)}
                  strokeWidth={espessura}
                  dot={{
                    r: Math.round(espessura * 1.3 * 10) / 10,
                    fill: corDe(m),
                    strokeWidth: 0,
                  }}
                  activeDot={{
                    r: mobile ? 4 : 5,
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  connectNulls
                />
              ))}
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <Customized component={(props: any) => <SmartLabels {...props} casas={ind.casas} />} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const idebInd = INDICADORES[0];
  const restInd = INDICADORES.slice(1);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-white rounded-2xl p-4 sm:p-6 space-y-4" style={{ boxShadow: "var(--card-shadow)" }}>
          <div>
            <h3 className="text-[15px] font-semibold text-[var(--foreground)]">
              {unico ? "Comparativo entre municípios" : `${rede} — ${etapa}`}
            </h3>
            <p className="text-[12px] text-[var(--text-tertiary)] mt-0.5">
              {unico ? `${rede} — ${etapa}` : `${presentes.length} municípios`}
            </p>
          </div>
          <TabelaComparativa
            municipios={presentes}
            valorDe={valorDe}
            corDe={corDe}
          />
        </div>

        <div className="lg:col-span-2">
          {renderChart(idebInd, true)}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {restInd.map((ind) => renderChart(ind))}
      </div>
    </div>
  );
}

function TabelaComparativa({
  municipios,
  valorDe,
  corDe,
}: {
  municipios: string[];
  valorDe: (m: string, f: FieldKey, ano: number) => IdebValue;
  corDe: (m: string) => string;
}) {
  const temNd = municipios.some((m) =>
    INDICADORES.some(
      (i) =>
        valorDe(m, i.field, EDICAO_ATUAL) === "ND" ||
        valorDe(m, i.field, EDICAO_ANTERIOR) === "ND"
    )
  );

  return (
    <div>
      <div className="overflow-x-auto rounded-xl">
      <table className="min-w-full text-[12px] sm:text-[13px]">
        <thead>
          <tr className="border-b border-[var(--separator)]">
            <th className="px-3 py-2.5 text-left font-medium text-[var(--text-tertiary)] whitespace-nowrap">
              Município
            </th>
            {INDICADORES.map((i) => (
              <th
                key={i.field}
                className="px-3 py-2.5 text-right font-medium text-[var(--text-tertiary)] whitespace-nowrap"
              >
                {i.curto}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--separator)]">
          {municipios.map((m) => (
            <tr key={m} className={`transition-colors ${m === "Bahia" ? "bg-[#fef2f2]" : "hover:bg-[#fafafa]"}`}>
              <td className="px-3 py-2.5 whitespace-nowrap">
                <span className="inline-flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: corDe(m) }}
                  />
                  <span className="font-medium text-[var(--foreground)]">
                    {m}{m === "Bahia" && <span className="ml-1 text-[10px] font-normal text-[var(--text-tertiary)]">(Estado)</span>}
                  </span>
                </span>
              </td>
              {INDICADORES.map((i) => {
                const v25 = valorDe(m, i.field, EDICAO_ATUAL);
                const v23 = valorDe(m, i.field, EDICAO_ANTERIOR);
                const delta =
                  typeof v25 === "number" && typeof v23 === "number"
                    ? Math.round((v25 - v23) * 100) / 100
                    : null;
                const casas = i.casas === 0 ? 1 : 2;
                return (
                  <td
                    key={i.field}
                    className="px-3 py-2.5 text-right whitespace-nowrap tabular-nums"
                  >
                    <span
                      className={
                        v25 === "ND"
                          ? "text-[var(--text-tertiary)]"
                          : "font-semibold text-[var(--foreground)]"
                      }
                    >
                      {fmt(v25, casas)}
                    </span>
                    {delta !== null && (
                      <span
                        className={`ml-1.5 text-[10px] sm:text-[11px] ${
                          delta > 0
                            ? "text-[#1a7f37]"
                            : delta < 0
                              ? "text-[#d03b3b]"
                              : "text-[var(--text-tertiary)]"
                        }`}
                      >
                        {delta > 0 ? "↑" : delta < 0 ? "↓" : "–"}
                        {Math.abs(delta).toFixed(casas).replace(".", ",")}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <p className="sm:hidden text-[10px] text-[var(--text-tertiary)] text-center py-1">
        Deslize a tabela para ver mais colunas →
      </p>
      <p className="mt-2 text-[11px] text-[var(--text-tertiary)]">
        Valores de {EDICAO_ATUAL}; a seta indica a variação em relação a{" "}
        {EDICAO_ANTERIOR}.
        {temNd && (
          <>
            {" "}ND — Nota Não Divulgada: o município não atingiu a taxa mínima
            de participação de 80% dos estudantes no SAEB.
          </>
        )}
      </p>
    </div>
  );
}

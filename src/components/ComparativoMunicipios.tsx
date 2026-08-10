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
} from "recharts";
import { IdebRecord, IdebValue } from "@/types/ideb";
import {
  EDICAO_ATUAL,
  EDICAO_ANTERIOR,
  SERIES_COLORS,
} from "@/lib/constants";

const ANO_INICIAL_GRAFICO = 2019;

type FieldKey =
  | "ideb"
  | "nota_padronizada"
  | "proficiencia_mat"
  | "proficiencia_lp"
  | "indicador_rendimento";

const INDICADORES: { field: FieldKey; label: string; curto: string; domain: [number, number]; casas: number }[] = [
  { field: "ideb", label: "Ideb", curto: "Ideb", domain: [2, 8], casas: 1 },
  { field: "nota_padronizada", label: "Nota Padronizada", curto: "Nota Pad.", domain: [2, 8], casas: 1 },
  { field: "proficiencia_mat", label: "Proficiência Matemática", curto: "Prof. MAT", domain: [100, 500], casas: 0 },
  { field: "proficiencia_lp", label: "Proficiência Língua Portuguesa", curto: "Prof. LP", domain: [100, 500], casas: 0 },
  { field: "indicador_rendimento", label: "Indicador de Rendimento", curto: "Ind. Rend.", domain: [0.8, 1.0], casas: 2 },
];

function fmt(v: IdebValue, casas = 2): string {
  if (v === null) return "\u2014";
  if (v === "ND") return "ND";
  return v.toFixed(casas).replace(".", ",");
}

function num(v: IdebValue): number | null {
  return typeof v === "number" ? v : null;
}

interface ComparativoProps {
  data: IdebRecord[];
  municipios: string[];
  rede: string | null;
  etapa: string | null;
}

export function ComparativoMunicipios({
  data,
  municipios,
  rede,
  etapa,
}: ComparativoProps) {
  // A cor acompanha a ordem de seleção, iguais às etiquetas do filtro
  const corDe = (municipio: string) =>
    SERIES_COLORS[municipios.indexOf(municipio) % SERIES_COLORS.length];

  const registros = useMemo(
    () =>
      data.filter(
        (r) =>
          municipios.includes(r.municipio) &&
          (!rede || r.rede === rede) &&
          (!etapa || r.etapa === etapa)
      ),
    [data, municipios, rede, etapa]
  );

  const anos = useMemo(
    () =>
      [...new Set(registros.map((r) => r.ano))]
        .filter((a) => a >= ANO_INICIAL_GRAFICO)
        .sort(),
    [registros]
  );

  const dadosGrafico = (field: FieldKey) =>
    anos.map((ano) => {
      const linha: Record<string, string | number | null> = { ano: String(ano) };
      for (const m of municipios) {
        const reg = registros.find((r) => r.municipio === m && r.ano === ano);
        linha[m] = reg ? num(reg[field]) : null;
      }
      return linha;
    });

  const valorDe = (municipio: string, field: FieldKey, ano: number): IdebValue => {
    const reg = registros.find((r) => r.municipio === municipio && r.ano === ano);
    return reg ? reg[field] : null;
  };

  // Comparar só faz sentido sobre a mesma base
  if (!rede || !etapa) {
    return (
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
        <p className="text-sm text-gray-600">
          Selecione <strong>Rede</strong> e <strong>Etapa</strong> para comparar
          os municípios.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          A comparação precisa da mesma base para ser justa.
        </p>
      </section>
    );
  }

  if (registros.length === 0) return null;

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-700">
          Comparativo entre municípios
        </h3>
        <p className="text-xs text-gray-500">
          {rede} &mdash; {etapa}
        </p>
      </div>

      <TabelaComparativa
        municipios={municipios}
        valorDe={valorDe}
        corDe={corDe}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {INDICADORES.map((ind) => (
          <div key={ind.field} className="border border-gray-200 rounded-xl p-3">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-3">
              {ind.label}
            </h4>
            <ResponsiveContainer width="100%" height={210}>
              <LineChart
                data={dadosGrafico(ind.field)}
                margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e1e0d9" />
                <XAxis dataKey="ano" tick={{ fontSize: 11, fill: "#898781" }} />
                <YAxis
                  domain={ind.domain}
                  tick={{ fontSize: 11, fill: "#898781" }}
                  tickFormatter={(v: number) => v.toFixed(ind.casas)}
                  width={44}
                />
                <Tooltip
                  formatter={(value, name) => [
                    fmt(value as number, ind.casas === 0 ? 1 : 2),
                    name as string,
                  ]}
                  labelFormatter={(l) => `Ano: ${l}`}
                  contentStyle={{ fontSize: 12 }}
                />
                {municipios.map((m) => (
                  <Line
                    key={m}
                    type="monotone"
                    dataKey={m}
                    name={m}
                    stroke={corDe(m)}
                    strokeWidth={2}
                    dot={{ r: 2.6, fill: corDe(m), strokeWidth: 0 }}
                    activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </section>
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
      <div className="overflow-x-auto">
      <table className="min-w-full text-xs sm:text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-2 sm:px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">
              Município
            </th>
            {INDICADORES.map((i) => (
              <th
                key={i.field}
                className="px-2 sm:px-3 py-2 text-right font-medium text-gray-600 whitespace-nowrap"
              >
                {i.curto}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {municipios.map((m) => (
            <tr key={m} className="hover:bg-gray-50 transition-colors">
              <td className="px-2 sm:px-3 py-2 whitespace-nowrap">
                <span className="inline-flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: corDe(m) }}
                  />
                  <span className="font-medium text-gray-800">{m}</span>
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
                    className="px-2 sm:px-3 py-2 text-right whitespace-nowrap tabular-nums"
                  >
                    <span
                      className={
                        v25 === "ND"
                          ? "text-gray-400"
                          : "font-semibold text-gray-900"
                      }
                    >
                      {fmt(v25, casas)}
                    </span>
                    {delta !== null && (
                      <span
                        className={`ml-1.5 text-[10px] sm:text-xs ${
                          delta > 0
                            ? "text-[#006300]"
                            : delta < 0
                              ? "text-[#d03b3b]"
                              : "text-gray-400"
                        }`}
                      >
                        {delta > 0 ? "▲" : delta < 0 ? "▼" : "—"}
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
      <p className="sm:hidden text-[10px] text-gray-400 text-center py-1">
        Deslize a tabela para ver mais colunas →
      </p>
      <p className="mt-2 text-[11px] sm:text-xs text-gray-500 italic">
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

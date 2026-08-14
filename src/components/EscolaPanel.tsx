"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { EscolaRecord, IdebValue } from "@/types/ideb";
import { EDICAO_ATUAL, EDICAO_ANTERIOR } from "@/lib/constants";
import { useIsMobile } from "@/hooks/useIsMobile";

interface EscolaPanelProps {
  escolas: EscolaRecord[];
  escolasUnicas: { codigo: string; nome: string; rede: string; etapas: string[] }[];
  isLoading: boolean;
  municipio: string;
}

type FieldKey =
  | "ideb"
  | "nota_padronizada"
  | "proficiencia_mat"
  | "proficiencia_lp"
  | "indicador_rendimento";

const INDICADORES: { field: FieldKey; label: string; casas: number; color: string }[] = [
  { field: "ideb", label: "Ideb", casas: 1, color: "#007aff" },
  { field: "nota_padronizada", label: "Nota Padronizada", casas: 1, color: "#5856d6" },
  { field: "proficiencia_mat", label: "Prof. Matemática", casas: 0, color: "#30b0c7" },
  { field: "proficiencia_lp", label: "Prof. Língua Portuguesa", casas: 0, color: "#af52de" },
  { field: "indicador_rendimento", label: "Ind. Rendimento", casas: 2, color: "#ff9500" },
];

function LineLabel({
  x,
  y,
  value,
  color,
  casas,
}: {
  x?: number;
  y?: number;
  value?: number | null;
  color: string;
  casas: number;
}) {
  if (value === null || value === undefined || x === undefined || y === undefined) return null;
  const label = value.toFixed(casas).replace(".", ",");
  const ty = y - 10;
  const charW = 6;
  const padX = 3;
  const padY = 2;
  const w = label.length * charW + padX * 2;
  const h = 12 + padY * 2;
  return (
    <g>
      <rect x={x - w / 2} y={ty - 10 - padY} width={w} height={h} rx={3} fill="white" fillOpacity={0.92} />
      <text x={x} y={ty} textAnchor="middle" fontSize={10} fontWeight={500} fill={color}>
        {label}
      </text>
    </g>
  );
}

function fmt(v: IdebValue, casas = 2): string {
  if (v === null) return "—";
  if (v === "ND") return "ND";
  return v.toFixed(casas).replace(".", ",");
}

export function EscolaPanel({
  escolas,
  escolasUnicas,
  isLoading,
  municipio,
}: EscolaPanelProps) {
  const [escolaSel, setEscolaSel] = useState<string | null>(null);
  const [busca, setBusca] = useState("");
  const [etapaFiltro, setEtapaFiltro] = useState<string | null>(null);

  const etapasDisponiveis = useMemo(
    () => [...new Set(escolas.map((e) => e.etapa))].sort(),
    [escolas]
  );

  const listaFiltrada = escolasUnicas.filter((e) => {
    if (busca && !e.nome.toLowerCase().includes(busca.toLowerCase())) return false;
    if (etapaFiltro && !e.etapas.includes(etapaFiltro)) return false;
    return true;
  });

  const registros = useMemo(
    () => (escolaSel ? escolas.filter((e) => e.codigo_escola === escolaSel) : []),
    [escolas, escolaSel]
  );

  const escolaInfo = escolaSel
    ? escolasUnicas.find((e) => e.codigo === escolaSel)
    : null;

  if (isLoading) {
    return (
      <section className="bg-white rounded-2xl p-6 text-center" style={{ boxShadow: "var(--card-shadow)" }}>
        <div className="inline-block w-5 h-5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        <p className="text-[13px] text-[var(--text-secondary)] mt-2">Carregando escolas...</p>
      </section>
    );
  }

  if (escolasUnicas.length === 0) return null;

  return (
    <section className="bg-white rounded-2xl p-4 sm:p-6 space-y-4" style={{ boxShadow: "var(--card-shadow)" }}>
      <div>
        <h3 className="text-[15px] font-semibold text-[var(--foreground)]">
          Escolas — {municipio}
        </h3>
        <p className="text-[12px] text-[var(--text-tertiary)] mt-0.5">
          {etapaFiltro
            ? `${listaFiltrada.length} de ${escolasUnicas.length} escolas — ${etapaFiltro}`
            : `${escolasUnicas.length} escolas com dados disponíveis`}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start">
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar escola..."
            className="w-full rounded-xl bg-[#f0f0f0] px-4 py-2.5 text-[13px] text-[var(--foreground)] placeholder:text-[var(--text-tertiary)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 transition-all duration-200"
          />
        </div>
        {etapasDisponiveis.length > 1 && (
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setEtapaFiltro(null)}
              className={`rounded-full px-3 py-2 text-[12px] font-medium transition-all duration-200 ${
                etapaFiltro === null
                  ? "bg-[var(--accent)] text-white shadow-sm"
                  : "bg-[#f0f0f0] text-[var(--text-secondary)] hover:bg-[#e5e5e5]"
              }`}
            >
              Todas
            </button>
            {etapasDisponiveis.map((et) => (
              <button
                key={et}
                type="button"
                onClick={() => setEtapaFiltro(etapaFiltro === et ? null : et)}
                className={`rounded-full px-3 py-2 text-[12px] font-medium transition-all duration-200 ${
                  etapaFiltro === et
                    ? "bg-[var(--accent)] text-white shadow-sm"
                    : "bg-[#f0f0f0] text-[var(--text-secondary)] hover:bg-[#e5e5e5]"
                }`}
              >
                {et}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="max-h-52 overflow-y-auto rounded-xl border border-[var(--separator)]">
        <table className="min-w-full text-[12px] sm:text-[13px]">
          <thead className="sticky top-0 bg-white">
            <tr className="border-b border-[var(--separator)]">
              <th className="px-3 py-2 text-left font-medium text-[var(--text-tertiary)]">Escola</th>
              <th className="px-3 py-2 text-left font-medium text-[var(--text-tertiary)]">Etapa</th>
              <th className="px-3 py-2 text-left font-medium text-[var(--text-tertiary)]">Rede</th>
              <th className="px-3 py-2 text-right font-medium text-[var(--text-tertiary)]">Ideb {EDICAO_ATUAL}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--separator)]">
            {listaFiltrada.map((e) => {
              const etapaExibida = etapaFiltro ?? e.etapas[0];
              const rec2025 = escolas.find(
                (r) =>
                  r.codigo_escola === e.codigo &&
                  r.ano === EDICAO_ATUAL &&
                  r.etapa === etapaExibida
              );
              const ativo = escolaSel === e.codigo;
              const SIGLA: Record<string, string> = {
                "Anos Iniciais": "AI",
                "Anos Finais": "AF",
                "Ensino Médio": "EM",
              };
              return (
                <tr
                  key={e.codigo}
                  onClick={() => setEscolaSel(ativo ? null : e.codigo)}
                  className={`cursor-pointer transition-colors ${
                    ativo
                      ? "bg-[var(--accent-light)]"
                      : "hover:bg-[#fafafa]"
                  }`}
                >
                  <td className="px-3 py-2 font-medium text-[var(--foreground)]">
                    {e.nome}
                  </td>
                  <td className="px-3 py-2 text-[var(--text-secondary)]">
                    <span className="inline-flex gap-1">
                      {e.etapas.map((et) => (
                        <span
                          key={et}
                          className="inline-block rounded-md bg-[#f0f0f0] px-1.5 py-0.5 text-[10px] font-medium text-[var(--text-secondary)]"
                        >
                          {SIGLA[et] ?? et}
                        </span>
                      ))}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-[var(--text-secondary)]">
                    {e.rede}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums font-semibold text-[var(--foreground)]">
                    {rec2025 ? fmt(rec2025.ideb, 1) : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {escolaSel && escolaInfo && (
        <EscolaDetalhe
          registros={registros}
          escola={escolaInfo.nome}
          rede={escolaInfo.rede}
        />
      )}
    </section>
  );
}

function EscolaDetalhe({
  registros,
  escola,
  rede,
}: {
  registros: EscolaRecord[];
  escola: string;
  rede: string;
}) {
  const mobile = useIsMobile();

  const etapas = [...new Set(registros.map((r) => r.etapa))].sort();

  return (
    <div className="space-y-4 pt-2 border-t border-[var(--separator)]">
      <div>
        <h4 className="text-[14px] font-semibold text-[var(--foreground)]">{escola}</h4>
        <p className="text-[12px] text-[var(--text-tertiary)]">{rede}</p>
      </div>

      {etapas.map((etapa) => {
        const recsEtapa = registros.filter((r) => r.etapa === etapa);
        return (
          <div key={etapa} className="space-y-3">
            {etapas.length > 1 && (
              <h5 className="text-[13px] font-semibold text-[var(--foreground)] border-l-[3px] border-[var(--accent)] pl-2">
                {etapa}
              </h5>
            )}

            <CardResumo registros={recsEtapa} />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {INDICADORES.map((ind) => {
                const anos = [...new Set(recsEtapa.map((r) => r.ano))]
                  .filter((a) => a >= 2017)
                  .sort();
                const chartData = anos.map((ano) => {
                  const r = recsEtapa.find((x) => x.ano === ano);
                  const val = r ? r[ind.field] : null;
                  return {
                    ano: String(ano),
                    valor: typeof val === "number" ? val : null,
                  };
                });
                if (chartData.every((d) => d.valor === null)) return null;
                return (
                  <div
                    key={ind.field}
                    className="rounded-2xl bg-[#fafafa] p-4"
                  >
                    <h4 className="text-[13px] font-semibold text-[var(--foreground)] mb-3">
                      {ind.label}
                    </h4>
                    <ResponsiveContainer width="100%" height={180}>
                      <LineChart
                        data={chartData}
                        margin={{ top: 20, right: 8, left: -12, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="var(--separator)"
                        />
                        <XAxis
                          dataKey="ano"
                          tick={{ fontSize: 11, fill: "#aeaeb2" }}
                          axisLine={{ stroke: "var(--separator)" }}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: "#aeaeb2" }}
                          tickFormatter={(v: number) =>
                            v.toFixed(ind.casas).replace(".", ",")
                          }
                          width={44}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          formatter={(value) => [
                            fmt(value as number, ind.casas === 0 ? 1 : 2),
                            ind.label,
                          ]}
                          labelFormatter={(l) => `Ano: ${l}`}
                          contentStyle={{
                            fontSize: 12,
                            borderRadius: 12,
                            border: "none",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="valor"
                          stroke={ind.color}
                          strokeWidth={mobile ? 1.25 : 2}
                          dot={{
                            r: mobile ? 2 : 3,
                            fill: ind.color,
                            strokeWidth: 0,
                          }}
                          activeDot={{
                            r: mobile ? 4 : 5,
                            strokeWidth: 2,
                            stroke: "#fff",
                          }}
                          connectNulls
                          label={<LineLabel color={ind.color} casas={ind.casas} />}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CardResumo({ registros }: { registros: EscolaRecord[] }) {
  const v = (field: FieldKey, ano: number): IdebValue => {
    const r = registros.find((x) => x.ano === ano);
    return r ? r[field] : null;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
      {INDICADORES.map((ind) => {
        const atual = v(ind.field, EDICAO_ATUAL);
        const anterior = v(ind.field, EDICAO_ANTERIOR);
        const delta =
          typeof atual === "number" && typeof anterior === "number"
            ? Math.round((atual - anterior) * 100) / 100
            : null;
        return (
          <div
            key={ind.field}
            className="rounded-xl bg-[#fafafa] p-3 flex flex-col gap-1"
          >
            <span className="text-[10px] font-medium text-[var(--text-secondary)]">
              {ind.label}
            </span>
            <div className="flex items-end gap-1.5">
              <span className="text-lg font-semibold text-[var(--foreground)] tabular-nums">
                {fmt(atual, ind.casas)}
              </span>
              {delta !== null && (
                <span
                  className={`text-[10px] font-medium ${
                    delta > 0
                      ? "text-[#1a7f37]"
                      : delta < 0
                        ? "text-[#d03b3b]"
                        : "text-[var(--text-tertiary)]"
                  }`}
                >
                  {delta > 0 ? "↑" : delta < 0 ? "↓" : "–"}
                  {Math.abs(delta).toFixed(ind.casas).replace(".", ",")}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

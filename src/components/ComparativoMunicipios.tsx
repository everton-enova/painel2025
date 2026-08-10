"use client";

import { useState, useMemo, useRef, useEffect } from "react";
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
import { EDICOES_VIGENTES, EDICAO_ATUAL, EDICAO_ANTERIOR } from "@/lib/constants";

// Paleta categórica validada (CVD-safe em pares adjacentes). A cor segue o
// município escolhido, nunca sua posição no ranking.
const SERIES_COLORS = [
  "#2a78d6",
  "#eb6834",
  "#1baf7a",
  "#eda100",
  "#e87ba4",
];

const MAX_MUNICIPIOS = SERIES_COLORS.length;
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
  if (v === null) return "—";
  if (v === "ND") return "ND";
  return v.toFixed(casas).replace(".", ",");
}

function num(v: IdebValue): number | null {
  return typeof v === "number" ? v : null;
}

interface ComparativoProps {
  data: IdebRecord[];
}

export function ComparativoMunicipios({ data }: ComparativoProps) {
  const [aberto, setAberto] = useState(false);
  const [nte, setNte] = useState<string>("");
  const [rede, setRede] = useState<string>("");
  const [etapa, setEtapa] = useState<string>("");
  const [selecionados, setSelecionados] = useState<string[]>([]);

  const vigentes = useMemo(
    () => data.filter((r) => EDICOES_VIGENTES.includes(r.ano)),
    [data]
  );

  const ntes = useMemo(
    () =>
      [...new Set(vigentes.map((r) => r.nte).filter(Boolean))].sort(
        (a, b) =>
          (parseInt(a.replace(/\D/g, ""), 10) || 0) -
          (parseInt(b.replace(/\D/g, ""), 10) || 0)
      ),
    [vigentes]
  );

  const redes = useMemo(
    () => [...new Set(vigentes.map((r) => r.rede))].sort((a, b) => a.localeCompare(b, "pt-BR")),
    [vigentes]
  );

  const etapas = useMemo(() => {
    const base = rede ? vigentes.filter((r) => r.rede === rede) : vigentes;
    return [...new Set(base.map((r) => r.etapa))].sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [vigentes, rede]);

  // Par rede/etapa inicial: o de maior cobertura (hoje Municipal + Anos
  // Iniciais, com 417 municípios). Começar por um recorte de poucos
  // municípios deixaria a busca quase vazia na primeira abertura.
  const parPadrao = useMemo(() => {
    const cont = new Map<string, Set<string>>();
    for (const r of vigentes) {
      const k = `${r.rede}|${r.etapa}`;
      if (!cont.has(k)) cont.set(k, new Set());
      cont.get(k)!.add(r.municipio);
    }
    let melhor = "";
    let max = -1;
    for (const [k, muns] of cont) {
      if (muns.size > max) { max = muns.size; melhor = k; }
    }
    return melhor ? melhor.split("|") : null;
  }, [vigentes]);

  useEffect(() => {
    if (!rede && parPadrao) {
      setRede(parPadrao[0]);
      setEtapa(parPadrao[1]);
    }
  }, [parPadrao, rede]);

  // Se a etapa deixar de existir para a rede escolhida, cai na primeira válida
  useEffect(() => {
    if (rede && etapas.length > 0 && !etapas.includes(etapa)) {
      setEtapa(etapas[0]);
    }
  }, [etapas, etapa, rede]);

  // Só municípios que de fato têm esse par rede/etapa (e o NTE, se filtrado)
  const municipiosDisponiveis = useMemo(() => {
    if (!rede || !etapa) return [];
    return [...new Set(
      vigentes
        .filter(
          (r) =>
            r.rede === rede &&
            r.etapa === etapa &&
            (!nte || r.nte === nte)
        )
        .map((r) => r.municipio)
    )].sort((a, b) => a.localeCompare(b, "pt-BR", { sensitivity: "base" }));
  }, [vigentes, rede, etapa, nte]);

  // Descarta seleções que não existem no par atual
  useEffect(() => {
    setSelecionados((prev) => {
      const validos = prev.filter((m) => municipiosDisponiveis.includes(m));
      return validos.length === prev.length ? prev : validos;
    });
  }, [municipiosDisponiveis]);

  const registros = useMemo(
    () => data.filter((r) => r.rede === rede && r.etapa === etapa),
    [data, rede, etapa]
  );

  const anos = useMemo(
    () =>
      [...new Set(registros.map((r) => r.ano))]
        .filter((a) => a >= ANO_INICIAL_GRAFICO)
        .sort(),
    [registros]
  );

  const corDe = (municipio: string) =>
    SERIES_COLORS[selecionados.indexOf(municipio) % SERIES_COLORS.length];

  const toggle = (municipio: string) => {
    setSelecionados((prev) =>
      prev.includes(municipio)
        ? prev.filter((m) => m !== municipio)
        : prev.length >= MAX_MUNICIPIOS
          ? prev
          : [...prev, municipio]
    );
  };

  const dadosGrafico = (field: FieldKey) =>
    anos.map((ano) => {
      const linha: Record<string, string | number | null> = { ano: String(ano) };
      for (const m of selecionados) {
        const reg = registros.find((r) => r.municipio === m && r.ano === ano);
        linha[m] = reg ? num(reg[field]) : null;
      }
      return linha;
    });

  const valorDe = (municipio: string, field: FieldKey, ano: number): IdebValue => {
    const reg = registros.find((r) => r.municipio === municipio && r.ano === ano);
    return reg ? reg[field] : null;
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <button
        onClick={() => setAberto((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <span>
          <span className="text-sm font-semibold text-gray-700">
            Comparativo entre municípios
          </span>
          <span className="block text-xs text-gray-500">
            Selecione até {MAX_MUNICIPIOS} municípios da mesma rede e etapa
          </span>
        </span>
        <span className="text-gray-400 text-sm">{aberto ? "▲" : "▼"}</span>
      </button>

      {aberto && (
        <div className="p-3 sm:p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-wrap">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                NTE
              </span>
              <select
                value={nte}
                onChange={(e) => setNte(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                {ntes.map((x) => (
                  <option key={x} value={x}>{x}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rede
              </span>
              <select
                value={rede}
                onChange={(e) => setRede(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {redes.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Etapa
              </span>
              <select
                value={etapa}
                onChange={(e) => setEtapa(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {etapas.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </label>
            <SeletorMunicipios
              disponiveis={municipiosDisponiveis}
              selecionados={selecionados}
              onToggle={toggle}
              max={MAX_MUNICIPIOS}
            />
          </div>

          {selecionados.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selecionados.map((m) => (
                <span
                  key={m}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 pl-2 pr-1 py-1 text-xs font-medium text-gray-700"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: corDe(m) }}
                  />
                  {m}
                  <button
                    onClick={() => toggle(m)}
                    className="ml-0.5 w-4 h-4 rounded-full text-gray-400 hover:bg-gray-300 hover:text-gray-700 transition-colors"
                    aria-label={`Remover ${m}`}
                  >
                    ×
                  </button>
                </span>
              ))}
              <button
                onClick={() => setSelecionados([])}
                className="text-xs text-gray-500 hover:text-gray-700 underline px-1"
              >
                limpar
              </button>
            </div>
          )}

          {selecionados.length < 2 ? (
            <p className="text-sm text-gray-500 italic py-6 text-center">
              Selecione ao menos dois municípios para comparar.
            </p>
          ) : (
            <>
              <TabelaComparativa
                municipios={selecionados}
                valorDe={valorDe}
                corDe={corDe}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                {INDICADORES.map((ind) => (
                  <div
                    key={ind.field}
                    className="border border-gray-200 rounded-xl p-3"
                  >
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-3">
                      {ind.label}
                    </h4>
                    <ResponsiveContainer width="100%" height={210}>
                      <LineChart
                        data={dadosGrafico(ind.field)}
                        margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e1e0d9" />
                        <XAxis
                          dataKey="ano"
                          tick={{ fontSize: 11, fill: "#898781" }}
                        />
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
                        {selecionados.map((m) => (
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
            </>
          )}
        </div>
      )}
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

function SeletorMunicipios({
  disponiveis,
  selecionados,
  onToggle,
  max,
}: {
  disponiveis: string[];
  selecionados: string[];
  onToggle: (m: string) => void;
  max: number;
}) {
  const [busca, setBusca] = useState("");
  const [aberto, setAberto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setAberto(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const lista = busca
    ? disponiveis.filter((m) =>
        m.toLowerCase().includes(busca.toLowerCase())
      )
    : disponiveis;

  const cheio = selecionados.length >= max;

  return (
    <div className="flex flex-col gap-1 relative flex-1 sm:min-w-[240px]" ref={ref}>
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
        Municípios ({selecionados.length}/{max})
      </span>
      <input
        type="text"
        value={busca}
        onChange={(e) => {
          setBusca(e.target.value);
          setAberto(true);
        }}
        onFocus={() => setAberto(true)}
        placeholder="Buscar município..."
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      {aberto && lista.length > 0 && (
        <ul className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {lista.map((m) => {
            const ativo = selecionados.includes(m);
            const bloqueado = cheio && !ativo;
            return (
              <li key={m}>
                <button
                  type="button"
                  disabled={bloqueado}
                  onClick={() => onToggle(m)}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center gap-2 ${
                    bloqueado
                      ? "text-gray-300 cursor-not-allowed"
                      : ativo
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="w-4 shrink-0">{ativo ? "✓" : ""}</span>
                  {m}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { IdebRecord, IdebValue } from "@/types/ideb";
import { computeVariacao } from "@/lib/aggregations";
import { MAX_COMPARACAO } from "@/lib/constants";

interface RankingTableProps {
  data: IdebRecord[];
  onMunicipioClick?: (municipio: string) => void;
  selectedMunicipios?: string[];
}

type FieldKey = "ideb" | "nota_padronizada" | "proficiencia_mat" | "proficiencia_lp" | "indicador_rendimento";

const FIELDS: { key: FieldKey; label: string }[] = [
  { key: "ideb", label: "Ideb" },
  { key: "nota_padronizada", label: "Nota Padronizada" },
  { key: "proficiencia_mat", label: "Proficiência MAT" },
  { key: "proficiencia_lp", label: "Proficiência LP" },
  { key: "indicador_rendimento", label: "Ind. Rendimento" },
];

function formatDecimal(n: IdebValue): string {
  if (n === null) return "—";
  if (n === "ND") return "ND";
  return n.toFixed(2).replace(".", ",");
}

function formatVariacao(n: number | null): string {
  if (n === null) return "—";
  const sign = n >= 0 ? "+" : "";
  return sign + n.toFixed(2).replace(".", ",");
}

export function RankingTable({ data, onMunicipioClick, selectedMunicipios = [] }: RankingTableProps) {
  const [selectedField, setSelectedField] = useState<FieldKey>("ideb");

  const ranking = computeVariacao(data, selectedField);

  const hasNd = ranking.some(
    (r) => r.valor2023 === "ND" || r.valor2025 === "ND"
  );

  return (
    <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "var(--card-shadow)" }}>
      <div className="px-5 py-4 border-b border-[var(--separator)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-[15px] font-semibold text-[var(--foreground)]">
              Ranking por Variação (2023 → 2025)
            </h3>
            <p className="text-[12px] text-[var(--text-tertiary)] mt-0.5">
              Ordenado da maior para a menor variação
            </p>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {FIELDS.map((f) => (
              <button
                key={f.key}
                onClick={() => setSelectedField(f.key)}
                className={`px-3 py-1.5 text-[11px] sm:text-[12px] font-medium rounded-full transition-all duration-200 ${
                  selectedField === f.key
                    ? "bg-[var(--accent)] text-white shadow-sm"
                    : "bg-[#f0f0f0] text-[var(--text-secondary)] hover:bg-[#e5e5e5]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-[12px] sm:text-[13px]">
          <thead>
            <tr className="border-b border-[var(--separator)]">
              <th className="px-3 sm:px-4 py-2.5 text-left font-medium text-[var(--text-tertiary)] whitespace-nowrap w-10">#</th>
              <th className="px-3 sm:px-4 py-2.5 text-left font-medium text-[var(--text-tertiary)] whitespace-nowrap">NTE</th>
              <th className="px-3 sm:px-4 py-2.5 text-left font-medium text-[var(--text-tertiary)] whitespace-nowrap">Município</th>
              <th className="px-3 sm:px-4 py-2.5 text-left font-medium text-[var(--text-tertiary)] whitespace-nowrap">Rede</th>
              <th className="px-3 sm:px-4 py-2.5 text-left font-medium text-[var(--text-tertiary)] whitespace-nowrap">Etapa</th>
              <th className="px-3 sm:px-4 py-2.5 text-right font-medium text-[var(--text-tertiary)] whitespace-nowrap">2023</th>
              <th className="px-3 sm:px-4 py-2.5 text-right font-medium text-[var(--text-tertiary)] whitespace-nowrap">2025</th>
              <th className="px-3 sm:px-4 py-2.5 text-right font-medium text-[var(--text-tertiary)] whitespace-nowrap">Variação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--separator)]">
            {ranking.map((record, i) => {
              const varColor =
                record.variacao === null
                  ? "text-[var(--text-tertiary)]"
                  : record.variacao > 0
                    ? "text-[#1a7f37]"
                    : record.variacao < 0
                      ? "text-[#d03b3b]"
                      : "text-[var(--text-tertiary)]";

              return (
                <tr key={i} className="hover:bg-[#fafafa] transition-colors">
                  <td className="px-3 sm:px-4 py-2.5 text-[var(--text-tertiary)] font-medium tabular-nums">{i + 1}</td>
                  <td className="px-3 sm:px-4 py-2.5 whitespace-nowrap">{record.nte || "—"}</td>
                  <td
                    className={`px-3 sm:px-4 py-2.5 whitespace-nowrap font-medium ${
                      onMunicipioClick && record.municipio !== "Bahia" &&
                      !(selectedMunicipios.filter((m) => m !== "Bahia").length >= MAX_COMPARACAO && !selectedMunicipios.includes(record.municipio))
                        ? "cursor-pointer hover:text-[var(--accent)] transition-colors"
                        : ""
                    } ${selectedMunicipios.includes(record.municipio) ? "text-[var(--accent)]" : ""}`}
                    onClick={
                      onMunicipioClick && record.municipio !== "Bahia" &&
                      !(selectedMunicipios.filter((m) => m !== "Bahia").length >= MAX_COMPARACAO && !selectedMunicipios.includes(record.municipio))
                        ? () => onMunicipioClick(record.municipio)
                        : undefined
                    }
                  >
                    {record.municipio}
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 whitespace-nowrap">{record.rede}</td>
                  <td className="px-3 sm:px-4 py-2.5 whitespace-nowrap">{record.etapa}</td>
                  <td className="px-3 sm:px-4 py-2.5 text-right whitespace-nowrap tabular-nums">{formatDecimal(record.valor2023)}</td>
                  <td className="px-3 sm:px-4 py-2.5 text-right whitespace-nowrap tabular-nums">{formatDecimal(record.valor2025)}</td>
                  <td className={`px-3 sm:px-4 py-2.5 text-right whitespace-nowrap font-medium tabular-nums ${varColor}`}>
                    {formatVariacao(record.variacao)}
                  </td>
                </tr>
              );
            })}
            {ranking.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-[13px] text-[var(--text-tertiary)]">
                  Sem dados para calcular variação
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="sm:hidden text-[10px] text-[var(--text-tertiary)] text-center py-2">
        Deslize para ver mais colunas →
      </p>
      {hasNd && (
        <p className="px-5 py-3 border-t border-[var(--separator)] text-[11px] text-[var(--text-tertiary)]">
          ND — Nota Não Divulgada: o município não atingiu a taxa mínima de
          participação de 80% dos estudantes no SAEB.
        </p>
      )}
    </div>
  );
}

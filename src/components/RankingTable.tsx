"use client";

import { useState } from "react";
import { IdebRecord } from "@/types/ideb";
import { computeVariacao } from "@/lib/aggregations";

interface RankingTableProps {
  data: IdebRecord[];
}

type FieldKey = "ideb" | "nota_padronizada" | "proficiencia_mat" | "proficiencia_lp" | "indicador_rendimento";

const FIELDS: { key: FieldKey; label: string }[] = [
  { key: "ideb", label: "IDEB" },
  { key: "nota_padronizada", label: "Nota Padronizada" },
  { key: "proficiencia_mat", label: "Proficiência MAT" },
  { key: "proficiencia_lp", label: "Proficiência LP" },
  { key: "indicador_rendimento", label: "Ind. Rendimento" },
];

function formatDecimal(n: number | null): string {
  if (n === null) return "—";
  return n.toFixed(2).replace(".", ",");
}

function formatVariacao(n: number | null): string {
  if (n === null) return "—";
  const sign = n >= 0 ? "+" : "";
  return sign + n.toFixed(2).replace(".", ",");
}

export function RankingTable({ data }: RankingTableProps) {
  const [selectedField, setSelectedField] = useState<FieldKey>("ideb");

  const ranking = computeVariacao(data, selectedField);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-gray-700">
              Ranking por Variação (2023 → 2025)
            </h3>
            <p className="text-xs text-gray-500">
              Ordenado da maior para a menor variação
            </p>
          </div>
          <div className="flex gap-1 flex-wrap">
            {FIELDS.map((f) => (
              <button
                key={f.key}
                onClick={() => setSelectedField(f.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  selectedField === f.key
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap w-10">#</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">NTE</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">Município</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">Rede</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">Etapa</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600 whitespace-nowrap">2023</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600 whitespace-nowrap">2025</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600 whitespace-nowrap">Variação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {ranking.map((record, i) => {
              const varColor =
                record.variacao === null
                  ? "text-gray-400"
                  : record.variacao > 0
                    ? "text-green-600"
                    : record.variacao < 0
                      ? "text-red-600"
                      : "text-gray-500";

              return (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2.5 text-gray-400 font-medium">{i + 1}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{record.nte || "—"}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{record.municipio}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{record.rede}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{record.etapa}</td>
                  <td className="px-4 py-2.5 text-right whitespace-nowrap">{formatDecimal(record.valor2023)}</td>
                  <td className="px-4 py-2.5 text-right whitespace-nowrap">{formatDecimal(record.valor2025)}</td>
                  <td className={`px-4 py-2.5 text-right whitespace-nowrap font-medium ${varColor}`}>
                    {formatVariacao(record.variacao)}
                  </td>
                </tr>
              );
            })}
            {ranking.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-400">
                  Sem dados para calcular variação
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

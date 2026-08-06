"use client";

import { useState } from "react";
import { IdebRecord, IdebValue } from "@/types/ideb";

interface DataTableProps {
  data: IdebRecord[];
  ano: number;
  title: string;
}

type SortKey = keyof IdebRecord;
type SortDir = "asc" | "desc";

function formatDecimal(n: IdebValue): string {
  if (n === null) return "—";
  if (n === "ND") return "ND";
  return n.toFixed(2).replace(".", ",");
}

export function DataTable({ data, ano, title }: DataTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("municipio");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const filtered = data.filter((r) => r.ano === ano);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = [...filtered].sort((a, b) => {
    // ND (não divulgado) ordena junto com ausente, sempre ao final
    const norm = (v: IdebRecord[SortKey]) => (v === "ND" ? null : v);
    const va = norm(a[sortKey]);
    const vb = norm(b[sortKey]);
    if (va === null && vb === null) return 0;
    if (va === null) return 1;
    if (vb === null) return -1;
    if (typeof va === "number" && typeof vb === "number") {
      return sortDir === "asc" ? va - vb : vb - va;
    }
    const sa = String(va);
    const sb = String(vb);
    return sortDir === "asc"
      ? sa.localeCompare(sb, "pt-BR")
      : sb.localeCompare(sa, "pt-BR");
  });

  const hasNd = filtered.some(
    (r) =>
      r.ideb === "ND" ||
      r.nota_padronizada === "ND" ||
      r.proficiencia_mat === "ND" ||
      r.proficiencia_lp === "ND" ||
      r.indicador_rendimento === "ND"
  );

  const columns: { key: SortKey; label: string; format?: (r: IdebRecord) => string }[] = [
    { key: "nte", label: "NTE" },
    { key: "municipio", label: "Município" },
    { key: "rede", label: "Rede" },
    { key: "etapa", label: "Etapa" },
    { key: "ideb", label: "Ideb", format: (r) => formatDecimal(r.ideb) },
    { key: "nota_padronizada", label: "Nota Pad.", format: (r) => formatDecimal(r.nota_padronizada) },
    { key: "proficiencia_mat", label: "Prof. MAT", format: (r) => formatDecimal(r.proficiencia_mat) },
    { key: "proficiencia_lp", label: "Prof. LP", format: (r) => formatDecimal(r.proficiencia_lp) },
    { key: "indicador_rendimento", label: "Ind. Rend.", format: (r) => formatDecimal(r.indicador_rendimento) },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-3 sm:px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        <p className="text-xs text-gray-500">{sorted.length} registros</p>
      </div>
      <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
        <table className="min-w-full text-xs sm:text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium text-gray-600 cursor-pointer hover:text-gray-900 select-none whitespace-nowrap"
                >
                  {col.label}
                  {sortKey === col.key && (
                    <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.map((record, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-2 sm:px-4 py-2 sm:py-2.5 whitespace-nowrap">
                    {col.format ? col.format(record) : String(record[col.key] ?? "—")}
                  </td>
                ))}
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-gray-400">
                  Sem dados para {ano}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="sm:hidden text-[10px] text-gray-400 text-center py-2">
        Deslize para ver mais colunas →
      </p>
      {hasNd && (
        <p className="px-3 sm:px-4 py-2 border-t border-gray-100 text-[11px] sm:text-xs text-gray-500 italic">
          ND — Nota Não Divulgada: o município não atingiu a taxa mínima de
          participação de 80% dos estudantes no SAEB.
        </p>
      )}
    </div>
  );
}

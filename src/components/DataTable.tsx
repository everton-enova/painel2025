"use client";

import { useState } from "react";
import { IdebRecord } from "@/types/ideb";

interface DataTableProps {
  data: IdebRecord[];
}

type SortKey = keyof IdebRecord;
type SortDir = "asc" | "desc";

function formatDecimal(n: number | null): string {
  if (n === null) return "—";
  return n.toFixed(2).replace(".", ",");
}

const STATUS_STYLES: Record<string, string> = {
  Atingiu: "bg-green-100 text-green-800",
  "Não atingiu": "bg-red-100 text-red-800",
  "Sem informação": "bg-gray-100 text-gray-600",
};

export function DataTable({ data }: DataTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("ano");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = [...data].sort((a, b) => {
    const va = a[sortKey];
    const vb = b[sortKey];
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

  const columns: { key: SortKey; label: string; format?: (r: IdebRecord) => string }[] = [
    { key: "ano", label: "Ano" },
    { key: "nte", label: "NTE" },
    { key: "municipio", label: "Município" },
    { key: "rede", label: "Rede" },
    { key: "etapa", label: "Etapa" },
    { key: "ideb_observado", label: "IDEB", format: (r) => formatDecimal(r.ideb_observado) },
    { key: "meta_ideb", label: "Meta", format: (r) => formatDecimal(r.meta_ideb) },
    { key: "aprendizado", label: "Aprendizado", format: (r) => formatDecimal(r.aprendizado) },
    { key: "fluxo", label: "Fluxo", format: (r) => formatDecimal(r.fluxo) },
    { key: "status_meta", label: "Status" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-4 py-3 text-left font-medium text-gray-600 cursor-pointer hover:text-gray-900 select-none whitespace-nowrap"
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
                  <td key={col.key} className="px-4 py-2.5 whitespace-nowrap">
                    {col.key === "status_meta" ? (
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[record.status_meta]}`}
                      >
                        {record.status_meta}
                      </span>
                    ) : col.format ? (
                      col.format(record)
                    ) : (
                      String(record[col.key] ?? "—")
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

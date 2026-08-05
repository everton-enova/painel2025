"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { IdebRecord } from "@/types/ideb";

interface ChartComparativoProps {
  data: IdebRecord[];
}

export function ChartComparativo({ data }: ChartComparativoProps) {
  const withValues = data.filter(
    (r) => r.ideb_observado !== null && r.meta_ideb !== null
  );

  const municipios = [...new Set(withValues.map((r) => r.municipio))].sort();

  const chartData = municipios.map((mun) => {
    const records = withValues.filter((r) => r.municipio === mun);
    const avgIdeb =
      records.reduce((s, r) => s + r.ideb_observado!, 0) / records.length;
    const avgMeta =
      records.reduce((s, r) => s + r.meta_ideb!, 0) / records.length;
    return {
      municipio: mun.length > 15 ? mun.slice(0, 13) + "…" : mun,
      "IDEB Observado": Math.round(avgIdeb * 100) / 100,
      "Meta IDEB": Math.round(avgMeta * 100) / 100,
      atingiu: avgIdeb >= avgMeta,
    };
  });

  if (chartData.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        IDEB Observado vs Meta por Município
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="municipio"
            tick={{ fontSize: 11 }}
            angle={-20}
            textAnchor="end"
            height={60}
          />
          <YAxis
            domain={[0, "auto"]}
            tick={{ fontSize: 12 }}
            tickFormatter={(v: number) => v.toFixed(1)}
          />
          <Tooltip
            formatter={(value) => Number(value).toFixed(2).replace(".", ",")}
          />
          <Legend />
          <Bar dataKey="IDEB Observado" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.atingiu ? "#22c55e" : "#ef4444"}
              />
            ))}
          </Bar>
          <Bar
            dataKey="Meta IDEB"
            fill="#f59e0b"
            radius={[4, 4, 0, 0]}
            opacity={0.7}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

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
} from "recharts";
import { IdebRecord } from "@/types/ideb";

interface ChartComparativoProps {
  data: IdebRecord[];
}

export function ChartComparativo({ data }: ChartComparativoProps) {
  const data2023 = data.filter(
    (r) => r.ano === 2023 && typeof r.ideb === "number"
  );
  const data2025 = data.filter(
    (r) => r.ano === 2025 && typeof r.ideb === "number"
  );

  const municipios = [...new Set([
    ...data2023.map((r) => r.municipio),
    ...data2025.map((r) => r.municipio),
  ])].sort();

  const chartData = municipios.map((mun) => {
    const r23 = data2023.filter((r) => r.municipio === mun);
    const r25 = data2025.filter((r) => r.municipio === mun);
    const avg23 = r23.length > 0
      ? Math.round((r23.reduce((s, r) => s + (r.ideb as number), 0) / r23.length) * 100) / 100
      : null;
    const avg25 = r25.length > 0
      ? Math.round((r25.reduce((s, r) => s + (r.ideb as number), 0) / r25.length) * 100) / 100
      : null;

    return {
      municipio: mun.length > 15 ? mun.slice(0, 13) + "…" : mun,
      "IDEB 2023": avg23,
      "IDEB 2025": avg25,
    };
  });

  if (chartData.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        IDEB 2023 vs 2025 por Município
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
          <Bar
            dataKey="IDEB 2023"
            fill="#93c5fd"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="IDEB 2025"
            fill="#2563eb"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

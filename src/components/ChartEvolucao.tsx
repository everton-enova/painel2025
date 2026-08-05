"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { IdebRecord } from "@/types/ideb";

interface ChartEvolucaoProps {
  data: IdebRecord[];
}

export function ChartEvolucao({ data }: ChartEvolucaoProps) {
  const withValues = data.filter(
    (r) => r.ideb_observado !== null && r.meta_ideb !== null
  );

  const anos = [...new Set(withValues.map((r) => r.ano))].sort();

  const chartData = anos.map((ano) => {
    const records = withValues.filter((r) => r.ano === ano);
    const avgIdeb =
      records.reduce((s, r) => s + r.ideb_observado!, 0) / records.length;
    const avgMeta =
      records.reduce((s, r) => s + r.meta_ideb!, 0) / records.length;
    return {
      ano: String(ano),
      "IDEB Observado": Math.round(avgIdeb * 100) / 100,
      "Meta IDEB": Math.round(avgMeta * 100) / 100,
    };
  });

  if (chartData.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Evolução do IDEB ao Longo do Tempo
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="ano" tick={{ fontSize: 12 }} />
          <YAxis
            domain={["auto", "auto"]}
            tick={{ fontSize: 12 }}
            tickFormatter={(v: number) => v.toFixed(1)}
          />
          <Tooltip
            formatter={(value) => Number(value).toFixed(2).replace(".", ",")}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="IDEB Observado"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="Meta IDEB"
            stroke="#f59e0b"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

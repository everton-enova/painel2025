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
  const withValues = data.filter((r) => typeof r.ideb === "number");
  const anos = [...new Set(withValues.map((r) => r.ano))].sort();

  const chartData = anos.map((ano) => {
    const records = withValues.filter((r) => r.ano === ano);
    const avgIdeb =
      records.reduce((s, r) => s + (r.ideb as number), 0) / records.length;
    const withNp = records.filter(
      (r) => typeof r.nota_padronizada === "number"
    );
    const avgNp = withNp.length > 0
      ? withNp.reduce((s, r) => s + (r.nota_padronizada as number), 0) / withNp.length
      : null;
    const withIr = records.filter(
      (r) => typeof r.indicador_rendimento === "number"
    );
    const avgIr = withIr.length > 0
      ? withIr.reduce((s, r) => s + (r.indicador_rendimento as number), 0) / withIr.length
      : null;

    return {
      ano: String(ano),
      IDEB: Math.round(avgIdeb * 100) / 100,
      "Nota Padronizada": avgNp !== null ? Math.round(avgNp * 100) / 100 : null,
      "Ind. Rendimento": avgIr !== null ? Math.round(avgIr * 100) / 100 : null,
    };
  });

  if (chartData.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Evolução dos Indicadores
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
            dataKey="IDEB"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="Nota Padronizada"
            stroke="#7c3aed"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="Ind. Rendimento"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

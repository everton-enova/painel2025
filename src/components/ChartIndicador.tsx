"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { IdebRecord } from "@/types/ideb";

type FieldKey =
  | "ideb"
  | "nota_padronizada"
  | "proficiencia_mat"
  | "proficiencia_lp"
  | "indicador_rendimento";

interface ChartIndicadorProps {
  data: IdebRecord[];
  field: FieldKey;
  title: string;
  color: string;
}

export function ChartIndicador({
  data,
  field,
  title,
  color,
}: ChartIndicadorProps) {
  const withValues = data.filter((r) => r[field] !== null);
  const anos = [...new Set(withValues.map((r) => r.ano))]
    .filter((a) => a >= 2019)
    .sort();

  const chartData = anos.map((ano) => {
    const records = withValues.filter((r) => r.ano === ano);
    const values = records.map((r) => r[field] as number);
    const avg =
      values.length > 0
        ? Math.round((values.reduce((s, v) => s + v, 0) / values.length) * 100) /
          100
        : null;
    return { ano: String(ano), valor: avg };
  });

  if (chartData.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="ano" tick={{ fontSize: 12 }} />
          <YAxis
            domain={["auto", "auto"]}
            tick={{ fontSize: 12 }}
            tickFormatter={(v: number) => v.toFixed(1)}
          />
          <Tooltip
            formatter={(value) => [
              Number(value).toFixed(2).replace(".", ","),
              title,
            ]}
            labelFormatter={(label) => `Ano: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="valor"
            stroke={color}
            strokeWidth={2.5}
            dot={{ r: 5, fill: color }}
            activeDot={{ r: 7 }}
            name={title}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

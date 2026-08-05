"use client";

import {
  LineChart,
  BarChart,
  Bar,
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

type ChartType = "line" | "bar";

const DOMAIN_MAP: Record<FieldKey, [number, number]> = {
  ideb: [2, 8],
  nota_padronizada: [2, 8],
  indicador_rendimento: [0.8, 1.0],
  proficiencia_mat: [100, 500],
  proficiencia_lp: [100, 500],
};

const CHART_TYPE_MAP: Record<FieldKey, ChartType> = {
  ideb: "line",
  nota_padronizada: "line",
  indicador_rendimento: "line",
  proficiencia_mat: "bar",
  proficiencia_lp: "bar",
};

interface ChartIndicadorProps {
  data: IdebRecord[];
  field: FieldKey;
  title: string;
  color: string;
}

function LineShadowDef({ id, color }: { id: string; color: string }) {
  return (
    <defs>
      <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow
          dx="0"
          dy="3"
          stdDeviation="3"
          floodColor={color}
          floodOpacity="0.3"
        />
      </filter>
    </defs>
  );
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
        ? Math.round(
            (values.reduce((s, v) => s + v, 0) / values.length) * 100
          ) / 100
        : null;
    return { ano: String(ano), valor: avg };
  });

  if (chartData.length === 0) return null;

  const chartType = CHART_TYPE_MAP[field];
  const filterId = `shadow-${field}`;
  const strokeWidth = 2;
  const dotRadius = Math.round(strokeWidth * 1.3 * 10) / 10;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={220}>
        {chartType === "bar" ? (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="ano" tick={{ fontSize: 12 }} />
            <YAxis
              domain={DOMAIN_MAP[field]}
              tick={{ fontSize: 12 }}
              tickFormatter={(v: number) => v.toFixed(0)}
            />
            <Tooltip
              formatter={(value) => [
                Number(value).toFixed(2).replace(".", ","),
                title,
              ]}
              labelFormatter={(label) => `Ano: ${label}`}
            />
            <Bar
              dataKey="valor"
              fill={color}
              radius={[4, 4, 0, 0]}
              name={title}
            />
          </BarChart>
        ) : (
          <LineChart data={chartData}>
            <LineShadowDef id={filterId} color={color} />
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="ano" tick={{ fontSize: 12 }} />
            <YAxis
              domain={DOMAIN_MAP[field]}
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
              strokeWidth={strokeWidth}
              dot={{ r: dotRadius, fill: color, strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
              name={title}
              style={{ filter: `url(#${filterId})` }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

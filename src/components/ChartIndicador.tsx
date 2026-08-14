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
  tall?: boolean;
}

function LineShadowDef({ id, color }: { id: string; color: string }) {
  return (
    <defs>
      <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow
          dx="0"
          dy="2"
          stdDeviation="2.5"
          floodColor={color}
          floodOpacity="0.2"
        />
      </filter>
    </defs>
  );
}

function LabelBg({ label, tx, ty, anchor = "middle" }: { label: string; tx: number; ty: number; anchor?: string }) {
  const charW = 6.5;
  const padX = 3;
  const padY = 2;
  const w = label.length * charW + padX * 2;
  const h = 13 + padY * 2;
  const rx = anchor === "start" ? tx - padX : anchor === "end" ? tx - w + padX : tx - w / 2;
  const ry = ty - 11 - padY;
  return <rect x={rx} y={ry} width={w} height={h} rx={4} fill="white" fillOpacity={0.92} />;
}

function CustomBarLabel({
  x,
  y,
  width,
  value,
}: {
  x?: number;
  y?: number;
  width?: number;
  value?: number | null;
}) {
  if (value === null || value === undefined || x === undefined || y === undefined || width === undefined) return null;
  const label = value.toFixed(1).replace(".", ",");
  const tx = x + width / 2;
  const ty = y - 6;
  return (
    <g>
      <LabelBg label={label} tx={tx} ty={ty} />
      <text x={tx} y={ty} textAnchor="middle" fontSize={11} fontWeight={500} fill="#86868b">
        {label}
      </text>
    </g>
  );
}

function CustomLineLabel({
  x,
  y,
  value,
  color,
}: {
  x?: number;
  y?: number;
  value?: number | null;
  color: string;
}) {
  if (value === null || value === undefined || x === undefined || y === undefined) return null;
  const label = value.toFixed(2).replace(".", ",");
  const ty = y - 10;
  return (
    <g>
      <LabelBg label={label} tx={x} ty={ty} />
      <text x={x} y={ty} textAnchor="middle" fontSize={11} fontWeight={500} fill={color}>
        {label}
      </text>
    </g>
  );
}

export function ChartIndicador({
  data,
  field,
  title,
  color,
  tall,
}: ChartIndicadorProps) {
  const withValues = data.filter((r) => typeof r[field] === "number");
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
    <div className={`bg-white rounded-2xl p-4 sm:p-5 transition-shadow duration-300 hover:shadow-[var(--card-shadow-hover)] flex flex-col${tall ? " h-full" : ""}`} style={{ boxShadow: "var(--card-shadow)" }}>
      <h3 className="text-[13px] font-semibold text-[var(--foreground)] mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={tall ? "100%" : 200} className={tall ? "min-h-[220px]" : "sm:!h-[220px]"}>
        {chartType === "bar" ? (
          <BarChart data={chartData} margin={{ top: 20, right: 5, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--separator)" />
            <XAxis dataKey="ano" tick={{ fontSize: 11, fill: "#aeaeb2" }} axisLine={{ stroke: "var(--separator)" }} tickLine={false} />
            <YAxis
              domain={DOMAIN_MAP[field]}
              tick={{ fontSize: 11, fill: "#aeaeb2" }}
              tickFormatter={(v: number) => v.toFixed(0)}
              width={40}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value) => [
                Number(value).toFixed(2).replace(".", ","),
                title,
              ]}
              labelFormatter={(label) => `Ano: ${label}`}
              contentStyle={{ fontSize: 12, borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}
            />
            <Bar
              dataKey="valor"
              fill={color}
              radius={[6, 6, 0, 0]}
              name={title}
              label={<CustomBarLabel />}
            />
          </BarChart>
        ) : (
          <LineChart data={chartData} margin={{ top: 20, right: 5, left: -10, bottom: 0 }}>
            <LineShadowDef id={filterId} color={color} />
            <CartesianGrid strokeDasharray="3 3" stroke="var(--separator)" />
            <XAxis dataKey="ano" tick={{ fontSize: 11, fill: "#aeaeb2" }} axisLine={{ stroke: "var(--separator)" }} tickLine={false} />
            <YAxis
              domain={DOMAIN_MAP[field]}
              tick={{ fontSize: 11, fill: "#aeaeb2" }}
              tickFormatter={(v: number) => v.toFixed(1)}
              width={40}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value) => [
                Number(value).toFixed(2).replace(".", ","),
                title,
              ]}
              labelFormatter={(label) => `Ano: ${label}`}
              contentStyle={{ fontSize: 12, borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}
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
              label={<CustomLineLabel color={color} />}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

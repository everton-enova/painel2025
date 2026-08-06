import { IdebRecord, IdebValue, KPIData, VariacaoRecord } from "@/types/ideb";

function safeAverage(values: number[]): number | null {
  if (values.length === 0) return null;
  const sum = values.reduce((a, b) => a + b, 0);
  return Math.round((sum / values.length) * 100) / 100;
}

function numericValues(records: IdebRecord[], field: NumericField): number[] {
  return records
    .map((r) => r[field])
    .filter((v): v is number => typeof v === "number");
}

export function computeKPIs(records: IdebRecord[]): KPIData {
  return {
    mediaNotaPadronizada: safeAverage(numericValues(records, "nota_padronizada")),
    mediaProficienciaMat: safeAverage(numericValues(records, "proficiencia_mat")),
    mediaProficienciaLp: safeAverage(numericValues(records, "proficiencia_lp")),
    mediaIdeb: safeAverage(numericValues(records, "ideb")),
    mediaIndicadorRendimento: safeAverage(
      numericValues(records, "indicador_rendimento")
    ),
    totalRegistros: records.length,
  };
}

type NumericField = "ideb" | "nota_padronizada" | "proficiencia_mat" | "proficiencia_lp" | "indicador_rendimento";

function recordKey(r: IdebRecord): string {
  return `${r.codigo_municipio}|${r.rede}|${r.etapa}`;
}

export function computeVariacao(
  allRecords: IdebRecord[],
  field: NumericField
): VariacaoRecord[] {
  const records2023 = new Map<string, IdebRecord>();
  const records2025 = new Map<string, IdebRecord>();

  for (const r of allRecords) {
    const key = recordKey(r);
    if (r.ano === 2023) records2023.set(key, r);
    else if (r.ano === 2025) records2025.set(key, r);
  }

  const allKeys = new Set([...records2023.keys(), ...records2025.keys()]);
  const result: VariacaoRecord[] = [];

  for (const key of allKeys) {
    const r23 = records2023.get(key);
    const r25 = records2025.get(key);
    const ref = r25 ?? r23;
    if (!ref) continue;

    const v23: IdebValue = r23?.[field] ?? null;
    const v25: IdebValue = r25?.[field] ?? null;
    const variacao =
      typeof v23 === "number" && typeof v25 === "number"
        ? Math.round((v25 - v23) * 100) / 100
        : null;

    result.push({
      municipio: ref.municipio,
      nte: ref.nte,
      rede: ref.rede,
      etapa: ref.etapa,
      valor2023: v23,
      valor2025: v25,
      variacao,
    });
  }

  return result.sort((a, b) => {
    if (a.variacao === null && b.variacao === null) return 0;
    if (a.variacao === null) return 1;
    if (b.variacao === null) return -1;
    return b.variacao - a.variacao;
  });
}

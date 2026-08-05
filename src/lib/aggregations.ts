import { IdebRecord, KPIData } from "@/types/ideb";

function safeAverage(values: number[]): number | null {
  if (values.length === 0) return null;
  const sum = values.reduce((a, b) => a + b, 0);
  return Math.round((sum / values.length) * 100) / 100;
}

export function computeKPIs(records: IdebRecord[]): KPIData {
  const withIdeb = records.filter((r) => r.ideb_observado !== null);
  const withMeta = records.filter((r) => r.meta_ideb !== null);
  const withBoth = records.filter(
    (r) => r.ideb_observado !== null && r.meta_ideb !== null
  );
  const atingiu = withBoth.filter((r) => r.status_meta === "Atingiu");

  return {
    mediaIdeb: safeAverage(withIdeb.map((r) => r.ideb_observado!)),
    mediaMeta: safeAverage(withMeta.map((r) => r.meta_ideb!)),
    totalRegistros: records.length,
    percentualAtingiu:
      withBoth.length > 0
        ? Math.round((atingiu.length / withBoth.length) * 10000) / 100
        : null,
    mediaAprendizado: safeAverage(
      records.filter((r) => r.aprendizado !== null).map((r) => r.aprendizado!)
    ),
    mediaFluxo: safeAverage(
      records.filter((r) => r.fluxo !== null).map((r) => r.fluxo!)
    ),
  };
}

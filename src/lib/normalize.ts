import { IdebRecord } from "@/types/ideb";

export function parseDecimal(value: string | undefined | null): number | null {
  if (value == null) return null;
  const trimmed = value.trim();
  if (trimmed === "" || trimmed === "-") return null;
  const cleaned = trimmed.replace(",", ".");
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

export function computeStatusMeta(
  ideb: number | null,
  meta: number | null
): "Atingiu" | "Não atingiu" | "Sem informação" {
  if (ideb === null || meta === null) return "Sem informação";
  return ideb >= meta ? "Atingiu" : "Não atingiu";
}

export function normalizeRecord(raw: Record<string, string>): IdebRecord {
  const ideb = parseDecimal(raw.ideb_observado);
  const meta = parseDecimal(raw.meta_ideb);

  return {
    ano: parseInt(raw.ano, 10) || 0,
    codigo_municipio: raw.codigo_municipio?.trim() ?? "",
    municipio: raw.municipio?.trim() ?? "",
    rede: raw.rede?.trim() ?? "",
    etapa: raw.etapa?.trim() ?? "",
    ideb_observado: ideb,
    meta_ideb: meta,
    aprendizado: parseDecimal(raw.aprendizado),
    fluxo: parseDecimal(raw.fluxo),
    status_meta: computeStatusMeta(ideb, meta),
  };
}

export function normalizeRecords(
  rawRecords: Record<string, string>[]
): IdebRecord[] {
  return rawRecords
    .map(normalizeRecord)
    .filter((r) => r.ano > 0 && r.municipio !== "");
}

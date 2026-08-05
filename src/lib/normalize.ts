import { IdebRecord, NteMapping } from "@/types/ideb";

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

export function normalizeRecord(
  raw: Record<string, string>,
  nteMap?: Map<string, string>
): IdebRecord {
  const ideb = parseDecimal(raw.ideb_observado);
  const meta = parseDecimal(raw.meta_ideb);
  const codigoMunicipio = raw.codigo_municipio?.trim() ?? "";

  return {
    ano: parseInt(raw.ano, 10) || 0,
    codigo_municipio: codigoMunicipio,
    municipio: raw.municipio?.trim() ?? "",
    nte: raw.nte?.trim() || nteMap?.get(codigoMunicipio) || "",
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
  rawRecords: Record<string, string>[],
  nteMap?: Map<string, string>
): IdebRecord[] {
  return rawRecords
    .map((r) => normalizeRecord(r, nteMap))
    .filter((r) => r.ano > 0 && r.municipio !== "");
}

export function parseNteMappings(
  rawRecords: Record<string, string>[]
): NteMapping[] {
  return rawRecords
    .filter((r) => r.nte?.trim() && r.codigo_municipio?.trim())
    .map((r) => ({
      codigo_municipio: r.codigo_municipio.trim(),
      municipio: r.municipio?.trim() ?? "",
      nte: r.nte.trim(),
    }));
}

export function buildNteMap(mappings: NteMapping[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const m of mappings) {
    map.set(m.codigo_municipio, m.nte);
  }
  return map;
}

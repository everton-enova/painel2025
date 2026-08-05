import { IdebRecord, NteMapping } from "@/types/ideb";

export function parseDecimal(value: string | undefined | null): number | null {
  if (value == null) return null;
  const trimmed = value.trim();
  if (trimmed === "" || trimmed === "-") return null;
  const cleaned = trimmed.replace(",", ".");
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

export function normalizeRecord(
  raw: Record<string, string>,
  nteMap?: Map<string, string>
): IdebRecord {
  const codigoMunicipio = raw.codigo_municipio?.trim() ?? "";

  return {
    ano: parseInt(raw.ano, 10) || 0,
    codigo_municipio: codigoMunicipio,
    municipio: raw.municipio?.trim() ?? "",
    nte: raw.nte?.trim() || nteMap?.get(codigoMunicipio) || "",
    rede: raw.rede?.trim() ?? "",
    etapa: raw.etapa?.trim() ?? "",
    ideb: parseDecimal(raw.ideb ?? raw.ideb_observado),
    nota_padronizada: parseDecimal(raw.nota_padronizada),
    proficiencia_mat: parseDecimal(raw.proficiencia_mat),
    proficiencia_lp: parseDecimal(raw.proficiencia_lp),
    indicador_rendimento: parseDecimal(raw.indicador_rendimento ?? raw.fluxo),
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

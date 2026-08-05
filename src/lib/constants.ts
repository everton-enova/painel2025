export const SHEET_ID =
  process.env.GOOGLE_SHEET_ID ||
  "1KY-_pTaFDJ41q9_eLaHLcZwmwx_TkS92TFe2TB-HnOY";

export const SHEET_GID = process.env.GOOGLE_SHEET_GID || "472115507";

export const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${SHEET_GID}`;

export const EXPECTED_HEADERS = [
  "ano",
  "codigo_municipio",
  "municipio",
  "rede",
  "etapa",
  "ideb_observado",
  "meta_ideb",
  "aprendizado",
  "fluxo",
  "status_meta",
];

export const CACHE_TTL_MS = 5 * 60 * 1000;

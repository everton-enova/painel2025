export const SHEET_ID =
  process.env.GOOGLE_SHEET_ID ||
  "1KY-_pTaFDJ41q9_eLaHLcZwmwx_TkS92TFe2TB-HnOY";

export const GIDS = {
  ACESSO: "0",
  NTE: "155176357",
  ANOS_INICIAIS: "472115507",
  ANOS_FINAIS: "767980037",
  ENSINO_MEDIO: "1188885958",
};

export function sheetCsvUrl(gid: string): string {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${gid}`;
}

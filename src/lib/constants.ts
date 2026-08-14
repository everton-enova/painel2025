export const SHEET_ID =
  process.env.GOOGLE_SHEET_ID ||
  "1KY-_pTaFDJ41q9_eLaHLcZwmwx_TkS92TFe2TB-HnOY";

export const GIDS = {
  NTE: "155176357",
  ANOS_INICIAIS: "472115507",
  ANOS_FINAIS: "767980037",
  ENSINO_MEDIO: "1188885958",
};

export const BAHIA_SHEETS = {
  AI: "AI_Bahia",
  AF: "AF_Bahia",
  EM: "EM_Bahia",
};

export const ESCOLA_SHEETS = {
  AI: "AI_ESCOLA",
  AF: "AF_ESCOLA",
  EM: "EM_ESCOLA",
};

export function sheetCsvUrl(gid: string): string {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${gid}`;
}

export function sheetCsvUrlByName(sheetName: string): string {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
}

// Edições exibidas no painel. Uma combinação município/rede/etapa é
// considerada vigente se tiver dado em ao menos uma delas — assim quem teve
// resultado em 2023 mas não em 2025 continua visível.
export const EDICAO_ATUAL = 2025;
export const EDICAO_ANTERIOR = 2023;
export const EDICOES_VIGENTES = [EDICAO_ANTERIOR, EDICAO_ATUAL];

export function temEdicaoVigente(anos: number[]): boolean {
  return anos.some((a) => EDICOES_VIGENTES.includes(a));
}

// Paleta categórica validada para daltonismo (ΔE adjacente >= 9,1). A cor
// segue o município escolhido — pela ordem de seleção, nunca pelo ranking.
export const SERIES_COLORS = [
  "#2a78d6",
  "#eb6834",
  "#1baf7a",
  "#eda100",
  "#e87ba4",
];

export const BAHIA_COLOR = "#d03b3b";
export const MAX_COMPARACAO = SERIES_COLORS.length;

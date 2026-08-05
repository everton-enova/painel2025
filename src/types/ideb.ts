export interface IdebRecord {
  ano: number;
  codigo_municipio: string;
  municipio: string;
  rede: string;
  etapa: string;
  ideb_observado: number | null;
  meta_ideb: number | null;
  aprendizado: number | null;
  fluxo: number | null;
  status_meta: "Atingiu" | "Não atingiu" | "Sem informação";
}

export interface FilterState {
  ano: string | null;
  municipio: string | null;
  rede: string | null;
  etapa: string | null;
}

export interface KPIData {
  mediaIdeb: number | null;
  mediaMeta: number | null;
  totalRegistros: number;
  percentualAtingiu: number | null;
  mediaAprendizado: number | null;
  mediaFluxo: number | null;
}

// "ND" = Não Divulgada: taxa de participação no SAEB inferior a 80%
export type IdebValue = number | "ND" | null;

export interface IdebRecord {
  ano: number;
  codigo_municipio: string;
  municipio: string;
  nte: string;
  rede: string;
  etapa: string;
  ideb: IdebValue;
  nota_padronizada: IdebValue;
  proficiencia_mat: IdebValue;
  proficiencia_lp: IdebValue;
  indicador_rendimento: IdebValue;
}

export interface NteMapping {
  codigo_municipio: string;
  municipio: string;
  nte: string;
}

export interface FilterState {
  nte: string | null;
  municipio: string | null;
  rede: string | null;
  etapa: string | null;
}

export interface KPIData {
  mediaNotaPadronizada: IdebValue;
  mediaProficienciaMat: IdebValue;
  mediaProficienciaLp: IdebValue;
  mediaIdeb: IdebValue;
  mediaIndicadorRendimento: IdebValue;
  totalRegistros: number;
}

export interface VariacaoRecord {
  municipio: string;
  nte: string;
  rede: string;
  etapa: string;
  valor2023: IdebValue;
  valor2025: IdebValue;
  variacao: number | null;
}

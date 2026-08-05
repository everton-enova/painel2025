export interface IdebRecord {
  ano: number;
  codigo_municipio: string;
  municipio: string;
  nte: string;
  rede: string;
  etapa: string;
  ideb: number | null;
  nota_padronizada: number | null;
  proficiencia_mat: number | null;
  proficiencia_lp: number | null;
  indicador_rendimento: number | null;
}

export interface NteMapping {
  codigo_municipio: string;
  municipio: string;
  nte: string;
}

export interface FilterState {
  municipio: string | null;
  rede: string | null;
  etapa: string | null;
}

export interface KPIData {
  mediaNotaPadronizada: number | null;
  mediaProficienciaMat: number | null;
  mediaProficienciaLp: number | null;
  mediaIdeb: number | null;
  mediaIndicadorRendimento: number | null;
  totalRegistros: number;
}

export interface VariacaoRecord {
  municipio: string;
  nte: string;
  rede: string;
  etapa: string;
  valor2023: number | null;
  valor2025: number | null;
  variacao: number | null;
}

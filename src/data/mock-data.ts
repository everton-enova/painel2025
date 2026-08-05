import { IdebRecord } from "@/types/ideb";

const raw: Omit<IdebRecord, "status_meta">[] = [
  // Salvador - NTE 26
  { ano: 2017, codigo_municipio: "2927408", municipio: "Salvador", nte: "NTE 26", rede: "Municipal", etapa: "Anos Iniciais", ideb_observado: 4.5, meta_ideb: 4.6, aprendizado: 5.0, fluxo: 0.9 },
  { ano: 2017, codigo_municipio: "2927408", municipio: "Salvador", nte: "NTE 26", rede: "Municipal", etapa: "Anos Finais", ideb_observado: 3.4, meta_ideb: 3.8, aprendizado: 4.2, fluxo: 0.81 },
  { ano: 2017, codigo_municipio: "2927408", municipio: "Salvador", nte: "NTE 26", rede: "Municipal", etapa: "Ensino Médio", ideb_observado: 3.1, meta_ideb: 3.5, aprendizado: 3.8, fluxo: 0.82 },
  { ano: 2017, codigo_municipio: "2927408", municipio: "Salvador", nte: "NTE 26", rede: "Estadual", etapa: "Anos Iniciais", ideb_observado: 4.8, meta_ideb: 4.5, aprendizado: 5.2, fluxo: 0.92 },
  { ano: 2017, codigo_municipio: "2927408", municipio: "Salvador", nte: "NTE 26", rede: "Estadual", etapa: "Ensino Médio", ideb_observado: 3.0, meta_ideb: 3.4, aprendizado: 3.7, fluxo: 0.81 },
  { ano: 2019, codigo_municipio: "2927408", municipio: "Salvador", nte: "NTE 26", rede: "Municipal", etapa: "Anos Iniciais", ideb_observado: 4.9, meta_ideb: 4.9, aprendizado: 5.3, fluxo: 0.92 },
  { ano: 2019, codigo_municipio: "2927408", municipio: "Salvador", nte: "NTE 26", rede: "Municipal", etapa: "Anos Finais", ideb_observado: 3.7, meta_ideb: 4.1, aprendizado: 4.5, fluxo: 0.82 },
  { ano: 2019, codigo_municipio: "2927408", municipio: "Salvador", nte: "NTE 26", rede: "Municipal", etapa: "Ensino Médio", ideb_observado: 3.4, meta_ideb: 3.7, aprendizado: 4.1, fluxo: 0.83 },
  { ano: 2019, codigo_municipio: "2927408", municipio: "Salvador", nte: "NTE 26", rede: "Estadual", etapa: "Anos Iniciais", ideb_observado: 5.1, meta_ideb: 4.8, aprendizado: 5.5, fluxo: 0.93 },
  { ano: 2019, codigo_municipio: "2927408", municipio: "Salvador", nte: "NTE 26", rede: "Estadual", etapa: "Ensino Médio", ideb_observado: 3.2, meta_ideb: 3.6, aprendizado: 3.9, fluxo: 0.82 },
  { ano: 2021, codigo_municipio: "2927408", municipio: "Salvador", nte: "NTE 26", rede: "Municipal", etapa: "Anos Iniciais", ideb_observado: 5.2, meta_ideb: 5.2, aprendizado: 5.6, fluxo: 0.93 },
  { ano: 2021, codigo_municipio: "2927408", municipio: "Salvador", nte: "NTE 26", rede: "Municipal", etapa: "Ensino Médio", ideb_observado: 3.6, meta_ideb: 3.9, aprendizado: 4.3, fluxo: 0.84 },
  { ano: 2023, codigo_municipio: "2927408", municipio: "Salvador", nte: "NTE 26", rede: "Municipal", etapa: "Anos Iniciais", ideb_observado: 5.5, meta_ideb: 5.4, aprendizado: 5.9, fluxo: 0.93 },
  { ano: 2023, codigo_municipio: "2927408", municipio: "Salvador", nte: "NTE 26", rede: "Municipal", etapa: "Anos Finais", ideb_observado: 4.2, meta_ideb: 4.5, aprendizado: 5.0, fluxo: 0.84 },
  { ano: 2023, codigo_municipio: "2927408", municipio: "Salvador", nte: "NTE 26", rede: "Municipal", etapa: "Ensino Médio", ideb_observado: 3.8, meta_ideb: 4.1, aprendizado: 4.5, fluxo: 0.84 },
  { ano: 2023, codigo_municipio: "2927408", municipio: "Salvador", nte: "NTE 26", rede: "Estadual", etapa: "Anos Iniciais", ideb_observado: 5.3, meta_ideb: 5.1, aprendizado: 5.7, fluxo: 0.93 },
  { ano: 2023, codigo_municipio: "2927408", municipio: "Salvador", nte: "NTE 26", rede: "Estadual", etapa: "Ensino Médio", ideb_observado: 3.5, meta_ideb: 3.9, aprendizado: 4.2, fluxo: 0.83 },

  // Feira de Santana - NTE 19
  { ano: 2017, codigo_municipio: "2910800", municipio: "Feira de Santana", nte: "NTE 19", rede: "Municipal", etapa: "Anos Iniciais", ideb_observado: 4.7, meta_ideb: 4.4, aprendizado: 5.1, fluxo: 0.92 },
  { ano: 2017, codigo_municipio: "2910800", municipio: "Feira de Santana", nte: "NTE 19", rede: "Municipal", etapa: "Ensino Médio", ideb_observado: 3.2, meta_ideb: 3.5, aprendizado: 3.9, fluxo: 0.82 },
  { ano: 2019, codigo_municipio: "2910800", municipio: "Feira de Santana", nte: "NTE 19", rede: "Municipal", etapa: "Anos Iniciais", ideb_observado: 5.0, meta_ideb: 4.7, aprendizado: 5.4, fluxo: 0.93 },
  { ano: 2019, codigo_municipio: "2910800", municipio: "Feira de Santana", nte: "NTE 19", rede: "Municipal", etapa: "Anos Finais", ideb_observado: 3.9, meta_ideb: 4.0, aprendizado: 4.6, fluxo: 0.85 },
  { ano: 2019, codigo_municipio: "2910800", municipio: "Feira de Santana", nte: "NTE 19", rede: "Municipal", etapa: "Ensino Médio", ideb_observado: 3.5, meta_ideb: 3.7, aprendizado: 4.2, fluxo: 0.83 },
  { ano: 2021, codigo_municipio: "2910800", municipio: "Feira de Santana", nte: "NTE 19", rede: "Municipal", etapa: "Anos Iniciais", ideb_observado: 5.3, meta_ideb: 5.0, aprendizado: 5.7, fluxo: 0.93 },
  { ano: 2021, codigo_municipio: "2910800", municipio: "Feira de Santana", nte: "NTE 19", rede: "Municipal", etapa: "Ensino Médio", ideb_observado: 3.7, meta_ideb: 3.9, aprendizado: 4.4, fluxo: 0.84 },
  { ano: 2023, codigo_municipio: "2910800", municipio: "Feira de Santana", nte: "NTE 19", rede: "Municipal", etapa: "Anos Iniciais", ideb_observado: 5.6, meta_ideb: 5.3, aprendizado: 6.0, fluxo: 0.93 },
  { ano: 2023, codigo_municipio: "2910800", municipio: "Feira de Santana", nte: "NTE 19", rede: "Municipal", etapa: "Anos Finais", ideb_observado: 4.3, meta_ideb: 4.4, aprendizado: 5.1, fluxo: 0.84 },
  { ano: 2023, codigo_municipio: "2910800", municipio: "Feira de Santana", nte: "NTE 19", rede: "Municipal", etapa: "Ensino Médio", ideb_observado: 3.9, meta_ideb: 4.1, aprendizado: 4.6, fluxo: 0.84 },
  { ano: 2023, codigo_municipio: "2910800", municipio: "Feira de Santana", nte: "NTE 19", rede: "Estadual", etapa: "Ensino Médio", ideb_observado: 3.6, meta_ideb: 4.0, aprendizado: 4.3, fluxo: 0.83 },

  // Vitória da Conquista - NTE 20
  { ano: 2017, codigo_municipio: "2933307", municipio: "Vitória da Conquista", nte: "NTE 20", rede: "Municipal", etapa: "Anos Iniciais", ideb_observado: 4.9, meta_ideb: 4.5, aprendizado: 5.3, fluxo: 0.92 },
  { ano: 2019, codigo_municipio: "2933307", municipio: "Vitória da Conquista", nte: "NTE 20", rede: "Municipal", etapa: "Anos Iniciais", ideb_observado: 5.2, meta_ideb: 4.8, aprendizado: 5.6, fluxo: 0.93 },
  { ano: 2019, codigo_municipio: "2933307", municipio: "Vitória da Conquista", nte: "NTE 20", rede: "Municipal", etapa: "Ensino Médio", ideb_observado: 3.3, meta_ideb: 3.6, aprendizado: 4.0, fluxo: 0.83 },
  { ano: 2021, codigo_municipio: "2933307", municipio: "Vitória da Conquista", nte: "NTE 20", rede: "Municipal", etapa: "Anos Iniciais", ideb_observado: 5.4, meta_ideb: 5.1, aprendizado: 5.8, fluxo: 0.93 },
  { ano: 2023, codigo_municipio: "2933307", municipio: "Vitória da Conquista", nte: "NTE 20", rede: "Municipal", etapa: "Anos Iniciais", ideb_observado: 5.7, meta_ideb: 5.4, aprendizado: 6.1, fluxo: 0.93 },
  { ano: 2023, codigo_municipio: "2933307", municipio: "Vitória da Conquista", nte: "NTE 20", rede: "Municipal", etapa: "Anos Finais", ideb_observado: 4.5, meta_ideb: 4.5, aprendizado: 5.3, fluxo: 0.85 },
  { ano: 2023, codigo_municipio: "2933307", municipio: "Vitória da Conquista", nte: "NTE 20", rede: "Municipal", etapa: "Ensino Médio", ideb_observado: 3.7, meta_ideb: 3.9, aprendizado: 4.4, fluxo: 0.84 },

  // Juazeiro - NTE 10
  { ano: 2017, codigo_municipio: "2918407", municipio: "Juazeiro", nte: "NTE 10", rede: "Municipal", etapa: "Anos Iniciais", ideb_observado: 4.6, meta_ideb: 4.3, aprendizado: 5.0, fluxo: 0.92 },
  { ano: 2019, codigo_municipio: "2918407", municipio: "Juazeiro", nte: "NTE 10", rede: "Municipal", etapa: "Anos Iniciais", ideb_observado: 4.9, meta_ideb: 4.6, aprendizado: 5.3, fluxo: 0.92 },
  { ano: 2019, codigo_municipio: "2918407", municipio: "Juazeiro", nte: "NTE 10", rede: "Municipal", etapa: "Ensino Médio", ideb_observado: 3.1, meta_ideb: 3.5, aprendizado: 3.8, fluxo: 0.82 },
  { ano: 2021, codigo_municipio: "2918407", municipio: "Juazeiro", nte: "NTE 10", rede: "Municipal", etapa: "Anos Iniciais", ideb_observado: 5.2, meta_ideb: 4.9, aprendizado: 5.6, fluxo: 0.93 },
  { ano: 2023, codigo_municipio: "2918407", municipio: "Juazeiro", nte: "NTE 10", rede: "Municipal", etapa: "Anos Iniciais", ideb_observado: 5.5, meta_ideb: 5.2, aprendizado: 5.9, fluxo: 0.93 },
  { ano: 2023, codigo_municipio: "2918407", municipio: "Juazeiro", nte: "NTE 10", rede: "Municipal", etapa: "Anos Finais", ideb_observado: 4.2, meta_ideb: 4.3, aprendizado: 5.0, fluxo: 0.84 },
  { ano: 2023, codigo_municipio: "2918407", municipio: "Juazeiro", nte: "NTE 10", rede: "Municipal", etapa: "Ensino Médio", ideb_observado: 3.5, meta_ideb: 3.8, aprendizado: 4.2, fluxo: 0.83 },

  // Itabuna - NTE 05
  { ano: 2017, codigo_municipio: "2916104", municipio: "Itabuna", nte: "NTE 05", rede: "Municipal", etapa: "Anos Iniciais", ideb_observado: 4.1, meta_ideb: 4.2, aprendizado: 4.6, fluxo: 0.89 },
  { ano: 2019, codigo_municipio: "2916104", municipio: "Itabuna", nte: "NTE 05", rede: "Municipal", etapa: "Anos Iniciais", ideb_observado: 4.4, meta_ideb: 4.5, aprendizado: 4.9, fluxo: 0.9 },
  { ano: 2021, codigo_municipio: "2916104", municipio: "Itabuna", nte: "NTE 05", rede: "Municipal", etapa: "Anos Iniciais", ideb_observado: 4.7, meta_ideb: 4.8, aprendizado: 5.2, fluxo: 0.9 },
  { ano: 2023, codigo_municipio: "2916104", municipio: "Itabuna", nte: "NTE 05", rede: "Municipal", etapa: "Anos Iniciais", ideb_observado: 5.0, meta_ideb: 5.0, aprendizado: 5.5, fluxo: 0.91 },
  { ano: 2023, codigo_municipio: "2916104", municipio: "Itabuna", nte: "NTE 05", rede: "Municipal", etapa: "Anos Finais", ideb_observado: 3.7, meta_ideb: 4.1, aprendizado: 4.5, fluxo: 0.82 },
  { ano: 2023, codigo_municipio: "2916104", municipio: "Itabuna", nte: "NTE 05", rede: "Municipal", etapa: "Ensino Médio", ideb_observado: 3.3, meta_ideb: 3.7, aprendizado: 4.0, fluxo: 0.83 },

  // Ilhéus - NTE 05
  { ano: 2017, codigo_municipio: "2913606", municipio: "Ilhéus", nte: "NTE 05", rede: "Municipal", etapa: "Anos Iniciais", ideb_observado: 4.0, meta_ideb: 4.1, aprendizado: 4.5, fluxo: 0.89 },
  { ano: 2019, codigo_municipio: "2913606", municipio: "Ilhéus", nte: "NTE 05", rede: "Municipal", etapa: "Anos Iniciais", ideb_observado: 4.3, meta_ideb: 4.4, aprendizado: 4.8, fluxo: 0.9 },
  { ano: 2021, codigo_municipio: "2913606", municipio: "Ilhéus", nte: "NTE 05", rede: "Municipal", etapa: "Anos Iniciais", ideb_observado: 4.6, meta_ideb: 4.7, aprendizado: 5.1, fluxo: 0.9 },
  { ano: 2023, codigo_municipio: "2913606", municipio: "Ilhéus", nte: "NTE 05", rede: "Municipal", etapa: "Anos Iniciais", ideb_observado: 4.9, meta_ideb: 4.9, aprendizado: 5.4, fluxo: 0.91 },
  { ano: 2023, codigo_municipio: "2913606", municipio: "Ilhéus", nte: "NTE 05", rede: "Municipal", etapa: "Ensino Médio", ideb_observado: 3.2, meta_ideb: 3.6, aprendizado: 3.9, fluxo: 0.82 },

  // Barreiras - NTE 11
  { ano: 2021, codigo_municipio: "2903201", municipio: "Barreiras", nte: "NTE 11", rede: "Municipal", etapa: "Anos Iniciais", ideb_observado: 5.1, meta_ideb: 4.8, aprendizado: 5.5, fluxo: 0.93 },
  { ano: 2023, codigo_municipio: "2903201", municipio: "Barreiras", nte: "NTE 11", rede: "Municipal", etapa: "Anos Iniciais", ideb_observado: 5.4, meta_ideb: 5.1, aprendizado: 5.8, fluxo: 0.93 },
  { ano: 2023, codigo_municipio: "2903201", municipio: "Barreiras", nte: "NTE 11", rede: "Municipal", etapa: "Anos Finais", ideb_observado: 4.1, meta_ideb: 4.2, aprendizado: 4.9, fluxo: 0.84 },
  { ano: 2023, codigo_municipio: "2903201", municipio: "Barreiras", nte: "NTE 11", rede: "Municipal", etapa: "Ensino Médio", ideb_observado: 3.6, meta_ideb: 3.8, aprendizado: 4.3, fluxo: 0.84 },

  // Lauro de Freitas - NTE 26
  { ano: 2023, codigo_municipio: "2919207", municipio: "Lauro de Freitas", nte: "NTE 26", rede: "Municipal", etapa: "Anos Iniciais", ideb_observado: 5.6, meta_ideb: 5.5, aprendizado: 6.0, fluxo: 0.93 },
  { ano: 2023, codigo_municipio: "2919207", municipio: "Lauro de Freitas", nte: "NTE 26", rede: "Municipal", etapa: "Ensino Médio", ideb_observado: 3.7, meta_ideb: 4.0, aprendizado: 4.4, fluxo: 0.84 },

  // Camaçari - NTE 26
  { ano: 2023, codigo_municipio: "2905701", municipio: "Camaçari", nte: "NTE 26", rede: "Municipal", etapa: "Anos Iniciais", ideb_observado: 5.1, meta_ideb: 5.1, aprendizado: 5.6, fluxo: 0.91 },
  { ano: 2023, codigo_municipio: "2905701", municipio: "Camaçari", nte: "NTE 26", rede: "Municipal", etapa: "Ensino Médio", ideb_observado: 3.4, meta_ideb: 3.8, aprendizado: 4.1, fluxo: 0.83 },

  // Teixeira de Freitas - NTE 09
  { ano: 2023, codigo_municipio: "2931350", municipio: "Teixeira de Freitas", nte: "NTE 09", rede: "Municipal", etapa: "Anos Iniciais", ideb_observado: 5.1, meta_ideb: 5.0, aprendizado: 5.5, fluxo: 0.93 },
  { ano: 2023, codigo_municipio: "2931350", municipio: "Teixeira de Freitas", nte: "NTE 09", rede: "Municipal", etapa: "Ensino Médio", ideb_observado: 3.4, meta_ideb: 3.7, aprendizado: 4.1, fluxo: 0.83 },
];

function computeStatus(
  ideb: number | null,
  meta: number | null
): "Atingiu" | "Não atingiu" | "Sem informação" {
  if (ideb === null || meta === null) return "Sem informação";
  return ideb >= meta ? "Atingiu" : "Não atingiu";
}

export const mockData: IdebRecord[] = raw.map((r) => ({
  ...r,
  status_meta: computeStatus(r.ideb_observado, r.meta_ideb),
}));

export const MOCK_UPDATED_AT = "2024-12-15T10:00:00Z";

import { computeKPIs, computeVariacao } from "@/lib/aggregations";
import { IdebRecord } from "@/types/ideb";

function makeRecord(overrides: Partial<IdebRecord> = {}): IdebRecord {
  return {
    ano: 2023,
    codigo_municipio: "1",
    municipio: "Test",
    nte: "NTE 01",
    rede: "Municipal",
    etapa: "Anos Iniciais",
    ideb: 5.0,
    nota_padronizada: 5.5,
    proficiencia_mat: 230.0,
    proficiencia_lp: 220.0,
    indicador_rendimento: 0.91,
    ...overrides,
  };
}

describe("computeKPIs", () => {
  it("calculates averages with all values present", () => {
    const records = [
      makeRecord({ ideb: 4.0, nota_padronizada: 4.5 }),
      makeRecord({ ideb: 6.0, nota_padronizada: 6.5 }),
    ];

    const kpis = computeKPIs(records);

    expect(kpis.mediaIdeb).toBe(5.0);
    expect(kpis.mediaNotaPadronizada).toBe(5.5);
    expect(kpis.totalRegistros).toBe(2);
  });

  it("skips null values in averages", () => {
    const records = [
      makeRecord({ ideb: 4.0 }),
      makeRecord({ ideb: null }),
    ];

    const kpis = computeKPIs(records);

    expect(kpis.mediaIdeb).toBe(4.0);
    expect(kpis.totalRegistros).toBe(2);
  });

  it("returns null averages for empty array", () => {
    const kpis = computeKPIs([]);

    expect(kpis.mediaIdeb).toBeNull();
    expect(kpis.mediaNotaPadronizada).toBeNull();
    expect(kpis.mediaProficienciaMat).toBeNull();
    expect(kpis.mediaProficienciaLp).toBeNull();
    expect(kpis.totalRegistros).toBe(0);
  });
});

describe("computeVariacao", () => {
  it("calculates variation between 2023 and 2025", () => {
    const records = [
      makeRecord({ ano: 2023, ideb: 4.0 }),
      makeRecord({ ano: 2025, ideb: 5.0 }),
    ];

    const result = computeVariacao(records, "ideb");

    expect(result).toHaveLength(1);
    expect(result[0].variacao).toBe(1.0);
    expect(result[0].valor2023).toBe(4.0);
    expect(result[0].valor2025).toBe(5.0);
  });

  it("sorts by variation descending", () => {
    const records = [
      makeRecord({ ano: 2023, codigo_municipio: "1", ideb: 4.0 }),
      makeRecord({ ano: 2025, codigo_municipio: "1", ideb: 4.5 }),
      makeRecord({ ano: 2023, codigo_municipio: "2", municipio: "B", ideb: 3.0 }),
      makeRecord({ ano: 2025, codigo_municipio: "2", municipio: "B", ideb: 5.0 }),
    ];

    const result = computeVariacao(records, "ideb");

    expect(result[0].variacao).toBe(2.0);
    expect(result[1].variacao).toBe(0.5);
  });

  it("handles records with only one year", () => {
    const records = [
      makeRecord({ ano: 2023, ideb: 4.0 }),
    ];

    const result = computeVariacao(records, "ideb");

    expect(result).toHaveLength(1);
    expect(result[0].variacao).toBeNull();
  });
});

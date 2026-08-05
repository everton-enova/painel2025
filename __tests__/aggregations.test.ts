import { computeKPIs } from "@/lib/aggregations";
import { IdebRecord } from "@/types/ideb";

function makeRecord(overrides: Partial<IdebRecord> = {}): IdebRecord {
  return {
    ano: 2023,
    codigo_municipio: "1",
    municipio: "Test",
    rede: "Municipal",
    etapa: "Anos Iniciais",
    ideb_observado: 5.0,
    meta_ideb: 4.5,
    aprendizado: 5.5,
    fluxo: 0.9,
    status_meta: "Atingiu",
    ...overrides,
  };
}

describe("computeKPIs", () => {
  it("calculates averages with all values present", () => {
    const records = [
      makeRecord({ ideb_observado: 4.0, meta_ideb: 3.5 }),
      makeRecord({ ideb_observado: 6.0, meta_ideb: 5.5 }),
    ];

    const kpis = computeKPIs(records);

    expect(kpis.mediaIdeb).toBe(5.0);
    expect(kpis.mediaMeta).toBe(4.5);
    expect(kpis.totalRegistros).toBe(2);
  });

  it("skips null values in ideb average", () => {
    const records = [
      makeRecord({ ideb_observado: 4.0, meta_ideb: 3.5 }),
      makeRecord({ ideb_observado: null, meta_ideb: 5.5, status_meta: "Sem informação" }),
    ];

    const kpis = computeKPIs(records);

    expect(kpis.mediaIdeb).toBe(4.0);
    expect(kpis.totalRegistros).toBe(2);
  });

  it("returns null averages for empty array", () => {
    const kpis = computeKPIs([]);

    expect(kpis.mediaIdeb).toBeNull();
    expect(kpis.mediaMeta).toBeNull();
    expect(kpis.percentualAtingiu).toBeNull();
    expect(kpis.totalRegistros).toBe(0);
  });

  it("calculates percentualAtingiu correctly", () => {
    const records = [
      makeRecord({ ideb_observado: 5.0, meta_ideb: 4.0, status_meta: "Atingiu" }),
      makeRecord({ ideb_observado: 3.0, meta_ideb: 4.0, status_meta: "Não atingiu" }),
      makeRecord({ ideb_observado: 4.0, meta_ideb: 4.0, status_meta: "Atingiu" }),
    ];

    const kpis = computeKPIs(records);

    expect(kpis.percentualAtingiu).toBeCloseTo(66.67, 1);
  });

  it("returns null percentualAtingiu when no records have both values", () => {
    const records = [
      makeRecord({ ideb_observado: null, meta_ideb: 4.0, status_meta: "Sem informação" }),
      makeRecord({ ideb_observado: 5.0, meta_ideb: null, status_meta: "Sem informação" }),
    ];

    const kpis = computeKPIs(records);

    expect(kpis.percentualAtingiu).toBeNull();
  });
});

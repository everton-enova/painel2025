import {
  parseDecimal,
  computeStatusMeta,
  normalizeRecord,
  normalizeRecords,
} from "@/lib/normalize";

describe("parseDecimal", () => {
  it("parses dot-separated decimals", () => {
    expect(parseDecimal("4.5")).toBe(4.5);
  });

  it("parses comma-separated decimals (Brazilian format)", () => {
    expect(parseDecimal("4,5")).toBe(4.5);
  });

  it("parses integers", () => {
    expect(parseDecimal("5")).toBe(5);
  });

  it("returns null for empty string", () => {
    expect(parseDecimal("")).toBeNull();
  });

  it("returns null for undefined", () => {
    expect(parseDecimal(undefined)).toBeNull();
  });

  it("returns null for null", () => {
    expect(parseDecimal(null)).toBeNull();
  });

  it("returns null for non-numeric string", () => {
    expect(parseDecimal("abc")).toBeNull();
  });

  it("returns null for dash", () => {
    expect(parseDecimal("-")).toBeNull();
  });

  it("trims whitespace", () => {
    expect(parseDecimal("  4.5  ")).toBe(4.5);
  });
});

describe("computeStatusMeta", () => {
  it('returns "Atingiu" when ideb >= meta', () => {
    expect(computeStatusMeta(5.0, 4.5)).toBe("Atingiu");
  });

  it('returns "Atingiu" when ideb equals meta', () => {
    expect(computeStatusMeta(4.5, 4.5)).toBe("Atingiu");
  });

  it('returns "Não atingiu" when ideb < meta', () => {
    expect(computeStatusMeta(4.0, 4.5)).toBe("Não atingiu");
  });

  it('returns "Sem informação" when ideb is null', () => {
    expect(computeStatusMeta(null, 4.5)).toBe("Sem informação");
  });

  it('returns "Sem informação" when meta is null', () => {
    expect(computeStatusMeta(4.5, null)).toBe("Sem informação");
  });

  it('returns "Sem informação" when both are null', () => {
    expect(computeStatusMeta(null, null)).toBe("Sem informação");
  });
});

describe("normalizeRecord", () => {
  it("normalizes a complete record", () => {
    const raw = {
      ano: "2023",
      codigo_municipio: " 2927408 ",
      municipio: " Salvador ",
      rede: " Municipal ",
      etapa: " Anos Iniciais ",
      ideb_observado: "5,5",
      meta_ideb: "5,4",
      aprendizado: "5,9",
      fluxo: "0,93",
      status_meta: "",
    };

    const result = normalizeRecord(raw);

    expect(result.ano).toBe(2023);
    expect(result.codigo_municipio).toBe("2927408");
    expect(result.municipio).toBe("Salvador");
    expect(result.rede).toBe("Municipal");
    expect(result.etapa).toBe("Anos Iniciais");
    expect(result.ideb_observado).toBe(5.5);
    expect(result.meta_ideb).toBe(5.4);
    expect(result.aprendizado).toBe(5.9);
    expect(result.fluxo).toBe(0.93);
    expect(result.status_meta).toBe("Atingiu");
  });

  it("handles missing values", () => {
    const raw = {
      ano: "2023",
      codigo_municipio: "123",
      municipio: "Test",
      rede: "Municipal",
      etapa: "Anos Finais",
      ideb_observado: "",
      meta_ideb: "",
      aprendizado: "",
      fluxo: "",
      status_meta: "",
    };

    const result = normalizeRecord(raw);

    expect(result.ideb_observado).toBeNull();
    expect(result.meta_ideb).toBeNull();
    expect(result.status_meta).toBe("Sem informação");
  });
});

describe("normalizeRecords", () => {
  it("filters out records with invalid ano", () => {
    const records = [
      { ano: "2023", codigo_municipio: "1", municipio: "A", rede: "M", etapa: "AI", ideb_observado: "5", meta_ideb: "4", aprendizado: "", fluxo: "", status_meta: "" },
      { ano: "", codigo_municipio: "2", municipio: "B", rede: "M", etapa: "AI", ideb_observado: "5", meta_ideb: "4", aprendizado: "", fluxo: "", status_meta: "" },
    ];

    const result = normalizeRecords(records);
    expect(result).toHaveLength(1);
    expect(result[0].municipio).toBe("A");
  });

  it("filters out records with empty municipio", () => {
    const records = [
      { ano: "2023", codigo_municipio: "1", municipio: "", rede: "M", etapa: "AI", ideb_observado: "5", meta_ideb: "4", aprendizado: "", fluxo: "", status_meta: "" },
    ];

    const result = normalizeRecords(records);
    expect(result).toHaveLength(0);
  });
});

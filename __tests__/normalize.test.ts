import {
  parseDecimal,
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

describe("normalizeRecord", () => {
  it("normalizes a complete record", () => {
    const raw = {
      ano: "2023",
      codigo_municipio: " 2927408 ",
      municipio: " Salvador ",
      nte: " NTE 26 ",
      rede: " Municipal ",
      etapa: " Anos Iniciais ",
      ideb: "5,5",
      nota_padronizada: "5,89",
      proficiencia_mat: "228,5",
      proficiencia_lp: "215,3",
      indicador_rendimento: "0,93",
    };

    const result = normalizeRecord(raw);

    expect(result.ano).toBe(2023);
    expect(result.codigo_municipio).toBe("2927408");
    expect(result.municipio).toBe("Salvador");
    expect(result.nte).toBe("NTE 26");
    expect(result.ideb).toBe(5.5);
    expect(result.nota_padronizada).toBe(5.89);
    expect(result.proficiencia_mat).toBe(228.5);
    expect(result.proficiencia_lp).toBe(215.3);
    expect(result.indicador_rendimento).toBe(0.93);
  });

  it("uses NTE map when record has no nte field", () => {
    const raw = {
      ano: "2023",
      codigo_municipio: "123",
      municipio: "Test",
      rede: "Municipal",
      etapa: "Anos Finais",
      ideb: "5",
      nota_padronizada: "",
      proficiencia_mat: "",
      proficiencia_lp: "",
      indicador_rendimento: "",
    };

    const nteMap = new Map([["123", "NTE 05"]]);
    const result = normalizeRecord(raw, nteMap);

    expect(result.nte).toBe("NTE 05");
  });

  it("handles missing values", () => {
    const raw = {
      ano: "2023",
      codigo_municipio: "123",
      municipio: "Test",
      rede: "Municipal",
      etapa: "Anos Finais",
      ideb: "",
      nota_padronizada: "",
      proficiencia_mat: "",
      proficiencia_lp: "",
      indicador_rendimento: "",
    };

    const result = normalizeRecord(raw);

    expect(result.ideb).toBeNull();
    expect(result.nota_padronizada).toBeNull();
    expect(result.proficiencia_mat).toBeNull();
  });
});

describe("normalizeRecords", () => {
  it("filters out records with invalid ano", () => {
    const records = [
      { ano: "2023", codigo_municipio: "1", municipio: "A", rede: "M", etapa: "AI", ideb: "5", nota_padronizada: "", proficiencia_mat: "", proficiencia_lp: "", indicador_rendimento: "" },
      { ano: "", codigo_municipio: "2", municipio: "B", rede: "M", etapa: "AI", ideb: "5", nota_padronizada: "", proficiencia_mat: "", proficiencia_lp: "", indicador_rendimento: "" },
    ];

    const result = normalizeRecords(records);
    expect(result).toHaveLength(1);
    expect(result[0].municipio).toBe("A");
  });

  it("filters out records with empty municipio", () => {
    const records = [
      { ano: "2023", codigo_municipio: "1", municipio: "", rede: "M", etapa: "AI", ideb: "5", nota_padronizada: "", proficiencia_mat: "", proficiencia_lp: "", indicador_rendimento: "" },
    ];

    const result = normalizeRecords(records);
    expect(result).toHaveLength(0);
  });
});

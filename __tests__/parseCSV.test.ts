import { parseCSV } from "@/lib/parseCSV";

describe("parseCSV", () => {
  it("parses standard CSV with header row", () => {
    const csv = "nome,valor\nA,1\nB,2";
    const result = parseCSV(csv);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ nome: "A", valor: "1" });
    expect(result[1]).toEqual({ nome: "B", valor: "2" });
  });

  it("handles quoted fields containing commas", () => {
    const csv = 'nome,descricao\n"Silva, João","valor com, vírgula"';
    const result = parseCSV(csv);

    expect(result).toHaveLength(1);
    expect(result[0].nome).toBe("Silva, João");
    expect(result[0].descricao).toBe("valor com, vírgula");
  });

  it("handles UTF-8 BOM marker", () => {
    const csv = "﻿nome,valor\nA,1";
    const result = parseCSV(csv);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ nome: "A", valor: "1" });
  });

  it("handles empty rows", () => {
    const csv = "nome,valor\nA,1\n\nB,2\n";
    const result = parseCSV(csv);

    expect(result).toHaveLength(2);
  });

  it("returns empty array for empty input", () => {
    expect(parseCSV("")).toEqual([]);
  });

  it("returns empty array for header only", () => {
    expect(parseCSV("nome,valor")).toEqual([]);
  });

  it("normalizes header names to lowercase with underscores", () => {
    const csv = "Nome Completo,Valor Total\nA,1";
    const result = parseCSV(csv);

    expect(result[0]).toHaveProperty("nome_completo", "A");
    expect(result[0]).toHaveProperty("valor_total", "1");
  });

  it("handles escaped quotes in quoted fields", () => {
    const csv = 'nome\n"valor com ""aspas"""\n';
    const result = parseCSV(csv);

    expect(result).toHaveLength(1);
    expect(result[0].nome).toBe('valor com "aspas"');
  });
});

import { dominioDinamico, marcasDoDominio } from "@/lib/escala";

describe("dominioDinamico", () => {
  it("aperta a escala em torno dos dados", () => {
    // proficiência real fica longe dos extremos de 100-500
    const [lo, hi] = dominioDinamico([189, 223, 240, 258], [0, 500]);
    expect(lo).toBeLessThanOrEqual(189);
    expect(hi).toBeGreaterThanOrEqual(258);
    expect(hi - lo).toBeLessThan(200); // bem menor que os 400 fixos
  });

  it("respeita o limite superior do indicador de rendimento", () => {
    const [lo, hi] = dominioDinamico([0.93, 0.97, 1.0], [0, 1]);
    expect(hi).toBeLessThanOrEqual(1);
    expect(lo).toBeLessThanOrEqual(0.93);
  });

  it("nunca ultrapassa o limite inferior", () => {
    const [lo] = dominioDinamico([0.05, 0.1], [0, 1]);
    expect(lo).toBeGreaterThanOrEqual(0);
  });

  it("dá altura a uma série constante", () => {
    const [lo, hi] = dominioDinamico([5, 5, 5], [0, 10]);
    expect(hi).toBeGreaterThan(lo);
    expect(lo).toBeLessThanOrEqual(5);
    expect(hi).toBeGreaterThanOrEqual(5);
  });

  it("cai no limite quando não há valor", () => {
    expect(dominioDinamico([], [2, 8])).toEqual([2, 8]);
  });

  it("engloba todos os pontos do Ideb", () => {
    const vals = [4.2, 5.8, 6.5, 3.6];
    const [lo, hi] = dominioDinamico(vals, [0, 10]);
    for (const v of vals) {
      expect(v).toBeGreaterThanOrEqual(lo);
      expect(v).toBeLessThanOrEqual(hi);
    }
  });

  it("produz extremos redondos, sem lixo de ponto flutuante", () => {
    const [lo, hi] = dominioDinamico([0.83, 0.91, 0.99], [0, 1]);
    expect(String(lo).length).toBeLessThanOrEqual(5);
    expect(String(hi).length).toBeLessThanOrEqual(5);
  });
});

describe("marcasDoDominio", () => {
  it("gera marcas redondas, sem 0,78 e 0,93", () => {
    const marcas = marcasDoDominio([0.7, 1.0]);
    expect(marcas[0]).toBe(0.7);
    expect(marcas[marcas.length - 1]).toBe(1);
    // toda marca deve ser multipla de 0,05
    for (const m of marcas) {
      expect(Math.round(m * 100) % 5).toBe(0);
    }
  });

  it("fica dentro do domínio", () => {
    const dom: [number, number] = [160, 260];
    const marcas = marcasDoDominio(dom);
    expect(Math.min(...marcas)).toBeGreaterThanOrEqual(dom[0]);
    expect(Math.max(...marcas)).toBeLessThanOrEqual(dom[1]);
  });

  it("não devolve marcas repetidas", () => {
    const marcas = marcasDoDominio([3, 8]);
    expect(new Set(marcas).size).toBe(marcas.length);
  });
});

describe("marcasDoDominio: espaçamento uniforme", () => {
  const casos: [number, number][] = [
    [3, 8], [4, 7], [160, 260], [140, 240], [0.7, 1], [0, 10], [2, 8],
  ];
  it.each(casos)("intervalo constante em [%s, %s]", (lo, hi) => {
    const m = marcasDoDominio([lo, hi]);
    expect(m.length).toBeGreaterThanOrEqual(3);
    const gaps = m.slice(1).map((v, i) => Number((v - m[i]).toFixed(6)));
    expect(new Set(gaps).size).toBe(1); // todos os degraus iguais
    expect(m[0]).toBeCloseTo(lo, 6);
    expect(m[m.length - 1]).toBeCloseTo(hi, 6); // topo é uma marca
  });
});

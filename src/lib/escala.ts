// Escala que acompanha os dados em vez de usar uma faixa fixa. Com faixa
// fixa, indicadores que variam pouco (proficiência entre 180 e 260 numa
// escala de 100 a 500) desenham uma linha quase reta no meio de muito
// espaço vazio, escondendo justamente a diferença que se quer enxergar.

/** Passo "redondo" (1, 2, 5 × 10^n) próximo ao alvo. */
function passoRedondo(alvo: number): number {
  if (alvo <= 0) return 1;
  const magnitude = Math.pow(10, Math.floor(Math.log10(alvo)));
  const norm = alvo / magnitude;
  const escolhido = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
  return escolhido * magnitude;
}

/**
 * Domínio do eixo a partir dos valores presentes, com folga e extremos
 * arredondados. `limite` impede que a escala invente território impossível
 * (rendimento acima de 1, proficiência negativa).
 */
export function dominioDinamico(
  valores: number[],
  limite: [number, number]
): [number, number] {
  const nums = valores.filter((v) => Number.isFinite(v));
  if (nums.length === 0) return limite;

  const min = Math.min(...nums);
  const max = Math.max(...nums);
  const amplitude = max - min;

  // Série constante ainda precisa de altura para não virar uma linha colada
  // na borda; usa uma fração do próprio valor.
  const folga =
    amplitude > 0 ? amplitude * 0.2 : Math.max(Math.abs(max) * 0.05, 0.05);

  const passo = passoRedondo((amplitude + 2 * folga) / 4);
  let inferior = Math.floor((min - folga) / passo) * passo;
  let superior = Math.ceil((max + folga) / passo) * passo;

  inferior = Math.max(inferior, limite[0]);
  superior = Math.min(superior, limite[1]);

  // Arredondamento pode colapsar os dois extremos num valor só
  if (superior <= inferior) return limite;

  // Corrige o ponto flutuante (0.30000000000000004)
  const casas = passo < 1 ? Math.ceil(-Math.log10(passo)) + 1 : 0;
  const arredonda = (v: number) =>
    casas > 0 ? Number(v.toFixed(casas)) : Math.round(v);

  return [arredonda(inferior), arredonda(superior)];
}

/**
 * Marcas do eixo em valores redondos dentro do domínio. Sem isso o Recharts
 * divide a faixa em partes iguais e produz rótulos como 0,78 e 0,93.
 */
export function marcasDoDominio(
  [inferior, superior]: [number, number]
): number[] {
  const amplitude = superior - inferior;
  if (amplitude <= 0) return [inferior];

  // Prefere um número de intervalos que divida a faixa num passo redondo,
  // para o topo cair numa marca em vez de virar um degrau solto (3,5,7,8).
  const ehRedondo = (p: number) => {
    const mag = Math.pow(10, Math.floor(Math.log10(p)));
    const n = p / mag;
    return [1, 2, 2.5, 5, 10].some((alvo) => Math.abs(n - alvo) < 1e-9);
  };

  let passo = 0;
  for (const intervalos of [5, 4, 6, 3, 8]) {
    const candidato = amplitude / intervalos;
    if (ehRedondo(candidato)) {
      passo = candidato;
      break;
    }
  }
  if (!passo) passo = passoRedondo(amplitude / 4);

  const casas = passo < 1 ? Math.ceil(-Math.log10(passo)) + 1 : 0;
  const arredonda = (v: number) =>
    casas > 0 ? Number(v.toFixed(casas)) : Math.round(v);

  const marcas: number[] = [];
  for (let v = inferior; v <= superior + passo / 1000; v += passo) {
    marcas.push(arredonda(v));
  }
  return marcas;
}

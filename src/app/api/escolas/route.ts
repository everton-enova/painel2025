import { NextRequest, NextResponse } from "next/server";
import { ESCOLA_SHEETS, sheetCsvUrlByName } from "@/lib/constants";
import { parseEscolaTabs } from "@/lib/parseEscola";
import { getAccessSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function fetchCsv(sheetName: string): Promise<string> {
  const url = sheetCsvUrlByName(sheetName);
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`Sheet ${sheetName}: ${response.status}`);
  return response.text();
}

let cache: { data: ReturnType<typeof parseEscolaTabs>; ts: number } | null = null;
const TTL = 5 * 60 * 1000;

async function getAll() {
  if (cache && Date.now() - cache.ts < TTL) return cache.data;
  const [ai, af, em] = await Promise.all([
    fetchCsv(ESCOLA_SHEETS.AI),
    fetchCsv(ESCOLA_SHEETS.AF),
    fetchCsv(ESCOLA_SHEETS.EM),
  ]);
  const data = parseEscolaTabs(ai, af, em);
  cache = { data, ts: Date.now() };
  return data;
}

function normalize(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
}

export async function GET(request: NextRequest) {
  const codigoMunicipio = request.nextUrl.searchParams.get("municipio");
  if (!codigoMunicipio) {
    return NextResponse.json({ error: "Parâmetro 'municipio' (código) é obrigatório" }, { status: 400 });
  }

  try {
    const all = await getAll();
    const session = await getAccessSession();
    let escolas = all.filter((r) => r.codigo_municipio === codigoMunicipio);

    if (session?.rede && session.rede !== "TODAS") {
      escolas = escolas.filter((r) => normalize(r.rede) === normalize(session.rede));
    }

    return NextResponse.json(
      { data: escolas, total: escolas.length },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      { error: "Erro ao carregar dados das escolas", data: [], total: 0 },
      { status: 500 }
    );
  }
}

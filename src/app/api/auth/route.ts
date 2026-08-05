import { NextRequest, NextResponse } from "next/server";
import { GIDS, sheetCsvUrl } from "@/lib/constants";

interface Credential {
  perfil: string;
  senha: string;
}

async function fetchCredentials(): Promise<Credential[]> {
  const url = sheetCsvUrl(GIDS.ACESSO);
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Falha ao buscar credenciais");
  const text = await res.text();

  const lines = text.trim().split("\n");
  const credentials: Credential[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",").map((c) => c.replace(/^"|"$/g, "").trim());
    if (cols.length >= 2 && cols[0] && cols[1]) {
      credentials.push({ perfil: cols[0], senha: cols[1] });
    }
  }

  return credentials;
}

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Senha não informada" },
        { status: 400 }
      );
    }

    const credentials = await fetchCredentials();
    const match = credentials.find((c) => c.senha === password);

    if (match) {
      return NextResponse.json({
        success: true,
        perfil: match.perfil,
      });
    }

    return NextResponse.json(
      { success: false, error: "Senha incorreta" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Erro ao validar acesso" },
      { status: 500 }
    );
  }
}

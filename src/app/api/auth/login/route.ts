import { NextRequest, NextResponse } from "next/server";
import { authenticateNte } from "@/lib/nte-credentials";
import { setNteSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { nte, password } = await req.json();

  if (!nte || !password) {
    return NextResponse.json(
      { error: "Selecione o NTE e informe a senha" },
      { status: 400 }
    );
  }

  try {
    const user = await authenticateNte(nte, password);
    if (!user) {
      return NextResponse.json(
        { error: "NTE ou senha inválidos" },
        { status: 401 }
      );
    }

    await setNteSession(user.nte);
    return NextResponse.json({ nte: user.nte });
  } catch {
    return NextResponse.json(
      { error: "Erro ao verificar credenciais" },
      { status: 500 }
    );
  }
}

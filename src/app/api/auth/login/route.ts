import { NextRequest, NextResponse } from "next/server";
import { authenticateByPassword, authenticateNte } from "@/lib/nte-credentials";
import { setNteSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { nte, password } = await req.json();

  if (!password) {
    return NextResponse.json({ error: "Informe a senha" }, { status: 400 });
  }

  try {
    // Com NTE informado, preserva o fluxo atual do nte-ideb.
    // Sem NTE, a senha identifica automaticamente o perfil e seu escopo.
    const user = nte
      ? await authenticateNte(nte, password)
      : await authenticateByPassword(password);

    if (!user) {
      return NextResponse.json(
        { error: nte ? "NTE ou senha inválidos" : "Senha inválida ou não exclusiva" },
        { status: 401 }
      );
    }

    await setNteSession(user);
    return NextResponse.json({
      acesso: user.acesso,
      nte: user.nte,
      perfil: user.perfil,
      rede: user.rede,
    });
  } catch {
    return NextResponse.json({ error: "Erro ao verificar credenciais" }, { status: 500 });
  }
}

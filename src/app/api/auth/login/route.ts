import { NextRequest, NextResponse } from "next/server";
import { authenticateByPassword } from "@/lib/nte-credentials";
import { setNteSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!password) {
    return NextResponse.json({ error: "Informe a senha" }, { status: 400 });
  }

  try {
    const user = await authenticateByPassword(password);
    if (!user) {
      return NextResponse.json({ error: "Senha inválida" }, { status: 401 });
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

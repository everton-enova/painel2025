import { NextRequest, NextResponse } from "next/server";
import { authenticateNte } from "@/lib/nte-credentials";
import { setNteSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json(
      { error: "Usuário e senha são obrigatórios" },
      { status: 400 }
    );
  }

  const user = authenticateNte(username, password);
  if (!user) {
    return NextResponse.json(
      { error: "Usuário ou senha inválidos" },
      { status: 401 }
    );
  }

  await setNteSession(user.nte);

  return NextResponse.json({ nte: user.nte });
}

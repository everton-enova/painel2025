import { NextResponse } from "next/server";
import { getAccessSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAccessSession();
  return NextResponse.json(session ?? { acesso: null, nte: null, perfil: null, rede: null });
}

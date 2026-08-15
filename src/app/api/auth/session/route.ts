import { NextResponse } from "next/server";
import { getNteSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const nte = await getNteSession();
  return NextResponse.json({ nte });
}

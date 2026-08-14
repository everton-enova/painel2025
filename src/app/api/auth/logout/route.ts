import { NextResponse } from "next/server";
import { clearNteSession } from "@/lib/auth";

export async function POST() {
  await clearNteSession();
  return NextResponse.json({ ok: true });
}

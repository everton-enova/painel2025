import { NextResponse } from "next/server";
import { fetchSheetData } from "@/lib/fetchSheetData";
import { getAccessSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

function normalize(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
}

export async function GET() {
  const { data, updatedAt, source } = await fetchSheetData();
  const session = await getAccessSession();

  let scopedData = data;
  if (session) {
    if (session.nte !== "TODOS") {
      scopedData = scopedData.filter((r) => normalize(r.nte) === normalize(session.nte));
    }
    if (session.rede !== "TODAS") {
      scopedData = scopedData.filter((r) => normalize(r.rede) === normalize(session.rede));
    }
  }

  return NextResponse.json(
    { data: scopedData, updatedAt, source },
    { headers: { "Cache-Control": "no-store" } }
  );
}

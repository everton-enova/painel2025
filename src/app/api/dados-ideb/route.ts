import { NextResponse } from "next/server";
import { fetchSheetData } from "@/lib/fetchSheetData";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data, updatedAt, source } = await fetchSheetData();

  return NextResponse.json(
    { data, updatedAt, source },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

import { NextResponse } from "next/server";
import { fetchSheetData } from "@/lib/fetchSheetData";

export async function GET() {
  const { data, updatedAt, source } = await fetchSheetData();

  return NextResponse.json(
    { data, updatedAt, source },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    }
  );
}

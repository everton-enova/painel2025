import { IdebRecord } from "@/types/ideb";
import { SHEET_CSV_URL, CACHE_TTL_MS } from "./constants";
import { parseCSV } from "./parseCSV";
import { normalizeRecords } from "./normalize";
import { mockData, MOCK_UPDATED_AT } from "@/data/mock-data";

interface CachedData {
  data: IdebRecord[];
  updatedAt: string;
  fetchedAt: number;
}

let cache: CachedData | null = null;

export async function fetchSheetData(): Promise<{
  data: IdebRecord[];
  updatedAt: string;
  source: "sheet" | "mock";
}> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return { data: cache.data, updatedAt: cache.updatedAt, source: "sheet" };
  }

  try {
    const response = await fetch(SHEET_CSV_URL, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`Google Sheets returned ${response.status}`);
    }

    const csv = await response.text();
    const rawRecords = parseCSV(csv);
    const data = normalizeRecords(rawRecords);

    const updatedAt = new Date().toISOString();
    cache = { data, updatedAt, fetchedAt: Date.now() };

    return { data, updatedAt, source: "sheet" };
  } catch {
    return { data: mockData, updatedAt: MOCK_UPDATED_AT, source: "mock" };
  }
}

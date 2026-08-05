import { IdebRecord } from "@/types/ideb";
import { GIDS, sheetCsvUrl, CACHE_TTL_MS } from "./constants";
import { parseAllTabs } from "./parseInep";
import { mockData, MOCK_UPDATED_AT } from "@/data/mock-data";

interface CachedData {
  data: IdebRecord[];
  updatedAt: string;
  fetchedAt: number;
}

let cache: CachedData | null = null;

async function fetchCsv(gid: string): Promise<string> {
  const url = sheetCsvUrl(gid);
  const response = await fetch(url, { next: { revalidate: 300 } });
  if (!response.ok) {
    throw new Error(`Sheet gid=${gid} returned ${response.status}`);
  }
  return response.text();
}

export async function fetchSheetData(): Promise<{
  data: IdebRecord[];
  updatedAt: string;
  source: "sheet" | "mock";
}> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return { data: cache.data, updatedAt: cache.updatedAt, source: "sheet" };
  }

  try {
    const [nteCsv, aiCsv, afCsv, emCsv] = await Promise.all([
      fetchCsv(GIDS.NTE),
      fetchCsv(GIDS.ANOS_INICIAIS),
      fetchCsv(GIDS.ANOS_FINAIS),
      fetchCsv(GIDS.ENSINO_MEDIO),
    ]);

    const data = parseAllTabs(nteCsv, aiCsv, afCsv, emCsv);

    if (data.length === 0) {
      throw new Error("No records parsed from spreadsheet");
    }

    const updatedAt = new Date().toISOString();
    cache = { data, updatedAt, fetchedAt: Date.now() };

    return { data, updatedAt, source: "sheet" };
  } catch {
    return { data: mockData, updatedAt: MOCK_UPDATED_AT, source: "mock" };
  }
}

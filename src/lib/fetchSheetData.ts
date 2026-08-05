import { IdebRecord } from "@/types/ideb";
import { GIDS, sheetCsvUrl } from "./constants";
import { parseAllTabs } from "./parseInep";
import { mockData, MOCK_UPDATED_AT } from "@/data/mock-data";

async function fetchCsv(gid: string): Promise<string> {
  const url = sheetCsvUrl(gid);
  const response = await fetch(url, { cache: "no-store" });
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

    return { data, updatedAt: new Date().toISOString(), source: "sheet" };
  } catch {
    return { data: mockData, updatedAt: MOCK_UPDATED_AT, source: "mock" };
  }
}

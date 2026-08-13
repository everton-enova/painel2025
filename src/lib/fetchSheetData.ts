import { IdebRecord } from "@/types/ideb";
import { GIDS, BAHIA_SHEETS, sheetCsvUrl, sheetCsvUrlByName } from "./constants";
import { parseAllTabs, parseBahiaTabs } from "./parseInep";
import { mockData, MOCK_UPDATED_AT } from "@/data/mock-data";

async function fetchCsv(gid: string): Promise<string> {
  const url = sheetCsvUrl(gid);
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Sheet gid=${gid} returned ${response.status}`);
  }
  return response.text();
}

async function fetchCsvByName(sheetName: string): Promise<string> {
  const url = sheetCsvUrlByName(sheetName);
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Sheet ${sheetName} returned ${response.status}`);
  }
  return response.text();
}

export async function fetchSheetData(): Promise<{
  data: IdebRecord[];
  updatedAt: string;
  source: "sheet" | "mock";
}> {
  try {
    const [nteCsv, aiCsv, afCsv, emCsv, bahiaAiCsv, bahiaAfCsv, bahiaEmCsv] =
      await Promise.all([
        fetchCsv(GIDS.NTE),
        fetchCsv(GIDS.ANOS_INICIAIS),
        fetchCsv(GIDS.ANOS_FINAIS),
        fetchCsv(GIDS.ENSINO_MEDIO),
        fetchCsvByName(BAHIA_SHEETS.AI),
        fetchCsvByName(BAHIA_SHEETS.AF),
        fetchCsvByName(BAHIA_SHEETS.EM),
      ]);

    const municipioRecords = parseAllTabs(nteCsv, aiCsv, afCsv, emCsv);
    const bahiaRecords = parseBahiaTabs(bahiaAiCsv, bahiaAfCsv, bahiaEmCsv);
    const data = [...municipioRecords, ...bahiaRecords];

    if (data.length === 0) {
      throw new Error("No records parsed from spreadsheet");
    }

    return { data, updatedAt: new Date().toISOString(), source: "sheet" };
  } catch {
    return { data: mockData, updatedAt: MOCK_UPDATED_AT, source: "mock" };
  }
}

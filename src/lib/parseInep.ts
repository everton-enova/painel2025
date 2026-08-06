import { IdebRecord, IdebValue } from "@/types/ideb";

function parseDecimal(value: string | undefined): IdebValue {
  if (!value) return null;
  const trimmed = value.trim();
  if (trimmed === "" || trimmed === "-") return null;
  if (trimmed.toUpperCase() === "ND") return "ND";
  const cleaned = trimmed.replace(",", ".");
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

interface TabConfig {
  etapa: string;
  years: number[];
  taxaCols: number[];
  taxaColsPerYear: number;
  saebBaseCols: number[];
  idebStartCol: number;
  dataStartRow: number;
}

const ANOS_INICIAIS: TabConfig = {
  etapa: "Anos Iniciais",
  years: [2005, 2007, 2009, 2011, 2013, 2015, 2017, 2019, 2021, 2023, 2025],
  taxaCols: [4, 11, 18, 25, 32, 39, 46, 53, 60, 67, 74],
  taxaColsPerYear: 7,
  saebBaseCols: [81, 84, 87, 90, 93, 96, 99, 102, 105, 108, 111],
  idebStartCol: 114,
  dataStartRow: 3,
};

const ANOS_FINAIS: TabConfig = {
  etapa: "Anos Finais",
  years: [2005, 2007, 2009, 2011, 2013, 2015, 2017, 2019, 2021, 2023, 2025],
  taxaCols: [4, 10, 16, 22, 28, 34, 40, 46, 52, 58, 64],
  taxaColsPerYear: 6,
  saebBaseCols: [70, 73, 76, 79, 82, 85, 88, 91, 94, 97, 100],
  idebStartCol: 103,
  dataStartRow: 3,
};

const ENSINO_MEDIO: TabConfig = {
  etapa: "Ensino Médio",
  years: [2017, 2019, 2021, 2023, 2025],
  taxaCols: [4, 10, 16, 22, 28],
  taxaColsPerYear: 6,
  saebBaseCols: [34, 37, 40, 43, 46],
  idebStartCol: 49,
  dataStartRow: 3,
};

export function parseAllTabs(
  nteCsv: string,
  aiCsv: string,
  afCsv: string,
  emCsv: string
): IdebRecord[] {
  const nteMap = parseNteMap(nteCsv);
  const aiRecords = parseTab(aiCsv, ANOS_INICIAIS, nteMap);
  const afRecords = parseTab(afCsv, ANOS_FINAIS, nteMap);
  const emRecords = parseTab(emCsv, ENSINO_MEDIO, nteMap);
  return [...aiRecords, ...afRecords, ...emRecords];
}

function parseNteMap(csv: string): Map<string, string> {
  const lines = csvToArrays(csv);
  const map = new Map<string, string>();

  for (const row of lines) {
    const regional = (row[0] || "").trim();
    const codigo = (row[1] || "").trim();
    if (!regional || !codigo || regional === "REGIONAL") continue;
    const nteMatch = regional.match(/^(NTE\s*\d+)/);
    const nte = nteMatch ? nteMatch[1] : regional;
    map.set(codigo, nte);
  }

  return map;
}

function parseTab(
  csv: string,
  config: TabConfig,
  nteMap: Map<string, string>
): IdebRecord[] {
  const lines = csvToArrays(csv);
  const records: IdebRecord[] = [];

  for (let i = config.dataStartRow; i < lines.length; i++) {
    const row = lines[i];
    const codigoMunicipio = (row[1] || "").trim();
    const municipio = (row[2] || "").trim();
    const rede = (row[3] || "").trim();

    if (!codigoMunicipio || !municipio || rede === "Pública") continue;

    const nte = nteMap.get(codigoMunicipio) || "";

    for (let yi = 0; yi < config.years.length; yi++) {
      const ano = config.years[yi];
      const taxaBase = config.taxaCols[yi];
      const indRendCol = taxaBase + config.taxaColsPerYear - 1;
      const saebBase = config.saebBaseCols[yi];
      const idebCol = config.idebStartCol + yi;

      const ideb = parseDecimal(row[idebCol]);
      const notaPad = parseDecimal(row[saebBase + 2]);
      const profMat = parseDecimal(row[saebBase]);
      const profLp = parseDecimal(row[saebBase + 1]);
      const indRend = parseDecimal(row[indRendCol]);

      if (
        ideb === null &&
        notaPad === null &&
        profMat === null &&
        profLp === null &&
        indRend === null
      ) {
        continue;
      }

      records.push({
        ano,
        codigo_municipio: codigoMunicipio,
        municipio,
        nte,
        rede,
        etapa: config.etapa,
        ideb,
        nota_padronizada: notaPad,
        proficiencia_mat: profMat,
        proficiencia_lp: profLp,
        indicador_rendimento: indRend,
      });
    }
  }

  return records;
}

function csvToArrays(csv: string): string[][] {
  const result: string[][] = [];
  let current = "";
  let inQuotes = false;
  let row: string[] = [];

  for (let i = 0; i < csv.length; i++) {
    const ch = csv[i];

    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < csv.length && csv[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        row.push(current);
        current = "";
      } else if (ch === "\n") {
        row.push(current);
        current = "";
        result.push(row);
        row = [];
      } else if (ch !== "\r") {
        current += ch;
      }
    }
  }

  if (current || row.length > 0) {
    row.push(current);
    result.push(row);
  }

  return result;
}

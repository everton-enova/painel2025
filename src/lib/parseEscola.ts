import { EscolaRecord, IdebValue } from "@/types/ideb";

function parseDecimal(value: string | undefined): IdebValue {
  if (!value) return null;
  const trimmed = value.trim();
  if (trimmed === "" || trimmed === "-") return null;
  if (trimmed.toUpperCase() === "ND") return "ND";
  const cleaned = trimmed.replace(",", ".");
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

interface EscolaTabConfig {
  etapa: string;
  years: number[];
  taxaCols: number[];
  taxaColsPerYear: number;
  saebBaseCols: number[];
  idebStartCol: number;
}

const AI_ESCOLA: EscolaTabConfig = {
  etapa: "Anos Iniciais",
  years: [2005, 2007, 2009, 2011, 2013, 2015, 2017, 2019, 2021, 2023, 2025],
  taxaCols: [6, 13, 20, 27, 34, 41, 48, 55, 62, 69, 76],
  taxaColsPerYear: 7,
  saebBaseCols: [83, 86, 89, 92, 95, 98, 101, 104, 107, 110, 113],
  idebStartCol: 116,
};

const AF_ESCOLA: EscolaTabConfig = {
  etapa: "Anos Finais",
  years: [2005, 2007, 2009, 2011, 2013, 2015, 2017, 2019, 2021, 2023, 2025],
  taxaCols: [6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66],
  taxaColsPerYear: 6,
  saebBaseCols: [72, 75, 78, 81, 84, 87, 90, 93, 96, 99, 102],
  idebStartCol: 105,
};

const EM_ESCOLA: EscolaTabConfig = {
  etapa: "Ensino Médio",
  years: [2017, 2019, 2021, 2023, 2025],
  taxaCols: [6, 12, 18, 24, 30],
  taxaColsPerYear: 6,
  saebBaseCols: [36, 39, 42, 45, 48],
  idebStartCol: 51,
};

function parseEscolaTab(csv: string, config: EscolaTabConfig): EscolaRecord[] {
  const lines = csvToArrays(csv);
  const records: EscolaRecord[] = [];

  for (let i = 3; i < lines.length; i++) {
    const row = lines[i];
    const codigoMunicipio = (row[1] || "").trim();
    const municipio = (row[2] || "").trim();
    const codigoEscola = (row[3] || "").trim();
    const escola = (row[4] || "").trim();
    const rede = (row[5] || "").trim();

    if (!codigoMunicipio || !codigoEscola || !escola) continue;
    if (rede === "Privada" || rede === "Total" || rede === "Pública") continue;

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
        codigo_escola: codigoEscola,
        escola,
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

export function parseEscolaTabs(
  aiCsv: string,
  afCsv: string,
  emCsv: string
): EscolaRecord[] {
  return [
    ...parseEscolaTab(aiCsv, AI_ESCOLA),
    ...parseEscolaTab(afCsv, AF_ESCOLA),
    ...parseEscolaTab(emCsv, EM_ESCOLA),
  ];
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

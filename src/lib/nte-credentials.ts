import { SHEET_ID } from "./constants";

export type AccessProfile = "ADMIN" | "NTE" | "CONSULTA";

export interface NteUser {
  acesso: string;
  nte: string;
  password: string;
  perfil: AccessProfile;
  rede: string;
}

let cachedCredentials: NteUser[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000;

function normalizeHeader(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let quoted = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (quoted && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values;
}

async function fetchCredentials(): Promise<NteUser[]> {
  if (cachedCredentials && Date.now() - cacheTime < CACHE_TTL) {
    return cachedCredentials;
  }

  const sheetId = process.env.GOOGLE_SHEET_ID || SHEET_ID;
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent("Acesso")}`;

  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error("Falha ao buscar credenciais");

  const rows = (await res.text())
    .split(/\r?\n/)
    .filter(Boolean)
    .map(parseCsvLine);

  if (rows.length === 0) return [];

  const headers = rows[0].map(normalizeHeader);
  const col = (name: string) => headers.indexOf(normalizeHeader(name));
  const acessoCol = col("Acesso") >= 0 ? col("Acesso") : col("Acessos");
  const senhaCol = col("Senha");
  const perfilCol = col("Perfil");
  const nteCol = col("NTE");
  const redeCol = col("Rede");

  const creds: NteUser[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const acesso = acessoCol >= 0 ? row[acessoCol]?.trim() : row[0]?.trim();
    const password = senhaCol >= 0 ? row[senhaCol]?.trim() : row[1]?.trim();
    if (!acesso || !password) continue;

    const explicitNte = nteCol >= 0 ? row[nteCol]?.trim() : "";
    const inferredNte = acesso.toUpperCase().startsWith("NTE") ? acesso : "TODOS";
    const nte = explicitNte || inferredNte;
    const rawPerfil = perfilCol >= 0 ? row[perfilCol]?.trim().toUpperCase() : "";
    const perfil: AccessProfile =
      rawPerfil === "ADMIN" || rawPerfil === "CONSULTA" || rawPerfil === "NTE"
        ? rawPerfil
        : nte !== "TODOS"
          ? "NTE"
          : "CONSULTA";
    const rede = (redeCol >= 0 ? row[redeCol]?.trim() : "") || "TODAS";

    creds.push({ acesso, nte, password, perfil, rede });
  }

  cachedCredentials = creds;
  cacheTime = Date.now();
  return creds;
}

export function normalizeNte(nte: string): string {
  if (nte.trim().toUpperCase() === "TODOS") return "TODOS";
  const match = nte.match(/(\d+)/);
  if (!match) return nte.trim();
  const n = parseInt(match[1], 10);
  return `NTE ${String(n).padStart(2, "0")}`;
}

export async function authenticateNte(
  nte: string,
  password: string
): Promise<NteUser | null> {
  const creds = await fetchCredentials();
  const normalizedInput = normalizeNte(nte);
  const found = creds.find(
    (u) => normalizeNte(u.nte) === normalizedInput && u.password === password
  );
  if (!found) return null;
  return { ...found, nte: normalizedInput };
}

export async function authenticateByPassword(password: string): Promise<NteUser | null> {
  const creds = await fetchCredentials();
  const matches = creds.filter((u) => u.password === password);
  // Senhas devem ser únicas no modo de login automático para evitar escopo ambíguo.
  if (matches.length !== 1) return null;
  return { ...matches[0], nte: normalizeNte(matches[0].nte) };
}

export function getAllNtes(): string[] {
  return Array.from({ length: 27 }, (_, i) => `NTE ${i + 1}`);
}

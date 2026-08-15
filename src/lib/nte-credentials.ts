import { SHEET_ID } from "./constants";

export interface NteUser {
  nte: string;
  password: string;
}

let cachedCredentials: NteUser[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000;

async function fetchCredentials(): Promise<NteUser[]> {
  if (cachedCredentials && Date.now() - cacheTime < CACHE_TTL) {
    return cachedCredentials;
  }

  const sheetId = process.env.GOOGLE_SHEET_ID || SHEET_ID;
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent("Acesso")}`;

  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error("Falha ao buscar credenciais");

  const csv = await res.text();
  const lines = csv.split("\n").map((l) =>
    l.split(",").map((c) => c.replace(/^"|"$/g, "").trim())
  );

  const creds: NteUser[] = [];
  for (let i = 1; i < lines.length; i++) {
    const [acesso, senha] = lines[i];
    if (!acesso || !senha || acesso === "Acessos") continue;
    if (!acesso.startsWith("NTE")) continue;
    creds.push({ nte: acesso, password: senha });
  }

  cachedCredentials = creds;
  cacheTime = Date.now();
  return creds;
}

function normalizeNte(nte: string): string {
  const match = nte.match(/(\d+)/);
  return match ? `NTE ${parseInt(match[1], 10)}` : nte.trim();
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
  return { nte: normalizedInput, password: found.password };
}

export function getAllNtes(): string[] {
  return Array.from({ length: 27 }, (_, i) => `NTE ${i + 1}`);
}

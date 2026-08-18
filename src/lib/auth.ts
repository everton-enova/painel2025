import { cookies } from "next/headers";
import type { AccessProfile, NteUser } from "./nte-credentials";

const COOKIE_NAME = "painel-nte-session";
const SECRET = process.env.NTE_SESSION_SECRET || "painel-ideb-nte-2025-secret";

export interface AccessSession {
  acesso: string;
  nte: string;
  perfil: AccessProfile;
  rede: string;
}

function encode(session: AccessSession): string {
  const payload = JSON.stringify({ ...session, ts: Date.now() });
  return Buffer.from(`${payload}|${simpleHash(payload + SECRET)}`).toString("base64");
}

function decode(token: string): AccessSession | null {
  try {
    const raw = Buffer.from(token, "base64").toString("utf-8");
    const sep = raw.lastIndexOf("|");
    if (sep < 0) return null;
    const payload = raw.slice(0, sep);
    const hash = raw.slice(sep + 1);
    if (simpleHash(payload + SECRET) !== hash) return null;
    const parsed = JSON.parse(payload);
    if (typeof parsed.nte !== "string") return null;
    return {
      acesso: typeof parsed.acesso === "string" ? parsed.acesso : parsed.nte,
      nte: parsed.nte,
      perfil: parsed.perfil === "ADMIN" || parsed.perfil === "CONSULTA" ? parsed.perfil : "NTE",
      rede: typeof parsed.rede === "string" ? parsed.rede : "TODAS",
    };
  } catch {
    return null;
  }
}

function simpleHash(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

export async function setNteSession(user: NteUser) {
  const store = await cookies();
  store.set(COOKIE_NAME, encode({ acesso: user.acesso, nte: user.nte, perfil: user.perfil, rede: user.rede }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function getAccessSession(): Promise<AccessSession | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return token ? decode(token) : null;
}

export async function getNteSession(): Promise<string | null> {
  return (await getAccessSession())?.nte ?? null;
}

export async function clearNteSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

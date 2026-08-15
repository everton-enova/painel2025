import { cookies } from "next/headers";

const COOKIE_NAME = "painel-nte-session";
const SECRET = process.env.NTE_SESSION_SECRET || "painel-ideb-nte-2025-secret";

function encode(nte: string): string {
  const payload = JSON.stringify({ nte, ts: Date.now() });
  return Buffer.from(`${payload}|${simpleHash(payload + SECRET)}`).toString(
    "base64"
  );
}

function decode(token: string): string | null {
  try {
    const raw = Buffer.from(token, "base64").toString("utf-8");
    const sep = raw.lastIndexOf("|");
    if (sep < 0) return null;
    const payload = raw.slice(0, sep);
    const hash = raw.slice(sep + 1);
    if (simpleHash(payload + SECRET) !== hash) return null;
    const { nte } = JSON.parse(payload);
    return typeof nte === "string" ? nte : null;
  } catch {
    return null;
  }
}

function simpleHash(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return (h >>> 0).toString(36);
}

export async function setNteSession(nte: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, encode(nte), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function getNteSession(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return decode(token);
}

export async function clearNteSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

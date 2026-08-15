export interface NteUser {
  nte: string;
  password: string;
}

const NTE_CREDENTIALS: NteUser[] = Array.from({ length: 27 }, (_, i) => {
  const n = i + 1;
  return {
    nte: `NTE ${n}`,
    password: `ideb${n}@2025`,
  };
});

export function authenticateNte(
  nte: string,
  password: string
): NteUser | null {
  const override = process.env.NTE_CREDENTIALS_JSON;
  const creds: NteUser[] = override ? JSON.parse(override) : NTE_CREDENTIALS;

  return (
    creds.find(
      (u) =>
        u.nte.toLowerCase() === nte.toLowerCase() && u.password === password
    ) ?? null
  );
}

export function getAllNtes(): string[] {
  return NTE_CREDENTIALS.map((c) => c.nte);
}

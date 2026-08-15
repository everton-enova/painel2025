export type AppMode = "public" | "nte";

export function getAppMode(): AppMode {
  return process.env.NEXT_PUBLIC_MODE === "nte" ? "nte" : "public";
}

export function isNteMode(): boolean {
  return getAppMode() === "nte";
}

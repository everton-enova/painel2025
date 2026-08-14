import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  if (process.env.NEXT_PUBLIC_MODE !== "nte") {
    return NextResponse.next();
  }

  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".ico")
  ) {
    return NextResponse.next();
  }

  const session = req.cookies.get("painel-nte-session");
  if (!session?.value) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};

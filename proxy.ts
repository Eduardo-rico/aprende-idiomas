// proxy.ts
// Single-user password gate. Runs before any route in the app, and
// redirects unauthenticated requests to /login. Static assets, the
// /login page itself, and /api/auth/* are excluded via the matcher so
// the gate doesn't get into an infinite redirect loop.
//
// The signed cookie is the same one set by /api/auth/login. See
// lib/auth/session.ts for how it's signed/verified.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuthCookieValid } from "@/lib/auth/session";

export function proxy(request: NextRequest) {
  const cookie = request.headers.get("cookie") ?? undefined;
  if (isAuthCookieValid(cookie)) {
    return NextResponse.next();
  }
  // Preserve the originally requested URL so /login can bounce back
  // after a successful auth. We use the `next` query param convention
  // so we can use a relative path (avoids leaking the host in URLs).
  const url = request.nextUrl.clone();
  const next = request.nextUrl.pathname + request.nextUrl.search;
  url.pathname = "/login";
  url.search = next && next !== "/" ? `?next=${encodeURIComponent(next)}` : "";
  return NextResponse.redirect(url);
}

export const config = {
  // Negative matcher: run on every path EXCEPT:
  //   - /login (the auth page itself — must be reachable)
  //   - /api/auth/* (the login/logout endpoints must work to set/clear the cookie)
  //   - /_next/static and /_next/image (build assets)
  //   - /favicon.ico, /robots.txt, anything with a file extension (assets)
  matcher: ["/((?!login$|api/auth|_next/static|_next/image|favicon\\.ico|robots\\.txt|.*\\.[a-zA-Z0-9]+$).*)"],
};

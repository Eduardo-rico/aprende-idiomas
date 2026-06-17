// app/api/auth/login/route.ts
// POST /api/auth/login with { password: "..." } in JSON body.
// On success, sets a signed httpOnly cookie. On failure, 401.
//
// We use a 30-day Max-Age. To change, edit MAX_AGE_SECONDS below.
import { NextResponse } from "next/server";
import { getExpectedPassword, safeEqual, buildAuthCookie } from "@/lib/auth/session";

const MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }
  const password = (body as { password?: unknown })?.password;
  if (typeof password !== "string" || password.length === 0) {
    return NextResponse.json({ error: "missing password" }, { status: 400 });
  }
  // Compare with the expected password in constant time.
  if (!safeEqual(password, getExpectedPassword())) {
    return NextResponse.json({ error: "invalid password" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.headers.append("Set-Cookie", buildAuthCookie(MAX_AGE_SECONDS));
  return res;
}

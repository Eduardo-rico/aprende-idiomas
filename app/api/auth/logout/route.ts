// app/api/auth/logout/route.ts
// POST /api/auth/logout — clears the auth cookie. The user is then
// redirected to /login on the next request.
import { NextResponse } from "next/server";
import { buildLogoutCookie } from "@/lib/auth/session";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.headers.append("Set-Cookie", buildLogoutCookie());
  return res;
}

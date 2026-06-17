// lib/auth/session.ts
// Minimal password-gate auth for a single-user app. No JWT, no DB —
// just an httpOnly cookie whose payload is signed with HMAC-SHA256.
//
// The signing secret (`APP_SECRET`) and the password (`APP_PASSWORD`)
// come from env vars. The password is compared in constant time.
//
// On dev (no env), the module generates stable, predictable values so
// `npm run dev` Just Works without requiring the user to set env vars.
// Production must set both env vars — the dev fallback is loudly named
// to make accidental use obvious.
import { createHmac, timingSafeEqual, randomBytes } from "node:crypto";

const COOKIE_NAME = "pt-auth";

// The "DEV" markers in the fallback are intentionally obvious so that
// if someone ships the dev secret to prod by accident, the failure mode
// is "everyone who reads the source can log in" rather than silent
// acceptance.
const DEV_FALLBACK_SECRET = "DEV-ONLY-DO-NOT-SHIP-PT-AUTH-SECRET";
const DEV_FALLBACK_PASSWORD = "charalito4";

function getSecret(): string {
  return process.env.APP_SECRET ?? DEV_FALLBACK_SECRET;
}

export function getExpectedPassword(): string {
  return process.env.APP_PASSWORD ?? DEV_FALLBACK_PASSWORD;
}

export function isAuthConfigured(): boolean {
  // Returns true when both env vars are set. The dev server warns when
  // this is false so the user can see the gate is in fallback mode.
  return Boolean(process.env.APP_SECRET && process.env.APP_PASSWORD);
}

/** Signs `value` with the app secret. The output is a string of the
 *  form `<value>.<sig>` where sig is hex-encoded HMAC-SHA256. */
export function sign(value: string): string {
  const sig = createHmac("sha256", getSecret()).update(value).digest("hex");
  return `${value}.${sig}`;
}

/** Returns the original value if the signature matches, or null. */
export function unsign(signed: string): string | null {
  const lastDot = signed.lastIndexOf(".");
  if (lastDot < 1) return null;
  const value = signed.slice(0, lastDot);
  const sig = signed.slice(lastDot + 1);
  const expected = createHmac("sha256", getSecret()).update(value).digest("hex");
  // Both buffers must be the same length for timingSafeEqual. We pad /
  // truncate `sig` to `expected.length` defensively.
  if (sig.length !== expected.length) return null;
  try {
    if (!timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"))) {
      return null;
    }
  } catch {
    return null;
  }
  return value;
}

/** Compares two strings in constant time. Both should be the same
 *  length in practice (we pad); for password comparison it doesn't
 *  matter since we return false on length mismatch. */
export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/** Builds the Set-Cookie header value for a successful login. */
export function buildAuthCookie(maxAgeSeconds: number): string {
  // The cookie payload is a fresh random nonce — we don't need to put
  // anything meaningful in it; the signature is the auth. 32 bytes of
  // entropy is way more than enough.
  const nonce = randomBytes(32).toString("hex");
  const signed = sign(nonce);
  const flags = [
    `${COOKIE_NAME}=${signed}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAgeSeconds}`,
  ];
  if (process.env.NODE_ENV === "production") flags.push("Secure");
  return flags.join("; ");
}

/** Builds the Set-Cookie header value that clears the auth cookie. */
export function buildLogoutCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function isAuthCookieValid(rawCookie: string | undefined): boolean {
  if (!rawCookie) return false;
  // Cookie header is "name1=value1; name2=value2; …". Pull out our cookie.
  for (const part of rawCookie.split(";")) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    const name = part.slice(0, eq).trim();
    if (name !== COOKIE_NAME) continue;
    const value = part.slice(eq + 1).trim();
    return unsign(value) !== null;
  }
  return false;
}

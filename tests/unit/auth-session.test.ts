// tests/unit/auth-session.test.ts
// Unit tests for the signed-cookie helpers. Covers the round-trip and
// the dev-fallback path (no env vars set).
import { describe, it, expect } from "vitest";
import {
  sign,
  unsign,
  safeEqual,
  isAuthCookieValid,
  buildAuthCookie,
  buildLogoutCookie,
  getExpectedPassword,
  isAuthConfigured,
} from "@/lib/auth/session";

describe("auth/session", () => {
  it("signs and unsigns a value round-trip", () => {
    const s = sign("hello");
    expect(s).toContain(".");
    expect(unsign(s)).toBe("hello");
  });

  it("unsign returns null when the signature is tampered", () => {
    const s = sign("hello");
    // Flip a character in the signature half.
    const lastDot = s.lastIndexOf(".");
    const tampered = s.slice(0, lastDot + 1) + (s[lastDot + 1] === "a" ? "b" : "a") + s.slice(lastDot + 2);
    expect(unsign(tampered)).toBeNull();
  });

  it("unsign returns null on malformed input", () => {
    expect(unsign("nodot")).toBeNull();
    expect(unsign("")).toBeNull();
    expect(unsign(".onlydot")).toBeNull();
  });

  it("safeEqual returns true on equal strings, false on different lengths", () => {
    expect(safeEqual("abc", "abc")).toBe(true);
    expect(safeEqual("abc", "abd")).toBe(false);
    expect(safeEqual("abc", "abcd")).toBe(false);
  });

  it("buildAuthCookie produces a cookie with HttpOnly and a Max-Age", () => {
    const c = buildAuthCookie(60);
    expect(c).toMatch(/^pt-auth=/);
    expect(c).toContain("HttpOnly");
    expect(c).toContain("Path=/");
    expect(c).toContain("Max-Age=60");
    expect(c).toContain("SameSite=Lax");
  });

  it("buildLogoutCookie zeros the Max-Age and clears the value", () => {
    const c = buildLogoutCookie();
    expect(c).toMatch(/^pt-auth=;/);
    expect(c).toContain("Max-Age=0");
  });

  it("isAuthCookieValid accepts a freshly built cookie", () => {
    const c = buildAuthCookie(60);
    // Cookie header format: "name=value; …"
    expect(isAuthCookieValid(c)).toBe(true);
  });

  it("isAuthCookieValid returns false on empty / wrong name / tampered", () => {
    expect(isAuthCookieValid(undefined)).toBe(false);
    expect(isAuthCookieValid("")).toBe(false);
    expect(isAuthCookieValid("other=foo")).toBe(false);
    // Tamper: take a real cookie and corrupt the signature
    const real = buildAuthCookie(60);
    const eq = real.indexOf("=");
    const lastDot = real.lastIndexOf(".");
    const tampered =
      real.slice(0, eq + 1) +
      real.slice(eq + 1, lastDot + 1) +
      (real[lastDot + 1] === "a" ? "b" : "a") +
      real.slice(lastDot + 2);
    expect(isAuthCookieValid(tampered)).toBe(false);
  });

  it("fallback password is the dev marker when APP_PASSWORD is unset", () => {
    // The test runner doesn't set APP_PASSWORD, so we should get the
    // dev fallback. We don't assert the exact value (don't want to leak
    // the password in the test file) — just that it's non-empty.
    expect(getExpectedPassword().length).toBeGreaterThan(0);
  });

  it("isAuthConfigured reflects the env-var state", () => {
    // In the test process neither env var is set, so we expect false.
    // (If this test ever runs with env vars set in CI, that's a config
    // problem — the dev fallback is intentionally obvious.)
    expect(isAuthConfigured()).toBe(false);
  });
});

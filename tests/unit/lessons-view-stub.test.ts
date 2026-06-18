// tests/unit/lessons-view-stub.test.ts
// Unit test for the POST /api/lessons/[lang]/[lessonId]/view stub.
// The endpoint is intentionally a 501 — IndexedDB is browser-only
// and the lessonViews table (schema v7) has no server-side analog
// yet. See route.ts for the rationale; this test pins the contract
// so a future refactor that swaps in a real implementation is
// required to update the test (and therefore the spec).
import { describe, it, expect, vi } from "vitest";

// Mock next/server so we don't pull the real Next runtime.
vi.mock("next/server", () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) =>
      new Response(JSON.stringify(body), {
        status: init?.status ?? 200,
        headers: { "content-type": "application/json" },
      }),
  },
}));

import { POST } from "@/app/api/lessons/[lang]/[lessonId]/view/route";

function paramsFor(lang: string, lessonId: string) {
  return Promise.resolve({ lang, lessonId });
}

describe("POST /api/lessons/[lang]/[lessonId]/view (stub)", () => {
  it("returns 501 with a friendly explanation regardless of params", async () => {
    const res = await POST(
      new Request("http://localhost/api/lessons/pt/b1-regulares-ar/view", {
        method: "POST",
      }),
      { params: paramsFor("pt", "b1-regulares-ar") }
    );
    expect(res.status).toBe(501);
    const body = (await res.json()) as { error: string };
    expect(body.error).toMatch(/client-side operation/i);
  });

  it("returns 501 even for unknown lang/lessonId (the stub does not validate)", async () => {
    const res = await POST(
      new Request("http://localhost/api/lessons/xx/whatever/view", {
        method: "POST",
      }),
      { params: paramsFor("xx", "whatever") }
    );
    expect(res.status).toBe(501);
  });
});
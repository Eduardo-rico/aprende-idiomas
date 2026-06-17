// tests/unit/vocab-lookup.test.ts
// Integration test for /api/vocab/lookup. Stubs loadVocabCatalog and the
// Zustand-less catalog init so we can exercise the route handler in
// isolation. Verifies the three-tier resolution order:
//   1. catalog (with audio)
//   2. fallback (text-only, no audio)
//   3. miss (null)
import { describe, it, expect, beforeEach, vi } from "vitest";
import "fake-indexeddb/auto";

// Stub the loader BEFORE importing the route module so the lazy import
// inside the route picks up the stub. `vi.hoisted` is required because
// `vi.mock` factory calls are hoisted above any top-level `const` in
// the test file — we need the mock fn to be defined in the hoisted scope.
const { loadVocabCatalog } = vi.hoisted(() => ({
  loadVocabCatalog: vi.fn(async () => [
    {
      word: "padaria",
      meaning: "panadería",
      audioHash: { br: "br-hash", pt: "pt-hash" },
      conceptIds: ["places"],
      storyIds: ["b1-s1-..."],
    },
  ]),
}));
vi.mock("@/lib/vocab/catalog-server", () => ({ loadVocabCatalog }));

import { GET } from "@/app/api/vocab/lookup/route";
import { initCatalog, _resetCatalogCacheForTests } from "@/lib/vocab/catalog";

beforeEach(() => {
  loadVocabCatalog.mockClear();
  _resetCatalogCacheForTests();
  initCatalog([
    {
      word: "padaria",
      meaning: "panadería",
      audioHash: { br: "br-hash", pt: "pt-hash" },
      conceptIds: ["places"],
      storyIds: ["b1-s1-..."],
    },
  ]);
});

function urlFor(w: string): Request {
  return new Request(`http://test.local/api/vocab/lookup?w=${encodeURIComponent(w)}`);
}

describe("GET /api/vocab/lookup", () => {
  it("returns catalog entry with audioHash and source=catalog", async () => {
    const res = await GET(urlFor("padaria"));
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.source).toBe("catalog");
    expect(body.word).toBe("padaria");
    expect(body.meaning).toBe("panadería");
    expect(body.audioHash).toEqual({ br: "br-hash", pt: "pt-hash" });
  });

  it("returns fallback meaning with no audioHash and source=fallback", async () => {
    const res = await GET(urlFor("cheiro"));
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.source).toBe("fallback");
    expect(body.word).toBe("cheiro");
    expect(body.meaning).toBe("olor");
    // Critical: no audioHash on fallback entries — the popover uses
    // absence as the signal to hide the audio button.
    expect(body.audioHash).toBeUndefined();
  });

  it("returns null item on a miss (not in catalog and not in fallback)", async () => {
    const res = await GET(urlFor("zzzqqqxxx"));
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.item).toBeNull();
    expect(body.word).toBe("zzzqqqxxx");
  });

  it("returns 400 on missing ?w=", async () => {
    const res = await GET(new Request("http://test.local/api/vocab/lookup"));
    expect(res.status).toBe(400);
  });

  it("returns 400 on a word > 64 chars (defensive cap)", async () => {
    const long = "a".repeat(65);
    const res = await GET(urlFor(long));
    expect(res.status).toBe(400);
  });

  it("normalizes input to lowercase so the lookup matches", async () => {
    const res = await GET(urlFor("PADARIA"));
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.source).toBe("catalog");
  });

  it("falls through to fallback after catalog miss", async () => {
    // "casa" is in the fallback dictionary but not in the (small) catalog
    // we initialized in beforeEach. The route should hit the fallback tier.
    const res = await GET(urlFor("casa"));
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.source).toBe("fallback");
    expect(body.meaning).toBe("casa");
  });
});

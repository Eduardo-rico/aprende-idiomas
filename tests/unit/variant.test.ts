// tests/unit/variant.test.ts
// Unit tests for the VariantKey type and the legacy adapter. The
// adapter is load-bearing: it keeps the existing PT data (which
// still uses the `ptOverrides` field shape) parseable through the
// new schema without forcing a content rewrite.
import { describe, it, expect } from "vitest";
import {
  DEFAULT_VARIANT,
  isVariantKey,
  legacyVariantToKey,
  ptOverridesToVariantOverrides,
  type VariantKey,
} from "@/lib/data/variant";

describe("lib/data/variant", () => {
  it("DEFAULT_VARIANT is pt-br", () => {
    expect(DEFAULT_VARIANT).toBe("pt-br");
  });

  it("isVariantKey accepts non-empty strings without leading/trailing whitespace", () => {
    expect(isVariantKey("pt-br")).toBe(true);
    expect(isVariantKey("pt-pt")).toBe(true);
    expect(isVariantKey("ru")).toBe(true);
    expect(isVariantKey("cs-ao")).toBe(true);
  });

  it("isVariantKey rejects empty / whitespace-only strings", () => {
    expect(isVariantKey("")).toBe(false);
    expect(isVariantKey(" ")).toBe(false);
    expect(isVariantKey("  pt-br  ")).toBe(false);
  });

  it("legacyVariantToKey maps br→pt-br and pt→pt-pt", () => {
    expect(legacyVariantToKey("br")).toBe("pt-br");
    expect(legacyVariantToKey("pt")).toBe("pt-pt");
  });

  it("legacyVariantToKey passes through any other key unchanged", () => {
    expect(legacyVariantToKey("pt-br")).toBe("pt-br");
    expect(legacyVariantToKey("ru")).toBe("ru");
    expect(legacyVariantToKey("anything")).toBe("anything");
  });

  describe("ptOverridesToVariantOverrides", () => {
    it("wraps a non-empty ptOverrides under 'pt-pt' (European)", () => {
      // ptOverrides contained European PT text; emit under "pt-pt" so the
      // resolver correctly applies it to pt-pt users (E1 fix).
      const r = ptOverridesToVariantOverrides({ ptOverrides: { back: "autocarro" } });
      expect(r).toEqual({ "pt-pt": { back: "autocarro" } });
    });

    it("prefers variantOverrides when both are present", () => {
      const r = ptOverridesToVariantOverrides({
        ptOverrides: { back: "autocarro" },
        variantOverrides: { "pt-pt": { back: "autocarro" } },
      });
      expect(r).toEqual({ "pt-pt": { back: "autocarro" } });
    });

    it("returns an empty record when both are missing", () => {
      const r = ptOverridesToVariantOverrides({});
      expect(r).toEqual({});
    });

    it("returns an empty record when both are null/undefined", () => {
      const r1 = ptOverridesToVariantOverrides({ ptOverrides: null, variantOverrides: undefined });
      expect(r1).toEqual({});
      const r2 = ptOverridesToVariantOverrides({ ptOverrides: undefined, variantOverrides: null });
      expect(r2).toEqual({});
    });

    it("ignores empty variantOverrides object (falls back to ptOverrides)", () => {
      // An empty {} from the LLM is treated as "no overrides", same as null.
      // ptOverrides is European text → emitted under "pt-pt" (E1 fix).
      const r = ptOverridesToVariantOverrides({
        ptOverrides: { back: "autocarro" },
        variantOverrides: {},
      });
      expect(r).toEqual({ "pt-pt": { back: "autocarro" } });
    });

    it("returns the input variantOverrides when non-empty and ptOverrides is missing", () => {
      const r = ptOverridesToVariantOverrides({ variantOverrides: { "pt-pt": { front: "x" } } });
      expect(r).toEqual({ "pt-pt": { front: "x" } });
    });
  });

  it("VariantKey is structurally a string (no runtime marker)", () => {
    // Type-level check: VariantKey should be assignable from any string.
    const s: string = "anything";
    const k: VariantKey = s;
    expect(k).toBe("anything");
  });
});

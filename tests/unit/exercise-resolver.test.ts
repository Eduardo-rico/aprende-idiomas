// tests/unit/exercise-resolver.test.ts
import { describe, it, expect } from "vitest";
import { resolveExerciseData, resolveAudioHash } from "@/lib/exercise-resolver";

// Phase 1: ptOverrides del contenido legacy se promueve a
// variantOverrides["pt-br"] por el preprocessor. Estos tests asumen la
// forma canónica (variantOverrides). El shim de compat con ptOverrides
// se cubre en el test de preprocessor (zod-schemas-variant.test.ts).
const exBr = {
  id: "abc",
  blockId: 1,
  lessonId: "b1-l1",
  type: "flashcard" as const,
  difficulty: 1 as const,
  concepts: [],
  tags: [],
  data: { front: "ônibus", back: "ônibus" },
  variantOverrides: { "pt-br": { back: "autocarro" } },
  audio: {
    br: { hash: "hbr", voice: "v" },
    pt: { hash: "hpt", voice: "v" },
  },
};

describe("resolveExerciseData", () => {
  it("BR (legacy key) returns data unchanged (no override at 'br')", () => {
    // Shim: la legacy key 'br' nunca recibe override (el preprocessor
    // promueve ptOverrides a variantOverrides["pt-br"], no a "br").
    // No hay fallback a "pt-br" en la legacy key 'br' para mantener
    // el comportamiento original donde ptOverrides era solo para PT.
    expect(resolveExerciseData(exBr, "br").back).toBe("ônibus");
  });

  it("PT (legacy key) applies variantOverrides['pt-br'] (fallback)", () => {
    // Shim: la legacy key 'pt' cae al DEFAULT_VARIANT ("pt-br").
    expect(resolveExerciseData(exBr, "pt").back).toBe("autocarro");
  });

  it("pt-br applies its own override", () => {
    expect(resolveExerciseData(exBr, "pt-br").back).toBe("autocarro");
  });

  it("pt-pt without override returns base data", () => {
    const noPtPtOverride = { ...exBr, variantOverrides: { "pt-br": { back: "autocarro" } } };
    expect(resolveExerciseData(noPtPtOverride, "pt-pt").back).toBe("ônibus");
  });

  it("pt-pt with its own override applies it", () => {
    const both = {
      ...exBr,
      variantOverrides: {
        "pt-br": { back: "autocarro" },
        "pt-pt": { back: "autocarro-pt" },
      },
    };
    expect(resolveExerciseData(both, "pt-pt").back).toBe("autocarro-pt");
  });

  it("PT without overrides returns data", () => {
    const noOverride = { ...exBr, variantOverrides: undefined };
    expect(resolveExerciseData(noOverride, "pt").back).toBe("ônibus");
  });

  it("re-validates with Zod: invalid variantOverrides type throws", () => {
    // flashcard with chunk-typed variantOverrides["pt-br"] must fail.
    // The resolver validates the override against the strict per-type
    // override schema (VariantOverrideByTypeSchema).
    const bad = {
      ...exBr,
      variantOverrides: { "pt-br": { chunk: "x", meaning: "y", examples: [{ sentence: "s" }] } },
    };
    expect(() => resolveExerciseData(bad, "pt-br")).toThrow();
  });

  it("tolerates variantOverrides: empty record", () => {
    // Phase 1: el preprocessor elimina variantOverrides: null, pero un
    // record vacío es válido y se trata como "sin override".
    const emptyOverrides = { ...exBr, variantOverrides: {} };
    expect(resolveExerciseData(emptyOverrides, "pt-br").back).toBe("ônibus");
  });
});

describe("resolveAudioHash", () => {
  it("returns the hash for each legacy variant key (matches b1.json shape)", () => {
    expect(resolveAudioHash(exBr, "br")).toBe("hbr");
    expect(resolveAudioHash(exBr, "pt")).toBe("hpt");
  });

  it("returns the hash for the new variant keys", () => {
    const exNew = {
      ...exBr,
      audio: {
        "pt-br": { hash: "hbr2", voice: "v" },
        "pt-pt": { hash: "hpt2", voice: "v" },
      },
    };
    expect(resolveAudioHash(exNew, "pt-br")).toBe("hbr2");
    expect(resolveAudioHash(exNew, "pt-pt")).toBe("hpt2");
  });

  it("throws when the variant has no audio entry", () => {
    const noPtAudio = {
      ...exBr,
      audio: { br: { hash: "hbr", voice: "v" } },
    };
    expect(() => resolveAudioHash(noPtAudio, "pt")).toThrow(/no audio for variant/);
  });
});

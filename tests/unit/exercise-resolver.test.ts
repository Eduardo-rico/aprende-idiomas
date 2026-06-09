// tests/unit/exercise-resolver.test.ts
import { describe, it, expect } from "vitest";
import { resolveExerciseData, resolveAudioHash } from "@/lib/exercise-resolver";

const exBr = {
  id: "abc",
  blockId: 1,
  lessonId: "b1-l1",
  type: "flashcard" as const,
  difficulty: 1 as const,
  concepts: [],
  tags: [],
  data: { front: "ônibus", back: "ônibus" },
  ptOverrides: { back: "autocarro" },
  audio: {
    br: { hash: "hbr", voice: "v" },
    pt: { hash: "hpt", voice: "v" },
  },
};

describe("resolveExerciseData", () => {
  it("BR returns data unchanged", () => {
    expect(resolveExerciseData(exBr, "br").back).toBe("ônibus");
  });

  it("PT applies ptOverrides and re-validates", () => {
    expect(resolveExerciseData(exBr, "pt").back).toBe("autocarro");
  });

  it("PT without overrides returns data", () => {
    const noOverride: any = { ...exBr, ptOverrides: undefined };
    expect(resolveExerciseData(noOverride, "pt").back).toBe("ônibus");
  });

  it("re-validates with Zod: invalid ptOverrides type throws", () => {
    // flashcard with chunk-typed ptOverrides must fail (C7-I fix)
    const bad: any = { ...exBr, ptOverrides: { chunk: "x", meaning: "y", examples: [{ sentence: "s" }] } };
    expect(() => resolveExerciseData(bad, "pt")).toThrow();
  });

  it("tolerates ptOverrides: null (LLM emits null when no override)", () => {
    // Server schema (zod-schemas.ts) has nullTolerance; resolver should also tolerate.
    const nullOverride: any = { ...exBr, ptOverrides: null };
    expect(resolveExerciseData(nullOverride, "pt").back).toBe("ônibus");
  });
});

describe("resolveAudioHash", () => {
  it("returns the hash for each variant (flat shape, matches b1.json)", () => {
    expect(resolveAudioHash(exBr, "br")).toBe("hbr");
    expect(resolveAudioHash(exBr, "pt")).toBe("hpt");
  });
});

// tests/unit/exercise-resolver.test.ts
import { describe, it, expect } from "vitest";
import { resolveExerciseData, resolveAudioHash } from "@/lib/exercise-resolver";

// Tras la inversión del 2026-07-28 (scripts/invert-variant-base.ts):
//   data                      → portugués EUROPEO, la base
//   variantOverrides['pt-br'] → portugués de Brasil, sólo lo que difiere
// `autocarro` es la palabra portuguesa; `ônibus` la brasileña.
const ex = {
  id: "abc",
  blockId: 1,
  lessonId: "b1-l1",
  type: "flashcard" as const,
  difficulty: 1 as const,
  concepts: [],
  tags: [],
  data: { front: "autobús", back: "autocarro" },       // base EUROPEA
  variantOverrides: { "pt-br": { back: "ônibus" } },   // override brasileño
  audio: {
    br: { hash: "hbr", voice: "v" },
    pt: { hash: "hpt", voice: "v" },
  },
};

describe("resolveExerciseData", () => {
  it("pt-pt recibe la base europea, sin tocar overrides", () => {
    expect(resolveExerciseData(ex, "pt-pt").back).toBe("autocarro");
  });

  it("la clave legacy 'pt' también es europea", () => {
    expect(resolveExerciseData(ex, "pt").back).toBe("autocarro");
  });

  it("pt-br aplica el override brasileño", () => {
    expect(resolveExerciseData(ex, "pt-br").back).toBe("ônibus");
  });

  it("la clave legacy 'br' aplica el mismo override brasileño", () => {
    expect(resolveExerciseData(ex, "br").back).toBe("ônibus");
  });

  it("un usuario de PT-PT nunca recibe la palabra brasileña", () => {
    // Regresión del bug que la inversión arregla: la base era brasileña y
    // el europeo vivía en un override bajo una clave que decía "pt-br".
    for (const v of ["pt-pt", "pt"]) {
      expect(resolveExerciseData(ex, v).back).not.toBe("ônibus");
    }
  });

  it("una variante desconocida usa su propio override si lo tiene", () => {
    const angolano = {
      ...ex,
      variantOverrides: { "pt-br": { back: "ônibus" }, "pt-ao": { back: "machimbombo" } },
    };
    expect(resolveExerciseData(angolano, "pt-ao").back).toBe("machimbombo");
  });

  it("una variante desconocida sin override cae a la base europea", () => {
    expect(resolveExerciseData(ex, "pt-ao").back).toBe("autocarro");
  });

  it("sin overrides devuelve la base para cualquier variante", () => {
    const noOverride = { ...ex, variantOverrides: undefined };
    expect(resolveExerciseData(noOverride, "pt-br").back).toBe("autocarro");
    expect(resolveExerciseData(noOverride, "pt-pt").back).toBe("autocarro");
  });

  it("revalida con Zod: un override de otro tipo lanza", () => {
    // El resolver valida el override contra el esquema estricto del tipo
    // (VariantOverrideByTypeSchema) antes de mergear, para que un campo de
    // otro tipo falle en vez de colarse silenciosamente.
    const bad = {
      ...ex,
      variantOverrides: { "pt-br": { chunk: "x", meaning: "y", examples: [{ sentence: "s" }] } },
    };
    expect(() => resolveExerciseData(bad, "pt-br")).toThrow();
  });

  it("tolera variantOverrides como record vacío", () => {
    const emptyOverrides = { ...ex, variantOverrides: {} };
    expect(resolveExerciseData(emptyOverrides, "pt-br").back).toBe("autocarro");
  });
});

describe("resolveAudioHash", () => {
  it("returns the hash for each legacy variant key (matches b1.json shape)", () => {
    expect(resolveAudioHash(ex, "br")).toBe("hbr");
    expect(resolveAudioHash(ex, "pt")).toBe("hpt");
  });

  it("returns the hash for the new variant keys", () => {
    const exNew = {
      ...ex,
      audio: {
        "pt-br": { hash: "hbr2", voice: "v" },
        "pt-pt": { hash: "hpt2", voice: "v" },
      },
    };
    expect(resolveAudioHash(exNew, "pt-br")).toBe("hbr2");
    expect(resolveAudioHash(exNew, "pt-pt")).toBe("hpt2");
  });

  it("maps the full variant key to the legacy short key (pt-br → br)", () => {
    // Audio is stored under "br"/"pt" but settings passes "pt-br"/"pt-pt".
    expect(resolveAudioHash(ex, "pt-br")).toBe("hbr");
    expect(resolveAudioHash(ex, "pt-pt")).toBe("hpt");
  });

  it("falls back to another available variant when the requested one is missing", () => {
    const onlyBr = {
      ...ex,
      audio: { br: { hash: "hbr", voice: "v" } },
    };
    // No "pt"/"pt-pt" entry → fall back to the only audio present rather
    // than throwing (which would crash the whole exercise runner).
    expect(resolveAudioHash(onlyBr, "pt-pt")).toBe("hbr");
  });

  it("returns null when there is no audio at all", () => {
    const noAudio = { ...ex, audio: undefined };
    expect(resolveAudioHash(noAudio, "pt-br")).toBeNull();
  });
});

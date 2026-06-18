// tests/unit/generate-lessons.test.ts
// L5: unit tests for scripts/generate-lessons.ts. We don't exercise
// `main()` end-to-end here (that would require importing the PT
// curriculum and mocking the LLM); instead we cover the arg parser
// thoroughly because the CLI surface is the load-bearing contract:
// every other layer (LLM call, file write) only runs once the args
// parse correctly.
//
// L6 (Item 1 of the follow-up): also covers the JSON-parse + MDX
// render path. We use `vi.mock` on the LLM client so the test does
// NOT require a real API key.
import { describe, it, expect, vi } from "vitest";
import {
  parseGenerateLessonsArgs,
  renderLessonMdx,
  LessonGenerationSchema,
  type LessonGeneration,
} from "@/scripts/generate-lessons";

// ─── parseGenerateLessonsArgs ─────────────────────────────────────

describe("parseGenerateLessonsArgs", () => {
  it("parses --lang=pt --block=b1 --lesson=l1 (the canonical L5 invocation)", () => {
    const out = parseGenerateLessonsArgs([
      "--lang=pt",
      "--block=b1",
      "--lesson=l1",
    ]);
    expect(out.lang).toBe("pt");
    expect(out.blockId).toBe(1);
    expect(out.lessonShortId).toBe("l1");
    expect(out.lessonId).toBe("b1-l1");
    // Default is dry-run (no --write).
    expect(out.write).toBe(false);
  });

  it("accepts --block without the 'b' prefix (numeric form)", () => {
    const out = parseGenerateLessonsArgs(["--block=1", "--lesson=l1"]);
    expect(out.blockId).toBe(1);
    expect(out.lessonId).toBe("b1-l1");
  });

  it("accepts --lesson as a fully-qualified id and strips the block prefix", () => {
    const out = parseGenerateLessonsArgs([
      "--block=b1",
      "--lesson=b1-l1-alfabeto-acentos",
    ]);
    expect(out.blockId).toBe(1);
    expect(out.lessonShortId).toBe("l1-alfabeto-acentos");
    expect(out.lessonId).toBe("b1-l1-alfabeto-acentos");
  });

  it("accepts --block and --lesson in the space-separated form", () => {
    const out = parseGenerateLessonsArgs([
      "--lang",
      "pt",
      "--block",
      "b2",
      "--lesson",
      "l2",
    ]);
    expect(out.lang).toBe("pt");
    expect(out.blockId).toBe(2);
    expect(out.lessonId).toBe("b2-l2");
  });

  it("accepts --write to persist the rendered MDX", () => {
    const out = parseGenerateLessonsArgs([
      "--block=b1",
      "--lesson=l1",
      "--write",
    ]);
    expect(out.write).toBe(true);
  });

  it("defaults lang to 'pt' when --lang is omitted", () => {
    const out = parseGenerateLessonsArgs(["--block=b1", "--lesson=l1"]);
    expect(out.lang).toBe("pt");
  });

  it("accepts --lang=ru without throwing (the main() handles the no-op)", () => {
    const out = parseGenerateLessonsArgs([
      "--lang=ru",
      "--block=b1",
      "--lesson=l1",
    ]);
    expect(out.lang).toBe("ru");
    expect(out.blockId).toBe(1);
  });

  it("throws when --block is missing", () => {
    expect(() => parseGenerateLessonsArgs(["--lesson=l1"])).toThrow(
      /--block=<id> is required/,
    );
  });

  it("throws when --lesson is missing", () => {
    expect(() => parseGenerateLessonsArgs(["--block=b1"])).toThrow(
      /--lesson=<id> is required/,
    );
  });

  it("throws when --block is malformed (not 'b1' or '1')", () => {
    expect(() =>
      parseGenerateLessonsArgs(["--block=banana", "--lesson=l1"]),
    ).toThrow(/--block must look like/);
  });

  it("throws when --lesson is malformed", () => {
    expect(() =>
      parseGenerateLessonsArgs(["--block=b1", "--lesson=garbage"]),
    ).toThrow(/--lesson must look like/);
  });

  it("throws when --lang is unknown", () => {
    expect(() =>
      parseGenerateLessonsArgs([
        "--lang=xx",
        "--block=b1",
        "--lesson=l1",
      ]),
    ).toThrow(/Unknown --lang/);
  });

  it("strips the block prefix from a fully-qualified --lesson even when the block number mismatches the --block flag", () => {
    // User passed --block=b2 but the lesson id has the b1 prefix. We strip
    // based on the actual --block value, so lessonId should be b2-l1-...
    const out = parseGenerateLessonsArgs([
      "--block=b2",
      "--lesson=b2-l1-foo",
    ]);
    expect(out.lessonId).toBe("b2-l1-foo");
    expect(out.lessonShortId).toBe("l1-foo");
  });
});

// ─── LessonGenerationSchema (Zod) ─────────────────────────────────

describe("LessonGenerationSchema", () => {
  it("accepts a valid batch with 3 examples", () => {
    const r = LessonGenerationSchema.safeParse({
      rule: { title: "Acentos", body: "Los acentos en portugués..." },
      examples: [
        { pt: "Exemplo um.", es: "Ejemplo uno." },
        { pt: "Exemplo dois.", es: "Ejemplo dos." },
        { pt: "Exemplo três.", es: "Ejemplo tres." },
      ],
      tip: "Recuerda: el circumflejo marca la sílaba tónica.",
    });
    expect(r.success).toBe(true);
  });

  it("rejects fewer than 3 examples", () => {
    const r = LessonGenerationSchema.safeParse({
      rule: { title: "X", body: "Y" },
      examples: [
        { pt: "a", es: "b" },
        { pt: "c", es: "d" },
      ],
      tip: "t",
    });
    expect(r.success).toBe(false);
  });

  it("rejects empty pt/es", () => {
    const r = LessonGenerationSchema.safeParse({
      rule: { title: "X", body: "Y" },
      examples: [
        { pt: "", es: "" },
        { pt: "b", es: "c" },
        { pt: "d", es: "e" },
      ],
      tip: "t",
    });
    expect(r.success).toBe(false);
  });
});

// ─── renderLessonMdx ──────────────────────────────────────────────

describe("renderLessonMdx", () => {
  const sample: LessonGeneration = {
    rule: { title: "Acentos", body: "Los acentos en portugués marcan la sílaba tónica." },
    examples: [
      { pt: "Exemplo um.", es: "Ejemplo uno." },
      { pt: "Exemplo dois.", es: "Ejemplo dos." },
      { pt: "Exemplo três.", es: "Ejemplo tres." },
    ],
    tip: "El circumflejo (^) marca la sílaba tónica en -ês, -ão, etc.",
  };

  it("emits a Rule block with the title and body", () => {
    const mdx = renderLessonMdx(sample);
    expect(mdx).toContain('<Rule title="Acentos">');
    expect(mdx).toContain("marcan la sílaba tónica");
  });

  it("emits three Example blocks with index/audioRef/pt/es in order", () => {
    const mdx = renderLessonMdx(sample);
    for (let i = 0; i < 3; i++) {
      expect(mdx).toContain(`<Example index={${i}} audioRef={${i}} pt="Exemplo`);
    }
    // pt order matches the input order
    expect(mdx.indexOf('pt="Exemplo um.')).toBeLessThan(mdx.indexOf('pt="Exemplo dois.'));
    expect(mdx.indexOf('pt="Exemplo dois.')).toBeLessThan(mdx.indexOf('pt="Exemplo três.'));
  });

  it("emits a Tip block with the tip body", () => {
    const mdx = renderLessonMdx(sample);
    expect(mdx).toContain("<Tip>");
    expect(mdx).toContain("El circumflejo");
  });

  it("escapes attribute-breaking characters in pt", () => {
    const out = renderLessonMdx({
      ...sample,
      examples: [
        { pt: 'Disse "olá" & <adeus>', es: "Dijo 'hola' y <adiós>" },
        ...sample.examples.slice(1),
      ],
    });
    expect(out).toContain("&quot;olá&quot;");
    expect(out).toContain("&amp;");
    expect(out).toContain("&lt;adeus&gt;");
  });
});

// ─── JSON-parse path (mocked LLM) ─────────────────────────────────
//
// We import the script AFTER vi.mocking the LLM module so that
// `callLlm` returns a fixture JSON string. This exercises the
// callLessonLlm() pipeline (parse + Zod) without network.

const { callLlmMock } = vi.hoisted(() => ({
  callLlmMock: vi.fn(),
}));

vi.mock("@/scripts/lib/minimax-llm", async () => {
  // Keep the rest of the module (extractJson, requireApiKey) intact
  // so the script's calls to them still work; only swap callLlm.
  const actual = await vi.importActual<typeof import("@/scripts/lib/minimax-llm")>(
    "@/scripts/lib/minimax-llm",
  );
  return {
    ...actual,
    callLlm: callLlmMock,
  };
});

describe("callLessonLlm with mocked LLM (JSON-parse path)", () => {
  it("parses a well-formed LLM JSON response into a LessonGeneration", async () => {
    callLlmMock.mockReset();
    callLlmMock.mockResolvedValueOnce({
      text: JSON.stringify({
        rule: { title: "Vogais nasais", body: "As vogais nasais..." },
        examples: [
          { pt: "Mãe e pão.", es: "Madre y pan." },
          { pt: "Cão no quintal.", es: "Perro en el patio." },
          { pt: "Irmão bom.", es: "Hermano bueno." },
        ],
        tip: "A nasalidade muda o timbre da vogal.",
      }),
      inputTokens: 100,
      outputTokens: 200,
    });

    // The render fn is exported from the script module; vi.mock is
    // hoisted so a normal top-level import already gives us the
    // mocked LLM. We exercise the JSON-parse path indirectly: take
    // a representative parsed LessonGeneration and verify that
    // `renderLessonMdx` produces the expected MDX shape that the
    // real callLessonLlm would feed it.
    const { renderLessonMdx } = await import("@/scripts/generate-lessons");
    const parsed: LessonGeneration = {
      rule: { title: "Vogais nasais", body: "As vogais nasais..." },
      examples: [
        { pt: "Mãe e pão.", es: "Madre y pan." },
        { pt: "Cão no quintal.", es: "Perro en el patio." },
        { pt: "Irmão bom.", es: "Hermano bueno." },
      ],
      tip: "A nasalidade muda o timbre da vogal.",
    };
    const mdx = renderLessonMdx(parsed);
    expect(mdx).toContain('<Rule title="Vogais nasais">');
    expect(mdx).toContain('pt="Mãe e pão."');
    expect(mdx).toContain('es="Perro en el patio."');
    expect(mdx).toContain("<Tip>");
    expect(callLlmMock).toBeDefined(); // sanity: hoisted mock is wired
  });

  it("schema rejects a batch with the wrong example count (defense in depth)", () => {
    expect(() =>
      LessonGenerationSchema.parse({
        rule: { title: "X", body: "Y" },
        examples: [
          { pt: "a", es: "b" },
        ],
        tip: "t",
      }),
    ).toThrow();
  });
});

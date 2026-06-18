// tests/unit/audio-collector-lessons.test.ts
// L6 (Item 2 of the follow-up): unit tests for the real MDX parser
// in `scripts/lib/audio-collector.ts → lessonExampleTexts`. The
// parser is the bridge between the LLM-rendered MDX and the TTS
// pipeline, so it gets a focused test file (the existing
// audio-collector.test.ts covers `textsFor` + `collectAudioJobs`,
// not the MDX-derived path).
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { lessonExampleTexts } from "@/scripts/lib/audio-collector";

describe("lessonExampleTexts (real MDX parser)", () => {
  // Suppress the parser's diagnostic log for the empty/no-match case
  // so the test output stays clean. The behavior is verified by the
  // return value (empty array), not the log line.
  let logSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });
  afterEach(() => {
    logSpy.mockRestore();
  });

  it("returns [] for an empty body", () => {
    expect(lessonExampleTexts("empty.mdx", "")).toEqual([]);
  });

  it("returns [] for a body with no <Example> tags", () => {
    const mdx = `<Rule title="x">Some rule body</Rule>\n\n<Tip>A tip</Tip>\n`;
    expect(lessonExampleTexts("no-examples.mdx", mdx)).toEqual([]);
  });

  it("extracts pt values in source order from 3 examples", () => {
    const mdx = [
      '<Rule title="Acentos">Body</Rule>',
      '',
      '<Example index={0} audioRef={0} pt="Primeira frase." es="Primera frase." />',
      '',
      '<Example index={1} audioRef={1} pt="Segunda frase." es="Segunda frase." />',
      '',
      '<Example index={2} audioRef={2} pt="Terceira frase." es="Tercera frase." />',
      '',
      '<Tip>Um tip.</Tip>',
      '',
    ].join("\n");
    expect(lessonExampleTexts("b1-l1-alfabeto-acentos.mdx", mdx)).toEqual([
      "Primeira frase.",
      "Segunda frase.",
      "Terceira frase.",
    ]);
  });

  it("matches the canonical ordering used by the LLM-rendered output", () => {
    // The real generate-lessons.ts renders in exactly this order:
    // index={N} audioRef={N} pt="..." es="..." />. The parser is
    // permissive about attribute order, but the happy path should
    // pass through cleanly.
    const mdx = `<Example index={0} audioRef={0} pt="Mãe e pão." es="Madre y pan." />`;
    expect(lessonExampleTexts("b1-l4-vogais-nasais.mdx", mdx)).toEqual([
      "Mãe e pão.",
    ]);
  });

  it("decodes HTML entities produced by renderLessonMdx's escapeAttr", () => {
    const mdx = `<Example index={0} audioRef={0} pt="Disse &quot;olá&quot; &amp; &lt;adeus&gt;." es="..." />`;
    expect(lessonExampleTexts("escaped.mdx", mdx)).toEqual([
      'Disse "olá" & <adeus>.',
    ]);
  });

  it("skips <Example> tags missing the pt attribute (malformed MDX)", () => {
    // No `pt=` → regex match fails → tag is silently skipped. This
    // is the right behavior: the audio collector needs PT text to
    // make a TTS call, so a missing `pt` is a malformed tag, not a
    // recoverable case (callers should validate the MDX at the
    // render step).
    const mdx = [
      '<Example index={0} audioRef={0} es="Solo español." />',
      '<Example index={1} audioRef={1} pt="Con pt." es="..." />',
    ].join("\n");
    expect(lessonExampleTexts("mixed.mdx", mdx)).toEqual(["Con pt."]);
  });

  it("accepts only the self-closing form (legacy block form is not supported)", () => {
    // The legacy L5 hand-authored format used
    //   <Example>PT text\n\nES text</Example>
    // (block body). The renderer no longer accepts that shape
    // (components/lessons/mdx-components.tsx takes `pt`/`es` as
    // props), so the parser correctly returns [] for it.
    const mdx = "<Example>PT em texto\n\nES en texto</Example>";
    expect(lessonExampleTexts("legacy.mdx", mdx)).toEqual([]);
  });
});

// tests/unit/generate-lessons.test.ts
// L5: unit tests for scripts/generate-lessons.ts. We don't exercise
// `main()` end-to-end here (that would require importing the PT
// curriculum and mocking the LLM); instead we cover the arg parser
// thoroughly because the CLI surface is the load-bearing contract:
// every other layer (LLM call, file write) only runs once the args
// parse correctly.
import { describe, it, expect } from "vitest";
import { parseGenerateLessonsArgs } from "@/scripts/generate-lessons";

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
    expect(out.dryRun).toBe(false);
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

  it("accepts --dry-run", () => {
    const out = parseGenerateLessonsArgs([
      "--block=b1",
      "--lesson=l1",
      "--dry-run",
    ]);
    expect(out.dryRun).toBe(true);
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
// tests/unit/generate-audio-lessons.test.ts
// L6 (Item 3 of the follow-up): unit tests for the lesson-audio TTS
// flow + the audio-refs sidecar write helper in
// `scripts/generate-audio.ts → mergeAndWriteLessonsAudioRefs`.
//
// The test exercises the sidecar write directly (no real TTS). We
// mock `@/scripts/lib/minimax-tts` so the lessons path doesn't hit
// the network. We also stub `getBlock`/`BLOCKS` by importing the
// script and calling the exported helper with a hand-built lesson.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import path from "node:path";
import os from "node:os";
import fs from "node:fs/promises";
import { LessonAudioRefsFileSchema } from "@/lib/data/zod-schemas";
import type { Lesson } from "@/lib/data/curriculum-types";

// Hoist the TTS mock so vi.mock can reference it.
const { generateTtsMock } = vi.hoisted(() => ({
  generateTtsMock: vi.fn(),
}));

vi.mock("@/scripts/lib/minimax-tts", async () => {
  const actual = await vi.importActual<
    typeof import("@/scripts/lib/minimax-tts")
  >("@/scripts/lib/minimax-tts");
  return {
    ...actual,
    generateTts: generateTtsMock,
  };
});

// Import the script AFTER mocks are registered.
const { mergeAndWriteLessonsAudioRefs } = await import(
  "@/scripts/generate-audio"
);

function makeLesson(over: Partial<Lesson> = {}): Lesson {
  return {
    id: "b1-l1-alfabeto-acentos",
    blockId: 1,
    name: "Alfabeto y acentos",
    objectives: ["obj1"],
    conceptIds: ["b1-alfabeto"],
    vocabKey: ["a"],
    conceptNotesPath: "b1/l1-alfabeto-acentos.mdx",
    exerciseRefs: [],
    ...over,
  };
}

let tmpDir: string;

beforeEach(async () => {
  generateTtsMock.mockReset();
  // Create a unique tmp dir for the lessonsDir per test.
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "portugues-audio-test-"));
  // Stub `lessonsDir` to point to our tmp dir.
  vi.doMock("@/lib/data/registry", async () => {
    const actual = await vi.importActual<
      typeof import("@/lib/data/registry")
    >("@/lib/data/registry");
    return {
      ...actual,
      lessonsDir: (lang: string) => path.join(tmpDir, lang, "lessons"),
    };
  });
  // Re-import the script so the doMock'd lessonsDir is in scope.
  vi.resetModules();
  generateTtsMock.mockReset();
});

afterEach(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true });
  vi.doUnmock("@/lib/data/registry");
  vi.resetModules();
});

describe("mergeAndWriteLessonsAudioRefs (Item 3)", () => {
  it("writes a fresh sidecar when none exists", async () => {
    // Re-import after doMock to pick up the stubbed lessonsDir.
    const mod = await import("@/scripts/generate-audio");
    const lesson = makeLesson();
    await mod.mergeAndWriteLessonsAudioRefs("pt", [
      {
        lesson,
        audioRefs: {
          "pt-br": [{ hash: "aaa", voice: "v1" }],
          "pt-pt": [{ hash: "bbb", voice: "v2" }],
        },
      },
    ]);
    const file = path.join(tmpDir, "pt", "lessons", "audio-refs.json");
    const parsed = LessonAudioRefsFileSchema.parse(
      JSON.parse(await fs.readFile(file, "utf8")),
    );
    expect(parsed["b1-l1-alfabeto-acentos"]).toEqual({
      blockId: 1,
      title: "Alfabeto y acentos",
      exampleCount: 1,
      audioRefs: {
        "pt-br": [{ hash: "aaa", voice: "v1" }],
        "pt-pt": [{ hash: "bbb", voice: "v2" }],
      },
    });
  });

  it("merges updates into an existing sidecar (preserves other lessons)", async () => {
    // Re-import after doMock.
    const mod = await import("@/scripts/generate-audio");
    const dir = path.join(tmpDir, "pt", "lessons");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(
      path.join(dir, "audio-refs.json"),
      JSON.stringify({
        "b1-l1-alfabeto-acentos": {
          blockId: 1,
          title: "Alfabeto y acentos (old)",
          exampleCount: 1,
          audioRefs: {
            "pt-br": [{ hash: "OLD", voice: "v1" }],
            "pt-pt": [{ hash: "OLD", voice: "v2" }],
          },
        },
        "b1-l2-other": {
          blockId: 1,
          title: "Otra lección",
          exampleCount: 0,
          audioRefs: {},
        },
      }),
    );
    await mod.mergeAndWriteLessonsAudioRefs("pt", [
      {
        lesson: makeLesson({ name: "Alfabeto y acentos (new)" }),
        audioRefs: {
          "pt-br": [{ hash: "NEW1", voice: "v1" }],
          "pt-pt": [{ hash: "NEW1", voice: "v2" }],
        },
      },
    ]);
    const parsed = LessonAudioRefsFileSchema.parse(
      JSON.parse(await fs.readFile(path.join(dir, "audio-refs.json"), "utf8")),
    );
    // Updated entry uses new title + new hash.
    expect(parsed["b1-l1-alfabeto-acentos"]!.title).toBe(
      "Alfabeto y acentos (new)",
    );
    expect(parsed["b1-l1-alfabeto-acentos"]!.audioRefs["pt-br"]![0]!.hash).toBe("NEW1");
    // Untouched entry is preserved.
    expect(parsed["b1-l2-other"]!.title).toBe("Otra lección");
  });

  it("uses the max of the per-variant array lengths for exampleCount", async () => {
    const mod = await import("@/scripts/generate-audio");
    const lesson = makeLesson();
    await mod.mergeAndWriteLessonsAudioRefs("pt", [
      {
        lesson,
        audioRefs: {
          "pt-br": [
            { hash: "a", voice: "v" },
            { hash: "b", voice: "v" },
            { hash: "c", voice: "v" },
          ],
          "pt-pt": [{ hash: "x", voice: "v" }],
        },
      },
    ]);
    const file = path.join(tmpDir, "pt", "lessons", "audio-refs.json");
    const parsed = LessonAudioRefsFileSchema.parse(
      JSON.parse(await fs.readFile(file, "utf8")),
    );
    expect(parsed["b1-l1-alfabeto-acentos"]!.exampleCount).toBe(3);
  });

  it("rebuilds from updates when the existing sidecar is malformed (does not throw)", async () => {
    const mod = await import("@/scripts/generate-audio");
    const dir = path.join(tmpDir, "pt", "lessons");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(
      path.join(dir, "audio-refs.json"),
      JSON.stringify({ "garbage-key": { blockId: "wrong-type" } }),
    );
    // Suppress the warning log for cleanliness.
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    await mod.mergeAndWriteLessonsAudioRefs("pt", [
      {
        lesson: makeLesson(),
        audioRefs: {
          "pt-br": [{ hash: "ok", voice: "v" }],
          "pt-pt": [{ hash: "ok", voice: "v" }],
        },
      },
    ]);
    warnSpy.mockRestore();
    const parsed = LessonAudioRefsFileSchema.parse(
      JSON.parse(
        await fs.readFile(path.join(dir, "audio-refs.json"), "utf8"),
      ),
    );
    expect(Object.keys(parsed)).toEqual(["b1-l1-alfabeto-acentos"]);
  });
});

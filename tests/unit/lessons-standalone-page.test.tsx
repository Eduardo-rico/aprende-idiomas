// tests/unit/lessons-standalone-page.test.tsx
// @vitest-environment jsdom
// Unit tests for app/[lang]/lessons/[lessonId]/page.tsx (the standalone
// "Repasar lección" page). Mocks the loaders so the test exercises the
// page's wiring (find lesson → render LessonRenderer + "Continuar" link)
// without touching the real curriculum or audio-refs files.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, cleanup } from "@testing-library/react";
import React, { Suspense } from "react";

// `vi.hoisted` lifts the mocks above the `vi.mock` factories so the same
// references can be re-configured per test and imported by the SUT.
const { loadCurriculumMock, loadLessonsAudioRefsMock, loadLessonMdxMock } = vi.hoisted(() => ({
  loadCurriculumMock: vi.fn(),
  loadLessonsAudioRefsMock: vi.fn(),
  loadLessonMdxMock: vi.fn(),
}));

vi.mock("@/lib/data/loaders", () => ({
  loadCurriculum: loadCurriculumMock,
  loadLessonsAudioRefs: loadLessonsAudioRefsMock,
}));

vi.mock("@/lib/data/mdx", () => ({
  loadLessonMdx: loadLessonMdxMock,
}));

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

// Stub `Link` so we don't pull Next's runtime.
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

// Dynamic import AFTER mocks are registered.
const StandaloneLessonPage = (
  await import("@/app/[lang]/lessons/[lessonId]/page")
).default;

const SAMPLE_LESSON = {
  id: "b1-l1-alfabeto-acentos",
  blockId: 1,
  name: "Alfabeto y acentos",
  objectives: ["Reconocer letras", "Identificar acentos"],
  conceptIds: ["b1-alfabeto", "b1-acentos"],
  vocabKey: ["a", "e"],
  conceptNotesPath: "b1/l1-alfabeto-acentos.mdx",
  exerciseRefs: [],
};

beforeEach(() => {
  loadCurriculumMock.mockReset();
  loadLessonsAudioRefsMock.mockReset();
  loadLessonMdxMock.mockReset();
});

afterEach(() => {
  cleanup();
});

// Helper: build the params promise the Next 16 page expects.
function paramsFor(lang: string, lessonId: string) {
  return Promise.resolve({ lang, lessonId });
}

function renderPage(lang: string, lessonId: string) {
  // The page is async; render it inside a Suspense boundary the same way
  // a route segment would.
  return render(
    <Suspense fallback={<div>loading…</div>}>
      <StandaloneLessonPage params={paramsFor(lang, lessonId)} />
    </Suspense>,
  );
}

/** Invoke the async page directly (no render) so the thrown
 *  NEXT_NOT_FOUND bubbles as a real promise rejection. */
function invokePage(lang: string, lessonId: string) {
  return StandaloneLessonPage({ params: paramsFor(lang, lessonId) });
}

async function flushMicrotasks() {
  for (let i = 0; i < 5; i++) {
    await act(async () => {
      await Promise.resolve();
    });
  }
}

describe("Standalone lesson page (app/[lang]/lessons/[lessonId])", () => {
  it("renders the lesson title and the 'Continuar a ejercicios →' link", async () => {
    loadCurriculumMock.mockResolvedValue({
      BLOCKS: [
        {
          id: 1,
          slug: "b1",
          name: "Block 1",
          description: "",
          durationWeeks: null,
          prereqs: [],
          freeDrill: false,
          lessons: [SAMPLE_LESSON],
        },
      ],
      ALL_CONCEPTS: [],
      getBlock: () => { throw new Error("not used"); },
      getLesson: () => { throw new Error("not used"); },
      getConceptsByIds: () => [],
    });
    loadLessonsAudioRefsMock.mockResolvedValue({});
    loadLessonMdxMock.mockResolvedValue(null); // → fallback path

    await act(async () => {
      renderPage("pt", "b1-l1-alfabeto-acentos");
    });
    await flushMicrotasks();

    expect(screen.getByText("Alfabeto y acentos")).toBeTruthy();
    // Continuar link points at the practice route.
    const link = screen.getByRole("link", { name: /Continuar a ejercicios/i });
    expect(link.getAttribute("href")).toBe("/pt/practice/b1-l1-alfabeto-acentos");
  });

  it("shows the MDX-not-yet-generated fallback when loadLessonMdx returns null", async () => {
    loadCurriculumMock.mockResolvedValue({
      BLOCKS: [
        {
          id: 1,
          slug: "b1",
          name: "Block 1",
          description: "",
          durationWeeks: null,
          prereqs: [],
          freeDrill: false,
          lessons: [SAMPLE_LESSON],
        },
      ],
      ALL_CONCEPTS: [],
      getBlock: () => { throw new Error("not used"); },
      getLesson: () => { throw new Error("not used"); },
      getConceptsByIds: () => [],
    });
    loadLessonsAudioRefsMock.mockResolvedValue({});
    loadLessonMdxMock.mockResolvedValue(null);

    await act(async () => {
      renderPage("pt", "b1-l1-alfabeto-acentos");
    });
    await flushMicrotasks();

    // Fallback hint points at the missing path. The renderer is a client
    // component; verify the friendly message reaches the DOM.
    expect(screen.getByText(/MDX not yet generated/i)).toBeTruthy();
    expect(screen.getByText(/b1\/l1-alfabeto-acentos\.mdx/)).toBeTruthy();
  });

  it("throws NEXT_NOT_FOUND for an unknown lang", async () => {
    // Loaders must not be called when the lang check fires first.
    await expect(invokePage("xx", "b1-l1-alfabeto-acentos")).rejects.toThrow(
      /NEXT_NOT_FOUND/,
    );
    expect(loadCurriculumMock).not.toHaveBeenCalled();
  });

  it("throws NEXT_NOT_FOUND for an unknown lessonId", async () => {
    loadCurriculumMock.mockResolvedValue({
      BLOCKS: [],
      ALL_CONCEPTS: [],
      getBlock: () => { throw new Error("not used"); },
      getLesson: () => { throw new Error("not used"); },
      getConceptsByIds: () => [],
    });
    loadLessonsAudioRefsMock.mockResolvedValue({});
    loadLessonMdxMock.mockResolvedValue(null);

    await expect(invokePage("pt", "b1-does-not-exist")).rejects.toThrow(
      /NEXT_NOT_FOUND/,
    );
  });
});
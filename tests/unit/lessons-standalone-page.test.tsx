// tests/unit/lessons-standalone-page.test.tsx
// Unit tests for app/[lang]/lessons/[lessonId]/page.tsx.
// The page is now a 308 redirect shell: it looks up the lesson in the
// curriculum and permanentRedirects to /libro/[blockId]/[sectionSlug].
// (Was previously a standalone "Repasar lección" viewer; replaced in B.2.)
import { describe, it, expect, vi, beforeEach } from "vitest";

const { loadCurriculumMock } = vi.hoisted(() => ({
  loadCurriculumMock: vi.fn(),
}));

const permanentRedirectMock = vi.fn((_url: string): never => {
  throw new Error("NEXT_REDIRECT");
});

vi.mock("@/lib/data/loaders", () => ({
  loadCurriculum: loadCurriculumMock,
}));

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
  permanentRedirect: permanentRedirectMock,
}));

// Dynamic import AFTER mocks are registered.
const LessonsRedirectPage = (
  await import("@/app/[lang]/lessons/[lessonId]/page")
).default;

const SAMPLE_LESSON = {
  id: "b1-l1-alfabeto-acentos",
  blockId: 1,
  name: "Alfabeto y acentos",
  conceptIds: [],
};

function paramsFor(lang: string, lessonId: string) {
  return Promise.resolve({ lang, lessonId });
}

function invokePage(lang: string, lessonId: string) {
  return LessonsRedirectPage({ params: paramsFor(lang, lessonId) });
}

beforeEach(() => {
  loadCurriculumMock.mockReset();
  permanentRedirectMock.mockReset().mockImplementation((_url: string): never => {
    throw new Error("NEXT_REDIRECT");
  });
});

describe("Lessons redirect page (app/[lang]/lessons/[lessonId])", () => {
  it("permanentRedirects to /libro/[blockId]/[sectionSlug] for a known lesson", async () => {
    loadCurriculumMock.mockResolvedValue({
      BLOCKS: [
        {
          id: 1,
          name: "Block 1",
          description: "",
          prereqs: [],
          lessons: [SAMPLE_LESSON],
        },
      ],
    });

    await expect(invokePage("pt", "b1-l1-alfabeto-acentos")).rejects.toThrow("NEXT_REDIRECT");
    expect(permanentRedirectMock).toHaveBeenCalledWith("/pt/libro/1/alfabeto-y-acentos");
  });

  it("throws NEXT_NOT_FOUND for an unknown lang", async () => {
    await expect(invokePage("xx", "b1-l1-alfabeto-acentos")).rejects.toThrow("NEXT_NOT_FOUND");
    expect(loadCurriculumMock).not.toHaveBeenCalled();
  });

  it("throws NEXT_NOT_FOUND for an unknown lessonId", async () => {
    loadCurriculumMock.mockResolvedValue({
      BLOCKS: [],
    });

    await expect(invokePage("pt", "b1-does-not-exist")).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("strips diacritics when computing sectionSlug", async () => {
    loadCurriculumMock.mockResolvedValue({
      BLOCKS: [
        {
          id: 2,
          name: "Block 2",
          description: "",
          prereqs: [],
          lessons: [{ id: "b2-l1-vogais", blockId: 2, name: "Vogais e Consoantes", conceptIds: [] }],
        },
      ],
    });

    await expect(invokePage("pt", "b2-l1-vogais")).rejects.toThrow("NEXT_REDIRECT");
    expect(permanentRedirectMock).toHaveBeenCalledWith("/pt/libro/2/vogais-e-consoantes");
  });
});

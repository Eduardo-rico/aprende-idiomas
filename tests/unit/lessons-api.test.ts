// tests/unit/lessons-api.test.ts
// Unit tests for GET /api/lessons/[lang]/[lessonId]. Mocks
// `loadCurriculum` and `loadLessonsAudioRefs` so we exercise the
// route handler in isolation (no disk reads, no real curriculum
// import). `next/server` is stubbed so the test doesn't pull the
// real Next runtime — we just need NextResponse.json semantics.
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock loaders BEFORE importing the route. The plan calls out that
// the vi.mock factory must return BOTH `loadCurriculum` and
// `loadLessonsAudioRefs` as `vi.fn()` so they can be reset/mocked
// independently per test (they live in the same module).
vi.mock("@/lib/data/loaders", () => ({
  loadCurriculum: vi.fn(),
  loadLessonsAudioRefs: vi.fn(),
}));

// Mock next/server. NextResponse.json returns a real Response in
// tests; we replicate the (body, init?) shape so assertions on
// `.status` and `.json()` work.
vi.mock("next/server", () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) =>
      new Response(JSON.stringify(body), {
        status: init?.status ?? 200,
        headers: { "content-type": "application/json" },
      }),
  },
}));

// Import after the mocks are registered.
import { GET } from "@/app/api/lessons/[lang]/[lessonId]/route";
import { loadCurriculum, loadLessonsAudioRefs } from "@/lib/data/loaders";

const mockedCurriculum = vi.mocked(loadCurriculum);
const mockedAudioRefs = vi.mocked(loadLessonsAudioRefs);

beforeEach(() => {
  vi.clearAllMocks();
});

// Helper: build the params promise the route expects (Next 16
// `params: Promise<{...}>` signature).
function paramsFor(lang: string, lessonId: string) {
  return Promise.resolve({ lang, lessonId });
}

describe("GET /api/lessons/[lang]/[lessonId]", () => {
  it("returns 200 with full shape for a known PT lesson with audio refs", async () => {
    mockedCurriculum.mockResolvedValue({
      BLOCKS: [
        {
          id: 1,
          slug: "b1",
          name: "Block 1",
          description: "",
          durationWeeks: null,
          prereqs: [],
          freeDrill: false,
          lessons: [
            {
              id: "b1-regulares-ar",
              blockId: 1,
              name: "Verbos -AR",
              objectives: [],
              conceptIds: [],
              vocabKey: [],
              conceptNotesPath: "b1/l-regulares-ar.mdx",
              exerciseRefs: [],
            },
          ],
        },
      ],
      ALL_CONCEPTS: [],
      getBlock: () => {
        throw new Error("not used");
      },
      getLesson: () => {
        throw new Error("not used");
      },
      getConceptsByIds: () => [],
    });
    mockedAudioRefs.mockResolvedValue({
      "b1-regulares-ar": {
        blockId: 1,
        title: "Verbos regulares en -AR",
        exampleCount: 3,
        audioRefs: { "pt-br": [{ hash: "abc", voice: "v1" }] },
      },
    });

    const res = await GET(
      new Request("http://localhost/api/lessons/pt/b1-regulares-ar"),
      { params: paramsFor("pt", "b1-regulares-ar") }
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.lessonId).toBe("b1-regulares-ar");
    expect(body.blockId).toBe(1);
    expect(body.mdxPath).toBe("b1/l-regulares-ar.mdx");
    expect(body.title).toBe("Verbos regulares en -AR");
    expect(body.exampleCount).toBe(3);
    expect((body.audioRefs as Record<string, unknown[]>)["pt-br"]).toHaveLength(
      1
    );
  });

  it("returns 400 for an unknown language (xx)", async () => {
    const res = await GET(
      new Request("http://localhost/api/lessons/xx/b1-regulares-ar"),
      { params: paramsFor("xx", "b1-regulares-ar") }
    );
    expect(res.status).toBe(400);
    // Loaders must not be called — the lang check fires first.
    expect(mockedCurriculum).not.toHaveBeenCalled();
    expect(mockedAudioRefs).not.toHaveBeenCalled();
  });

  it("returns 400 for ru (scaffolded but no lesson content)", async () => {
    const res = await GET(
      new Request("http://localhost/api/lessons/ru/b1-regulares-ar"),
      { params: paramsFor("ru", "b1-regulares-ar") }
    );
    expect(res.status).toBe(400);
    expect(mockedCurriculum).not.toHaveBeenCalled();
    expect(mockedAudioRefs).not.toHaveBeenCalled();
  });

  it("returns 404 for an unknown lessonId", async () => {
    mockedCurriculum.mockResolvedValue({
      BLOCKS: [],
      ALL_CONCEPTS: [],
      getBlock: () => {
        throw new Error("not used");
      },
      getLesson: () => {
        throw new Error("not used");
      },
      getConceptsByIds: () => [],
    });
    mockedAudioRefs.mockResolvedValue({});

    const res = await GET(
      new Request("http://localhost/api/lessons/pt/unknown"),
      { params: paramsFor("pt", "unknown") }
    );
    expect(res.status).toBe(404);
  });

  it("returns 200 with empty audioRefs and lesson.name fallback when no audio-refs entry exists", async () => {
    mockedCurriculum.mockResolvedValue({
      BLOCKS: [
        {
          id: 1,
          slug: "b1",
          name: "Block 1",
          description: "",
          durationWeeks: null,
          prereqs: [],
          freeDrill: false,
          lessons: [
            {
              id: "b1-test",
              blockId: 1,
              name: "Test",
              objectives: [],
              conceptIds: [],
              vocabKey: [],
              conceptNotesPath: "b1/l-test.mdx",
              exerciseRefs: [],
            },
          ],
        },
      ],
      ALL_CONCEPTS: [],
      getBlock: () => {
        throw new Error("not used");
      },
      getLesson: () => {
        throw new Error("not used");
      },
      getConceptsByIds: () => [],
    });
    mockedAudioRefs.mockResolvedValue({});

    const res = await GET(
      new Request("http://localhost/api/lessons/pt/b1-test"),
      { params: paramsFor("pt", "b1-test") }
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.audioRefs).toEqual({});
    expect(body.exampleCount).toBe(0);
    // Falls back to lesson.name when audio-refs entry is absent.
    expect(body.title).toBe("Test");
  });
});

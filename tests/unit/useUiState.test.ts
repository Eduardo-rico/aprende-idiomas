import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Dexie repository so tests run in jsdom without IndexedDB
vi.mock("@/lib/db/repository", () => ({
  getUiState: vi.fn().mockResolvedValue(undefined),
  setUiState: vi.fn().mockResolvedValue(undefined),
}));

import { useUiState } from "@/lib/stores/useUiState";
import { getUiState, setUiState } from "@/lib/db/repository";

describe("useUiState", () => {
  beforeEach(() => {
    useUiState.setState({
      lastLesson: null,
      lastSession: null,
      activeProgresoTab: "aprendizaje",
      hydrated: false,
    });
    vi.clearAllMocks();
  });

  it("hydrates from db", async () => {
    vi.mocked(getUiState).mockImplementation(async (key) => {
      if (key === "lastLesson") return { chapterNum: 3, sectionTitle: "Falar", progressPct: 60 } as never;
      return undefined;
    });
    await useUiState.getState().hydrate();
    expect(useUiState.getState().lastLesson?.chapterNum).toBe(3);
    expect(useUiState.getState().hydrated).toBe(true);
  });

  it("setLastLesson writes to db and updates store", async () => {
    const lesson = { chapterNum: 2, sectionTitle: "Plural", progressPct: 40 };
    await useUiState.getState().setLastLesson(lesson);
    expect(setUiState).toHaveBeenCalledWith("lastLesson", lesson);
    expect(useUiState.getState().lastLesson).toEqual(lesson);
  });

  it("setActiveProgresoTab defaults to 'aprendizaje'", () => {
    expect(useUiState.getState().activeProgresoTab).toBe("aprendizaje");
  });
});

import { create } from "zustand";
import { getUiState as dbGet, setUiState as dbSet } from "@/lib/db/repository";

interface LastLesson {
  chapterNum: number;
  sectionTitle: string;
  progressPct: number;
}

interface UiStateStore {
  lastLesson: LastLesson | null;
  lastSession: string | null;
  activeProgresoTab: "aprendizaje" | "logros";
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setLastLesson: (lesson: LastLesson) => Promise<void>;
  setActiveProgresoTab: (tab: "aprendizaje" | "logros") => Promise<void>;
}

export const useUiState = create<UiStateStore>((set) => ({
  lastLesson: null,
  lastSession: null,
  activeProgresoTab: "aprendizaje",
  hydrated: false,
  hydrate: async () => {
    const [lesson, session, tab] = await Promise.all([
      dbGet<LastLesson>("lastLesson"),
      dbGet<string>("lastSession"),
      dbGet<"aprendizaje" | "logros">("activeProgresoTab"),
    ]);
    set({
      lastLesson: lesson ?? null,
      lastSession: session ?? null,
      activeProgresoTab: tab ?? "aprendizaje",
      hydrated: true,
    });
  },
  setLastLesson: async (lesson) => {
    await dbSet("lastLesson", lesson);
    set({ lastLesson: lesson });
  },
  setActiveProgresoTab: async (tab) => {
    await dbSet("activeProgresoTab", tab);
    set({ activeProgresoTab: tab });
  },
}));

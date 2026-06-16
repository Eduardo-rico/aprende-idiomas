// lib/stores/settings.ts
"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AudioVariant, Variant } from "@/lib/db/schema";

interface SettingsState {
  variant: Variant;
  showCompareToggle: boolean;
  showContrast: boolean;
  dailyGoalMinutes: number;
  theme: "light" | "dark";
  soundFx: boolean;
  voicePref: Record<Variant, AudioVariant>;
  /** Filter /practice/[lessonId] to due cards only. Default off (legacy
   *  behavior). When on, the lesson page shows only cards that are due now
   *  or brand-new, and a hint about cards available later. */
  localPracticeFilter: boolean;

  setVariant: (v: Variant) => void;
  toggleCompare: () => void;
  setVoicePref: (v: Variant, voice: AudioVariant) => void;
  setTheme: (t: "light" | "dark") => void;
  setDailyGoal: (n: number) => void;
  // CRITICAL FIX (C10): wired setters so Settings toggles actually work.
  setShowContrast: (b: boolean) => void;
  setSoundFx: (b: boolean) => void;
  setLocalPracticeFilter: (b: boolean) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      variant: "br",
      showCompareToggle: false,
      showContrast: true,
      dailyGoalMinutes: 15,
      theme: "light",
      soundFx: true,
      voicePref: { br: "default", pt: "default" },
      localPracticeFilter: false,
      setVariant: (v) => set({ variant: v }),
      toggleCompare: () => set((s) => ({ showCompareToggle: !s.showCompareToggle })),
      setVoicePref: (variant, voice) => set((s) => ({ voicePref: { ...s.voicePref, [variant]: voice } })),
      setTheme: (t) => set({ theme: t }),
      setDailyGoal: (n) => set({ dailyGoalMinutes: n }),
      setShowContrast: (b) => set({ showContrast: b }),
      setSoundFx: (b) => set({ soundFx: b }),
      setLocalPracticeFilter: (b) => set({ localPracticeFilter: b }),
    }),
    { name: "pt-settings", storage: createJSONStorage(() => localStorage) },
  ),
);

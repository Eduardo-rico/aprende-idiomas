// lib/stores/settings.ts
"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { DEFAULT_LANGUAGE, type LanguageId } from "@/lib/locales";
import { DEFAULT_VARIANT, type VariantKey } from "@/lib/data/variant";
import type { AudioVariant } from "@/lib/db/schema";
import { runLocalStorageMigrations } from "./localstorage-migrate";

interface SettingsState {
  /** Active target language (the language the user is learning). Read
   *  from the URL on the server; mirrored here so client components
   *  and persisted prefs survive a reload. Phase 0 sets it; Phase 5
   *  wires the navbar dropdown to it. */
  language: LanguageId;
  /** Active PT variant (e.g. "pt-br" / "pt-pt"). Phase 4: stored as
   *  the canonical `VariantKey` — the legacy "br"/"pt" values are
   *  translated to "pt-br"/"pt-pt" by the localStorage migration. */
  variant: VariantKey;
  showCompareToggle: boolean;
  showContrast: boolean;
  dailyGoalMinutes: number;
  theme: "light" | "dark";
  soundFx: boolean;
  /** Per-variant voice preference. Keyed by `VariantKey`; the canonical
   *  PT keys are "pt-br" and "pt-pt". */
  voicePref: Record<VariantKey, AudioVariant>;
  /** Filter /practice/[lessonId] to due cards only. Default off (legacy
   *  behavior). When on, the lesson page shows only cards that are due now
   *  or brand-new, and a hint about cards available later. */
  localPracticeFilter: boolean;

  setLanguage: (l: LanguageId) => void;
  setVariant: (v: VariantKey) => void;
  toggleCompare: () => void;
  setVoicePref: (v: VariantKey, voice: AudioVariant) => void;
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
      language: DEFAULT_LANGUAGE,
      variant: DEFAULT_VARIANT,
      showCompareToggle: false,
      showContrast: true,
      dailyGoalMinutes: 15,
      theme: "light",
      soundFx: true,
      voicePref: { "pt-br": "default", "pt-pt": "default" },
      localPracticeFilter: false,
      setLanguage: (l) => set({ language: l }),
      setVariant: (v) => set({ variant: v }),
      toggleCompare: () => set((s) => ({ showCompareToggle: !s.showCompareToggle })),
      setVoicePref: (variant, voice) => set((s) => ({ voicePref: { ...s.voicePref, [variant]: voice } })),
      setTheme: (t) => set({ theme: t }),
      setDailyGoal: (n) => set({ dailyGoalMinutes: n }),
      setShowContrast: (b) => set({ showContrast: b }),
      setSoundFx: (b) => set({ soundFx: b }),
      setLocalPracticeFilter: (b) => set({ localPracticeFilter: b }),
    }),
    // Phase 4: persist key renamed to "app-settings" (was "pt-settings")
    // so it no longer carries the PT-specific name. The
    // `runLocalStorageMigrations()` call below copies the legacy
    // payload to the new key (and translates "br"/"pt" → "pt-br"/"pt-pt")
    // on first load.
    {
      name: "app-settings",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // The migrate call has already run by the time rehydrate fires
        // (module-load order: `runLocalStorageMigrations` runs at the
        // bottom of this file, before any component imports it). We
        // re-run it here defensively in case the bundle is loaded out
        // of order via a test or another entrypoint.
        runLocalStorageMigrations();
        return state;
      },
    },
  ),
);

// Run at module load. Idempotent — guarded by an `app-migrated-v1` sentinel.
if (typeof window !== "undefined") {
  runLocalStorageMigrations();
}

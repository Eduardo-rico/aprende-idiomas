// lib/stores/fsrs-overrides.ts
"use client";
// Persisted user overrides for FSRS_CONFIG. Empty `{}` means "use the
// defaults in lib/srs/config.ts". A non-empty value spreads into
// getScheduler() at call time so changes take effect on the next grade.
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { FsrsConfig } from "@/lib/srs/config";
import type { StepUnit } from "ts-fsrs";
import { runLocalStorageMigrations } from "./localstorage-migrate";

export type FsrsOverrides = Partial<Omit<FsrsConfig, "learning_steps" | "relearning_steps">> & {
  // The steps fields are stored as plain strings and parsed on read, so
  // the user can edit them as a single comma-separated input field.
  learning_steps?: string;
  relearning_steps?: string;
};

interface FsrsOverridesState {
  overrides: FsrsOverrides;
  setOverride: <K extends keyof FsrsOverrides>(key: K, value: FsrsOverrides[K]) => void;
  clearOverrides: () => void;
}

export const useFsrsOverrides = create<FsrsOverridesState>()(
  persist(
    (set) => ({
      overrides: {},
      setOverride: (key, value) =>
        set((s) => ({ overrides: { ...s.overrides, [key]: value } })),
      clearOverrides: () => set({ overrides: {} }),
    }),
    // Phase 4: persist key renamed to "app-fsrs-overrides" (was
    // "pt-fsrs-overrides"). The localStorage migration copies the
    // legacy payload on first load.
    { name: "app-fsrs-overrides", storage: createJSONStorage(() => localStorage) },
  ),
);

/** Convert the persisted overrides into the FsrsConfig shape that
 *  getScheduler() expects. Parses the comma-separated step strings back
 *  into StepUnit[] tuples; throws away entries that don't match
 *  /^\d+[mhd]$/ (the validation regex used in srs-config.test.ts). */
export function resolveOverrides(overrides: FsrsOverrides): Partial<FsrsConfig> {
  const out: Partial<FsrsConfig> = {};
  for (const [k, v] of Object.entries(overrides)) {
    if (v === undefined) continue;
    if (k === "learning_steps" || k === "relearning_steps") {
      const parsed = (v as string)
        .split(",")
        .map((s) => s.trim())
        .filter((s) => /^\d+[mhd]$/.test(s)) as StepUnit[];
      // Only override if at least one valid step was supplied.
      if (parsed.length > 0) {
        (out as Record<string, unknown>)[k] = parsed;
      }
    } else {
      (out as Record<string, unknown>)[k] = v;
    }
  }
  return out;
}

// Run the migration at module load so existing users don't lose their
// overrides on first reload after the rename.
if (typeof window !== "undefined") {
  runLocalStorageMigrations();
}

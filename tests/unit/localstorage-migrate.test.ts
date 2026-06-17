// @vitest-environment jsdom
// tests/unit/localstorage-migrate.test.ts
// Verifies the legacy-key → new-key migration:
//   1. "pt-settings" is copied to "app-settings" with `variant` /
//      `voicePref` keys translated ("br" → "pt-br", "pt" → "pt-pt").
//   2. "pt-fsrs-overrides" is copied to "app-fsrs-overrides".
//   3. "pt-theme" is copied to "app-theme".
//   4. Migration is idempotent (running twice does not duplicate /
//      clobber the new key).
//   5. Re-running on a clean install is a no-op.
import { describe, it, expect, beforeEach, vi } from "vitest";
import { runLocalStorageMigrations } from "@/lib/stores/localstorage-migrate";

// In-memory localStorage shim — vitest's jsdom env sometimes reports
// `localStorage` as undefined at module load. The shim matches the
// production behavior (per-origin Map-backed implementation) and lets
// the migration be tested in isolation from the real browser API.
const memStore = new Map<string, string>();
const localStorageShim = {
  getItem: (k: string) => memStore.get(k) ?? null,
  setItem: (k: string, v: string) => {
    memStore.set(k, v);
  },
  removeItem: (k: string) => {
    memStore.delete(k);
  },
  clear: () => memStore.clear(),
  key: (i: number) => Array.from(memStore.keys())[i] ?? null,
  get length() {
    return memStore.size;
  },
};
vi.stubGlobal("localStorage", localStorageShim);

const MIGRATION_FLAG = "app-migrated-v1";

function clearAll() {
  memStore.clear();
}

beforeEach(() => {
  clearAll();
});

describe("runLocalStorageMigrations", () => {
  it("copies pt-settings → app-settings and translates legacy variant keys", () => {
    localStorage.setItem(
      "pt-settings",
      JSON.stringify({
        state: {
          variant: "br",
          voicePref: { br: "vitoria", pt: "francisca" },
          theme: "light",
          showCompareToggle: false,
          showContrast: true,
          dailyGoalMinutes: 15,
          soundFx: true,
          localPracticeFilter: false,
          language: "pt",
        },
        version: 0,
      }),
    );
    runLocalStorageMigrations();
    const migrated = JSON.parse(localStorage.getItem("app-settings") ?? "{}");
    expect(migrated.state.variant).toBe("pt-br");
    expect(migrated.state.voicePref).toEqual({ "pt-br": "vitoria", "pt-pt": "francisca" });
    expect(migrated.state.language).toBe("pt");
    // The old key is removed.
    expect(localStorage.getItem("pt-settings")).toBeNull();
    // The flag is set.
    expect(localStorage.getItem(MIGRATION_FLAG)).toBe("1");
  });

  it("copies pt-fsrs-overrides → app-fsrs-overrides", () => {
    localStorage.setItem(
      "pt-fsrs-overrides",
      JSON.stringify({ state: { overrides: { request_retention: 0.91 } }, version: 0 }),
    );
    runLocalStorageMigrations();
    const migrated = JSON.parse(localStorage.getItem("app-fsrs-overrides") ?? "{}");
    expect(migrated.state.overrides.request_retention).toBe(0.91);
    expect(localStorage.getItem("pt-fsrs-overrides")).toBeNull();
  });

  it("copies pt-theme → app-theme", () => {
    // "pt-theme" is stored as a raw string (not JSON-wrapped), matching
    // the existing ThemeProvider implementation.
    localStorage.setItem("pt-theme", "dark");
    runLocalStorageMigrations();
    expect(localStorage.getItem("app-theme")).toBe("dark");
    expect(localStorage.getItem("pt-theme")).toBeNull();
  });

  it("is idempotent — a second run does not clobber the new key", () => {
    localStorage.setItem("pt-theme", "dark");
    runLocalStorageMigrations();
    // Now simulate the user changing the value via the new key.
    localStorage.setItem("app-theme", "light");
    // And someone (an old tab) writes the legacy key again.
    localStorage.setItem("pt-theme", "dark");
    // Re-run the migration: it should see the sentinel, not copy.
    runLocalStorageMigrations();
    expect(localStorage.getItem("app-theme")).toBe("light");
  });

  it("is a no-op when no legacy keys are present", () => {
    runLocalStorageMigrations();
    expect(localStorage.getItem("app-settings")).toBeNull();
    expect(localStorage.getItem("app-fsrs-overrides")).toBeNull();
    expect(localStorage.getItem("app-theme")).toBeNull();
    expect(localStorage.getItem(MIGRATION_FLAG)).toBe("1");
  });

  it("handles a corrupt legacy payload by dropping it", () => {
    localStorage.setItem("pt-theme", "not-json");
    expect(() => runLocalStorageMigrations()).not.toThrow();
    expect(localStorage.getItem("pt-theme")).toBeNull();
    expect(localStorage.getItem(MIGRATION_FLAG)).toBe("1");
  });

  it("preserves canonical VariantKey values that were already migrated", () => {
    localStorage.setItem(
      "pt-settings",
      JSON.stringify({
        state: { variant: "pt-pt", voicePref: { "pt-pt": "francisca" } },
        version: 0,
      }),
    );
    runLocalStorageMigrations();
    const migrated = JSON.parse(localStorage.getItem("app-settings") ?? "{}");
    expect(migrated.state.variant).toBe("pt-pt");
    expect(migrated.state.voicePref["pt-pt"]).toBe("francisca");
  });
});

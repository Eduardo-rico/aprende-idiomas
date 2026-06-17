// tests/unit/settings-language.test.ts
// @vitest-environment jsdom
// Unit tests for the `language` field on useSettings. The field is the
// persistent mirror of the URL's [lang] segment; client components
// read it for things like "what's the active target language for this
// vocab card?" Phase 0 just adds the field; Phase 5 wires the UI.
//
// jsdom is required because the persist middleware writes to
// localStorage on every setState; we also stub localStorage with an
// in-memory Map so the persist writes don't fail (jsdom in this Vitest
// setup doesn't expose a working storage object).
import { describe, it, expect, beforeEach, vi } from "vitest";

// In-memory localStorage shim — Zustand persist calls getItem/setItem
// on every setState. Without this, the persist middleware throws.
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

// Import after stubbing so the persist middleware picks up the shim.
const { useSettings } = await import("@/lib/stores/settings");
const { DEFAULT_LANGUAGE } = await import("@/lib/locales");

describe("settings.language", () => {
  beforeEach(() => {
    memStore.clear();
    // Reset to defaults between tests so they don't leak state.
    useSettings.setState({
      language: DEFAULT_LANGUAGE,
      variant: "br",
      showCompareToggle: false,
      showContrast: true,
      dailyGoalMinutes: 15,
      theme: "light",
      soundFx: true,
      voicePref: { br: "default", pt: "default" },
      localPracticeFilter: false,
    } as never);
  });

  it("defaults to the DEFAULT_LANGUAGE (pt)", () => {
    expect(useSettings.getState().language).toBe(DEFAULT_LANGUAGE);
    expect(useSettings.getState().language).toBe("pt");
  });

  it("setLanguage updates the active language", () => {
    useSettings.getState().setLanguage("ru");
    expect(useSettings.getState().language).toBe("ru");
    useSettings.getState().setLanguage("ro");
    expect(useSettings.getState().language).toBe("ro");
    useSettings.getState().setLanguage("cs");
    expect(useSettings.getState().language).toBe("cs");
  });

  it("setLanguage does not affect other settings", () => {
    const before = useSettings.getState();
    useSettings.getState().setLanguage("ru");
    const after = useSettings.getState();
    expect(after.variant).toBe(before.variant);
    expect(after.theme).toBe(before.theme);
    expect(after.dailyGoalMinutes).toBe(before.dailyGoalMinutes);
  });
});

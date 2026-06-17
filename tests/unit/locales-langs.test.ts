// tests/unit/locales-langs.test.ts
// Phase 5 (multi-idioma): 4 idiomas registrados (pt/ru/ro/cs), cada uno
// con label y flag. La nav-bar renderiza los 4 enabled, el home del
// idioma sin contenido muestra EmptyState.
import { describe, it, expect } from "vitest";
import { LANGUAGES, hasLocale, LANG_LABELS, LANG_FLAGS, type LanguageId } from "@/lib/locales";

describe("Phase 5 locales", () => {
  it("4 idiomas registrados: pt, ru, ro, cs", () => {
    expect(LANGUAGES).toHaveLength(4);
    expect([...LANGUAGES].sort()).toEqual(["cs", "pt", "ro", "ru"]);
  });

  it("todos los 4 langs pasan hasLocale", () => {
    for (const l of LANGUAGES) {
      expect(hasLocale(l)).toBe(true);
    }
  });

  it("langs no registrados fallan hasLocale", () => {
    expect(hasLocale("xx")).toBe(false);
    expect(hasLocale("en")).toBe(false);
  });

  it("LANG_LABELS tiene script nativo para cada uno", () => {
    expect(LANG_LABELS.pt).toBe("Português");
    expect(LANG_LABELS.ru).toBe("Русский");
    expect(LANG_LABELS.ro).toBe("Română");
    expect(LANG_LABELS.cs).toBe("Čeština");
  });

  it("LANG_FLAGS tiene un emoji flag para cada uno", () => {
    for (const l of LANGUAGES) {
      expect(LANG_FLAGS[l].length).toBeGreaterThan(0);
    }
  });

  it("TypeScript narrow: hasLocale acota strings a LanguageId", () => {
    const candidate: string = "ru";
    if (hasLocale(candidate)) {
      // Después del guard, el tipo es LanguageId (esto es type-only).
      const narrowed: LanguageId = candidate;
      expect(narrowed).toBe("ru");
    } else {
      throw new Error("hasLocale('ru') debería ser true");
    }
  });
});

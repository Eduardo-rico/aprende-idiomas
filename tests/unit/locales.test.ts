// tests/unit/locales.test.ts
// Unit tests for the locale registry. The registry is the single
// source of truth for which languages the app supports; if you add
// a new language, both arrays here and the LANGUAGES tuple update
// in lockstep.
import { describe, it, expect } from "vitest";
import { LANGUAGES, DEFAULT_LANGUAGE, hasLocale, LANG_LABELS, LANG_FLAGS, type LanguageId } from "@/lib/locales";

describe("lib/locales", () => {
  // Fase G (2026-09-03): entran `la` y `grc`. Esta lista estaba escrita
  // DOS veces —aquí y en `locales-langs.test.ts`— y al añadir los dos
  // idiomas sólo saltó una, porque la otra se actualizó a la vez que el
  // código. Es la forma barata de «una regla copiada se desincroniza»: la
  // copia que nadie recuerda es la que falla. Se dejan las dos porque
  // afirman cosas distintas del mismo hecho, con un puntero cruzado.
  it("LANGUAGES contains pt/ru/ro/cs/la/grc (and nothing else)", () => {
    expect([...LANGUAGES].sort()).toEqual(["cs", "grc", "la", "pt", "ro", "ru"]);
  });

  it("DEFAULT_LANGUAGE is pt (the only language with full content today)", () => {
    expect(DEFAULT_LANGUAGE).toBe("pt");
  });

  it("hasLocale returns true for every registered language", () => {
    for (const lang of LANGUAGES) {
      expect(hasLocale(lang)).toBe(true);
    }
  });

  it("hasLocale returns false for unknown locales", () => {
    expect(hasLocale("xx")).toBe(false);
    expect(hasLocale("")).toBe(false);
    expect(hasLocale("PT")).toBe(false); // case-sensitive on purpose
    expect(hasLocale("pt-br")).toBe(false); // that's a VariantKey, not a LanguageId
  });

  it("LanguageId union narrows correctly via hasLocale", () => {
    const candidate: string = "pt";
    if (hasLocale(candidate)) {
      // Type-level assertion: after the guard, candidate is LanguageId.
      const narrowed: LanguageId = candidate;
      expect(narrowed).toBe("pt");
    } else {
      throw new Error("hasLocale('pt') should be true");
    }
  });

  it("LANG_LABELS has a non-empty label for every registered language", () => {
    for (const lang of LANGUAGES) {
      expect(LANG_LABELS[lang]).toBeTruthy();
      expect(LANG_LABELS[lang].length).toBeGreaterThan(0);
    }
  });

  it("LANG_FLAGS has a non-empty flag for every registered language", () => {
    for (const lang of LANGUAGES) {
      expect(LANG_FLAGS[lang]).toBeTruthy();
    }
  });
});

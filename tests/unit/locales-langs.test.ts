// tests/unit/locales-langs.test.ts
// Phase 5 (multi-idioma) + fase G: 6 idiomas registrados, cada uno con
// label y marca. La nav-bar los renderiza todos; el home del idioma sin
// contenido muestra EmptyState.
//
// Las dos aserciones de abajo se pusieron en rojo al añadir `la` y `grc`
// (2026-09-03) y se actualizan porque el HECHO cambió, no porque
// estorbaran: siguen afirmando lo mismo —que la lista es exactamente
// ésta— sobre una lista distinta. Lo que queda cubierto entrada por
// entrada está en `idioma-nuevo-completo.test.ts`.
import { describe, it, expect } from "vitest";
import { LANGUAGES, hasLocale, LANG_LABELS, LANG_FLAGS, type LanguageId } from "@/lib/locales";

describe("Phase 5 locales", () => {
  it("6 idiomas registrados: pt, ru, ro, cs, la, grc", () => {
    expect(LANGUAGES).toHaveLength(6);
    expect([...LANGUAGES].sort()).toEqual(["cs", "grc", "la", "pt", "ro", "ru"]);
  });

  it("todos los langs pasan hasLocale", () => {
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
    expect(LANG_LABELS.la).toBe("Latina");
    expect(LANG_LABELS.grc).toBe("Ἑλληνική");
  });

  it("LANG_FLAGS tiene una marca para cada uno (bandera si hay estado)", () => {
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

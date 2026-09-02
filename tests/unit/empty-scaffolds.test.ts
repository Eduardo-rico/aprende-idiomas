// tests/unit/empty-scaffolds.test.ts
// Phase 5 (multi-idioma): los scaffolds vacíos para ru/ro/cs exponen
// los loaders con forma "vacía pero tipada". La app renderiza el
// `EmptyState` y la home de cada idioma está navegable.
import { describe, it, expect } from "vitest";
import {
  loadCurriculum, loadAllBlocks, loadAllStories, loadDiagnostic,
  loadVocabCatalog, loadFallbackDict, loadManifest, loadConcepts,
} from "@/lib/data/loaders";
import { LANGUAGES } from "@/lib/locales";

const SCAFFOLD_LANGS = LANGUAGES.filter((l) => l !== "pt");

describe("empty scaffolds (Phase 5)", () => {
  describe.each(SCAFFOLD_LANGS)("language %s", (lang) => {
    it("loadCurriculum returns empty BLOCKS/ALL_CONCEPTS and throws on getBlock", async () => {
      const c = await loadCurriculum(lang);
      // Fase F (E2#30): el rumano ya tiene inventario (ALL_CONCEPTS) y los
      // bloques que tienen lecciones (b2, b3). CS y RU siguen vacíos del todo.
      if (lang === 'ro') { expect(c.ALL_CONCEPTS.length).toBeGreaterThan(0); expect(c.BLOCKS.length).toBeGreaterThan(0); }
      else { expect(c.BLOCKS).toEqual([]); expect(c.ALL_CONCEPTS).toEqual([]); }
      expect(() => c.getBlock(1)).toThrow();
    });

    it("loadAllBlocks: [] en los scaffolds vacíos; ro ya sirve su primer lote", async () => {
      const blocks = await loadAllBlocks(lang);
      if (lang === 'ro') expect(blocks.length).toBeGreaterThan(0);
      else expect(blocks).toEqual([]);
    });

    it("loadAllStories returns []", async () => {
      expect(await loadAllStories(lang)).toEqual([]);
    });

    it("loadDiagnostic returns null", async () => {
      expect(await loadDiagnostic(lang)).toBeNull();
    });

    it("loadVocabCatalog returns []", async () => {
      expect(await loadVocabCatalog(lang)).toEqual([]);
    });

    it("loadFallbackDict returns {} (an object with no keys)", async () => {
      const d = await loadFallbackDict(lang);
      expect(typeof d).toBe("object");
      expect(Object.keys(d)).toEqual([]);
    });

    it("loadManifest returns the empty manifest object", async () => {
      const m = await loadManifest(lang);
      expect(m).toEqual({
        generatedAt: "",
        modelText: "",
        modelTts: "",
        voices: {},
        blocks: {},
        audioIndex: {},
      });
    });

    it("loadConcepts returns []", async () => {
      expect(await loadConcepts(lang)).toEqual([]);
    });
  });

  it("PT remains non-empty (regression guard)", async () => {
    const c = await loadCurriculum("pt");
    expect(c.BLOCKS.length).toBeGreaterThan(0);
    expect(await loadAllStories("pt")).not.toEqual([]);
    expect(await loadDiagnostic("pt")).not.toBeNull();
  });
});

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
      // Fase F: el rumano ya tiene inventario (ALL_CONCEPTS) y los bloques
      // que tienen lecciones. CS y RU siguen vacíos del todo.
      //
      // Y desde el lote 13 (2026-09-03) el BLOQUE 1 existe: la afirmación
      // «getBlock(1) tira» codificaba «el rumano no tiene bloque 1» y
      // dejó de ser verdad al publicar la ortografía. El test se actualiza
      // porque el hecho cambió, no porque estorbe: para CS y RU sigue
      // afirmando exactamente lo mismo que afirmaba.
      if (lang === 'ro') {
        expect(c.ALL_CONCEPTS.length).toBeGreaterThan(0);
        expect(c.BLOCKS.length).toBeGreaterThan(0);
        expect(c.getBlock(1).lessons.length).toBeGreaterThan(0);
        expect(() => c.getBlock(99)).toThrow();
      } else if (lang === 'la') {
        // Y desde el 2026-09-10 el LATÍN tampoco está vacío: tiene sus 117
        // conceptos derivados del inventario y los bloques que tienen
        // lote. Su bloque 1 (ortografía) sigue sin lecciones y por eso
        // `getBlock(1)` SÍ tira — que es la afirmación que este test hacía
        // y que en latín sigue siendo verdad, sólo que ahora por el motivo
        // concreto y no por estar el idioma entero a cero.
        expect(c.ALL_CONCEPTS.length).toBeGreaterThan(0);
        expect(c.BLOCKS.length).toBeGreaterThan(0);
        expect(() => c.getBlock(1)).toThrow();
        expect(c.getBlock(2).lessons.length).toBeGreaterThan(0);
      } else {
        expect(c.BLOCKS).toEqual([]);
        expect(c.ALL_CONCEPTS).toEqual([]);
        expect(() => c.getBlock(1)).toThrow();
      }
    });

    it("loadAllBlocks: [] en los scaffolds vacíos; ro y la ya sirven contenido", async () => {
      const blocks = await loadAllBlocks(lang);
      if (lang === 'ro' || lang === 'la') expect(blocks.length).toBeGreaterThan(0);
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

    it("loadConcepts: [] en los scaffolds vacíos; ro y la sirven sus conceptos", async () => {
      // ⚠ ro y la tenían `concepts.json` en `[]` teniendo currículo, y no
      //   por diseño: `scripts/generate-curriculum.ts` estaba clavado a
      //   portugués con el comentario «solo PT tiene curriculum real»,
      //   que dejó de ser verdad dos veces sin que nadie tocara el
      //   fichero. Es la misma avería que tuvo el portugués con 50 de 241
      //   conceptos. Hoy el generador resuelve la fuente por idioma.
      const cs = await loadConcepts(lang);
      if (lang === 'ro' || lang === 'la') expect(cs.length).toBeGreaterThan(0);
      else expect(cs).toEqual([]);
    });
  });

  it("PT remains non-empty (regression guard)", async () => {
    const c = await loadCurriculum("pt");
    expect(c.BLOCKS.length).toBeGreaterThan(0);
    expect(await loadAllStories("pt")).not.toEqual([]);
    expect(await loadDiagnostic("pt")).not.toBeNull();
  });
});

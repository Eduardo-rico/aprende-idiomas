// tests/unit/loaders-lang.test.ts
// Phase 2: la familia de loaders funciona por idioma. PT carga contenido
// real; los scaffolds (RU/RO/CS) devuelven arrays/objetos vacíos.
import { describe, it, expect } from 'vitest';
import {
  loadCurriculum, loadBlock, loadAllBlocks, loadStory, loadAllStories,
  loadDiagnostic, loadVocabCatalog, loadFallbackDict, loadManifest, loadConcepts,
} from '@/lib/data/loaders';

describe('loadCurriculum("pt")', () => {
  it('retorna 11 bloques y ALL_CONCEPTS no vacío', async () => {
    const c = await loadCurriculum('pt');
    expect(c.BLOCKS).toHaveLength(11);
    expect(c.ALL_CONCEPTS.length).toBeGreaterThan(0);
  });

  it('getBlock/getLesson/getConceptsByIds funcionan para ids conocidos', async () => {
    const c = await loadCurriculum('pt');
    const b1 = c.getBlock(1);
    expect(b1.id).toBe(1);
    const lesson = c.getLesson('b1-l1-alfabeto-acentos');
    expect(lesson.id).toBe('b1-l1-alfabeto-acentos');
    const concepts = c.getConceptsByIds(['b1-alfabeto']);
    expect(concepts[0]?.id).toBe('b1-alfabeto');
  });
});

describe('loadAllBlocks("pt")', () => {
  it('retorna la unión de b1..bN como un solo array', async () => {
    const all = await loadAllBlocks('pt');
    // 9 bloques (b1..b8, b10 — b9 es freeDrill sin exercises generados).
    expect(all.length).toBeGreaterThan(100);
  });
});

describe('loadBlock("pt", 1)', () => {
  it('retorna array de exercises para el bloque 1', async () => {
    const b1 = await loadBlock('pt', 1);
    expect(Array.isArray(b1)).toBe(true);
    expect((b1 as unknown[]).length).toBeGreaterThan(0);
  });

  it('null para bloque inexistente', async () => {
    const missing = await loadBlock('pt', 999);
    expect(missing).toBeNull();
  });

  it('null para id inválido (defensa contra path traversal)', async () => {
    const bad = await loadBlock('pt', NaN);
    expect(bad).toBeNull();
  });
});

describe('loadAllStories / loadStory', () => {
  it('carga todas las historias (al menos 1)', async () => {
    const stories = await loadAllStories('pt');
    expect(stories.length).toBeGreaterThan(0);
  });

  it('loadStory("pt", id) retorna Story válida', async () => {
    const stories = await loadAllStories('pt');
    const first = stories[0]!;
    const story = await loadStory('pt', first.id);
    expect(story?.id).toBe(first.id);
  });

  it('loadStory("pt", "invalid") retorna null', async () => {
    const story = await loadStory('pt', '../etc/passwd');
    expect(story).toBeNull();
  });
});

describe('loadDiagnostic("pt")', () => {
  it('retorna el diagnostic con al menos 20 questions (incluye ceiling B4/B6/B8)', async () => {
    const d = await loadDiagnostic('pt');
    expect(d).not.toBeNull();
    expect(d?.questions.length).toBe(26);
    // E13: ceiling items let learners place beyond B3.
    expect(d?.questions.some((q) => q.blockId > 3)).toBe(true);
  });
});

describe('loadVocabCatalog / loadFallbackDict / loadManifest / loadConcepts ("pt")', () => {
  it('catalog tiene entradas', async () => {
    const v = await loadVocabCatalog('pt');
    expect(v.length).toBeGreaterThan(100);
  });

  it('fallback dict es un objeto no vacío', async () => {
    const f = await loadFallbackDict('pt');
    expect(typeof f).toBe('object');
    expect(Object.keys(f).length).toBeGreaterThan(0);
  });

  it('manifest tiene campos esperados', async () => {
    const m = await loadManifest('pt');
    expect(m.modelText).toBeTruthy();
    expect(m.modelTts).toBeTruthy();
  });

  it('concepts tiene entradas', async () => {
    const c = await loadConcepts('pt');
    expect(c.length).toBeGreaterThan(0);
  });
});

describe('Loaders para idioma sin scaffold (xx)', () => {
  // El cast evita el guard de tipos: queremos probar que un id de runtime
  // no soportado no crashea (el lang layout filtra, pero los loaders son
  // robustos para evitar crashes si se llaman desde una API).
  it('loadAllBlocks retorna []', async () => {
    // @ts-expect-error -- probando id fuera del registry
    const all = await loadAllBlocks('xx');
    expect(all).toEqual([]);
  });

  it('loadCurriculum retorna stub vacío', async () => {
    // @ts-expect-error -- probando id fuera del registry
    const c = await loadCurriculum('xx');
    expect(c.BLOCKS).toEqual([]);
    expect(() => c.getBlock(1)).toThrow();
  });

  it('loadDiagnostic retorna null', async () => {
    // @ts-expect-error -- probando id fuera del registry
    const d = await loadDiagnostic('xx');
    expect(d).toBeNull();
  });
});

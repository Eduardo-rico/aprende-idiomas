// tests/unit/anchor.test.ts
//
// El anclaje decide qué destreza evidencia cada ejercicio, y por tanto
// qué columnas del nivel se pueden llenar con el corpus que ya existe.
//
// Los dos tests que más importan son los que comprueban lo que NO cuenta:
// si la traducción contara como mediación y algo contara como interacción,
// el nivel global —que es el mínimo de las destrezas— dejaría de detectar
// el agujero más grande del curso.
import { describe, it, expect } from 'vitest';
import { anclarEjercicio, resumenAnclaje } from '@/lib/data/anchor';

const ex = (type: string, blockId = 6, data?: Record<string, unknown>) => ({ type, blockId, data });

describe('anclaje por tipo de ejercicio', () => {
  it('lo que exige escribir portugués es producción escrita', () => {
    for (const t of ['error_correction', 'fill_blank', 'conjugation']) {
      expect(anclarEjercicio(ex(t))?.skill).toBe('produccion_escrita');
    }
  });

  it('lo que sólo exige reconocer es comprensión lectora', () => {
    for (const t of ['flashcard', 'multiple_choice', 'matching', 'verb_preposition']) {
      expect(anclarEjercicio(ex(t))?.skill).toBe('comprension_lectora');
    }
  });

  it('escuchar es comprensión oral', () => {
    expect(anclarEjercicio(ex('listening'))?.skill).toBe('comprension_oral');
  });

  it('la traducción se clasifica por su destino, no por su nombre', () => {
    expect(anclarEjercicio(ex('translation', 6, { targetLang: 'pt-pt' }))?.skill).toBe('produccion_escrita');
    expect(anclarEjercicio(ex('translation', 6, { targetLang: 'es' }))?.skill).toBe('comprension_lectora');
  });
});

describe('lo que deliberadamente NO cuenta', () => {
  it('ninguna traducción cuenta como MEDIACIÓN', () => {
    // Una traducción sin destinatario, propósito ni canal es traducción,
    // no mediación. Contarla infla la columna con 288 ítems que no la
    // ejercitan, y es cómo un eje de niveles se vuelve decorativo.
    for (const target of ['es', 'pt-pt', 'pt-br']) {
      expect(anclarEjercicio(ex('translation', 6, { targetLang: target }))?.skill).not.toBe('mediacion');
    }
  });

  it('NADA del corpus cuenta como interacción', () => {
    const tipos = ['flashcard', 'fill_blank', 'listening', 'translation', 'error_correction',
      'conjugation', 'matching', 'multiple_choice', 'verb_preposition', 'shadowing'];
    const anclados = tipos.map((t) => anclarEjercicio(ex(t))?.skill);
    expect(anclados).not.toContain('interaccion');
  });

  it('los tipos sin destreza clara no se anclan', () => {
    for (const t of ['lesson', 'chunk', 'sentence_construction', 'inventado']) {
      expect(anclarEjercicio(ex(t))).toBeNull();
    }
  });
});

describe('anclaje por bloque → nivel', () => {
  it('toma el nivel más alto que toca el bloque', () => {
    expect(anclarEjercicio(ex('flashcard', 1))?.cefr).toBe('A1');
    expect(anclarEjercicio(ex('flashcard', 4))?.cefr).toBe('B1');
    expect(anclarEjercicio(ex('flashcard', 6))?.cefr).toBe('B2');
  });

  it('un bloque inexistente no ancla', () => {
    expect(anclarEjercicio(ex('flashcard', 99))).toBeNull();
  });

  it('compone el id del descriptor con idioma, nivel y destreza', () => {
    expect(anclarEjercicio(ex('error_correction', 6), 'pt')?.descriptorId).toBe('pt.B2.produccion_escrita');
  });
});

describe('resumenAnclaje sobre el corpus real', () => {
  it('deja ver qué destrezas quedan a cero', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const dir = path.join(process.cwd(), 'lib/data/languages/pt/blocks');
    const todos: { type: string; blockId: number; data?: Record<string, unknown> }[] = [];
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json'))) {
      const d = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
      for (const e of Array.isArray(d) ? d : d.exercises) todos.push(e);
    }
    const resumen = resumenAnclaje(todos, 'pt');
    const destrezas = new Set(Object.keys(resumen).map((k) => k.split('.')[2]));

    // Con el corpus actual se pueden evidenciar tres destrezas…
    expect(destrezas.has('produccion_escrita')).toBe(true);
    expect(destrezas.has('comprension_lectora')).toBe(true);
    expect(destrezas.has('comprension_oral')).toBe(true);
    // La buena noticia anunciada llegó el 2026-07-29: el piloto de la
    // ola B2C2 estrenó la mediación (b2c2-med-01/02, doble adversarial).
    expect(destrezas.has('mediacion')).toBe(true);
    // …y dos siguen a cero. Que TAMBIÉN fallen algún día será otra buena
    // noticia: querrá decir que ya existe contenido que las ejercita.
    expect(destrezas.has('interaccion')).toBe(false);
    expect(destrezas.has('produccion_oral')).toBe(false);
  });
});

// tests/unit/ortografia-ro.test.ts
//
// La norma ortográfica del rumano en tres sitios que tienen que decir lo
// mismo: el canonicalizador (comparar y hashear), el gate de escritura, y
// el normalizador de la ingesta de lecturas (`texto-ro.mjs`, otro runtime).
// Cada gate se ve EN ROJO con el caso que debe cazar antes de creerle el
// verde; y el hash se comprueba con un id de PT que no puede moverse.
import { describe, it, expect } from 'vitest';
import { canonicalRo, tieneCedilla, revisarOrtografiaRo } from '@/lib/lang/ortografia-ro';
import { normalizeAnswer, answersMatchCard } from '@/lib/exercises/normalize';
import { hashKey } from '@/scripts/lib/cache';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { normalizarDiacriticos, tieneCedilla as tieneCedillaMjs } from '@/scripts/lectura/texto-ro.mjs';

const CON_COMA = 'și țară Șerban Țepeș';
const CON_CEDILLA = 'şi ţară Şerban Ţepeş';
const DESCOMPUESTA = 'şi ţară'; // s + U+0327, la cedilla con otro disfraz

describe('canonicalRo: cedilla → coma', () => {
  it('convierte las cuatro letras, compuestas y descompuestas, y es idempotente', () => {
    expect(canonicalRo(CON_CEDILLA)).toBe(CON_COMA);
    expect(canonicalRo(DESCOMPUESTA)).toBe('și țară');
    expect(canonicalRo(CON_COMA)).toBe(CON_COMA);
  });
  it('no toca la «ç» del portugués ni nada más', () => {
    expect(canonicalRo('estação, coração')).toBe('estação, coração');
    expect(canonicalRo('Ç ç')).toBe('Ç ç');
  });
  it('detecta la cedilla en las dos formas', () => {
    expect(tieneCedilla(CON_CEDILLA)).toBe(true);
    expect(tieneCedilla(DESCOMPUESTA)).toBe(true);
    expect(tieneCedilla(CON_COMA)).toBe(false);
  });
  it('dice lo MISMO que el normalizador de la ingesta de lecturas (otro runtime, misma regla)', () => {
    for (const s of [CON_CEDILLA, DESCOMPUESTA, CON_COMA, 'ç ş']) {
      expect(canonicalRo(s)).toBe(normalizarDiacriticos(s));
      expect(tieneCedilla(s)).toBe(tieneCedillaMjs(s));
    }
  });
});

describe('normalizeAnswer y el hash leen cedilla como coma', () => {
  it('una respuesta con cedilla vale como la clave con coma', () => {
    expect(normalizeAnswer('Şi eu')).toBe(normalizeAnswer('și eu'));
    expect(answersMatchCard('Vreau şi eu o cafea.', 'Vreau și eu o cafea.')).toBe(true);
  });
  it('sigue siendo estricto con lo que importa: masa ≠ masă, in ≠ în', () => {
    expect(normalizeAnswer('masa')).not.toBe(normalizeAnswer('masă'));
    expect(normalizeAnswer('in')).not.toBe(normalizeAnswer('în'));
  });
  it('dos ítems idénticos con distinta codificación son UN id (y un MP3)', () => {
    const a = hashKey({ type: 'fill_blank', data: { sentence: 'Vreau ___ eu.', answer: 'şi' } });
    const b = hashKey({ type: 'fill_blank', data: { sentence: 'Vreau ___ eu.', answer: 'și' } });
    expect(a).toBe(b);
  });
  it('ningún id de portugués se mueve: el algoritmo VIEJO (sólo NFC) y el nuevo dan el mismo hash sobre ítems reales de PT', () => {
    // El algoritmo de hash tal como era antes del 2026-09-01, reimplementado
    // aquí: NFC en strings, claves ordenadas, undefined fuera.
    const viejo = (v: unknown): unknown => {
      if (v === null || v === undefined) return null;
      if (typeof v === 'string') return v.normalize('NFC');
      if (typeof v === 'number') return Number.isFinite(v) ? v : null;
      if (typeof v === 'boolean') return v;
      if (Array.isArray(v)) return v.map(viejo);
      if (typeof v === 'object') {
        const o = v as Record<string, unknown>; const out: Record<string, unknown> = {};
        for (const k of Object.keys(o).sort()) if (o[k] !== undefined) out[k] = viejo(o[k]);
        return out;
      }
      return null;
    };
    const hashViejo = (k: unknown) => createHash('sha256').update(JSON.stringify(viejo(k))).digest('hex');
    const b1 = JSON.parse(readFileSync(path.join(process.cwd(), 'lib/data/languages/pt/blocks/b1.json'), 'utf8')) as { type: string; data: unknown; variantOverrides?: unknown; esContrast?: string }[];
    const b11 = JSON.parse(readFileSync(path.join(process.cwd(), 'lib/data/languages/pt/blocks/b11.json'), 'utf8')) as typeof b1;
    const muestra = [...b1.slice(0, 40), ...b11.slice(0, 40)];
    expect(muestra.length).toBeGreaterThan(50);
    for (const it of muestra) {
      const k = { type: it.type, data: it.data, variantOverrides: it.variantOverrides, esContrast: it.esContrast };
      expect(hashKey(k), it.type).toBe(hashViejo(k));
    }
  });
});

describe('revisarOrtografiaRo: el gate visto en rojo', () => {
  const clases = (s: string) => revisarOrtografiaRo(s).map((h) => `${h.clase}:${h.palabra}`);
  it('caza la cedilla, compuesta y descompuesta', () => {
    expect(clases('Vreau şi eu')).toEqual(['cedilla:şi']);
    expect(clases(DESCOMPUESTA)).toHaveLength(2);
  });
  it('caza la î interior de la grafía antigua: cînd, pînă, mînă, romîn', () => {
    expect(clases('cînd vii pînă la mine')).toEqual(['i-interior:cînd', 'i-interior:pînă']);
    expect(clases('romîn')).toEqual(['i-interior:romîn']);
  });
  it('caza sînt / sîntem / sînteți', () => {
    expect(clases('ei sînt aici, noi sîntem')).toEqual(['sint:sînt', 'sint:sîntem']);
  });
  it('NO dispara sobre la norma: sunt, când, început, neîncetat, reîncepe, bineînțeles, într-însul, a coborî', () => {
    expect(clases('sunt când început neîncetat reîncepe bineînțeles într-însul a coborî hotărî În Îl')).toEqual([]);
  });
  it('el inventario de puntos del rumano pasa el gate entero (nombre, descripción, motivo)', async () => {
    const { PUNTOS_RO } = await import('@/lib/data/languages/ro/inventario-puntos');
    const malos: string[] = [];
    for (const p of PUNTOS_RO) for (const c of ['nombre', 'descripcion', 'motivo'] as const)
      for (const h of revisarOrtografiaRo(p[c])) malos.push(`${p.id}.${c}: ${h.clase} «${h.palabra}»`);
    expect(malos, malos.join('\n')).toEqual([]);
  });
});

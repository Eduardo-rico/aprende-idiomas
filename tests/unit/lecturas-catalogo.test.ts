// tests/unit/lecturas-catalogo.test.ts
//
// Invariantes del catálogo PÚBLICO de lectura, sobre las lecturas
// reales — no sobre un fixture. La Ola E3 lo escribió al pasar el
// catálogo de 224 a 967 piezas: a esa escala una lectura rota ya no se
// ve leyendo, sólo midiendo. Los tres gates de la Ola L viven aquí
// dentro (procedencia, dominio público por aritmética, variante), más
// los que la escala añadió (id único, serie completa, cero aparato de
// Gutenberg dentro del texto).
//
// Si una tanda nueva sube las cifras, se actualizan MEDIDAS con
// `node scripts/lectura/medir-catalogo.mjs pt` — nunca a ojo.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const DIR = path.join(process.cwd(), 'lib/data/languages/pt/lecturas');

interface Pieza {
  id: string; titulo: string; autor: string; nivel: string;
  fuente?: string; licencia?: string; muerteAutor?: number; fuenteUrl?: string;
  original?: true; revisadoPor?: string; fechaRevision?: string;
  variante?: string; modo?: string;
  serie?: { id: string; titulo: string; orden: number };
  parrafos: { texto: string }[];
}

const archivos = fs.readdirSync(DIR).filter((f) => f.endsWith('.json')).sort();
const catalogo: { archivo: string; l: Pieza }[] = archivos.map((f) => ({
  archivo: f,
  l: JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')) as Pieza,
}));

const palabras = (l: Pieza) =>
  l.parrafos.reduce((a, p) => a + p.texto.split(/\s+/).filter(Boolean).length, 0);

describe('catálogo de lectura PT', () => {
  it('tiene el tamaño medido de la Ola E3 (piso, no igualdad: crecer está bien)', () => {
    const total = catalogo.reduce((a, x) => a + palabras(x.l), 0);
    // Medido 2026-09-01 al cierre de E3: 967 lecturas · 52 series ·
    // 3.219.799 palabras (pt 2.091.688 · pt-br 1.128.111).
    expect(catalogo.length).toBeGreaterThanOrEqual(967);
    expect(total).toBeGreaterThanOrEqual(3_219_799);
    const pt = catalogo.filter((x) => (x.l.variante ?? 'pt') === 'pt').reduce((a, x) => a + palabras(x.l), 0);
    // La meta de inmersión del plan es PT-PT: el estante brasileño no la paga.
    expect(pt).toBeGreaterThanOrEqual(1_900_000);
  });

  it('el id de cada lectura es su nombre de archivo, y es único', () => {
    const vistos = new Set<string>();
    for (const { archivo, l } of catalogo) {
      expect(l.id, archivo).toBe(archivo.slice(0, -5));
      expect(vistos.has(l.id), `id duplicado: ${l.id}`).toBe(false);
      vistos.add(l.id);
    }
  });

  it('pasa el gate de procedencia por su vía (dominio público u original)', () => {
    for (const { archivo, l } of catalogo) {
      const campos = l.original === true
        ? ['titulo', 'autor', 'nivel', 'revisadoPor', 'fechaRevision']
        : ['titulo', 'autor', 'muerteAutor', 'fuenteUrl', 'nivel', 'fuente', 'licencia'];
      for (const c of campos) expect(l[c as keyof Pieza], `${archivo} sin ${c}`).toBeTruthy();
    }
  });

  it('el dominio público sale de la ARITMÉTICA, no de una suposición', () => {
    const hoy = new Date().getFullYear();
    for (const { archivo, l } of catalogo) {
      if (l.original === true || l.muerteAutor === undefined) continue;
      // La regla más conservadora de las tres que usa el proyecto:
      // México, vida + 100.
      expect(l.muerteAutor + 101, `${archivo}: †${l.muerteAutor} no es libre en MX`).toBeLessThanOrEqual(hoy);
    }
  });

  it('la variante declarada es pt o pt-br (la fija el origen del autor)', () => {
    for (const { archivo, l } of catalogo) {
      expect(['pt', 'pt-br', undefined], archivo).toContain(l.variante);
    }
  });

  it('ninguna pieza está vacía', () => {
    for (const { archivo, l } of catalogo) {
      expect(l.parrafos.length, archivo).toBeGreaterThan(0);
      expect(l.parrafos.every((p) => typeof p.texto === 'string' && p.texto.trim().length > 0), archivo).toBe(true);
    }
  });

  it('cada serie numera sus piezas 1..n sin huecos ni repetidos', () => {
    const series = new Map<string, number[]>();
    for (const { l } of catalogo) {
      if (!l.serie) continue;
      series.set(l.serie.id, [...(series.get(l.serie.id) ?? []), l.serie.orden]);
    }
    for (const [id, ordenes] of series) {
      const o = [...ordenes].sort((a, b) => a - b);
      expect(o, `serie ${id}`).toEqual(o.map((_, i) => i + 1));
    }
  });

  it('no queda aparato del transcriptor de Gutenberg dentro del texto', () => {
    // La tabla de erratas en ASCII y el «Lista de erros corrigidos» del
    // transcriptor NO son texto de autor. Estaban dentro de os-maias-c18
    // y o-crime-do-padre-amaro-c25 desde la Ola L.
    const aparato = /\+[-+=]{6,}\+|End of (the )?Project Gutenberg|Aqui encontram-se listados|\berros?\b[^.]{0,60}\bcorrigid/i;
    const sucias = catalogo
      .filter(({ l }) => l.parrafos.some((p) => aparato.test(p.texto)))
      .map((x) => x.archivo);
    expect(sucias).toEqual([]);
  });
});

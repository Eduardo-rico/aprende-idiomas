// tests/unit/lecturas-catalogo.invariantes.ts
//
// Los invariantes del catálogo PÚBLICO de lectura, parametrizados por
// lengua. La Ola E3 los escribió para PT (967 piezas: una lectura rota
// ya no se ve leyendo, sólo midiendo); la fase F los reutiliza para RO
// sin copiarlos — una regla copiada se desincroniza en la copia N+1.
//
// Cada lengua declara su piso MEDIDO (`node scripts/lectura/medir-catalogo.mjs
// <lang>`) y sus variantes admitidas; el resto es común.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

export interface Pieza {
  id: string; titulo: string; autor: string; nivel: string;
  fuente?: string; licencia?: string; muerteAutor?: number; fuenteUrl?: string;
  original?: true; revisadoPor?: string; fechaRevision?: string;
  variante?: string; modo?: string;
  serie?: { id: string; titulo: string; orden: number };
  notaOrtografia?: string;
  parrafos: { texto: string }[];
}

export interface PisoCatalogo {
  lang: string;
  variantes: string[];
  /** Cifras medidas al cierre de la última tanda: piso, no igualdad. */
  lecturas: number;
  palabras: number;
  /** Palabras exigidas en la variante de inmersión (la que paga la meta). */
  inmersion?: { variante: string; palabras: number };
  /** Aparato del transcriptor propio de la fuente de la lengua (se suma al común). */
  aparato?: RegExp;
  /** Gates extra propios de la lengua (grafía, diacríticos…). */
  extra?: (catalogo: { archivo: string; l: Pieza }[]) => void;
}

export function cargarCatalogo(lang: string): { archivo: string; l: Pieza }[] {
  const dir = path.join(process.cwd(), 'lib/data/languages', lang, 'lecturas');
  const archivos = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort();
  return archivos.map((f) => ({ archivo: f, l: JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as Pieza }));
}

/** PALABRA = algo con una letra dentro (el criterio de medir-catalogo.mjs). */
export const palabras = (l: Pieza) =>
  l.parrafos.reduce((a, p) => a + p.texto.split(/\s+/).filter((t) => /\p{L}/u.test(t)).length, 0);

export function invariantesDelCatalogo(piso: PisoCatalogo) {
  const catalogo = cargarCatalogo(piso.lang);

  describe(`catálogo de lectura ${piso.lang.toUpperCase()}`, () => {
    it('tiene el tamaño medido de la última tanda (piso, no igualdad: crecer está bien)', () => {
      const total = catalogo.reduce((a, x) => a + palabras(x.l), 0);
      expect(catalogo.length).toBeGreaterThanOrEqual(piso.lecturas);
      expect(total).toBeGreaterThanOrEqual(piso.palabras);
      if (piso.inmersion) {
        const v = catalogo.filter((x) => x.l.variante === piso.inmersion!.variante).reduce((a, x) => a + palabras(x.l), 0);
        expect(v).toBeGreaterThanOrEqual(piso.inmersion.palabras);
      }
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

    it(`TODA lectura declara su variante, y es una de ${piso.variantes.join('/')}`, () => {
      for (const { archivo, l } of catalogo) {
        expect(l.variante, `${archivo} no declara variante`).toBeDefined();
        expect(piso.variantes, archivo).toContain(l.variante);
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

    it('no queda aparato del transcriptor dentro del texto', () => {
      // Gutenberg (común): la tabla de erratas en ASCII y el «Lista de
      // erros corrigidos» — estaban dentro de os-maias-c18 y
      // o-crime-do-padre-amaro-c25 desde la Ola L. Lo propio de cada
      // fuente lo declara la lengua en `aparato`.
      const comun = /\+[-+=]{6,}\+|End of (the )?Project Gutenberg|Aqui encontram-se listados|\berros?\b[^.]{0,60}\bcorrigid/i;
      const sucias = catalogo
        .filter(({ l }) => l.parrafos.some((p) => comun.test(p.texto) || (piso.aparato?.test(p.texto) ?? false)))
        .map((x) => x.archivo);
      expect(sucias).toEqual([]);
    });

    if (piso.extra) piso.extra(catalogo);
  });
}

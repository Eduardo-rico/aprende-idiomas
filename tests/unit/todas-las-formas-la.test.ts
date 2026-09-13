// tests/unit/todas-las-formas-la.test.ts
//
// EL ENUMERADOR DEL DOMINIO, Y EL TEST QUE IMPIDE LA QUINTA VEZ.
//
// El hueco se ha abierto cuatro veces con la misma forma: se añade una
// tabla a la máquina y los consumidores se quedan atrás EN VERDE, porque
// nadie los tocó. La cuarta costó cara: `l1-larga-por-posicion` quedó
// declarado como bloqueado por falta de vocabulario, y era falso —
// `tenebrae` estaba en `PLURALIA_TANTUM` desde el principio, con 44 tokens
// medidos, pero esa tabla no producía formas—.
//
// Lo que impide la quinta no es un comentario: es este test. Lee los
// ficheros de `lib/data/languages/la/`, saca las tablas que declaran, y
// exige que el enumerador las conozca todas. Una tabla nueva que nadie
// enchufe pone esto en rojo.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { formasUnicasDeL1, TABLAS_QUE_PRODUCEN_FORMAS, todasLasFormasDeL1 } from '@/lib/data/languages/la/todas-las-formas';
import { decideLaMutaCumLiquida } from '@/scripts/lib/gate-inventario-vs-lexico';
import atestacion from '@/lib/data/languages/la/atestacion-l1.json';

const DIR = path.join(process.cwd(), 'lib/data/languages/la');

/** Las tablas que el directorio declara: `export const X_MAYUS: T[] = [`. */
function tablasDeclaradas(): string[] {
  const out: string[] = [];
  for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith('.ts'))) {
    const s = fs.readFileSync(path.join(DIR, f), 'utf8');
    for (const m of s.matchAll(/export const ([A-Z][A-Z0-9_]+)\s*:\s*[^=]*\[\]\s*=/g)) out.push(m[1]!);
  }
  return [...new Set(out)];
}

// Tablas que existen y NO producen formas flexionadas. Cada una con su
// motivo escrito: una lista de excepciones sin motivo es el agujero que
// este test viene a tapar.
const NO_PRODUCEN: Record<string, string> = {
  BLOQUES_LA: 'son los bloques del currículo, no palabras',
  PUNTOS_LA: 'son los puntos del inventario',
  CONCEPTOS_LA: 'derivados de PUNTOS_LA para el grafo de conceptos',
  ALL_CONCEPTS: 'el grafo de conceptos del currículo',
  TALLAS: 'tallas de lección, no palabras',
  BLOCKS: 'bloques del currículo',
  CASOS_DE_PRONOMBRE: 'es la lista de casos, no de palabras',
  VOCES_LA: 'son voces de TTS',
  REFLEJOS: 'pares para el auditor de cantidad: las formas ya salen de sus lemas',
  NO_LLEVAN_ENCLITICO: 'lista de LEMAS que no admiten el enclítico; sus formas ya entran por NOMBRES_L1',
  // Las dos mitades de INDECLINABLES_L1, que es la que el enumerador lee.
  // Se exportan para que el test de procedencia pueda contarlas por
  // separado, no para producir formas por su cuenta.
  INDECLINABLES_IMPORTADOS: 'la mitad de INDECLINABLES_L1 que viene del registro de cantidad; sus formas entran por INDECLINABLES_L1',
  INDECLINABLES_A_MANO: 'la otra mitad, la escrita a mano. Se exporta para que el generador del registro lea ÉSTA y no la compuesta: leer la compuesta devuelve los importados al registro como propios y borra la importación',
  // El guardián cazó estas dos al entrar el subjuntivo, que es la tercera
  // vez en el día que avisa. No son tablas de material: son las etiquetas
  // de los ejes del propio módulo.
  TIEMPOS_SUBJ: 'los cuatro nombres de tiempo del subjuntivo, no palabras',
  PERSONAS_SUBJ: 'las seis personas, no palabras',
};

describe('el enumerador conoce todas las tablas que producen formas', () => {
  it('ninguna tabla del directorio se queda fuera sin motivo escrito', () => {
    const declaradas = tablasDeclaradas();
    const conocidas = new Set<string>([...TABLAS_QUE_PRODUCEN_FORMAS, ...Object.keys(NO_PRODUCEN)]);
    const huerfanas = declaradas.filter((t) => !conocidas.has(t));
    expect(huerfanas, 'tablas nuevas que nadie ha enchufado ni declarado como no-productoras').toEqual([]);
    // y que el test esté MIRANDO de verdad
    expect(declaradas.length).toBeGreaterThan(6);
  });

  it('y cada tabla declarada como productora aporta formas de verdad', () => {
    const porTabla = new Map<string, number>();
    for (const f of todasLasFormasDeL1()) porTabla.set(f.tabla, (porTabla.get(f.tabla) ?? 0) + 1);
    for (const t of TABLAS_QUE_PRODUCEN_FORMAS) expect(porTabla.get(t) ?? 0, t).toBeGreaterThan(0);
  });
});

describe('la evidencia congelada mira TODAS las tablas, no tres', () => {
  it('cada tabla productora tiene sus lemas en atestacion-l1.json', () => {
    // Hasta el 2026-09-12 el congelador llamaba a `todasLasFormas(nombres,
    // verbos, adjetivos)`: tres tablas de catorce. O sea que **el guardián
    // que caza las desincronizaciones del lexicón no miraba seis tablas
    // enteras** —indeclinables, pluralia, adjetivos de 3.ª, irregulares,
    // compuestos de `sum`, pronombres y personales— y estaba en verde.
    //
    // Lo destapó preguntar, al meter una máquina nueva, no «qué invariantes
    // existen» sino cuáles la MIRAN.
    const cong = new Set(Object.keys((atestacion as { lemas: Record<string, unknown> }).lemas));
    const porTabla = new Map<string, Set<string>>();
    for (const f of todasLasFormasDeL1()) {
      const lema = f.clave.split('.')[0]!;
      if (!porTabla.has(f.tabla)) porTabla.set(f.tabla, new Set());
      porTabla.get(f.tabla)!.add(lema);
    }
    const ciegas: string[] = [];
    for (const t of TABLAS_QUE_PRODUCEN_FORMAS) {
      const lemas = [...(porTabla.get(t) ?? [])];
      if (lemas.length > 0 && lemas.filter((l) => cong.has(l)).length === 0) ciegas.push(t);
    }
    expect(ciegas, 'tablas que la evidencia congelada no mira').toEqual([]);
  });
});

describe('lo que costó no tenerlo', () => {
  it('el enumerador viejo se dejaba 745 formas', () => {
    // 1.429 miraba tres tablas de diez; 2.174 las mira todas.
    expect(formasUnicasDeL1().length).toBeGreaterThan(2100);
  });

  it('y entre ellas «tenebrae», que desbloquea un punto entero', () => {
    const decisivas = formasUnicasDeL1().filter(decideLaMutaCumLiquida);
    expect(decisivas).toContain('tenebrae');
    expect(decisivas.length).toBeGreaterThanOrEqual(2);
  });
});

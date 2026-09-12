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

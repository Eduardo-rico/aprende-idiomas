// Ningún lote puede declarar una persona que el paradigma no tenga.
//
// El typecheck lo veía y el typecheck no se corrió: los gates del lote son
// de CONTENIDO, y publiqué sin `tsc`. Seis ítems salieron al corpus con
// «trouxeundefined» dentro de la respuesta. Este test no depende de que
// nadie se acuerde de nada — corre con la suite.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { PERSONAS } from '@/scripts/lib/paradigma-pt';

const DIR = path.join(process.cwd(), 'scripts/lotes');

describe('personas declaradas en los lotes', () => {
  it('todas son claves del paradigma', () => {
    const malas: string[] = [];
    for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith('.ts'))) {
      const s = fs.readFileSync(path.join(DIR, f), 'utf8');
      for (const m of s.matchAll(/\bper:\s*'([^']+)'/g)) {
        if (!(PERSONAS as readonly string[]).includes(m[1]!)) malas.push(`${f}: per: '${m[1]}'`);
      }
    }
    // «vocês», «elas», «ela», «você» son personas del idioma pero no del
    // paradigma, que usa 'ele' y 'eles' para las terceras.
    expect(malas).toEqual([]);
  });
});

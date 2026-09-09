// tests/unit/formas-no-producidas-la.test.ts
//
// La auditoría que mira al revés: no «¿está atestiguado lo que produzco?»
// sino «¿produzco lo atestiguado?». Caza huecos de la máquina, que el otro
// gate no puede ver porque callar no es inventar.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { auditar } from '@/scripts/lectura/formas-que-la-maquina-no-produce';
import { VERBOS_L1 } from '@/lib/data/languages/la/lexicon-l1';
import { variantesDelPerfecto } from '@/lib/data/languages/la/paradigma-la';

const hayCorpus = fs.existsSync('scripts/.cache/treebanks');
const V = (l: string) => VERBOS_L1.find((x) => x.lema === l)!;

describe('el perfecto sincopado, que la auditoría destapó', () => {
  it('«audīstis» por «audīvistis» y «audiērunt» por «audīvērunt»', () => {
    // 61 tokens de lemas que el lexicón ya tenía. El brief del latinista lo
    // nombra entre las formas que el latín escolar marca con asterisco
    // indebidamente.
    expect(variantesDelPerfecto(V('audiō'), '2pl', 'perfecto')).toContain('audīstis');
    expect(variantesDelPerfecto(V('audiō'), '3pl', 'perfecto')).toContain('audiērunt');
    expect(variantesDelPerfecto(V('audiō'), '2sg', 'perfecto')).toContain('audīstī');
  });

  it('y también en pluscuamperfecto y futuro perfecto', () => {
    expect(variantesDelPerfecto(V('audiō'), '3sg', 'futuro-perfecto')).toContain('audierit');
    expect(variantesDelPerfecto(V('audiō'), '3pl', 'pluscuamperfecto')).toContain('audierant');
  });

  it('en los de -āv- contrae distinto: «amāstis», «amārunt»', () => {
    expect(variantesDelPerfecto(V('amō'), '2pl', 'perfecto')).toContain('amāstis');
    expect(variantesDelPerfecto(V('amō'), '3pl', 'perfecto')).toContain('amārunt');
  });

  it('y la forma plena sigue siendo la primera', () => {
    expect(variantesDelPerfecto(V('audiō'), '2pl', 'perfecto')[0]).toBe('audīvistis');
    expect(variantesDelPerfecto(V('dūcō'), '2pl', 'perfecto')).toEqual(['dūxistis']);
  });
});

describe.runIf(hayCorpus)('la auditoría contra el corpus', () => {
  it('los huecos conocidos son pocos y están identificados', () => {
    const r = auditar();
    // Al escribirla eran 119. Excluida la pasiva —que es un punto entero, no
    // un hueco— y añadido el sincopado, bajan a unas cuarenta.
    expect(r.length).toBeLessThan(60);
  });

  it('y el más grande sigue siendo `loca`, el plural neutro de `locus`', () => {
    const r = auditar();
    expect(r[0]?.forma.toLowerCase()).toBe('loca');
  });

  it('EL ERROR DEL CORPUS: «voice» por «vōce» en perseus-ud-test', () => {
    // Con la anotación latina correcta (`vōx`, Abl Fem Sing). La frase es
    // «taeterrima vōce de Laserpiciario mimo canticum extorsit». Alguien
    // pasó un corrector inglés por encima del texto latino.
    //
    // No lo encontró ninguna heurística sobre el token: probé a buscar
    // palabras inglesas y devolvió 26 falsos —`quod`, `sunt`, `dīxit`,
    // `haec`— porque el diccionario inglés contiene medio latín. Lo encontró
    // tener un GENERADOR INDEPENDIENTE contra el que comparar.
    const r = auditar();
    expect(r.some((x) => x.forma.toLowerCase() === 'voice')).toBe(true);
  });
});

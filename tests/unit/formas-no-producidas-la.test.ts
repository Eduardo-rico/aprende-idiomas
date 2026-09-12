// tests/unit/formas-no-producidas-la.test.ts
//
// La auditoría que mira al revés: no «¿está atestiguado lo que produzco?»
// sino «¿produzco lo atestiguado?». Caza huecos de la máquina, que el otro
// gate no puede ver porque callar no es inventar.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { auditar, claseDeHueco, huecosPorClase } from '@/scripts/lectura/formas-que-la-maquina-no-produce';
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
  // ── EL NÚMERO SOLO DEJÓ DE SIGNIFICAR ALGO EL 2026-09-12 ──
  //
  // Hasta ese día la auditoría miraba tres tablas de diez, así que sólo
  // auditaba nombres, verbos y el lema de los adjetivos: unos cuarenta
  // huecos. Enchufada al enumerador bueno empezó a mirar también
  // pronombres, irregulares, pluralia e indeclinables, y saltó a 256.
  //
  // No es ruido y no se tapa bajando el listón: son CLASES nombrables, y
  // cada una está acotada aquí con su motivo. Un gate que dijera «256» y
  // nada más sería un gate apagado.
  it('los huecos se reparten en clases conocidas, y cada una está acotada', () => {
    const c = huecosPorClase();
    // La grafía alterna de los indeclinables: `ab`/`ā`, `atque`/`ac`,
    // `neque`/`nec`. El lexicón guarda una forma y el corpus trae las dos.
    expect(c['grafia-del-indeclinable']!.entradas).toBeLessThan(25);
    // El GRADO: la máquina no tiene comparativo ni superlativo. Es un área
    // del currículo sin construir, no un fallo — y se detecta por la
    // anotación del treebank (`Degree=Cmp|Sup`), no adivinando sufijos.
    expect(c['grado-del-adjetivo']!.entradas).toBeLessThan(150);
    // El perfectum de los irregulares y de los compuestos de `sum`: sale
    // del tema de perfecto, que `irregulares.ts` declara.
    expect(c['perfectum-del-irregular']!.entradas).toBeLessThan(90);
    expect(c['grafia-del-pronombre']!.entradas).toBeLessThan(25);
    expect(c['heteroclito-conocido']!.entradas).toBeLessThanOrEqual(6);
  });

  it('y lo que NO cae en ninguna clase sigue siendo poco y legible', () => {
    const sin = auditar().filter((h) => claseDeHueco(h.lema, h.rasgos ?? '') === 'sin-clasificar');
    // 46 entradas y 74 tokens al escribirlo. Lo que hay ahí dentro está
    // mirado uno a uno: la grafía `exs-`/`ex-` de `exspectō`, los adverbios
    // en `-ter`/`-ē` que la máquina no forma, el femenino que el corpus
    // lematiza bajo el masculino, el pluscuamperfecto sincopado
    // (`laudāram`) — que sí es un hueco real de la máquina — y tres
    // erratas del propio corpus: `voice` por `vōce`, `icurae` por `cūrae` y
    // `graviore` anotado `Degree=Pos`.
    expect(sin.length).toBeLessThan(60);
  });

  it('el heteróclito más grande sigue siendo `loca`, el plural neutro de `locus`', () => {
    const het = auditar().filter((h) => claseDeHueco(h.lema, h.rasgos ?? '') === 'heteroclito-conocido');
    expect(het.sort((a, b) => b.n - a.n)[0]?.forma.toLowerCase()).toBe('loca');
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

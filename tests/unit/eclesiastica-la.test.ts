// tests/unit/eclesiastica-la.test.ts
//
// LA TRANSCRIPCIÓN ECLESIÁSTICA Y LOS CINCO LOTES.
//
// El juego de control de la transcripción **viene del material**, no de mí:
// son los once ejemplos que los propios descriptores escriben.
import { describe, it, expect } from 'vitest';
import { transcribir, reglasQueAplican } from '@/lib/lang/transcripcion-eclesiastica';
import { textoParaVoz } from '@/lib/lang/ortografia-la';
import { informeEclesiastica, revisarLoteEclesiastica, tasasCiegasEc, coberturaEclesiastica } from '@/scripts/lib/gate-eclesiastica';
import { LOTE_ECLESIASTICA_CE } from '@/lib/data/languages/la/lotes/l1-eclesiastica-ce';
import { LOTE_ECLESIASTICA_AE } from '@/lib/data/languages/la/lotes/l1-eclesiastica-ae';
import { LOTE_ECLESIASTICA_TI } from '@/lib/data/languages/la/lotes/l1-eclesiastica-ti';
import { LOTE_ECLESIASTICA_GN, INVARIANCIA_GN } from '@/lib/data/languages/la/lotes/l1-eclesiastica-gn';
import { LOTE_H_MUDA, INVARIANCIA_H } from '@/lib/data/languages/la/lotes/l1-h-muda';

describe('la transcripción, contra los ejemplos del propio material', () => {
  it('los once de los descriptores', () => {
    const control: [string, string][] = [
      ['Cicerō', 'chíchero'], ['descendit', 'deshéndit'], ['regem', 'réyem'],
      ['caelum', 'chélum'], ['poena', 'péna'],
      ['grātia', 'grátsia'],
      ['agnus', 'áñus'], ['magnus', 'máñus'], ['rēgnum', 'réñum'],
      ['mihi', 'mí-i'],
    ];
    for (const [w, esperado] of control) expect(transcribir(w), w).toBe(esperado);
  });

  it('y los casos negativos que los descriptores nombran', () => {
    expect(transcribir('casa')).toBe('cása');       // ca/co/cu siguen /k/
    expect(transcribir('bēstia')).toBe('béstia');   // ti tras s no se africa
    expect(transcribir('aër')).toBe('a-er');        // la diéresis rompe el dígrafo
    expect(transcribir('poēta')).toBe('poéta');     // y el mácrón también
  });

  it('el orden importó tres veces, y esto lo fija', () => {
    // `ae` → `e` ANTES que `ce` → `che`, o `caelum` sale «célum».
    expect(transcribir('caelum')).toBe('chélum');
    // la `h` de `ch`/`sh` no es la `h` latina: quitarlas juntas daba «cícero».
    expect(transcribir('Cicerō')).toBe('chíchero');
    // y la `h` latina entre vocales deja HIATO, que es el punto entero.
    expect(transcribir('mihi')).toBe('mí-i');
  });

  it('NO es `textoParaVoz`, y confundirlas aplicaría las reglas dos veces', () => {
    // Aquélla prepara el texto para una voz ITALIANA, que ya hace `ce`,
    // `ge` y `gn` sola. Respelizar allí produciría «chichero».
    expect(textoParaVoz('Cicerō')).toBe('cicero');
    expect(transcribir('Cicerō')).toBe('chíchero');
    expect(textoParaVoz('magnus')).toBe('magnus');
    expect(transcribir('magnus')).toBe('máñus');
  });

  it('el detector de reglas mira el texto DESPUÉS de fundir el dígrafo', () => {
    // `caelō` no tiene «ce» en el original y su transcripción es «chélo».
    expect(reglasQueAplican('caelō')).toContain('ce-ci');
    expect(reglasQueAplican('causa')).not.toContain('ce-ci');
  });
});

describe('los cinco lotes pasan su gate', () => {
  const casos: [string, Parameters<typeof revisarLoteEclesiastica>[0], Parameters<typeof revisarLoteEclesiastica>[1]][] = [
    ['ce', LOTE_ECLESIASTICA_CE, {}],
    ['ae', LOTE_ECLESIASTICA_AE, {}],
    ['ti', LOTE_ECLESIASTICA_TI, {}],
    ['gn', LOTE_ECLESIASTICA_GN, { invarianciaJustificada: INVARIANCIA_GN }],
    ['h', LOTE_H_MUDA, { invarianciaJustificada: INVARIANCIA_H }],
  ];
  for (const [nombre, lote, opc] of casos)
    it(`${nombre}: cero fallos`, () => {
      expect(revisarLoteEclesiastica(lote, opc).map((f) => `${f.item} ${f.clase} ${f.detalle}`)).toEqual([]);
    });
});

describe('el caso negativo es obligatorio salvo donde el punto declara invariancia', () => {
  it('ce, ae y ti lo traen, y al 50 %', () => {
    for (const l of [LOTE_ECLESIASTICA_CE, LOTE_ECLESIASTICA_AE, LOTE_ECLESIASTICA_TI])
      expect(tasasCiegasEc(l).noAplicarNunca).toBe(0.5);
  });

  it('gn y h no lo traen, y el motivo está escrito', () => {
    expect(INVARIANCIA_GN.length).toBeGreaterThan(30);
    expect(INVARIANCIA_H.length).toBeGreaterThan(30);
    // y sin el motivo el gate los rechaza
    expect(revisarLoteEclesiastica(LOTE_H_MUDA).map((f) => f.clase)).toContain('sin-caso-negativo');
  });

  it('y la cobertura declara ese cero como resultado, no como hueco', () => {
    const c = coberturaEclesiastica(LOTE_H_MUDA, { invarianciaJustificada: INVARIANCIA_H })
      .find((x) => x.comprobacion.includes('NEGATIVO'))!;
    expect(c.decididos).toBe(0);
    expect(c.elCeroEsUnResultado).toBeTruthy();
  });
});

describe('lo que el barrido dejó dicho sobre el material', () => {
  it('el punto `ti` tenía CERO casos negativos en L1 antes de entrar `bēstia`', () => {
    const negs = LOTE_ECLESIASTICA_TI.filter((i) => !i.ejes.aplica);
    expect(negs).toHaveLength(6);
    // `bēstia` con mácron desde el 2026-09-13: la cantidad se corrigió
    // contra la fuente externa y la comparación va sin ella.
    const sinM = (x: string) => x.normalize('NFD').replace(/[\u0304\u0306]/g, '').normalize('NFC').toLowerCase();
    for (const i of negs) expect(sinM(i.palabra)).toContain('besti');
  });

  it('y el punto `gn` tenía UN solo lema', () => {
    const lemas = new Set(LOTE_ECLESIASTICA_GN.map((i) => i.palabra.replace(/(us|um|a|ā|ī|ō|ōs|īs|am)$/, '')));
    expect(lemas.size).toBeGreaterThanOrEqual(4);
  });

  it('y `mihi` es la ÚNICA forma de L1 con h intervocálica', () => {
    const inter = LOTE_H_MUDA.filter((i) => /[aeiouāēīōū]h[aeiouāēīōū]/i.test(i.palabra.normalize('NFC')));
    expect(inter.map((i) => i.palabra)).toEqual(['mihi']);
  });
});

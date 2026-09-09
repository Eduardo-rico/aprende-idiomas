// tests/unit/lotes-declinacion-la.test.ts
//
// La 4.ª y la 5.ª, con el gate compartido. El control que importa es el que
// separa dos preguntas que una sola función confundía: el sincretismo de
// siempre y lo que sólo la cantidad separaba.
import { describe, it, expect } from 'vitest';
import { LOTE_CUARTA } from '@/lib/data/languages/la/lotes/l2-cuarta';
import { LOTE_QUINTA } from '@/lib/data/languages/la/lotes/l2-quinta';
import {
  revisarItemDeclinacion, revisarLoteDeclinacion,
  celdasSincreticas, celdasQueSoloElMacronSepara, type ItemDeclinacion,
} from '@/scripts/lib/gate-declinacion';
import { NOMBRES_L1 } from '@/lib/data/languages/la/lexicon-l1';
import { declinar } from '@/lib/data/languages/la/paradigma-la';

const OPC4 = { celdasExigidas: ['nom.sg', 'gen.sg', 'ac.sg'], lemasMinimos: 5 };
const OPC5 = { celdasExigidas: ['gen.sg', 'nom.sg', 'ac.pl'], lemasMinimos: 4 };
const N = (l: string) => NOMBRES_L1.find((x) => x.lema === l)!;
const copia = (lote: ItemDeclinacion[]) => lote.map((it) => ({ ...it, ejes: { ...it.ejes } }));

describe('4.ª y 5.ª · en verde', () => {
  it('los dos lotes pasan su gate', () => {
    expect(revisarLoteDeclinacion(LOTE_CUARTA, OPC4).fallos).toHaveLength(0);
    expect(revisarLoteDeclinacion(LOTE_QUINTA, OPC5).fallos).toHaveLength(0);
  });

  it('ninguna respuesta está escrita a mano', () => {
    for (const it of [...LOTE_CUARTA, ...LOTE_QUINTA])
      expect(it.respuesta, it.id).toBe(declinar(it.entrada, it.caso, it.numero));
  });

  it('ningún marco lleva macrón', () => {
    for (const it of [...LOTE_CUARTA, ...LOTE_QUINTA])
      expect(it.marco, it.id).not.toMatch(/[āēīōūĀĒĪŌŪ]/);
  });

  it('la 5.ª produce los DOS genitivos, que es su varia', () => {
    const gen = Object.fromEntries(
      LOTE_QUINTA.filter((it) => it.caso === 'gen' && it.numero === 'sg')
        .map((it) => [it.entrada.lema, it.respuesta]));
    expect(gen['rēs']).toBe('reī');        // tema en consonante, `e` breve
    expect(gen['fidēs']).toBe('fideī');    // idem
    expect(gen['diēs']).toBe('diēī');      // tema en vocal, `e` larga
    expect(gen['speciēs']).toBe('speciēī');
  });
});

describe('las dos preguntas que una función confundía', () => {
  it('«rēs» es sincretismo puro: nom.sg y ac.pl con macrón y sin él', () => {
    expect(celdasSincreticas(N('rēs'), 'nom', 'sg')).toContain('ac.pl');
    expect(celdasQueSoloElMacronSepara(N('rēs'), 'nom', 'sg')).toHaveLength(0);
  });

  it('«manus» es lo contrario: la cantidad las separaba y la escritura las pierde', () => {
    expect(celdasSincreticas(N('manus'), 'nom', 'sg')).toEqual(['voc.sg']);
    const pierde = celdasQueSoloElMacronSepara(N('manus'), 'nom', 'sg');
    expect(pierde).toContain('gen.sg');
    expect(pierde).toContain('nom.pl');
    expect(pierde).toContain('ac.pl');
  });

  it('y por eso la 4.ª pierde seis ítems y la 5.ª ninguno', () => {
    const cuenta = (lote: ItemDeclinacion[]) =>
      lote.filter((it) => celdasQueSoloElMacronSepara(it.entrada, it.caso, it.numero).length > 0).length;
    expect(cuenta(LOTE_CUARTA)).toBe(6);
    expect(cuenta(LOTE_QUINTA)).toBe(0);
  });

  it('un cero declarado NO es un gate que calla, y sin declarar SÍ', () => {
    // El renglón de la 5.ª da 0 de 12 y ese cero es el hallazgo. Se admite
    // porque lleva `elCeroEsUnResultado` escrito; sin él sería `cobertura-cero`.
    const r = revisarLoteDeclinacion(LOTE_QUINTA, OPC5);
    expect(r.fallos.some((f) => f.clase === 'cobertura-cero')).toBe(false);
    const fila = r.cobertura.find((c) => c.comprobacion.includes('SÓLO el macrón'))!;
    expect(fila.decididos).toBe(0);
    expect(fila.elCeroEsUnResultado).toBeTruthy();
  });
});

describe('4.ª y 5.ª · ROJO', () => {
  it('una declinación mal declarada la caza el genitivo', () => {
    const it = copia(LOTE_CUARTA)[0]!;
    it.ejes.declinacion = '2ª';
    expect(revisarItemDeclinacion(it).some((f) => f.clase === 'declinacion-mal-declarada')).toBe(true);
  });

  it('callarse un colapso de cantidad es un hallazgo', () => {
    const it = copia(LOTE_CUARTA).find((x) => x.ejes.colapsaAlLeer)!;
    delete it.ejes.colapsaAlLeer;
    expect(revisarItemDeclinacion(it).some((f) => f.clase === 'colapso-no-declarado')).toBe(true);
  });

  it('y declararlo donde no lo hay, también', () => {
    const it = copia(LOTE_QUINTA)[0]!;
    it.ejes.colapsaAlLeer = 'me lo invento';
    expect(revisarItemDeclinacion(it).some((f) => f.clase === 'colapso-declarado-de-mas')).toBe(true);
  });

  it('un lote de un solo lema mide un paradigma, no una declinación', () => {
    const uno = copia(LOTE_CUARTA).filter((it) => it.entrada.lema === 'manus');
    expect(revisarLoteDeclinacion(uno, OPC4).fallos.some((f) => f.clase === 'lema-repetido')).toBe(true);
  });

  it('un macrón en el marco', () => {
    const it = copia(LOTE_QUINTA)[0]!;
    it.marco = 'Cūra ___ magna est.';
    expect(revisarItemDeclinacion(it).some((f) => f.clase === 'macron-en-el-marco')).toBe(true);
  });
});

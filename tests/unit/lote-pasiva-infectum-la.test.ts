// tests/unit/lote-pasiva-infectum-la.test.ts — primer lote de L2, y su gate en rojo.
import { describe, it, expect } from 'vitest';
import { LOTE_PASIVA_INFECTUM } from '@/lib/data/languages/la/lotes/l6-pasiva-infectum';
import {
  activaMasR, coberturaPasiva, revisarItemPasiva, revisarLotePasiva,
  tasasCiegasPas, type ItemPasiva,
} from '@/scripts/lib/gate-pasiva-infectum';
import { VERBOS_L1 } from '@/lib/data/languages/la/lexicon-l1';
import { pasivaInfectum } from '@/lib/data/languages/la/paradigma-la';

const V = (l: string) => VERBOS_L1.find((x) => x.lema === l)!;
const base = LOTE_PASIVA_INFECTUM.find((i) => i.respuesta === 'dīcitur')!;
const con = (p: Partial<ItemPasiva>): ItemPasiva => ({ ...base, ...p, ejes: { ...base.ejes, ...(p.ejes ?? {}) } });
const clases = (i: ItemPasiva) => revisarItemPasiva(i).map((f) => f.clase);

describe('el lote pasa su gate', () => {
  it('cero fallos', () => {
    expect(revisarLotePasiva(LOTE_PASIVA_INFECTUM).map((f) => `${f.item} ${f.clase} ${f.detalle}`)).toEqual([]);
  });
  it('y toca las seis personas, que es medio varia', () => {
    expect(new Set(LOTE_PASIVA_INFECTUM.map((i) => i.persona)).size).toBe(6);
    expect(coberturaPasiva(LOTE_PASIVA_INFECTUM).find((c) => c.comprobacion.includes('seis personas'))!.decididos).toBe(6);
  });
});

describe('LA ESTRATEGIA CIEGA FALLA EN LAS SEIS, y me lo dijo el instrumento', () => {
  it('«la activa más una -r» acierta el 0 %, también en la 1.ª del singular', () => {
    expect(tasasCiegasPas(LOTE_PASIVA_INFECTUM).activaMasR).toBe(0);
  });

  it('y en la 1.ª singular sólo la separa la CANTIDAD', () => {
    // Yo escribí que ahí la estrategia acierta. `amō` + `r` es `amōr` y la
    // pasiva es `amor`, con `o` breve. En un curso sin mácrones ese error
    // sería invisible; aquí no.
    expect(activaMasR(V('amō'), '1sg', 'presente')).toBe('amōr');
    expect(pasivaInfectum(V('amō'))['presente.1sg']).toBe('amor');
  });

  it('y responder la activa acierta cero, que es el listón', () => {
    expect(tasasCiegasPas(LOTE_PASIVA_INFECTUM).laActiva).toBe(0);
  });
});

describe('los venenos que el gate tiene que cazar', () => {
  it('la respuesta que no es la de la máquina', () => {
    expect(clases(con({ respuesta: 'dīcetur' }))).toContain('respuesta-no-derivable');
  });
  it('la conjugación mal declarada', () => {
    expect(clases(con({ ejes: { conjugacion: 1 } }))).toContain('eje-mal-declarado');
  });
  it('una forma que no aparece en el corpus', () => {
    expect(clases(con({ verbo: V('salūtō'), persona: '2pl', respuesta: 'salūtāminī', ejes: { conjugacion: 1 } })))
      .toContain('sin-atestiguar');
  });
  it('el marco con vocabulario de fuera de L1', () => {
    expect(clases(con({ marco: 'Nūntius ___.' }))).toContain('marco-fuera-de-l1');
  });
});

describe('los venenos de LOTE', () => {
  it('un lote de tres personas no cubre el varia', () => {
    const lote = LOTE_PASIVA_INFECTUM.filter((i) => i.persona.endsWith('sg'));
    expect(revisarLotePasiva(lote).map((f) => f.detalle).join(' ')).toContain('de seis');
  });
  it('y uno de una sola conjugación tampoco', () => {
    const lote = LOTE_PASIVA_INFECTUM.filter((i) => i.ejes.conjugacion === 2);
    expect(revisarLotePasiva(lote).map((f) => f.detalle).join(' ')).toContain('conjugación(es)');
  });
});

describe('`sum` no tiene pasiva y no está', () => {
  it('ningún ítem es de `sum`, aunque la máquina produzca formas', () => {
    // `pasivaInfectum(sum)` devuelve algo y `eris` sale ×19 en el corpus,
    // pero ésa es la ACTIVA de `sum`. Contarla habría metido un ítem falso
    // con una cifra alta detrás.
    expect(LOTE_PASIVA_INFECTUM.some((i) => i.verbo.lema === 'sum')).toBe(false);
  });
});

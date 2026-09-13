// tests/unit/lote-larga-por-posicion-la.test.ts — y el gate, en rojo.
import { describe, it, expect } from 'vitest';
import { LOTE_LARGA_POR_POSICION } from '@/lib/data/languages/la/lotes/l1-larga-por-posicion';
import {
  coberturaLarga, grupoDeLaPenultima, revisarItemLarga, revisarLoteLarga,
  tasasCiegasLg, type ItemLarga,
} from '@/scripts/lib/gate-larga-por-posicion';
import { decideLaMutaCumLiquida } from '@/scripts/lib/gate-inventario-vs-lexico';

const base = LOTE_LARGA_POR_POSICION.find((i) => i.palabra === 'magister')!;
const con = (p: Partial<ItemLarga>): ItemLarga => ({ ...base, ...p, ejes: { ...base.ejes, ...(p.ejes ?? {}) } });
const clases = (i: ItemLarga) => revisarItemLarga(i).map((f) => f.clase);

describe('el lote pasa su gate', () => {
  it('cero fallos', () => {
    expect(revisarLoteLarga(LOTE_LARGA_POR_POSICION).map((f) => `${f.item} ${f.clase} ${f.detalle}`)).toEqual([]);
  });
});

describe('la regla del manual se refuta en la mitad del lote', () => {
  it('seis alargan y seis no', () => {
    const t = tasasCiegasLg(LOTE_LARGA_POR_POSICION);
    expect(t.reglaDelManual).toBe(0.5);
    expect(t.nuncaAlarga).toBe(0.5);
  });

  it('y los que no alargan son los tres lemas que L1 tiene', () => {
    const mcl = LOTE_LARGA_POR_POSICION.filter((i) => !i.ejes.alarga);
    expect(mcl).toHaveLength(6);
    for (const i of mcl) expect(decideLaMutaCumLiquida(i.palabra), i.palabra).toBe(true);
    expect(coberturaLarga(LOTE_LARGA_POR_POSICION).find((c) => c.comprobacion.includes('lemas'))!.decididos).toBe(3);
  });

  it('los grupos van variados: repetir «nt» seis veces sería un ítem seis veces', () => {
    expect(new Set(LOTE_LARGA_POR_POSICION.map((i) => i.ejes.grupo)).size).toBeGreaterThanOrEqual(6);
  });
});

describe('los venenos que el gate tiene que cazar', () => {
  it('la tónica que no es la de la máquina', () => {
    expect(clases(con({ respuesta: 'ma' }))).toContain('tonica-no-derivable');
  });

  it('el grupo mal declarado', () => {
    expect(clases(con({ ejes: { grupo: 'nt', alarga: true } }))).toContain('eje-mal-declarado');
  });

  it('decir que un grupo de muta cum liquida alarga', () => {
    expect(clases(con({ palabra: 'tenebrae', respuesta: 'te', ejes: { grupo: 'br', alarga: true } })))
      .toContain('eje-mal-declarado');
  });

  it('EL ÍTEM QUE PARECE DEL PUNTO Y NO LO ES: la penúltima ya larga por naturaleza', () => {
    // Con mácrón o diptongo en la penúltima la palabra es llana pase lo que
    // pase con las consonantes, así que el grupo no decide nada.
    expect(clases(con({ palabra: 'dīxērunt', respuesta: 'xē', ejes: { grupo: 'r', alarga: true } })))
      .toContain('penultima-larga-por-naturaleza');
  });

  it('una palabra que no aparece en el corpus', () => {
    expect(clases(con({ palabra: 'magistrīs', respuesta: 'gis', ejes: { grupo: 'str', alarga: true } })))
      .not.toContain('sin-atestiguar');   // ésta sí aparece: control de que el check no marca todo
  });
});

describe('los venenos de LOTE', () => {
  it('un lote todo de grupos que alargan deja la regla del manual al 100 %', () => {
    const lote = LOTE_LARGA_POR_POSICION.filter((i) => i.ejes.alarga);
    expect(tasasCiegasLg(lote).reglaDelManual).toBe(1);
    expect(revisarLoteLarga(lote).map((f) => f.clase)).toContain('suelo-de-la-lengua');
  });

  it('y uno con muta cum liquida de un solo lema mide un lema, no la regla', () => {
    const lote = LOTE_LARGA_POR_POSICION.filter((i) => i.palabra.startsWith('tenebr') || i.ejes.alarga);
    expect(revisarLoteLarga(lote).map((f) => f.detalle).join(' ')).toContain('lema(s)');
  });
});

describe('el grupo se lee de la máquina', () => {
  it('coda de la penúltima más arranque de la última', () => {
    expect(grupoDeLaPenultima('magister')).toBe('st');
    expect(grupoDeLaPenultima('tenebrae')).toBe('br');
    expect(grupoDeLaPenultima('dīcentēs')).toBe('nt');
  });
});

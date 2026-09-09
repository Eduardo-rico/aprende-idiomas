// tests/unit/lote-demostrativos-la.test.ts
//
// Los demostrativos. El control que importa es el del falso regalo: un lote
// de pura deixis clásica sale IMPECABLE y no mide nada, porque «este/ese/
// aquel» transfiere del español sin resto. Ese es el primero de la lista.
import { describe, it, expect } from 'vitest';
import { LOTE_DEMOSTRATIVOS } from '@/lib/data/languages/la/lotes/l4-demostrativos';
import {
  revisarItemPronombre, revisarLotePronombre, ejesQueDistingue, type ItemPronombre,
} from '@/scripts/lib/gate-pronombre-paradigma';
import { PRONOMBRES_L1, declinarPronombre } from '@/lib/data/languages/la/pronombres-la';

const OPC = { sincretismosExigidos: ['huius', 'illīs'], exigeInstintoQueFalle: true };
const copia = (): ItemPronombre[] => LOTE_DEMOSTRATIVOS.map((it) => ({ ...it, ejes: { ...it.ejes } }));

describe('demostrativos · en verde', () => {
  it('el lote real pasa su gate entero', () => {
    const r = revisarLotePronombre(LOTE_DEMOSTRATIVOS, OPC);
    expect(r.fallos, JSON.stringify(r.fallos, null, 2)).toHaveLength(0);
  });

  it('ninguna respuesta está escrita a mano', () => {
    for (const it of LOTE_DEMOSTRATIVOS) {
      const e = PRONOMBRES_L1.find((x) => x.lema === it.lema)!;
      expect(it.respuesta, it.id).toBe(declinarPronombre(e, it.genero, it.caso, it.numero));
    }
  });

  it('trae las tres series', () => {
    expect(new Set(LOTE_DEMOSTRATIVOS.map((it) => it.lema))).toContain('hic');
    expect(new Set(LOTE_DEMOSTRATIVOS.map((it) => it.lema))).toContain('iste');
    expect(new Set(LOTE_DEMOSTRATIVOS.map((it) => it.lema))).toContain('ille');
  });
});

describe('demostrativos · ROJO', () => {
  it('EL CONTROL DEL FALSO REGALO: sin los ítems de la Vulgata, el lote no mide', () => {
    // Los nueve de deixis clásica son latín correcto, están bien escritos y
    // pasan todas las demás comprobaciones. Y enseñan lo que el alumno ya
    // sabe, porque el español tiene los tres grados.
    const soloDeixis = copia().filter((it) => !it.ejes.elInstintoFalla);
    expect(soloDeixis.length).toBeGreaterThan(5);
    const r = revisarLotePronombre(soloDeixis, OPC);
    expect(r.fallos.some((f) => f.clase === 'sin-instinto-que-falle')).toBe(true);
  });

  it('acreditarse el grado con una glosa que dice «aquel» es cobrarlo gratis', () => {
    const it = copia().find((x) => !x.ejes.elInstintoFalla)!;
    it.ejes.examina = [...it.ejes.examina, 'grado'];
    expect(revisarItemPronombre(it).some((f) => f.clase === 'grado-mal-acreditado')).toBe(true);
  });

  it('y declarar que el instinto falla sin acreditar el grado es lo contrario', () => {
    const it = copia().find((x) => x.ejes.elInstintoFalla)!;
    it.ejes.examina = it.ejes.examina.filter((x) => x !== 'grado');
    expect(revisarItemPronombre(it).some((f) => f.clase === 'grado-mal-acreditado')).toBe(true);
  });

  it('un macrón en el marco se caza también aquí', () => {
    const it = copia()[0]!;
    it.marco = `${it.marco} Rosā.`;
    expect(revisarItemPronombre(it).some((f) => f.clase === 'macron-en-el-marco')).toBe(true);
  });

  it('«illīs» no distingue ni género ni caso, y acreditárselos falla', () => {
    const ille = PRONOMBRES_L1.find((x) => x.lema === 'ille')!;
    expect(ejesQueDistingue(ille, 'f', 'dat', 'pl')).toEqual(['numero']);
    const it = copia().find((x) => x.respuesta === 'illīs')!;
    it.ejes.examina = ['genero', 'numero', 'caso'];
    expect(revisarItemPronombre(it).some((f) => f.clase === 'eje-que-la-celda-no-distingue')).toBe(true);
  });
});

describe('por qué el punto no se juega en la tabla', () => {
  it('las tres series tienen EXACTAMENTE el mismo patrón de sincretismo', () => {
    // Si el punto se jugara en el paradigma, elegir serie cambiaría algo.
    // No cambia nada: por eso lo que mide es el grado y su falso regalo.
    const patron = (lema: string) => {
      const e = PRONOMBRES_L1.find((x) => x.lema === lema)!;
      const out: string[] = [];
      for (const g of ['m', 'f', 'n'] as const)
        for (const n of ['sg', 'pl'] as const)
          for (const c of ['nom', 'ac', 'gen', 'dat', 'abl'] as const)
            out.push(ejesQueDistingue(e, g, c, n).join('+'));
      return out.join('|');
    };
    expect(patron('iste')).toBe(patron('ille'));
    expect(patron('hic')).toBe(patron('ille'));
  });
});

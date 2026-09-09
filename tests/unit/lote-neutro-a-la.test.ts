// tests/unit/lote-neutro-a-la.test.ts
import { describe, it, expect } from 'vitest';
import { LOTE_NEUTRO_A } from '@/lib/data/languages/la/lotes/l2-neutro-a';
import { revisarItemNeutroA, revisarLoteNeutroA, type ItemNeutroA } from '@/scripts/lib/gate-neutro-a';

const copia = (): ItemNeutroA[] => LOTE_NEUTRO_A.map((it) => ({ ...it, ejes: { ...it.ejes } }));

describe('la -a neutra · en verde', () => {
  it('el lote pasa su gate', () => {
    const r = revisarLoteNeutroA(LOTE_NEUTRO_A);
    expect(r.fallos, JSON.stringify(r.fallos, null, 2)).toHaveLength(0);
  });

  it('todos los neutros van en ACUSATIVO, que es donde no hay red', () => {
    // Como sujeto, el verbo desmentiría la lectura singular: «Bella magna
    // sunt» lleva `sunt`. Como objeto, el verbo va en singular por su propio
    // sujeto y no dice nada del número del objeto.
    // La comparación va SIN cantidad, y eso es la política del macrón
    // chocando con la convención del campo `latin`: el marco se presenta
    // como el texto real —sin macrones— y `latin` guarda la forma
    // lexicográfica, con ellos. `dōnum` está en «Servus donum portat».
    const sinM = (x: string) => x.normalize('NFD').replace(/[\u0304]/g, '').normalize('NFC');
    for (const it of LOTE_NEUTRO_A) {
      expect(sinM(it.marco), it.id).toContain(sinM(it.latin));
      expect(it.marco, it.id).not.toMatch(/\b(sunt|habent|vident|audiunt|portant)\b/);
    }
  });

  it('seis y seis: el eje es binario y un lote uniforme se contesta solo', () => {
    expect(LOTE_NEUTRO_A.filter((it) => it.ejes.numero === 'pl')).toHaveLength(6);
  });

  it('ningún marco lleva macrón', () => {
    for (const it of LOTE_NEUTRO_A) expect(it.marco, it.id).not.toMatch(/[āēīōū]/);
  });
});

describe('la -a neutra · ROJO', () => {
  it('un lote sin contraste de número se contesta con «siempre plural»', () => {
    const soloPl = copia().filter((it) => it.ejes.numero === 'pl');
    expect(revisarLoteNeutroA(soloPl).fallos.some((f) => f.clase === 'sin-contraste-de-numero')).toBe(true);
  });

  it('un lote sin homógrafos no examina el eje del punto', () => {
    const sin = copia().map((it) => ({ ...it, ejes: { numero: it.ejes.numero } }));
    expect(revisarLoteNeutroA(sin).fallos.some((f) => f.clase === 'sin-homografo-en-el-lote')).toBe(true);
  });

  it('el número declarado se contrasta contra la FORMA y contra la RESPUESTA', () => {
    const porForma = copia()[0]!;
    porForma.ejes.numero = porForma.ejes.numero === 'pl' ? 'sg' : 'pl';
    // Cae por los dos caminos a la vez, que es lo que se quiere: uno mira la
    // `-a` del latín y el otro el artículo del español.
    const f = revisarItemNeutroA(porForma).filter((x) => x.clase === 'numero-mal-declarado');
    expect(f.length).toBe(2);
  });

  it('una respuesta en singular para un plural latino', () => {
    const it = copia().find((x) => x.ejes.numero === 'pl')!;
    it.respuesta = 'la guerra';
    expect(revisarItemNeutroA(it).some((f) => f.clase === 'numero-mal-declarado')).toBe(true);
  });

  it('un macrón en el marco', () => {
    const it = copia()[0]!;
    it.marco = it.marco.replace('a', 'ā');
    expect(revisarItemNeutroA(it).some((f) => f.clase === 'macron-en-el-marco')).toBe(true);
  });
});

describe('lo que NO se pudo verificar, dicho', () => {
  it('la lista de homógrafos es corta a propósito y sólo trae los indiscutibles', () => {
    // No hay diccionario de español en la máquina, y el corpus propio del
    // proyecto no vale de segundo camino porque CITA LATÍN: «templa» sale 6
    // veces en él, «verba» 23, «castra» 10, «maria» 35, sin ser palabras
    // españolas. Usarlo habría marcado como homógrafo justo el
    // contraejemplo del punto.
    const homs = new Set(LOTE_NEUTRO_A.filter((it) => it.ejes.homografo)
      .map((it) => it.ejes.homografo!.palabra));
    expect([...homs].sort()).toEqual(['bella', 'dona']);
    for (const it of LOTE_NEUTRO_A)
      if (it.ejes.homografo) expect(it.ejes.homografo.queEsEnEspanol.length, it.id).toBeGreaterThan(40);
  });
});

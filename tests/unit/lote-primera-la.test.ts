// tests/unit/lote-primera-la.test.ts — EL LOTE DE LA PRIMERA DECLINACIÓN.
//
// El hermano que faltaba. Lo encontró el latinista adversarial mirando
// otra cosa: la 1.ª era la única de las cinco sin lote, y es prerrequisito
// declarado de `l3-funcion-por-desinencia`, el punto central del curso,
// que se publicaba igual con veinte ítems llenos de «puella» y «rēgīnās».
//
// Y el punto estaba MAL CLASIFICADO. Era `clase: 'funcion'` con el hueco
// en la glosa «para obligar a decidir la función con el contexto», y ese
// formato no puede medir eso: una glosa española con un hueco fija por
// construcción qué categoría cabe ahí, así que el alumno lee el marco,
// traduce el lema y encaja el determinante sin mirar la desinencia. Techo
// de la estrategia ciega: 100 %.
import { describe, it, expect } from 'vitest';
import { LOTE_PRIMERA, CELDAS_EXIGIDAS } from '@/lib/data/languages/la/lotes/l2-primera';
import { revisarLoteDeclinacion, type ItemDeclinacion } from '@/scripts/lib/gate-declinacion';
import { PUNTOS_LA } from '@/lib/data/languages/la/inventario-puntos';
import { NOMBRES_L1 } from '@/lib/data/languages/la/lexicon-l1';

const OPC = { celdasExigidas: CELDAS_EXIGIDAS, lemasMinimos: 6 };
const XS = () => JSON.parse(JSON.stringify(LOTE_PRIMERA)) as ItemDeclinacion[];

describe('lote de la 1.ª · en verde', () => {
  it('pasa su gate', () => {
    expect(revisarLoteDeclinacion(XS(), OPC).fallos).toEqual([]);
  });

  it('cubre LAS DOCE celdas del paradigma, una por ítem', () => {
    expect(LOTE_PRIMERA).toHaveLength(12);
    const celdas = LOTE_PRIMERA.map((x) => `${x.caso}.${x.numero}`);
    expect(new Set(celdas).size).toBe(12);
    for (const c of CELDAS_EXIGIDAS) expect(celdas, c).toContain(c);
  });

  it('las doce celdas producen SIETE cadenas distintas, que es el punto', () => {
    const finales = new Set(LOTE_PRIMERA.map((x) => x.respuesta.replace(/^.*?(a|am|ae|ā|ās|ārum|īs)$/u, '$1')));
    expect(finales).toEqual(new Set(['a', 'am', 'ae', 'ā', 'ās', 'ārum', 'īs']));
  });

  it('CUATRO celdas comparten «-ae», y el vocativo plural es una de ellas', () => {
    const ae = LOTE_PRIMERA.filter((x) => x.respuesta.endsWith('ae')).map((x) => `${x.caso}.${x.numero}`);
    expect(new Set(ae)).toEqual(new Set(['gen.sg', 'dat.sg', 'nom.pl', 'voc.pl']));
    // La v0 del punto decía «tres funciones» y se dejaba el vocativo, que
    // está atestado (hypocritae ×10, scribae ×6, filiae en Lc 23:28).
    expect(PUNTOS_LA.find((p) => p.id === 'l2-primera')!.descripcion).toMatch(/CUATRO celdas/);
  });

  it('el punto ya NO es de función: es de paradigma y de producción', () => {
    const p = PUNTOS_LA.find((x) => x.id === 'l2-primera')!;
    expect(p.clase).toBe('paradigma');
    expect(p.calco.via).toBe('produccion');
    expect(p.formato).toBe('cloze-derivado');
  });

  // ── LAS MINAS DECLARADAS, comprobadas y no sólo escritas ──
  it('«fīlia» no entra en dativo ni ablativo plural: la máquina daría «fīliīs» y el latín pide «fīliābus»', () => {
    const malos = LOTE_PRIMERA.filter((x) => x.entrada.lema === 'fīlia' && x.numero === 'pl'
      && (x.caso === 'dat' || x.caso === 'abl'));
    expect(malos).toEqual([]);
  });

  it('los masculinos en «-a» entran, y ningún ítem lleva adjetivo', () => {
    const masc = LOTE_PRIMERA.filter((x) => ['nauta', 'agricola', 'poēta'].includes(x.entrada.lema));
    expect(masc.length, 'el extremo del eje «la forma es de 1.ª y el género no» tiene que estar').toBeGreaterThan(0);
    // Con adjetivo el ítem mediría la concordancia por rasgos, que es l4:
    // «nauta bonus» y no *«bona». La mina es SOBRE LOS MASCULINOS, no
    // sobre el marco entero — la primera versión de este test miraba todos
    // los ítems y marcó `la-2p-03` («Cura ___ magna est.»), donde el
    // adjetivo concuerda con «cura» y no con la respuesta. Un gate
    // demasiado ancho marca lo correcto, y entonces nadie lo lee.
    for (const x of masc)
      expect(x.marco, `${x.id} es masculino en -a y lleva adjetivo`).not.toMatch(/\b(magn|bon|pulchr|parv|mult)[aeiou]/i);
  });

  it('los inanimados no hacen de destinatario', () => {
    const malos = LOTE_PRIMERA.filter((x) => x.caso === 'dat'
      && ['rosa', 'terra', 'cūra', 'īra'].includes(x.entrada.lema));
    expect(malos).toEqual([]);
  });
});

describe('el gate del lote, EN ROJO', () => {
  it('ROJO · si falta una celda, el lote deja de cubrir el paradigma', () => {
    const sinVocPl = XS().filter((x) => !(x.caso === 'voc' && x.numero === 'pl'));
    const f = revisarLoteDeclinacion(sinVocPl, OPC).fallos;
    expect(f.some((x) => x.clase === 'celda-sin-cubrir' && /voc\.pl/.test(x.detalle))).toBe(true);
  });

  it('ROJO · doce ítems del mismo lema son uno repetido doce veces', () => {
    const uno = XS().map((x) => ({ ...x, entrada: NOMBRES_L1.find((n) => n.lema === 'puella')! }));
    expect(revisarLoteDeclinacion(uno, OPC).fallos.some((x) => x.clase === 'lema-repetido')).toBe(true);
  });

  it('ROJO · una respuesta escrita a mano que no derive del paradigma no pasa', () => {
    const xs = XS();
    xs[0]!.respuesta = 'puellarum';
    expect(revisarLoteDeclinacion(xs, OPC).fallos.length).toBeGreaterThan(0);
  });
});

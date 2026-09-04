// tests/unit/lote27-ro.test.ts — EL LOTE 27 VISTO EN ROJO.
//
// Un gate visto sólo en verde no está probado: en este proyecto el gate
// anti-anglófono del lote 18 no marcaba NUNCA y el lote imprimía «Limpio»
// igual (§4.18), y el gate del `și` del lote 25 buscaba un diacrítico
// sobre texto ya normalizado, así que era inalcanzable (§4.37). Cada gate
// propio de este lote se corre contra un ítem que DEBE cazar, y cada
// testigo lleva UN SOLO defecto: con dos, no se sabe cuál lo suspendió.
//
// ⚠ Y el §4.37 volvió a morder AQUÍ, en el gate 7 de este mismo fichero:
// escrito contra «detrás» CON tilde, no disparaba sobre texto normalizado
// y marcaba el ítem pospuesto sin poder marcar nunca el antepuesto. Se
// cazó porque el lote se corrió antes de creerle al verde. El testigo de
// abajo lo fija en las dos direcciones.
import { describe, it, expect } from 'vitest';
import {
  ITEMS, DECL, OPCIONES, CONSTRUIDOS, construir, revisar,
  SIEMPRE_POSPUESTO, ESTRUCTURA_ES, LAS_DOS_MARCAS, CONSIGNA_POS, CONSIGNA_ANTE, type Construido,
} from '@/scripts/lotes/trans-ro-l27';
import { verificar, correr } from '@/scripts/lib/transformacion-ro';
import { articulado } from '@/scripts/lib/paradigma-ro';
import { SUSTANTIVOS_A1 } from '@/lib/data/languages/ro/lexicon-a1';

const XS = () => JSON.parse(JSON.stringify(CONSTRUIDOS)) as Construido[];
const rehacer = (f: (xs: Construido[]) => void): Construido[] => { const xs = XS(); f(xs); return xs; };
/** Se busca POR CONTENIDO y nunca por índice: lo publicado va barajado con
 *  semilla, y un testigo que coja `XS()[1]` se apaga en silencio el día que
 *  alguien reordene la declaración. En latín se apagaron dos controles el
 *  mismo día por eso. */
const por = (xs: Construido[], sujeto: string) => xs.find((x) => x.d.sujeto === sujeto)!;

describe('lote 27 · r4-cel-proforma · en verde', () => {
  it('el lote real pasa sus propios gates y los de la máquina', () => {
    expect(verificar(ITEMS, OPCIONES)).toEqual([]);
  });

  it('son DOS ítems, y ése es el piso declarado del punto', () => {
    expect(ITEMS).toHaveLength(2);
  });

  it('las dos claves las deriva el paradigma, no están escritas a mano', () => {
    const prieten = SUSTANTIVOS_A1.find((x) => x.lema === 'prieten')!;
    expect(articulado(prieten, 'sg')).toBe('prietenul');
    expect(por(XS(), 'Ion').r).toBe('Ion este prietenul cel mai bun.');
    expect(por(XS(), 'Radu').r).toBe('Radu este cel mai bun prieten.');
  });
});

// LAS DOS SOBREGENERALIZACIONES OPUESTAS. Que cada una acierte EXACTAMENTE
// la mitad no es holgura: con respuesta binaria la mitad ES el azar, y es
// lo que fija el tamaño del lote.
describe('lote 27 · las estrategias, ejecutadas', () => {
  it('«siempre pospuesto» acierta 1 de 2 — el suelo de una binaria', () => {
    expect(correr(SIEMPRE_POSPUESTO, ITEMS).aciertos).toBe(1);
  });
  it('«la estructura del español» acierta 1 de 2, y es la mitad que `espejoEs` no expresa', () => {
    expect(correr(ESTRUCTURA_ES, ITEMS).aciertos).toBe(1);
  });
  it('«poner las DOS marcas» acierta CERO — si acertara, el lote premiaría el error que enseña a evitar', () => {
    expect(correr(LAS_DOS_MARCAS, ITEMS).aciertos).toBe(0);
  });
  it('y la que acierta las dos NO existe: ninguna estrategia ciega pasa del tope', () => {
    for (const e of [SIEMPRE_POSPUESTO, ESTRUCTURA_ES, LAS_DOS_MARCAS])
      expect(correr(e, ITEMS).aciertos).toBeLessThanOrEqual(1);
  });
});

describe('lote 27 · los gates propios, vistos en ROJO', () => {
  it('ROJO · una clave escrita a mano que el paradigma no deriva', () => {
    const xs = rehacer((x) => { por(x, 'Ion').r = 'Ion este prieten cel mai bun.'; });
    expect(revisar(xs).some((s) => s.includes('no es la que deriva el paradigma'))).toBe(true);
  });

  // EL GATE QUE SOSTIENE EL LOTE ENTERO. A n = 2, cualquier diferencia
  // entre las dos fuentes separa las clases al 100 % por construcción.
  it('ROJO · dos sustantivos distintos rompen el par mínimo', () => {
    const xs = rehacer((x) => { const r = por(x, 'Radu'); r.l = SUSTANTIVOS_A1.find((y) => y.lema === 'vecin')!; });
    expect(revisar(xs).some((s) => s.includes('PAR MÍNIMO') && s.includes('sustantivos'))).toBe(true);
  });
  it('ROJO · dos adjetivos distintos rompen el par mínimo', () => {
    const xs = rehacer((x) => { por(x, 'Radu').a = { lema: 'alb', fSg: 'albă', mPl: 'albi', fPl: 'albe', gloss: 'blanco' }; });
    expect(revisar(xs).some((s) => s.includes('PAR MÍNIMO') && s.includes('adjetivos'))).toBe(true);
  });

  it('ROJO · un ítem que no sea masculino devuelve la variable de r8 al lote', () => {
    const xs = rehacer((x) => { por(x, 'Radu').g = 'f'; });
    expect(revisar(xs).some((s) => s.includes('r8-comparativo'))).toBe(true);
  });

  it('ROJO · los dos en la misma posición: el reparto deja de ser la mitad', () => {
    const xs = rehacer((x) => { por(x, 'Radu').d.posicion = 'pos'; });
    expect(revisar(xs).some((s) => s.includes('REPARTO'))).toBe(true);
  });

  it('ROJO · el POSPUESTO sin el nombre articulado pierde la marca doble', () => {
    const xs = rehacer((x) => { const i = por(x, 'Ion'); i.r = 'Ion este prieten cel mai bun.'; });
    expect(revisar(xs).some((s) => s.includes('las DOS marcas'))).toBe(true);
  });

  // EL BLINDAJE DE LA CARA QUE EL ALUMNO SOBREAPLICA: si alguien escribiera
  // aquí la forma articulada, el lote enseñaría justo el error que existe
  // para castigar, y ningún otro gate lo vería.
  it('ROJO · el ANTEPUESTO con el nombre articulado (*cel mai bun prietenul)', () => {
    const xs = rehacer((x) => { por(x, 'Radu').r = 'Radu este cel mai bun prietenul.'; });
    expect(revisar(xs).some((s) => s.includes('NO puede llevar el nombre articulado'))).toBe(true);
  });

  // ── LA CONSIGNA COMO GATE ──────────────────────────────────────────
  it('ROJO · sin la cláusula de POSICIÓN el ítem queda indeterminado', () => {
    const xs = rehacer((x) => { por(x, 'Ion').instruccion = 'Di la misma frase con el adjetivo en superlativo relativo —no «muy bueno», sino «el mejor»— y ya está.'; });
    expect(revisar(xs).some((s) => s.includes('no está determinada'))).toBe(true);
  });
  it('ROJO · una consigna que nombra la posición del OTRO ítem', () => {
    const xs = rehacer((x) => { por(x, 'Ion').instruccion = CONSIGNA_ANTE; });
    expect(revisar(xs).some((s) => s.includes('la posición del OTRO'))).toBe(true);
  });
  // §4.37 EN LAS DOS DIRECCIONES: el gate se escribió contra «detrás» con
  // tilde y no disparaba sobre texto normalizado. Que el ítem POSPUESTO —el
  // de la palabra con tilde— se pueda ver en rojo es la prueba de que el
  // patrón está en el alfabeto de la normalización.
  it('ROJO · y el pospuesto TAMBIÉN se caza: el patrón está normalizado (§4.37)', () => {
    const xs = rehacer((x) => { por(x, 'Ion').instruccion = CONSIGNA_POS.replace('DETRÁS', 'en algún sitio'); });
    expect(revisar(xs).some((s) => s.includes('no está determinada'))).toBe(true);
  });
  it('VERDE · la consigna real del pospuesto NO se marca — el gate no es ruido', () => {
    expect(revisar(XS()).filter((s) => s.includes('no está determinada'))).toEqual([]);
  });

  it('ROJO · una consigna que no excluye el superlativo ABSOLUTO', () => {
    // Sin esa cláusula, `foarte bun` es una respuesta CORRECTA que la clave
    // suspende: es el fallo de los lotes 25 y 26 en su tercera piel.
    const xs = rehacer((x) => { por(x, 'Ion').instruccion = CONSIGNA_POS.replace('—no «muy bueno», sino «el mejor»— ', ''); });
    expect(revisar(xs).some((s) => s.includes('superlativo ABSOLUTO'))).toBe(true);
  });

  it('ROJO · sin la alternativa con «e» se suspende a un alumno impecable', () => {
    const xs = rehacer((x) => { por(x, 'Ion').alt = []; });
    expect(revisar(xs).some((s) => s.includes('alumno impecable'))).toBe(true);
  });
});

// LA VARIACIÓN LIBRE, CONTADA POR EJES Y MULTIPLICADA (§4.28): un eje
// (`este`/`e`), dos valores, una alternativa. Si algún día aparece un
// segundo eje, la esquina que combina los dos es la que se olvida.
describe('lote 27 · las salidas correctas declaradas', () => {
  it('cada ítem declara la elisión de `este`', () => {
    expect(por(XS(), 'Ion').alt).toEqual(['Ion e prietenul cel mai bun.']);
    expect(por(XS(), 'Radu').alt).toEqual(['Radu e cel mai bun prieten.']);
  });
  it('y la clave del OTRO ítem NO está declarada: la cierra la consigna', () => {
    // Es rumano perfecto y aun así no puede ser alternativa, o el ítem
    // dejaría de medir la posición, que es la única variable del lote.
    for (const x of XS()) for (const a of x.alt ?? []) expect(a).not.toContain('cel mai bun prietenul');
    expect(por(XS(), 'Ion').alt).not.toContain('Ion este cel mai bun prieten.');
  });
});

describe('lote 27 · la declaración y los ítems no se desincronizan', () => {
  it('cada Decl produce el ítem que el lote publica', () => {
    expect(DECL.map(construir).map((x) => x.r)).toEqual(ITEMS.map((x) => x.r));
  });
});

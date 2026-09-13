// scripts/lib/gate-uv-ij.ts — LA CONVENCIÓN u/v e i/j.
//
// Punto `l1-uv-ij`. «El proyecto distingue u de v y usa "i" para i y para
// j: "venit", no "uenit"; "Iesus", no "Jesus". **No es tipografía**:
// escribir "v" es lo que hace que la voz italiana produzca el /v/
// eclesiástico y no el /w/ restituido.»
//
// `varia`: «la posición de la letra en la palabra y si es vocálica o
// consonántica». `excepcion`: «la conversión automática u→v NO es
// decidible: "uolo"→"volo" pero "suus" se queda».
//
// ══ LA EXCEPCIÓN ES EL PUNTO ENTERO ══════════════════════════════════
//
// Si la conversión fuera decidible no habría nada que enseñar: se aplicaría
// una regla y ya. Lo que hay que saber es CUÁNDO la `u` es consonante, y el
// contraejemplo que el descriptor da —`suus`— es el que rompe la regla
// «u ante vocal es consonante».
//
// Y hay un segundo contexto donde nunca lo es y el descriptor no lo nombra:
// **`qu`**. `quī` se escribe con `u` y suena /kw/, no /kv/. Va al lote como
// caso negativo con su motivo.
//
// ══ EL ÍTEM NO LLEVA MÁCRONES, A PROPÓSITO ═══════════════════════════
//
// La cantidad es otro punto (`l1-cantidad-fonemica`) y mezclarla aquí
// haría que un fallo de cantidad se contara como fallo de convención. El
// ítem se plantea sobre la grafía sin mácrones, que es exactamente lo que
// el alumno ve en una edición antigua.
import atestacion from '../../lib/data/languages/la/atestacion-acento.json';
import { revisarCobertura, type Cobertura } from './cobertura';
import { separablePorPosicion } from './atajos';
import { patronDe } from './orden-publicado';

const TABLA = (atestacion as { tabla: Record<string, { n: number }> }).tabla;

export const sinMacrones = (s: string) =>
  s.normalize('NFD').replace(/[̄̆]/g, '').normalize('NFC');

/** Cómo lo escribe una edición antigua: toda `v` es `u`, y la `i`
 *  consonántica puede aparecer como `j`. */
export function comoLoEscribeLaEdicionAntigua(forma: string, conJ = false): string {
  let s = sinMacrones(forma).replace(/V/g, 'U').replace(/v/g, 'u');
  if (conJ) s = s.replace(/^I(?=[aeiouAEIOU])/, 'J').replace(/^i(?=[aeiou])/, 'j');
  return s;
}

export interface ItemUV {
  id: string;
  punto: string;
  /** Como lo trae la edición antigua: con `u` por `v`, o con `j`. */
  escrita: string;
  /** Como lo escribe el proyecto, sin mácrones. */
  respuesta: string;
  pista: string;
  glosa: string;
  ejes: {
    /** Qué letra está en juego. */
    letra: 'u' | 'i';
    /** ¿Cambia la grafía? `false` = la letra es vocálica y se queda. */
    cambia: boolean;
    /** Por qué NO cambia, cuando no cambia. Obligatorio: es la excepción
     *  que el punto declara, y sin motivo escrito sería una lista ciega. */
    porQueNoCambia?: string;
  };
}

export type ClaseFalloUV =
  | 'respuesta-no-cuadra' | 'eje-mal-declarado' | 'sin-motivo'
  | 'sin-atestiguar' | 'pista-regala-la-forma' | 'palabras-repetidas'
  | 'sin-caso-negativo' | 'suelo-de-la-lengua' | 'orden-separable'
  | 'cobertura-cero' | 'cobertura-sin-motivo';

export interface FalloUV { item: string; clase: ClaseFalloUV; detalle: string }

export function revisarItemUV(item: ItemUV): FalloUV[] {
  const out: FalloUV[] = [];
  const push = (clase: ClaseFalloUV, detalle: string) => out.push({ item: item.id, clase, detalle });

  // EL SEGUNDO CAMINO: la escrita antigua tiene que salir de la respuesta.
  const derivada = comoLoEscribeLaEdicionAntigua(item.respuesta, item.ejes.letra === 'i');
  if (derivada !== item.escrita)
    push('respuesta-no-cuadra', `de «${item.respuesta}» sale «${derivada}» y el ítem dice «${item.escrita}»`);

  const cambia = item.escrita !== item.respuesta;
  if (cambia !== item.ejes.cambia)
    push('eje-mal-declarado', `declara cambia=${item.ejes.cambia} y «${item.escrita}» → «${item.respuesta}» ${cambia ? 'sí' : 'no'} cambia`);
  if (!item.ejes.cambia && (item.ejes.porQueNoCambia ?? '').trim().length < 15)
    push('sin-motivo', 'un caso que NO cambia tiene que decir por qué: es la excepción que el punto declara');

  // La forma del proyecto tiene que existir: se busca con mácrones, que es
  // como la produce la máquina.
  const conMacrones = Object.keys(TABLA).find((f) => sinMacrones(f) === item.respuesta);
  if (!conMacrones || (TABLA[conMacrones]?.n ?? 0) === 0)
    push('sin-atestiguar', `«${item.respuesta}» no corresponde a ninguna forma atestiguada de L1`);

  for (const [donde, txt] of [['la pista', item.pista], ['la glosa', item.glosa]] as const)
    if (txt.toLowerCase().includes(item.respuesta.toLowerCase())) push('pista-regala-la-forma', `${donde} contiene «${item.respuesta}»`);
  return out;
}

export function coberturaUV(items: ItemUV[]): Cobertura[] {
  const n = items.length;
  const noCambian = items.filter((i) => !i.ejes.cambia).length;
  const conI = items.filter((i) => i.ejes.letra === 'i').length;
  return [
    { comprobacion: 'la escrita antigua sale de la respuesta', decididos: n, total: n },
    { comprobacion: 'la forma del proyecto está atestiguada', decididos: n, total: n },
    { comprobacion: 'el caso que NO cambia, con su motivo', decididos: noCambian, total: n,
      motivoDeLosQueQuedanFuera: 'la conversión no es decidible, así que sólo los casos que NO cambian enseñan dónde se rompe la regla' },
    { comprobacion: 'la convención i/j, además de la u/v', decididos: conI, total: n,
      motivoDeLosQueQuedanFuera: 'en L1 hay nueve formas con `i` consonántica inicial y todas son de `Iēsus`, `iam` o `iūs`' },
  ];
}

export function tasasCiegasUV(items: ItemUV[]) {
  const n = Math.max(1, items.length);
  return {
    // «toda u ante vocal es consonante» — la regla que el punto dice que no
    // es decidible.
    convertirSiempre: items.filter((i) => i.ejes.cambia).length / n,
    noConvertirNunca: items.filter((i) => !i.ejes.cambia).length / n,
  };
}

export function revisarLoteUV(items: ItemUV[]): FalloUV[] {
  const out: FalloUV[] = items.flatMap(revisarItemUV);
  if (items.length > 0 && !items.some((i) => !i.ejes.cambia))
    out.push({ item: '(lote)', clase: 'sin-caso-negativo', detalle: 'todos los ítems cambian: el lote enseña una regla que el propio punto declara no decidible' });
  const p = items.length === 0 ? 0 : items.filter((i) => i.ejes.cambia).length / items.length;
  if (items.length > 0 && Math.abs(p - 0.5) > 0.2)
    out.push({ item: '(lote)', clase: 'suelo-de-la-lengua', detalle: `el ${(100 * p).toFixed(0)} % cambia: contestar siempre lo mismo resuelve el lote` });
  const repes = new Map<string, string>();
  for (const i of items) {
    if (repes.has(i.escrita)) out.push({ item: i.id, clase: 'palabras-repetidas', detalle: `«${i.escrita}» ya está en ${repes.get(i.escrita)}` });
    else repes.set(i.escrita, i.id);
  }
  const sep = separablePorPosicion(patronDe(items, (i) => i.ejes.cambia));
  if (sep) out.push({ item: '(lote)', clase: 'orden-separable', detalle: `el eje «cambia» se predice por la POSICIÓN: ${sep}` });
  out.push(...revisarCobertura(coberturaUV(items)).map((f) => ({ item: f.item, clase: f.clase as unknown as ClaseFalloUV, detalle: f.detalle })));
  return out;
}

export function informeUV(items: ItemUV[]): string {
  const fallos = revisarLoteUV(items);
  const t = tasasCiegasUV(items);
  const pct = (x: number) => `${(100 * x).toFixed(0)} %`;
  const lineas = [`  ${items.length} ítems · ${fallos.length} fallo(s)`];
  for (const c of coberturaUV(items)) lineas.push(`    cobertura · ${c.comprobacion}: ${c.decididos}/${c.total}`);
  lineas.push(`    ciega · convertir toda «u» ${pct(t.convertirSiempre)} · no convertir nunca ${pct(t.noConvertirNunca)}`);
  for (const f of fallos) lineas.push(`    ✗ ${f.item} [${f.clase}] ${f.detalle}`);
  return lineas.join('\n');
}

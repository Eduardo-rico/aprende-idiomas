// scripts/lib/gate-interrogativa-indirecta.ts — UN SUBJUNTIVO QUE NO
// SIGNIFICA NADA.
//
// Punto `l7-interrogativa-indirecta`. «`rogō quid faciās`. El español pone
// indicativo (“pregunto qué haces”) y el latín subjuntivo, **sin ningún
// matiz de duda**.» `motivo`: «el subjuntivo aquí no significa nada, es
// puramente formal: el alumno le busca un valor y lo traduce mal».
// `clase: trampa`, `formato: cloze-en-glosa`, `via: recepcion`.
// `varia`: «la partícula interrogativa (quid, num, an, utrum… an)».
//
// ══ EL ERROR DIANA VA ESCRITO EN EL ÍTEM, NO MEDIDO COMO TASA ════════
//
// «Traducir el subjuntivo por un subjuntivo» es el error del punto y es
// **imposible que acierte**: la respuesta española va siempre en
// indicativo. Medirlo como estrategia ciega daría 0 % sin poder dar otra
// cosa, que es el adorno que §5.sexdecies del relevo prohíbe.
//
// Lo que se hace en su lugar es declararlo por ítem —`elErrorDiana`— y
// comprobar dos cosas que sí pueden fallar: que difiere de la respuesta (si
// no, el ítem no examina la trampa) y que la glosa no lo regala. De paso,
// el campo le sirve a la aplicación como distractor.
//
// ══ LA CIEGA QUE SÍ PUEDE FALLAR ES LA PARTÍCULA ═════════════════════
//
// Cada partícula pide un interrogativo español distinto —`num`/`an` piden
// «si», `ubi` «dónde», `cūr` «por qué», `quandō` «cuándo», `quōmodo`
// «cómo»—. Si el lote carga en una, el alumno la acierta sin leerla. Se
// mide como mayoría, y con seis partículas el azar es un sexto.
//
// ══ LO QUE FALTA Y POR QUÉ ═══════════════════════════════════════════
//
// `quid` (×727) y `quis` (×292) son el ejemplo del propio punto y no están:
// declinan, y meterlos en la lista de invariables sería mentir sobre su
// morfología para ahorrarse un paradigma. La cobertura lo declara.
import { palabrasDesconocidas } from './gate-vocabulario-del-marco';
import { revisarCobertura, type Cobertura } from './cobertura';
import { separablePorPosicion } from './atajos';
import { patronDe } from './orden-publicado';

/** Las seis que L1 produce. `utrum… an` queda fuera: `utrum` sale 12 veces
 *  y no entró al léxico. */
export const PARTICULAS = {
  num: 'si', an: 'si', ubi: 'dónde', cūr: 'por qué', quandō: 'cuándo', quōmodo: 'cómo',
} as const;
export type Particula = keyof typeof PARTICULAS;

export interface ItemInterrogativa {
  id: string;
  punto: string;
  particula: Particula;
  /** La frase latina entera; el hueco va en la glosa. */
  latin: string;
  /** La glosa española con `___` donde va el verbo subordinado. */
  glosa: string;
  /** La respuesta, EN INDICATIVO. */
  respuesta: string;
  /** Lo que escribe quien le busca un valor al subjuntivo latino. Va
   *  escrito porque medirlo como tasa daría cero sin poder dar otra cosa. */
  elErrorDiana: string;
  ejes: { particula: Particula };
}

export type ClaseFalloInterrogativa =
  | 'particula-no-esta' | 'eje-mal-declarado' | 'error-diana-igual-a-la-respuesta'
  | 'glosa-sin-hueco' | 'glosa-regala-la-respuesta' | 'glosa-regala-el-error'
  | 'glosa-sin-interrogativo' | 'latin-fuera-de-l1' | 'latin-sin-subjuntivo'
  | 'varia-incompleto' | 'cobertura-cero' | 'cobertura-sin-motivo'
  | 'estrategia-ciega' | 'orden-publicado';

export interface FalloInterrogativa { item: string; clase: ClaseFalloInterrogativa; detalle: string }

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').normalize('NFC').toLowerCase().trim();

/** CIEGA · contestar siempre con el mismo interrogativo español. */
export function interrogativoQueToca(item: ItemInterrogativa): string {
  return PARTICULAS[item.particula];
}

export function revisarItemInterrogativa(item: ItemInterrogativa, esSubjuntivo: (forma: string) => boolean): FalloInterrogativa[] {
  const out: FalloInterrogativa[] = [];
  const push = (clase: ClaseFalloInterrogativa, detalle: string) => out.push({ item: item.id, clase, detalle });

  const palabras = norm(item.latin).replace(/[.,?]/g, '').split(/\s+/);
  if (!palabras.includes(norm(item.particula)))
    push('particula-no-esta', `declara «${item.particula}» y la frase no la lleva`);
  if (item.ejes.particula !== item.particula)
    push('eje-mal-declarado', `el eje dice ${item.ejes.particula} y el ítem es ${item.particula}`);

  // EL ERROR DIANA TIENE QUE SER OTRA COSA QUE LA RESPUESTA: si coinciden,
  // el ítem no examina la trampa aunque esté bien escrito.
  if (norm(item.elErrorDiana) === norm(item.respuesta))
    push('error-diana-igual-a-la-respuesta', `«${item.respuesta}» y el error diana son la misma forma: el ítem no distingue el modo`);

  // LA SUBORDINADA LATINA TIENE QUE IR EN SUBJUNTIVO: si no, no hay punto.
  if (!palabras.some((w) => esSubjuntivo(w)))
    push('latin-sin-subjuntivo', `la frase «${item.latin}» no lleva ningún subjuntivo: el punto es precisamente que el latín lo pone`);

  if (!item.glosa.includes('___')) push('glosa-sin-hueco', 'la glosa española no tiene hueco `___`');
  if (norm(item.glosa).includes(norm(item.respuesta))) push('glosa-regala-la-respuesta', `la glosa contiene «${item.respuesta}»`);
  if (norm(item.glosa).includes(norm(item.elErrorDiana))) push('glosa-regala-el-error', `la glosa contiene el error diana «${item.elErrorDiana}»`);
  if (!norm(item.glosa).includes(norm(interrogativoQueToca(item))))
    push('glosa-sin-interrogativo', `la glosa no lleva «${interrogativoQueToca(item)}», que es lo que pide «${item.particula}»`);
  const d = palabrasDesconocidas(item.latin);
  if (d.length > 0) push('latin-fuera-de-l1', `la frase usa palabras que la máquina de L1 no produce: ${d.join(', ')}`);
  return out;
}

export function tasasCiegasInterrogativa(items: ItemInterrogativa[]) {
  const por: Record<string, number> = {};
  for (const i of items) { const q = interrogativoQueToca(i); por[q] = (por[q] ?? 0) + 1; }
  const mayoria = Math.max(0, ...Object.values(por));
  return {
    siempreElMismoInterrogativo: { tasa: items.length === 0 ? 0 : mayoria / items.length, decididos: items.length, total: items.length },
  };
}

export function coberturaInterrogativa(items: ItemInterrogativa[]): Cobertura[] {
  const n = items.length;
  return [
    { comprobacion: 'el error diana difiere de la respuesta', decididos: items.filter((i) => norm(i.elErrorDiana) !== norm(i.respuesta)).length, total: n },
    { comprobacion: 'las partículas del varia', decididos: new Set(items.map((i) => i.particula)).size, total: Object.keys(PARTICULAS).length },
    { comprobacion: 'los interrogativos españoles distintos',
      decididos: new Set(items.map(interrogativoQueToca)).size, total: new Set(Object.values(PARTICULAS)).size },
    { comprobacion: '`quid` y `quis`, que son el ejemplo del punto',
      decididos: 0, total: n,
      elCeroEsUnResultado: 'declinan, y meterlos en la lista de invariables sería mentir sobre su morfología para ahorrarse un paradigma: les toca un módulo de interrogativos',
      motivoDeLosQueQuedanFuera: '`quid` (×727) y `quis` (×292) no están en la máquina de L1 porque declinan; las seis partículas del lote son las indeclinables' },
  ];
}

export function revisarLoteInterrogativa(items: ItemInterrogativa[], esSubjuntivo: (f: string) => boolean): FalloInterrogativa[] {
  const out: FalloInterrogativa[] = items.flatMap((i) => revisarItemInterrogativa(i, esSubjuntivo));
  for (const c of revisarCobertura(coberturaInterrogativa(items)))
    out.push({ item: c.item, clase: c.clase, detalle: c.detalle });

  if (new Set(items.map((i) => i.particula)).size < 4)
    out.push({ item: '(lote)', clase: 'varia-incompleto',
      detalle: `el varia es la partícula interrogativa y el lote trae ${new Set(items.map((i) => i.particula)).size}: con menos de cuatro no se ve que el subjuntivo no depende de ella` });

  const t = tasasCiegasInterrogativa(items);
  // Cinco interrogativos españoles distintos: el azar es un quinto. Se deja
  // margen hasta 0,4 porque «si» le toca a dos partículas.
  if (t.siempreElMismoInterrogativo.tasa > 0.4)
    out.push({ item: '(lote)', clase: 'estrategia-ciega',
      detalle: `«contestar siempre el mismo interrogativo» acierta el ${(100 * t.siempreElMismoInterrogativo.tasa).toFixed(0)} % de los ${t.siempreElMismoInterrogativo.decididos} ítems` });

  for (const q of new Set(items.map(interrogativoQueToca))) {
    const p = separablePorPosicion(patronDe(items, (i) => interrogativoQueToca(i) === q));
    if (p) out.push({ item: '(lote)', clase: 'orden-publicado', detalle: `«${q}» se separa por la posición: ${p}` });
  }
  return out;
}

// scripts/lib/gate-ablativo-absoluto.ts — LO QUE EL ALUMNO NO ESCRIBE.
//
// Punto `l8-ablativo-absoluto`. «`urbe captā, mīlitēs discessērunt`. Sujeto
// propio, distinto del de la principal, los dos en ablativo, sin conjunción.
// No tiene equivalente y admite tres traducciones según el contexto.»
//
// ══ `dificultadEsOmision: true`, Y ESO PROHÍBE UN FORMATO ════════════
//
// El punto lo dice con todas las letras: «LA DIFICULTAD ES QUE EL ALUMNO NO
// LO PRODUCE, no que lo produzca mal — así que el formato de corrección no
// puede medirlo: sólo enseña una frase mala y pide arreglarla, y aquí no hay
// frase mala, hay una construcción ausente». Un ítem de corregir mide lo que
// el alumno pone de MÁS; una omisión no deja rastro que corregir. Va por
// transformación: la glosa española trae el giro y el hueco latino pide la
// construcción entera, las dos palabras.
//
// ══ EL VARIA SON LOS TRES VALORES, Y SE EXIGEN LOS TRES ══════════════
//
// «el valor que el contexto impone, y hay que traer los tres: ocho ablativos
// absolutos traducidos todos por “una vez que” son un ítem repetido ocho
// veces». La construcción latina es la misma en los tres; lo que cambia es
// el español, y por eso el valor es un eje y no un adorno. Con tres valores
// el azar de «contestar siempre el mismo» es un tercio.
//
// ══ LA EXCEPCIÓN NO ES UN ADORNO: ES LA MITAD DEL RECONOCIMIENTO ═════
//
// «existe sin participio, con dos sustantivos o con un adjetivo
// (`Cicerōne cōnsule`, `vīvō patre`): el que busque siempre un participio no
// lo reconocerá». El lote obliga a llevar al menos uno sin participio, y la
// cobertura lo cuenta aparte.
//
// ══ LA CIEGA, Y POR QUÉ SU DENOMINADOR SON LOS SINGULARES ════════════
//
// «Declinarlo todo como si fuera de la 1.ª» da `-ā` en el singular: acierta
// en `viā` y `causā` y falla en `urbe`, `bellō`, `exercitū`. En el PLURAL no
// dice nada, porque la 1.ª y la 2.ª comparten el `-īs` y la estrategia
// acertaría por casualidad sin haber decidido: esos ítems quedan fuera del
// denominador con su motivo escrito, que es la regla de la casa desde que
// una tasa mintió por no llevarlo.
import porAnalisis from '../../lib/data/languages/la/atestacion-por-analisis.json';
import { participioPerfecto } from '../../lib/data/languages/la/participios';
import { declinar, declinarAdjetivo, type EntradaNominal, type EntradaVerbal, type Numero } from '../../lib/data/languages/la/paradigma-la';
import { palabrasDesconocidas } from './gate-vocabulario-del-marco';
import { revisarCobertura, type Cobertura } from './cobertura';
import { separablePorPosicion } from './atajos';
import { patronDe } from './orden-publicado';

const TABLA = (porAnalisis as { tabla: Record<string, Record<string, number>> }).tabla;

export type Valor = 'temporal' | 'causal' | 'concesivo';

export interface ItemAblAbs {
  id: string;
  punto: string;
  /** El sujeto propio del absoluto, que NO es el de la principal. */
  nombre: EntradaNominal;
  numero: Numero;
  /** El verbo cuyo participio de perfecto concierta, o `null` en los que no
   *  llevan participio —`Cicerōne cōnsule`, `vīvō patre`—. */
  verbo: EntradaVerbal | null;
  /** La segunda palabra cuando no hay participio: un adjetivo o un nombre,
   *  ya en ablativo. */
  segundaSinParticipio?: string;
  valor: Valor;
  /** Las dos palabras, en el orden en que van en el marco. */
  respuesta: string;
  marco: string;
  glosa: string;
  ejes: { valor: Valor; conParticipio: boolean };
  porQueSinAtestiguar?: string;
}

export type ClaseFalloAblAbs =
  | 'respuesta-no-derivable' | 'eje-mal-declarado' | 'sin-atestiguar'
  | 'no-son-dos-palabras' | 'sujeto-compartido' | 'marco-sin-hueco'
  | 'marco-regala-la-forma' | 'marco-fuera-de-l1' | 'glosa-sin-giro'
  | 'varia-incompleto' | 'sin-la-excepcion'
  | 'cobertura-cero' | 'cobertura-sin-motivo' | 'estrategia-ciega' | 'orden-publicado';

export interface FalloAblAbs { item: string; clase: ClaseFalloAblAbs; detalle: string }

const norm = (s: string) => s.normalize('NFD').replace(/[̄̆]/g, '').normalize('NFC').toLowerCase().trim();

/** SEGUNDO CAMINO: el nombre por el declinador nominal y el participio por
 *  el de adjetivos, ninguno de los dos escrito para este lote. */
export function absoluto(item: ItemAblAbs): string | null {
  const n = declinar(item.nombre, 'abl', item.numero);
  if (item.verbo === null) {
    return item.segundaSinParticipio ? `${n} ${item.segundaSinParticipio}` : null;
  }
  const p = participioPerfecto(item.verbo);
  if (!p) return null;
  const part = declinarAdjetivo(
    { lema: p.lema, tema: p.lema.normalize('NFC').slice(0, -2), glosa: p.glosa },
    item.nombre.genero, 'abl', item.numero);
  return `${n} ${part}`;
}

/** CIEGA · declinarlo todo como si fuera de la 1.ª. En el plural no decide:
 *  la 1.ª y la 2.ª comparten `-īs`. */
export function ablativoIngenuo(item: ItemAblAbs): string | null {
  if (item.numero === 'pl') return null;
  const lema = item.nombre.lema.normalize('NFC');
  return `${lema.replace(/(us|um|a|is|ēs|ūs|ō|s)$/, "")}ā`;
}

export function participioAtestiguado(item: ItemAblAbs): number {
  const segunda = item.respuesta.split(/\s+/)[1] ?? '';
  return TABLA[segunda]?.partPast ?? 0;
}

export function revisarItemAblAbs(item: ItemAblAbs): FalloAblAbs[] {
  const out: FalloAblAbs[] = [];
  const push = (clase: ClaseFalloAblAbs, detalle: string) => out.push({ item: item.id, clase, detalle });

  const dela = absoluto(item);
  if (dela === null) { push('respuesta-no-derivable', `no se puede derivar el absoluto de «${item.nombre.lema}»`); return out; }
  if (norm(dela) !== norm(item.respuesta))
    push('respuesta-no-derivable', `la respuesta es «${item.respuesta}» y la máquina da «${dela}»`);
  if (item.respuesta.trim().split(/\s+/).length !== 2)
    push('no-son-dos-palabras', `«${item.respuesta}» no son dos palabras: el absoluto es el nombre y su predicado`);
  if (item.ejes.valor !== item.valor || item.ejes.conParticipio !== (item.verbo !== null))
    push('eje-mal-declarado', `los ejes dicen ${item.ejes.valor}/participio=${item.ejes.conParticipio} y el ítem es ${item.valor}/participio=${item.verbo !== null}`);

  // El participio, cuando lo hay, tiene que estar atestiguado COMO tal.
  if (item.verbo !== null && participioAtestiguado(item) === 0 && (item.porQueSinAtestiguar ?? '').trim().length < 20)
    push('sin-atestiguar', `«${item.respuesta.split(/\s+/)[1]}» no aparece como participio de perfecto en el corpus`);

  // EL SUJETO DEL ABSOLUTO ES PROPIO: si la palabra del absoluto vuelve a
  // salir en la principal, no es absoluto, es concertado.
  const resto = item.marco.replace('___', ' ');
  const nomSg = norm(declinar(item.nombre, 'nom', item.numero));
  if (norm(resto).split(/\s+/).some((w) => norm(w.replace(/[.,]/g, '')) === nomSg))
    push('sujeto-compartido', `«${declinar(item.nombre, 'nom', item.numero)}» sale también en la principal: eso es un participio concertado, no un absoluto`);

  if (!item.marco.includes('___')) push('marco-sin-hueco', 'el marco latino no tiene hueco `___`');
  for (const w of item.respuesta.split(/\s+/))
    if (norm(item.marco.replace('___', '')).includes(norm(w))) push('marco-regala-la-forma', `el marco contiene «${w}»`);
  const d = palabrasDesconocidas(item.marco);
  if (d.length > 0) push('marco-fuera-de-l1', `el marco usa palabras que la máquina de L1 no produce: ${d.join(', ')}`);
  if (item.glosa.trim().length < 10) push('glosa-sin-giro', 'la glosa no trae el giro español que impone el valor');
  return out;
}

export function tasasCiegasAblAbs(items: ItemAblAbs[]) {
  // 1 · el valor: con tres, el azar es un tercio. Mayoría sobre el lote.
  const porValor: Record<string, number> = {};
  for (const i of items) porValor[i.valor] = (porValor[i.valor] ?? 0) + 1;
  const mayoria = Math.max(0, ...Object.values(porValor));
  // 2 · la 1.ª declinación para todo, sólo donde decide algo.
  const sg = items.filter((i) => i.numero === 'sg');
  const ingenuo = sg.filter((i) => norm(ablativoIngenuo(i) ?? '') === norm(i.respuesta.split(/\s+/)[0] ?? '')).length;
  return {
    siempreElMismoValor: { tasa: items.length === 0 ? 0 : mayoria / items.length, decididos: items.length, total: items.length },
    todoComoLaPrimera: { tasa: sg.length === 0 ? 0 : ingenuo / sg.length, decididos: sg.length, total: items.length },
  };
}

export function coberturaAblAbs(items: ItemAblAbs[]): Cobertura[] {
  const n = items.length;
  return [
    { comprobacion: 'la construcción contra la máquina',
      decididos: items.filter((i) => norm(absoluto(i) ?? ' ') === norm(i.respuesta)).length, total: n },
    { comprobacion: 'el participio aparece en el corpus COMO participio de perfecto',
      decididos: items.filter((i) => i.verbo === null || participioAtestiguado(i) > 0).length, total: n },
    { comprobacion: 'los tres valores del contexto', decididos: new Set(items.map((i) => i.valor)).size, total: 3 },
    { comprobacion: 'el absoluto SIN participio, que es la excepción del punto',
      decididos: items.filter((i) => i.verbo === null).length, total: n,
      motivoDeLosQueQuedanFuera: 'la construcción con participio es la mayoritaria y es la que hay que producir; la sin participio existe para que el alumno no la busque por el participio, y con dos basta para instalarla' },
    { comprobacion: 'las declinaciones del sujeto propio', decididos: new Set(items.map((i) => i.nombre.lema)).size, total: n,
      motivoDeLosQueQuedanFuera: 'no es una comprobación de cobertura sino la variedad léxica: repetir lema no invalida el ítem, pero un lote con dos lemas mediría dos palabras' },
  ];
}

export function revisarLoteAblAbs(items: ItemAblAbs[]): FalloAblAbs[] {
  const out: FalloAblAbs[] = items.flatMap(revisarItemAblAbs);
  for (const c of revisarCobertura(coberturaAblAbs(items)))
    out.push({ item: c.item, clase: c.clase, detalle: c.detalle });

  const valores = new Set(items.map((i) => i.valor));
  if (valores.size < 3)
    out.push({ item: '(lote)', clase: 'varia-incompleto',
      detalle: `el varia son los tres valores y el lote trae ${valores.size}: ${[...valores].join(', ')} — «ocho absolutos traducidos todos por “una vez que” son un ítem repetido ocho veces»` });
  if (items.length > 0 && items.every((i) => i.verbo !== null))
    out.push({ item: '(lote)', clase: 'sin-la-excepcion',
      detalle: 'todos los ítems llevan participio: el que busque siempre un participio no reconocerá `Cicerōne cōnsule` ni `vīvō patre`' });

  const t = tasasCiegasAblAbs(items);
  if (t.siempreElMismoValor.tasa > 0.5)
    out.push({ item: '(lote)', clase: 'estrategia-ciega',
      detalle: `«contestar siempre el mismo valor» acierta el ${(100 * t.siempreElMismoValor.tasa).toFixed(0)} % de los ${t.siempreElMismoValor.decididos} ítems` });
  if (t.todoComoLaPrimera.decididos > 0 && t.todoComoLaPrimera.tasa > 0.5)
    out.push({ item: '(lote)', clase: 'estrategia-ciega',
      detalle: `«declinarlo todo como la 1.ª» acierta el ${(100 * t.todoComoLaPrimera.tasa).toFixed(0)} % de los ${t.todoComoLaPrimera.decididos} ítems en singular` });

  for (const v of ['temporal', 'causal', 'concesivo'] as const) {
    const s = separablePorPosicion(patronDe(items, (i) => i.valor === v));
    if (s) out.push({ item: '(lote)', clase: 'orden-publicado', detalle: `el valor ${v} se separa por la posición: ${s}` });
  }
  return out;
}

// scripts/lib/gate-completivas-ut.ts — QUÉ RIGE CADA VERBO.
//
// Punto `l7-completivas-ut`. «`imperat ut veniant`. El español dice “ordena
// que vengan”, también con subjuntivo: regalo.» `varia`: «el verbo regente,
// porque **algunos rigen infinitivo y no completiva**». `excepcion`:
// «`iubeō` y `vetō` NO llevan `ut`: rigen acusativo con infinitivo. Un
// alumno que generalice dirá *`iubet ut veniant`».
//
// ══ QUIEN DECIDE EL RÉGIMEN ES EL CORPUS, NO YO ══════════════════════
//
// El eje de este punto es una propiedad LÉXICA: qué construcción rige cada
// verbo. Eso no lo puede decidir el que escribe el lote, porque es
// exactamente el tipo de afirmación que se cuela sin comprobar. `atestar-ut`
// lo cuenta del treebank y lo congela en `regimen`:
//
//     rogō      ut 53   inf   6      completiva
//     faciō     ut 34   inf  27      completiva
//     iubeō     ut  0   inf 133      infinitivo — la excepción del punto
//     audiō     ut  0   inf  13      infinitivo
//     dīcō      ut 18   inf  84      MIXTO: no determina nada
//
// El punto declaraba la excepción y el corpus la confirma sin margen.
//
// ══ LO QUE EL GATE NO HACE: LLAMAR AGRAMATICAL A UN CERO ═════════════
//
// Que `audiō` tenga 0 completivas en 227.301 tokens es una TENDENCIA
// medida, no una prueba de que `*audit ut veniat` sea imposible. La regla
// de la casa —ninguna forma se marca agramatical sin fuente citada en el
// propio material— se aplica igual a las construcciones. El lote pide la
// construcción **que el corpus atestigua** y la glosa no dice que la otra
// esté mal.
//
// ══ LOS VERBOS MIXTOS QUEDAN FUERA, CON SU MOTIVO ════════════════════
//
// `dīcō` (18/84) y `labōrō` (1/1) no determinan la respuesta. Un ítem cuyo
// régimen el corpus no decide no mide su punto, igual que el regente en
// perfecto de `l7-ut-final`.
import atestacion from '../../lib/data/languages/la/atestacion-ut.json';
import { subjuntivo, type TiempoSubj } from '../../lib/data/languages/la/subjuntivo';
import { conjugar, type EntradaVerbal, type Persona, type Tiempo } from '../../lib/data/languages/la/paradigma-la';
import { palabrasDesconocidas } from './gate-vocabulario-del-marco';
import { revisarCobertura, type Cobertura } from './cobertura';
import { separablePorPosicion } from './atajos';
import { patronDe } from './orden-publicado';

const REGIMEN = (atestacion as { regimen: Record<string, { conUt: number; conInfinitivo: number }> }).regimen;

export type Construccion = 'completiva' | 'infinitivo';
export type TiempoRegente = 'presente' | 'imperfecto';

/** La misma concordancia que `l7-ut-final`, y por el mismo motivo: el
 *  perfecto no la determina (264 imperfectos frente a 71 presentes). */
export const CONCORDANCIA: Record<TiempoRegente, TiempoSubj> = { presente: 'presente', imperfecto: 'imperfecto' };

/** La clave con la que el corpus guarda un lema: sin cantidad y con `u`. */
export const clave = (lema: string) =>
  lema.normalize('NFD').replace(/[̄̆]/g, '').normalize('NFC').toLowerCase().replace(/v/g, 'u').replace(/j/g, 'i');

/** Lo que el corpus dice que rige un verbo. `null` cuando no lo decide. */
export const SUELO_DE_EVIDENCIA = 5;

export function regimenDe(lema: string): Construccion | null {
  const r = REGIMEN[clave(lema)];
  if (!r) return null;
  // Un verbo con dos apariciones no decide nada, aunque las dos vayan en la
  // misma dirección: `mittō` sale 2 veces con `ut` y 0 con infinitivo, y
  // eso no es una propiedad léxica, es una coincidencia de tamaño 2.
  if (r.conUt + r.conInfinitivo < SUELO_DE_EVIDENCIA) return null;
  if (r.conUt === 0) return 'infinitivo';
  if (r.conInfinitivo === 0) return 'completiva';
  if (r.conUt >= 3 * r.conInfinitivo) return 'completiva';
  if (r.conInfinitivo >= 3 * r.conUt) return 'infinitivo';
  return null;   // mixto: no determina
}

export function cuentasDe(lema: string): { conUt: number; conInfinitivo: number } {
  return REGIMEN[clave(lema)] ?? { conUt: 0, conInfinitivo: 0 };
}

export interface ItemCompletiva {
  id: string;
  punto: string;
  verboRegente: EntradaVerbal;
  tiempoRegente: TiempoRegente;
  personaRegente: Persona;
  construccion: Construccion;
  verbo: EntradaVerbal;
  /** Sólo en las completivas. */
  persona?: Persona;
  /** `ut veniat` o `venīre`. */
  respuesta: string;
  marco: string;
  glosa: string;
  ejes: { construccion: Construccion; tiempoRegente: TiempoRegente };
}

export type ClaseFalloCompletiva =
  | 'respuesta-no-derivable' | 'regimen-no-atestiguado' | 'regimen-indeterminado'
  | 'eje-mal-declarado' | 'regente-no-esta-en-el-marco' | 'marco-sin-hueco'
  | 'marco-regala-la-forma' | 'marco-fuera-de-l1' | 'glosa-sin-giro'
  | 'varia-incompleto' | 'cobertura-cero' | 'cobertura-sin-motivo'
  | 'estrategia-ciega' | 'orden-publicado';

export interface FalloCompletiva { item: string; clase: ClaseFalloCompletiva; detalle: string }

const norm = (s: string) => s.normalize('NFD').replace(/[̄̆]/g, '').normalize('NFC').toLowerCase().trim();

/** SEGUNDO CAMINO de la forma: la máquina. El del RÉGIMEN es el corpus. */
export function completivaDeLaMaquina(item: ItemCompletiva): string | null {
  if (item.construccion === 'infinitivo') return item.verbo.infinitivo;
  if (!item.persona) return null;
  const v = subjuntivo(item.verbo, CONCORDANCIA[item.tiempoRegente], item.persona);
  return v === null ? null : `ut ${v}`;
}

/** CIEGA · generalizar la completiva: poner `ut` + subjuntivo con todos los
 *  regentes. Es el error que el punto declara obligatorio —*`iubet ut
 *  veniant`— y sólo falla en los que rigen infinitivo. */
export function siempreCompletiva(item: ItemCompletiva): string | null {
  const p = item.persona ?? '3sg';
  const v = subjuntivo(item.verbo, CONCORDANCIA[item.tiempoRegente], p);
  return v === null ? null : `ut ${v}`;
}

/** CIEGA 2 · el presente de subjuntivo pase lo que pase. Devuelve `null` en
 *  los ítems de infinitivo, y ahí está lo importante: el infinitivo NO
 *  TIENE TIEMPO QUE ELEGIR, así que la estrategia acierta en ellos por
 *  definición. Medida sobre los doce salía al 75 % sin que seis de esos
 *  ítems hubieran decidido nada.
 *
 *  Es el mismo pozo de denominador de §5.sexdecies del relevo, por el otro
 *  lado: allí restringirlo de más daba cero, aquí no restringirlo infla. La
 *  regla que sirve para los dos casos es una: **el denominador son los
 *  ítems donde la estrategia puede acertar Y fallar**. */
export function siemprePresente(item: ItemCompletiva): string | null {
  if (item.construccion === 'infinitivo' || !item.persona) return null;
  const v = subjuntivo(item.verbo, 'presente', item.persona);
  return v === null ? null : `ut ${v}`;
}

export function regenteConjugado(item: ItemCompletiva): string {
  return conjugar(item.verboRegente, item.personaRegente, item.tiempoRegente as Tiempo);
}

export function revisarItemCompletiva(item: ItemCompletiva): FalloCompletiva[] {
  const out: FalloCompletiva[] = [];
  const push = (clase: ClaseFalloCompletiva, detalle: string) => out.push({ item: item.id, clase, detalle });

  const dela = completivaDeLaMaquina(item);
  if (dela === null) { push('respuesta-no-derivable', `la máquina no da la ${item.construccion} de «${item.verbo.lema}»`); return out; }
  if (norm(dela) !== norm(item.respuesta))
    push('respuesta-no-derivable', `la respuesta es «${item.respuesta}» y la máquina da «${dela}»`);

  // EL RÉGIMEN LO DICE EL CORPUS.
  const r = regimenDe(item.verboRegente.lema);
  const c = cuentasDe(item.verboRegente.lema);
  if (r === null)
    push('regimen-indeterminado', `el corpus no decide el régimen de «${item.verboRegente.lema}» (ut ${c.conUt} / inf ${c.conInfinitivo}): un ítem así no mide su punto`);
  else if (r !== item.construccion)
    push('regimen-no-atestiguado', `el ítem pide ${item.construccion} y el corpus da ${r} para «${item.verboRegente.lema}» (ut ${c.conUt} / inf ${c.conInfinitivo})`);

  if (item.ejes.construccion !== item.construccion || item.ejes.tiempoRegente !== item.tiempoRegente)
    push('eje-mal-declarado', 'los ejes no dicen lo que el ítem es');

  const reg = regenteConjugado(item);
  if (!item.marco.includes(reg))
    push('regente-no-esta-en-el-marco', `el marco no contiene «${reg}», que es el regente en ${item.tiempoRegente}`);

  if (!item.marco.includes('___')) push('marco-sin-hueco', 'el marco latino no tiene hueco `___`');
  for (const w of item.respuesta.split(/\s+/))
    if (norm(item.marco.replace('___', '')).split(/\s+/).includes(norm(w.replace(/[.,]/g, ''))))
      push('marco-regala-la-forma', `el marco contiene «${w}»`);
  const d = palabrasDesconocidas(item.marco);
  if (d.length > 0) push('marco-fuera-de-l1', `el marco usa palabras que la máquina de L1 no produce: ${d.join(', ')}`);
  if (item.glosa.trim().length < 10) push('glosa-sin-giro', 'la glosa no trae el giro español');
  return out;
}

export function tasasCiegasCompletiva(items: ItemCompletiva[]) {
  const gen = items.filter((i) => norm(siempreCompletiva(i) ?? '') === norm(i.respuesta)).length;
  const conTiempo = items.filter((i) => i.construccion === 'completiva');
  const pres = conTiempo.filter((i) => norm(siemprePresente(i) ?? '\u0000') === norm(i.respuesta)).length;
  return {
    siempreCompletiva: { tasa: items.length === 0 ? 0 : gen / items.length, decididos: items.length, total: items.length },
    siemprePresente: { tasa: conTiempo.length === 0 ? 0 : pres / conTiempo.length, decididos: conTiempo.length, total: items.length },
  };
}

export function coberturaCompletiva(items: ItemCompletiva[]): Cobertura[] {
  const n = items.length;
  return [
    { comprobacion: 'la respuesta contra la máquina',
      decididos: items.filter((i) => norm(completivaDeLaMaquina(i) ?? ' ') === norm(i.respuesta)).length, total: n },
    { comprobacion: 'el régimen lo atestigua el corpus',
      decididos: items.filter((i) => regimenDe(i.verboRegente.lema) === i.construccion).length, total: n },
    { comprobacion: 'las dos construcciones', decididos: new Set(items.map((i) => i.construccion)).size, total: 2 },
    { comprobacion: 'los dos tiempos del regente', decididos: new Set(items.map((i) => i.tiempoRegente)).size, total: 2 },
    { comprobacion: '`iubeō`, que es la excepción que el punto nombra',
      decididos: items.filter((i) => i.verboRegente.lema === 'iubeō').length, total: n,
      motivoDeLosQueQuedanFuera: 'el punto nombra `iubeō` y `vetō`; `vetō` sale 6 veces en el corpus y no entró al léxico. Los demás regentes de infinitivo están para que la excepción no parezca una rareza de un solo verbo' },
    { comprobacion: 'regentes distintos', decididos: new Set(items.map((i) => i.verboRegente.lema)).size, total: n,
      motivoDeLosQueQuedanFuera: 'no es cobertura sino variedad léxica: repetir regente no invalida el ítem, pero un lote de dos regentes mediría dos palabras' },
  ];
}

export function revisarLoteCompletiva(items: ItemCompletiva[]): FalloCompletiva[] {
  const out: FalloCompletiva[] = items.flatMap(revisarItemCompletiva);
  for (const c of revisarCobertura(coberturaCompletiva(items)))
    out.push({ item: c.item, clase: c.clase, detalle: c.detalle });

  if (new Set(items.map((i) => i.construccion)).size < 2)
    out.push({ item: '(lote)', clase: 'varia-incompleto',
      detalle: 'el varia es el verbo regente porque algunos rigen infinitivo, y el lote sólo trae una construcción: sin la otra no hay nada que elegir' });

  const t = tasasCiegasCompletiva(items);
  if (t.siempreCompletiva.tasa > 0.6)
    out.push({ item: '(lote)', clase: 'estrategia-ciega',
      detalle: `«poner ut + subjuntivo con todos» acierta el ${(100 * t.siempreCompletiva.tasa).toFixed(0)} % de los ${t.siempreCompletiva.decididos} ítems: ése es el error que el punto declara obligatorio` });
  if (t.siemprePresente.decididos > 0 && t.siemprePresente.tasa > 0.6)
    out.push({ item: '(lote)', clase: 'estrategia-ciega',
      detalle: `«el presente de subjuntivo pase lo que pase» acierta el ${(100 * t.siemprePresente.tasa).toFixed(0)} % de las ${t.siemprePresente.decididos} completivas (los ítems de infinitivo no eligen tiempo)` });

  for (const p of [separablePorPosicion(patronDe(items, (i) => i.construccion === 'infinitivo')),
                   separablePorPosicion(patronDe(items, (i) => i.tiempoRegente === 'imperfecto'))])
    if (p) out.push({ item: '(lote)', clase: 'orden-publicado', detalle: `se separa por la posición: ${p}` });
  return out;
}

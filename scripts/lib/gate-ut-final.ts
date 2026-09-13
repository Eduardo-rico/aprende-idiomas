// scripts/lib/gate-ut-final.ts — `ut` / `nē`, Y LA CONCORDANCIA DE TIEMPOS.
//
// Punto `l7-ut-final`. «`vēnit ut videat`. Transfiere bien: el español dice
// “para que vea”, también en subjuntivo.» `motivo`: «transfiere; lo que se
// examina es **la forma y la concordancia de tiempos**, no el valor».
// `varia`: «si la final es positiva o negativa, porque `nē` sustituye a
// `ut nōn`». `excepcion`: «la final negativa NO se dice `ut nōn` sino `nē`:
// es el error de sobreaplicación obligatorio de este punto».
//
// ══ EL VALOR ES UN REGALO Y POR ESO NO SE EXAMINA ════════════════════
//
// `herencia: regalo`. «Para que vea» es subjuntivo en español igual que en
// latín: un ítem que pregunte por el VALOR de la subordinada lo contesta
// cualquier hispanohablante sin saber latín. Lo que no transfiere son dos
// cosas y son las dos que se miden: **qué conjunción lleva la negativa** y
// **qué tiempo del subjuntivo pide el tiempo del regente**.
//
// ══ LA DOCTRINA, MEDIDA EN VEZ DE AFIRMADA ═══════════════════════════
//
// `atestacion-ut.json` saca del treebank las 2.006 subordinadas con
// `ut`/`nē` + subjuntivo. Eso permite comprobar lo que el material declara,
// que es justo lo que aquí importa porque son afirmaciones sobre la lengua:
//
//                                    nē    ut nōn
//     adverbial CON anticipador       3        26     (≈ consecutiva)
//     adverbial SIN anticipador     192        58     (≈ final)
//
// La regla se sostiene, pero **no como ley**: hay 58 `ut nōn` adverbiales
// sin anticipador. Un lote no puede marcar `ut nōn` como agramatical en una
// final — `l7-ut-consecutiva` dice «quien aplique la regla de la final se
// equivocará SIEMPRE», y medido es el 90 %, no el 100.
//
// Y la concordancia de tiempos, que nadie había medido:
//
//     regente Pres     → subjuntivo Pres   513      96 % de los Pres
//     regente PastPerf → subjuntivo Past   264      79 % de los PastPerf
//     regente Past     → subjuntivo Past   137      95 % de los Past
//     regente Fut      → subjuntivo Pres    75     100 %
//     regente PastPerf → subjuntivo Pres    71      ← la grieta
//
// Los 71 no son ruido: son el `perfectum` que vale por presente («ha
// hecho») en vez de por pasado («hizo»). Por eso el lote sólo usa regentes
// **inequívocos** —presente, futuro e imperfecto— y el perfecto va con su
// motivo escrito o no va.
import atestacion from '../../lib/data/languages/la/atestacion-ut.json';
import { subjuntivo, type TiempoSubj } from '../../lib/data/languages/la/subjuntivo';
import { conjugar, type EntradaVerbal, type Persona, type Tiempo } from '../../lib/data/languages/la/paradigma-la';
import { palabrasDesconocidas } from './gate-vocabulario-del-marco';
import { revisarCobertura, type Cobertura } from './cobertura';
import { separablePorPosicion } from './atajos';
import { patronDe } from './orden-publicado';

const AT = atestacion as {
  adverbiales: { conAnticipador: { ne: number; utNon: number; ut: number }; sinAnticipador: { ne: number; utNon: number; ut: number } };
  concordanciaDeTiempos: Record<string, number>;
};

export type Conjuncion = 'ut' | 'nē';
/** Los tiempos del regente que el lote admite. El perfecto queda fuera por
 *  medición, no por gusto: en el corpus lleva imperfecto 264 veces y
 *  presente 71, así que no determina la respuesta. */
export type TiempoRegente = 'presente' | 'futuro' | 'imperfecto';

/** LA CONCORDANCIA, escrita como regla y comprobada contra el corpus en el
 *  test: los tiempos primarios piden presente y los secundarios imperfecto. */
export const CONCORDANCIA: Record<TiempoRegente, TiempoSubj> = {
  presente: 'presente',
  futuro: 'presente',
  imperfecto: 'imperfecto',
};

export interface ItemUtFinal {
  id: string;
  punto: string;
  verboRegente: EntradaVerbal;
  tiempoRegente: TiempoRegente;
  personaRegente: Persona;
  verbo: EntradaVerbal;
  persona: Persona;
  conjuncion: Conjuncion;
  /** Las dos palabras: la conjunción y el subjuntivo. */
  respuesta: string;
  /** La frase latina con `___`, que ya trae el regente conjugado. */
  marco: string;
  glosa: string;
  ejes: { conjuncion: Conjuncion; tiempoRegente: TiempoRegente };
  porQueSinAtestiguar?: string;
}

export type ClaseFalloUtFinal =
  | 'respuesta-no-derivable' | 'concordancia-mal' | 'eje-mal-declarado'
  | 'regente-no-esta-en-el-marco' | 'marco-sin-hueco' | 'marco-regala-la-forma'
  | 'marco-fuera-de-l1' | 'glosa-sin-giro' | 'glosa-no-niega' | 'varia-incompleto'
  | 'cobertura-cero' | 'cobertura-sin-motivo' | 'estrategia-ciega' | 'orden-publicado';

export interface FalloUtFinal { item: string; clase: ClaseFalloUtFinal; detalle: string }

const norm = (s: string) => s.normalize('NFD').replace(/[̄̆]/g, '').normalize('NFC').toLowerCase().trim();

/** SEGUNDO CAMINO para la forma: la máquina del subjuntivo, que no sabe
 *  nada de sintaxis. Para la SINTAXIS el segundo camino es el treebank, y
 *  vive en los tests: aquí sólo se comprueba la forma y la concordancia. */
export function finalDeLaMaquina(item: ItemUtFinal): string | null {
  const t = CONCORDANCIA[item.tiempoRegente];
  const v = subjuntivo(item.verbo, t, item.persona);
  return v === null ? null : `${item.conjuncion} ${v}`;
}

/** CIEGA 1 · poner siempre `ut`, que es el error que el punto declara
 *  obligatorio: la negativa se dice `nē`, no `ut nōn`. */
export function siempreUt(item: ItemUtFinal): string {
  return `ut ${item.respuesta.split(/\s+/)[1] ?? ''}`;
}

/** CIEGA 2 · poner siempre el presente de subjuntivo, sin mirar el tiempo
 *  del regente. */
export function siemprePresente(item: ItemUtFinal): string | null {
  const v = subjuntivo(item.verbo, 'presente', item.persona);
  return v === null ? null : `${item.conjuncion} ${v}`;
}

export function regenteConjugado(item: ItemUtFinal): string {
  return conjugar(item.verboRegente, item.personaRegente, item.tiempoRegente as Tiempo);
}

export function revisarItemUtFinal(item: ItemUtFinal): FalloUtFinal[] {
  const out: FalloUtFinal[] = [];
  const push = (clase: ClaseFalloUtFinal, detalle: string) => out.push({ item: item.id, clase, detalle });

  const dela = finalDeLaMaquina(item);
  if (dela === null) { push('respuesta-no-derivable', `la máquina no da el subjuntivo de «${item.verbo.lema}»`); return out; }
  if (norm(dela) !== norm(item.respuesta))
    push('respuesta-no-derivable', `la respuesta es «${item.respuesta}» y la máquina da «${dela}»`);
  if (item.respuesta.trim().split(/\s+/).length !== 2)
    push('respuesta-no-derivable', `«${item.respuesta}» no son dos palabras: la conjunción y el subjuntivo`);
  if (!item.respuesta.startsWith(item.conjuncion))
    push('concordancia-mal', `el ítem declara «${item.conjuncion}» y la respuesta empieza por otra cosa`);
  if (item.ejes.conjuncion !== item.conjuncion || item.ejes.tiempoRegente !== item.tiempoRegente)
    push('eje-mal-declarado', `los ejes dicen ${item.ejes.conjuncion}/${item.ejes.tiempoRegente} y el ítem es ${item.conjuncion}/${item.tiempoRegente}`);

  // EL REGENTE TIENE QUE ESTAR EN EL MARCO Y EN EL TIEMPO DECLARADO: sin
  // eso el alumno no tiene de dónde sacar la concordancia.
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
  // Una final negativa cuya glosa no niega no examina nada.
  if (item.conjuncion === 'nē' && !/\bno\b|\bnunca\b|\bnadie\b|\bnada\b/i.test(item.glosa))
    push('glosa-no-niega', `el ítem es negativo y la glosa «${item.glosa}» no lleva negación: el alumno no tiene por qué poner «nē»`);
  return out;
}

export function tasasCiegasUtFinal(items: ItemUtFinal[]) {
  const ut = items.filter((i) => norm(siempreUt(i)) === norm(i.respuesta)).length;
  const pres = items.filter((i) => norm(siemprePresente(i) ?? '') === norm(i.respuesta)).length;
  return {
    siempreUt: { tasa: items.length === 0 ? 0 : ut / items.length, decididos: items.length, total: items.length },
    siemprePresente: { tasa: items.length === 0 ? 0 : pres / items.length, decididos: items.length, total: items.length },
  };
}

export function coberturaUtFinal(items: ItemUtFinal[]): Cobertura[] {
  const n = items.length;
  return [
    { comprobacion: 'la respuesta contra la máquina',
      decididos: items.filter((i) => norm(finalDeLaMaquina(i) ?? ' ') === norm(i.respuesta)).length, total: n },
    { comprobacion: 'las dos conjunciones', decididos: new Set(items.map((i) => i.conjuncion)).size, total: 2 },
    { comprobacion: 'los tres tiempos INEQUÍVOCOS del regente', decididos: new Set(items.map((i) => i.tiempoRegente)).size, total: 3 },
    { comprobacion: 'la final NEGATIVA, que es la excepción del punto',
      decididos: items.filter((i) => i.conjuncion === 'nē').length, total: n,
      motivoDeLosQueQuedanFuera: 'la positiva es la mayoritaria en el corpus (675 frente a 192 en las adverbiales sin anticipador) y es la que el alumno lee más; la negativa existe para instalar `nē` contra `ut nōn`' },
    { comprobacion: 'el regente en un tiempo SECUNDARIO, que es donde la concordancia se ve',
      decididos: items.filter((i) => CONCORDANCIA[i.tiempoRegente] !== 'presente').length, total: n,
      motivoDeLosQueQuedanFuera: 'con regente primario la respuesta es el presente de subjuntivo, que es lo que pone quien no sabe la regla: esos ítems no distinguen' },
  ];
}

export function revisarLoteUtFinal(items: ItemUtFinal[]): FalloUtFinal[] {
  const out: FalloUtFinal[] = items.flatMap(revisarItemUtFinal);
  for (const c of revisarCobertura(coberturaUtFinal(items)))
    out.push({ item: c.item, clase: c.clase, detalle: c.detalle });

  if (new Set(items.map((i) => i.conjuncion)).size < 2)
    out.push({ item: '(lote)', clase: 'varia-incompleto',
      detalle: 'el varia es si la final es positiva o negativa, y el lote sólo trae una: sin la negativa no se instala `nē` contra `ut nōn`' });

  const t = tasasCiegasUtFinal(items);
  // Dos salidas: el azar es la mitad, y se deja margen hasta 0,6.
  if (t.siempreUt.tasa > 0.6)
    out.push({ item: '(lote)', clase: 'estrategia-ciega',
      detalle: `«poner siempre ut» acierta el ${(100 * t.siempreUt.tasa).toFixed(0)} % de los ${t.siempreUt.decididos} ítems` });
  if (t.siemprePresente.tasa > 0.6)
    out.push({ item: '(lote)', clase: 'estrategia-ciega',
      detalle: `«poner siempre el presente de subjuntivo» acierta el ${(100 * t.siemprePresente.tasa).toFixed(0)} % de los ${t.siemprePresente.decididos} ítems: el lote no obliga a mirar el regente` });

  for (const p of [separablePorPosicion(patronDe(items, (i) => i.conjuncion === 'nē')),
                   separablePorPosicion(patronDe(items, (i) => CONCORDANCIA[i.tiempoRegente] === 'imperfecto'))])
    if (p) out.push({ item: '(lote)', clase: 'orden-publicado', detalle: `se separa por la posición: ${p}` });
  return out;
}

/** Lo que el corpus dice, para que el lote y el test puedan citarlo sin
 *  volver a contarlo. */
export const LO_QUE_DICE_EL_CORPUS = {
  neEnConsecutivas: AT.adverbiales.conAnticipador.ne,
  utNonEnConsecutivas: AT.adverbiales.conAnticipador.utNon,
  neEnFinales: AT.adverbiales.sinAnticipador.ne,
  utNonEnFinales: AT.adverbiales.sinAnticipador.utNon,
  concordancia: AT.concordanciaDeTiempos,
};

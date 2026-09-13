// scripts/lib/gate-ut-consecutiva.ts — EL MISMO `ut`, EL VALOR CONTRARIO.
//
// Punto `l7-ut-consecutiva`. «`tam fortis est ut vincat`. La principal lleva
// un anticipador (tam, tantus, ita, sīc, adeō) que avisa de que viene una
// consecutiva.» `clase: trampa`, `formato: cloze-en-glosa`, `via: recepcion`.
//
// ══ POR QUÉ ES `falso-regalo` ════════════════════════════════════════
//
// «el español pone INDICATIVO en la consecutiva (“tan fuerte que vence”) y
// el latín subjuntivo: el alumno lee un valor final donde hay uno
// consecutivo». Ve `ut` + subjuntivo, recuerda `l7-ut-final`, y traduce
// «para que venza». La forma latina es idéntica en las dos; lo único que
// las separa es el sentido —y, cuando lo hay, el anticipador—.
//
// ══ EL REFLEJO DEL ANTICIPADOR SE MIDE COMO RECALL ═══════════════════
//
// «hay que traer ítems SIN anticipador para que no se resuelva por el
// reflejo». El reflejo es «si hay anticipador, consecutiva; si no, final».
// **No es una estrategia falsa: es una regla verdadera con recall
// incompleto.** Aplicada a una final acierta siempre, porque las finales no
// llevan anticipador. Sólo puede fallar en las consecutivas SIN
// anticipador, y por eso su denominador son las consecutivas: lo que se
// mide es cuántas caza, no cuántas veces acierta en el lote.
//
// Medirlo sobre el lote entero lo inflaría con las finales, que el reflejo
// clasifica bien sin haber examinado nada — el mismo pozo del denominador
// que ya se documenta en §5.sexdecies del relevo.
//
// ══ LA NEGATIVA ES EXACTAMENTE AL REVÉS QUE LA FINAL ═════════════════
//
// `excepcion`: «la consecutiva negativa lleva `ut nōn` y NO `nē`: es
// exactamente al revés que la final, y quien aplique la regla de la final
// se equivocará siempre». Medido en `atestacion-ut.json`:
//
//     adverbial CON anticipador     nē 3      ut nōn 26
//
// «Siempre» es falso —hay 3 `nē` con anticipador— y el gate no marca
// `nē` como agramatical en una consecutiva. Lo que enseña es la tendencia,
// que es del 90 %.
import atestacion from '../../lib/data/languages/la/atestacion-ut.json';
import { palabrasDesconocidas } from './gate-vocabulario-del-marco';
import { revisarCobertura, type Cobertura } from './cobertura';
import { separablePorPosicion } from './atajos';
import { patronDe } from './orden-publicado';

const AT = atestacion as {
  adverbiales: { conAnticipador: { ne: number; utNon: number; ut: number }; sinAnticipador: { ne: number; utNon: number; ut: number } };
};

export type ValorDeUt = 'consecutiva' | 'final';
/** Los tres que entraron a `INDECLINABLES_L1` el 2026-09-12 porque sin
 *  ellos este punto no se podía escribir. */
export const ANTICIPADORES_DEL_LOTE = ['tam', 'ita', 'sīc'] as const;

export interface ItemUtConsec {
  id: string;
  punto: string;
  valor: ValorDeUt;
  /** El anticipador de la principal, o `null` si no lo hay. */
  anticipador: string | null;
  negada: boolean;
  /** La frase latina entera: aquí no hay hueco, el hueco va en la glosa. */
  latin: string;
  /** La glosa española con `___` donde va el giro. */
  glosa: string;
  /** El giro español: «que vence», «para que venza»… */
  respuesta: string;
  ejes: { valor: ValorDeUt; conAnticipador: boolean; negada: boolean };
}

export type ClaseFalloUtConsec =
  | 'giro-no-corresponde' | 'eje-mal-declarado' | 'anticipador-no-esta'
  | 'conjuncion-mal' | 'glosa-sin-hueco' | 'glosa-regala-la-respuesta'
  | 'latin-fuera-de-l1' | 'latin-sin-ut' | 'varia-incompleto'
  | 'cobertura-cero' | 'cobertura-sin-motivo' | 'estrategia-ciega' | 'orden-publicado';

export interface FalloUtConsec { item: string; clase: ClaseFalloUtConsec; detalle: string }

const norm = (s: string) => s.normalize('NFD').replace(/[̄̆]/g, '').normalize('NFC').toLowerCase().trim();

/** El giro español que le toca a cada valor. La consecutiva va en
 *  INDICATIVO, que es la mitad de la trampa. */
export function giroQueToca(item: ItemUtConsec): RegExp {
  return item.valor === 'consecutiva'
    ? (item.negada ? /^que no\b/ : /^que\b/)
    : (item.negada ? /^para que no\b/ : /^para que\b/);
}

/** CIEGA 1 · contestar siempre el mismo valor. */
export function siempreConsecutiva(item: ItemUtConsec): boolean {
  return item.valor === 'consecutiva';
}

/** CIEGA 2 · el reflejo del anticipador. Devuelve el valor que la regla
 *  predice; su denominador son las CONSECUTIVAS, que es donde puede fallar. */
export function porElAnticipador(item: ItemUtConsec): ValorDeUt {
  return item.anticipador === null ? 'final' : 'consecutiva';
}

export function revisarItemUtConsec(item: ItemUtConsec): FalloUtConsec[] {
  const out: FalloUtConsec[] = [];
  const push = (clase: ClaseFalloUtConsec, detalle: string) => out.push({ item: item.id, clase, detalle });

  if (!giroQueToca(item).test(norm(item.respuesta)))
    push('giro-no-corresponde', `el ítem es ${item.valor}${item.negada ? ' negativa' : ''} y la respuesta «${item.respuesta}» no empieza por el giro que toca`);
  if (item.ejes.valor !== item.valor || item.ejes.conAnticipador !== (item.anticipador !== null) || item.ejes.negada !== item.negada)
    push('eje-mal-declarado', `los ejes no dicen lo que el ítem es`);

  if (item.anticipador !== null && !norm(item.latin).split(/\s+/).includes(norm(item.anticipador)))
    push('anticipador-no-esta', `declara el anticipador «${item.anticipador}» y la frase no lo lleva`);
  if (item.anticipador === null && ANTICIPADORES_DEL_LOTE.some((a) => norm(item.latin).split(/\s+/).includes(norm(a))))
    push('anticipador-no-esta', 'declara que no hay anticipador y la frase lleva uno');

  // LA CONJUNCIÓN NEGATIVA: `ut nōn` en la consecutiva, `nē` en la final.
  // Es la excepción del punto y va al revés en cada uno.
  if (item.negada) {
    const esperada = item.valor === 'consecutiva' ? 'ut nōn' : 'nē';
    if (!norm(item.latin).includes(norm(esperada)))
      push('conjuncion-mal', `una ${item.valor} negativa lleva «${esperada}» y la frase no lo trae`);
  }
  // `\b` de JavaScript es ASCII: `\bnē\b` NO casa nunca con «nē», porque la
  // `ē` no es carácter de palabra y el límite de después no existe. Es el
  // mismo fallo que el gate de variante del portugués ya tuvo con `ônibus`,
  // y lo he vuelto a escribir hoy. La forma que sirve lleva `\p{L}` y `u`.
  if (!/(?<!\p{L})(ut|nē)(?!\p{L})/iu.test(item.latin))
    push('latin-sin-ut', 'la frase no lleva `ut` ni `nē`');

  if (!item.glosa.includes('___')) push('glosa-sin-hueco', 'la glosa española no tiene hueco `___`');
  if (norm(item.glosa).includes(norm(item.respuesta))) push('glosa-regala-la-respuesta', `la glosa contiene «${item.respuesta}»`);
  const d = palabrasDesconocidas(item.latin);
  if (d.length > 0) push('latin-fuera-de-l1', `la frase usa palabras que la máquina de L1 no produce: ${d.join(', ')}`);
  return out;
}

export function tasasCiegasUtConsec(items: ItemUtConsec[]) {
  const cons = items.filter((i) => i.valor === 'consecutiva');
  const mayoria = Math.max(cons.length, items.length - cons.length);
  // RECALL, no acierto: el reflejo sólo puede fallar en las consecutivas.
  const cazadas = cons.filter((i) => porElAnticipador(i) === 'consecutiva').length;
  return {
    siempreElMismoValor: { tasa: items.length === 0 ? 0 : mayoria / items.length, decididos: items.length, total: items.length },
    reflejoDelAnticipador: { tasa: cons.length === 0 ? 0 : cazadas / cons.length, decididos: cons.length, total: items.length },
  };
}

export function coberturaUtConsec(items: ItemUtConsec[]): Cobertura[] {
  const n = items.length;
  const cons = items.filter((i) => i.valor === 'consecutiva');
  return [
    { comprobacion: 'el giro español corresponde al valor',
      decididos: items.filter((i) => giroQueToca(i).test(norm(i.respuesta))).length, total: n },
    { comprobacion: 'los dos valores del mismo `ut`', decididos: new Set(items.map((i) => i.valor)).size, total: 2 },
    { comprobacion: 'consecutivas SIN anticipador, que es lo que el varia exige',
      decididos: cons.filter((i) => i.anticipador === null).length, total: cons.length,
      motivoDeLosQueQuedanFuera: 'las que lo llevan se resuelven por el reflejo y no examinan el valor: están para enseñar la pista, no para medirla' },
    { comprobacion: 'los anticipadores distintos',
      decididos: new Set(cons.map((i) => i.anticipador).filter((a) => a !== null)).size, total: ANTICIPADORES_DEL_LOTE.length,
      motivoDeLosQueQuedanFuera: '`adeō` (×7), `tālis` (×16) y `tot` (×9) son raros en el corpus y no entraron al léxico; `tantus` declina y meterlo es otra decisión' },
    { comprobacion: 'la negativa de cada valor, que van al revés',
      decididos: items.filter((i) => i.negada).length, total: n,
      motivoDeLosQueQuedanFuera: 'la positiva es la mayoritaria y es la que instala el contraste de valor; la negativa existe para el cruce `ut nōn` / `nē`, y con una de cada basta' },
  ];
}

export function revisarLoteUtConsec(items: ItemUtConsec[]): FalloUtConsec[] {
  const out: FalloUtConsec[] = items.flatMap(revisarItemUtConsec);
  for (const c of revisarCobertura(coberturaUtConsec(items)))
    out.push({ item: c.item, clase: c.clase, detalle: c.detalle });

  if (new Set(items.map((i) => i.valor)).size < 2)
    out.push({ item: '(lote)', clase: 'varia-incompleto',
      detalle: 'el punto es que el MISMO `ut` vale dos cosas, y el lote sólo trae una: sin el contraste no hay trampa que desmontar' });
  const cons = items.filter((i) => i.valor === 'consecutiva');
  if (cons.length > 0 && cons.every((i) => i.anticipador !== null))
    out.push({ item: '(lote)', clase: 'varia-incompleto',
      detalle: 'todas las consecutivas llevan anticipador: el lote entero se resuelve por el reflejo, que es justo lo que el varia prohíbe' });

  const t = tasasCiegasUtConsec(items);
  if (t.siempreElMismoValor.tasa > 0.6)
    out.push({ item: '(lote)', clase: 'estrategia-ciega',
      detalle: `«contestar siempre el mismo valor» acierta el ${(100 * t.siempreElMismoValor.tasa).toFixed(0)} % de los ${t.siempreElMismoValor.decididos} ítems` });
  if (t.reflejoDelAnticipador.decididos > 0 && t.reflejoDelAnticipador.tasa > 0.6)
    out.push({ item: '(lote)', clase: 'estrategia-ciega',
      detalle: `el reflejo del anticipador caza el ${(100 * t.reflejoDelAnticipador.tasa).toFixed(0)} % de las ${t.reflejoDelAnticipador.decididos} consecutivas: faltan consecutivas sin pista` });

  for (const p of [separablePorPosicion(patronDe(items, (i) => i.valor === 'consecutiva')),
                   separablePorPosicion(patronDe(items, (i) => i.anticipador !== null))])
    if (p) out.push({ item: '(lote)', clase: 'orden-publicado', detalle: `se separa por la posición: ${p}` });
  return out;
}

export const LO_QUE_DICE_EL_CORPUS_CONSEC = {
  neConAnticipador: AT.adverbiales.conAnticipador.ne,
  utNonConAnticipador: AT.adverbiales.conAnticipador.utNon,
  utConAnticipador: AT.adverbiales.conAnticipador.ut,
  utSinAnticipador: AT.adverbiales.sinAnticipador.ut,
};

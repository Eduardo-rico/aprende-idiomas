// scripts/lib/gate-deponentes.ts — LA MISMA FORMA, EL SENTIDO CONTRARIO.
//
// Punto `l6-deponentes`. «sequor, loquor, ūtor, morior, patior, hortor. Se
// leen en activo aunque parezcan pasivos.» `motivo`: «la lectura pasiva da
// una frase coherente y falsa: “hostēs sequuntur” leído en pasiva es “los
// enemigos son seguidos” y significa lo contrario». `clase: trampa`,
// `formato: cloze-en-glosa`, `via: recepcion`.
//
// ══ POR QUÉ LA MITAD DEL LOTE NO ES DEPONENTE ═══════════════════════
//
// `sequitur` y `vocātur` son morfológicamente IDÉNTICOS: misma desinencia,
// mismo tiempo, misma voz aparente. Lo único que los separa es el lema.
//
// Si los catorce ítems fueran deponentes, «leer todo `-tur` en activo» los
// acertaría todos y el lote instalaría una regla nueva y falsa —la
// contraria de la que quita—. Es el mismo pozo de `l7-no-coincide-espanol`
// (§5.quateretvicies del relevo): con dos salidas, las dos lecturas son
// complementarias y sus tasas suman uno, así que la única manera de que
// ninguna gane es siete y siete.
//
// Lo que el lote enseña, entonces, no es «los -tur son activos» sino **que
// la forma no lo dice y el lema sí**.
//
// ══ EL PERFECTO ES EL MISMO QUE EL DE LA PASIVA PERIFRÁSTICA ════════
//
// `locūtus est` ×35 y `amātus est` son la misma construcción y significan lo
// contrario: «habló» y «fue amado». Los dos puntos comparten las formas y
// discrepan en el sentido, y el lote de `l6-pasiva-perifrastica` tuvo que
// dejar fuera precisamente éstas.
//
// ══ EL ERROR DIANA SE DECLARA, NO SE MIDE ═══════════════════════════
//
// Por ítem, en `elErrorDiana`: la lectura equivocada nunca es la respuesta,
// así que medirla como tasa daría cero sin poder dar otra cosa. Lo que sí se
// comprueba es que difiere de la respuesta y que la glosa no la regala.
import { DEPONENTES_L1 } from '../../lib/data/languages/la/deponentes';
import { palabrasDesconocidas } from './gate-vocabulario-del-marco';
import { revisarCobertura, type Cobertura } from './cobertura';
import { separablePorPosicion } from './atajos';
import { patronDe } from './orden-publicado';

export type Lectura = 'activa' | 'pasiva';
export type Rige = 'acusativo' | 'ablativo' | 'ninguno';

const LEMAS_DEPONENTES = new Set(DEPONENTES_L1.map((d) => d.lema));

export interface ItemDeponente {
  id: string;
  punto: string;
  /** El lema del verbo de la frase: `sequor` o `vocō`. */
  lema: string;
  /** La forma que aparece, que es la que engaña: `sequitur`, `vocātur`. */
  forma: string;
  /** Lo que el verbo rige, que es el `varia`: `ūtor` pide ablativo. */
  rige: Rige;
  latin: string;
  /** La glosa española con `___`. */
  glosa: string;
  /** La respuesta: activa si es deponente, pasiva si no. */
  respuesta: string;
  /** La lectura equivocada. Va escrita porque medirla daría cero. */
  elErrorDiana: string;
  ejes: { esDeponente: boolean; rige: Rige };
}

export type ClaseFalloDeponente =
  | 'deponente-mal-declarado' | 'forma-no-esta-en-la-frase' | 'eje-mal-declarado'
  | 'error-diana-igual-a-la-respuesta' | 'glosa-sin-hueco' | 'glosa-regala-la-respuesta'
  | 'glosa-regala-el-error' | 'latin-fuera-de-l1' | 'forma-sin-marca-pasiva'
  | 'varia-incompleto' | 'cobertura-cero' | 'cobertura-sin-motivo'
  | 'estrategia-ciega' | 'orden-publicado';

export interface FalloDeponente { item: string; clase: ClaseFalloDeponente; detalle: string }

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').normalize('NFC').toLowerCase().trim();

/** SEGUNDO CAMINO: el lema está o no está en `DEPONENTES_L1`, que es una
 *  lista del módulo y no de este gate. */
export function esDeponente(lema: string): boolean {
  return LEMAS_DEPONENTES.has(lema);
}

/** Las desinencias que hacen que la forma PAREZCA pasiva. Si la forma del
 *  ítem no las lleva, el ítem no examina nada: la trampa es que se parecen. */
export const MARCA_PASIVA = /(?:or|ris|re|tur|mur|min[īi]|ntur)$/;

/** CIEGA · leer todo lo que acaba en `-tur` como activo (o como pasivo: son
 *  complementarias y por eso el listón es el equilibrio). */
export function leerTodoComo(item: ItemDeponente, l: Lectura): boolean {
  return (l === 'activa') === item.ejes.esDeponente;
}

export function revisarItemDeponente(item: ItemDeponente): FalloDeponente[] {
  const out: FalloDeponente[] = [];
  const push = (clase: ClaseFalloDeponente, detalle: string) => out.push({ item: item.id, clase, detalle });

  if (esDeponente(item.lema) !== item.ejes.esDeponente)
    push('deponente-mal-declarado', `«${item.lema}» ${esDeponente(item.lema) ? 'SÍ' : 'NO'} está en DEPONENTES_L1 y el eje dice lo contrario`);
  if (item.ejes.rige !== item.rige)
    push('eje-mal-declarado', 'los ejes no dicen lo que el ítem es');

  const palabras = norm(item.latin).replace(/[.,?]/g, '').split(/\s+/);
  if (!palabras.includes(norm(item.forma)))
    push('forma-no-esta-en-la-frase', `declara «${item.forma}» y la frase no la lleva`);
  // LA TRAMPA ES QUE SE PARECEN: una forma sin marca pasiva no engaña a
  // nadie y el ítem no examina el punto.
  else if (!MARCA_PASIVA.test(norm(item.forma)))
    push('forma-sin-marca-pasiva', `«${item.forma}» no acaba en desinencia pasiva: sin esa marca no hay trampa que desmontar`);

  if (norm(item.elErrorDiana) === norm(item.respuesta))
    push('error-diana-igual-a-la-respuesta', `«${item.respuesta}» y el error diana son la misma frase`);

  if (!item.glosa.includes('___')) push('glosa-sin-hueco', 'la glosa española no tiene hueco `___`');
  if (norm(item.glosa).includes(norm(item.respuesta))) push('glosa-regala-la-respuesta', `la glosa contiene «${item.respuesta}»`);
  if (norm(item.glosa).includes(norm(item.elErrorDiana))) push('glosa-regala-el-error', `la glosa contiene el error diana «${item.elErrorDiana}»`);
  const d = palabrasDesconocidas(item.latin);
  if (d.length > 0) push('latin-fuera-de-l1', `la frase usa palabras que la máquina de L1 no produce: ${d.join(', ')}`);
  return out;
}

export function tasasCiegasDeponente(items: ItemDeponente[]) {
  const act = items.filter((i) => leerTodoComo(i, 'activa')).length;
  return {
    todoEnActivo: { tasa: items.length === 0 ? 0 : act / items.length, decididos: items.length, total: items.length },
    todoEnPasivo: { tasa: items.length === 0 ? 0 : (items.length - act) / items.length, decididos: items.length, total: items.length },
  };
}

export function coberturaDeponente(items: ItemDeponente[]): Cobertura[] {
  const n = items.length;
  const dep = items.filter((i) => i.ejes.esDeponente);
  return [
    { comprobacion: 'el deponente contra la lista del módulo',
      decididos: items.filter((i) => esDeponente(i.lema) === i.ejes.esDeponente).length, total: n },
    { comprobacion: 'la forma lleva marca pasiva, que es lo que engaña',
      decididos: items.filter((i) => MARCA_PASIVA.test(norm(i.forma))).length, total: n },
    { comprobacion: 'los NO deponentes, sin los que el lote instala la regla contraria',
      decididos: items.filter((i) => !i.ejes.esDeponente).length, total: n,
      motivoDeLosQueQuedanFuera: 'con dos lecturas, activa y pasiva son complementarias: la mitad tiene que ser de cada una o una de las dos gana el lote entero' },
    { comprobacion: 'el deponente que rige ABLATIVO, que es el varia',
      decididos: dep.filter((i) => i.rige === 'ablativo').length, total: dep.length,
      motivoDeLosQueQuedanFuera: 'de los ocho deponentes de L1 sólo `ūtor` rige ablativo; los demás llevan acusativo y son el caso general' },
    { comprobacion: 'lemas deponentes distintos', decididos: new Set(dep.map((i) => i.lema)).size, total: dep.length,
      motivoDeLosQueQuedanFuera: 'no es cobertura sino variedad léxica: el punto dice «de alta frecuencia» y repetir lema mide una palabra dos veces' },
  ];
}

export function revisarLoteDeponente(items: ItemDeponente[]): FalloDeponente[] {
  const out: FalloDeponente[] = items.flatMap(revisarItemDeponente);
  for (const c of revisarCobertura(coberturaDeponente(items)))
    out.push({ item: c.item, clase: c.clase, detalle: c.detalle });

  const dep = items.filter((i) => i.ejes.esDeponente);
  if (dep.length > 0 && !dep.some((i) => i.rige === 'ablativo'))
    out.push({ item: '(lote)', clase: 'varia-incompleto',
      detalle: 'el varia es si el deponente rige acusativo o ablativo, y no hay ninguno de ablativo: `ūtor` es «otra trampa dentro de la misma» y sin él no está' });

  const t = tasasCiegasDeponente(items);
  for (const [nombre, tasa] of [['leerlo todo en activo', t.todoEnActivo.tasa], ['leerlo todo en pasivo', t.todoEnPasivo.tasa]] as const)
    if (tasa > 0.6)
      out.push({ item: '(lote)', clase: 'estrategia-ciega',
        detalle: `«${nombre}» acierta el ${(100 * tasa).toFixed(0)} % de los ${items.length} ítems: el lote instala una regla en vez de quitarla` });

  const p = separablePorPosicion(patronDe(items, (i) => i.ejes.esDeponente));
  if (p) out.push({ item: '(lote)', clase: 'orden-publicado', detalle: `el deponente se separa por la posición: ${p}` });
  return out;
}

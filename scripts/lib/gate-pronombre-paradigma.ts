// scripts/lib/gate-pronombre-paradigma.ts
//
// GATE DE PARADIGMA PRONOMINAL. Sirve a `l4-is-ea-id` y a `l4-demostrativos`,
// que examinan lo mismo con series distintas: producir la forma que toca a una
// celda, sabiendo que algunas celdas no distinguen lo que el punto declara.
//
// Uno solo para los dos a propósito: una regla copiada se desincroniza en la
// copia N+1 que nadie añadió, y en este repositorio ya ha pasado dos veces.
//
// ── LA POLÍTICA DEL MACRÓN, APLICADA AQUÍ POR PRIMERA VEZ ────────────
//
// Decidida el 2026-09-09 después de medir que el corpus del alumno tiene CERO
// macrones en 227.301 tokens: **el marco se presenta sin macrones y la
// versión con ellos va en la respuesta.** Se lee como se lee, y la cantidad
// se aprende al corregir. El gate lo comprueba en los dos sentidos, porque
// una política que no se comprueba dura hasta el siguiente lote.
import {
  PRONOMBRES_L1, paradigmaPronombre, declinarPronombre, CASOS_DE_PRONOMBRE,
  comoElCorpus, type GeneroPron, type EntradaPronombre,
} from '../../lib/data/languages/la/pronombres-la';
import type { Caso, Numero } from '../../lib/data/languages/la/paradigma-la';
import { separablePorPosicion } from './atajos';
import { revisarCobertura, type Cobertura } from './cobertura';

const GENEROS: GeneroPron[] = ['m', 'f', 'n'];
const NUMEROS: Numero[] = ['sg', 'pl'];

export type Eje = 'genero' | 'numero' | 'caso' | 'grado';

// ── EL EJE QUE SÓLO TIENE UNO DE LOS DOS PUNTOS ──────────────────────
//
// `l4-demostrativos` examina «el grado y el caso»; `l4-is-ea-id` no tiene
// grado porque no tiene serie que elegir. El grado no se mide moviendo un
// rasgo de la tabla —está entre series, no dentro de una—, así que se decide
// de otra manera y conviene que esté escrito:
//
//     el grado lo REGALA la glosa cuando dice «este», «ese» o «aquel»,
//     porque el español tiene los tres y transfieren limpiamente;
//     y sólo se EXAMINA cuando la glosa no lo da.
//
// Eso es exactamente lo que el punto declara al ser `falso-regalo`: en la
// Vulgata «ille» e «ipse» ya no son deícticos sino el pronombre de tercera
// persona —«at ille» abre 117 frases del corpus—, así que la glosa dice «él»
// y el instinto español que busca «aquel» produce una lectura coherente y
// falsa. Un ítem que sólo traiga deixis clásica enseña el regalo y no mide
// el falso regalo, que es el punto entero.

/** Qué ejes distingue una celda: se mueve UN rasgo y se mira si la forma
 *  cambia.
 *
 *  LÍMITE DECLARADO, y no es pequeño: mueve un eje CADA VEZ, así que no ve
 *  las ambigüedades en diagonal. `ea` es a la vez `f.nom.sg`, `n.nom.pl` y
 *  `n.ac.pl`, y esta función dice que distingue los tres ejes — porque para
 *  llegar de una celda a la otra hay que mover género Y número a la vez.
 *
 *  Para un lote de PRODUCCIÓN da igual: al alumno se le da la celda y produce
 *  la forma, así que la ambigüedad de lectura no le afecta. Para un lote de
 *  RECEPCIÓN esto sería un agujero, y quien lo escriba tiene que saberlo. */
export function ejesQueDistingue(e: EntradaPronombre, g: GeneroPron, caso: Caso, num: Numero): Eje[] {
  const p = paradigmaPronombre(e);
  const f = p[`${g}.${caso}.${num}`];
  const out: Eje[] = [];
  if (!GENEROS.some((g2) => g2 !== g && p[`${g2}.${caso}.${num}`] === f)) out.push('genero');
  if (!NUMEROS.some((n2) => n2 !== num && p[`${g}.${caso}.${n2}`] === f)) out.push('numero');
  if (!CASOS_DE_PRONOMBRE.some((c2) => c2 !== caso && p[`${g}.${c2}.${num}`] === f)) out.push('caso');
  return out;
}

export interface ItemPronombre {
  id: string;
  punto: string;
  /** Qué serie. `is`, `hic`, `ille`, `iste`… */
  lema: string;
  genero: GeneroPron;
  caso: Caso;
  numero: Numero;
  /** El marco latino SIN macrones, con `___`. Es como el alumno lo leerá. */
  marco: string;
  /** La forma, CON macrones: se produce con cantidad, que es como se aprende. */
  respuesta: string;
  glosa: string;
  pista: string;
  ejes: {
    /** Qué ejes se acredita el ítem. Escrito a mano y contrastado contra
     *  `ejesQueDistingue`: derivarlo dejaría el gate recomputándose a sí
     *  mismo. */
    examina: Eje[];
    /** Obligatorio cuando la celda no distingue algún eje. */
    porQueNoLosOtros?: string;
    /** Declarado sólo cuando el instinto español produce una lectura
     *  coherente Y FALSA. Es lo que convierte el punto en falso regalo y lo
     *  que el gate exige que el lote traiga. */
    elInstintoFalla?: { motivo: string };
  };
}

export type ClaseFalloPron =
  | 'respuesta-no-derivada'
  | 'eje-que-la-celda-no-distingue'
  | 'silencio-sobre-los-otros-ejes'
  | 'macron-en-el-marco'
  | 'respuesta-sin-cantidad'
  | 'eje-sin-cubrir'
  | 'sin-instinto-que-falle'
  | 'grado-mal-acreditado'
  | 'sincretismo-sin-cubrir'
  | 'estrategia-constante'
  | 'orden-separable'
  | 'cobertura-cero'
  | 'cobertura-sin-motivo';

export interface FalloPron { item: string; clase: ClaseFalloPron; detalle: string }

const MACRON = /[āēīōūĀĒĪŌŪ]/;
const serie = (lema: string) => {
  const e = PRONOMBRES_L1.find((x) => x.lema === lema);
  if (!e) throw new Error(`no hay serie pronominal «${lema}»`);
  return e;
};

export function revisarItemPronombre(it: ItemPronombre): FalloPron[] {
  const out: FalloPron[] = [];
  const push = (clase: ClaseFalloPron, detalle: string) => out.push({ item: it.id, clase, detalle });
  const e = serie(it.lema);

  const dela = declinarPronombre(e, it.genero, it.caso, it.numero);
  if (dela.normalize('NFC') !== it.respuesta.normalize('NFC'))
    push('respuesta-no-derivada', `la tabla da «${dela}» y el ítem escribe «${it.respuesta}»`);

  if (!it.marco.includes('___')) push('respuesta-no-derivada', 'el marco no tiene hueco');

  // ── LA POLÍTICA DEL MACRÓN, EN LOS DOS SENTIDOS ──
  if (MACRON.test(it.marco))
    push('macron-en-el-marco',
      `«${it.marco}» lleva macrón: el alumno leerá 227.301 tokens sin ninguno, así que el marco se presenta como el texto real`);
  // La respuesta lleva cantidad SI la forma la tiene. `is` y `eum` no llevan,
  // y exigírselo sería inventar una marca.
  if (MACRON.test(dela) && !MACRON.test(it.respuesta))
    push('respuesta-sin-cantidad', `«${dela}» lleva cantidad y la respuesta del ítem la ha perdido`);

  // El grado no sale de la tabla: se acredita si y sólo si la glosa NO lo ha
  // dado ya, y eso lo declara `elInstintoFalla`.
  if (it.ejes.examina.includes('grado') && !it.ejes.elInstintoFalla)
    push('grado-mal-acreditado',
      'se acredita el grado con una glosa que dice «este», «ese» o «aquel»: el español los tiene los tres y transfieren, así que ahí el grado es regalo y no examen');
  if (it.ejes.elInstintoFalla && !it.ejes.examina.includes('grado'))
    push('grado-mal-acreditado', 'declara que el instinto falla y no se acredita el grado, que es lo que entonces mide');

  const distingue = [...ejesQueDistingue(e, it.genero, it.caso, it.numero), 'grado' as Eje];
  for (const x of it.ejes.examina)
    if (!distingue.includes(x))
      push('eje-que-la-celda-no-distingue',
        `se acredita «${x}» pero «${it.respuesta}» (${it.genero}.${it.caso}.${it.numero} de ${it.lema}) no lo distingue: la misma forma vale para otro valor de ese eje`);

  const faltan = (['genero', 'numero', 'caso'] as Eje[]).filter((x) => !it.ejes.examina.includes(x));
  if (faltan.length > 0 && !it.ejes.porQueNoLosOtros)
    push('silencio-sobre-los-otros-ejes', `no examina «${faltan.join(', ')}» y no dice por qué`);

  return out;
}

export function revisarLotePronombre(items: ItemPronombre[], opciones: {
  /** Las formas sincréticas que el `varia` del punto obliga a traer. */
  sincretismosExigidos: string[];
  /** Para los puntos declarados `falso-regalo`: el lote TIENE que traer
   *  ítems donde el instinto español produzca una lectura coherente y falsa.
   *  Sin ellos el lote enseña el regalo y no mide el falso regalo. */
  exigeInstintoQueFalle?: boolean;
}): { fallos: FalloPron[]; cobertura: Cobertura[] } {
  const fallos = items.flatMap(revisarItemPronombre);
  const push = (clase: ClaseFalloPron, detalle: string) => fallos.push({ item: '(lote)', clase, detalle });

  for (const x of ['genero', 'numero', 'caso'] as Eje[])
    if (!items.some((it) => it.ejes.examina.includes(x)))
      push('eje-sin-cubrir', `ningún ítem examina «${x}»`);

  if (opciones.exigeInstintoQueFalle && !items.some((it) => it.ejes.elInstintoFalla))
    push('sin-instinto-que-falle',
      'el punto está declarado `falso-regalo` y ningún ítem trae el caso donde el instinto español produce una lectura coherente y falsa: así el lote enseña el regalo y no mide nada');

  for (const f of opciones.sincretismosExigidos)
    if (!items.some((it) => comoElCorpus(it.respuesta) === comoElCorpus(f)))
      push('sincretismo-sin-cubrir',
        `el punto declara examinar «${f}» —la forma que colapsa lo que el alumno cree distinto— y el lote no la trae`);

  const cuenta = new Map<string, number>();
  for (const it of items) cuenta.set(comoElCorpus(it.respuesta), (cuenta.get(comoElCorpus(it.respuesta)) ?? 0) + 1);
  const max = Math.max(...cuenta.values());
  if (max / items.length > 0.34)
    push('estrategia-constante',
      `una sola forma resuelve ${max} de ${items.length} ítems: el lote se contesta repitiéndola`);

  const sep = separablePorPosicion(items.map((it) => (it.numero === 'sg' ? 'A' : 'B')).join(''));
  if (sep) push('orden-separable', sep);

  const distinguenTodo = items.filter(
    (it) => ejesQueDistingue(serie(it.lema), it.genero, it.caso, it.numero).length === 3).length;
  const instinto = items.filter((it) => it.ejes.elInstintoFalla).length;
  const cobertura: Cobertura[] = [
    { comprobacion: 'la respuesta contra la tabla', decididos: items.length, total: items.length },
    ...(opciones.exigeInstintoQueFalle ? [{
      comprobacion: 'ítems donde el instinto falla', decididos: instinto, total: items.length,
      motivoDeLosQueQuedanFuera: 'los de deixis clásica, donde «este/ese/aquel» transfiere limpiamente. Hacen falta como contraste, pero no miden el punto: lo mide el otro grupo',
    }] : []),
    { comprobacion: 'la política del macrón', decididos: items.length, total: items.length },
    { comprobacion: 'celdas que distinguen los tres ejes', decididos: distinguenTodo, total: items.length,
      motivoDeLosQueQuedanFuera: 'las celdas sincréticas, que el punto trae A PROPÓSITO: «eius» sirviendo para los tres géneros es lo que el varia declara examinar, así que no son ítems flojos sino el contenido' },
  ];
  fallos.push(...revisarCobertura(cobertura));
  return { fallos, cobertura };
}

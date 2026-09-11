// scripts/lib/gate-funcion-caso.ts
//
// GATE DE «QUÉ FUNCIÓN HACE ESTA FORMA». Sirve a los cuatro puntos de
// función del bloque 3 —`l3-nominativo`, `l3-acusativo-od`,
// `l3-genitivo-posesivo` y `l3-dativo-ci`—, que examinan lo mismo con casos
// distintos: leer una forma y decir qué papel juega.
//
// Uno para los cuatro por lo de siempre: cuatro copias de la misma regla
// fallan en la que nadie actualizó.
//
// ── EL EJE QUE SE PUEDE CONTAR ───────────────────────────────────────
//
// El `varia` de `l3-dativo-ci` dice «la declinación del sustantivo, porque
// el sincretismo del dativo cambia con ella». Eso es contable, y contado
// sale graduado de verdad:
//
//     1.ª  puellae   3 colisiones — gen.sg, nom.pl, voc.pl
//     2.ª  servō     1 colisión   — abl.sg
//     5.ª  reī       1 colisión   — gen.sg
//     3.ª  rēgī      0 dentro de su paradigma…
//     4.ª  manuī     0
//
// …pero `rēgī` cruza de declinación: un `-ī` se lee como genitivo de 2.ª
// (`servī`), y ésa es una colisión que ningún paradigma aislado enseña. Por
// eso hay dos cuentas y las dos van declaradas: la de DENTRO del paradigma y
// la de FUERA.
//
// Un lote que no recorra ese rango mide un solo grado de ambigüedad y su
// `varia` es decorativo — igual que pasaba con la opacidad de la 3.ª.
import {
  paradigmaNominal, declinacionDe,
  type EntradaNominal, type Caso, type Numero,
} from '../../lib/data/languages/la/paradigma-la';
import { separablePorPosicion } from './atajos';
import { revisarCobertura, type Cobertura } from './cobertura';

export type Funcion = 'sujeto' | 'objeto-directo' | 'posesor' | 'destinatario' | 'atributo';

/** El caso que corresponde a cada función. Escrito una vez para que ningún
 *  lote pueda declarar un dativo llamándolo objeto directo. */
export const CASO_DE_LA_FUNCION: Record<Funcion, Caso> = {
  sujeto: 'nom', atributo: 'nom', 'objeto-directo': 'ac', posesor: 'gen', destinatario: 'dat',
};

/** Colisiones DENTRO del paradigma: otras celdas del mismo lema con la misma
 *  forma escrita. */
export function colisionesDentro(e: EntradaNominal, caso: Caso, num: Numero): string[] {
  const p = paradigmaNominal(e);
  const mia = p[`${caso}.${num}`]!.normalize('NFC');
  return Object.entries(p)
    .filter(([k, v]) => k !== `${caso}.${num}` && v.normalize('NFC') === mia)
    .map(([k]) => k);
}

/** Colisiones FUERA: otros lemas del lexicón cuya forma coincide con ésta en
 *  otra celda. Es lo que ningún paradigma aislado enseña —`rēgī` leído como
 *  el genitivo de `servī`— y por eso se busca contra el lexicón entero. */
export function colisionesFuera(
  e: EntradaNominal, caso: Caso, num: Numero, lexicon: EntradaNominal[],
): string[] {
  const mia = paradigmaNominal(e)[`${caso}.${num}`]!.normalize('NFC');
  const fin = (s: string) => s.replace(/^.*?(?=[aeiouāēīōū]*$)/, '');
  const desinencia = mia.slice(-2);
  const out: string[] = [];
  for (const otro of lexicon) {
    if (otro.lema === e.lema) continue;
    for (const [k, v] of Object.entries(paradigmaNominal(otro))) {
      if (k === `${caso}.${num}`) continue;
      if (v.normalize('NFC').endsWith(desinencia) && v.length > 2 && desinencia.length === 2)
        out.push(`${otro.lema}.${k}`);
    }
  }
  void fin;
  return out;
}

export interface ItemFuncionCaso {
  id: string;
  punto: string;
  entrada: EntradaNominal;
  funcion: Funcion;
  numero: Numero;
  /** El marco latino SIN macrones, con la forma dentro. */
  marco: string;
  /** La forma que el alumno tiene que interpretar. */
  forma: string;
  glosa: string;
  respuesta: string;
  /** LAS OTRAS TRADUCCIONES CORRECTAS, y no son un adorno.
   *
   *  El latín NO TIENE ARTÍCULO —lo enseña el primer objetivo del bloque
   *  2— así que «rosam» es «la rosa», «una rosa» o «rosa», y una clave
   *  única suspende a quien escribe la otra. El latinista adversarial
   *  aplazó por esto los ocho lotes de hueco-en-la-glosa el 2026-09-10:
   *  sus claves eran únicas y `alternatives` iba vacío, y cada fallo falso
   *  entra en el FSRS.
   *
   *  El gate de abajo lo EXIGE cuando la respuesta empieza por
   *  determinante. No se deriva en el publicador a propósito: el
   *  determinante no es la única fuente de alternativa —«a la madre» /
   *  «a su madre», «él» / «ella» cuando el verbo no marca género— y
   *  derivar sólo la mecánica daría la falsa impresión de estar cubierto. */
  alternativas?: string[];
  ejes: {
    /** Cuántas otras celdas del MISMO paradigma comparten esta forma.
     *  Escrito a mano y contrastado contra el cálculo. */
    colisiones: number;
    /** Obligatorio cuando la forma cruza de declinación: hay que decir con
     *  qué se confunde, porque ningún paradigma aislado lo enseña. */
    cruzaDeDeclinacion?: string;
    /** Para `l3-genitivo-posesivo`: dónde va el genitivo respecto a su
     *  núcleo. El español pospone SIEMPRE, así que el instinto acierta el
     *  76 % del corpus —medido— y sólo se estrella con los antepuestos. */
    posicion?: 'antes' | 'despues';
    /** Y lo que convierte un genitivo antepuesto en trampa de verdad: que su
     *  forma sea además un nominativo plural, de modo que la lectura falsa
     *  sea COHERENTE y no sólo rara. `puellae`, `servī` y `manūs` lo son. */
    pareceNominativo?: string;
    /** Para `l3-nominativo`: cuántos nominativos hay en la frase. Con DOS
     *  —«Caesar imperātor est»— ninguna desinencia dice cuál es el sujeto, y
     *  sólo queda el orden o la semántica.
     *
     *  Medido: 1.208 frases copulativas de este tipo en el corpus, con el
     *  sujeto delante en el 80,6 %. O sea que el orden acierta cuatro de
     *  cada cinco en el texto real, y un lote equilibrado lo baja al 50 %
     *  — que es propiedad DEL LOTE y no de la lengua. */
    cuantosNominativos?: 1 | 2;
    /** Con dos nominativos, dónde va el sujeto. */
    sujetoDelante?: boolean;
    /** Para `l3-acusativo-od`: si el objeto es animado. El español marca el
     *  objeto con «a» SÓLO cuando es animado y determinado, así que con un
     *  objeto inanimado la traducción no lleva ninguna marca y el alumno se
     *  queda con la posición. Es donde la transferencia se acaba. */
    objetoAnimado?: boolean;
    /** Y si el verbo rige DOS acusativos. Medido: sólo 7 frases en los
     *  227.301 tokens del corpus, así que el eje existe pero es raro y el
     *  lote lo declara en vez de fingir que es corriente. */
    dobleAcusativo?: string;
  };
}

export type ClaseFalloFC =
  | 'forma-no-derivada' | 'caso-no-cuadra-con-la-funcion' | 'macron-en-el-marco'
  | 'colisiones-mal-contadas' | 'rango-plano' | 'funcion-constante'
  | 'orden-separable' | 'cobertura-cero' | 'cobertura-sin-motivo'
  | 'determinante-sin-alternativa' | 'eje-sin-cubrir';

export interface FalloFC { item: string; clase: ClaseFalloFC; detalle: string }

const MACRON = /[āēīōūĀĒĪŌŪ]/;
// Sin cantidad y sin mayúscula: el marco capitaliza su primera palabra, y
// un genitivo antepuesto ES la primera palabra. Comparar respetando el caso
// hacía fallar los seis ítems antepuestos de `l3-genitivo-posesivo` — o sea,
// justo la mitad que el punto examina.
const sinM = (s: string) =>
  s.normalize('NFD').replace(/[̄̆]/g, '').normalize('NFC').toLowerCase();

/** Las parejas definido/indefinido del español, de la más larga a la más
 *  corta para que «de la» gane a «la». */
const PAREJAS: readonly (readonly [string, string])[] = [
  ['de las', 'de unas'], ['de los', 'de unos'], ['de la', 'de una'],
  ['a las', 'a unas'], ['a los', 'a unos'], ['a la', 'a una'],
  ['del', 'de un'], ['al', 'a un'],
  ['las', 'unas'], ['los', 'unos'], ['la', 'una'], ['el', 'un'],
];

/** Devuelve la lectura que FALTA, o `null` si la clave no lleva
 *  determinante o su pareja ya está aceptada. */
export function determinanteSinPareja(respuesta: string, alternativas: readonly string[]): string | null {
  const r = respuesta.trim();
  const bajo = r.toLowerCase();
  for (const [def, indef] of PAREJAS) {
    for (const [a, b] of [[def, indef], [indef, def]] as const) {
      if (!bajo.startsWith(`${a} `) && bajo !== a) continue;
      const esperada = (b + r.slice(a.length)).trim();
      const ya = alternativas.some((x) => x.trim().toLowerCase() === esperada.toLowerCase());
      return ya ? null : esperada;
    }
  }
  return null;
}

/** Rellena la alternativa del DETERMINANTE, que es la única familia
 *  mecánica de las tres. Las otras dos —el posesivo («a la madre» / «a su
 *  madre») y el género que el verbo no marca («él» / «ella»)— hay que
 *  escribirlas a mano, y por eso este helper NO cierra el campo: sólo
 *  quita de en medio lo que sí se deriva. */
export function conAlternativaDeDeterminante<T extends { respuesta: string; alternativas?: string[] }>(it: T): T {
  const falta = determinanteSinPareja(it.respuesta, it.alternativas ?? []);
  return falta ? { ...it, alternativas: [...(it.alternativas ?? []), falta] } : it;
}

export function revisarItemFuncionCaso(it: ItemFuncionCaso): FalloFC[] {
  const out: FalloFC[] = [];
  const push = (clase: ClaseFalloFC, detalle: string) => out.push({ item: it.id, clase, detalle });

  const caso = CASO_DE_LA_FUNCION[it.funcion];
  const dela = paradigmaNominal(it.entrada)[`${caso}.${it.numero}`]!;
  if (dela.normalize('NFC') !== it.forma.normalize('NFC'))
    push('forma-no-derivada', `la función «${it.funcion}» pide ${caso}.${it.numero}, que da «${dela}», y el ítem trae «${it.forma}»`);

  if (MACRON.test(it.marco)) push('macron-en-el-marco', `«${it.marco}» lleva macrón`);
  if (!sinM(it.marco).includes(sinM(it.forma)))
    push('forma-no-derivada', `«${it.forma}» no aparece en el marco`);
  if (!it.glosa.includes('___')) push('forma-no-derivada', 'la glosa no tiene hueco');

  // EL DETERMINANTE: si la clave lleva uno, la otra opción tiene que estar
  // aceptada. El latín no tiene artículo y el alumno no puede adivinar cuál
  // quiso el autor.
  const falta = determinanteSinPareja(it.respuesta, it.alternativas ?? []);
  if (falta) push('determinante-sin-alternativa',
    `la clave «${it.respuesta}» empieza por determinante y falta la otra lectura: «${falta}». El latín no tiene artículo`);

  const reales = colisionesDentro(it.entrada, caso, it.numero);
  if (reales.length !== it.ejes.colisiones)
    push('colisiones-mal-contadas',
      `el ítem declara ${it.ejes.colisiones} y «${it.forma}» comparte forma con ${reales.length}: ${reales.join(', ') || 'ninguna'}`);

  return out;
}

export function revisarLoteFuncionCaso(items: ItemFuncionCaso[], opciones: {
  /** El tope de ambigüedad que el lote tiene que recorrer. Sólo se
   *  comprueba con el eje `declinacion`. */
  colisionesMinimas: number;
  colisionesMaximas: number;
  /** QUÉ VARÍA EN ESTE LOTE, y por qué el campo existe.
   *
   *  Los cuatro puntos de `l3` varían la DECLINACIÓN, porque su `varia`
   *  dice que el sincretismo cambia con ella; de ahí las dos
   *  comprobaciones por defecto (rango de colisiones y ≥3 declinaciones).
   *
   *  `l2-primera` varía la FUNCIÓN: es una sola declinación con el
   *  sincretismo CONSTANTE —«-ae» es genitivo, dativo y nominativo plural
   *  a la vez— y su `varia` dice literalmente «cuál de las tres funciones
   *  exige el contexto, y hay que cubrir las tres». Aplicarle el eje de
   *  `l3` lo suspendería por «3 colisiones en los doce» y por «una sola
   *  declinación», que son justo sus dos rasgos definitorios. Un gate que
   *  marca lo correcto no lo lee nadie. */
  ejeDeVarianza?: 'declinacion' | 'funcion';
}): { fallos: FalloFC[]; cobertura: Cobertura[] } {
  const fallos = items.flatMap(revisarItemFuncionCaso);
  const push = (clase: ClaseFalloFC, detalle: string) => fallos.push({ item: '(lote)', clase, detalle });
  const n = items.length || 1;

  const eje = opciones.ejeDeVarianza ?? 'declinacion';
  if (eje === 'declinacion') {
    const cs = items.map((it) => it.ejes.colisiones);
    if (Math.min(...cs) > opciones.colisionesMinimas || Math.max(...cs) < opciones.colisionesMaximas)
      push('rango-plano',
        `el lote va de ${Math.min(...cs)} a ${Math.max(...cs)} colisiones y el punto pide de ${opciones.colisionesMinimas} a ${opciones.colisionesMaximas}: sin los dos extremos mide un solo grado de ambigüedad`);

    const decl = new Set(items.map((it) => declinacionDe(it.entrada)));
    if (decl.size < 3)
      push('rango-plano', `${decl.size} declinaciones distintas: el varia dice que el sincretismo cambia con ella, así que hacen falta varias`);
  } else {
    // Eje FUNCIÓN: lo que tiene que estar cubierto son las tres lecturas
    // que la misma forma admite. Si falta una, el lote enseña que «-ae» es
    // dos cosas cuando son tres.
    for (const f of ['posesor', 'destinatario', 'sujeto'] as const)
      if (!items.some((it) => it.funcion === f))
        push('eje-sin-cubrir', `ninguna item con función «${f}»: el sincretismo de «-ae» tiene TRES lecturas y el lote cubre ${new Set(items.map((i) => i.funcion)).size}`);
    // Y la ambigüedad tiene que ser real en todos: un ítem cuya forma no
    // colisiona no examina el sincretismo, examina otra cosa.
    for (const it of items)
      if (it.ejes.colisiones === 0)
        push('eje-sin-cubrir', `${it.id}: su forma no colisiona con ninguna otra celda, así que no examina el sincretismo`);
  }

  const porFuncion = new Map<Funcion, number>();
  for (const it of items) porFuncion.set(it.funcion, (porFuncion.get(it.funcion) ?? 0) + 1);
  const max = Math.max(...porFuncion.values());
  if (porFuncion.size > 1 && max / n > 0.6)
    push('funcion-constante', `una función sale en ${max} de ${n} ítems: contestarla siempre resuelve el lote`);

  // Con dos nominativos no hay desinencia que decida, así que el lote tiene
  // que equilibrar el orden o el instinto —«el primero es el sujeto»— lo
  // resuelve entero. En el texto real ese instinto acierta el 80,6 %.
  if (items.some((it) => it.ejes.cuantosNominativos === 2)) {
    const dos = items.filter((it) => it.ejes.cuantosNominativos === 2);
    const delante = dos.filter((it) => it.ejes.sujetoDelante).length;
    if (!items.some((it) => it.ejes.cuantosNominativos === 1))
      push('rango-plano', 'ningún ítem tiene UN solo nominativo: falta el caso donde la desinencia sí resuelve');
    if (dos.length > 0 && Math.abs(delante / dos.length - 0.5) > 0.2)
      push('funcion-constante',
        `de ${dos.length} ítems con dos nominativos, el sujeto va delante en ${delante}: contestar «el primero es el sujeto» saca el ${(100 * Math.max(delante, dos.length - delante) / dos.length).toFixed(0)} %`);
  }

  // El español marca el objeto con «a» sólo si es animado: sin las dos
  // clases, el lote no examina dónde se acaba la transferencia.
  if (items.some((it) => it.ejes.objetoAnimado !== undefined)) {
    for (const v of [true, false])
      if (!items.some((it) => it.ejes.objetoAnimado === v))
        push('rango-plano',
          `ningún objeto ${v ? 'animado' : 'inanimado'}: el español pone «a» sólo con los animados, y sin las dos clases no se ve dónde deja de ayudar`);
  }

  // Si el lote declara posiciones, tiene que traer las dos: uno todo
  // pospuesto lo resuelve el instinto español sin leer una desinencia.
  if (items.some((it) => it.ejes.posicion)) {
    for (const pos of ['antes', 'despues'] as const)
      if (!items.some((it) => it.ejes.posicion === pos))
        push('rango-plano',
          `ningún genitivo va «${pos}» de su núcleo: el español pospone siempre, así que un lote de una sola posición no examina nada`);
    const antes = items.filter((it) => it.ejes.posicion === 'antes').length;
    if (Math.abs(antes / n - 0.5) > 0.17)
      push('funcion-constante',
        `${antes} de ${n} antepuestos: el instinto español —posponer siempre— saca el ${(100 * Math.max(antes, n - antes) / n).toFixed(0)} %`);
  }

  const sep = separablePorPosicion(items.map((it) =>
    (it.ejes.posicion ? (it.ejes.posicion === 'antes' ? 'A' : 'B') : (it.ejes.colisiones > 0 ? 'A' : 'B'))).join(''));
  if (sep) push('orden-separable', sep);

  const ambiguos = items.filter((it) => it.ejes.colisiones > 0).length;
  const cruzan = items.filter((it) => it.ejes.cruzaDeDeclinacion).length;
  const trampas = items.filter((it) => it.ejes.posicion === 'antes' && it.ejes.pareceNominativo).length;
  const cobertura: Cobertura[] = [
    { comprobacion: 'la forma contra la máquina', decididos: items.length, total: items.length },
    { comprobacion: 'formas ambiguas dentro de su paradigma', decididos: ambiguos, total: items.length,
      motivoDeLosQueQuedanFuera: 'las que no comparten forma con ninguna otra celda del mismo lema. Hacen falta como extremo limpio del eje, pero en ellas la desinencia decide sola',
      elCeroEsUnResultado: undefined },
    { comprobacion: 'formas que cruzan de declinación', decididos: cruzan, total: items.length,
      motivoDeLosQueQuedanFuera: 'las que sólo colisionan dentro de su propio paradigma. El cruce es lo que ningún paradigma aislado enseña —«rēgī» leído como el genitivo de «servī»— y por eso se cuenta aparte',
      elCeroEsUnResultado: 'un lote puede no traer ninguna forma que cruce, y eso es una elección legítima: el cruce es un extremo del eje, no un requisito' },
    ...(items.some((it) => it.ejes.objetoAnimado !== undefined) ? [{
      comprobacion: 'objetos donde el español NO pone marca', decididos:
        items.filter((it) => it.ejes.objetoAnimado === false).length, total: items.length,
      motivoDeLosQueQuedanFuera: 'los animados, donde el español pone «a» y el alumno tiene una marca a la que agarrarse. En los inanimados no hay ninguna: sólo la desinencia latina y la posición',
      elCeroEsUnResultado: undefined,
    }] : []),
    ...(items.some((it) => it.ejes.cuantosNominativos) ? [{
      comprobacion: 'frases donde la desinencia NO decide', decididos:
        items.filter((it) => it.ejes.cuantosNominativos === 2).length, total: items.length,
      motivoDeLosQueQuedanFuera: 'las de un solo nominativo, donde el caso dice cuál es el sujeto sin más. Las de dos son las que el punto examina: los dos van en nominativo y sólo queda el orden o el sentido',
      elCeroEsUnResultado: undefined,
    }] : []),
    ...(items.some((it) => it.ejes.posicion) ? [{
      comprobacion: 'genitivos antepuestos que parecen sujeto', decididos: trampas, total: items.length,
      motivoDeLosQueQuedanFuera: 'los pospuestos, y los antepuestos cuya forma no coincide con ningún nominativo. Este renglón cuenta los ítems donde la lectura falsa es COHERENTE —«puerī liber» leído como «los niños [son] libres»— y no sólo rara, que es donde el punto muerde de verdad',
      elCeroEsUnResultado: undefined,
    }] : []),
  ];
  fallos.push(...revisarCobertura(cobertura));
  return { fallos, cobertura };
}

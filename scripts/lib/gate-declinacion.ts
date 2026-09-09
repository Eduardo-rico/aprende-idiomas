// scripts/lib/gate-declinacion.ts
//
// GATE DE DECLINACIÓN NOMINAL. Sirve a `l2-cuarta`, `l2-quinta`,
// `l2-tercera-consonante` y `l2-tercera-i`: los cuatro examinan producir la
// forma de una celda a partir de la entrada de lexicón (lema + genitivo).
//
// Uno para los cuatro, por lo de siempre: una regla copiada cuatro veces
// falla en la copia que nadie actualizó.
//
// ── LO QUE ESTE GATE MIDE Y NINGÚN OTRO MEDÍA ────────────────────────
//
// **Cuántas celdas colapsan al quitar el macrón**, que es como el alumno va
// a leer el latín. No es un detalle de estas cuatro declinaciones: es LA
// propiedad de la 4.ª.
//
//     manus (4.ª)    «manus» cubre nom.sg, gen.sg, voc.sg, nom.pl, ac.pl y
//                    voc.pl — SEIS celdas en una sola forma escrita
//     servus (2.ª)   no pierde ninguna
//     rēx (3.ª)      no pierde ninguna
//     puella (1.ª)   pierde una (puella / puellā)
//     diēs (5.ª)     no pierde ninguna
//
// Producir con cantidad es legítimo y es lo que estos puntos examinan. Pero
// un ítem que se apoye en la cantidad para hacer DISTINGUIR dos celdas está
// apoyándose en una marca que el texto no trae, y eso el gate lo dice.
import {
  paradigmaNominal, declinar, declinacionDe, variantesDe,
  type EntradaNominal, type Caso, type Numero, type Declinacion,
} from '../../lib/data/languages/la/paradigma-la';
import { separablePorPosicion } from './atajos';
import { revisarCobertura, type Cobertura } from './cobertura';

const sinCantidad = (s: string) => s.normalize('NFD').replace(/[̄̆]/g, '').normalize('NFC');

// ── DOS PREGUNTAS DISTINTAS QUE UNA SOLA FUNCIÓN CONFUNDÍA ───────────
//
// La primera versión devolvía «las celdas que se escriben igual sin macrón»
// y con eso pretendía medir lo que la cantidad separa. Mezclaba dos cosas:
//
//   · `rēs` es nom.sg, nom.pl y ac.pl **con macrón y sin él**. Eso es
//     sincretismo de la lengua y no tiene nada que ver con la cantidad.
//   · `manus` y `manūs` son distintas CON macrón e iguales sin él. Eso sí es
//     lo que el texto pierde.
//
// Mezcladas, la 5.ª salía con 9 de 12 «colapsos» y parecía tan mala como la
// 4.ª, cuando no pierde ni una celda por cantidad. Un sello responde a UNA
// pregunta; usarlo para otra fabrica un hallazgo que no existe.

/** Sincretismo puro: celdas que ya comparten forma CON la cantidad puesta.
 *  Es propiedad del paradigma y el macrón no lo arregla ni lo empeora. */
export function celdasSincreticas(e: EntradaNominal, caso: Caso, num: Numero): string[] {
  const p = paradigmaNominal(e);
  const mia = p[`${caso}.${num}`]!.normalize('NFC');
  return Object.entries(p)
    .filter(([k, v]) => k !== `${caso}.${num}` && v.normalize('NFC') === mia)
    .map(([k]) => k);
}

/** Lo que SÓLO la cantidad separaba: celdas distintas con macrón e idénticas
 *  sin él. Es exactamente lo que el alumno pierde al leer un texto real, y
 *  es la propiedad de la 4.ª. */
export function celdasQueSoloElMacronSepara(e: EntradaNominal, caso: Caso, num: Numero): string[] {
  const p = paradigmaNominal(e);
  const mia = p[`${caso}.${num}`]!.normalize('NFC');
  return Object.entries(p)
    .filter(([k, v]) => k !== `${caso}.${num}`
      && v.normalize('NFC') !== mia
      && sinCantidad(v) === sinCantidad(mia))
    .map(([k]) => k);
}

// ── EL EJE DE `l2-tercera-consonante`, QUE ES MEDIBLE ────────────────
//
// Su `varia` dice «cuánto cambia el tema respecto al nominativo, de nada
// (cōnsul) a mucho (iter/itiner-)». Eso no hay que juzgarlo: se cuenta.
// Prefijo común entre nominativo y tema, y lo que sobra por cada lado.
//
//     timor / timōris    tema timōr     coste 0   ← el tema ES el nominativo
//     urbs  / urbis      tema urb       coste 1
//     rēx   / rēgis      tema rēg       coste 2
//     homō  / hominis    tema homin     coste 3
//     tempus/ temporis   tema tempor    coste 4
//
// Un lote que no recorra el eje mide un solo grado de opacidad y su `varia`
// es decorativa.
export function distanciaDelTema(e: EntradaNominal): number {
  const a = sinCantidad(e.lema).toLowerCase();
  const tema = sinCantidad(e.genitivo).toLowerCase().replace(/is$/, '');
  let i = 0;
  while (i < a.length && i < tema.length && a[i] === tema[i]) i++;
  return (a.length - i) + (tema.length - i);
}

/** Las tres marcas del tema en `-i`, tal como el punto las enumera. */
export type MarcaI = 'gen-pl-ium' | 'abl-sg-i' | 'nom-pl-ia' | 'ac-pl-is';

/** Qué marcas muestra DE VERDAD una FORMA concreta. Se calcula sobre la
 *  forma y no sobre la celda, y eso no es un detalle:
 *
 *  la primera versión miraba sólo la celda, así que aprobaba un ítem que
 *  decía enseñar el acusativo en `-īs` **y respondía «partēs»** — la forma
 *  mayoritaria, que es justo la que NO tiene la marca. El ítem era latín
 *  correcto, estaba bien declarado y enseñaba lo contrario de lo que decía.
 *
 *  Con la forma delante, «partīs» muestra la marca y «partēs» no. */
export function marcasQueMuestra(e: EntradaNominal, caso: Caso, num: Numero, forma: string): MarcaI[] {
  if (!e.iStem) return [];
  const f = forma.normalize('NFC');
  const out: MarcaI[] = [];
  if (caso === 'gen' && num === 'pl' && f.endsWith('ium')) out.push('gen-pl-ium');
  if (caso === 'abl' && num === 'sg' && e.genero === 'n' && /ī$/.test(f)) out.push('abl-sg-i');
  if (caso === 'nom' && num === 'pl' && e.genero === 'n' && f.endsWith('ia')) out.push('nom-pl-ia');
  if (caso === 'ac' && num === 'pl' && e.genero !== 'n' && /īs$/.test(f)) out.push('ac-pl-is');
  return out;
}

export interface ItemDeclinacion {
  id: string;
  punto: string;
  entrada: EntradaNominal;
  caso: Caso;
  numero: Numero;
  /** El marco SIN macrones. */
  marco: string;
  /** La forma CON cantidad: es lo que el punto examina producir. */
  respuesta: string;
  glosa: string;
  pista: string;
  ejes: {
    /** La declinación que el ítem ejercita. Escrita a mano y contrastada
     *  contra `declinacionDe`, que la calcula desde el genitivo. */
    declinacion: Declinacion;
    /** Obligatorio cuando la celda colapsa con otras al perder el macrón:
     *  hay que decir con cuáles y que se sabe. */
    colapsaAlLeer?: string;
    /** Sólo para `l2-tercera-i`: qué marca del tema en `-i` enseña este
     *  ítem. Escrita a mano y contrastada contra `marcasQueMuestra`. */
    marcaI?: MarcaI;
  };
}

export type ClaseFalloDecl =
  | 'respuesta-no-derivada'
  | 'declinacion-mal-declarada'
  | 'macron-en-el-marco'
  | 'colapso-no-declarado'
  | 'colapso-declarado-de-mas'
  | 'celda-sin-cubrir'
  | 'marca-i-mal-declarada'
  | 'eje-de-opacidad-plano'
  | 'marca-i-sin-cubrir'
  | 'lema-repetido'
  | 'orden-separable'
  | 'cobertura-cero'
  | 'cobertura-sin-motivo';

export interface FalloDecl { item: string; clase: ClaseFalloDecl; detalle: string }

const MACRON = /[āēīōūĀĒĪŌŪ]/;

export function revisarItemDeclinacion(it: ItemDeclinacion): FalloDecl[] {
  const out: FalloDecl[] = [];
  const push = (clase: ClaseFalloDecl, detalle: string) => out.push({ item: it.id, clase, detalle });

  // Se admite CUALQUIERA de las variantes atestiguadas, no sólo la
  // mayoritaria: «partēs» y «partīs» son las dos latín y el punto de los
  // temas en `-i` necesita la segunda para cubrir su varia.
  const variantes = variantesDe(it.entrada, it.caso, it.numero).map((x) => x.normalize('NFC'));
  if (!variantes.includes(it.respuesta.normalize('NFC')))
    push('respuesta-no-derivada',
      `la máquina da ${variantes.map((v) => `«${v}»`).join(' o ')} y el ítem escribe «${it.respuesta}»`);

  if (!it.marco.includes('___')) push('respuesta-no-derivada', 'el marco no tiene hueco');
  if (MACRON.test(it.marco))
    push('macron-en-el-marco', `«${it.marco}» lleva macrón y el texto que el alumno leerá no trae ninguno`);

  const real = declinacionDe(it.entrada);
  if (real !== it.ejes.declinacion)
    push('declinacion-mal-declarada',
      `el ítem dice ${it.ejes.declinacion} y el genitivo «${it.entrada.genitivo}» da ${real}`);

  if (it.ejes.marcaI) {
    const muestra = marcasQueMuestra(it.entrada, it.caso, it.numero, it.respuesta);
    if (!muestra.includes(it.ejes.marcaI))
      push('marca-i-mal-declarada',
        `dice enseñar «${it.ejes.marcaI}» y «${it.respuesta}» (${it.caso}.${it.numero} de ${it.entrada.lema}) no la muestra: las marcas del tema en -i no salen todas en cada lema`);
  }

  const colapsan = celdasQueSoloElMacronSepara(it.entrada, it.caso, it.numero);
  if (colapsan.length > 0 && !it.ejes.colapsaAlLeer)
    push('colapso-no-declarado',
      `«${it.respuesta}» se escribe igual que ${colapsan.join(', ')} cuando se le quita el macrón, y el ítem no lo dice: el alumno que lea esa forma en un texto no podrá saber cuál es`);
  if (colapsan.length === 0 && it.ejes.colapsaAlLeer)
    push('colapso-declarado-de-mas',
      `declara un colapso y «${it.respuesta}» no comparte forma escrita con ninguna otra celda`);

  return out;
}

export function revisarLoteDeclinacion(items: ItemDeclinacion[], opciones: {
  /** Las celdas que el punto obliga a cubrir, como `gen.sg`. */
  celdasExigidas: string[];
  /** Cuántos lemas distintos como mínimo: ocho ítems del mismo lema son uno
   *  repetido ocho veces. */
  lemasMinimos: number;
  /** Para `l2-tercera-consonante`: el lote tiene que recorrer el eje de
   *  opacidad, de un tema que ES el nominativo a uno que se aleja mucho. */
  exigeRecorrerLaOpacidad?: boolean;
  /** Para `l2-tercera-i`: las marcas que el `varia` obliga a traer. */
  marcasExigidas?: MarcaI[];
}): { fallos: FalloDecl[]; cobertura: Cobertura[] } {
  const fallos = items.flatMap(revisarItemDeclinacion);
  const push = (clase: ClaseFalloDecl, detalle: string) => fallos.push({ item: '(lote)', clase, detalle });

  for (const c of opciones.celdasExigidas)
    if (!items.some((it) => `${it.caso}.${it.numero}` === c))
      push('celda-sin-cubrir', `el punto exige «${c}» y el lote no lo trae`);

  const lemas = new Set(items.map((it) => it.entrada.lema));
  if (lemas.size < opciones.lemasMinimos)
    push('lema-repetido',
      `${lemas.size} lemas distintos para ${items.length} ítems: por debajo de los ${opciones.lemasMinimos} que pide el punto, el lote mide un paradigma y no una declinación`);

  if (opciones.exigeRecorrerLaOpacidad) {
    const ds = items.map((it) => distanciaDelTema(it.entrada));
    const min = Math.min(...ds), max = Math.max(...ds);
    if (min > 0 || max < 3)
      push('eje-de-opacidad-plano',
        `el lote va de ${min} a ${max} en distancia del tema al nominativo, y el varia pide «de nada a mucho»: sin un lema cuyo tema SEA el nominativo y otro que se aleje de verdad, el eje es decorativo`);
  }

  for (const m of opciones.marcasExigidas ?? [])
    if (!items.some((it) => it.ejes.marcaI === m))
      push('marca-i-sin-cubrir', `el varia enumera «${m}» y ningún ítem la enseña`);

  const sep = separablePorPosicion(items.map((it) => (it.numero === 'sg' ? 'A' : 'B')).join(''));
  if (sep) push('orden-separable', sep);

  const colapsados = items.filter(
    (it) => celdasQueSoloElMacronSepara(it.entrada, it.caso, it.numero).length > 0).length;
  const cobertura: Cobertura[] = [
    { comprobacion: 'la respuesta contra la máquina', decididos: items.length, total: items.length },
    { comprobacion: 'la declinación contra el genitivo', decididos: items.length, total: items.length },
    { comprobacion: 'celdas que SÓLO el macrón separa', decididos: colapsados, total: items.length,
      motivoDeLosQueQuedanFuera: 'las celdas que el texto real distingue igual. Este renglón NO cuenta el sincretismo de siempre —«rēs» es nom.sg y ac.pl con macrón y sin él—, sólo lo que la cantidad separaba y la escritura pierde: es la propiedad de la 4.ª, y la 5.ª no lo tiene',
      elCeroEsUnResultado: 'un cero aquí NO es un gate que calla: es el hallazgo. Significa que esta declinación no pierde ni una celda al escribirse sin cantidad, que es justo lo que separa a la 5.ª de la 4.ª' },
  ];
  fallos.push(...revisarCobertura(cobertura));
  return { fallos, cobertura };
}

// lib/data/languages/la/lotes/l11-preposiciones-caso.ts
//
// `l11-preposiciones-caso` — «in urbem» (hacia la ciudad) frente a «in
// urbe» (en la ciudad).
//
//     SEIS PARES, 12 ÍTEMS. Cada par es la misma frase con el nombre en
//     acusativo y en ablativo; la glosa es IDÉNTICA y el hueco va delante
//     del lugar:
//
//       Servi in agros currunt.   «Los esclavos corren ___ campos.»   a los
//       Servi in agris currunt.   «Los esclavos corren ___ campos.»   en los
//
// ── LO QUE REGALA EL ESPAÑOL, Y DÓNDE SE CONSTRUYE EL CONTRASTE ──────
//
// §D3 antes de escribir: en el latín real el VERBO suele decidir —«venit
// in urbem», «manet in urbe»— y el español sabe leer eso sin latín. Por eso
// los seis pares llevan el MISMO verbo en los dos lados, y sólo dos verbos
// en todo el lote: `ambulō` y `currō`, los de movimiento SIN rumbo, donde
// las dos lecturas son naturales —«caminar hacia la ciudad» y «caminar por
// la ciudad»—. La primera versión traía `fugiō`, `portō`, `dūcō` y `vocō`,
// y el lingüista dio por forzados los ablativos de dos de ellos («huir en
// los montes» es `per montēs` en latín). Y la glosa es la misma, carácter
// a carácter: cualquier ruta que lea el español —la que tumbó el lote
// retirado de `l3-ablativo-agente`, 10 de 12— contesta igual en los dos.
//
// ── LO QUE TRAE EL PORTUGUÉS (§D1) ───────────────────────────────────
//
// El alumno tiene portugués C2, y el portugués de Brasil coloquial usa
// «em» también para la dirección («fui na praia»). Es el mismo calco que
// «in ⇒ en», reforzado. No es un defecto del lote: es la dificultad, y la
// lección tiene que nombrarla.

// ── LOS PLURALES, que es lo que impide aprender «-m = dirección» ─────
//
// En singular el acusativo acaba en `-m` y el ablativo no, y un lote de
// singulares enseñaría ESO en vez del caso. Tres pares van en plural
// (`agrōs`, `montēs`, `castra`), donde el acusativo no lleva `-m`.
//
// ── Y LO QUE NO ENTRA ────────────────────────────────────────────────
//
// `sub` y `super`: en su sentido LOCAL el español dice «bajo» y «sobre» en
// los dos casos, así que el hueco no puede examinarlos; y `super` va con
// acusativo diez veces más que con ablativo. El motivo, con sus cifras, lo
// escribe el gate desde el sello (`motivoDeLasOtrasPreposiciones`).
//
// El marco va sin cantidad y `latinConCantidad` lleva la versión que se
// enseña al corregir.
import type { Articulo, ItemPrepCaso } from '../../../../../scripts/lib/gate-preposiciones-caso';
import { aceptadasDe } from '../../../../../scripts/lib/gate-preposiciones-caso';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import type { Numero } from '../paradigma-la';

/** Buscada contra tres condiciones: el detector de posición, que los dos
 *  ítems de un par no salgan seguidos y el piso de distancia 3 de
 *  `coste-del-par.ts`. */
export const SEMILLA_DE_ORDEN = 7;

type Par = {
  id: string;
  /** `[[]]` es el nombre. */
  marco: string; marcoConCantidad: string;
  verbo: ItemPrepCaso['verbo'];
  lema: string; numero: Numero; enEspanol: string; articulo: Articulo;
  ac: string; acConCantidad: string; abl: string; ablConCantidad: string;
  glosa: string;
};

const PARES: Par[] = [
  { id: 'urbs', marco: 'Discipuli in [[]] ambulant.', marcoConCantidad: 'Discipulī in [[]] ambulant.',
    verbo: { forma: 'ambulant', lema: 'ambulō', infinitivoEs: 'caminar', enEspanol: 'caminan' },
    lema: 'urbs', numero: 'sg', enEspanol: 'ciudad', articulo: 'la',
    ac: 'urbem', acConCantidad: 'urbem', abl: 'urbe', ablConCantidad: 'urbe',
    glosa: 'Los discípulos caminan ___ ciudad.' },

  // `via` es «la calle» y no «el camino»: «correr al camino» no se dice.
  { id: 'via', marco: 'Pueri in [[]] currunt.', marcoConCantidad: 'Puerī in [[]] currunt.',
    verbo: { forma: 'currunt', lema: 'currō', infinitivoEs: 'correr', enEspanol: 'corren' },
    lema: 'via', numero: 'sg', enEspanol: 'calle', articulo: 'la',
    ac: 'viam', acConCantidad: 'viam', abl: 'via', ablConCantidad: 'viā',
    glosa: 'Los niños corren ___ calle.' },

  // «post haec ambulabat Iesus in Galilaeam» (Juan 7, en el treebank): el
  // mismo verbo con un lugar en acusativo, en la Vulgata.
  { id: 'desertum', marco: 'Iesus in [[]] ambulat.', marcoConCantidad: 'Iēsus in [[]] ambulat.',
    verbo: { forma: 'ambulat', lema: 'ambulō', infinitivoEs: 'caminar', enEspanol: 'camina' },
    lema: 'dēsertum', numero: 'sg', enEspanol: 'desierto', articulo: 'el',
    ac: 'desertum', acConCantidad: 'dēsertum', abl: 'deserto', ablConCantidad: 'dēsertō',
    glosa: 'Jesús camina ___ desierto.' },

  { id: 'ager', marco: 'Servi in [[]] currunt.', marcoConCantidad: 'Servī in [[]] currunt.',
    verbo: { forma: 'currunt', lema: 'currō', infinitivoEs: 'correr', enEspanol: 'corren' },
    lema: 'ager', numero: 'pl', enEspanol: 'campos', articulo: 'los',
    ac: 'agros', acConCantidad: 'agrōs', abl: 'agris', ablConCantidad: 'agrīs',
    glosa: 'Los esclavos corren ___ campos.' },

  { id: 'mons', marco: 'Agricolae in [[]] ambulant.', marcoConCantidad: 'Agricolae in [[]] ambulant.',
    verbo: { forma: 'ambulant', lema: 'ambulō', infinitivoEs: 'caminar', enEspanol: 'caminan' },
    lema: 'mōns', numero: 'pl', enEspanol: 'montes', articulo: 'los',
    ac: 'montes', acConCantidad: 'montēs', abl: 'montibus', ablConCantidad: 'montibus',
    glosa: 'Los campesinos caminan ___ montes.' },

  // `castra` es plural en latín y «el campamento» singular en español: el
  // número del artículo lo pone el español, no el latín. Y el verbo es
  // intransitivo a propósito: con un objeto al lado —la primera versión
  // decía «Dux milites in castris vocat»— «in castris» se leía como parte
  // del objeto, «los soldados DEL campamento», que es una respuesta
  // correcta que el gate suspendía (§D8; lo vio el lingüista).
  { id: 'castra', marco: 'Milites in [[]] currunt.', marcoConCantidad: 'Mīlitēs in [[]] currunt.',
    verbo: { forma: 'currunt', lema: 'currō', infinitivoEs: 'correr', enEspanol: 'corren' },
    lema: 'castra', numero: 'pl', enEspanol: 'campamento', articulo: 'el',
    ac: 'castra', acConCantidad: 'castra', abl: 'castris', ablConCantidad: 'castrīs',
    glosa: 'Los soldados corren ___ campamento.' },
];

function itemsDe(p: Par): ItemPrepCaso[] {
  const dir = aceptadasDe('direccion', p.articulo);
  const sit = aceptadasDe('situacion', p.articulo);
  const comun = { punto: 'l11-preposiciones-caso', pareja: p.id, verbo: p.verbo, glosa: p.glosa, articulo: p.articulo };
  return [
    { ...comun, id: `${p.id}-d`, lado: 'direccion',
      latin: p.marco.replace('[[]]', p.ac), latinConCantidad: p.marcoConCantidad.replace('[[]]', p.acConCantidad),
      nombre: { lema: p.lema, caso: 'ac', numero: p.numero, enEspanol: p.enEspanol },
      respuesta: dir[0]!, aceptadas: dir, elErrorDiana: sit[0]! },
    { ...comun, id: `${p.id}-s`, lado: 'situacion',
      latin: p.marco.replace('[[]]', p.abl), latinConCantidad: p.marcoConCantidad.replace('[[]]', p.ablConCantidad),
      nombre: { lema: p.lema, caso: 'abl', numero: p.numero, enEspanol: p.enEspanol },
      respuesta: sit[0]!, aceptadas: sit, elErrorDiana: dir[0]! },
  ];
}

export const FUENTE_PREPOSICIONES_CASO: ItemPrepCaso[] = PARES.flatMap(itemsDe);

// El `id` no puede cantar el lado: se numera por el orden publicado.
export const LOTE_PREPOSICIONES_CASO: ItemPrepCaso[] = ordenPublicado(FUENTE_PREPOSICIONES_CASO, SEMILLA_DE_ORDEN)
  .map((i, k) => ({ ...i, id: `la-pc-${String(k + 1).padStart(2, '0')}` }));

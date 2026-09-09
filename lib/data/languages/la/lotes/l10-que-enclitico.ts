// lib/data/languages/la/lotes/l10-que-enclitico.ts
//
// PRIMER LOTE DEL `-que` ENCLÍTICO. Punto: `l10-que-enclitico`.
//
// «"senātus populusque" — la conjunción va pegada a la SEGUNDA palabra, no
// entre las dos.» `varia`: **si la palabra con `-que` es reconocible sin él
// o no**.
//
// ── LO QUE EL CORPUS ENSEÑA Y NADIE ESPERA ───────────────────────────
//
// El treebank separa el enclítico de verdad —2.007 tokens con lema `que`—,
// así que **todo lo que queda acabado en `-que` en el flujo de tokens es
// palabra entera**. Y son muchas y muy frecuentes:
//
//     atque 462 · itaque 170 · ūsque 151 · quoque 95 · quīnque 80 ·
//     quīcumque 52 · quaecumque 44 · quisque 37 · utique 32 ·
//     ūnusquisque 32 · neque 29 · plērumque 27 · undique 23 · dēnique 20
//
// `quīnque` es «cinco», `ūsque` es «hasta», `quoque` es «también». Ninguna
// se parte. Un alumno que haya aprendido «`-que` significa "y" y va pegado»
// las partirá todas y sacará `quīn`, `ūs`, `quo` — basura.
//
// O sea que la regla del punto es **más peligrosa que útil si se enseña
// sola**, y su `varia` lo dice: lo que hay que saber no es que el `-que`
// existe, sino cuándo NO está.
//
// ── EL CRITERIO ES EL MISMO QUE USA EL PARTIDOR ──────────────────────
//
// `separarEnclitico` ya lo resuelve así, y el lote usa exactamente ese
// criterio: se parte si la palabra entera NO existe y la base sí. Con
// «populusque» la entera no existe y «populus» sí → se parte. Con «quīnque»
// la entera existe → no se toca.
//
// Que el ítem y el gate compartan criterio no es circular aquí: el partidor
// se comprueba contra la lista de palabras que NO llevan enclítico, que está
// escrita a mano desde el corpus, y el lote se comprueba contra el partidor.
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';

export interface ItemQue {
  id: string;
  punto: string;
  /** La palabra tal como aparece en el texto. */
  palabra: string;
  glosa: string;
  /** Lo que hay que contestar: las partes, o la palabra entera. */
  respuesta: string[];
  ejes: {
    /** ¿Lleva enclítico de verdad? */
    lleva: boolean;
    /** Cuando no lo lleva, qué es en realidad. Obligatorio: es lo que
     *  impide que el alumno la parta. */
    queEsEnRealidad?: string;
    /** Cuántas veces sale en el corpus, para las que no lo llevan: son
     *  frecuentes y por eso hacen daño. */
    frecuencia?: number;
  };
}

type Def = [id: string, palabra: string, glosa: string, resp: string[], queEs?: string, frec?: number];

const DEFS: Def[] = [
  // ── SÍ LLEVAN ENCLÍTICO · se parten ──
  ['la-10q-01', 'populusque', 'y el pueblo', ['populus', 'que']],
  ['la-10q-02', 'servusque', 'y el esclavo', ['servus', 'que']],
  ['la-10q-03', 'rēxque', 'y el rey', ['rēx', 'que']],
  ['la-10q-04', 'terraque', 'y la tierra', ['terra', 'que']],
  ['la-10q-05', 'templumque', 'y el templo', ['templum', 'que']],
  ['la-10q-06', 'manusque', 'y la mano', ['manus', 'que']],

  // ── NO LO LLEVAN · son palabra entera y muy frecuentes ──
  ['la-10q-07', 'atque', 'y (conjunción)', ['atque'],
   'es una conjunción entera, hermana de «et». Partirla daría «at» + «que», y «at» es otra conjunción distinta: la lectura falsa se entiende y dice otra cosa', 462],
  ['la-10q-08', 'itaque', 'así pues', ['itaque'],
   'es un adverbio entero. Partirlo daría «ita» + «que», «así y», que casi tiene sentido — y por eso engaña', 170],
  ['la-10q-09', 'ūsque', 'hasta, sin interrupción', ['ūsque'],
   'es una preposición-adverbio entera. «ūs» no es nada', 151],
  ['la-10q-10', 'quoque', 'también', ['quoque'],
   'es un adverbio entero. Partirlo daría «quo» + «que», y «quo» SÍ existe («adonde»), así que la lectura falsa es coherente y falsa', 95],
  ['la-10q-11', 'quīnque', 'cinco', ['quīnque'],
   'es el numeral «cinco». «quīn» existe además como conjunción, así que aquí también la lectura falsa se sostiene sola', 80],
  ['la-10q-12', 'neque', 'y no, ni', ['neque'],
   'es una conjunción entera. Históricamente sí es «ne» + «que», pero funciona como una sola palabra y no se analiza', 29],
];

export const SEMILLA_DE_ORDEN = 1;

const FUENTE: ItemQue[] = DEFS.map(([id, palabra, glosa, respuesta, queEsEnRealidad, frecuencia]) => ({
  id, punto: 'l10-que-enclitico', palabra, glosa, respuesta,
  ejes: {
    lleva: respuesta.length > 1,
    ...(queEsEnRealidad ? { queEsEnRealidad } : {}),
    ...(frecuencia ? { frecuencia } : {}),
  },
}));

export const LOTE_QUE = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

// lib/data/languages/la/lotes/l8-participio-concertado.ts
//
// `l8-participio-concertado` — el participio toma su caso del elemento con
// el que concuerda, no del suyo.
//
//     Puer dīcēns ambulat.          concuerda con el SUJETO     (nominativo)
//     Rēx puerum dīcentem vocat.    concuerda con el OBJETO     (acusativo)
//     In viā factā ambulat.         concuerda con un ABLATIVO
//
// ── POR QUÉ LOS DOCE VAN REPARTIDOS A CUATRO Y CUATRO ────────────────
//
// «Concordar siempre con el sujeto» es el error natural, porque el sujeto
// es lo primero que se busca. Con cuatro ítems de cada destino la
// estrategia saca el 33 %, que con tres salidas es el azar. Con ocho
// sujetos sacaría el 67 % y el lote enseñaría a no mirar.
//
// ── EL GÉNERO NO SE EXAMINA EN LA MITAD DE LOS ÍTEMS ─────────────────
//
// El participio de presente es un adjetivo de UNA terminación: `dīcentem`
// vale para masculino y para femenino. En esos seis ítems la concordancia
// de género no se examina —la respuesta sería la misma con el otro género—
// y la cobertura lo dice con su motivo en vez de contarlos como si sí. Los
// seis de perfecto (`factus`/`facta`/`factum`) sí la distinguen.
//
// ── LAS FORMAS SON LAS QUE EL CORPUS TRAE EN ESE CASO ────────────────
//
// Contadas por rasgo y por casilla, no por cadena. De `factum` ×166 en
// acusativo a `habentibus` ×3 en ablativo plural.
import type { ItemConcertado, CualPart, Destino, GeneroAdj } from '../../../../../scripts/lib/gate-participio-concertado';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import type { Numero } from '../paradigma-la';
import { VERBOS_L1 } from '../lexicon-l1';

const V = (l: string) => VERBOS_L1.find((x) => x.lema === l)!;

export const SEMILLA_DE_ORDEN = 1;

type Def = [id: string, lema: string, cual: CualPart, destino: Destino,
            elemento: string, genero: GeneroAdj, numero: Numero,
            respuesta: string, marco: string, glosa: string];

const DEFS: Def[] = [
  // ── CON EL SUJETO · nominativo ──
  ['la-pc-01', 'dīcō', 'presente', 'sujeto', 'Puer', 'm', 'sg', 'dīcēns',
   'Puer ___ ambulat.', 'El niño, diciendo, anda.'],
  ['la-pc-02', 'mittō', 'perfecto', 'sujeto', 'Servus', 'm', 'sg', 'missus',
   'Servus ___ venit.', 'El esclavo, enviado, viene.'],
  ['la-pc-03', 'veniō', 'presente', 'sujeto', 'Rēx', 'm', 'sg', 'veniēns',
   'Rēx ___ stat.', 'El rey, viniendo, se detiene.'],
  ['la-pc-04', 'vocō', 'perfecto', 'sujeto', 'Discipulus', 'm', 'sg', 'vocātus',
   'Discipulus ___ ambulat.', 'El discípulo, llamado, anda.'],

  // ── CON EL OBJETO · acusativo ──
  //
  // Las cuatro son casillas donde el NOMINATIVO no sirve. El neutro no
  // distingue nominativo de acusativo (`dictum` es los dos) y el plural de
  // la 3.ª tampoco (`venientēs`): un ítem así se contesta poniendo el
  // nominativo, que es justo la estrategia que hay que derrotar. La primera
  // versión de este lote los llevaba y la ciega sacaba el 75 %.
  ['la-pc-05', 'dīcō', 'presente', 'objeto', 'puerum', 'm', 'sg', 'dīcentem',
   'Rēx puerum ___ vocat.', 'El rey llama al niño que está diciendo.'],
  ['la-pc-06', 'mittō', 'perfecto', 'objeto', 'servum', 'm', 'sg', 'missum',
   'Rēx servum ___ videt.', 'El rey ve al esclavo enviado.'],
  ['la-pc-07', 'habeō', 'presente', 'objeto', 'virum', 'm', 'sg', 'habentem',
   'Rēx virum ___ videt.', 'El rey ve al varón que tiene.'],
  ['la-pc-08', 'faciō', 'perfecto', 'objeto', 'viam', 'f', 'sg', 'factam',
   'Rēx viam ___ videt.', 'El rey ve el camino hecho.'],

  // ── CON UN ABLATIVO · ni sujeto ni objeto ──
  //
  // Aquí se evita el ablativo femenino de la 1.ª (`factā`), que sólo se
  // separa del nominativo `facta` POR EL MACRÓN. El gate compara sin
  // cantidad —como el corpus—, así que esa casilla le daría la razón a
  // quien escriba el nominativo.
  ['la-pc-09', 'faciō', 'perfecto', 'ablativo', 'agrō', 'm', 'sg', 'factō',
   'In agrō ___ stat.', 'Se mantiene en el campo hecho.'],
  ['la-pc-10', 'dīcō', 'presente', 'ablativo', 'servīs', 'm', 'pl', 'dīcentibus',
   'Cum servīs ___ ambulat.', 'Anda con los esclavos que están diciendo.'],
  ['la-pc-11', 'videō', 'perfecto', 'ablativo', 'locō', 'm', 'sg', 'vīsō',
   'In locō ___ stat.', 'Se mantiene en el lugar visto.'],
  ['la-pc-12', 'habeō', 'presente', 'ablativo', 'hominibus', 'm', 'pl', 'habentibus',
   'Cum hominibus ___ ambulat.', 'Anda con los hombres que tienen.'],
];

const FUENTE: ItemConcertado[] = DEFS.map(([id, lema, cual, destino, elemento, genero, numero, respuesta, marco, glosa]) => ({
  id, punto: 'l8-participio-concertado', verbo: V(lema), cual, concuerdaCon: destino,
  elemento: { forma: elemento, genero, numero }, respuesta, marco, glosa,
  ejes: { concuerdaCon: destino, cual },
}));

export const LOTE_PARTICIPIO_CONCERTADO = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

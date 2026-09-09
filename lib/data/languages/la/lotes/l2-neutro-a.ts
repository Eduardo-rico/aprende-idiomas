// lib/data/languages/la/lotes/l2-neutro-a.ts
//
// PRIMER LOTE DE LA `-a` NEUTRA. Punto: `l2-neutro-a`.
//
// «templum/templa, bellum/bella, arma, castra. En español `-a` marca
// femenino singular; en latín marca TAMBIÉN neutro plural, y el alumno lee
// `arma` como “un arma” durante meses.»
//
// ── TODOS EN ACUSATIVO, Y NO ES UNA ELECCIÓN DE ESTILO ───────────────
//
// Si el neutro plural fuera SUJETO, el verbo lo desmentiría: «Bella magna
// sunt» lleva `sunt`, y quien leyó «bella» en singular se estrella contra la
// concordancia antes de terminar la frase. El ítem mediría entonces la
// desinencia del VERBO.
//
// En el OBJETO no hay red: «Bella videt» tiene el verbo en singular por su
// sujeto y no dice nada del número del objeto. Ahí la `-a` es lo único que
// informa, y por eso los doce ítems ponen el neutro en acusativo.
//
// ── LA MITAD EN SINGULAR, POR LA ARITMÉTICA DE SIEMPRE ───────────────
//
// El eje es binario —singular o plural— así que un lote todo en plural se
// contesta con «siempre plural». Seis y seis.
//
// ── EL HOMÓGRAFO ESTÁ ESCRITO A MANO Y SE DICE POR QUÉ ───────────────
//
// El `varia` dice que la trampa sólo muerde cuando la forma coincide con una
// palabra española real. No hay con qué comprobarlo aquí: `hunspell` está sin
// diccionario `es` y `/usr/share/dict` sólo trae inglés.
//
// Y el corpus propio NO vale de segundo camino, aunque lo parezca: los
// documentos de este proyecto están en español y CITAN LATÍN a todas horas,
// así que «templa» sale 6 veces en ellos, «verba» 23, «castra» 10 y «maria»
// 35 — sin ser ninguna palabra española. Un corpus que contiene aquello que
// se quiere contrastar no es independiente, y usarlo habría marcado como
// homógrafo justo lo que el punto usa de contraejemplo.
//
// Por eso la lista es corta a propósito: `bella` y `dōna`, que nadie
// discute, y ningún caso dudoso.
import type { ItemNeutroA } from '../../../../../scripts/lib/gate-neutro-a';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';

type Def = [id: string, latin: string, marco: string, glosa: string, respuesta: string,
            num: 'sg' | 'pl', homografo?: { palabra: string; queEsEnEspanol: string }];

const BELLA = { palabra: 'bella', queEsEnEspanol: 'el femenino singular de «bello»: un adjetivo corriente, así que la lectura falsa no sólo es posible sino cómoda' };
const DONA = { palabra: 'dona', queEsEnEspanol: 'la tercera persona del singular de «donar», y en registro antiguo un sustantivo femenino: la forma existe y no chirría' };

const DEFS: Def[] = [
  // ── SEIS EN PLURAL: donde muerde ──
  ['la-2a-01', 'bella', 'Rex bella videt.', 'El rey ve ___.', 'las guerras', 'pl', BELLA],
  ['la-2a-02', 'bella', 'Poeta bella timet.', 'El poeta teme ___.', 'las guerras', 'pl', BELLA],
  ['la-2a-03', 'dōna', 'Servus dona portat.', 'El esclavo lleva ___.', 'los regalos', 'pl', DONA],
  ['la-2a-04', 'templa', 'Exercitus templa custodit.', 'El ejército guarda ___.', 'los templos', 'pl'],
  ['la-2a-05', 'gaudia', 'Regina gaudia habet.', 'La reina tiene ___.', 'las alegrías', 'pl'],
  ['la-2a-06', 'verba', 'Discipulus verba audit.', 'El discípulo oye ___.', 'las palabras', 'pl'],

  // ── SEIS EN SINGULAR: el contraste que impide contestar siempre igual ──
  ['la-2a-07', 'bellum', 'Rex bellum videt.', 'El rey ve ___.', 'la guerra', 'sg'],
  ['la-2a-08', 'dōnum', 'Servus donum portat.', 'El esclavo lleva ___.', 'el regalo', 'sg'],
  ['la-2a-09', 'templum', 'Exercitus templum custodit.', 'El ejército guarda ___.', 'el templo', 'sg'],
  ['la-2a-10', 'gaudium', 'Regina gaudium habet.', 'La reina tiene ___.', 'la alegría', 'sg'],
  ['la-2a-11', 'verbum', 'Discipulus verbum audit.', 'El discípulo oye ___.', 'la palabra', 'sg'],
  ['la-2a-12', 'nōmen', 'Poeta nomen audit.', 'El poeta oye ___.', 'el nombre', 'sg'],
];

export const SEMILLA_DE_ORDEN = 1;

const FUENTE: ItemNeutroA[] = DEFS.map(([id, latin, marco, glosa, respuesta, numero, homografo]) => ({
  id, punto: 'l2-neutro-a', latin, marco, glosa, respuesta,
  ejes: { numero, ...(homografo ? { homografo } : {}) },
}));

export const LOTE_NEUTRO_A = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

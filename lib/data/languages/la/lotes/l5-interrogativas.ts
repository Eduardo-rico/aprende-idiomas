// lib/data/languages/la/lotes/l5-interrogativas.ts
//
// PRIMER LOTE DE LAS INTERROGATIVAS. Punto: `l5-interrogativas`.
//
// «"-ne" pregunta neutra, "num" espera un "no", "nōnne" espera un "sí". La
// partícula lleva la respuesta esperada.» `varia`: la partícula, **y hay que
// traer las tres o el punto no mide nada**.
//
// ── POR QUÉ ES `sin-equivalente` Y NO OTRA COSA ──────────────────────
//
// El español no tiene NADA que haga esto. «¿Vienes?» es neutra; para
// esperar un «no» hay que decir «¿acaso vienes?» o cambiar la entonación, y
// para esperar un «sí», «¿verdad que vienes?». Son perífrasis o prosodia,
// no una palabra gramatical.
//
// Así que el alumno no tiene dónde equivocarse por transferencia: tiene un
// hueco. Y un hueco se rellena enseñando, no cazando trampas — que es la
// diferencia entre este punto y casi todos los demás del lote de hoy.
//
// ── LO QUE PUDE CONTAR Y LO QUE NO ───────────────────────────────────
//
//     nōnne    60 apariciones    limpias
//     num      22                limpias
//     -ne      no separable
//
// El treebank **no distingue** el `-ne` interrogativo del `nē` negativo
// —«para que no»—: los 963 tokens etiquetados `ADV/advmod` con lema `ne`
// mezclan los dos, y sólo 3 llevan la etiqueta `PART/discourse` que sería la
// del enclítico. No es que el `-ne` sea raro: es que la anotación no permite
// contarlo, y decir «3 apariciones» sería inventar una cifra.
//
// Lo que sí hay son ejemplos, y uno vale: «ne tu es quaesita per omnes nata,
// mihi terras?» — con interrogación en el propio texto del corpus.
//
// ── EL EJE ES LA RESPUESTA ESPERADA, NO LA PARTÍCULA ─────────────────
//
// Un lote que sólo pidiera reconocer la partícula mediría memoria de tres
// palabras. Lo que el punto declara es que **la partícula lleva la respuesta
// esperada**, así que cada ítem pregunta por eso: qué contestaría alguien a
// quien se le pregunta así.
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';

export type Particula = 'ne' | 'num' | 'nonne';
export type RespuestaEsperada = 'ninguna' | 'no' | 'si';

/** Qué respuesta espera cada partícula. Es el contenido del punto y va en
 *  una tabla, no repetido en cada ítem. */
export const ESPERA: Record<Particula, RespuestaEsperada> = {
  ne: 'ninguna', num: 'no', nonne: 'si',
};

/** Cómo se dice en español lo que la partícula hace, cuando se puede decir.
 *  Ninguna es una palabra: son perífrasis o entonación, y por eso el punto
 *  está declarado `sin-equivalente`. */
export const EN_ESPANOL: Record<Particula, string> = {
  ne: 'la entonación sola: «¿vienes?»',
  num: 'una perífrasis: «¿acaso vienes?», «no vendrás, ¿no?»',
  nonne: 'una coletilla: «vienes, ¿verdad?», «¿no vienes acaso?»',
};

export interface ItemInterrogativa {
  id: string;
  punto: string;
  latin: string;
  glosa: string;
  /** Lo que hay que contestar: qué respuesta espera quien pregunta así. */
  respuesta: RespuestaEsperada;
  ejes: { particula: Particula; frecuencia: number | null };
}

/** `null` cuando no se pudo contar, y por qué. */
export const FRECUENCIA: Record<Particula, number | null> = { ne: null, num: 22, nonne: 60 };
export const POR_QUE_NO_SE_CUENTA_NE =
  'el treebank no distingue el «-ne» interrogativo del «nē» negativo: los 963 tokens con lema `ne` etiquetados ADV/advmod mezclan los dos, y sólo 3 llevan PART/discourse. Dar una cifra sería inventarla';

type Def = [id: string, p: Particula, latin: string, glosa: string];

const DEFS: Def[] = [
  // ── «-ne» · pregunta neutra ──
  ['la-5q-01', 'ne', 'Venisne?', '¿Vienes?'],
  ['la-5q-02', 'ne', 'Videsne reginam?', '¿Ves a la reina?'],
  ['la-5q-03', 'ne', 'Audisne verba?', '¿Oyes las palabras?'],
  ['la-5q-04', 'ne', 'Portatne dona?', '¿Lleva los regalos?'],

  // ── «num» · espera un «no» ──
  ['la-5q-05', 'num', 'Num venis?', '¿Acaso vienes?'],
  ['la-5q-06', 'num', 'Num reginam vides?', '¿Acaso ves a la reina?'],
  ['la-5q-07', 'num', 'Num bellum timet?', '¿Acaso teme la guerra?'],
  ['la-5q-08', 'num', 'Num verba legis?', '¿Acaso lees las palabras?'],

  // ── «nōnne» · espera un «sí» ──
  ['la-5q-09', 'nonne', 'Nonne venis?', '¿No vienes, verdad que sí?'],
  ['la-5q-10', 'nonne', 'Nonne reginam vides?', 'Ves a la reina, ¿verdad?'],
  ['la-5q-11', 'nonne', 'Nonne verba audis?', 'Oyes las palabras, ¿verdad?'],
  ['la-5q-12', 'nonne', 'Nonne templum custodit?', 'Guarda el templo, ¿verdad?'],
];

export const SEMILLA_DE_ORDEN = 1;

const FUENTE: ItemInterrogativa[] = DEFS.map(([id, particula, latin, glosa]) => ({
  id, punto: 'l5-interrogativas', latin, glosa,
  respuesta: ESPERA[particula],
  ejes: { particula, frecuencia: FRECUENCIA[particula] },
}));

export const LOTE_INTERROGATIVAS = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

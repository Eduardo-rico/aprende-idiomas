// lib/data/languages/la/lotes/l2-segunda.ts
//
// EL PRIMER LOTE DE CLOZE DERIVADO. Punto: `l2-segunda`.
//
// El contenido real del punto es una sola cosa: **el tema sale del
// GENITIVO, no del nominativo**. `puer/puerī` conserva la vocal y
// `ager/agrī` la pierde, y eso no se deduce del nominativo — por eso la
// entrada del lexicón lleva el genitivo.
//
// De ahí sale la composición, que no es estética:
//
//   · **Un ítem con un nombre regular en `-us` no examina el punto**,
//     porque las dos derivaciones dan lo mismo. Están para que el lote no
//     sea una lista de rarezas, pero no cuentan: el gate mide las tasas
//     de tema SÓLO sobre los `-er`, porque diluirlas con los regulares
//     dejaría pasar un lote que no examina nada.
//   · **Mitad `conserva` y mitad `sincopa`.** Las dos derivaciones ciegas
//     son complementarias sobre los `-er` —exactamente una acierta en
//     cada palabra— así que cualquier otra proporción regala una de las
//     dos. Es la misma aritmética del lote anterior, en otro eje.
//   · **Un ítem de `fīlius`**, que es la excepción declarada (A&G §49.c;
//     treebank: `fili` 13, `filie` 0). Sin él, el alumno saca 8/8
//     sobregeneralizando el vocativo en `-e`. Y con él SOLO tampoco vale:
//     hace falta el contraste de `domine`, o «el vocativo nunca es -e»
//     sería la estrategia ganadora.
//
// Y una celda no se pide si su respuesta ya está a la vista. Eso descarta
// el genitivo singular — y también el NOMINATIVO PLURAL de la 2.ª, que es
// su homógrafo (`puerī`): pedirlo es pedir que copien la entrada con otro
// nombre de celda.
import type { ItemClozeDerivado } from '../../../../../scripts/lib/gate-cloze-derivado';
import { NOMBRES_L1 } from '../lexicon-l1';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';

const E = (lema: string) => NOMBRES_L1.find((x) => x.lema === lema)!;


// ── EL ORDEN PUBLICADO VA BARAJADO, Y NO ES UN DETALLE ────────────────
//
// Este fichero se escribe AGRUPADO por el eje del punto porque así se
// revisa. Pero `ExerciseRunner` sirve los ejercicios con `exercises[idx]`
// incremental, o sea **en el orden del fichero**, y agrupados el alumno
// resuelve el lote entero contando: «a partir del séptimo cambia la
// respuesta». El detector `separablePorPosicion` —en el repositorio desde
// portugués, y que ninguno de los gates de latín llamaba— lo confirma al
// 100 %.
//
// Se publica barajado con semilla fija: ni alternancia estricta, que el
// mismo detector caza por paridad, ni azar sin semilla, que haría el orden
// irreproducible.
export const SEMILLA_DE_ORDEN = 1;

const LOTE_SEGUNDA_FUENTE: ItemClozeDerivado[] = [
  // ── conserva la vocal: puer / puerī ──
  { id: 'la-2d-01', punto: 'l2-segunda', entrada: E('puer'), celda: 'ac.sg', respuesta: 'puerum',
    marco: 'Magister ___ vocat.', pista: 'El maestro llama AL NIÑO — objeto directo, singular.',
    ejes: { clase: 'conserva', celda: 'ac.sg' } },
  { id: 'la-2d-02', punto: 'l2-segunda', entrada: E('puer'), celda: 'dat.sg', respuesta: 'puerō',
    marco: 'Dominus ___ dōnum mittit.', pista: 'El señor envía un regalo AL NIÑO — destinatario, singular.',
    ejes: { clase: 'conserva', celda: 'dat.sg' } },
  { id: 'la-2d-03', punto: 'l2-segunda', entrada: E('puer'), celda: 'dat.pl', respuesta: 'puerīs',
    marco: 'Magistrī ___ dōnum mittunt.', pista: 'Los maestros envían un regalo A LOS NIÑOS — destinatario, plural.',
    ejes: { clase: 'conserva', celda: 'dat.pl' } },
  { id: 'la-2d-04', punto: 'l2-segunda', entrada: E('puer'), celda: 'gen.pl', respuesta: 'puerōrum',
    marco: 'Magister ___ verba laudat.', pista: 'El maestro alaba las palabras DE LOS NIÑOS — posesión, plural.',
    ejes: { clase: 'conserva', celda: 'gen.pl' } },

  // ── pierde la vocal: ager / agrī, magister / magistrī ──
  { id: 'la-2d-05', punto: 'l2-segunda', entrada: E('ager'), celda: 'ac.sg', respuesta: 'agrum',
    marco: 'Colōnus ___ videt.', pista: 'El colono ve EL CAMPO — objeto directo, singular.',
    ejes: { clase: 'sincopa', celda: 'ac.sg' } },
  { id: 'la-2d-06', punto: 'l2-segunda', entrada: E('ager'), celda: 'ac.pl', respuesta: 'agrōs',
    marco: 'Colōnī ___ custōdiunt.', pista: 'Los colonos guardan LOS CAMPOS — objeto directo, plural.',
    ejes: { clase: 'sincopa', celda: 'ac.pl' } },
  { id: 'la-2d-07', punto: 'l2-segunda', entrada: E('magister'), celda: 'ac.sg', respuesta: 'magistrum',
    marco: 'Discipulus ___ salūtat.', pista: 'El discípulo saluda AL MAESTRO — objeto directo, singular.',
    ejes: { clase: 'sincopa', celda: 'ac.sg' } },
  { id: 'la-2d-08', punto: 'l2-segunda', entrada: E('magister'), celda: 'dat.pl', respuesta: 'magistrīs',
    marco: 'Puerī ___ dōnum mittunt.', pista: 'Los niños envían un regalo A LOS MAESTROS — destinatario, plural.',
    ejes: { clase: 'sincopa', celda: 'dat.pl' } },

  // ── LA EXCEPCIÓN, y su contraste ──
  { id: 'la-2d-09', punto: 'l2-segunda', entrada: E('fīlius'), celda: 'voc.sg', respuesta: 'fīlī',
    marco: '___, dominus dōnum mittit.', pista: 'Se le habla AL HIJO. Ojo: los -ius no hacen el vocativo en -e.',
    ejes: { clase: 'voc-ius', celda: 'voc.sg' } },
  { id: 'la-2d-10', punto: 'l2-segunda', entrada: E('dominus'), celda: 'voc.sg', respuesta: 'domine',
    marco: '___, discipulī verba audiunt.', pista: 'Se le habla AL SEÑOR — el vocativo regular de la 2.ª.',
    ejes: { clase: 'regular', celda: 'voc.sg' } },

  // ── regulares: no examinan el tema, y por eso no cuentan para su tasa ──
  { id: 'la-2d-11', punto: 'l2-segunda', entrada: E('servus'), celda: 'ac.pl', respuesta: 'servōs',
    marco: 'Dominus ___ vocat.', pista: 'El señor llama A LOS ESCLAVOS — objeto directo, plural.',
    ejes: { clase: 'regular', celda: 'ac.pl' } },
  { id: 'la-2d-12', punto: 'l2-segunda', entrada: E('dōnum'), celda: 'ac.pl', respuesta: 'dōna',
    marco: 'Puerī ___ exspectant.', pista: 'Los niños esperan LOS REGALOS — neutro plural, objeto directo.',
    ejes: { clase: 'regular', celda: 'ac.pl' } },
];

/** El lote tal como se publica: barajado con `SEMILLA_DE_ORDEN`. */
export const LOTE_SEGUNDA = ordenPublicado(LOTE_SEGUNDA_FUENTE, SEMILLA_DE_ORDEN);

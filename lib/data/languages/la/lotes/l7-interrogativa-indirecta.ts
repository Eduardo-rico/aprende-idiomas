// lib/data/languages/la/lotes/l7-interrogativa-indirecta.ts
//
// `l7-interrogativa-indirecta` — un subjuntivo que no significa nada.
//
//     Rēx rogat num veniat.     «El rey pregunta si VIENE»   y no «venga»
//     Rēx rogat ubi habitet.    «… dónde VIVE»               y no «viva»
//
// El latín pone subjuntivo en toda interrogativa indirecta y **no hay
// ningún matiz de duda**: es puramente formal. El alumno, que sabe lo que
// es un subjuntivo, le busca un valor y traduce «venga». El punto lo dice
// así: «el subjuntivo aquí no significa nada… el alumno le busca un valor y
// lo traduce mal».
//
// ── EL ERROR DIANA VA ESCRITO, NO MEDIDO ─────────────────────────────
//
// «Traducir el subjuntivo por un subjuntivo» es imposible que acierte: la
// respuesta española va siempre en indicativo. Medirlo como tasa ciega
// daría 0 % sin poder dar otra cosa, que es el adorno que §5.sexdecies del
// relevo prohíbe. Cada ítem lo declara en `elErrorDiana`, el gate comprueba
// que difiere de la respuesta y que la glosa no lo regala, y la aplicación
// se lo queda de distractor.
//
// ── LA QUE SÍ PUEDE FALLAR ES LA PARTÍCULA ───────────────────────────
//
// Seis partículas y cinco interrogativos españoles: `num` y `an` piden
// «si», `ubi` «dónde», `cūr` «por qué», `quandō` «cuándo», `quōmodo`
// «cómo». Dos ítems de cada partícula dejan la mayoría en el 33 %.
//
// Y el subjuntivo latino **no depende de la partícula**: eso es lo que se
// ve al variarla. Con una sola, el alumno podría pensar que `num` es lo que
// lo pide.
//
// ── LO QUE FALTA, Y POR QUÉ NO SE HA FORZADO ─────────────────────────
//
// `quid` (×727) y `quis` (×292) son el ejemplo del propio punto —`rogō quid
// faciās`— y no están: declinan, y meterlos en la lista de invariables
// sería mentir sobre su morfología para ahorrarse un paradigma. Las seis
// del lote son las indeclinables: `ubi` ×247, `an` ×112, `quōmodo` ×102,
// `nōnne` ×60, `quandō` ×53, `num` ×22, `cūr` ×20.
import type { ItemInterrogativa, Particula } from '../../../../../scripts/lib/gate-interrogativa-indirecta';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';

export const SEMILLA_DE_ORDEN = 1;

type Def = [id: string, particula: Particula, latin: string, glosa: string,
            respuesta: string, elErrorDiana: string];

const DEFS: Def[] = [
  // ── `num` y `an` · las dos piden «si» ──
  ['la-ii-01', 'num', 'Rēx rogat num veniat.', 'El rey pregunta si ___.', 'viene', 'venga'],
  ['la-ii-02', 'num', 'Magister rogat num labōret.', 'El maestro pregunta si ___.', 'trabaja', 'trabaje'],
  ['la-ii-03', 'an', 'Rēx rogat an videant.', 'El rey pregunta si ___.', 'ven', 'vean'],
  ['la-ii-04', 'an', 'Dominus rogat an audiat.', 'El señor pregunta si ___.', 'oye', 'oiga'],

  // ── `ubi` · «dónde» ──
  ['la-ii-05', 'ubi', 'Rēx rogat ubi habitet.', 'El rey pregunta dónde ___.', 'vive', 'viva'],
  ['la-ii-06', 'ubi', 'Magister rogat ubi stent.', 'El maestro pregunta dónde ___.', 'están', 'estén'],

  // ── `cūr` · «por qué» ──
  ['la-ii-07', 'cūr', 'Dominus rogat cūr taceat.', 'El señor pregunta por qué ___.', 'calla', 'calle'],
  ['la-ii-08', 'cūr', 'Rēx rogat cūr timeant.', 'El rey pregunta por qué ___.', 'temen', 'teman'],

  // ── `quandō` · «cuándo» ──
  ['la-ii-09', 'quandō', 'Rēgīna rogat quandō veniant.', 'La reina pregunta cuándo ___.', 'vienen', 'vengan'],
  ['la-ii-10', 'quandō', 'Rēx rogābat quandō ambulāret.', 'El rey preguntaba cuándo ___.', 'andaba', 'anduviera'],

  // ── `quōmodo` · «cómo» ──
  ['la-ii-11', 'quōmodo', 'Magister rogat quōmodo labōrent.', 'El maestro pregunta cómo ___.', 'trabajan', 'trabajen'],
  ['la-ii-12', 'quōmodo', 'Magister rogābat quōmodo dīceret.', 'El maestro preguntaba cómo ___.', 'decía', 'dijera'],
];

const FUENTE: ItemInterrogativa[] = DEFS.map(([id, particula, latin, glosa, respuesta, elErrorDiana]) => ({
  id, punto: 'l7-interrogativa-indirecta', particula, latin, glosa, respuesta, elErrorDiana,
  ejes: { particula },
}));

export const LOTE_INTERROGATIVA_INDIRECTA = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

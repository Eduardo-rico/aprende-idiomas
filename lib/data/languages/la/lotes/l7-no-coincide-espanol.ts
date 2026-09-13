// lib/data/languages/la/lotes/l7-no-coincide-espanol.ts
//
// `l7-no-coincide-espanol` — el instinto romance como estorbo.
//
//     EL LATÍN LO PONE Y EL ESPAÑOL NO
//       Cum rēx venīret, puer stābat.        «cuando el rey VENÍA»
//       Rēx rogat ubi habitet.               «dónde VIVE»
//       Rēx tam magnus est ut populus timeat. «que TEME»
//
//     EL LATÍN LO QUITA Y EL ESPAÑOL LO PONE
//       Cum rēx veniet, puer stābit.         «cuando el rey VENGA»
//       Servus quī veniet labōrābit.         «el que VENGA»
//
//     Y COINCIDEN
//       Rēx venit ut videat.                 «para que VEA»
//       Rēx rogat ut audiant.                «que OIGAN»
//
// ── POR QUÉ LA MITAD DEL LOTE COINCIDE ───────────────────────────────
//
// Si los catorce fueran desajustes, «invertir el modo» los acertaría TODOS
// y el lote instalaría una regla nueva y falsa —«en latín siempre al
// revés»— en lugar de la que quita. Con dos modos, copiar e invertir son
// complementarias y sus tasas suman uno: la única manera de que ninguna
// gane es siete y siete.
//
// Y las coincidencias no son relleno. La final y la completiva son
// subjuntivo en las dos lenguas y son los dos puntos que el alumno acaba de
// estudiar; el relativo y el `cum` temporal en presente van en indicativo en
// las dos. Lo que el lote enseña no es «al revés» sino **que el instinto no
// decide y la construcción sí**.
//
// ── LAS DOS DIRECCIONES, MEDIDAS EN EL CORPUS ────────────────────────
//
// `cum` como conjunción: 731 con subjuntivo —405 pluscuamperfecto y 283
// imperfecto, que es el `cum` histórico— y 235 con indicativo, **119 de
// ellos en futuro**. Ese futuro es exactamente el «cuando venga» español.
// No es una rareza de manual: es la quinta construcción más frecuente de
// `cum` en el corpus.
import type { ItemNoCoincide, Construccion, Modo } from '../../../../../scripts/lib/gate-no-coincide';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';

export const SEMILLA_DE_ORDEN = 1;

type Def = [id: string, construccion: Construccion, modoLatino: Modo, modoEspanol: Modo,
            forma: string, latin: string, glosa: string, respuesta: string, error: string | null];

const DEFS: Def[] = [
  // ── EL LATÍN LO PONE Y EL ESPAÑOL NO ──
  ['la-nc-01', 'cum-historico', 'subjuntivo', 'indicativo', 'venīret',
   'Cum rēx venīret, puer stābat.', 'Cuando el rey ___, el niño estaba de pie.', 'venía', 'viniera'],
  ['la-nc-02', 'cum-historico', 'subjuntivo', 'indicativo', 'vēnisset',
   'Cum rēx vēnisset, puer stābat.', 'Cuando el rey ___, el niño estaba de pie.', 'había venido', 'hubiera venido'],
  ['la-nc-03', 'interrogativa-indirecta', 'subjuntivo', 'indicativo', 'habitet',
   'Rēx rogat ubi habitet.', 'El rey pregunta dónde ___.', 'vive', 'viva'],
  ['la-nc-04', 'consecutiva', 'subjuntivo', 'indicativo', 'timeat',
   'Rēx tam magnus est ut populus timeat.', 'El rey es tan grande que el pueblo ___.', 'teme', 'tema'],

  // ── EL LATÍN LO QUITA Y EL ESPAÑOL LO PONE ──
  ['la-nc-05', 'cum-futuro', 'indicativo', 'subjuntivo', 'veniet',
   'Cum rēx veniet, puer stābit.', 'Cuando el rey ___, el niño estará de pie.', 'venga', 'vendrá'],
  ['la-nc-06', 'cum-futuro', 'indicativo', 'subjuntivo', 'labōrābit',
   'Cum magister labōrābit, puer stābit.', 'Cuando el maestro ___, el niño estará de pie.', 'trabaje', 'trabajará'],
  ['la-nc-07', 'relativo-futuro', 'indicativo', 'subjuntivo', 'veniet',
   'Servus quī veniet labōrābit.', 'El esclavo que ___ trabajará.', 'venga', 'vendrá'],

  // ── Y COINCIDEN · subjuntivo en las dos ──
  ['la-nc-08', 'final', 'subjuntivo', 'subjuntivo', 'videat',
   'Rēx venit ut videat.', 'El rey viene para que ___.', 'vea', null],
  ['la-nc-09', 'final', 'subjuntivo', 'subjuntivo', 'labōret',
   'Dominus venit ut servus labōret.', 'El señor viene para que el esclavo ___.', 'trabaje', null],
  ['la-nc-10', 'completiva', 'subjuntivo', 'subjuntivo', 'audiant',
   'Rēx rogat ut audiant.', 'El rey pide que ___.', 'oigan', null],
  ['la-nc-11', 'completiva', 'subjuntivo', 'subjuntivo', 'dīcat',
   'Dominus monet ut servus dīcat.', 'El señor advierte que el esclavo ___.', 'diga', null],

  // ── Y COINCIDEN · indicativo en las dos ──
  ['la-nc-12', 'relativo-presente', 'indicativo', 'indicativo', 'venit',
   'Servus quī venit labōrat.', 'El esclavo que ___ trabaja.', 'viene', null],
  ['la-nc-13', 'relativo-presente', 'indicativo', 'indicativo', 'labōrat',
   'Puer quī labōrat stat.', 'El niño que ___ está de pie.', 'trabaja', null],
  ['la-nc-14', 'cum-presente', 'indicativo', 'indicativo', 'venit',
   'Cum rēx venit, puer stat.', 'Cuando el rey ___, el niño está de pie.', 'viene', null],
];

const FUENTE: ItemNoCoincide[] = DEFS.map(([id, construccion, modoLatino, modoEspanol, forma, latin, glosa, respuesta, error]) => ({
  id, punto: 'l7-no-coincide-espanol', construccion, modoLatino, modoEspanol,
  formaSubordinada: forma, latin, glosa, respuesta,
  ...(error ? { elErrorDiana: error } : {}),
  ejes: { construccion, coinciden: modoLatino === modoEspanol },
}));

export const LOTE_NO_COINCIDE = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

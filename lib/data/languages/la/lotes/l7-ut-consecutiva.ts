// lib/data/languages/la/lotes/l7-ut-consecutiva.ts
//
// `l7-ut-consecutiva` — el mismo `ut`, el valor contrario.
//
//     Tam magnus est ut vincat.    CONSECUTIVA   «tan grande QUE vence»
//     Venit ut vincat.             FINAL         «viene PARA QUE venza»
//
// La forma latina es idéntica: `ut` + subjuntivo. Lo único que las separa es
// el sentido y, cuando lo hay, el anticipador. Y el español pone INDICATIVO
// en la consecutiva y subjuntivo en la final, así que traducir mal el valor
// se nota en el modo.
//
// ── LOS ANTICIPADORES NO EXISTÍAN EN LA MÁQUINA ──────────────────────
//
// El `varia` de este punto es «el anticipador, que es la pista», y los cinco
// que el material nombra —tam, tantus, ita, sīc, adeō— **no estaban ninguno
// en `INDECLINABLES_L1`**. El punto no se podía escribir. Entran los tres
// frecuentes, medidos: `ita` ×379, `sīc` ×282, `tam` ×130.
//
// ── SIETE Y SIETE, Y CUATRO CONSECUTIVAS SIN PISTA ───────────────────
//
// El reflejo «si hay anticipador, consecutiva» **no es falso**: es una regla
// verdadera con recall incompleto. Contra una final acierta siempre, porque
// las finales no llevan anticipador. Sólo falla en las consecutivas sin
// anticipador, y por eso el lote trae cuatro: el reflejo caza 4 de 8, la
// mitad.
//
// ── LA NEGATIVA VA AL REVÉS QUE EN LA FINAL ──────────────────────────
//
// Consecutiva negativa: `ut nōn`. Final negativa: `nē`. Exactamente el
// cruce. El material dice que quien aplique la regla de la final «se
// equivocará SIEMPRE»; medido sobre las adverbiales con anticipador son 26
// `ut nōn` frente a 3 `nē`, o sea el 90 %. El lote enseña la tendencia y no
// marca `nē` como agramatical.
import type { ItemUtConsec, ValorDeUt } from '../../../../../scripts/lib/gate-ut-consecutiva';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';

export const SEMILLA_DE_ORDEN = 1;

type Def = [id: string, valor: ValorDeUt, anticipador: string | null, negada: boolean,
            latin: string, glosa: string, respuesta: string];

const DEFS: Def[] = [
  // ── CONSECUTIVAS CON ANTICIPADOR · la pista funciona ──
  ['la-uc-01', 'consecutiva', 'tam', false,
   'Rēx tam magnus est ut populus timeat.', 'El rey es tan grande ___ el pueblo.', 'que teme'],
  ['la-uc-02', 'consecutiva', 'ita', false,
   'Puer ita labōrat ut videat.', 'El niño trabaja de tal modo ___ .', 'que ve'],
  ['la-uc-03', 'consecutiva', 'sīc', false,
   'Magister sīc docet ut discipulī audiant.', 'El maestro enseña así ___ los discípulos.', 'que oyen'],

  // ── CONSECUTIVAS SIN ANTICIPADOR · donde el reflejo falla ──
  ['la-uc-04', 'consecutiva', null, false,
   'Bonus est rēx ut populus laudet.', 'El rey es bueno ___ el pueblo.', 'que alaba'],
  ['la-uc-05', 'consecutiva', null, false,
   'Longa est via ut agricola labōret.', 'El camino es largo ___ el campesino.', 'que trabaja'],
  ['la-uc-06', 'consecutiva', null, false,
   'Bonus est magister ut puerī audiant.', 'El maestro es bueno ___ los niños.', 'que oyen'],
  ['la-uc-07', 'consecutiva', 'tam', true,
   'Puer tam parvus est ut nōn labōret.', 'El niño es tan pequeño ___ .', 'que no trabaja'],

  // ── FINALES · el mismo `ut`, el otro valor ──
  ['la-uc-08', 'final', null, false,
   'Rēx venit ut videat.', 'El rey viene ___ .', 'para que vea'],
  ['la-uc-09', 'final', null, false,
   'Magister ambulat ut doceat.', 'El maestro anda ___ .', 'para que enseñe'],
  ['la-uc-10', 'final', null, false,
   'Servus labōrat ut dominus habeat.', 'El esclavo trabaja ___ el señor.', 'para que tenga'],
  ['la-uc-11', 'final', null, false,
   'Nauta stat ut rēgīna veniat.', 'El marinero se detiene ___ la reina.', 'para que venga'],
  ['la-uc-12', 'final', null, false,
   'Discipulus venit ut magistrum audiat.', 'El discípulo viene ___ al maestro.', 'para que oiga'],
  ['la-uc-13', 'final', null, false,
   'Agricola labōrat ut fīlius habeat.', 'El campesino trabaja ___ el hijo.', 'para que tenga'],
  ['la-uc-14', 'final', null, true,
   'Puer stat nē dominus videat.', 'El niño se detiene ___ el señor.', 'para que no vea'],

  // Un cuarto sin anticipador: con tres, el reflejo cazaba 4 de 7 y el lote
  // se resolvía por la pista en más de la mitad de los casos que puede.
  ['la-uc-15', 'consecutiva', null, false,
   'Magnus est timor ut servus taceat.', 'El miedo es grande ___ el esclavo.', 'que calla'],
];

const FUENTE: ItemUtConsec[] = DEFS.map(([id, valor, anticipador, negada, latin, glosa, respuesta]) => ({
  id, punto: 'l7-ut-consecutiva', valor, anticipador, negada, latin, glosa, respuesta,
  ejes: { valor, conAnticipador: anticipador !== null, negada },
}));

export const LOTE_UT_CONSECUTIVA = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

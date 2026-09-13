// lib/data/languages/la/lotes/l7-completivas-ut.ts
//
// `l7-completivas-ut` — lo que rige cada verbo, medido y no supuesto.
//
//     Rēx rogat ut veniat.        COMPLETIVA    «pide que venga»
//     Rēx iubet puerum venīre.    INFINITIVO    «manda al niño venir»
//
// ── EL VALOR ES UN REGALO; EL RÉGIMEN NO ─────────────────────────────
//
// «El español dice “ordena que vengan”, también con subjuntivo: regalo.» Lo
// que no transfiere es cuál de las dos construcciones rige cada verbo, y el
// punto lo pone de `varia`: «el verbo regente, porque algunos rigen
// infinitivo y no completiva».
//
// ── QUIEN DECIDE EL RÉGIMEN ES EL CORPUS ─────────────────────────────
//
// Eso es una propiedad léxica y es exactamente el tipo de afirmación que se
// cuela sin comprobar. `atestacion-ut.json` la cuenta:
//
//     rogō      ut 53   inf   6      completiva
//     moneō     ut  8   inf   1      completiva
//     iubeō     ut  0   inf 133      infinitivo  ← la excepción del punto
//     audiō     ut  0   inf  13      infinitivo
//     habeō     ut  0   inf  12      infinitivo
//     doceō     ut  0   inf   8      infinitivo
//
// El punto declaraba que `iubeō` y `vetō` no llevan `ut`, y el corpus lo
// confirma sin margen. `vetō` sale 6 veces y no entró al léxico.
//
// ── LOS QUE EL CORPUS NO DECIDE NO ESTÁN ─────────────────────────────
//
// `faciō` (34/27) y `dīcō` (18/84 — que sale infinitivo, no completiva)
// son mixtos o van al otro lado; `mittō` (2/0), `dūcō` (0/4) y `respondeō`
// (0/4) no llegan al suelo de evidencia de cinco apariciones. Dos
// apariciones en la misma dirección no son una propiedad léxica, son una
// coincidencia de tamaño dos. Un ítem cuyo régimen el corpus no decide no
// mide su punto, igual que el regente en perfecto de `l7-ut-final`.
//
// ── LO QUE ESTE LOTE NO DICE ─────────────────────────────────────────
//
// Que `audiō` tenga cero completivas en 227.301 tokens es una tendencia
// medida, **no una prueba de que `*audit ut veniat` sea imposible**. Las
// glosas piden la construcción atestiguada y no declaran agramatical la
// otra. Y el acusativo con infinitivo tiene punto propio
// —`l8-acusativo-infinitivo`—: aquí entra sólo como contraste.
import type { ItemCompletiva, Construccion, TiempoRegente } from '../../../../../scripts/lib/gate-completivas-ut';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import type { Persona } from '../paradigma-la';
import { VERBOS_L1 } from '../lexicon-l1';

const V = (l: string) => VERBOS_L1.find((x) => x.lema === l)!;

export const SEMILLA_DE_ORDEN = 1;

type Def = [id: string, regente: string, tiempoRegente: TiempoRegente, personaRegente: Persona,
            construccion: Construccion, verbo: string, persona: Persona | null,
            respuesta: string, marco: string, glosa: string];

const DEFS: Def[] = [
  // ── COMPLETIVA CON `ut` · tres en presente, tres en imperfecto ──
  ['la-cu-01', 'rogō', 'presente', '3sg', 'completiva', 'veniō', '3sg', 'ut veniat',
   'Rēx rogat ___.', 'El rey pide que venga.'],
  ['la-cu-02', 'rogō', 'imperfecto', '3sg', 'completiva', 'videō', '3pl', 'ut vidērent',
   'Rēx rogābat ___.', 'El rey pedía que vieran.'],
  ['la-cu-03', 'rogō', 'presente', '3pl', 'completiva', 'audiō', '3pl', 'ut audiant',
   'Rēgēs rogant ___.', 'Los reyes piden que oigan.'],
  ['la-cu-04', 'moneō', 'presente', '3sg', 'completiva', 'labōrō', '3sg', 'ut labōret',
   'Dominus monet ___.', 'El señor advierte que trabaje.'],
  ['la-cu-05', 'moneō', 'imperfecto', '3sg', 'completiva', 'veniō', '3sg', 'ut venīret',
   'Dominus monēbat ___.', 'El señor advertía que viniera.'],
  ['la-cu-06', 'moneō', 'imperfecto', '3pl', 'completiva', 'taceō', '3sg', 'ut tacēret',
   'Magistrī monēbant ___.', 'Los maestros advertían que callara.'],

  // ── INFINITIVO · donde `ut` es el error que el punto declara ──
  ['la-cu-07', 'iubeō', 'presente', '3sg', 'infinitivo', 'veniō', null, 'venīre',
   'Rēx iubet puerum ___.', 'El rey manda al niño venir.'],
  ['la-cu-08', 'iubeō', 'imperfecto', '3sg', 'infinitivo', 'labōrō', null, 'labōrāre',
   'Rēx iubēbat servum ___.', 'El rey mandaba al esclavo trabajar.'],
  ['la-cu-09', 'iubeō', 'presente', '3pl', 'infinitivo', 'audiō', null, 'audīre',
   'Rēgēs iubent servōs ___.', 'Los reyes mandan a los esclavos oír.'],
  ['la-cu-10', 'audiō', 'presente', '3sg', 'infinitivo', 'dīcō', null, 'dīcere',
   'Puer audit rēgem ___.', 'El niño oye al rey decir.'],
  ['la-cu-11', 'habeō', 'imperfecto', '3sg', 'infinitivo', 'legō', null, 'legere',
   'Magister habēbat ___.', 'El maestro tenía que leer.'],
  ['la-cu-12', 'doceō', 'presente', '3sg', 'infinitivo', 'legō', null, 'legere',
   'Magister docet puerum ___.', 'El maestro enseña al niño a leer.'],
];

const FUENTE: ItemCompletiva[] = DEFS.map(([id, regente, tiempoRegente, personaRegente, construccion, verbo, persona, respuesta, marco, glosa]) => ({
  id, punto: 'l7-completivas-ut',
  verboRegente: V(regente), tiempoRegente, personaRegente, construccion,
  verbo: V(verbo), ...(persona ? { persona } : {}), respuesta, marco, glosa,
  ejes: { construccion, tiempoRegente },
}));

export const LOTE_COMPLETIVAS_UT = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

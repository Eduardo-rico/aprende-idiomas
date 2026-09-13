// lib/data/languages/la/lotes/l7-ut-final.ts
//
// `l7-ut-final` — `ut` / `nē`, y el tiempo que pide el regente.
//
//     Rēx venit    ut videat.     viene    para que vea
//     Rēx veniēbat ut vidēret.    venía    para que viera
//     Rēx venit    nē videat.     viene    para que NO vea
//
// ── LO QUE NO SE EXAMINA, PORQUE ES UN REGALO ────────────────────────
//
// El punto declara `herencia: regalo`: «para que vea» es subjuntivo en
// español igual que en latín. Un ítem que preguntara por el VALOR de la
// subordinada lo contesta cualquier hispanohablante sin saber latín. Lo que
// no transfiere son dos cosas, y son las dos que varían aquí:
//
//   1. la negativa NO es `ut nōn` sino `nē` — «el error de sobreaplicación
//      obligatorio de este punto», dice el material;
//   2. el tiempo del subjuntivo lo manda el tiempo del REGENTE.
//
// ── POR QUÉ NINGÚN REGENTE ESTÁ EN PERFECTO ──────────────────────────
//
// Medido en el treebank sobre las 2.006 subordinadas con `ut`/`nē` +
// subjuntivo: el regente en perfecto lleva imperfecto **264** veces y
// presente **71**. Esos 71 no son ruido — son el `perfectum` que vale por
// presente («ha hecho») en vez de por pasado («hizo»)—, y con un regente
// así la respuesta **no está determinada**. Los doce ítems usan sólo los
// tres tiempos inequívocos: presente (513 → presente, 96 %), futuro (75 →
// presente, 100 %) e imperfecto (137 → imperfecto, 95 %).
//
// Un ítem cuya respuesta el propio corpus no determina es un ítem que no
// mide su punto, aunque esté bien escrito.
import type { ItemUtFinal, Conjuncion, TiempoRegente } from '../../../../../scripts/lib/gate-ut-final';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import type { Persona } from '../paradigma-la';
import { VERBOS_L1 } from '../lexicon-l1';

const V = (l: string) => VERBOS_L1.find((x) => x.lema === l)!;

export const SEMILLA_DE_ORDEN = 1;

type Def = [id: string, regente: string, tiempoRegente: TiempoRegente, personaRegente: Persona,
            verbo: string, persona: Persona, conjuncion: Conjuncion,
            respuesta: string, marco: string, glosa: string];

const DEFS: Def[] = [
  // ── REGENTE PRIMARIO · presente y futuro piden presente ──
  ['la-uf-01', 'veniō', 'presente', '3sg', 'videō', '3sg', 'ut', 'ut videat',
   'Rēx venit ___.', 'El rey viene para que vea.'],
  ['la-uf-02', 'stō', 'presente', '3sg', 'audiō', '3sg', 'ut', 'ut audiat',
   'Puer stat ___.', 'El niño se detiene para que oiga.'],
  ['la-uf-03', 'veniō', 'futuro', '3sg', 'dīcō', '3sg', 'ut', 'ut dīcat',
   'Rēx veniet ___.', 'El rey vendrá para que diga.'],
  ['la-uf-04', 'labōrō', 'presente', '3sg', 'habeō', '3sg', 'nē', 'nē habeat',
   'Discipulus labōrat ___.', 'El discípulo trabaja para que no tenga.'],

  // ── REGENTE SECUNDARIO · el imperfecto pide imperfecto ──
  ['la-uf-05', 'veniō', 'imperfecto', '3sg', 'videō', '3sg', 'ut', 'ut vidēret',
   'Rēx veniēbat ___.', 'El rey venía para que viera.'],
  ['la-uf-06', 'ambulō', 'imperfecto', '3sg', 'dīcō', '3sg', 'ut', 'ut dīceret',
   'Magister ambulābat ___.', 'El maestro andaba para que dijera.'],
  ['la-uf-07', 'labōrō', 'imperfecto', '3sg', 'faciō', '3pl', 'ut', 'ut facerent',
   'Nauta labōrābat ___.', 'El marinero trabajaba para que hicieran.'],
  ['la-uf-08', 'mittō', 'imperfecto', '3sg', 'vocō', '3sg', 'nē', 'nē vocāret',
   'Dominus mittēbat ___.', 'El señor enviaba para que no llamara.'],

  // ── LA NEGATIVA · `nē`, nunca `ut nōn` ──
  //
  // Seis y seis. En el corpus la positiva es mayoría abrumadora —675 frente
  // a 192 en las adverbiales sin anticipador—, pero **la tasa ciega es del
  // lote y no de la lengua**: con ese reparto «poner siempre ut» sacaría el
  // 78 % sin mirar la glosa. El reparto real va en la prosa, no en el lote.
  ['la-uf-09', 'stō', 'presente', '3sg', 'videō', '3sg', 'nē', 'nē videat',
   'Servus stat ___.', 'El esclavo se detiene para que no vea.'],
  ['la-uf-10', 'veniō', 'imperfecto', '3sg', 'audiō', '3sg', 'nē', 'nē audīret',
   'Rēgīna veniēbat ___.', 'La reina venía para que no oyera.'],
  ['la-uf-11', 'labōrō', 'futuro', '3sg', 'faciō', '3sg', 'nē', 'nē faciat',
   'Agricola labōrābit ___.', 'El campesino trabajará para que no haga.'],
  ['la-uf-12', 'ambulō', 'imperfecto', '3sg', 'dīcō', '3pl', 'nē', 'nē dīcerent',
   'Poēta ambulābat ___.', 'El poeta andaba para que no dijeran.'],
];

const FUENTE: ItemUtFinal[] = DEFS.map(([id, regente, tiempoRegente, personaRegente, verbo, persona, conjuncion, respuesta, marco, glosa]) => ({
  id, punto: 'l7-ut-final',
  verboRegente: V(regente), tiempoRegente, personaRegente,
  verbo: V(verbo), persona, conjuncion, respuesta, marco, glosa,
  ejes: { conjuncion, tiempoRegente },
}));

export const LOTE_UT_FINAL = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

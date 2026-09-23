// lib/data/languages/la/lotes/l7-consecutio.ts
//
// `l7-consecutio` — el tiempo del subjuntivo lo deciden DOS cosas.
//
//     Rēx rogat    cūr servus veniat.      pregunta   · a la vez  → presente
//     Rēx rogat    cūr servus vēnerit.     pregunta   · antes     → perfecto
//     Rēx rogābat  cūr servus venīret.     preguntaba · a la vez  → imperfecto
//     Rēx rogābat  cūr servus vēnisset.    preguntaba · antes     → pluscuamperfecto
//
// Cuatro casillas, cuatro ítems en cada una. El gate (`gate-consecutio.ts`)
// DERIVA el marco, la glosa, la pista y la respuesta de los campos
// estructurados y los compara con lo escrito aquí.
//
// ── LO QUE REGALA EL ESPAÑOL, Y DÓNDE NO (§D3) ──────────────────────
//
// La interrogativa indirecta española va en INDICATIVO y, en la norma,
// con la misma concordancia: «preguntará por qué viene / vino»,
// «preguntaba por qué venía / había venido». Quien copia el nombre del
// tiempo acierta casi todo, y por eso la glosa NO lleva el verbo
// subordinado: la relación va en la pista.
//
// Pero no todo, y el hispanohablante de México falla en dos casillas
// distintas por dos caminos (los dos los nombró el lingüista; la primera
// versión de esta cabecera traía uno solo y con un motivo falso):
//
//   · tras primario, lo anterior en IMPERFECTO: con verbos de estado se
//     dice «preguntará dónde estaba», y la escuela llama «subjuntivo
//     pasado» al imperfecto. El treebank: tras presente o futuro, en
//     interrogativa indirecta, 60 presentes, 10 perfectos, 1
//     pluscuamperfecto (un presente histórico) y CERO imperfectos;
//   · tras histórico, lo anterior en PERFECTO: el pretérito mexicano
//     donde otros ponen pluscuamperfecto («preguntaba si vinieron»).
//
// ── LAS RUTAS, PREDICHAS ANTES DE MEDIR (numerador / 16) ─────────────
//
//   siempre presente · imperfecto · perfecto · pluscuamperfecto   4 · 4 · 4 · 4
//   sólo la relación (cualquiera de sus dos lecturas)             8
//   sólo el regente (la regla de `l7-ut-final`)                    8
//   imperfecto tras primario / pretérito mexicano                12 · 12  ← suelo
//
// ── POR QUÉ NINGÚN REGENTE EN PRESENTE ───────────────────────────────
//
// En una frase suelta, «Rēx rogat» puede ser presente HISTÓRICO, que
// admite secuencia secundaria (A&G §485.e): «rogat cūr servus venīret»
// sería correcta y la clave la suspendería. El futuro no puede ser
// histórico, y `-bit` contra `-bat` obliga igual a leer la desinencia.
// Lo cazó el lingüista; la primera versión tenía seis presentes.
//
// ── POR QUÉ NINGÚN VERBO EN -vī ──────────────────────────────────────
//
// `amāverit`/`amārit`, `audīvisset`/`audīsset`: la forma sincopada es
// latín correcto, y la clave única la suspendería (§D8). Los ocho verbos
// tienen perfecto sin `-v-` y el gate lo exige.
//
// ── `videō` Y `rogō`, Y POR QUÉ NINGÚN OTRO ──────────────────────────
//
// En el treebank, `rogō` rige CERO interrogativas indirectas (sus tres
// subjuntivos son peticiones con `nē`) y `videō` 17. `rogō` + interrogativa
// está en el latín clásico (Lewis & Short, s.v. rogo I), pero el corpus no
// lo atestigua; por eso no va solo. `sciō` (29) y `quaerō` (12) son los
// mejores regentes del corpus y están en la máquina, pero importados y SIN
// GLOSA: su español no estaría atado a nada.
//
// La glosa trae el tiempo de la principal EN ESPAÑOL («preguntará» /
// «preguntaba»), así que el lote examina la REGLA, no la lectura de
// `-bit` frente a `-bat`: esa la da también la glosa.
//
// `an` salió del lote: como interrogativa simple tras «preguntar» es
// posclásico (A&G §335.b; en el corpus, sólo Fedro).
import type { ItemConsecutio, Relacion, TiempoRegente } from '../../../../../scripts/lib/gate-consecutio';
// La etiqueta se IMPORTA: una copia cruzada con su original coincide en
// el error (§C4), y voltearla en las dos copias a la vez pasaba en verde.
import { ETIQUETA } from '../../../../../scripts/lib/gate-consecutio';
import type { Particula } from '../../../../../scripts/lib/gate-interrogativa-indirecta';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import type { Numero } from '../paradigma-la';
import { VERBOS_L1 } from '../lexicon-l1';

const V = (l: string) => VERBOS_L1.find((x) => x.lema === l)!;

export const SEMILLA_DE_ORDEN = 1;

type Def = [clave: string, regente: string, sp: string, np: Numero, tiempo: TiempoRegente, particula: Particula,
            ss: string, ns: Numero, verbo: string, relacion: Relacion,
            marcoConCantidad: string, glosa: string, respuesta: string];

// ── CUADRADO LATINO ─────────────────────────────────────────────────
//
// Cuatro verbos, y cada uno sale UNA vez en cada casilla; igual los
// sujetos de la subordinada y los de la principal. La primera versión
// ponía cada verbo en dos casillas de la misma DIAGONAL (veniō en ps y
// ha, respondeō en pa y hs…): con la etiqueta de relación, el verbo daba
// la casilla sin leer el regente, 16 de 16. Lo cazó el ataque por
// mutación; el gate sólo miraba cada eje por separado.
//
//              ps            pa             hs             ha
//   veniō   rēx·servus    rēgīna·nauta   dominus·discipulus  poēta·puer
//   stō     rēgīna·nauta  dominus·discipulus  poēta·puer  rēx·servus
//   taceō   dominus·discipulus  poēta·puer  rēx·servus   rēgīna·nauta
//   doceō   discipulī·magister, en las cuatro
const DEFS: Def[] = [
  // ── PRIMARIO · A LA VEZ → presente ──
  ['ps1', 'rogō', 'rēx', 'sg', 'futuro', 'cūr', 'servus', 'sg', 'veniō', 'simultanea',
   'Rēx rogābit cūr servus ___.', 'El rey preguntará por qué … el esclavo', 'veniat'],
  ['ps2', 'videō', 'rēgīna', 'sg', 'futuro', 'ubi', 'nauta', 'pl', 'stō', 'simultanea',
   'Rēgīna vidēbit ubi nautae ___.', 'La reina verá dónde … los marineros', 'stent'],
  ['ps3', 'rogō', 'dominus', 'sg', 'futuro', 'num', 'discipulus', 'sg', 'taceō', 'simultanea',
   'Dominus rogābit num discipulus ___.', 'El señor preguntará si … el discípulo', 'taceat'],
  ['ps4', 'videō', 'discipulus', 'pl', 'futuro', 'quōmodo', 'magister', 'sg', 'doceō', 'simultanea',
   'Discipulī vidēbunt quōmodo magister ___.', 'Los discípulos verán cómo … el maestro', 'doceat'],

  // ── PRIMARIO · ANTES → perfecto ──
  ['pa1', 'rogō', 'rēgīna', 'sg', 'futuro', 'quandō', 'nauta', 'pl', 'veniō', 'anterior',
   'Rēgīna rogābit quandō nautae ___.', 'La reina preguntará cuándo … los marineros', 'vēnerint'],
  ['pa2', 'videō', 'dominus', 'sg', 'futuro', 'ubi', 'discipulus', 'sg', 'stō', 'anterior',
   'Dominus vidēbit ubi discipulus ___.', 'El señor verá dónde … el discípulo', 'steterit'],
  ['pa3', 'rogō', 'poēta', 'sg', 'futuro', 'cūr', 'puer', 'sg', 'taceō', 'anterior',
   'Poēta rogābit cūr puer ___.', 'El poeta preguntará por qué … el niño', 'tacuerit'],
  ['pa4', 'videō', 'discipulus', 'pl', 'futuro', 'quōmodo', 'magister', 'sg', 'doceō', 'anterior',
   'Discipulī vidēbunt quōmodo magister ___.', 'Los discípulos verán cómo … el maestro', 'docuerit'],

  // ── HISTÓRICO · A LA VEZ → imperfecto ──
  ['hs1', 'rogō', 'dominus', 'sg', 'imperfecto', 'num', 'discipulus', 'sg', 'veniō', 'simultanea',
   'Dominus rogābat num discipulus ___.', 'El señor preguntaba si … el discípulo', 'venīret'],
  ['hs2', 'videō', 'poēta', 'sg', 'imperfecto', 'ubi', 'puer', 'sg', 'stō', 'simultanea',
   'Poēta vidēbat ubi puer ___.', 'El poeta veía dónde … el niño', 'stāret'],
  ['hs3', 'rogō', 'rēx', 'sg', 'imperfecto', 'cūr', 'servus', 'pl', 'taceō', 'simultanea',
   'Rēx rogābat cūr servī ___.', 'El rey preguntaba por qué … los esclavos', 'tacērent'],
  ['hs4', 'videō', 'discipulus', 'pl', 'imperfecto', 'quandō', 'magister', 'sg', 'doceō', 'simultanea',
   'Discipulī vidēbant quandō magister ___.', 'Los discípulos veían cuándo … el maestro', 'docēret'],

  // ── HISTÓRICO · ANTES → pluscuamperfecto ──
  ['ha1', 'rogō', 'poēta', 'sg', 'imperfecto', 'quandō', 'puer', 'pl', 'veniō', 'anterior',
   'Poēta rogābat quandō puerī ___.', 'El poeta preguntaba cuándo … los niños', 'vēnissent'],
  ['ha2', 'videō', 'rēx', 'sg', 'imperfecto', 'ubi', 'servus', 'sg', 'stō', 'anterior',
   'Rēx vidēbat ubi servus ___.', 'El rey veía dónde … el esclavo', 'stetisset'],
  ['ha3', 'rogō', 'rēgīna', 'sg', 'imperfecto', 'num', 'nauta', 'sg', 'taceō', 'anterior',
   'Rēgīna rogābat num nauta ___.', 'La reina preguntaba si … el marinero', 'tacuisset'],
  ['ha4', 'videō', 'discipulus', 'pl', 'imperfecto', 'quōmodo', 'magister', 'sg', 'doceō', 'anterior',
   'Discipulī vidēbant quōmodo magister ___.', 'Los discípulos veían cómo … el maestro', 'docuisset'],
];

const sinM = (s: string) => s.normalize('NFD').replace(/[̄̆]/gu, '').normalize('NFC');

export const FUENTE_CONSECUTIO: ItemConsecutio[] = DEFS.map(([clave, regente, sp, np, tiempo, particula, ss, ns, verbo, relacion, marcoConCantidad, glosa, respuesta]) => ({
  id: clave, punto: 'l7-consecutio',
  regente: V(regente), tiempoRegente: tiempo,
  sujetoPrincipal: { lema: sp, numero: np }, particula,
  sujeto: { lema: ss, numero: ns }, verbo: V(verbo), relacion,
  marco: sinM(marcoConCantidad), marcoConCantidad, glosa,
  pista: `${verbo} · ${ETIQUETA[relacion]}`,
  respuesta,
  ejes: { tiempoRegente: tiempo, relacion },
}));

export const LOTE_CONSECUTIO: ItemConsecutio[] = ordenPublicado(FUENTE_CONSECUTIO, SEMILLA_DE_ORDEN)
  .map((i, k) => ({ ...i, id: `la-cs-${String(k + 1).padStart(2, '0')}` }));

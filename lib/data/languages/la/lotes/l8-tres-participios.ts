// lib/data/languages/la/lotes/l8-tres-participios.ts
//
// `l8-tres-participios` — tres participios, tres giros españoles.
//
//     amāns      presente activo    «amando»            (gerundio)
//     amātus     perfecto pasivo    «amado»             (participio)
//     amātūrus   futuro activo      «a punto de amar»   (perífrasis)
//
// ── POR QUÉ NINGUNO SE GLOSA CON «QUE» ───────────────────────────────
//
// El `motivo` del punto: «el español sólo tiene dos participios vivos y
// traduce los tres con “que”». Si los quince ítems dijeran «el que dice»,
// «el que es dicho» y «el que va a decir», el alumno vería UNA cosa con
// tres terminaciones, y la respuesta latina sería adivinar cuál. El `varia`
// lo prohíbe con todas las letras —«sin usar “que” para los tres»— y el
// gate lo comprueba: los tres llegan con clases de giro distintas.
//
// ── EL TIEMPO ES RELATIVO, Y POR ESO LOS MARCOS VARÍAN ───────────────
//
// El participio de presente no dice «ahora»: dice «a la vez que el verbo
// principal». Los marcos llevan el principal en presente y en pasado a
// propósito, para que «diciendo» no se pegue a un tiempo absoluto.
//
// ── LA EXCEPCIÓN NO CABE AQUÍ, Y ESO ESTÁ MEDIDO ─────────────────────
//
// El punto declara que los deponentes tienen participio de perfecto con
// sentido ACTIVO (`secūtus` = «habiendo seguido»). De los 30 verbos de
// `VERBOS_L1`, **cero** son deponentes. No es que el lote no lo mire: es
// que el material no tiene el caso, y le toca a `l9-deponentes`.
//
// ── LAS FORMAS SON LAS QUE EL CORPUS ATESTIGUA COMO ESE PARTICIPIO ───
//
// Contadas por rasgo (`VerbForm=Part` + `Tense`), no por cadena: en el
// corpus hay 97 formas de presente, 104 de perfecto y 43 de futuro salidas
// de la máquina de L1. Las quince de aquí van de `dīcēns` ×202 a
// `habitūrus` ×2.
import type { ItemTresPart, CualParticipio, ClaseDeGiro } from '../../../../../scripts/lib/gate-tres-participios';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import { VERBOS_L1 } from '../lexicon-l1';

const V = (l: string) => VERBOS_L1.find((x) => x.lema === l)!;

export const SEMILLA_DE_ORDEN = 1;

type Def = [id: string, lema: string, cual: CualParticipio, respuesta: string,
            giro: ClaseDeGiro, marco: string, glosa: string];

const DEFS: Def[] = [
  // ── PRESENTE ACTIVO · gerundio ──
  ['la-tp-01', 'dīcō', 'presente', 'dīcēns', 'gerundio',
   'Puer verbum ___ ambulat.', 'El niño anda diciendo la palabra.'],
  ['la-tp-02', 'videō', 'presente', 'vidēns', 'gerundio',
   'Rēx populum ___ stat.', 'El rey está de pie viendo al pueblo.'],
  ['la-tp-03', 'habeō', 'presente', 'habēns', 'gerundio',
   'Vir fīlium ___ stat.', 'El varón está de pie teniendo un hijo.'],
  ['la-tp-04', 'veniō', 'presente', 'veniēns', 'gerundio',
   'Vir ad urbem ___ cadit.', 'El varón cae viniendo hacia la ciudad.'],
  ['la-tp-05', 'audiō', 'presente', 'audiēns', 'gerundio',
   'Magister verbum ___ stat.', 'El maestro está de pie oyendo la palabra.'],

  // ── PERFECTO PASIVO · participio ──
  ['la-tp-06', 'faciō', 'perfecto', 'factus', 'participio',
   'Puer rēx ___ est.', 'El niño, hecho rey, existe.'],
  ['la-tp-07', 'mittō', 'perfecto', 'missus', 'participio',
   'Servus ā dominō ___ venit.', 'El esclavo, enviado por el señor, viene.'],
  ['la-tp-08', 'vocō', 'perfecto', 'vocātus', 'participio',
   'Puer ā rēge ___ ambulat.', 'El niño, llamado por el rey, anda.'],
  ['la-tp-09', 'videō', 'perfecto', 'vīsus', 'participio',
   'Nauta in marī ___ est.', 'El marinero, visto en el mar, existe.'],
  ['la-tp-10', 'inveniō', 'perfecto', 'inventus', 'participio',
   'Discipulus templum ___ ambulat.', 'El discípulo, encontrado el templo, anda.'],

  // ── FUTURO ACTIVO · perífrasis ──
  ['la-tp-11', 'veniō', 'futuro', 'ventūrus', 'perifrasis',
   'Rēx ad urbem ___ est.', 'El rey está a punto de venir a la ciudad.'],
  ['la-tp-12', 'sum', 'futuro', 'futūrus', 'perifrasis',
   'Magister puerum ___ vocat.', 'El maestro, a punto de existir, llama al niño.'],
  ['la-tp-13', 'faciō', 'futuro', 'factūrus', 'perifrasis',
   'Vir ad urbem ___ cadit.', 'El varón, a punto de hacer, cae hacia la ciudad.'],
  ['la-tp-14', 'videō', 'futuro', 'vīsūrus', 'perifrasis',
   'Puer verbum ___ ambulat.', 'El niño, a punto de ver la palabra, anda.'],
  ['la-tp-15', 'habeō', 'futuro', 'habitūrus', 'perifrasis',
   'Rēx populum ___ stat.', 'El rey está a punto de tener un pueblo.'],
];

const FUENTE: ItemTresPart[] = DEFS.map(([id, lema, cual, respuesta, giro, marco, glosa]) => ({
  id, punto: 'l8-tres-participios', verbo: V(lema), cual, respuesta, marco, glosa,
  ejes: { cual, giro },
}));

export const LOTE_TRES_PARTICIPIOS = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

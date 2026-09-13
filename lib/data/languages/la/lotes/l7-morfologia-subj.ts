// lib/data/languages/la/lotes/l7-morfologia-subj.ts
//
// Punto: `l7-morfologia-subj`. «amem, amārem, amāverim, amāvissem. **El
// imperfecto se forma sobre el infinitivo, que es la regla más útil y la
// que menos se enseña.**»
//
// ── LA EXCEPCIÓN ES UNA INVERSIÓN, Y POR ESO ES CARA ─────────────────
//
// «El presente de la 1.ª va en `-e-` (amem) y el de las otras en `-a-`
// (moneam): **la vocal se invierte respecto al indicativo**, y quien
// sobreaplique dirá *«amam».»
//
// En indicativo la 1.ª tiene `-a-` (amat) y las demás `-e-`/`-i-`. En
// subjuntivo presente es al revés. No es una excepción que se memoriza: es
// un cruce, y el error que produce es **la forma que el alumno esperaría
// por analogía con todo lo que ya sabe**.
//
// Por eso el lote trae DOS presentes de 1.ª: son los únicos que refutan la
// sobreaplicación, y con uno solo el lote mediría un lema.
//
// ── LOS DOS PRIMEROS QUE PUSE AQUÍ ESTABAN MAL ───────────────────────
//
// Eran `vocem` ×81 y `laudem` ×15, elegidos por tener la cuenta más alta
// del corpus. Contando por RASGO y no por cadena, `laudem` sale **0 veces
// como subjuntivo** —las 15 son el acusativo de `laus`— y `vocem` **1 de
// 81** —las otras 80 son `vōx`—. La cuenta era alta porque son sustantivos
// corrientes: el sello premiaba justo lo que había que evitar, y los dos
// ítems envenenados eran los dos que llevan el punto.
//
// Los de ahora, `amēs` ×5 y `ambulēmus` ×5, no tienen homónimo nominal
// ninguno. El singular en `-em`/`-ēs` de la 1.ª es donde vive la colisión
// (`-em` es el acusativo de la 3.ª, `-ēs` su plural); el plural del
// subjuntivo no colisiona con nada, y por eso `-ēmus` sale limpio.
//
// ── EL IMPERFECTO SOBRE EL INFINITIVO, QUE ES LO ÚTIL ────────────────
//
// `dīceret`, `habēret`, `venīret`, `ambulāret`: el infinitivo entero más la
// desinencia, en las cuatro conjugaciones. Es la formación más regular del
// verbo latino y el punto dice que es la que menos se enseña.
//
// ── LAS CIFRAS DEL POOL ──────────────────────────────────────────────
//
// Medido sobre el corpus: 51 formas de presente atestiguadas con tres o más
// apariciones, 26 de imperfecto, 24 de perfecto y 13 de pluscuamperfecto.
// Las de 1.ª en presente son doce, así que la excepción se puede examinar
// con holgura.
import type { ItemSubj } from '../../../../../scripts/lib/gate-morfologia-subj';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import { VERBOS_L1 } from '../lexicon-l1';
import type { Persona } from '../paradigma-la';
import type { TiempoSubj } from '../subjuntivo';

const V = (l: string) => VERBOS_L1.find((x) => x.lema === l)!;

type Def = [id: string, lema: string, tiempo: TiempoSubj, persona: Persona, respuesta: string,
            conj: 1 | 2 | 3 | 4 | 'mixta', marco: string, glosa: string];

const DEFS: Def[] = [
  // ── PRESENTE · donde vive la inversión ──
  ['la-ms-01', 'amō', 'presente', '2sg', 'amēs', 1, 'Ut Deum ___.', 'Para que ames a Dios.'],
  ['la-ms-02', 'ambulō', 'presente', '1pl', 'ambulēmus', 1, 'Ut in viā ___.', 'Para que andemos por el camino.'],
  ['la-ms-03', 'habeō', 'presente', '3sg', 'habeat', 2, 'Ut vītam ___.', 'Para que tenga vida.'],
  ['la-ms-04', 'dīcō', 'presente', '1sg', 'dīcam', 3, 'Ut vērum ___.', 'Para que diga la verdad.'],
  ['la-ms-05', 'veniō', 'presente', '3sg', 'veniat', 4, 'Ut rēx ___.', 'Para que venga el rey.'],
  ['la-ms-06', 'faciō', 'presente', '1sg', 'faciam', 'mixta', 'Ut opus ___.', 'Para que haga la obra.'],

  // ── IMPERFECTO · sobre el infinitivo, en las cuatro ──
  ['la-ms-07', 'ambulō', 'imperfecto', '3sg', 'ambulāret', 1, 'Ut in viā ___.', 'Para que caminara por el camino.'],
  ['la-ms-08', 'habeō', 'imperfecto', '3sg', 'habēret', 2, 'Ut vītam ___.', 'Para que tuviera vida.'],
  ['la-ms-09', 'dīcō', 'imperfecto', '3sg', 'dīceret', 3, 'Ut vērum ___.', 'Para que dijera la verdad.'],
  ['la-ms-10', 'veniō', 'imperfecto', '3sg', 'venīret', 4, 'Ut rēx ___.', 'Para que viniera el rey.'],

  // ── PERFECTO · sobre el tema de perfecto ──
  ['la-ms-11', 'veniō', 'perfecto', '3sg', 'vēnerit', 4, 'Sī rēx ___.', 'Si el rey ha venido.'],
  ['la-ms-12', 'dīcō', 'perfecto', '3sg', 'dīxerit', 3, 'Sī vērum ___.', 'Si ha dicho la verdad.'],
  ['la-ms-13', 'faciō', 'perfecto', '3sg', 'fēcerit', 'mixta', 'Sī opus ___.', 'Si ha hecho la obra.'],

  // ── PLUSCUAMPERFECTO · el mismo tema, otra desinencia ──
  ['la-ms-14', 'veniō', 'pluscuamperfecto', '3sg', 'vēnisset', 4, 'Sī rēx ___.', 'Si el rey hubiera venido.'],
  ['la-ms-15', 'videō', 'pluscuamperfecto', '3sg', 'vīdisset', 2, 'Sī caelum ___.', 'Si hubiera visto el cielo.'],
  ['la-ms-16', 'dīcō', 'pluscuamperfecto', '3sg', 'dīxisset', 3, 'Sī nōmen ___.', 'Si hubiera dicho el nombre.'],
];

export const SEMILLA_DE_ORDEN = 1;

const FUENTE: ItemSubj[] = DEFS.map(([id, lema, tiempo, persona, respuesta, conj, marco, glosa]) => ({
  id, punto: 'l7-morfologia-subj', verbo: V(lema), tiempo, persona, respuesta, marco, glosa,
  pista: `subjuntivo de ${tiempo}, ${persona === '1sg' ? '1.ª del singular' : '3.ª del singular'}`,
  ejes: { conjugacion: conj },
}));

export const LOTE_MORFOLOGIA_SUBJ = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

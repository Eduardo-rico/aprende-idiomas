// lib/data/languages/la/lotes/l5-pro-drop.ts
//
// PRIMER LOTE DE PRO-DROP. Punto: `l5-pro-drop`.
//
// El punto se corrigió midiéndolo: decía «el español hace lo mismo, es
// regalo puro» y NO lo es. La OMISIÓN sí transfiere; lo que no transfiere es
// **recuperar la persona**. Por eso el hueco va en la GLOSA ESPAÑOLA: está
// puesto exactamente en la casilla donde el regalo se acaba.
//
// ── LA INTERSECCIÓN, MEDIDA ANTES DE ESCRIBIR NINGÚN ÍTEM ────────────
//
// La pregunta no es si el alumno omite el sujeto —lo omite igual que el
// latín— sino **dónde el latín marca una persona que su español pierde**.
// Contado sobre los 38.026 verbos finitos del corpus con persona, número y
// tiempo anotados:
//
//     imperfecto 1sg/3sg   3.265   8,6 %   el español dice «era» a los dos
//     2pl/3pl             10.166  26,7 %   México dice «son» a los dos
//     ──────────────────────────────────
//     INTERSECCIÓN        13.431  35,3 %
//
// El 64,7 % restante el español lo distingue solo («soy»/«es», «seré»/
// «será», «fui»/«fue») y ahí el punto no tiene nada que enseñar. Un tercio
// del texto es intersección de sobra para un lote, pero conviene que esté
// escrito: el punto NO cubre el pro-drop entero, cubre su tercera parte.
//
// ── EL PISO QUE PONE LA DISTRIBUCIÓN ─────────────────────────────────
//
// Y dentro de esa intersección la tercera persona aplasta a las demás:
//
//     imperfecto   3sg 2.858  ·  1sg   407
//     plural       3pl 8.167  ·  2pl 1.999
//
// O sea que **en el texto real, contestar siempre «él/ellos» acierta el
// 82 %**. Este lote reparte los cuatro valores a partes iguales, así que esa
// estrategia baja al 50 %, y conviene saber que ese 50 % es una propiedad
// DEL LOTE y no de la lengua: el reparto equilibrado es una decisión de
// medición, no un retrato de la lectura. Quien mire la tasa ciega de este
// lote y crea que ha medido al alumno leyendo la Vulgata se equivoca por
// treinta puntos.
//
// ── LOS CUATRO VALORES SON OBLIGATORIOS Y NO SON INTERCAMBIABLES ─────
//
// Los dos del imperfecto se funden en CUALQUIER español. Los dos del plural
// sólo se funden en el de México, donde no hay «vosotros» — y ahí el latín
// omite mientras el español obliga a decir «ustedes». Es el único punto del
// currículo donde la dificultad depende de la variedad del alumno, así que
// cada ítem declara cuál asume.
import type { ItemProDrop } from '../../../../../scripts/lib/gate-pro-drop';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import { VERBOS_L1 } from '../lexicon-l1';
import type { Persona, Tiempo } from '../paradigma-la';

const V = (l: string) => VERBOS_L1.find((v) => v.lema === l)!;

const FUNDE_IMPERFECTO = (forma: string) => ({
  laOtraPersona: '3sg' as Persona, formaCompartida: forma, variedad: 'general' as const,
  motivo: `el español dice «${forma}» para la primera y para la tercera del singular: ocho de sus catorce paradigmas finitos las funden, y el latín no las funde en ninguno de diez`,
});
const FUNDE_IMPERFECTO_3 = (forma: string) => ({
  laOtraPersona: '1sg' as Persona, formaCompartida: forma, variedad: 'general' as const,
  motivo: `el español dice «${forma}» para la tercera y para la primera del singular: es la misma casilla vista desde el otro lado, y sólo la desinencia latina las separa`,
});
const FUNDE_MEXICO_2 = (forma: string) => ({
  laOtraPersona: '3pl' as Persona, formaCompartida: forma, variedad: 'mexico' as const,
  motivo: `en el español de México no hay «vosotros», así que «${forma}» sirve para «ustedes» y para «ellos»: el latín omite el sujeto y el español obliga a ponerlo`,
});
const FUNDE_MEXICO_3 = (forma: string) => ({
  laOtraPersona: '2pl' as Persona, formaCompartida: forma, variedad: 'mexico' as const,
  motivo: `en el español de México «${forma}» vale para «ellos» y para «ustedes», y la desinencia latina es lo único que dice cuál`,
});

type Def = [id: string, verbo: string, persona: Persona, tiempo: Tiempo,
            latin: string, glosa: string, respuesta: string,
            fusion: ItemProDrop['fusion']];

const DEFS: Def[] = [
  // ── IMPERFECTO 1.ª sg · el español dice «era/tenía/veía» ──
  ['la-5p-01', 'sum', '1sg', 'imperfecto', 'In templō eram.',
   'Estaba en el templo. → ¿quién? ___', 'yo', FUNDE_IMPERFECTO('estaba')],
  ['la-5p-02', 'videō', '1sg', 'imperfecto', 'Rēgīnam vidēbam.',
   'Veía a la reina. → ¿quién? ___', 'yo', FUNDE_IMPERFECTO('veía')],
  ['la-5p-03', 'timeō', '1sg', 'imperfecto', 'Bellum timēbam.',
   'Temía la guerra. → ¿quién? ___', 'yo', FUNDE_IMPERFECTO('temía')],

  // ── IMPERFECTO 3.ª sg · la misma forma española, la otra persona ──
  ['la-5p-04', 'sum', '3sg', 'imperfecto', 'In templō erat.',
   'Estaba en el templo. → ¿quién? ___', 'él', FUNDE_IMPERFECTO_3('estaba')],
  ['la-5p-05', 'videō', '3sg', 'imperfecto', 'Rēgīnam vidēbat.',
   'Veía a la reina. → ¿quién? ___', 'él', FUNDE_IMPERFECTO_3('veía')],
  ['la-5p-06', 'audiō', '3sg', 'imperfecto', 'Verba audiēbat.',
   'Oía las palabras. → ¿quién? ___', 'él', FUNDE_IMPERFECTO_3('oía')],

  // ── 2.ª pl · el latín omite y el español de México obliga ──
  ['la-5p-07', 'sum', '2pl', 'presente', 'In agrō estis.',
   'Están en el campo. → ¿quiénes? ___', 'ustedes', FUNDE_MEXICO_2('están')],
  ['la-5p-08', 'laudō', '2pl', 'presente', 'Poētam laudātis.',
   'Alaban al poeta. → ¿quiénes? ___', 'ustedes', FUNDE_MEXICO_2('alaban')],
  ['la-5p-09', 'audiō', '2pl', 'presente', 'Magistrum audītis.',
   'Oyen al maestro. → ¿quiénes? ___', 'ustedes', FUNDE_MEXICO_2('oyen')],

  // ── 3.ª pl · la más frecuente del corpus, y por eso la que menos mide ──
  ['la-5p-10', 'sum', '3pl', 'presente', 'In agrō sunt.',
   'Están en el campo. → ¿quiénes? ___', 'ellos', FUNDE_MEXICO_3('están')],
  ['la-5p-11', 'laudō', '3pl', 'presente', 'Poētam laudant.',
   'Alaban al poeta. → ¿quiénes? ___', 'ellos', FUNDE_MEXICO_3('alaban')],
  ['la-5p-12', 'portō', '3pl', 'presente', 'Rosās portant.',
   'Llevan las rosas. → ¿quiénes? ___', 'ellos', FUNDE_MEXICO_3('llevan')],
];

export const SEMILLA_DE_ORDEN = 1;

const FUENTE: ItemProDrop[] = DEFS.map(
  ([id, verbo, persona, tiempo, latin, glosa, respuesta, fusion]) => ({
    id, punto: 'l5-pro-drop', verbo: V(verbo), persona, tiempo, latin, glosa, respuesta, fusion,
  }));

/** Barajado: escrito agrupado por persona, el alumno lo resolvería contando. */
export const LOTE_PRO_DROP = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

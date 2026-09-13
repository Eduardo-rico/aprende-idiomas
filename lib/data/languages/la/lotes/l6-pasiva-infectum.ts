// lib/data/languages/la/lotes/l6-pasiva-infectum.ts
//
// PRIMER LOTE DE L2. Punto: `l6-pasiva-infectum`.
//
// «amor, amāris, amātur. Un juego de desinencias nuevo, no una perífrasis.»
// `varia`: «la persona y la conjugación». `motivo`: «el español no tiene
// pasiva sintética: hay que aprender formas, no una construcción».
//
// ── LA ESTRATEGIA CIEGA FALLA EN LAS SEIS, Y EL INSTRUMENTO ME LO DIJO ─
//
// Escribí primero que «la activa más una `-r`» acierta en la 1.ª del
// singular —`amō` → `amor`— y la medición dio **0 %**. `amō` + `r` es
// `amōr`, y la pasiva es `amor` con `o` BREVE. Es la casilla donde la
// estrategia está más cerca y aun así falla, **y falla por la cantidad**,
// que es lo que `l1-cantidad-fonemica` enseña: en un curso sin mácrones ese
// error sería invisible.
//
// ── LAS SEIS PERSONAS ESTÁN, Y LAS DE PLURAL SON RARAS ───────────────
//
// Medido: la 3.ª del singular tiene 24 formas atestiguadas y la 2.ª del
// plural tiene **cuatro**, todas con una sola aparición —`dīciminī`,
// `dūciminī`, `dūcēbāminī`, `dūcēminī`—. El lote las trae igual porque el
// `varia` es la persona, y decir «no hay» sería falso: hay, y son raras.
//
// ── `sum` NO ENTRA, y no por olvido ──────────────────────────────────
//
// `pasivaInfectum(sum)` produce formas —`eris` sale ×19 en el corpus— pero
// ésa es la ACTIVA de `sum`, no una pasiva: el verbo no tiene voz pasiva.
// Contarla habría metido un ítem falso con una cifra alta detrás.
import type { ItemPasiva } from '../../../../../scripts/lib/gate-pasiva-infectum';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import { VERBOS_L1 } from '../lexicon-l1';
import type { Persona, Tiempo } from '../paradigma-la';

const V = (l: string) => VERBOS_L1.find((x) => x.lema === l)!;

type Def = [id: string, lema: string, tiempo: Tiempo, persona: Persona, respuesta: string,
            conj: 1 | 2 | 3 | 4 | 'mixta', marco: string, pista: string, glosa: string,
            porQueSinAtestiguar?: string];

const DEFS: Def[] = [
  // ── 1.ª persona · la ÚNICA casilla donde «activa + r» acierta ──
  // `amor` sale 22 veces en el corpus y las 22 son el SUSTANTIVO. Se queda
  // —con el motivo escrito— porque la 1.ª conjugación no tiene ni una sola
  // pasiva de 1.ª persona atestiguada: medido sobre todo L1, las únicas dos
  // son `videor` ×19, que es el ítem de al lado, y `dīcor` ×1. La casilla no
  // se puede llenar con una forma atestiguada, y el lote no descansa en
  // ésta: `la-pa-02` la sostiene.
  ['la-pa-01', 'amō', 'presente', '1sg', 'amor', 1, 'Ā rēgīnā ___.',
   'presente PASIVO, 1.ª del singular', 'Soy amado por la reina.',
   'el corpus no atestigua NINGUNA pasiva de 1.ª persona de la 1.ª conjugación: medidas todas las de L1, sólo hay videor (19) y dīcor (1). Las 22 apariciones de la cadena «amor» son el sustantivo.'],
  ['la-pa-02', 'videō', 'presente', '1sg', 'videor', 2, 'Ā populō ___.',
   'presente PASIVO, 1.ª del singular', 'Soy visto por el pueblo.'],

  // ── 2.ª singular · la casilla de la excepción declarada ──
  ['la-pa-03', 'videō', 'presente', '2sg', 'vidēris', 2, 'Ā rēge ___.',
   'presente PASIVO, 2.ª del singular', 'Eres visto por el rey.'],
  ['la-pa-04', 'audiō', 'futuro', '2sg', 'audiēris', 4, 'Ā populō ___.',
   'futuro PASIVO, 2.ª del singular', 'Serás oído por el pueblo.'],

  // ── 3.ª singular · la más frecuente ──
  ['la-pa-05', 'dīcō', 'presente', '3sg', 'dīcitur', 3, 'Verbum ___.',
   'presente PASIVO, 3.ª del singular', 'La palabra es dicha.'],
  ['la-pa-06', 'vocō', 'presente', '3sg', 'vocātur', 1, 'Puer ___.',
   'presente PASIVO, 3.ª del singular', 'El niño es llamado.'],
  ['la-pa-07', 'videō', 'imperfecto', '3sg', 'vidēbātur', 2, 'Caelum ___.',
   'imperfecto PASIVO, 3.ª del singular', 'El cielo era visto.'],

  // ── 1.ª plural ──
  ['la-pa-08', 'videō', 'presente', '1pl', 'vidēmur', 2, 'Ā rēge ___.',
   'presente PASIVO, 1.ª del plural', 'Somos vistos por el rey.'],
  ['la-pa-09', 'amō', 'presente', '1pl', 'amāmur', 1, 'Ā Deō ___.',
   'presente PASIVO, 1.ª del plural', 'Somos amados por Dios.'],

  // ── 2.ª plural · cuatro formas atestiguadas en todo el corpus ──
  ['la-pa-10', 'dīcō', 'presente', '2pl', 'dīciminī', 3, 'Ā populō ___.',
   'presente PASIVO, 2.ª del plural', 'Sois dichos por el pueblo.'],
  ['la-pa-11', 'dūcō', 'presente', '2pl', 'dūciminī', 3, 'Ā rēge ___.',
   'presente PASIVO, 2.ª del plural', 'Sois conducidos por el rey.'],

  // ── 3.ª plural ──
  ['la-pa-12', 'videō', 'presente', '3pl', 'videntur', 2, 'Caelī ___.',
   'presente PASIVO, 3.ª del plural', 'Los cielos son vistos.'],
];

export const SEMILLA_DE_ORDEN = 1;

const FUENTE: ItemPasiva[] = DEFS.map(([id, lema, tiempo, persona, respuesta, conj, marco, pista, glosa, porQueSinAtestiguar]) => ({
  id, punto: 'l6-pasiva-infectum', verbo: V(lema), tiempo, persona, respuesta, marco, pista, glosa,
  ejes: { conjugacion: conj },
  ...(porQueSinAtestiguar ? { porQueSinAtestiguar } : {}),
}));

export const LOTE_PASIVA_INFECTUM = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

// lib/data/languages/la/deponentes.ts — FORMA PASIVA, SENTIDO ACTIVO.
//
// Punto `l6-deponentes`. «sequor, loquor, ūtor, morior, patior, hortor. Se
// leen en activo aunque parezcan pasivos.» `motivo`: «la lectura pasiva da
// una frase coherente y falsa: “hostēs sequuntur” leído en pasiva es “los
// enemigos son seguidos” y significa lo contrario».
//
// ══ UN DEPONENTE ES EL PASIVO DE UN VERBO QUE NO TIENE ACTIVA ════════
//
// De ahí sale el paradigma sin escribir ni una desinencia nueva: se le
// construye al verbo la entrada ACTIVA que nunca existió —`sequō, sequere`—
// y se le pide su pasiva. `pasivaInfectum` devuelve `sequor, sequitur,
// sequuntur, sequēbātur, sequētur`, que es exactamente el paradigma del
// deponente. La máquina que ya estaba sirve entera.
//
// ══ Y SU PERFECTO ES EL MISMO QUE EL DE LA PASIVA PERIFRÁSTICA ══════
//
// `locūtus est` ×35, `mortuus est` ×25, `profectus est` ×18, `secūtī sunt`
// ×13. Están todos en `atestacion-perfectum.json`, el sello que se hizo para
// `l6-pasiva-perifrastica` — y **ahí está la trampa entera del punto**: son
// las mismas formas y significan lo contrario. `amātus est` es «fue amado»;
// `locūtus est` es «habló», no «fue hablado».
//
// Los dos puntos comparten las formas y discrepan en el sentido, y por eso
// el lote de la perifrástica tuvo que dejarlas fuera.
//
// ══ LOS CANÓNICOS TRAEN ACTIVAS EN EL CORPUS, Y SON ERRATAS ═════════
//
// Medido: 18 tokens con `Voice=Act` en `sequor`, `loquor`, `patior` y
// `hortor` —`sequitur`, `loquitur`, `hortātur`, `patior`, `patimur`—. Todas
// llevan desinencia PASIVA y el rasgo dice activa. Un clasificador de
// deponentes por el rasgo los pierde; por la desinencia, no. Queda escrito
// porque el siguiente que mire el rasgo va a concluir que `sequor` tiene
// activa, y no la tiene.
import { pasivaInfectum, type EntradaVerbal, type Persona } from './paradigma-la';
import { participioPerfecto, participioPresente, participioFuturo, gerundivo } from './participios';
import { subjuntivoPasivo, TIEMPOS_SUBJ, PERSONAS_SUBJ } from './subjuntivo';

export interface EntradaDeponente {
  /** El lema real, que es la forma pasiva: `sequor`. */
  lema: string;
  /** El infinitivo real, también pasivo: `sequī`. */
  infinitivo: string;
  /** El supino, de donde sale el participio de perfecto: `secūtum`. */
  supino: string;
  glosa: string;
  /** Lo que rige el objeto. `ūtor` pide ablativo, y eso es el `varia` del
   *  punto: «otra trampa dentro de la misma». */
  rige: 'acusativo' | 'ablativo';
  /** La entrada ACTIVA que nunca existió, de la que se saca la pasiva. */
  activaFicticia: { lema: string; infinitivo: string };
}

export const DEPONENTES_L1: EntradaDeponente[] = [
  { lema: 'sequor', infinitivo: 'sequī', supino: 'secūtum', glosa: 'seguir', rige: 'acusativo',
    activaFicticia: { lema: 'sequō', infinitivo: 'sequere' } },
  { lema: 'loquor', infinitivo: 'loquī', supino: 'locūtum', glosa: 'hablar', rige: 'acusativo',
    activaFicticia: { lema: 'loquō', infinitivo: 'loquere' } },
  { lema: 'patior', infinitivo: 'patī', supino: 'passum', glosa: 'sufrir, padecer', rige: 'acusativo',
    activaFicticia: { lema: 'patiō', infinitivo: 'patere' } },
  // `ūtor` es el del `varia`: rige ABLATIVO, no acusativo.
  { lema: 'ūtor', infinitivo: 'ūtī', supino: 'ūsum', glosa: 'usar, servirse de', rige: 'ablativo',
    activaFicticia: { lema: 'ūtō', infinitivo: 'ūtere' } },
  { lema: 'morior', infinitivo: 'morī', supino: 'mortuum', glosa: 'morir', rige: 'acusativo',
    activaFicticia: { lema: 'moriō', infinitivo: 'morere' } },
  { lema: 'hortor', infinitivo: 'hortārī', supino: 'hortātum', glosa: 'exhortar, animar', rige: 'acusativo',
    activaFicticia: { lema: 'hortō', infinitivo: 'hortāre' } },
  { lema: 'proficīscor', infinitivo: 'proficīscī', supino: 'profectum', glosa: 'partir, ponerse en camino', rige: 'acusativo',
    activaFicticia: { lema: 'proficīscō', infinitivo: 'proficīscere' } },
  { lema: 'nāscor', infinitivo: 'nāscī', supino: 'nātum', glosa: 'nacer', rige: 'acusativo',
    activaFicticia: { lema: 'nāscō', infinitivo: 'nāscere' } },
];

/** La entrada que hay que darle a la máquina de pasiva. */
export function comoVerbo(d: EntradaDeponente): EntradaVerbal {
  return { lema: d.activaFicticia.lema, infinitivo: d.activaFicticia.infinitivo, supino: d.supino, glosa: d.glosa };
}

/** El infectum entero: presente, imperfecto y futuro, las seis personas. */
export function paradigmaDeponente(d: EntradaDeponente): Record<string, string> {
  return pasivaInfectum(comoVerbo(d));
}

/** El participio de perfecto, que es lo que forma el perfecto con `esse` y
 *  el que tiene sentido ACTIVO: `secūtus` = «habiendo seguido». Es la
 *  excepción que `l8-tres-participios` declara y no pudo examinar. */
export function participioDelDeponente(d: EntradaDeponente): string | null {
  return participioPerfecto(comoVerbo(d))?.lema ?? null;
}

/** El SUBJUNTIVO, que es el pasivo del subjuntivo de la activa ficticia:
 *  `loquātur`, `sequātur`, `ūterētur`. La auditoría inversa lo pidió en
 *  cuanto los deponentes entraron al dominio —89 entradas y 235 tokens que
 *  el enumerador no producía— y sale de la máquina que ya estaba. */
export function subjuntivoDelDeponente(d: EntradaDeponente, t: (typeof TIEMPOS_SUBJ)[number], p: Persona): string | null {
  return subjuntivoPasivo(comoVerbo(d), t, p);
}

/** El participio de PRESENTE de un deponente es activo de forma y de
 *  sentido: `loquēns` = «el que habla». Es la mitad del paradigma donde el
 *  deponente se comporta como cualquier verbo. */
export function participioPresenteDelDeponente(d: EntradaDeponente) {
  return participioPresente(comoVerbo(d));
}

/** Dos que NO salen del supino, y la auditoría los cazó: la máquina daba
 *  `*mortuūrus` y `*nātūrus` y el corpus trae `moritūrus` ×5 y `nāscitūrus`.
 *  El participio de futuro de estos dos se forma sobre el tema de PRESENTE,
 *  no sobre el supino, y eso no se deduce: va escrito. */
export const FUTURO_IRREGULAR: Record<string, string> = {
  morior: 'moritūrus',
  nāscor: 'nāscitūrus',
};

/** Y el de FUTURO: `ūsūrus`, «el que va a usar». */
export function participioFuturoDelDeponente(d: EntradaDeponente): string | null {
  return FUTURO_IRREGULAR[d.lema] ?? participioFuturo(comoVerbo(d))?.lema ?? null;
}

/** El GERUNDIO, que es la forma en `-ndī`/`-ndō` y sale del gerundivo:
 *  `loquendī`, `sequendī`, `nāscendī`. También lo pidió la auditoría. */
export function gerundioDelDeponente(d: EntradaDeponente): { gen: string; dat: string; ac: string; abl: string } {
  const base = gerundivo(comoVerbo(d)).lema.replace(/us$/, '');
  return { gen: `${base}ī`, dat: `${base}ō`, ac: `${base}um`, abl: `${base}ō` };
}

/** La 2.ª persona del singular pasiva tiene DOS formas en latín:
 *  `sequeris` y `sequere`. La segunda es la que el corpus trae más veces en
 *  estos verbos —`ūtere`, `patere`, `hortēre`, `proficīscāre`— y la máquina
 *  general sólo daba la primera. */
export function segundaEnRe(forma: string): string | null {
  return /ris$/.test(forma) ? forma.replace(/ris$/, 're') : null;
}

/** El imperativo del deponente tiene forma de infinitivo pasivo en el
 *  singular —`sequere`— y de 2.ª plural pasiva en el plural —`sequiminī`—.
 *  No hay máquina para esto porque ningún verbo normal lo hace así. */
export function imperativoDelDeponente(d: EntradaDeponente): { sg: string; pl: string } {
  const par = paradigmaDeponente(d);
  return { sg: par['presente.2sg']!.replace(/ris$/, 're'), pl: par['presente.2pl']! };
}

export { TIEMPOS_SUBJ, PERSONAS_SUBJ };

/** Las desinencias personales pasivas. Sirven para clasificar por la FORMA
 *  en vez de por el rasgo, que en el corpus miente 18 veces. */
export const DESINENCIAS_PASIVAS = /(?:or|ris|tur|mur|minī|ntur|bar|bāris|bātur|bāmur|bāminī|bantur|re)$/;

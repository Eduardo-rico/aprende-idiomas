// lib/data/languages/la/lotes/l8-perifrastica-pasiva.ts
//
// `l8-perifrastica-pasiva` — el agente de la obligación va en DATIVO.
//
//     Fīlius patrī laudandus est.    el hijo debe ser alabado por el padre
//     Fīlius ā patre laudātur.       el hijo es alabado por el padre
//
// El hueco es el sintagma entero del agente, preposición incluida. El gate
// (`gate-perifrastica.ts`) DERIVA marco, glosa, pista y respuesta de los
// campos estructurados y los compara con lo escrito aquí.
//
// ── LO QUE EL ÍTEM PIDE, Y POR QUÉ NO DICE «LO OTRO ESTÁ MAL» ─────────
//
// La pista pide «el agente en el caso habitual del latín clásico». «ā patre
// laudandus est» NO es agramatical: A&G §374 N.1 lo da para deshacer una
// ambigüedad o por énfasis, y Cicerón escribe «ā nātūrā petundum est». Lo
// normal es el dativo (§374.a: «the regular way»). La primera versión
// llamaba a «ā patre» error sin más; lo tumbó el latinista.
//
// ── EL SEGUNDO CAMINO DE LA REGLA ───────────────────────────────────
//
// `atestacion-perifrastica.json`, sobre el treebank:
//
//     gerundivo + sum      41 agentes en dativo · 3 con ā/ab
//     pasiva de infectum    1 en dativo        · 127 con ā/ab
//
// Los 3 de ā con gerundivo + sum: «abs tē adiuvandī … sīmus» (anotado
// `obl:agent`) y, anotados `obl`, «ā nātūrā petundum est» y «servandae
// sunt ā pecore». La primera versión del sello sólo contaba `obl:agent`,
// daba 1 y lo llamaba «pronombre»: subcontaba la excepción justo en los
// NOMBRES. Los seis dativos de nombre son de gerundivo con sum («Caesarī
// omnia ūnō tempore erant agenda»); el resto son pronombres.
//
// ── LAS RUTAS, PREDICHAS ANTES DE MEDIR (numerador / 12) ─────────────
//
//   siempre ā + ablativo — traducir el «por», que está en las doce   6
//   siempre dativo                                                   6
//   leer «debe» en la glosa → dativo                                12  ← la REGLA, por el español
//   la frase acaba en forma de sum → dativo; en -tur/-ntur → ā      12  ← la REGLA, por la superficie
//
// Las dos últimas no son rutas ciegas: «obligación ⇒ agente en dativo» es
// lo que el punto enseña, leído por la glosa o por el auxiliar en vez de
// por el gerundivo. Lo que el lote NO examina, y lo dice: reconocer ni
// producir el gerundivo, que viene dado. Por eso el objetivo de la
// lección es escribir el AGENTE, no «producir la perifrástica».
//
// Distractores alcanzables que no son ruta: «patre» sin preposición
// (instrumental) y «per patrem» (el otro «por»).
//
// ── LOS VERBOS ──────────────────────────────────────────────────────
//
// `amō`, `dūcō` y `audiō` estaban y salieron: `amandus` es adjetivo
// lexicalizado («amable»), el dativo con `dūcō` se lee destino, y
// `audiendus` + dativo, «digno de ser oído a juicio de». Entraron
// `exspectō`, `salūtō` y `custōdiō` en sus mismas casillas. Y «custodiado»,
// no «guardado»: de una persona, en México, «guardado» es cosa almacenada.

// ── EL DISEÑO ───────────────────────────────────────────────────────
//
// Seis verbos, cada uno UNA vez en cada mitad. Tres agentes, dos veces en
// cada mitad. Tres tiempos, dos veces en cada mitad. Sujetos, número y
// género repartidos igual. Ningún par de ítems comparte verbo y agente, ni
// verbo y sujeto: sin marco que reencontrar (§5.tricies ter).
import type { ItemPerifrastica, Construccion } from '../../../../../scripts/lib/gate-perifrastica';
import { CONSIGNA } from '../../../../../scripts/lib/gate-perifrastica';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import type { Numero, Tiempo } from '../paradigma-la';
import { VERBOS_L1 } from '../lexicon-l1';

const V = (l: string) => VERBOS_L1.find((x) => x.lema === l)!;

export const SEMILLA_DE_ORDEN = 1;

type Def = [clave: string, construccion: Construccion, tiempo: Tiempo, sujeto: string, numero: Numero,
            verbo: string, agente: string, marcoConCantidad: string, glosa: string, respuesta: string];

const DEFS: Def[] = [
  // ── PERIFRÁSTICA → dativo ──
  ['P1', 'perifrastica', 'presente', 'fīlius', 'sg', 'laudō', 'pater',
   'Fīlius ___ laudandus est.', 'El hijo debe ser alabado por el padre', 'patrī'],
  ['P2', 'perifrastica', 'imperfecto', 'fīlia', 'pl', 'vocō', 'māter',
   'Fīliae ___ vocandae erant.', 'Las hijas debían ser llamadas por la madre', 'mātrī'],
  ['P3', 'perifrastica', 'futuro', 'servus', 'sg', 'moneō', 'frāter',
   'Servus ___ monendus erit.', 'El esclavo deberá ser advertido por el hermano', 'frātrī'],
  ['P4', 'perifrastica', 'imperfecto', 'discipulus', 'sg', 'custōdiō', 'pater',
   'Discipulus ___ custōdiendus erat.', 'El discípulo debía ser custodiado por el padre', 'patrī'],
  ['P5', 'perifrastica', 'presente', 'fīlia', 'pl', 'exspectō', 'māter',
   'Fīliae ___ exspectandae sunt.', 'Las hijas deben ser esperadas por la madre', 'mātrī'],
  ['P6', 'perifrastica', 'futuro', 'puer', 'pl', 'salūtō', 'frāter',
   'Puerī ___ salūtandī erunt.', 'Los niños deberán ser saludados por el hermano', 'frātrī'],

  // ── PASIVA ORDINARIA → ā + ablativo ──
  ['Q7', 'pasiva', 'presente', 'fīlius', 'sg', 'vocō', 'pater',
   'Fīlius ___ vocātur.', 'El hijo es llamado por el padre', 'ā patre'],
  ['Q8', 'pasiva', 'imperfecto', 'fīlia', 'sg', 'moneō', 'māter',
   'Fīlia ___ monēbātur.', 'La hija era advertida por la madre', 'ā mātre'],
  ['Q9', 'pasiva', 'futuro', 'fīlia', 'pl', 'laudō', 'frāter',
   'Fīliae ___ laudābuntur.', 'Las hijas serán alabadas por el hermano', 'ā frātre'],
  ['Q10', 'pasiva', 'futuro', 'servus', 'sg', 'custōdiō', 'frāter',
   'Servus ___ custōdiētur.', 'El esclavo será custodiado por el hermano', 'ā frātre'],
  ['Q11', 'pasiva', 'presente', 'discipulus', 'pl', 'salūtō', 'māter',
   'Discipulī ___ salūtantur.', 'Los discípulos son saludados por la madre', 'ā mātre'],
  ['Q12', 'pasiva', 'imperfecto', 'puer', 'pl', 'exspectō', 'pater',
   'Puerī ___ exspectābantur.', 'Los niños eran esperados por el padre', 'ā patre'],
];

const sinM = (s: string) => s.normalize('NFD').replace(/[̄̆]/gu, '').normalize('NFC');

export const FUENTE_PERIFRASTICA: ItemPerifrastica[] = DEFS.map(([clave, construccion, tiempo, sujeto, numero, verbo, agente, marcoConCantidad, glosa, respuesta]) => ({
  id: clave, punto: 'l8-perifrastica-pasiva',
  construccion, tiempo, sujeto: { lema: sujeto, numero }, verbo: V(verbo), agente,
  marco: sinM(marcoConCantidad), marcoConCantidad, glosa, pista: `${agente} · ${CONSIGNA}`, respuesta,
  ejes: { construccion, tiempo },
}));

export const LOTE_PERIFRASTICA: ItemPerifrastica[] = ordenPublicado(FUENTE_PERIFRASTICA, SEMILLA_DE_ORDEN)
  .map((i, k) => ({ ...i, id: `la-pp-${String(k + 1).padStart(2, '0')}` }));

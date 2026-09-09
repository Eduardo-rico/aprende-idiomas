// lib/data/languages/la/lotes/l5-presente.ts
//
// PRIMER LOTE DEL PRESENTE. Punto: `l5-presente`.
//
// «amō, moneō, regō, audiō, capiō. La vocal temática y sus alternancias.»
// `varia`: la persona y la conjugación.
//
// ── ES `regalo`, Y ESO CAMBIA QUÉ HAY QUE VIGILAR ────────────────────
//
// El hispanohablante conjuga desde niño: la OPERACIÓN transfiere entera. Lo
// que no transfiere son las desinencias y, sobre todo, **de qué clase es
// cada verbo**, porque la desinencia depende de eso y el infinitivo sólo lo
// dice si se lee la cantidad — que es el punto anterior.
//
// Así que la ruta ciega que importa no es «contestar siempre lo mismo»
// —nadie que sepa conjugar hace eso— sino **aplicar la clase equivocada**:
// tratar `legere` como si fuera `monēre` y escribir *«legēs» por «legis».
// Sin verbos de varias clases esa ruta no se puede ni medir, y el gate exige
// al menos tres.
//
// Las cinco clases están, y las seis personas. La alternancia que el punto
// nombra se ve mejor en la 3.ª y la mixta:
//
//     legō · legis · legit · legimus · legitis · legunt
//     capiō · capis · capit · capimus · capitis · capiunt
//
// donde la vocal temática cambia de `i` a `u` en la tercera del plural, y en
// la mixta reaparece la `i` del tema que el infinitivo había escondido.
import type { ItemConjugar } from '../../../../../scripts/lib/gate-conjugar';
import { claseDe } from '../../../../../scripts/lib/gate-conjugar';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import { VERBOS_L1 } from '../lexicon-l1';
import { conjugar } from '../paradigma-la';

const V = (l: string) => VERBOS_L1.find((x) => x.lema === l)!;

type Def = [id: string, lema: string, persona: ItemConjugar['persona'],
            marco: string, glosa: string];

const DEFS: Def[] = [
  ['la-5r-01', 'amō', '1sg', 'Rosam ___.', 'Amo la rosa.'],
  ['la-5r-02', 'portō', '2sg', 'Donum ___.', 'Llevas el regalo.'],
  ['la-5r-03', 'vocō', '3sg', 'Servum ___.', 'Llama al esclavo.'],
  ['la-5r-04', 'moneō', '1pl', 'Discipulos ___.', 'Advertimos a los discípulos.'],
  ['la-5r-05', 'videō', '2pl', 'Reginam ___.', 'Ven a la reina.'],
  ['la-5r-06', 'timeō', '3pl', 'Bellum ___.', 'Temen la guerra.'],
  ['la-5r-07', 'legō', '2sg', 'Verba ___.', 'Lees las palabras.'],
  ['la-5r-08', 'legō', '3pl', 'Verba ___.', 'Leen las palabras.'],
  ['la-5r-09', 'mittō', '1sg', 'Donum ___.', 'Envío el regalo.'],
  ['la-5r-10', 'audiō', '3sg', 'Poetam ___.', 'Oye al poeta.'],
  ['la-5r-11', 'custōdiō', '1pl', 'Templum ___.', 'Guardamos el templo.'],
  ['la-5r-12', 'capiō', '2sg', 'Gladium ___.', 'Coges la espada.'],
  ['la-5r-13', 'capiō', '3pl', 'Gladios ___.', 'Cogen las espadas.'],
  ['la-5r-14', 'faciō', '2pl', 'Opus ___.', 'Hacen la obra.'],
];

export const SEMILLA_DE_ORDEN = 1;

const FUENTE: ItemConjugar[] = DEFS.map(([id, lema, persona, marco, glosa]) => {
  const verbo = V(lema);
  return {
    id, punto: 'l5-presente', verbo, persona, tiempo: 'presente' as const, marco, glosa,
    respuesta: conjugar(verbo, persona, 'presente'),
    pista: `«${verbo.lema}, ${verbo.infinitivo}» — la clase la dice el infinitivo.`,
    ejes: { clase: claseDe(verbo) },
  };
});

export const LOTE_PRESENTE = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

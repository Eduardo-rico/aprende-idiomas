// lib/data/languages/la/lotes/l3-genitivo-posesivo.ts
//
// PRIMER LOTE DEL GENITIVO POSESIVO. Punto: `l3-genitivo-posesivo`.
//
// «"liber puerī", el libro del niño. Es el caso más transparente para un
// hispanohablante.» `varia`: la posición del genitivo respecto a su núcleo,
// que en latín es libre.
//
// ── «LIBRE» ES VERDAD Y ESTÁ MUY ESCORADA ────────────────────────────
//
// Medido sobre los 4.850 genitivos posesivos adyacentes del corpus:
//
//     DETRÁS del núcleo   3.679   75,9 %   («speciēs aurī»)
//     DELANTE             1.171   24,1 %   («mundī rēgnō»)
//
// Y en la Vulgata sola, 77,4 contra 22,6. El español pospone SIEMPRE, así
// que el instinto acierta tres de cada cuatro en el texto real. Este lote va
// mitad y mitad, y ese 50 % es una propiedad DEL LOTE: quien lea la tasa
// ciega y crea que ha medido al alumno leyendo la Vulgata se equivoca por
// veintiséis puntos.
//
// ── DÓNDE MUERDE DE VERDAD, QUE NO ES LA POSICIÓN SOLA ───────────────
//
// Un genitivo antepuesto raro no engaña: `mundī rēgnō` no ofrece ninguna
// lectura falsa, porque `mundī` no puede ser sujeto de nada. Lo que engaña
// es que la forma sea ADEMÁS un nominativo plural:
//
//     `puerī liber`  →  «los niños [son] libres»
//
// Once lemas del lexicón tienen el genitivo singular idéntico al nominativo
// plural, todos de la 1.ª —`puellae`, `rēgīnae`, `poētae`, `nautae`…— más
// los de 2.ª en `-ī`. Ahí la lectura falsa es COHERENTE, que es la condición
// que el proyecto exige para llamar a algo trampa. Los ítems que la cumplen
// van marcados y la cobertura los cuenta aparte.
//
// El punto los llama «el caso más transparente», y lo es en el SIGNIFICADO:
// el español dice «de» y no hay nada que aprender. Lo que no es transparente
// es la forma.
import type { ItemFuncionCaso } from '../../../../../scripts/lib/gate-funcion-caso';
import { colisionesDentro } from '../../../../../scripts/lib/gate-funcion-caso';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import { NOMBRES_L1 } from '../lexicon-l1';
import { declinar, paradigmaNominal } from '../paradigma-la';

const N = (l: string) => NOMBRES_L1.find((x) => x.lema === l)!;

type Def = [id: string, lema: string, num: 'sg' | 'pl', pos: 'antes' | 'despues',
            marco: string, glosa: string, respuesta: string];

const DEFS: Def[] = [
  // ── SEIS ANTEPUESTOS · donde el instinto español se estrella ──
  ['la-3g-01', 'puella', 'sg', 'antes', 'Puellae rosa pulchra est.',
   'La rosa ___ es hermosa.', 'de la niña'],
  ['la-3g-02', 'rēgīna', 'sg', 'antes', 'Reginae donum magnum est.',
   'El regalo ___ es grande.', 'de la reina'],
  ['la-3g-03', 'poēta', 'sg', 'antes', 'Poetae verba bona sunt.',
   'Las palabras ___ son buenas.', 'del poeta'],
  ['la-3g-04', 'servus', 'sg', 'antes', 'Servi cura magna est.',
   'El cuidado ___ es grande.', 'del esclavo'],
  ['la-3g-05', 'rēx', 'sg', 'antes', 'Regis verba audio.',
   'Oigo las palabras ___.', 'del rey'],
  ['la-3g-06', 'tempus', 'sg', 'antes', 'Temporis cura magna est.',
   'El cuidado ___ es grande.', 'del tiempo'],

  // ── SEIS POSPUESTOS · el orden que el español espera ──
  ['la-3g-07', 'puella', 'sg', 'despues', 'Rosa puellae pulchra est.',
   'La rosa ___ es hermosa.', 'de la niña'],
  ['la-3g-08', 'domina', 'sg', 'despues', 'Donum dominae magnum est.',
   'El regalo ___ es grande.', 'de la señora'],
  ['la-3g-09', 'dominus', 'sg', 'despues', 'Verba domini audio.',
   'Oigo las palabras ___.', 'del señor'],
  ['la-3g-10', 'māter', 'sg', 'despues', 'Cura matris magna est.',
   'El cuidado ___ es grande.', 'de la madre'],
  ['la-3g-11', 'exercitus', 'sg', 'despues', 'Gladius exercitus magnus est.',
   'La espada ___ es grande.', 'del ejército'],
  ['la-3g-12', 'rēs', 'sg', 'despues', 'Nomen rei audio.',
   'Oigo el nombre ___.', 'del asunto'],
];

export const SEMILLA_DE_ORDEN = 1;

const FUENTE: ItemFuncionCaso[] = DEFS.map(([id, lema, numero, posicion, marco, glosa, respuesta]) => {
  const entrada = N(lema);
  const p = paradigmaNominal(entrada);
  const pareceNom = p['gen.sg'] === p['nom.pl'];
  return {
    id, punto: 'l3-genitivo-posesivo', entrada, funcion: 'posesor' as const, numero,
    marco, glosa, respuesta,
    forma: declinar(entrada, 'gen', numero),
    ejes: {
      colisiones: colisionesDentro(entrada, 'gen', numero).length,
      posicion,
      ...(pareceNom ? {
        pareceNominativo: `«${p['gen.sg']}» es también el nominativo plural de «${entrada.lema}», así que antepuesto ofrece una lectura falsa COHERENTE y no sólo rara`,
      } : {}),
    },
  };
});

export const LOTE_GENITIVO = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

// lib/data/languages/la/lotes/l6-perfectum.ts
//
// PRIMER LOTE DEL PERFECTUM. Punto: `l6-perfectum`.
//
// «amāvī, amāveram, amāverō. Un solo tema, desinencias propias, y la 3.ª
// persona plural con dos formas (-ērunt / -ēre).» `varia`: el tiempo y la
// formación del tema (reduplicado, en -v-, en -s-, con alargamiento).
//
// ── LAS CUATRO FORMACIONES, Y LA QUE FALTABA ─────────────────────────
//
//     en -v-           amāvī, audīvī        del tema con vocal larga
//     en -s-           dūxī (dūc+s), mīsī   con asimilación
//     alargamiento     vīdī, lēgī, fēcī, cēpī
//     reduplicado      stetī, cecidī        ← el lexicón no tenía NINGUNO
//
// Sin reduplicados el `varia` era insatisfacible. Entran `stō` (178
// apariciones) y `cadō` (98), elegidos por frecuencia. El más frecuente de
// todos, `dō` con 745, NO entra: su infinitivo es `dare` con `a` breve y el
// clasificador lo mandaría a la 3.ª. Es de 1.ª con tema breve, una
// irregularidad propia que hay que declarar antes.
//
// ── LA EXCEPCIÓN DEL PUNTO ES PEOR DE LO QUE DICE ────────────────────
//
// El punto avisa: «"-ēre" por "-ērunt" es normal en poesía y en Salustio: un
// alumno que sólo conozca "-ērunt" leerá un infinitivo». Medido, la variante
// es el **3,6 %** de las terceras del plural (61 contra 1.614): real y rara,
// como el `-īs` del acusativo.
//
// Pero al cruzarlo con lo que ya sabíamos del macrón, resulta que en dos
// verbos del lexicón **las dos formas son idénticas en el texto que el
// alumno lee**:
//
//     vīdēre  (perfecto 3.ª pl)   ·   vidēre  (infinitivo)
//     lēgēre  (perfecto 3.ª pl)   ·   legere  (infinitivo)
//
// Sólo la cantidad los separa, y la cantidad no se escribe. Así que no es
// que el alumno «pueda» leer un infinitivo: es que **la forma escrita no
// contiene la información**. Los dos van en el lote y van declarados.
import type { Persona, TiempoPerfecto } from '../paradigma-la';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import { VERBOS_L1 } from '../lexicon-l1';
import { conjugarPerfecto, variantesDelPerfecto } from '../paradigma-la';

const V = (l: string) => VERBOS_L1.find((x) => x.lema === l)!;

export type FormacionDelTema = 'en-v' | 'en-s' | 'alargamiento' | 'reduplicado';

/** Cómo se forma el tema de perfecto, declarado por verbo. No se deduce: es
 *  la razón de que la tercera parte principal exista. */
export const FORMACION: Record<string, FormacionDelTema> = {
  amō: 'en-v', portō: 'en-v', vocō: 'en-v', laudō: 'en-v', audiō: 'en-v', custōdiō: 'en-v', rogō: 'en-v',
  dūcō: 'en-s', mittō: 'en-s',
  videō: 'alargamiento', legō: 'alargamiento', faciō: 'alargamiento', capiō: 'alargamiento', inveniō: 'alargamiento',
  stō: 'reduplicado', cadō: 'reduplicado',
};

export interface ItemPerfectum {
  id: string;
  punto: string;
  verbo: ReturnType<typeof V>;
  persona: Persona;
  tiempo: TiempoPerfecto;
  marco: string;
  glosa: string;
  respuesta: string;
  ejes: {
    formacion: FormacionDelTema;
    /** Sólo en la variante `-ēre`: con qué se confunde y si el texto los
     *  distingue. */
    chocaConElInfinitivo?: string;
  };
}

type Def = [id: string, lema: string, persona: Persona, tiempo: TiempoPerfecto,
            marco: string, glosa: string, variante?: true];

const DEFS: Def[] = [
  // ── EN -v- ──
  ['la-6p-01', 'amō', '1sg', 'perfecto', 'Rosam ___.', 'Amé la rosa.'],
  ['la-6p-02', 'audiō', '3sg', 'perfecto', 'Verba ___.', 'Oyó las palabras.'],
  ['la-6p-03', 'portō', '3pl', 'pluscuamperfecto', 'Dona ___.', 'Habían llevado los regalos.'],
  // ── EN -s- ──
  ['la-6p-04', 'dūcō', '3sg', 'perfecto', 'Servos ___.', 'Guió a los esclavos.'],
  ['la-6p-05', 'mittō', '1pl', 'perfecto', 'Verba ___.', 'Enviamos las palabras.'],
  ['la-6p-06', 'dūcō', '3sg', 'futuro-perfecto', 'Servos ___.', 'Habrá guiado a los esclavos.'],
  // ── CON ALARGAMIENTO ──
  ['la-6p-07', 'videō', '1sg', 'perfecto', 'Reginam ___.', 'Vi a la reina.'],
  ['la-6p-08', 'faciō', '3sg', 'perfecto', 'Opus ___.', 'Hizo la obra.'],
  ['la-6p-09', 'capiō', '2sg', 'pluscuamperfecto', 'Gladium ___.', 'Habías cogido la espada.'],
  // ── REDUPLICADO · el que faltaba ──
  ['la-6p-10', 'stō', '3sg', 'perfecto', 'In templo ___.', 'Estuvo de pie en el templo.'],
  ['la-6p-11', 'cadō', '3pl', 'perfecto', 'Verba ___.', 'Cayeron las palabras.'],
  ['la-6p-12', 'stō', '1sg', 'pluscuamperfecto', 'In agro ___.', 'Había estado de pie en el campo.'],

  // ── LA VARIANTE «-ēre», Y LOS DOS CASOS EN QUE NO SE DISTINGUE ──
  ['la-6p-13', 'videō', '3pl', 'perfecto', 'Reginam ___.', 'Vieron a la reina.', true],
  ['la-6p-14', 'legō', '3pl', 'perfecto', 'Verba ___.', 'Leyeron las palabras.', true],
];

const sinM = (s: string) => s.normalize('NFD').replace(/[̄̆]/g, '').normalize('NFC');

export const SEMILLA_DE_ORDEN = 1;

const FUENTE: ItemPerfectum[] = DEFS.map(([id, lema, persona, tiempo, marco, glosa, variante]) => {
  const verbo = V(lema);
  const vs = variantesDelPerfecto(verbo, persona, tiempo);
  const respuesta = variante ? vs[1]! : vs[0]!;
  const choca = variante && sinM(respuesta) === sinM(verbo.infinitivo);
  return {
    id, punto: 'l6-perfectum', verbo, persona, tiempo, marco, glosa, respuesta,
    ejes: {
      formacion: FORMACION[lema]!,
      ...(choca ? {
        chocaConElInfinitivo: `«${respuesta}» y el infinitivo «${verbo.infinitivo}» se escriben IGUAL sin la cantidad, y la cantidad no se escribe. No es que el alumno pueda confundirlos: es que la forma escrita no contiene la información`,
      } : {}),
    },
  };
});

export const LOTE_PERFECTUM = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

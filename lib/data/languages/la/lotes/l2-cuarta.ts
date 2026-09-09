// lib/data/languages/la/lotes/l2-cuarta.ts
//
// PRIMER LOTE DE LA 4.ª DECLINACIÓN. Punto: `l2-cuarta`.
//
// El punto: «manus/manūs, exercitus/exercitūs. El nominativo en `-us` es
// idéntico al de la segunda y sólo el genitivo los separa». `varia`: si el
// lema es masculino o de los pocos femeninos.
//
// ── LO QUE LA MEDICIÓN AÑADE AL PUNTO ────────────────────────────────
//
// La 4.ª no colapsa sólo contra la 2.ª: **colapsa consigo misma**, y eso es
// mucho más grave. Al quitar el macrón —que es como el alumno leerá los
// 227.301 tokens de su corpus— la forma escrita «manus» cubre SEIS celdas:
//
//     nom.sg · gen.sg · voc.sg · nom.pl · ac.pl · voc.pl
//
// Comparado con las otras declinaciones sobre el mismo cálculo:
//
//     servus (2.ª)   no pierde ninguna celda
//     rēx (3.ª)      no pierde ninguna
//     diēs (5.ª)     no pierde ninguna
//     puella (1.ª)   pierde una (puella / puellā)
//     manus (4.ª)    seis celdas en una sola forma escrita
//
// O sea que el punto se queda corto: dice que la cantidad es la única marca
// frente a la 2.ª, y la cantidad es además **la única marca dentro de la
// propia 4.ª**. El alumno que encuentre «manus» en un texto no puede saber,
// por la forma, si es sujeto, genitivo o plural. Cada ítem de este lote cuya
// celda colapse lo declara, y el gate lo exige.
//
// ── LO QUE ESTE LOTE NO PUEDE CUBRIR, dicho en vez de disimulado ─────
//
// El `varia` pide contrastar masculinos y femeninos, y de femeninos de 4.ª
// el lexicón tiene UNO: `manus`. El otro que el punto nombra, `domus`, es
// irregular —toma formas de 2.ª: ablativo «domō» ×66, acusativo plural
// «domōs» ×13— y se guarda entero, no se deriva. Así que el eje del género
// se cubre con cinco masculinos contra un femenino y eso no es un contraste
// equilibrado. Ampliar los femeninos de 4.ª pide meter `domus` como
// irregular, y es el siguiente paso, no una nota al pie.
import type { ItemDeclinacion } from '../../../../../scripts/lib/gate-declinacion';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import { NOMBRES_L1 } from '../lexicon-l1';
import { declinar, celdasQueColapsanDe } from './_ayuda-declinacion';

const N = (l: string) => NOMBRES_L1.find((x) => x.lema === l)!;

type Def = [id: string, lema: string, caso: ItemDeclinacion['caso'], num: 'sg' | 'pl',
            marco: string, glosa: string, pista: string];

const DEFS: Def[] = [
  ['la-2c-01', 'manus', 'nom', 'sg', '___ regis magna est.', 'La mano del rey es grande.', 'sujeto, singular'],
  ['la-2c-02', 'manus', 'ac', 'sg', 'Puella ___ videt.', 'La niña ve la mano.', 'objeto directo, singular'],
  ['la-2c-03', 'manus', 'gen', 'sg', 'Cura ___ magna est.', 'El cuidado de la mano es grande.', 'posesor, singular'],
  ['la-2c-04', 'exercitus', 'nom', 'sg', '___ agrum custodit.', 'El ejército guarda el campo.', 'sujeto, singular'],
  ['la-2c-05', 'exercitus', 'ac', 'sg', 'Rex ___ vocat.', 'El rey llama al ejército.', 'objeto directo, singular'],
  ['la-2c-06', 'exercitus', 'dat', 'sg', 'Dona ___ mittit.', 'Envía regalos al ejército.', 'destinatario, singular'],
  ['la-2c-07', 'senātus', 'gen', 'sg', 'Verba ___ audio.', 'Oigo las palabras del senado.', 'posesor, singular'],
  ['la-2c-08', 'senātus', 'abl', 'sg', 'Cum ___ ambulat.', 'Camina con el senado.', 'ablativo con «cum», singular'],
  ['la-2c-09', 'frūctus', 'ac', 'pl', 'Colonus ___ portat.', 'El colono lleva los frutos.', 'objeto directo, plural'],
  ['la-2c-10', 'frūctus', 'gen', 'pl', 'Cura ___ magna est.', 'El cuidado de los frutos es grande.', 'posesor, plural'],
  ['la-2c-11', 'metus', 'nom', 'sg', '___ magnus est.', 'El miedo es grande.', 'sujeto, singular'],
  ['la-2c-12', 'spīritus', 'abl', 'pl', 'Cum ___ est.', 'Está con los espíritus.', 'ablativo con «cum», plural'],
];

export const SEMILLA_DE_ORDEN = 1;

const FUENTE: ItemDeclinacion[] = DEFS.map(([id, lema, caso, numero, marco, glosa, pista]) => {
  const entrada = N(lema);
  const colapsa = celdasQueColapsanDe(entrada, caso, numero);
  return {
    id, punto: 'l2-cuarta', entrada, caso, numero, marco, glosa, pista,
    respuesta: declinar(entrada, caso, numero),
    ejes: {
      declinacion: '4ª' as const,
      ...(colapsa.length > 0 ? {
        colapsaAlLeer: `sin el macrón se escribe igual que ${colapsa.join(', ')}: en un texto real esta forma no dice cuál de esas celdas es`,
      } : {}),
    },
  };
});

export const LOTE_CUARTA = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

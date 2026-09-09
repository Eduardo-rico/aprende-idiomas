// lib/data/languages/la/lotes/l2-tercera-consonante.ts
//
// PRIMER LOTE DE LA 3.ª EN CONSONANTE. Punto: `l2-tercera-consonante`.
//
// «rēx/rēgis, corpus/corporis, iter/itineris, homō/hominis. El tema sale del
// genitivo y casi nunca del nominativo.» `varia`: «cuánto cambia el tema
// respecto al nominativo, de nada (cōnsul) a mucho (iter/itiner-)».
//
// ── EL EJE NO SE JUZGA, SE CUENTA ────────────────────────────────────
//
// «De nada a mucho» es medible: prefijo común entre nominativo y tema, más
// lo que sobra por cada lado. Medido sobre los 16 lemas de 3.ª del lexicón:
//
//     0   timor / timōris     el tema ES el nominativo
//     2   rēx / rēgis · lēx / lēgis · iūs / iūris · cīvitās / cīvitātis
//     3   homō / hominis · pater / patris · frāter / frātris
//     4   tempus / temporis · opus / operis · corpus / corporis · nōmen / nōminis
//
// Este lote recorre el eje entero, y el gate lo exige: sin un lema cuyo tema
// sea el nominativo y otro que se aleje de verdad, el `varia` es decorativo
// y ocho ítems miden un solo grado de opacidad.
//
// El extremo del descriptor, `iter/itineris` con coste 5, no está en el
// lexicón: cubrir la opacidad máxima pide meterlo, y es el siguiente paso de
// este punto.
import type { ItemDeclinacion } from '../../../../../scripts/lib/gate-declinacion';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import { NOMBRES_L1 } from '../lexicon-l1';
import { declinar, celdasQueColapsanDe } from './_ayuda-declinacion';

const N = (l: string) => NOMBRES_L1.find((x) => x.lema === l)!;

type Def = [id: string, lema: string, caso: ItemDeclinacion['caso'], num: 'sg' | 'pl',
            marco: string, glosa: string, pista: string];

const DEFS: Def[] = [
  // ── COSTE 0 · el tema es el nominativo, y eso es el otro extremo ──
  ['la-2t-01', 'timor', 'gen', 'sg', 'Causa ___ magna est.', 'La causa del miedo es grande.', 'posesor, singular'],
  ['la-2t-02', 'timor', 'ac', 'pl', 'Servus ___ portat.', 'El esclavo carga con los miedos.', 'objeto directo, plural'],

  // ── COSTE 2 ──
  ['la-2t-03', 'rēx', 'ac', 'sg', 'Populus ___ videt.', 'El pueblo ve al rey.', 'objeto directo, singular'],
  ['la-2t-04', 'rēx', 'dat', 'pl', 'Dona ___ mittit.', 'Envía regalos a los reyes.', 'destinatario, plural'],
  ['la-2t-05', 'lēx', 'gen', 'sg', 'Verba ___ audio.', 'Oigo las palabras de la ley.', 'posesor, singular'],
  ['la-2t-06', 'cīvitās', 'abl', 'sg', 'Cum ___ est.', 'Está con la ciudad.', 'ablativo con «cum», singular'],

  // ── COSTE 3 ──
  ['la-2t-07', 'homō', 'ac', 'sg', 'Regina ___ vocat.', 'La reina llama al hombre.', 'objeto directo, singular'],
  ['la-2t-08', 'homō', 'nom', 'pl', '___ verba audiunt.', 'Los hombres oyen las palabras.', 'sujeto, plural'],
  ['la-2t-09', 'frāter', 'dat', 'sg', 'Donum ___ mittit.', 'Envía un regalo al hermano.', 'destinatario, singular'],

  // ── COSTE 4 · el tema se aleja mucho ──
  ['la-2t-10', 'tempus', 'gen', 'sg', 'Cura ___ magna est.', 'El cuidado del tiempo es grande.', 'posesor, singular'],
  ['la-2t-11', 'corpus', 'nom', 'pl', '___ magna sunt.', 'Los cuerpos son grandes.', 'sujeto, plural'],
  ['la-2t-12', 'nōmen', 'abl', 'sg', 'Cum ___ est.', 'Está con el nombre.', 'ablativo con «cum», singular'],
];

export const SEMILLA_DE_ORDEN = 1;

const FUENTE: ItemDeclinacion[] = DEFS.map(([id, lema, caso, numero, marco, glosa, pista]) => {
  const entrada = N(lema);
  const colapsa = celdasQueColapsanDe(entrada, caso, numero);
  return {
    id, punto: 'l2-tercera-consonante', entrada, caso, numero, marco, glosa, pista,
    respuesta: declinar(entrada, caso, numero),
    ejes: {
      declinacion: '3ª' as const,
      ...(colapsa.length > 0 ? { colapsaAlLeer: `sin el macrón se escribe igual que ${colapsa.join(', ')}` } : {}),
    },
  };
});

export const LOTE_TERCERA_CONSONANTE = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

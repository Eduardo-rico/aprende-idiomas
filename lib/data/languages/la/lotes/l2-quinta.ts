// lib/data/languages/la/lotes/l2-quinta.ts
//
// PRIMER LOTE DE LA 5.ª DECLINACIÓN. Punto: `l2-quinta`.
//
// El `varia` del punto dice exactamente qué examinar: «la cantidad de la
// `e` del genitivo, larga tras vocal (diēī) y breve tras consonante (reī)».
//
// ── EL PUNTO DECLARABA UNA REGLA QUE LA MÁQUINA NO TENÍA ─────────────
//
// La tabla de la 5.ª tenía UN solo juego de terminaciones, así que producía
// `dieī` con `e` breve. El `varia` llevaba la regla escrita desde el
// principio y nadie la había implementado; lo destapó meter `diēs` en el
// lexicón, no una revisión. Ahora la máquina tiene los dos juegos y elige
// por el tema:
//
//     tema en consonante   rēs → reī · fidēs → fideī
//     tema en vocal        diēs → diēī · speciēs → speciēī
//
// Son sólo cuatro lemas de tema vocálico en toda la lengua, pero `diēs` sale
// 654 veces en el corpus: la tabla única fallaba justo en la única palabra
// de la 5.ª que el alumno va a leer de verdad.
//
// ── UNA NOTA SOBRE EL MACRÓN, QUE AQUÍ NO ESTORBA ────────────────────
//
// El eje de este punto ES la cantidad, y la cantidad no se lee en el texto.
// Pero el punto está declarado `via: produccion` y eso lo hace legítimo:
// producir con cantidad es cómo se aprende. Lo que NO se podría es montar
// sobre este eje un punto de recepción — «reconoce si la `e` es larga»— y
// conviene dejarlo dicho, porque la tentación existe y el material sí lleva
// macrones.
import type { ItemDeclinacion } from '../../../../../scripts/lib/gate-declinacion';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import { NOMBRES_L1 } from '../lexicon-l1';
import { declinar, celdasQueColapsanDe } from './_ayuda-declinacion';

const N = (l: string) => NOMBRES_L1.find((x) => x.lema === l)!;

type Def = [id: string, lema: string, caso: ItemDeclinacion['caso'], num: 'sg' | 'pl',
            marco: string, glosa: string, pista: string];

const DEFS: Def[] = [
  // ── TEMA EN CONSONANTE · la `e` breve ──
  ['la-2q-01', 'rēs', 'gen', 'sg', 'Cura ___ magna est.', 'El cuidado del asunto es grande.', 'posesor, singular'],
  ['la-2q-02', 'rēs', 'nom', 'sg', '___ magna est.', 'El asunto es grande.', 'sujeto, singular'],
  ['la-2q-03', 'rēs', 'ac', 'pl', 'Poeta ___ videt.', 'El poeta ve las cosas.', 'objeto directo, plural'],
  ['la-2q-04', 'rēs', 'abl', 'pl', 'Cum ___ est.', 'Está con las cosas.', 'ablativo con «cum», plural'],
  ['la-2q-05', 'fidēs', 'gen', 'sg', 'Verba ___ audio.', 'Oigo las palabras de la fe.', 'posesor, singular'],
  ['la-2q-06', 'fidēs', 'ac', 'sg', 'Discipulus ___ laudat.', 'El discípulo alaba la fe.', 'objeto directo, singular'],

  // ── TEMA EN VOCAL · la `e` larga ──
  ['la-2q-07', 'diēs', 'gen', 'sg', 'Cura ___ magna est.', 'El cuidado del día es grande.', 'posesor, singular'],
  ['la-2q-08', 'diēs', 'dat', 'sg', 'Donum ___ mittit.', 'Envía un regalo para el día.', 'destinatario, singular'],
  ['la-2q-09', 'diēs', 'abl', 'sg', 'Illo ___ tacet.', 'Aquel día calla.', 'ablativo, singular'],
  ['la-2q-10', 'diēs', 'ac', 'pl', 'Servus ___ exspectat.', 'El esclavo espera los días.', 'objeto directo, plural'],
  ['la-2q-11', 'speciēs', 'gen', 'sg', 'Cura ___ magna est.', 'El cuidado del aspecto es grande.', 'posesor, singular'],
  ['la-2q-12', 'speciēs', 'ac', 'sg', 'Poeta ___ laudat.', 'El poeta alaba el aspecto.', 'objeto directo, singular'],
];

export const SEMILLA_DE_ORDEN = 1;

const FUENTE: ItemDeclinacion[] = DEFS.map(([id, lema, caso, numero, marco, glosa, pista]) => {
  const entrada = N(lema);
  const colapsa = celdasQueColapsanDe(entrada, caso, numero);
  return {
    id, punto: 'l2-quinta', entrada, caso, numero, marco, glosa, pista,
    respuesta: declinar(entrada, caso, numero),
    ejes: {
      declinacion: '5ª' as const,
      ...(colapsa.length > 0 ? {
        colapsaAlLeer: `sin el macrón se escribe igual que ${colapsa.join(', ')}`,
      } : {}),
    },
  };
});

export const LOTE_QUINTA = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

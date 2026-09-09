// lib/data/languages/la/lotes/l2-tercera-i.ts
//
// PRIMER LOTE DE LOS TEMAS EN `-i`. Punto: `l2-tercera-i`.
//
// «Genitivo plural en `-ium`, acusativo plural en `-īs` posible, y ablativo
// singular en `-ī` en los neutros: mare/marī/maria/marium.» `varia`: «las
// tres marcas, QUE NO APARECEN TODAS EN CADA LEMA».
//
// ── EL AVISO DEL VARIA ES LITERAL, Y SE COMPRUEBA ────────────────────
//
// Comprobado contra la máquina, lema por lema:
//
//     mare (neutro)   marium · marī · maria     las tres
//     pars, urbs      partium, urbium           SÓLO el genitivo plural
//
// El ablativo en `-ī` y el nominativo plural en `-ia` son de los NEUTROS, y
// el acusativo en `-īs` es de los que NO son neutros. Así que ningún lema
// puede enseñar las cuatro, y un lote de un solo lema enseñaría una marca
// creyendo enseñar tres. Cada ítem declara cuál enseña y el gate lo
// contrasta contra lo que la máquina produce de verdad.
//
// ── EL ACUSATIVO EN `-īs`: ATESTIGUADO, Y MEDIDO ─────────────────────
//
// El punto lo llama «posible» y no es un mito de manual: sale **56 veces**
// en el corpus contra 1.386 en `-ēs`, o sea el **3,9 %** de los acusativos
// plurales de 3.ª — con «partīs» ×6, «cīvīs» ×3, «montīs» ×3. La máquina
// producía sólo la forma mayoritaria, así que sin añadir la variante este
// punto no podía cubrir su propio `varia`. Ahora `variantesDe` la da, y va
// declarada con su cuenta en vez de metida en la celda.
import type { ItemDeclinacion } from '../../../../../scripts/lib/gate-declinacion';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import { NOMBRES_L1 } from '../lexicon-l1';
import { declinar, celdasQueColapsanDe } from './_ayuda-declinacion';
import { variantesDe } from '../paradigma-la';

const N = (l: string) => NOMBRES_L1.find((x) => x.lema === l)!;

type Def = [id: string, lema: string, caso: ItemDeclinacion['caso'], num: 'sg' | 'pl',
            marco: string, glosa: string, pista: string,
            marcaI?: 'gen-pl-ium' | 'abl-sg-i' | 'nom-pl-ia' | 'ac-pl-is'];

const DEFS: Def[] = [
  // ── LA MARCA QUE TIENEN TODOS: genitivo plural en -ium ──
  ['la-2i-01', 'pars', 'gen', 'pl', 'Cura ___ magna est.', 'El cuidado de las partes es grande.',
   'posesor, plural', 'gen-pl-ium'],
  ['la-2i-02', 'urbs', 'gen', 'pl', 'Rex ___ dominus est.', 'El rey es señor de las ciudades.',
   'posesor, plural', 'gen-pl-ium'],
  ['la-2i-03', 'mare', 'gen', 'pl', 'Cura ___ magna est.', 'El cuidado de los mares es grande.',
   'posesor, plural', 'gen-pl-ium'],

  // ── LAS DOS QUE SÓLO TIENEN LOS NEUTROS ──
  ['la-2i-04', 'mare', 'abl', 'sg', 'In ___ est.', 'Está en el mar.',
   'ablativo con «in», singular', 'abl-sg-i'],
  ['la-2i-05', 'mare', 'nom', 'pl', '___ magna sunt.', 'Los mares son grandes.',
   'sujeto, plural', 'nom-pl-ia'],

  // ── LA QUE SÓLO TIENEN LOS QUE NO SON NEUTROS ──
  ['la-2i-06', 'pars', 'ac', 'pl', 'Poeta ___ videt.', 'El poeta ve las partes.',
   'objeto directo, plural', 'ac-pl-is'],
  ['la-2i-07', 'urbs', 'ac', 'pl', 'Exercitus ___ custodit.', 'El ejército guarda las ciudades.',
   'objeto directo, plural', 'ac-pl-is'],

  // ── CELDAS SIN MARCA, que son el contraste: un tema en -i no lo es en
  //    todas sus casillas, y creerlo produce *«parte» por «parte» ──
  ['la-2i-08', 'pars', 'ac', 'sg', 'Puella ___ videt.', 'La niña ve la parte.', 'objeto directo, singular'],
  ['la-2i-09', 'urbs', 'abl', 'sg', 'In ___ est.', 'Está en la ciudad.', 'ablativo con «in», singular'],
  ['la-2i-10', 'mare', 'ac', 'sg', 'Nauta ___ videt.', 'El marinero ve el mar.', 'objeto directo, singular'],
  ['la-2i-11', 'pars', 'dat', 'pl', 'Dona ___ mittit.', 'Envía regalos a las partes.', 'destinatario, plural'],
  ['la-2i-12', 'urbs', 'nom', 'pl', '___ magnae sunt.', 'Las ciudades son grandes.', 'sujeto, plural'],
];

export const SEMILLA_DE_ORDEN = 1;

const FUENTE: ItemDeclinacion[] = DEFS.map(([id, lema, caso, numero, marco, glosa, pista, marcaI]) => {
  const entrada = N(lema);
  const colapsa = celdasQueColapsanDe(entrada, caso, numero);
  return {
    id, punto: 'l2-tercera-i', entrada, caso, numero, marco, glosa, pista,
    // El ítem que enseña el acusativo en `-īs` responde la VARIANTE, no la
    // mayoritaria: responder «partēs» diciendo enseñar el `-īs` es enseñar
    // exactamente lo contrario, y el gate lo caza desde que mira la forma.
    respuesta: marcaI === 'ac-pl-is'
      ? variantesDe(entrada, caso, numero)[1]!
      : declinar(entrada, caso, numero),
    ejes: {
      declinacion: '3ª' as const,
      ...(marcaI ? { marcaI } : {}),
      ...(colapsa.length > 0 ? { colapsaAlLeer: `sin el macrón se escribe igual que ${colapsa.join(', ')}` } : {}),
    },
  };
});

export const LOTE_TERCERA_I = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

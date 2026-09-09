// lib/data/languages/la/lotes/l4-is-ea-id.ts
//
// PRIMER LOTE DE `is/ea/id`. Punto: `l4-is-ea-id`.
//
// Es el pronombre más frecuente del latín y su `varia` dice qué examinar:
// «el caso y el género, con atención a las formas que coinciden — `eius`
// sirve para los tres géneros».
//
// ── LO QUE CADA CELDA PUEDE EXAMINAR, MEDIDO ─────────────────────────
//
// De las 30 celdas usables de `is/ea/id`:
//
//     distinguen el NÚMERO   30 de 30   — siempre; no hay dónde fallar
//     distinguen el CASO     20 de 30
//     distinguen el GÉNERO   14 de 30
//
// El número es invariante del paradigma, así que un ítem que se acredite
// «número» no está midiendo gran cosa: lo trae igualmente. Lo que muerde es
// el género, y ahí está el sincretismo que el punto nombra: `eius`, `eī`,
// `eō`, `eōrum` valen para más de un género, y `eīs` no distingue ni género
// ni caso —dativo y ablativo plurales son la misma forma—.
//
// Este lote los trae A PROPÓSITO. No son ítems flojos: `eius` con 929
// apariciones es la forma más frecuente del corpus entero y el alumno la va
// a encontrar en cada página sin que la forma le diga de quién habla.
//
// ── EL MACRÓN: PRIMER LOTE CON LA POLÍTICA NUEVA ─────────────────────
//
// Decidida el 2026-09-09 tras medir que el corpus del alumno tiene CERO
// macrones en 227.301 tokens —con su control: el corpus SÍ conserva `ó é ú
// á ë í` y hasta el ápex de «monstrát», que es una marca de cantidad, así
// que el cero es del latín y no del treebank—.
//
//     el MARCO va sin macrones      · es como el alumno lo leerá
//     la RESPUESTA va con ellos     · producir con cantidad es cómo se aprende
//
// El gate lo comprueba en los dos sentidos. Una política que no se comprueba
// dura hasta el siguiente lote.
import type { ItemPronombre } from '../../../../../scripts/lib/gate-pronombre-paradigma';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import { declinarPronombre, PRONOMBRES_L1 } from '../pronombres-la';

const IS = PRONOMBRES_L1.find((e) => e.lema === 'is')!;

const NO_DICE_EL_GENERO = 'la forma vale para más de un género: quién sea sale del contexto, nunca de la desinencia';
const NO_DICE_EL_CASO = 'la misma forma sirve para dos casos, así que la función hay que sacarla de la frase';
const NI_GENERO_NI_CASO = '«eīs» es a la vez dativo y ablativo y vale para los tres géneros: de los tres ejes sólo deja leer el número';

type Def = [id: string, g: 'm' | 'f' | 'n', caso: ItemPronombre['caso'], num: 'sg' | 'pl',
            marco: string, glosa: string, pista: string,
            examina: ItemPronombre['ejes']['examina'], porQueNoLosOtros?: string];

const DEFS: Def[] = [
  // ── LAS CELDAS QUE DISTINGUEN LOS TRES EJES ──
  ['la-4i-01', 'm', 'nom', 'sg', '___ servum vocat.', 'Él llama al esclavo.',
   'sujeto, masculino singular', ['genero', 'numero', 'caso']],
  ['la-4i-02', 'm', 'ac', 'sg', 'Puella ___ videt.', 'La niña lo ve.',
   'objeto directo, masculino singular', ['genero', 'numero', 'caso']],
  ['la-4i-03', 'f', 'nom', 'sg', '___ rosas portat.', 'Ella lleva las rosas.',
   'sujeto, femenino singular', ['genero', 'numero', 'caso']],
  ['la-4i-04', 'f', 'ac', 'sg', 'Poeta ___ laudat.', 'El poeta la alaba.',
   'objeto directo, femenino singular', ['genero', 'numero', 'caso']],
  ['la-4i-05', 'm', 'nom', 'pl', '___ agrum custodiunt.', 'Ellos guardan el campo.',
   'sujeto, masculino plural', ['genero', 'numero', 'caso']],
  ['la-4i-06', 'm', 'ac', 'pl', 'Dominus ___ vocat.', 'El señor los llama.',
   'objeto directo, masculino plural', ['genero', 'numero', 'caso']],
  ['la-4i-07', 'f', 'nom', 'pl', '___ rosas portant.', 'Ellas llevan las rosas.',
   'sujeto, femenino plural', ['genero', 'numero', 'caso']],
  ['la-4i-08', 'f', 'abl', 'sg', 'Cum ___ ambulat.', 'Camina con ella.',
   'ablativo con «cum», femenino singular', ['genero', 'numero', 'caso']],

  // ── EL SINCRETISMO QUE EL PUNTO NOMBRA: «eius» para los tres géneros ──
  //
  // Los dos ítems tienen la MISMA respuesta y distinto género, que es
  // justamente lo que hay que ver. Con 929 apariciones es la forma más
  // frecuente del corpus, y ni una sola dice de quién habla.
  ['la-4i-09', 'm', 'gen', 'sg', 'Verba ___ audio.', 'Oigo sus palabras (de él).',
   'posesor, masculino singular', ['numero', 'caso'], NO_DICE_EL_GENERO],
  ['la-4i-10', 'f', 'gen', 'sg', 'Rosas ___ porto.', 'Llevo sus rosas (de ella).',
   'posesor, femenino singular', ['numero', 'caso'], NO_DICE_EL_GENERO],

  // ── LAS OTRAS CELDAS QUE COLAPSAN ──
  ['la-4i-11', 'm', 'dat', 'sg', 'Donum ___ mitto.', 'Le envío un regalo.',
   'destinatario, masculino singular', ['numero', 'caso'], NO_DICE_EL_GENERO],
  ['la-4i-12', 'm', 'gen', 'pl', 'Verba ___ audio.', 'Oigo sus palabras (de ellos).',
   'posesor, masculino plural', ['numero', 'caso'], NO_DICE_EL_GENERO],
  ['la-4i-13', 'm', 'dat', 'pl', 'Dona ___ mitto.', 'Les envío regalos.',
   'destinatario, masculino plural', ['numero'], NI_GENERO_NI_CASO],
  ['la-4i-14', 'n', 'nom', 'sg', '___ magnum est.', 'Eso es grande.',
   'sujeto, neutro singular', ['genero', 'numero'], NO_DICE_EL_CASO],
];

export const SEMILLA_DE_ORDEN = 1;

const FUENTE: ItemPronombre[] = DEFS.map(
  ([id, genero, caso, numero, marco, glosa, pista, examina, porQueNoLosOtros]) => ({
    id, punto: 'l4-is-ea-id', lema: 'is', genero, caso, numero, marco, glosa, pista,
    respuesta: declinarPronombre(IS, genero, caso, numero),
    ejes: { examina, ...(porQueNoLosOtros ? { porQueNoLosOtros } : {}) },
  }));

export const LOTE_IS_EA_ID = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

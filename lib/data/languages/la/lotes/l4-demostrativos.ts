// lib/data/languages/la/lotes/l4-demostrativos.ts
//
// PRIMER LOTE DE LOS DEMOSTRATIVOS. Punto: `l4-demostrativos`.
//
// El punto está declarado `falso-regalo`, y el motivo lo dice entero: los
// tres grados coinciden con «este/ese/aquel» EN EL LATÍN CLÁSICO, y ahí sí
// es un regalo deíctico. Pero la lectura de L1 es la VULGATA, y en ella
// `ille` e `ipse` ya no son deícticos: son el pronombre romance de tercera
// persona. Es el mismo `ille` del que salen «él» y «el».
//
// ── POR QUÉ UN LOTE SÓLO DE DEIXIS NO MEDIRÍA NADA ───────────────────
//
// Los tres demostrativos tienen EL MISMO patrón de sincretismo —comprobado
// celda a celda: `huius`/`istīus`/`illīus` no dicen el género, `hoc`/`istud`/
// `illud` no dicen el caso, `hīs`/`istīs`/`illīs` no dicen ninguno de los
// dos—, así que el punto no se juega en la tabla. Se juega en el GRADO.
//
// Y el grado, cuando la glosa dice «este», «ese» o «aquel», es **regalo
// puro**: el español tiene los tres y transfieren limpiamente. Un lote de
// pura deixis clásica enseñaría exactamente lo que el alumno ya sabe.
//
// Lo que mide es el otro grupo: las frases donde la glosa dice «él» y el
// instinto que busca «aquel» produce una lectura coherente y falsa. Medido
// en el corpus: **117 frases empiezan por «at ille»** —«y él dijo»—, `ille`
// aparece como sujeto 576 veces e `ipse` 355. Un alumno con la glosa escolar
// lee deixis distal o énfasis donde no hay ninguna de las dos.
//
// El gate exige los dos grupos y los cuenta por separado, con un renglón de
// cobertura que dice cuántos ítems miden de verdad.
//
// ── EL MACRÓN ────────────────────────────────────────────────────────
//
// Segundo lote con la política nueva: marco sin macrones, respuesta con
// ellos.
import type { ItemPronombre } from '../../../../../scripts/lib/gate-pronombre-paradigma';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import { declinarPronombre, PRONOMBRES_L1 } from '../pronombres-la';

const S = (l: string) => PRONOMBRES_L1.find((e) => e.lema === l)!;

const NO_DICE_EL_GENERO = 'el genitivo y el dativo del singular valen para los tres géneros en las tres series: es la marca pronominal, y no distingue nada';
const NO_DICE_EL_CASO = 'el neutro singular es la misma forma en nominativo y en acusativo';
const NI_UNO_NI_OTRO = 'el dativo y el ablativo plurales son la misma forma y valen para los tres géneros';

const ILLE_ES_EL = 'en la Vulgata «ille» no es «aquel» sino «él»: 117 frases del corpus empiezan por «at ille» —«y él dijo»— y el instinto que busca deixis distal produce una lectura coherente y falsa';
const IPSE_ES_EL = 'en la Vulgata «ipse» no es «él mismo» enfático sino el pronombre sujeto: sale 355 veces como sujeto, y leerlo como énfasis añade a la frase un matiz que no está';

type Def = [id: string, lema: string, g: 'm' | 'f' | 'n', caso: ItemPronombre['caso'], num: 'sg' | 'pl',
            marco: string, glosa: string, pista: string,
            examina: ItemPronombre['ejes']['examina'],
            porQueNoLosOtros?: string, elInstintoFalla?: { motivo: string }];

const DEFS: Def[] = [
  // ── DEIXIS CLÁSICA · el grado es regalo y no se acredita ──
  ['la-4d-01', 'hic', 'm', 'nom', 'sg', '___ servus rosas portat.', 'ESTE esclavo lleva las rosas.',
   'sujeto, masculino singular', ['genero', 'numero', 'caso']],
  ['la-4d-02', 'iste', 'm', 'ac', 'sg', 'Dominus ___ servum vocat.', 'El señor llama a ESE esclavo.',
   'objeto directo, masculino singular', ['genero', 'numero', 'caso']],
  ['la-4d-03', 'ille', 'f', 'nom', 'sg', '___ regina donum mittit.', 'AQUELLA reina envía el regalo.',
   'sujeto, femenino singular', ['genero', 'numero', 'caso']],
  ['la-4d-04', 'hic', 'f', 'ac', 'pl', 'Puella ___ rosas videt.', 'La niña ve ESTAS rosas.',
   'objeto directo, femenino plural', ['genero', 'numero', 'caso']],
  ['la-4d-05', 'ille', 'm', 'nom', 'pl', '___ discipuli verba audiunt.', 'AQUELLOS discípulos oyen las palabras.',
   'sujeto, masculino plural', ['genero', 'numero', 'caso']],
  ['la-4d-06', 'iste', 'n', 'nom', 'sg', '___ donum magnum est.', 'ESE regalo es grande.',
   'sujeto, neutro singular', ['genero', 'numero'], NO_DICE_EL_CASO],
  ['la-4d-07', 'hic', 'm', 'gen', 'sg', 'Verba ___ poetae audio.', 'Oigo las palabras de ESTE poeta.',
   'posesor, masculino singular', ['numero', 'caso'], NO_DICE_EL_GENERO],
  ['la-4d-08', 'ille', 'f', 'dat', 'pl', 'Dona ___ puellis mitto.', 'Envío regalos a AQUELLAS niñas.',
   'destinatario, femenino plural', ['numero'], NI_UNO_NI_OTRO],
  ['la-4d-09', 'iste', 'm', 'abl', 'sg', 'Cum ___ servo ambulat.', 'Camina con ESE esclavo.',
   'ablativo con «cum», masculino singular', ['numero', 'caso'], NO_DICE_EL_GENERO],

  // ── LA VULGATA · aquí el instinto falla y el grado SÍ se acredita ──
  //
  // La glosa dice «él» y no «aquel». El alumno que traduzca por deixis
  // distal produce una frase que se entiende y que dice otra cosa.
  ['la-4d-10', 'ille', 'm', 'nom', 'sg', 'At ___ respondit.', 'Y ÉL respondió.',
   'sujeto, masculino singular', ['genero', 'numero', 'caso', 'grado'],
   undefined, { motivo: ILLE_ES_EL }],
  ['la-4d-11', 'ille', 'f', 'nom', 'sg', 'At ___ tacet.', 'Y ELLA calla.',
   'sujeto, femenino singular', ['genero', 'numero', 'caso', 'grado'],
   undefined, { motivo: ILLE_ES_EL }],
  ['la-4d-12', 'ille', 'm', 'ac', 'sg', 'Rex ___ vocat.', 'El rey LO llama.',
   'objeto directo, masculino singular', ['genero', 'numero', 'caso', 'grado'],
   undefined, { motivo: ILLE_ES_EL }],
  ['la-4d-13', 'ipse', 'm', 'nom', 'sg', '___ verba audit.', 'ÉL oye las palabras.',
   'sujeto, masculino singular', ['genero', 'numero', 'caso', 'grado'],
   undefined, { motivo: IPSE_ES_EL }],
  ['la-4d-14', 'ille', 'm', 'nom', 'pl', 'At ___ tacent.', 'Y ELLOS callan.',
   'sujeto, masculino plural', ['genero', 'numero', 'caso', 'grado'],
   undefined, { motivo: ILLE_ES_EL }],
];

export const SEMILLA_DE_ORDEN = 1;

const FUENTE: ItemPronombre[] = DEFS.map(
  ([id, lema, genero, caso, numero, marco, glosa, pista, examina, porQueNoLosOtros, elInstintoFalla]) => ({
    id, punto: 'l4-demostrativos', lema, genero, caso, numero, marco, glosa, pista,
    respuesta: declinarPronombre(S(lema), genero, caso, numero),
    ejes: {
      examina,
      ...(porQueNoLosOtros ? { porQueNoLosOtros } : {}),
      ...(elInstintoFalla ? { elInstintoFalla } : {}),
    },
  }));

export const LOTE_DEMOSTRATIVOS = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

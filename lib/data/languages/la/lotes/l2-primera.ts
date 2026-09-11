// lib/data/languages/la/lotes/l2-primera.ts — LOTE DE `l2-primera`.
//
// EL HERMANO QUE FALTABA. `l2-segunda`, `l2-tercera-consonante`,
// `l2-tercera-i`, `l2-cuarta` y `l2-quinta` tenían lote; la PRIMERA no, y
// no era inocuo: es prerrequisito declarado de `l3-funcion-por-desinencia`
// —el punto central del curso—, que se publica igual con veinte ítems
// llenos de «puella», «amīcam» y «rēgīnās». El bloque «Sustantivo»
// enseñaba la 2.ª, la 3.ª y la 5.ª y DABA POR SABIDA la 1.ª. Lo encontró
// el latinista adversarial mirando otra cosa, que es como se encuentran
// los huecos: una pieza que falta se manifiesta como uniformidad —cuatro
// lecciones ordenadas, nada que chirríe— y nadie busca un hueco que
// parece una elección.
//
// ══ POR QUÉ ES UN LOTE DE PARADIGMA Y NO DE FUNCIÓN ══════════════════
//
// El punto decía `clase: 'funcion'` y mandaba poner el hueco en la GLOSA
// «para obligar a decidir la función con el contexto». Ese formato no
// puede medir eso, y el dictamen del 2026-09-11 lo demuestra con un
// teorema, no con una opinión: **una glosa española con un hueco fija por
// construcción qué categoría cabe ahí**. «La rosa ___ es hermosa» sólo
// admite un sintagma con «de»; «…da una rosa ___» sólo uno con «a»;
// «___ llevan las rosas» sólo un SN sin marca. El alumno lee el marco
// español, traduce el lema y encaja el determinante: techo de la
// estrategia ciega, 100 %, sin mirar una desinencia.
//
// Es «el suelo que pone la lengua» con el eje invertido: allí el español
// fusionaba lo que el latín distingue; aquí el latín fusiona («-ae» son
// cuatro celdas) lo que el español distingue (de / a / ∅).
//
// Y el arreglo obvio tampoco vale: dos palabras en «-ae» con dos huecos
// deja el ítem INDETERMINADO, porque las dos formas son idénticas y
// ninguna desinencia dice cuál es cuál. «Puellae rēgīnae rosās dant» es
// genuinamente ambiguo entre «las niñas dan rosas a la reina» y «las
// reinas dan rosas a la niña».
//
// Así que el sincretismo se EXHIBE aquí —en producción, escribiendo
// «-ae» en cuatro celdas distintas— y se RESUELVE en `l3-sincretismo`,
// que es de peldaño L2 y va detrás de `l3-funcion-por-desinencia`, o sea
// del punto que instala la operación.
//
// ══ DOCE ÍTEMS, UNO POR CELDA, Y ESO ES EL `varia` ═══════════════════
//
// La 1.ª tiene doce celdas y produce SIETE cadenas distintas: `-a`,
// `-am`, `-ae`, `-ā`, `-ās`, `-ārum`, `-īs`. Un ítem por celda cubre el
// paradigma entero, cumple el piso sin relleno, y hace que las cuatro
// celdas en «-ae» —gen.sg, dat.sg, nom.pl, voc.pl— aparezcan como lo que
// son: cuatro ejercicios distintos con la misma respuesta.
//
// ⚠ EL VOCATIVO PLURAL VA, y va por una razón medida: la versión anterior
// del punto decía «tres funciones» y son CUATRO celdas. `hypocritae` sale
// 10 veces, `scribae` 6, y `fīliae` como vocativo femenino plural en
// Lc 23:28 —con un lema del propio lexicón—. Dejarlo fuera habría
// enseñado que «-ae» es tres cosas cuando son cuatro.
//
// ══ LAS MINAS, TODAS DECLARADAS ANTES DE ESCRIBIR ════════════════════
//
//   · **`fīlia` NO entra en dativo ni ablativo plural.** La máquina
//     produce `fīliīs`, que colisiona con el de `fīlius`; el latín tiene
//     `fīliābus` (A&G §43.e, atestado ×2 en el corpus) y el paradigma no
//     lo conoce. Publicarlo sería enseñar una forma que la propia lectura
//     del curso contradice.
//   · **Los masculinos en `-a` entran, pero SIN NINGÚN ADJETIVO.**
//     `nauta`, `agricola` y `poēta` no son trampa para un hispanohablante
//     —«el poeta», «el mapa»— y son el extremo legítimo del eje «la forma
//     es de 1.ª y el género no». Pero en cuanto el ítem lleva un adjetivo
//     concordando, `nauta bonus` y no *`bona`* hace que mida la
//     concordancia por rasgos, que es `l4-concordancia`.
//   · **`rosa`, `terra`, `cūra` e `īra` no pueden ser destinatarios.** Son
//     inanimados: sirven de genitivo, de acusativo y de ablativo, no de
//     receptor.
//   · **Nada de `Rōma`.** Meterla añadiría el locativo `Rōmae` y
//     convertiría el sincretismo en cinco lecturas. Es una decisión
//     legítima, pero no se toma de refilón al escribir un lote.
//   · **El ablativo singular `-ā`** colapsa con el nominativo al perder el
//     macrón. Aquí es legítimo porque el lote es de PRODUCCIÓN —la glosa
//     dice cuál es— y va con su `colapsaAlLeer`, que el gate exige.
import type { ItemDeclinacion } from '../../../../../scripts/lib/gate-declinacion';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import { NOMBRES_L1 } from '../lexicon-l1';
import { declinar, celdasQueColapsanDe } from './_ayuda-declinacion';

const N = (l: string) => NOMBRES_L1.find((x) => x.lema === l)!;

type Def = [id: string, lema: string, caso: ItemDeclinacion['caso'], num: 'sg' | 'pl',
            marco: string, glosa: string, pista: string];

const DEFS: Def[] = [
  // ── SINGULAR ──
  ['la-2p-01', 'puella', 'nom', 'sg', '___ rosam portat.', 'La niña lleva una rosa.', 'sujeto, singular'],
  ['la-2p-02', 'amīca', 'ac', 'sg', 'Poeta ___ vocat.', 'El poeta llama a la amiga.', 'objeto directo, singular'],
  ['la-2p-03', 'rēgīna', 'gen', 'sg', 'Cura ___ magna est.', 'El cuidado de la reina es grande.', 'posesor, singular'],
  ['la-2p-04', 'vīcīna', 'dat', 'sg', 'Poeta rosam dat ___.', 'El poeta da una rosa a la vecina.', 'destinatario, singular'],
  ['la-2p-05', 'terra', 'abl', 'sg', 'In ___ habitat.', 'Vive en la tierra.', 'ablativo con «in», singular'],
  ['la-2p-06', 'domina', 'voc', 'sg', 'Salve, ___!', '¡Salud, señora!', 'vocativo, singular — en la 1.ª es igual que el nominativo'],

  // ── PLURAL ──
  ['la-2p-07', 'puella', 'nom', 'pl', '___ rosas portant.', 'Las niñas llevan unas rosas.', 'sujeto, plural'],
  ['la-2p-08', 'rosa', 'ac', 'pl', 'Agricola ___ videt.', 'El campesino ve unas rosas.', 'objeto directo, plural'],
  ['la-2p-09', 'amīca', 'gen', 'pl', 'Verba ___ audit.', 'Oye las palabras de las amigas.', 'posesor, plural'],
  ['la-2p-10', 'rēgīna', 'dat', 'pl', 'Nauta dona mittit ___.', 'El marinero envía unos regalos a las reinas.', 'destinatario, plural'],
  ['la-2p-11', 'cūra', 'abl', 'pl', 'Cum ___ laborat.', 'Trabaja con cuidados.', 'ablativo con «cum», plural'],
  ['la-2p-12', 'poēta', 'voc', 'pl', 'Audite, ___!', '¡Escuchad, poetas!', 'vocativo, plural — cuarta celda que comparte «-ae»'],
];

export const SEMILLA_DE_ORDEN = 1;

const FUENTE: ItemDeclinacion[] = DEFS.map(([id, lema, caso, numero, marco, glosa, pista]) => {
  const entrada = N(lema);
  const colapsa = celdasQueColapsanDe(entrada, caso, numero);
  return {
    id, punto: 'l2-primera', entrada, caso, numero, marco, glosa, pista,
    respuesta: declinar(entrada, caso, numero),
    ejes: {
      declinacion: '1ª' as const,
      ...(colapsa.length > 0 ? {
        colapsaAlLeer: `sin el macrón se escribe igual que ${colapsa.join(', ')}`,
      } : {}),
    },
  };
});

/** Las doce celdas del paradigma. Escritas aquí y comprobadas por el gate:
 *  si alguien quita un ítem, el lote deja de cubrir el paradigma y se
 *  entera. */
export const CELDAS_EXIGIDAS = [
  'nom.sg', 'ac.sg', 'gen.sg', 'dat.sg', 'abl.sg', 'voc.sg',
  'nom.pl', 'ac.pl', 'gen.pl', 'dat.pl', 'abl.pl', 'voc.pl',
];

export const LOTE_PRIMERA = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

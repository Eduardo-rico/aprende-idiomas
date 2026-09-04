// lib/data/languages/la/lotes/l5-futuro.ts
//
// PRIMER LOTE DE TRANSFORMACIÓN. Punto: `l5-futuro-dos-formas`.
//
// Se da una forma de presente y se pide el futuro. El punto dice, con sus
// palabras: «dos reglas presentadas como una es como se fabrica un error
// sistemático». Las dos son `-bō/-bi-` en la 1.ª y la 2.ª contra `-am/-ē-`
// en la 3.ª y la 4.ª, y las dos rutas ciegas son complementarias, así que
// seis y seis.
//
// ── LA RUTA EQUIVOCADA NO ES INVENTADA ────────────────────────────────
//
// El que aprende `amābit` y produce `dūcēbit` no se saca una regla de la
// manga: coge el imperfecto —`dūcēbat`, que sí existe— y le cambia la
// vocal, que es exactamente lo que funciona en la 1.ª. Por eso el error
// está a una letra de una forma real, y por eso el lote lo modela así en
// vez de con una forma imposible.
//
// ── Y EN DOS ÍTEMS EL ERROR **ES** UNA FORMA REAL ─────────────────────
//
// La ruta `-ē-` aplicada a un verbo de la 2.ª devuelve el PRESENTE:
// `videt`, `monent`. El alumno que se equivoca no obtiene una forma
// imposible sino una palabra correcta con otro tiempo, y si la busca la
// encuentra. Están declarados y el gate lo comprueba contra la máquina.
//
// Aviso: la comprobación **infrainforma**. `amet` —lo que da la ruta `-ē-`
// sobre `amō`— es el presente de subjuntivo, o sea una palabra latina, y
// la máquina todavía no tiene subjuntivo. Sale «no» siendo «sí».
// ── LAS PISTAS DICEN LA PERSONA Y EL NÚMERO, Y NADA MÁS ──────────────
//
// Dos de ellas nombraban la REGLA: «aquí NO va -bi-» decía la ruta
// perdedora, y «cuarta conjugación» daba el único dato que hay que
// deducir. El gate no las veía porque sólo comprobaba que la cadena de la
// respuesta no apareciera — y no aparecía: aparecía la regla.
//
// Las dos que avisan de una ambigüedad REAL de la lengua se quedan
// (`la-5f-02`, que el error da el presente; `la-5f-11`, que la forma
// coincide con el subjuntivo): ésas no dan la ruta, describen la trampa.
import type { ItemTransformacion } from '../../../../../scripts/lib/gate-transformacion';
import { VERBOS_L1 } from '../lexicon-l1';
import { conjugar, conjugacionDe, marcaDeFuturo, type Persona } from '../paradigma-la';
import { elErrorExiste } from '../../../../../scripts/lib/gate-transformacion';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';

const V = (l: string) => VERBOS_L1.find((x) => x.lema === l)!;

type Def = [id: string, lema: string, persona: Persona, pista: string];

const DEFS: Def[] = [
  // ── SEIS CON LA MARCA -bi- (1.ª y 2.ª) ──
  ['la-5f-01', 'amō', '3sg', 'Ama ahora; ¿y mañana? — tercera persona del singular.'],
  ['la-5f-02', 'videō', '3sg', 'Ve ahora; ¿y mañana? Ojo: la ruta equivocada devuelve el presente.'],
  ['la-5f-03', 'moneō', '3pl', 'Advierten ahora; ¿y mañana? — tercera del plural.'],
  ['la-5f-04', 'vocō', '2sg', 'Llamas ahora; ¿y mañana? — segunda del singular.'],
  ['la-5f-05', 'timeō', '1sg', 'Temo ahora; ¿y mañana? — primera del singular.'],
  ['la-5f-06', 'laudō', '1pl', 'Alabamos ahora; ¿y mañana? — primera del plural.'],

  // ── SEIS CON LA MARCA -am/-ē- (3.ª y 4.ª) ──
  ['la-5f-07', 'dūcō', '3sg', 'Guía ahora; ¿y mañana? — tercera persona del singular.'],
  ['la-5f-08', 'mittō', '3pl', 'Envían ahora; ¿y mañana? — tercera del plural.'],
  ['la-5f-09', 'audiō', '3sg', 'Oye ahora; ¿y mañana? — tercera persona del singular.'],
  ['la-5f-10', 'legō', '2sg', 'Lees ahora; ¿y mañana? — segunda del singular.'],
  ['la-5f-11', 'inveniō', '1sg', 'Encuentro ahora; ¿y mañana? La forma coincide con el presente de subjuntivo: sólo el contexto los separa.'],
  ['la-5f-12', 'custōdiō', '3pl', 'Guardan ahora; ¿y mañana? — tercera del plural.'],
];


// ── EL ORDEN PUBLICADO VA BARAJADO, Y NO ES UN DETALLE ────────────────
//
// Este fichero se escribe AGRUPADO por el eje del punto porque así se
// revisa. Pero `ExerciseRunner` sirve los ejercicios con `exercises[idx]`
// incremental, o sea **en el orden del fichero**, y agrupados el alumno
// resuelve el lote entero contando: «a partir del séptimo cambia la
// respuesta». El detector `separablePorPosicion` —en el repositorio desde
// portugués, y que ninguno de los gates de latín llamaba— lo confirma al
// 100 %.
//
// Se publica barajado con semilla fija: ni alternancia estricta, que el
// mismo detector caza por paridad, ni azar sin semilla, que haría el orden
// irreproducible.
export const SEMILLA_DE_ORDEN = 1;

const LOTE_FUTURO_FUENTE: ItemTransformacion[] = DEFS.map(([id, lema, persona, pista]) => {
  const verbo = V(lema);
  const item: ItemTransformacion = {
    id, punto: 'l5-futuro-dos-formas', verbo, persona,
    desde: 'presente', hacia: 'futuro',
    entrada: conjugar(verbo, persona, 'presente'),
    respuesta: conjugar(verbo, persona, 'futuro'),
    pista,
    ejes: { marca: marcaDeFuturo(verbo), conjugacion: conjugacionDe(verbo), elErrorExiste: false },
  };
  // Se DERIVA de la máquina en vez de escribirse a mano, y el gate lo
  // vuelve a comprobar por si alguien lo toca.
  item.ejes.elErrorExiste = elErrorExiste(item);
  return item;
});

/** El lote tal como se publica: barajado con `SEMILLA_DE_ORDEN`. */
export const LOTE_FUTURO = ordenPublicado(LOTE_FUTURO_FUENTE, SEMILLA_DE_ORDEN);

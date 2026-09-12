// lib/data/languages/la/lotes/l2-sin-articulo.ts
//
// EL LOTE DEL ARTÍCULO. Punto: `l2-sin-articulo`, 12 ítems.
//
// El latín no tiene artículo y el español lo exige, así que el alumno
// tiene que ponerlo — y el problema no es que lo omita, es que **lo suple
// siempre igual**. El `varia` del punto lo dice: las tres salidas tienen
// que aparecer.
//
// ── CUATRO Y CUATRO Y CUATRO, PORQUE EL EJE TIENE TRES VALORES ────────
//
// Es el primer punto de este curso que no se decide entre dos. Con tres
// salidas, cada ruta ciega se lleva un tercio y **el techo es 1/3**, no
// 1/2 — la identidad de siempre, generalizada: con k valores, 1/k.
//
// ── CÓMO SE HACE DECIDIBLE UN ARTÍCULO SIN CONTEXTO ───────────────────
//
// Una frase latina suelta NO determina el artículo español: `puella
// terram videt` es «una niña» o «la niña» según lo que se haya dicho
// antes. Así que el ítem trae el contexto y lo hace decidible:
//
//   · **indefinido** — el nombre del hueco NO salió antes.
//   · **definido** — el MISMO nombre vuelve en la segunda frase.
//   · **ninguno** — atributo con `sum`: «el señor es maestro», sin
//     artículo, que es donde el hispanohablante mete «un» sin darse
//     cuenta.
//
// ── TODOS LLEVAN DOS FRASES, Y ESO ES UN ARREGLO ──────────────────────
//
// La primera versión daba una sola frase a los indefinidos y a los
// atributos, y dos a los definidos — porque el contexto sólo hacía falta
// ahí. Con eso, **«si la frase es larga, pon el definido» acertaba 8 de
// 12 (p = 0,013)**: el alumno contaba frases en vez de leerlas.
//
// Ahora las doce llevan dos, y lo que decide es **si el nombre del hueco
// vuelve**. El ítem mejoró: antes bastaba ver la estructura, ahora hay que
// comprobar si ESA palabra ya estaba.
//
// Las dos reglas que deciden —«si lleva `est`, ninguno» y «si ya salió,
// definido»— NO entran en la lista de pistas: son lo que el punto enseña.
import type { ItemArticulo } from '../../../../../scripts/lib/gate-articulo';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';

export const SEMILLA_DE_ORDEN = 1;

// ⚠ EL HUECO SE TRAGA EL SUSTANTIVO desde el 2026-09-11, y por eso la
//   definición lleva ahora `sustantivo`. Antes el hueco caía sólo sobre el
//   artículo —«El señor es ___ maestro»— y la respuesta de los cuatro
//   ítems de valor «ninguno» era LA CADENA VACÍA: `FillBlankCard`
//   deshabilita el envío mientras un hueco esté vacío, así que eran
//   INCONTESTABLES, y el lote entero quedó apartado de la publicación.
//   Publicar sólo los otros ocho habría sido peor: un lote donde SIEMPRE
//   hay artículo es justo la falsedad que este punto existe para impedir.
//   La salida la dio el latinista adversarial y no cuesta producto: la
//   elección del alumno sigue siendo definido / indefinido / ninguno y el
//   techo ciego sigue siendo 1/3.
type Def = [id: string, latin: string, glosa: string, valor: ItemArticulo['ejes']['valor'],
            gen: 'm' | 'f', num: 'sg' | 'pl', sustantivo: string];

const DEFS: Def[] = [
  // ── PRIMERA MENCIÓN: indefinido. El nombre del hueco NO salió antes ──
  ['la-2a-01', 'Nauta terram videt. Puella rosam videt.', 'Un marinero ve la tierra. ___ ve una rosa.', 'indefinido', 'f', 'sg', 'niña'],
  ['la-2a-02', 'Puella rosam videt. Agricola agrum custōdit.', 'Una niña ve una rosa. ___ guarda un campo.', 'indefinido', 'm', 'sg', 'campesino'],
  ['la-2a-03', 'Colōnus agrōs custōdit. Medicus puerum vocat.', 'Un colono guarda unos campos. ___ llama a un niño.', 'indefinido', 'm', 'sg', 'médico'],
  ['la-2a-04', 'Magister discipulōs monet. Fīliī verba audiunt.', 'Un maestro advierte a unos discípulos. ___ oyen unas palabras.', 'indefinido', 'm', 'pl', 'hijos'],

  // ── SEGUNDA MENCIÓN: definido. El MISMO nombre vuelve ──
  ['la-2a-05', 'Nauta terram videt. Nauta rēgīnam vocat.', 'Un marinero ve la tierra. ___ llama a una reina.', 'definido', 'm', 'sg', 'marinero'],
  ['la-2a-06', 'Puella dōnum exspectat. Puella amīcam videt.', 'Una niña espera un regalo. ___ ve a una amiga.', 'definido', 'f', 'sg', 'niña'],
  ['la-2a-07', 'Colōnus agrōs custōdit. Colōnus magistrum audit.', 'Un colono guarda unos campos. ___ oye a un maestro.', 'definido', 'm', 'sg', 'colono'],
  ['la-2a-08', 'Puellae rosās vident. Puellae dōna exspectant.', 'Unas niñas ven unas rosas. ___ esperan unos regalos.', 'definido', 'f', 'pl', 'niñas'],

  // ── ATRIBUTO CON `sum`: ninguno. Aquí el hispanohablante mete «un» ──
  ['la-2a-09', 'Dominus servōs vocat. Dominus magister est.', 'Un señor llama a unos esclavos. El señor es ___.', 'ninguno', 'm', 'sg', 'maestro'],
  ['la-2a-10', 'Fīliae dōna exspectant. Fīliae amīcae sunt.', 'Unas hijas esperan unos regalos. Las hijas son ___.', 'ninguno', 'f', 'pl', 'amigas'],
  ['la-2a-11', 'Servus agrōs custōdit. Servus colōnus erat.', 'Un esclavo guarda unos campos. El esclavo era ___.', 'ninguno', 'm', 'sg', 'colono'],
  ['la-2a-12', 'Discipulī verba audiunt. Discipulī fīliī sunt.', 'Unos discípulos oyen unas palabras. Los discípulos son ___.', 'ninguno', 'm', 'pl', 'hijos'],
];

const FORMA = {
  definido: { msg: 'El', fsg: 'La', mpl: 'Los', fpl: 'Las' },
  indefinido: { msg: 'Un', fsg: 'Una', mpl: 'Unos', fpl: 'Unas' },
  ninguno: { msg: '', fsg: '', mpl: '', fpl: '' },
} as const;

const FUENTE: ItemArticulo[] = DEFS.map(([id, latin, glosa, valor, gen, num, sustantivo]) => ({
  id, punto: 'l2-sin-articulo', latin, glosa, sustantivo,
  // La forma se DERIVA del valor y de la concordancia, no se escribe a
  // mano: escribirla es una etiqueta encima de un dato. Y desde que el
  // hueco se traga el sustantivo, la respuesta es el SINTAGMA entero.
  respuesta: [FORMA[valor][`${gen}${num}` as 'msg'], sustantivo].filter(Boolean).join(' '),
  ejes: { valor, gen, num },
}));

export const LOTE_SIN_ARTICULO = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

// lib/data/languages/la/lotes/l5-irregulares.ts
//
// PRIMER LOTE DE LOS SEIS IRREGULARES. Punto: `l5-irregulares`.
//
// `varia`: «el verbo y la persona, cubriendo las formas más irregulares y
// no sólo la 1.ª singular». Ese aviso final no es retórico y la máquina lo
// confirma: de las 108 celdas de los seis verbos, **35 refutan la regla
// general** y **la 1.ª del singular no está en ninguna**, porque es el
// lema. Tampoco la 3.ª del plural: las seis acaban en `-unt`, que es lo que
// da la regla.
//
// Y de esas 35, **sólo 24 están atestiguadas** en los 227.301 tokens. Las
// otras once —`ītis`, `ībam`, `fertis`, `mālumus`, `fīmus`…— son formas de
// manual. Los doce ítems salen de las 24.
//
// ── LOS CINCO REGISTROS DE IRREGULARIDAD, UNO POR UNO ────────────────
//
//   01-03  `eō` es el único irregular FUERA del presente, y lo es entero:
//          sus doce celdas de imperfecto y futuro refutan la regla. El 03
//          trae el futuro en `-b-`, que es el de la 1.ª y la 2.ª, en un
//          verbo cuyo infinitivo `īre` parece de la 4.ª.
//   04-05  `ferō` pierde la vocal temática ante consonante: `fert`, `fers`.
//          No se puede pedir `fertis`, que sería el tercer caso de la misma
//          regla, porque no aparece nunca.
//   06-08  `volō` cambia de tema en la 2.ª y la 3.ª del singular —`vīs`,
//          `vult`— y conserva `-u-` donde la regla pide `-i-`: `volumus`,
//          no *`volimus`.
//   09-10  `nōlō` es el más raro de todos y por eso van sus dos caras: la
//          1.ª del plural es una palabra (`nōlumus`) y la 3.ª del singular
//          son DOS (`nōn vult`). Quien espere *`nōlit` se equivoca de forma
//          y de número de palabras a la vez.
//   11     `mālō` enseña de dónde sale: `māvult` es `magis` + `vult`, con
//          el segundo elemento asomando entero.
//   12     `fīō` sólo puede aparecer aquí en tercera persona. De sus cuatro
//          celdas examinables, `fit` es la única atestiguada; `fīs`,
//          `fīmus` y `fītis` no salen ni una vez.
//
// ── SIN PRONOMBRE SUJETO, Y NO ES UN DETALLE DE ESTILO ──────────────
//
// La primera versión decía `Tū corpus ___`, `Nōs gaudium ___`, `Vōs lēgem
// ___`. Es latín gramatical y estaba mal por dos motivos a la vez: el curso
// tiene un punto entero —`l5-pro-drop`— que enseña que el latín no pone
// esos pronombres salvo para contrastar, así que el lote modelaba como
// neutra la costumbre que otro punto le va a quitar al alumno; y además le
// regalaba la persona sin obligarle a leer la desinencia, que es lo único
// que este punto examina. El gate lo comprueba desde entonces.
//
// ── LA CUENTA DE `nōn vīs` NO ES LA DE `vīs` ─────────────────────────
//
// Las formas de `nōlō` con `nōn` suelto se cuentan por BIGRAMA. Contarlas
// por la palabra `vīs` les prestaría las 46 apariciones de `volō`; medido
// de verdad son 2. Un lote que presumiera de 46 estaría mintiendo con datos
// verdaderos.
import type { ItemIrregular } from '../../../../../scripts/lib/gate-irregulares';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';
import { IRREGULARES_L1 } from '../irregulares';
import type { Persona, Tiempo } from '../paradigma-la';

const V = (l: string) => IRREGULARES_L1.find((x) => x.lema === l)!;

type Def = [id: string, lema: string, tiempo: Tiempo, persona: Persona, respuesta: string,
            marco: string, pista: string, glosa: string];

const DEFS: Def[] = [
  // ── `eō` · el único irregular fuera del presente ──
  ['la-ir-01', 'eō', 'presente', '2sg', 'īs', 'Quō ___?',
   '2.ª persona del singular, presente', '¿Adónde vas?'],
  ['la-ir-02', 'eō', 'imperfecto', '3sg', 'ībat', 'Rēx ad urbem ___.',
   '3.ª persona del singular, imperfecto', 'El rey iba a la ciudad.'],
  ['la-ir-03', 'eō', 'futuro', '3pl', 'ībunt', 'Discipulī ad urbem ___.',
   '3.ª persona del plural, futuro', 'Los discípulos irán a la ciudad.'],

  // ── `ferō` · la vocal temática que cae ante consonante ──
  ['la-ir-04', 'ferō', 'presente', '3sg', 'fert', 'Puer gladium ___.',
   '3.ª persona del singular, presente', 'El niño lleva la espada.'],
  ['la-ir-05', 'ferō', 'presente', '2sg', 'fers', 'Cūr corpus ___?',
   '2.ª persona del singular, presente', '¿Por qué llevas el cuerpo?'],

  // ── `volō` · otro tema en el singular, y `-u-` donde la regla pide `-i-` ──
  ['la-ir-06', 'volō', 'presente', '3sg', 'vult', 'Dominus bellum ___.',
   '3.ª persona del singular, presente', 'El señor quiere la guerra.'],
  ['la-ir-07', 'volō', 'presente', '1pl', 'volumus', 'Gaudium ___.',
   '1.ª persona del plural, presente', 'Queremos la alegría.'],
  ['la-ir-08', 'volō', 'presente', '2pl', 'vultis', 'Lēgem ___?',
   '2.ª persona del plural, presente', '¿Queréis la ley?'],

  // ── `nōlō` · una palabra en el plural y DOS en el singular ──
  ['la-ir-09', 'nōlō', 'presente', '1pl', 'nōlumus', 'Timōrem ___.',
   '1.ª persona del plural, presente', 'No queremos el miedo.'],
  ['la-ir-10', 'nōlō', 'presente', '3sg', 'nōn vult', 'Rēx bellum ___.',
   '3.ª persona del singular, presente — y aquí el hueco lleva más de una palabra',
   'El rey no quiere la guerra.'],

  // ── `mālō` · de dónde sale la forma ──
  ['la-ir-11', 'mālō', 'presente', '3sg', 'māvult', 'Frāter virtūtem ___.',
   '3.ª persona del singular, presente', 'El hermano prefiere la virtud.'],

  // ── `fīō` · la única celda examinable que además existe ──
  ['la-ir-12', 'fīō', 'presente', '3sg', 'fit', 'Puer vir ___.',
   '3.ª persona del singular, presente', 'El niño se hace hombre.'],
];

export const SEMILLA_DE_ORDEN = 1;

const FUENTE: ItemIrregular[] = DEFS.map(([id, lema, tiempo, persona, respuesta, marco, pista, glosa]) => ({
  id, punto: 'l5-irregulares', verbo: V(lema), tiempo, persona, respuesta, marco, pista, glosa,
}));

export const LOTE_IRREGULARES = ordenPublicado(FUENTE, SEMILLA_DE_ORDEN);

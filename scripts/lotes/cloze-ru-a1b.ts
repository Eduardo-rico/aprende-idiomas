// scripts/lotes/cloze-ru-a1b.ts — EL SEGUNDO LOTE RUSO: cloze derivado, A1.
//
//   npx tsx scripts/lotes/cloze-ru-a1b.ts          # gates + tabla + rutas
//   npx tsx scripts/lotes/cloze-ru-a1b.ts --json   # ítems para publicar
//
// DIEZ ítems de `u7-conjugacion-i-ii` (A1, `paradigma` → cloze con pista,
// piso 8). La respuesta NO se escribe: la deriva `presente()` desde
// `lexicon-a1.ts`. El molde es `cloze-ru-a1.ts` y lo que cambia son los
// pares, los gates propios y las rutas predichas.
//
// ══ LO QUE ESTE LOTE EXAMINA, Y LO QUE DA POR DADO ═══════════════════
//
// `capas: { examina: 'conjugacion', dadas: ['grafia'] }`. Una sola capa
// dada, y eso cambia el diseño respecto al lote 1:
//
//   · **LA PERSONA VA DADA EN LA LENGUA, no sólo en la pista**: el marco
//     lleva el PRONOMBRE SUJETO delante del hueco (`Я`, `Ты`, `Они`) y es el
//     `ancla` declarada. La pista la repite. Si la persona no fuera dada, el
//     ítem no estaría determinado y el alumno podría fallar por algo que
//     este punto no enseña.
//   · **EL TIEMPO VA DADO EN LA PISTA**, y hace falta de verdad: `Я ___
//     (читать) каждый день` admite `читал` sin la palabra «presente», y
//     `каждый день` es compatible con el pasado. Es el mismo trabajo que
//     hacía la etiqueta del caso en el lote 1.
//   · **LA GRAFÍA va dada** por prerrequisito (`u1-ortografia-sibilantes`),
//     y eso tiene una consecuencia que va dicha en vez de disimulada:
//     `пишу` y `вижу` no se escriben `*пишю`/`*вижю` por la regla de la
//     sibilante, que es capa DADA. O sea que parte del contraste visible de
//     los pares 2 y 3 lo resuelve un prerrequisito, igual que en el lote 1
//     lo resolvía el pareo `ы↔и` en tres de seis pares. Lo que pertenece a
//     ESTE punto es que el tema sea `пиш-` y `виж-` y no `писа-` y `виде-`.
//
// ══ LO QUE LA MEDICIÓN CAMBIÓ DEL DISEÑO, ANTES DE ESCRIBIR UN ÍTEM ══
//
// ⚠ **LA CLASE CASI NO SE PUEDE AISLAR, Y ES UN HECHO DE LA LENGUA Y NO UNA
// LIMITACIÓN DEL LEXICÓN.** Un par que contrastara SÓLO la clase necesita dos
// verbos con el mismo final de infinitivo, clases distintas y los dos con el
// tema derivable del infinitivo. En `lexicon-a1.ts` no existe, y al buscar por
// qué sale el motivo: **la conjugación II forma el tema sobre la raíz desnuda y
// pierde la vocal temática del infinitivo** (`говор-ить`→`говор-`,
// `вид-еть`→`вид-`, `держ-ать`→`держ-`; АГ-80 §1554 ss.), mientras la I en
// `-ать` la conserva (`чита-`). Así que dentro de cada terminación, clase y
// derivabilidad van juntas: **el final del infinitivo predice la clase**.
//
// ⚠ Y LA PRECISIÓN QUE EL LINGÜISTA AÑADIÓ Y QUE NO ES LA MISMA COSA (A-4,
// 2026-09-13): la «derivabilidad» que este fichero mide es un artefacto de que
// `temaIngenuo` quita TRES letras a `-ить` y DOS a `-ать/-еть`, o sea que la
// función **codifica** la generalización en vez de comprobarla. Coincide con el
// hecho de la lengua y no es el hecho de la lengua, y la diferencia importa el
// día que alguien cambie la función.
//
// ⚠ Y LA CIFRA SE CORRIGIÓ HACIA ARRIBA. La v0 decía «la regla escolar acierta
// la clase en 9 de 10». Lo que acierta 9 de 10 es la regla que este fichero
// EJECUTA («`-ить`/`-еть` ⇒ II»), que no es la de los manuales: la de РКИ y de
// la escuela rusa es «`-ить` ⇒ II salvo брить, жить, пить, бить, шить, лить,
// вить; `-еть`/`-ать` ⇒ I salvo los once memorizados» (Хавронина–Широченская;
// Розенталь §172), y ésa acierta la clase en **10 de 10** — `жить` está DENTRO
// de su lista de excepciones. Medido además: implementada con sus dos listas
// acierta también **4 de 10** formas, o sea que la mala especificación es INERTE
// para el tope. Lo que cambia es la lectura: **la clase no es «casi gratis»,
// es gratis**, y la frontera del par 1 mide al alumno que vio la regla y no
// aprendió la lista — un error real de las primeras semanas y no el del alumno
// que terminó el capítulo. Eso es menos de lo que la v0 prometía y va escrito.
//
// La consecuencia de diseño no es subir ningún tope (§4.35: eso falsea el
// termómetro) sino **acotar el punto a lo que no es gratis: el TEMA.** Cinco
// de los diez ítems llevan un tema que el infinitivo no da (`жив-`, `пиш-`
// ×2, `виж-`, `вид-`). Y está medido, no razonado: la tabla de rutas de abajo
// imprime que **conocer la clase de verdad no añade ni un acierto sobre la
// regla de la terminación**.
//
// ══ A-3 · EL ÍTEM 2 CARGA LA CAPA `acento`, Y `capas` NO LA DECLARA ══
//
// `живёшь` se escribe con `ё` porque la desinencia es TÓNICA
// (`acento2sgDesinencial: true`): la `ё` no es una letra que se elija, es el
// reflejo gráfico del acento. `u7-conjugacion-i-ii` declara
// `capas: { examina: 'conjugacion', dadas: ['grafia'] }` y `acento` no está ni
// examinada ni dada. Lo cazó el lingüista (A-3), y es el mismo hallazgo que él
// firmó el 2026-09-11 contra `u7-imperativo-forma`, cuyo `abierto` dice que los
// tres dueños de `acento` están a `pisoCero`.
//
// **No se arregla añadiendo `acento` a `dadas`**, y esto hay que saberlo antes
// de intentarlo: el invariante de `tests/unit/inventario-ru.test.ts` exige que
// toda capa DADA tenga dueño PRODUCIBLE, y `acento` no lo tiene — añadirla
// pondría el inventario en rojo, y con razón. Lo que de verdad neutraliza la
// capa es `variantesSinYo()`: la tarjeta acepta `живешь`, así que **el alumno no
// puede fallar este ítem por no saber dónde cae el acento**. La capa está
// cargada y desactivada, y el sitio donde eso vive es un CAMPO —el `motivo` de
// la frontera del ítem 2— y no un comentario.
//
// ══ A-6 · EVIDENCIA NEGATIVA: LA LONGITUD DEL INFINITIVO NO ES EXPLOTABLE ══
//
// La midió el lingüista y se guarda para que nadie la reproponga. Los
// infinitivos de tema derivable son más largos (`говорить` 8, `читать` 6,
// `помнить` 7, `работать` 8; media 7,25) que los de tema no derivable (`жить` 4,
// `писать` 6 ×2, `видеть` 6 ×2, `ждать` 5; media 5,5), y el umbral «≥7 letras ⇒
// tema derivable» separa limpiamente cinco ítems. **No es explotable en cloze**:
// la ruta «≥7 → tema ingenuo + regla de la terminación; ≤6 → tabla I» da 4/10,
// porque en los cinco de longitud 6 el cue dice «no uses el tema ingenuo» y no
// dice cuál usar. ⚠ Pero **este molde se reutiliza**: en una versión de elección
// múltiple el cue sería determinista sobre la mitad del lote. Es tipográfico, o
// sea de la familia que en rumano ganó tres veces al autor.
//
// ══ A-7 · UNA INCOHERENCIA DE ATRIBUCIÓN QUE ES DEL LEXICÓN Y NO DE AQUÍ ══
//
// `lexicon-a1.ts` anota `брать` con «alternancia бра-/бер-, **que es la de
// `u13-alternancias-raiz` vista desde el presente**». `ждать`→`жд-` y
// `жить`→`жив-` son el mismo fenómeno y la misma clase no productiva (con
// `звать/зов-`, `стлать/стел-`): pérdida o alternancia de la vocal radical. Si
// `брать` lleva etiqueta u13, los ítems 2, 7 y 8 la llevan también. Y la
// `descripcion` del punto declara las alternancias **consonánticas**
// (`писать→пишу`, `любить→люблю`), que son los ítems 3, 5, 9 y 10. No se
// resuelve aquí porque **reasignar un ítem sólo cambia a qué punto le miente**:
// la etiqueta está puesta en un lema y no en sus hermanos, y eso es incoherencia
// del lexicón. Queda escrito para que el siguiente no lo redescubra.
//
// ══ DOS ÍTEMS DE FRONTERA, Y POR QUÉ AQUÍ SON DOS ════════════════════
//
// El lote 1 exige UNO, con su motivo escrito: dos habrían hecho de «no tocar
// la forma» una estrategia con dos aciertos. Aquí la razón no aplica, porque
// las dos fronteras son la sobreaplicación de DOS REGLAS DISTINTAS y ninguna
// se contesta copiando:
//
//   · `clase-por-infinitivo` — `жить` acaba en `-ить` y es de la I. Quien
//     aplique la regla escolar escribe `*живишь`. Su distractor está escrito
//     AL LADO, en el mismo par: `говоришь`.
//   · `no-alternancia-en-1sg` — el error que la literatura РКИ documenta como
//     el frecuente en la II con mutación es **no aplicar** la alternancia:
//     `*видю`, `*любю`, `*просю`. Lo mide el ítem 5, y su distractor es su
//     pareja de par: `помнить`, misma clase, mismo final y sin alternancia.
//     **Esta frontera la trajo el lingüista y la v0 no la declaraba**, mientras
//     declaraba en cambio la dirección contraria dos ítems después.
//   · `alcance-de-la-alternancia` — `вижу` alterna sólo en la 1.ª sg y la 2.ª
//     vuelve a `вид-` (`видишь`). Quien aprenda `вижу` escribe `*вижишь`, y su
//     pareja de par es `пишешь`, donde la alternancia SÍ corre por todo el
//     paradigma. ⚠ **Pero ese error lo produce un anglófono y no ESTE alumno**:
//     «veo/ves» y sobre todo «vejo/vês» le dan el patrón «mutación sólo en la
//     1.ª» en el mismo verbo. Se queda por dos razones medidas y ninguna es
//     «mide su error» — ver su `motivo`.
//
// El gate no cuenta fronteras: exige que cada una declare **de qué regla es
// la sobreaplicación**, que ninguna regla se repita, y —la parte que el
// dictamen D4 del lote 1 costó— que **el distractor de cada frontera sea
// ALCANZABLE**, o sea que la forma que licencia la analogía equivocada sea la
// respuesta de otro ítem del lote. Una frontera cuyo distractor no está en el
// lote mide un error que el alumno no puede producir.
//
// ══ LO QUE NO ESTÁ AQUÍ, CON SU MOTIVO ══════════════════════════════
//
//   · **Ningún verbo PERFECTIVO, y va en gate.** El presente de un
//     perfectivo significa FUTURO (`u7-futuro-compuesto-simple`, el punto de
//     al lado), así que un ítem con `сказать` mediría `aspecto` y no
//     `conjugacion`. `сказать` está en el lexicón y el gate lo caza.
//   · **Ningún verbo `irregular`.** `мочь` y los suyos son
//     `u7-irregulares-frecuentes`, que es A2, y su forma se guarda entera: el
//     ítem mediría `lexico`. En gate.
//   · **Ningún verbo reflexivo.** La alternancia `-ся/-сь` es
//     `u7-reflexivo-sya`, otro punto del mismo bloque, y su capa es la
//     ortográfica. En gate.
//   · **Ninguna casilla de 2.ª plural (`-ете`/`-ите`) ni de 1.ª plural.** No
//     por diseño sino por aritmética: con cinco pares y tres personas no
//     caben, y añadir una cuarta persona sin par la dejaría suelta. Es hueco
//     de cobertura declarado, no error: la desinencia de la 2.ª pl es la
//     misma regla que la de la 2.ª sg más la marca de plural.
//   · **La rama de la `ё` de la I aparece UNA vez** (`живёшь`) y no dos: es
//     dato del lexicón (`acento2sgDesinencial`), no regla, así que un segundo
//     ítem mediría `lexico`.
import { VERBOS_A1 } from '../../lib/data/languages/ru/lexicon-a1';
import {
  presente, temaIngenuo,
  type PersonaRu, type EntradaVerbal,
} from '../../lib/data/languages/ru/paradigma-ru';
import { revisarOrtografiaRu, quitarAcento, variantesSinYo } from '../../lib/lang/ortografia-ru';
import { buscar, corpus, INI, FIN } from '../corpus-ru';
import { candidatasConYo } from '../check-paradigma-ru';

/** De qué regla es la sobreaplicación un ítem de frontera. Es un tipo cerrado
 *  y no una cadena libre: el gate exige que no se repita, y con cadena libre
 *  dos redacciones de la misma regla pasarían como dos reglas. */
export type ReglaSobreaplicada =
  | 'clase-por-infinitivo'
  | 'no-alternancia-en-1sg'
  | 'alcance-de-la-alternancia';

/** El eje que el PAR contrasta. Se declara y el gate lo COMPRUEBA contra el
 *  lexicón: un eje declarado que no es cierto es el motivo escrito falso, que
 *  pasa el gate igual que uno verdadero si nadie lo recomputa. */
export type EjeRu = 'clase' | 'tema' | 'tema-1sg' | 'alcance';

export interface ClozeVerboRu {
  p: string;
  /** El infinitivo, tal como está en `lexicon-a1.ts`. La respuesta se DERIVA. */
  lema: string;
  persona: PersonaRu;
  /** La frase, con `___` y el infinitivo entre paréntesis. */
  s: string;
  /** La pista: NOMBRA el tiempo y la persona —lo dado— y no dice nada de la
   *  clase ni del tema, que es lo que examina. */
  pista: string;
  /** El PRONOMBRE SUJETO, literal y delante del hueco: es lo que fija la
   *  persona en la lengua y no sólo en la pista. */
  ancla: string;
  par?: string;
  eje?: EjeRu;
  frontera?: { regla: ReglaSobreaplicada; motivo: string };
}

export const ITEMS: ClozeVerboRu[] = [
  // ── PAR 1 · LA CLASE NO SE LEE EN EL INFINITIVO — y su frontera ───────
  // Los dos infinitivos acaban en `-ить` y son de clases distintas.
  // `говоришь` 509 · `живёшь` 15 · `живешь` 142 · `очень хорошо` 540.
  { p: 'u7-conjugacion-i-ii', lema: 'говорить', persona: '2sg', par: 'clase-horosho', eje: 'clase',
    s: 'Ты очень хорошо ___ (говорить).', pista: 'hablar — presente de 2.ª singular', ancla: 'Ты' },
  // ⚠ Y UN DETALLE MEDIDO QUE NO SE ADIVINA: `temaIngenuo('жить')` devuelve
  // **`ж-`**, no `жи-`, porque la regla quita las TRES letras de `-ить`. O sea
  // que la ruta ciega no produce `*жиишь` sino `*жишь`, que es todavía más
  // lejos de la respuesta. El número no cambia y la prosa sí: escribir `*жиишь`
  // habría sido citar una forma que ningún instrumento de este lote produce.
  { p: 'u7-conjugacion-i-ii', lema: 'жить', persona: '2sg', par: 'clase-horosho', eje: 'clase',
    s: 'Ты очень хорошо ___ (жить).', pista: 'vivir — presente de 2.ª singular', ancla: 'Ты',
    frontera: {
      regla: 'clase-por-infinitivo',
      motivo: 'LA SOBREAPLICACIÓN DE LA REGLA ESCOLAR (§0.6). «-ить/-еть ⇒ conjugación II» acierta la clase en 9 de los 10 ítems de este lote —la tabla de rutas lo imprime— y `жить` es el único verbo de la I en `-ить` de todo `lexicon-a1.ts`: quien la aplique escribe *живишь. Su distractor está escrito AL LADO, en el otro ítem del mismo par (говоришь), que es la mejor posición posible para un ítem de frontera. Y el ítem carga además el tema no derivable (жив-, que el infinitivo no da) y la rama de la ё de la conjugación I: no es un contraste limpio de clase, y eso va dicho en vez de prometido.',
    },
  },

  // ── PAR 2 · EL TEMA ALTERNA O NO, con el mismo final de infinitivo ────
  // Los dos son de la I y acaban en `-ать`: lo único que los separa es que
  // `писать` tiene el tema `пиш-` y `читать` el tema ingenuo `чита-`. Es el
  // par que mide el contenido declarado del punto («lo único nuevo es
  // CUÁLES»). `пишу` 199 · `читаю` 121 · `каждый день` 715 · `*писаю` 0.
  { p: 'u7-conjugacion-i-ii', lema: 'писать', persona: '1sg', par: 'tema-kazhdyj', eje: 'tema',
    s: 'Я ___ (писать) каждый день.', pista: 'escribir — presente de 1.ª singular', ancla: 'Я' },
  { p: 'u7-conjugacion-i-ii', lema: 'читать', persona: '1sg', par: 'tema-kazhdyj', eje: 'tema',
    s: 'Я ___ (читать) каждый день.', pista: 'leer — presente de 1.ª singular', ancla: 'Я' },

  // ── PAR 3 · LA ALTERNANCIA SÓLO DE LA 1.ª SINGULAR ───────────────────
  // Los dos son de la II. `видеть` alterna `д→ж` y SÓLO en la 1.ª sg
  // (`вижу`, pero `видишь`); `помнить` no alterna. `вижу` 1921 · `помню`
  // 1511 · `её лицо` 11.
  //
  // ⚠ Y el contraste visible de este par está DOBLEMENTE determinado: `вижу`
  // se escribe `-у` y no `-ю` por la regla de la sibilante, que es capa DADA.
  // Lo que pertenece a este punto es que `видеть` TENGA un tema de 1.ª sg, no
  // cómo se escribe su desinencia. Es la misma lectura que el lote 1 tuvo que
  // corregir en su propia cabecera, y aquí va escrita de entrada.
  { p: 'u7-conjugacion-i-ii', lema: 'видеть', persona: '1sg', par: 'tema1sg-lico', eje: 'tema-1sg',
    s: 'Я ___ (видеть) её лицо.', pista: 'ver — presente de 1.ª singular', ancla: 'Я',
    frontera: {
      regla: 'no-alternancia-en-1sg',
      motivo: 'LA FRONTERA QUE FALTABA, y la trajo el lingüista adversarial (A-5, 2026-09-13). El error que la literatura РКИ documenta como el frecuente en la conjugación II con mutación NO es sobreaplicar la alternancia: es NO APLICARLA — *видю, *любю, *просю, *ездю—, porque la 1.ª sg es la casilla marcada e impredecible y todas las demás llevan el tema desnudo. Ese error lo mide este ítem, y su distractor está en el otro ítem del par: `помнить`, que tiene la MISMA clase, el MISMO final de infinitivo y NO alterna, así que la analogía «el tema no cambia» se presenta escrita al lado. La v0 no lo declaraba frontera y declaraba en cambio la dirección contraria dos ítems después, que es la que este alumno no puede cometer.',
    },
  },
  { p: 'u7-conjugacion-i-ii', lema: 'помнить', persona: '1sg', par: 'tema1sg-lico', eje: 'tema-1sg',
    s: 'Я ___ (помнить) её лицо.', pista: 'recordar — presente de 1.ª singular', ancla: 'Я' },

  // ── PAR 4 · EL TEMA PIERDE SU VOCAL, O NO — en la 3.ª plural ─────────
  // Los dos son de la I y acaban en `-ать`, como el par 2, pero la casilla es
  // otra y la alternancia es de otra clase: `ждать` PIERDE la vocal (`жд-`) y
  // `работать` la conserva (`работа-`). `ждут` 195 · `работают` 53 ·
  // `уже давно` 371.
  //
  // ⚠ EL MARCO DE LA v0 ERA `Они ___ целый день` Y NO ERA IDÉNTICO EN LOS DOS
  // ÍTEMS, aunque G13 lo aprobara: la identidad de CADENA no es identidad de
  // ANÁLISIS. `ждать` es transitivo y rige acusativo (`ждать ответ`), así que
  // `целый день` en el primer ítem es ambiguo entre acusativo de DURACIÓN
  // (АГ-80 §1969) y OBJETO DIRECTO («esperan un día entero»), y en el segundo
  // sólo puede ser duración. O sea que la propiedad que el par promete
  // constante —el papel sintáctico del complemento— **variaba con el verbo**,
  // que es la clase exacta de fuga que el par de marco existe para cerrar. Lo
  // cazó el lingüista adversarial (A-2, 2026-09-13), y el corpus lo respalda:
  // `ждут целый день` 0 · `ждать целый день` 0 · `ждали целый день` 1, frente a
  // `целый день` 379 — la ausencia no prohíbe, pero con la ambigüedad
  // estructural delante es motivo suficiente.
  //
  // Arreglado QUITANDO EL SINTAGMA NOMINAL, no cambiándolo: `уже давно` es
  // adverbial en los dos y no admite lectura de objeto con ningún verbo, así que
  // el problema no puede volver por otro lema. Y la lección que se transfiere:
  // **un gate que compara cadenas no puede ver que dos marcos idénticos tengan
  // análisis distintos**, así que el marco de un par no debe contener un
  // sintagma que alguno de los dos verbos pueda regir.
  { p: 'u7-conjugacion-i-ii', lema: 'ждать', persona: '3pl', par: 'tema-uzhe', eje: 'tema',
    s: 'Они ___ (ждать) уже давно.', pista: 'esperar — presente de 3.ª plural', ancla: 'Они' },
  { p: 'u7-conjugacion-i-ii', lema: 'работать', persona: '3pl', par: 'tema-uzhe', eje: 'tema',
    s: 'Они ___ (работать) уже давно.', pista: 'trabajar — presente de 3.ª plural', ancla: 'Они' },

  // ── PAR 5 · EL ALCANCE DE LA ALTERNANCIA — y la segunda frontera ─────
  // El par que da sentido al 2 y al 3: `пиш-` corre por TODO el paradigma
  // (`пишу`, `пишешь`) y `виж-` vive SÓLO en la 1.ª sg (`вижу`, pero
  // `видишь`). Sin los dos, «el tema alterna» es una regla a la que le falta
  // la mitad del alcance. `видишь` 944 · `пишешь` 57 · `это каждый день` 3.
  { p: 'u7-conjugacion-i-ii', lema: 'видеть', persona: '2sg', par: 'alcance-eto', eje: 'alcance',
    s: 'Ты ___ (видеть) это каждый день.', pista: 'ver — presente de 2.ª singular', ancla: 'Ты',
    frontera: {
      regla: 'alcance-de-la-alternancia',
      motivo: '⚠ LA FRONTERA CUYO VALOR DISCRIMINANTE PARA ESTE ALUMNO ES BAJO, Y VA DICHO EN VEZ DE PROMETIDO. La regla es real —el alcance de la alternancia es léxico: `пиш-` (su pareja de par) corre por todo el paradigma y `виж-` no sale de la 1.ª singular— y su distractor es alcanzable (el ítem 5). Pero el error que mide, *вижишь, lo produce un anglófono y NO este alumno: el español y el portugués tienen exactamente el patrón «mutación sólo en la 1.ª sg» en el MISMO verbo — «veo / ves» y sobre todo «vejo / vês», con cambio de consonante en la 1.ª y sólo ahí. `вижу / видишь` es isomorfo de `vejo / vês`, así que la L1 y la L2 le entregan la respuesta. Lo cazó el lingüista adversarial (A-5, 2026-09-13) y es el §0.1 en su forma más limpia. Se queda por DOS razones medidas y ninguna es «mide el error del alumno»: es la segunda cara de su propio par (el mejor sitio donde puede estar un ítem de frontera) y es el ÚNICO ítem del lote que ningún perfil de conocimiento parcial acierta, lo que la tabla de rutas imprime. La frontera que sí mide el error del alumno es el ítem 5.',
    },
  },
  { p: 'u7-conjugacion-i-ii', lema: 'писать', persona: '2sg', par: 'alcance-eto', eje: 'alcance',
    s: 'Ты ___ (писать) это каждый день.', pista: 'escribir — presente de 2.ª singular', ancla: 'Ты' },
];

const VERB = new Map(VERBOS_A1.map((v) => [v.lema, v]));

export function entradaDe(x: ClozeVerboRu): EntradaVerbal | undefined { return VERB.get(x.lema); }

/** LA RESPUESTA, DERIVADA por `presente()`. */
export function respuestaDe(x: ClozeVerboRu): string | null {
  const v = entradaDe(x);
  return v ? presente(v, x.persona) : null;
}

/** Las respuestas correctas ALTERNATIVAS, calculadas y nunca declaradas.
 *  Hoy sólo la variante sin ё, que se acepta porque la biblioteca escribe
 *  `живешь` 142 veces frente a 15 de `живёшь` y el comparador del producto no
 *  pliega la ё. Ver `variantesSinYo`. */
export function alternativasDe(x: ClozeVerboRu): string[] {
  const r = respuestaDe(x);
  return r ? variantesSinYo(r) : [];
}

const PERSONA_ES: Record<PersonaRu, string> = {
  '1sg': '1.ª singular', '2sg': '2.ª singular', '3sg': '3.ª singular',
  '1pl': '1.ª plural', '2pl': '2.ª plural', '3pl': '3.ª plural',
};
/** El pronombre sujeto que corresponde a cada persona. Es la tabla que el
 *  gate usa para comprobar que el marco y la persona declarada dicen lo
 *  mismo: sin ella, un ítem con `Ты` y `persona: '1sg'` sale limpio y queda
 *  indeterminado. */
const PRONOMBRE: Record<PersonaRu, string[]> = {
  '1sg': ['я'], '2sg': ['ты'], '3sg': ['он', 'она', 'оно'],
  '1pl': ['мы'], '2pl': ['вы'], '3pl': ['они'],
};

const sinParentesis = (s: string) => s.replace(/\([^)]*\)/g, ' ');
const PALABRA = (w: string) => new RegExp(`(?<![\\p{L}])${w}(?![\\p{L}])`, 'iu');
/** ¿Usa la forma el tema de 1.ª singular del verbo? Es lo que separa `вижу`
 *  de `видишь` sin mirar la cadena a mano. */
const usaTema1sg = (v: EntradaVerbal, forma: string) =>
  v.tema1sg !== undefined && quitarAcento(forma).startsWith(v.tema1sg);
/** ¿Es el tema de presente el que el infinitivo daría? `temaIngenuo` existe
 *  para esto y sólo para esto: decirle al invariante qué habría pasado sin el
 *  dato. */
const temaEsIngenuo = (v: EntradaVerbal) => temaIngenuo(v.lema) === v.temaPresente;

export function verificar(items: ClozeVerboRu[]): string[] {
  const v: string[] = [];
  const vistas = new Set<string>();
  const porPunto = new Map<string, Map<string, number>>();

  for (const [i, x] of items.entries()) {
    const id = `CLRUV-${String(i + 1).padStart(3, '0')} (${x.lema} ${x.persona})`;
    const e = entradaDe(x);
    if (!e) { v.push(`${id}: «${x.lema}» no está en lexicon-a1.ts`); continue; }

    // ⚠ LOS TRES GATES DE EXCLUSIÓN VAN ANTES DE ABANDONAR POR `null`, por el
    // §0.8 rumano: `presente()` devuelve `null` para un irregular al que le
    // falta la casilla, y si el gate del irregular fuera después del
    // `continue` no llegaría a correr nunca. Son comprobaciones
    // INDEPENDIENTES y no pueden compartir un `continue`.
    if (e.aspecto === 'pf')
      v.push(`${id}: «${x.lema}» es PERFECTIVO — su presente significa futuro y el ítem mediría u7-futuro-compuesto-simple, no u7-conjugacion-i-ii`);
    if (e.irregular)
      v.push(`${id}: «${x.lema}» está marcado irregular — su forma se guarda entera y el ítem mediría u7-irregulares-frecuentes (A2), que es «lexico»`);
    if (e.reflexivo)
      v.push(`${id}: «${x.lema}» es reflexivo — la alternancia -ся/-сь es u7-reflexivo-sya y el ítem cargaría esa capa`);

    const r = respuestaDe(x);
    if (!r) { v.push(`${id}: la máquina devuelve null para esa casilla — no se inventa una forma plausible`); continue; }
    const alt = alternativasDe(x);

    // G1 · un solo hueco.
    const huecos = x.s.split('___').length - 1;
    if (huecos !== 1) v.push(`${id}: ${huecos} huecos, tiene que haber 1`);
    // G2 · el infinitivo, entre paréntesis y escrito igual.
    if (!new RegExp(`\\(\\s*${x.lema}\\s*\\)`).test(x.s)) v.push(`${id}: la frase no nombra el infinitivo «${x.lema}» entre paréntesis`);
    // G3 · la pista NOMBRA lo dado (tiempo y persona) y NO lo examinado.
    if (!x.pista.includes('presente'))
      v.push(`${id}: la pista no nombra el TIEMPO — sin «presente» el hueco admite el pasado (Я читал каждый день) y el ítem no está determinado`);
    if (!x.pista.includes(PERSONA_ES[x.persona]))
      v.push(`${id}: la pista no nombra la persona «${PERSONA_ES[x.persona]}»`);
    if (/(conjugaci[oó]n|primera|segunda|\bI+\b|tema|alternancia|sibilante)/i.test(x.pista))
      v.push(`${id}: la pista nombra la CLASE o el TEMA, que es justo lo que el ítem examina`);
    // G3c · la pista tiene forma canónica. Cualquier variación tipográfica de
    //       la glosa es una pista del significante, y el lote 1 la cometió
    //       («femenino EN RUSO» en dos de once) con la marca posada justo
    //       sobre el par que contrastaba.
    if (!new RegExp(`^[^()—]+ — presente de (${Object.values(PERSONA_ES).join('|')})$`).test(x.pista))
      v.push(`${id}: la pista «${x.pista}» no tiene la forma canónica «<glosa> — presente de <persona>»`);
    // G4 · el ancla es el PRONOMBRE y está DELANTE del hueco: un pronombre
    //      que sólo viviera en el campo no fija ninguna persona.
    if (!x.ancla.trim()) v.push(`${id}: sin ancla declarada`);
    else if (!PALABRA(x.ancla).test(x.s.split('___')[0] ?? ''))
      v.push(`${id}: el ancla «${x.ancla}» no aparece delante del hueco`);
    // G5 · EL PRONOMBRE DEL MARCO CONCUERDA CON LA PERSONA DECLARADA. Sin
    //      esto, `Ты` con `persona: '1sg'` sale limpio y el ítem queda
    //      indeterminado: el alumno lee el pronombre y la clave dice otra cosa.
    if (!PRONOMBRE[x.persona].includes(x.ancla.toLowerCase()))
      v.push(`${id}: el ancla «${x.ancla}» no es el pronombre de ${PERSONA_ES[x.persona]} (${PRONOMBRE[x.persona].join('/')})`);
    // G6 · la pista no deletrea la respuesta.
    for (const cand of [r, ...alt]) if (PALABRA(quitarAcento(cand)).test(x.pista)) v.push(`${id}: la pista deletrea la respuesta «${cand}»`);
    // G7 · la respuesta no está escrita en la frase fuera del paréntesis.
    if (PALABRA(r).test(sinParentesis(x.s).replace('___', ' '))) v.push(`${id}: la respuesta «${r}» ya está escrita en la frase`);
    // G8 · la respuesta no puede ser el infinitivo: sería `copiar-el-lema`.
    if (quitarAcento(r) === quitarAcento(x.lema)) v.push(`${id}: la respuesta coincide con el infinitivo — se contesta copiando`);
    // G9 · EL ERROR SIMÉTRICO DE LA Ё. Toda respuesta con ё tiene que aceptar
    //      la grafía sin ё, porque el comparador del producto NO la pliega y
    //      la biblioteca escribe живешь 142 veces frente a 15 de живёшь: sin
    //      la alternativa se suspende a quien teclea lo que ha leído.
    if (r.includes('ё') && alt.length === 0)
      v.push(`${id}: la respuesta «${r}» lleva ё y no declara la variante sin ё — exigir sólo la forma con ё suspende a quien escribe el ruso atestado de la biblioteca`);
    // G10 · y la mitad contraria: si la respuesta lleva `е` donde la lengua
    //       escribe `ё`, la máquina está produciendo OTRA palabra.
    for (const c of candidatasConYo(r)) v.push(`${id}: la respuesta «${r}» tiene variante con ё atestada («${c.forma}» ${c.n}) — la regla del proyecto es producir con ё siempre`);
    // G11 · ortografía y homóglifos en todo lo que el alumno ve.
    for (const [campo, t] of [['frase', x.s], ['pista', x.pista], ['respuesta', r], ['alternativas', alt.join(' ')]] as const)
      for (const h of revisarOrtografiaRu(t)) v.push(`${id}: ortografía en ${campo}: «${h.palabra}» (${h.clase})`);
    // G12 · toda respuesta atestada.
    if (buscar(quitarAcento(r)).n === 0) v.push(`${id}: la respuesta «${r}» no aparece ni una vez en 7,7 M de palabras`);

    const m = porPunto.get(x.p) ?? new Map<string, number>();
    m.set(r, (m.get(r) ?? 0) + 1); porPunto.set(x.p, m);
    const clave = x.s.replace(/\s+/g, ' ').trim().toLowerCase();
    if (vistas.has(clave)) v.push(`${id}: frase repetida dentro del lote`);
    vistas.add(clave);
  }
  for (const [p, m] of porPunto) for (const [r, k] of m) if (k > 1) v.push(`${p}: la respuesta «${r}» sale ${k} veces`);

  // G13 · LOS PARES DE MARCO. A n = 10 la nula por permutación no rechaza
  //       nada (§4.41 rumano, medido a n = 8 con p = 0,076 sobre un atajo
  //       PLANTADO al 100 %), así que no se corre. Lo que protege al lote es
  //       que dentro de un par toda propiedad del marco sea CONSTANTE, y eso
  //       sólo vale si el marco es literalmente el mismo y las dos respuestas
  //       difieren.
  const pares = new Map<string, ClozeVerboRu[]>();
  for (const x of items) if (x.par) { const a = pares.get(x.par) ?? []; a.push(x); pares.set(x.par, a); }
  for (const x of items) if (!x.par) v.push(`${x.lema} ${x.persona}: ítem sin par de marco`);
  for (const [k, xs] of pares) {
    if (xs.length !== 2) { v.push(`par «${k}»: ${xs.length} ítems — un par de marco son DOS`); continue; }
    const [a, b] = xs as [ClozeVerboRu, ClozeVerboRu];
    const marco = (x: ClozeVerboRu) => x.s.replace(`(${x.lema})`, '(·)');
    if (marco(a) !== marco(b)) v.push(`par «${k}»: los dos marcos no son idénticos («${marco(a)}» / «${marco(b)}»)`);
    if (a.persona !== b.persona) v.push(`par «${k}»: los dos ítems no están en la misma persona`);
    if (a.lema === b.lema) v.push(`par «${k}»: el mismo lema en los dos ítems`);
    const ra = respuestaDe(a), rb = respuestaDe(b);
    if (ra && rb && quitarAcento(ra) === quitarAcento(rb)) v.push(`par «${k}»: las dos respuestas son «${ra}» — el par no contrasta nada`);
    if (a.eje !== b.eje) v.push(`par «${k}»: los dos ítems declaran ejes distintos («${a.eje}» / «${b.eje}»)`);
    // ⚠ G14 · EL EJE DECLARADO SE RECOMPUTA CONTRA EL LEXICÓN. Exigir un
    //       motivo escrito garantiza que el motivo EXISTA, nunca que sea
    //       cierto: un juicio falso pasa el gate igual que uno verdadero
    //       (§4.33 rumano, y en rumano pasó en el estreno de la máquina). Aquí
    //       el eje no es prosa: es una propiedad de las dos entradas del
    //       lexicón, y se comprueba.
    const ea = entradaDe(a), eb = entradaDe(b);
    if (ea && eb) {
      const eje = a.eje;
      if (eje === 'clase' && ea.clase === eb.clase)
        v.push(`par «${k}»: declara eje «clase» y los dos verbos son de la conjugación ${ea.clase}`);
      if (eje === 'tema' && temaEsIngenuo(ea) === temaEsIngenuo(eb))
        v.push(`par «${k}»: declara eje «tema» y los dos temas son ${temaEsIngenuo(ea) ? 'derivables del infinitivo' : 'NO derivables'} — el eje no varía`);
      if (eje === 'tema-1sg' && (ea.tema1sg !== undefined) === (eb.tema1sg !== undefined))
        v.push(`par «${k}»: declara eje «tema-1sg» y los dos verbos ${ea.tema1sg ? 'tienen' : 'no tienen'} tema de 1.ª singular — el eje no varía`);
      if (eje === 'alcance') {
        const soloEn1sg = (z: EntradaVerbal) => z.tema1sg !== undefined;
        const enTodoElParadigma = (z: EntradaVerbal) => z.tema1sg === undefined && !temaEsIngenuo(z);
        if (!((soloEn1sg(ea) && enTodoElParadigma(eb)) || (soloEn1sg(eb) && enTodoElParadigma(ea))))
          v.push(`par «${k}»: declara eje «alcance» y no hay un verbo que alterne SÓLO en la 1.ª sg frente a otro que alterne en TODO el paradigma`);
      }
    }
  }
  // G15 · TODO EJE DECLARADO EXISTE, y el eje «tema» no puede ser el único:
  //       un lote de un solo eje tiene cobertura real 1, por muchos ítems que
  //       tenga (§4.25 rumano).
  const ejes = new Set(items.map((x) => x.eje).filter(Boolean));
  if (ejes.size < 3) v.push(`el lote declara ${ejes.size} ejes distintos (${[...ejes].join(', ')}) — con menos de tres la cobertura real no llega al piso`);

  // G16 · LAS FRONTERAS. No se cuentan: se comprueba que cada una declare de
  //       QUÉ regla es la sobreaplicación, que ninguna regla se repita y que
  //       su DISTRACTOR SEA ALCANZABLE. Lo último es el dictamen D4 del lote
  //       1 vuelto invariante: allí la frontera estaba suelta y el error que
  //       documenta la literatura РКИ (*дверю, por analogía con книгу) no se
  //       podía producir porque el lote no tenía un solo acusativo de 1.ª
  //       declinación. Una frontera sin su distractor en el lote mide un error
  //       que el alumno no puede cometer.
  const fronteras = items.filter((x) => x.frontera);
  if (fronteras.length === 0) v.push('el lote no declara ni un ítem de frontera — sin él el alumno sobregeneraliza y saca 10/10 (§0.6)');
  const reglas = new Set<string>();
  for (const x of fronteras) {
    const f = x.frontera!;
    if (reglas.has(f.regla)) v.push(`${x.lema} ${x.persona}: dos fronteras sobreaplican la misma regla «${f.regla}» — la segunda no añade cobertura`);
    reglas.add(f.regla);
    if (f.motivo.length < 120) v.push(`${x.lema} ${x.persona}: el motivo de la frontera es demasiado corto para decir qué error produce la regla`);
    const e = entradaDe(x);
    if (!e) continue;
    if (f.regla === 'clase-por-infinitivo') {
      // El distractor es la forma del OTRO verbo del par: el que la regla
      // escolar sí acierta. Si el par no lo trae, la analogía no se presenta.
      const pareja = items.find((y) => y !== x && y.par === x.par);
      const ep = pareja ? entradaDe(pareja) : undefined;
      if (!ep || ep.clase === e.clase)
        v.push(`${x.lema}: frontera «clase-por-infinitivo» sin distractor alcanzable — el par tiene que traer el verbo donde la regla escolar SÍ acierta`);
      const ingenua = /(ить|еть)$/.test(quitarAcento(x.lema)) ? 2 : 1;
      if (ingenua === e.clase)
        v.push(`${x.lema}: frontera «clase-por-infinitivo» en un verbo donde la regla escolar ACIERTA la clase — no es una sobreaplicación`);
    }
    if (f.regla === 'no-alternancia-en-1sg') {
      // El ítem tiene que USAR el tema de 1.ª sg (o no hay nada que dejar de
      // aplicar) y su pareja de par tiene que ser un verbo que NO alterne: sin
      // ella la analogía «el tema no cambia» no se presenta, y es el mismo
      // invariante de distractor alcanzable con el signo contrario.
      const r = respuestaDe(x);
      if (e.tema1sg === undefined || !r || !usaTema1sg(e, r))
        v.push(`${x.lema}: frontera «no-alternancia-en-1sg» sobre una casilla que no usa el tema de 1.ª singular — no hay alternancia que dejar de aplicar`);
      const pareja = items.find((y) => y !== x && y.par === x.par);
      const ep = pareja ? entradaDe(pareja) : undefined;
      if (!ep || ep.tema1sg !== undefined)
        v.push(`${x.lema}: frontera «no-alternancia-en-1sg» sin distractor alcanzable — el par tiene que traer un verbo de la misma clase que NO alterne`);
    }
    if (f.regla === 'alcance-de-la-alternancia') {
      if (e.tema1sg === undefined)
        v.push(`${x.lema}: frontera «alcance-de-la-alternancia» en un verbo sin tema de 1.ª singular — no hay alcance que sobreaplicar`);
      const r = respuestaDe(x);
      if (r && usaTema1sg(e, r))
        v.push(`${x.lema}: la respuesta «${r}» USA el tema de 1.ª singular — la frontera es la casilla donde NO se usa`);
      const fuente = items.find((y) => y.lema === x.lema && y !== x && (() => { const rr = respuestaDe(y); return !!rr && usaTema1sg(e, rr); })());
      if (!fuente)
        v.push(`${x.lema}: frontera «alcance-de-la-alternancia» sin distractor alcanzable — la forma con el tema de 1.ª sg (вижу) tiene que ser la respuesta de otro ítem del lote`);
    }
  }

  // G17 · LA FUGA ENTRE ÍTEMS, que ningún gate por ítem puede ver. El lote 1
  //       la pagó: su marco empezaba por `Утром`, que es el instrumental de
  //       `утро`, o sea la respuesta-patrón de otro par escrita dos ítems
  //       antes. Aquí las desinencias que se miran son las VERBALES
  //       inequívocas.
  //
  //       ⚠ Y LO QUE ESTE GATE NO MIRA, escrito en vez de supuesto: `-ю`,
  //       `-у`, `-ем` y `-ат` quedan fuera. `-ю`/`-у` son también acusativo e
  //       instrumental de la 1.ª declinación (`книгу`, `душу`); `-ем` es
  //       instrumental de la 2.ª blanda (`учителем`); `-ат` es la desinencia
  //       verbal tras sibilante y también el genitivo plural de un puñado de
  //       nombres. Un gate que las marcara marcaría medio lote por ruido, y un
  //       gate ruidoso es un gate apagado.
  const DESINENCIAS_VERBALES = ['ешь', 'ишь', 'ёшь', 'ете', 'ите', 'ют', 'ят'];
  const respuestas = new Set(items.map((x) => respuestaDe(x)).filter(Boolean).map((r) => quitarAcento(r!).toLowerCase()));
  for (const x of items) {
    const marco = sinParentesis(x.s).replace('___', ' ');
    for (const w of marco.split(/[^\p{L}]+/u).filter((t) => t.length >= 4)) {
      const wl = quitarAcento(w).toLowerCase();
      if (respuestas.has(wl)) { v.push(`${x.lema} ${x.persona}: el marco contiene «${w}», que es la RESPUESTA de otro ítem del lote`); continue; }
      const des = DESINENCIAS_VERBALES.find((d) => wl.endsWith(d));
      if (des && [...respuestas].some((r) => r.endsWith(des)))
        v.push(`${x.lema} ${x.persona}: el marco contiene «${w}», que acaba en «-${des}» — la misma desinencia verbal que la respuesta de otro ítem, y eso es una pista del significante entre ítems`);
    }
  }

  return v;
}

// ══════════════════════════════════════════════════════════════════════
// LAS RUTAS, CON SU NÚMERO PREDICHO ESCRITO ANTES DE CORRER
// ══════════════════════════════════════════════════════════════════════
//
// ⚠ EL NÚMERO PREDICHO NO ES ADORNO: ES EL ÚNICO TESTIGO POSIBLE. Un gate
// muerto se caza con un testigo rojo; una RUTA muerta no, porque su «rojo» es
// acertar y acertar poco es justo lo que se busca. Un cero puede ser «no hay
// fuga» o «mi simulación se apagó», y son cosas opuestas — en rumano pasó
// tres veces y en el lote 1 ruso la predicción escrita cazó una diferencia de
// uno. `tests/unit/cloze-ru-a1b.test.ts` compara la predicción con lo
// observado y comprueba además que cada ruta devuelve algo distinto de `null`
// donde debe aplicarse.
//
// `correr()` construye la VISTA DEL ALUMNO: la ruta no recibe la respuesta ni
// la entrada del lexicón, así que no puede leerlas «ni con un `as`». La
// persona la lee de la PISTA y del pronombre, que es donde el alumno la tiene.
//
// ══ TRES LISTAS, PORQUE SON TRES PREGUNTAS ══════════════════════════
//
//   · `ESTRATEGIAS` — rutas CIEGAS: el alumno las ejecuta sin haber aprendido
//     nada de ESTE punto, porque lo que necesitan lo trae de sus dos lenguas
//     o de cualquier manual. Van contra el tope del 50 %.
//   · `PERFILES` — conocimiento PARCIAL: presuponen la clase o el tema, que
//     son el contenido del punto. **No van contra ningún tope**; su número
//     dice cuántos ítems discriminan y cuáles.
//   · `RUTAS_POR_LECTURA` — la del alumno que ha leído las 2.180 lecturas.
//
// ⚠ Y LA RAZÓN POR LA QUE «LA REGLA ESCOLAR» VA EN LAS CIEGAS Y NO EN LOS
// PERFILES: el criterio del §4.35 no es «¿esto es la regla del punto?» sino
// «¿el alumno llega ya produciéndolo?». La regla «-ить/-еть ⇒ II» está en la
// primera página de cualquier manual de ruso y no exige haber estudiado NADA
// de las alternancias, que es el contenido declarado de este punto. Va contra
// el tope.

export interface Vista { s: string; pista: string; lema: string; persona: PersonaRu }
export const vista = (x: ClozeVerboRu): Vista => ({ s: x.s, pista: x.pista, lema: x.lema, persona: x.persona });

/** Las desinencias del presente COMO LAS TRAE UN MANUAL: la conjugación I
 *  átona y la II. Viven en UN sitio y las tres rutas que las usan las
 *  importan de aquí; copiarlas es la regla duplicada que falla en la copia
 *  N+1. No incluyen la rama de la ё porque el alumno no tiene el acento. */
const TABLA: Record<1 | 2, Record<PersonaRu, string>> = {
  1: { '1sg': 'ю', '2sg': 'ешь', '3sg': 'ет', '1pl': 'ем', '2pl': 'ете', '3pl': 'ют' },
  2: { '1sg': 'ю', '2sg': 'ишь', '3sg': 'ит', '1pl': 'им', '2pl': 'ите', '3pl': 'ят' },
};
/** La regla ortográfica de la sibilante, que es capa DADA de este punto
 *  (`u1-ortografia-sibilantes` es prerrequisito). Una ruta que no la aplicara
 *  produciría `*пишю` y fallaría por algo que el alumno SÍ sabe: el número
 *  saldría más bajo de lo real, que es el peor sesgo posible en un tope. */
const sibilante = (tema: string, des: string) =>
  /[жшщч]$/.test(tema) ? tema + des.replace(/^ю/, 'у').replace(/^я/, 'а') : tema + des;
/** Lo que un manual dice: `-ить`/`-еть` es la II, lo demás la I. */
const claseIngenua = (lema: string): 1 | 2 => (/(ить|еть)$/.test(quitarAcento(lema)) ? 2 : 1);

export interface Ruta {
  nombre: string;
  porQue: string;
  predicho: number;
  /** ⚠ SE PREDICE TAMBIÉN EL DENOMINADOR, y no es celo: una ruta que devuelve
   *  `null` donde debería aplicarse baja su numerador sin que nada falle, y su
   *  cero es idéntico al de una ruta limpia. El numerador solo no distingue «no
   *  hay fuga» de «mi simulación se apagó» (lo pagó la v0 de la ruta por
   *  lectura, §A-1 del dictamen). Los dos números van en el test. */
  aplicablesPredicho: number;
  correr: (v: Vista) => string | null;
}

export const ESTRATEGIAS: Ruta[] = [
  {
    nombre: 'copiar-el-infinitivo',
    porQue: 'La única cadena que las dos lenguas del alumno le entregan es la del paréntesis. Su número tiene que ser CERO y su cero no es un resultado: es el control de que la ruta corre — el informe imprime «aplicables», y si fuera 0 la ruta estaría apagada y su cero sería el de otra cosa.',
    predicho: 0,
    aplicablesPredicho: 10,
    correr: (v) => v.lema,
  },
  {
    nombre: 'terminacion-ith-eth-mas-tema-ingenuo',
    porQue: '⚠ SE LLAMA POR LO QUE HACE Y NO «regla escolar», y el cambio lo pidió el lingüista adversarial (A-4, 2026-09-13): lo que codifica es «-ить/-еть ⇒ II, lo demás I», y la regla de los manuales de РКИ y de la escuela rusa es OTRA — «-ить ⇒ II salvo брить, жить, пить, бить, шить, лить, вить; -еть/-ать ⇒ I salvo los once memorizados (гнать, держать, дышать, слышать, смотреть, видеть, ненавидеть, обидеть, терпеть, вертеть, зависеть)» (Хавронина–Широченская; Розenтал §172), que para -еть es casi el revés. Medido: la regla real con sus dos listas acierta TAMBIÉN 4 de 10, o sea que la mala especificación es INERTE para el tope; lo que cambia es la afirmación de la cabecera (ver allí). Va contra el tope del 50 % porque no exige haber aprendido una sola alternancia.',
    predicho: 4,
    aplicablesPredicho: 10,
    correr: (v) => {
      const t = temaIngenuo(v.lema);
      if (t === null) return null;
      return sibilante(t, TABLA[claseIngenua(v.lema)][v.persona]);
    },
  },
  {
    nombre: 'una-sola-tabla-la-de-la-primera',
    porQue: 'El alumno que vio UNA tabla y cree que es la única, con el tema del infinitivo. Es la versión más pobre de la anterior y se mide aparte porque su número dice cuántos ítems son de la conjugación I con tema derivable, que es el suelo del lote.',
    predicho: 3,
    aplicablesPredicho: 10,
    correr: (v) => {
      const t = temaIngenuo(v.lema);
      if (t === null) return null;
      return sibilante(t, TABLA[1][v.persona]);
    },
  },
];

export const PERFILES: Ruta[] = [
  {
    nombre: 'clase-correcta-tema-ingenuo',
    porQue: 'Sabe la clase de cada verbo de verdad —y el acento, así que puede escribir la ё— y deriva el tema del infinitivo. Es el alumno que aprendió la mitad del punto que NO es el contenido. Su número comparado con el de la regla escolar mide EXACTAMENTE cuánto vale saber la clase: si coinciden, la clase es gratis en este lote.',
    predicho: 4,
    aplicablesPredicho: 10,
    correr: (v) => {
      const e = VERB.get(v.lema);
      const t = temaIngenuo(v.lema);
      if (!e || t === null) return null;
      const des = e.clase === 1 && e.acento2sgDesinencial
        ? { '1sg': 'ю', '2sg': 'ёшь', '3sg': 'ёт', '1pl': 'ём', '2pl': 'ёте', '3pl': 'ют' }[v.persona]
        : TABLA[e.clase][v.persona];
      return sibilante(t, des);
    },
  },
  {
    nombre: 'tema-correcto-clase-ingenua',
    porQue: 'Al revés: sabe los temas —que es el contenido declarado del punto— y aplica la tabla de la I a todo. Es el perfil fuerte, y lo que FALLA es lo que el lote mide contra la clase. Su número lleva además una consecuencia medida y no prevista: sube UNO por aceptar la variante sin ё (`живешь`), o sea que cerrar el error simétrico abre esta ruta un ítem. Las dos cosas son verdad y la que gana es no suspender a un alumno impecable.',
    predicho: 7,
    aplicablesPredicho: 10,
    correr: (v) => {
      const e = VERB.get(v.lema);
      if (!e) return null;
      const tema = v.persona === '1sg' && e.tema1sg ? e.tema1sg : e.temaPresente;
      let des = TABLA[1][v.persona];
      // La misma regla de dureza que la máquina, en su versión de manual: el
      // tema en consonante endurece la desinencia de la I.
      if (!/[аеёиоуыэюяьй]$/.test(tema)) des = des.replace(/^ю/, 'у').replace(/^я/, 'а');
      return sibilante(tema, des);
    },
  },
];

// ══════════════════════════════════════════════════════════════════════
// ★ LA RUTA POR LECTURA, Y LA v0 DE ESTE BLOQUE MEDÍA CON UN INSTRUMENTO APAGADO
// ══════════════════════════════════════════════════════════════════════
//
// ⚠ LO PRIMERO ES LA CORRECCIÓN, porque la v0 publicó un número falso y una
// conclusión estructural falsa encima. La cazó el lingüista adversarial.
//
// La v0 tenía UNA ruta, con el prefijo de búsqueda puesto en `temaIngenuo(lema)`,
// y daba 1 de 10. De ahí escribí que «un pronombre no selecciona casilla, así
// que el bigrama devuelve el pasado y falla». **El mecanismo era falso y el
// número un artefacto:** el prefijo `temaIngenuo` PROHÍBE POR CONSTRUCCIÓN
// justamente las formas que el punto enseña — `пиш-` no empieza por `писа-`,
// `виж-` no por `виде-`, `жд-` no por `жда-`, `жив-` no por `ж-`—, así que la
// ruta no podía acertar ni uno de los cinco ítems de tema alterno. Un cero
// puede ser «no hay fuga» o «mi simulación se apagó», y **el número predicho no
// lo caza, porque predicho y observado coinciden en el instrumento
// equivocado**: mi predicción decía 2 y observé 1, y las dos cifras eran del
// aparato roto.
//
// El modelo correcto de «lo que un lector reconoce de la palabra sin saber
// conjugarla» son **las dos primeras letras del infinitivo**, que es la parte
// que ninguna alternancia rusa toca. Con ese prefijo la ruta acierta **5 de
// 10**, y son EXACTAMENTE los cinco ítems de tema alterno (3, 5, 7, 9, 10), o
// sea los que la v0 declaraba inalcanzables leyendo bigramas. Y filtrando lo
// que el alumno sabe descartar —el infinitivo, que está escrito en el
// paréntesis, y las formas en `-л`, porque la pista dice «presente»— sube a
// **6 de 10**.
//
// Las tres rutas se publican, y las tres con su número: la del tema ingenuo
// **como evidencia negativa** —para que nadie reproponga ese prefijo creyendo
// que su 1/10 midió algo— y las dos buenas como la medida real. Y no están
// anidadas: el único acierto de la primera (`помню`) lo PIERDEN las otras dos,
// porque `я по…` devuelve `понимаю`. La unión de las tres es 7 de 10.
//
// ¿Va contra el tope del 50 %? **No, y por la razón del §4.35 aplicada
// literalmente: a A1 el alumno ha leído CERO palabras de ruso.** La biblioteca
// es su material de inmersión futuro, no conocimiento previo. Pero deja de ser
// inofensiva en cuanto lea, y a 6 de 10 mucho antes que en el lote 1: la
// defensa a esas alturas no es un gate sobre este lote, es que ya no sea éste
// el material.
//
// ⚠ Y LO QUE QUEDA DE LA FRASE ESTRUCTURAL, que no era falsa entera sino a
// medias: un pronombre efectivamente no selecciona casilla —`они работают` 0
// frente a `они работали` 6, y ahí la ruta sin filtro devuelve el pasado—, pero
// eso **no protege al lote**, porque el alumno sabe que el pasado ruso lleva
// `-л` y la pista dice «presente». La lección honesta es la contraria de la que
// escribí: **un vecino que sólo ACOMPAÑA la casilla estrecha el candidato lo
// suficiente, y lo que decide es cuántas formas del lema comparten las dos
// primeras letras.** En un verbo no comparten sólo dos: las comparten todas.

const palabraAnterior = (v: Vista): string | null => {
  const antes = sinParentesis(v.s.split('___')[0] ?? '');
  const toks = antes.split(/[^\p{L}]+/u).filter(Boolean);
  return toks.length ? toks[toks.length - 1]!.toLowerCase() : null;
};

/** La continuación más frecuente de «<palabra anterior> <prefijo…>» en 7,7 M de
 *  palabras, con el PREFIJO como parámetro — porque de qué prefijo se use
 *  depende todo, y la v0 lo tenía fijado al valor que apagaba la ruta.
 *
 *  `descartarPasado` quita del recuento el infinitivo (que está escrito en el
 *  paréntesis del estímulo, así que el alumno no lo propondría) y las formas en
 *  `-л/-ла/-ло/-ли` (porque la pista dice «presente» y la marca del pasado ruso
 *  es de A1). No es una mejora cosmética: es la diferencia entre 5 y 6 de 10. */
const colocacion = (v: Vista, prefijo: string | null, descartarPasado: boolean): string | null => {
  const prev = palabraAnterior(v);
  if (!prev || prefijo === null || prefijo.length === 0) return null;
  const re = new RegExp(`${INI}${prev}\\s+(${prefijo}\\p{L}*)${FIN}`, 'giu');
  const cuenta = new Map<string, number>();
  for (const m of corpus().matchAll(re)) {
    const w = m[1]!.toLowerCase();
    if (descartarPasado && (w === quitarAcento(v.lema) || /л[аои]?$/.test(w))) continue;
    cuenta.set(w, (cuenta.get(w) ?? 0) + 1);
  }
  if (!cuenta.size) return null;
  return [...cuenta].sort((a, b) => b[1] - a[1])[0]![0];
};
/** Las dos primeras letras del infinitivo: la parte que ninguna alternancia
 *  rusa toca, y por eso el modelo correcto de lo que un lector reconoce. */
const dosLetras = (lema: string) => quitarAcento(lema).slice(0, 2);

export const RUTAS_POR_LECTURA: Ruta[] = [
  {
    nombre: 'colocacional-por-tema-ingenuo · EVIDENCIA NEGATIVA',
    porQue: '⚠ ESTA RUTA NO MIDE NADA Y SE PUBLICA PARA QUE NADIE LA REPROPONGA. Buscaba la continuación más frecuente del pronombre entre las que empiezan por `temaIngenuo(lema)`, y ese prefijo EXCLUYE POR CONSTRUCCIÓN las cinco formas de tema alterno del lote (`пиш-` no empieza por `писа-`). Su 1/10 es un artefacto del aparato, no una propiedad de la lengua, y mi predicción escrita (2) coincidía con lo observado (1) en el instrumento equivocado: la predicción no caza un prefijo mal elegido. Lo cazó el lingüista adversarial el 2026-09-13. Se queda medida y rotulada, que es guardar la evidencia negativa en vez de perderla.',
    predicho: 1,
    aplicablesPredicho: 10,
    correr: (v) => colocacion(v, temaIngenuo(v.lema), false),
  },
  {
    nombre: 'memoria-colocacional',
    porQue: 'La cadena más frecuente que sigue al pronombre en las 2.180 lecturas entre las que empiezan por LAS DOS PRIMERAS LETRAS del infinitivo, que es la parte que ninguna alternancia rusa toca y por tanto el modelo correcto de lo que un lector reconoce de la palabra. No presupone la tabla ni la clase: presupone HABER LEÍDO. Acierta exactamente los cinco ítems de tema alterno, o sea los que la v0 declaraba inalcanzables leyendo bigramas. A A1 no va contra el tope porque el alumno ha leído cero palabras de ruso; deja de ser inofensiva en cuanto lea.',
    predicho: 5,
    aplicablesPredicho: 10,
    correr: (v) => colocacion(v, dosLetras(v.lema), false),
  },
  {
    nombre: 'memoria-colocacional-sin-el-pasado',
    porQue: 'La misma, descartando el infinitivo (que está escrito en el paréntesis) y las formas en -л, porque la pista dice «presente» y la marca del pasado ruso es de A1. Es la composición de la ruta por lectura con morfología que el alumno YA TRAE, que es la lección del lote 24 rumano: enumerar las rutas libres no es enumerar las que se te ocurren, es enumerar las COMPOSICIONES de las que se te ocurren con lo que el alumno ya sabe. Sube de 5 a 6.',
    predicho: 6,
    aplicablesPredicho: 10,
    correr: (v) => colocacion(v, dosLetras(v.lema), true),
  },
];

// ══════════════════════════════════════════════════════════════════════
// EL CONTROL POSITIVO DEL LOTE: LAS FORMAS QUE NO DEBE PRODUCIR
// ══════════════════════════════════════════════════════════════════════
//
// ⚠ LO PIDIÓ EL LINGÜISTA (A-9, 2026-09-13) Y ERA UNA CASILLA VACÍA DEL
// INSTRUMENTAL. G10 comprueba la mitad «la respuesta lleva `е` donde la lengua
// escribe `ё`»; **nadie comprobaba la simétrica**, que es la que este lote
// FABRICA: quien aprenda `живёшь` en el ítem 2 sobreaplica la `ё` a toda la
// conjugación I y escribe `*пишёшь`, `*читаёшь`. La `ё` no se elige: la decide
// el acento de la desinencia, que es dato del lexicón.
//
// Es el control positivo de `check-paradigma-ru.ts` en versión de lote, y va
// aquí y no allí porque las formas falsas que importan son las que ESTE lote
// invita a producir. Se corre en la CLI y en el test: un gate visto sólo en
// verde no está probado.
export const FALSAS_DEL_LOTE: { mala: string; buena: string; porQue: string }[] = [
  { mala: 'пишёшь', buena: 'пишешь', porQue: 'la ё de la conjugación I sobreaplicada: la decide el ACENTO de la desinencia (пи́шешь es átona), no la clase. пишёшь 0 · пишешь 57' },
  { mala: 'читаёшь', buena: 'читаешь', porQue: 'ídem con el tema en vocal. читаёшь 0 · читаешь 44' },
  { mala: 'говорёшь', buena: 'говоришь', porQue: 'y la ё llevada a la conjugación II, donde la desinencia no tiene forma con ё en ninguna casilla. говорёшь 0 · говоришь 509' },
  { mala: 'видёшь', buena: 'видишь', porQue: 'ídem sobre el verbo del par 5, que es el que comparte lema con la frontera. видёшь 0 · видишь 944' },
  { mala: 'писаю', buena: 'пишу', porQue: 'la regla ingenua sin la alternancia с→ш, que es el contenido del par 2. писаю 0 · пишу 199' },
  { mala: 'видю', buena: 'вижу', porQue: 'la NO alternancia en la 1.ª sg, que es el error diana de la frontera del ítem 5. видю 0 · вижу 1921' },
  { mala: 'вижишь', buena: 'видишь', porQue: 'la alternancia de 1.ª sg llevada a la 2.ª, que es el error diana declarado del ítem 9. вижишь 0 · видишь 944' },
];

/** El veredicto de UNA forma falsa por los dos caminos, con el que la caza
 *  dicho: la ORTOGRAFÍA (un módulo escrito en otra pasada para otra pregunta) o
 *  el CORPUS (7,7 M de palabras). Que una la cace uno y otra el otro no es lo
 *  mismo, y confundirlo es leer un sello como si fuera dos. */
export function veredictoFalsa(mala: string, buena: string): { rechaza: boolean; via: string; detalle: string } {
  const orto = revisarOrtografiaRu(mala);
  if (orto.length) return { rechaza: true, via: 'ortografia', detalle: `${orto[0]!.clase} en «${orto[0]!.palabra}»` };
  const nm = buscar(quitarAcento(mala)).n, nb = buscar(quitarAcento(buena)).n;
  if (nm < nb) return { rechaza: true, via: 'corpus', detalle: `«${mala}» ${nm} < «${buena}» ${nb}` };
  return { rechaza: false, via: '—', detalle: `«${mala}» ${nm} ≥ «${buena}» ${nb}` };
}

export interface Informe { nombre: string; aciertos: number; n: number; aplicables: number; predicho: number; cuales: number[] }

/** Acierta si y sólo si la TARJETA se la daría por buena: la respuesta o
 *  cualquiera de sus alternativas. Medir con una regla propia mide otra cosa. */
export function correr(items: ClozeVerboRu[], rutas: Ruta[]): Informe[] {
  return rutas.map((es) => {
    let aplicables = 0;
    const cuales: number[] = [];
    for (const [i, x] of items.entries()) {
      const s = es.correr(vista(x));
      if (s === null) continue;
      aplicables++;
      const buenas = [respuestaDe(x), ...alternativasDe(x)].filter(Boolean).map((y) => quitarAcento(y!));
      if (buenas.includes(quitarAcento(s))) cuales.push(i + 1);
    }
    return { nombre: es.nombre, aciertos: cuales.length, n: items.length, aplicables, predicho: es.predicho, cuales };
  });
}

if (/[/\\]cloze-ru-a1b\.ts$/.test(process.argv[1] ?? '')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(ITEMS.map((x) => ({ ...x, answer: respuestaDe(x), alt: alternativasDe(x) })), null, 2));
    process.exit(v.length ? 1 : 0);
  }
  console.log(`# Cloze derivado RU-A1B — ${ITEMS.length} ítems de u7-conjugacion-i-ii\n`);
  console.log('| # | infinitivo | clase | tema | ¿tema del infinitivo? | persona | respuesta | alternativas | par · eje |');
  console.log('|--:|---|--:|---|---|---|---|---|---|');
  for (const [i, x] of ITEMS.entries()) {
    const e = entradaDe(x)!;
    const ing = temaIngenuo(x.lema);
    console.log(`| ${i + 1} | ${x.lema} | ${e.clase} | ${e.temaPresente}${e.tema1sg ? ` / ${e.tema1sg} (1sg)` : ''} | ${ing === e.temaPresente ? 'sí' : `NO (daría ${ing}-)`} | ${x.persona} | **${respuestaDe(x)}** | ${alternativasDe(x).join(', ') || '—'} | ${x.par} · ${x.eje}${x.frontera ? ` · FRONTERA ${x.frontera.regla}` : ''} |`);
  }
  console.log('\n## Ítems\n');
  for (const [i, x] of ITEMS.entries()) console.log(`${String(i + 1).padStart(2, '0')}. ${x.s}  → **${respuestaDe(x)}**  · ${x.pista}`);
  const tabla = (titulo: string, rutas: Ruta[], tope: boolean) => {
    console.log(`\n## ${titulo}\n`);
    console.log('| ruta | predicho | observado | % | aplicables | ítems que acierta |');
    console.log('|---|--:|--:|--:|--:|---|');
    for (const r of correr(ITEMS, rutas)) {
      const mal = r.aciertos !== r.predicho ? ' ⚠ NO COINCIDE' : '';
      const pc = Math.round((100 * r.aciertos) / r.n);
      const sobre = tope && r.aciertos / r.n > 0.5 ? ' ⚠ POR ENCIMA DEL TOPE' : '';
      console.log(`| \`${r.nombre}\` | ${r.predicho} | ${r.aciertos}/${r.n}${mal} | ${pc}%${sobre} | ${r.aplicables} | ${r.cuales.join(' ')} |`);
    }
  };
  tabla('Estrategias CIEGAS (tope: la mitad)', ESTRATEGIAS, true);
  tabla('PERFILES de conocimiento parcial (sin tope — dicen qué ítems discriminan)', PERFILES, false);
  tabla('RUTAS POR LECTURA (no van contra el tope a A1: el alumno ha leído cero palabras de ruso)', RUTAS_POR_LECTURA, false);
  const todas = correr(ITEMS, [...ESTRATEGIAS, ...PERFILES, ...RUTAS_POR_LECTURA]);
  const ac = (n: string) => new Set(todas.find((r) => r.nombre === n)!.cuales);
  const a = ac('clase-correcta-tema-ingenuo'), b = ac('tema-correcto-clase-ingenua');
  const union = [...new Set([...a, ...b])].sort((p, q) => p - q);
  const ninguno = ITEMS.map((_, i) => i + 1).filter((k) => !union.includes(k));
  console.log(`\nLa UNIÓN de los dos perfiles acierta ${union.length} de ${ITEMS.length}: ${union.join(' ')}.`);
  console.log(`Los ítems que NO acierta ningún perfil: ${ninguno.join(' ') || '—'}.`);
  console.log('Y la unión no es una estrategia: elegir entre «sé la clase» y «sé el tema» exige');
  console.log('saber cuál de los dos resuelve el ítem, y eso es el punto. Una ruta cuyo nombre y');
  console.log('cuyo código no son la misma frase mide otra cosa.');
  const escolar = todas.find((r) => r.nombre === 'terminacion-ith-eth-mas-tema-ingenuo')!;
  const clase = todas.find((r) => r.nombre === 'clase-correcta-tema-ingenuo')!;
  console.log(`\nSaber la clase DE VERDAD frente a la regla de la terminación: ${clase.aciertos} y ${escolar.aciertos}.`);
  console.log(escolar.aciertos === clase.aciertos
    ? 'Coinciden: en este lote la clase es GRATIS y el contenido es el tema. No es una opinión: es la resta.'
    : `Difieren en ${Math.abs(clase.aciertos - escolar.aciertos)}: ahí está el valor de saber la clase.`);
  console.log('\n## Control positivo: las formas que el lote NO debe producir\n');
  const malas = FALSAS_DEL_LOTE.map((f) => ({ ...f, ...veredictoFalsa(f.mala, f.buena) }));
  for (const m of malas) console.log(`${m.rechaza ? '✓' : '✗'} *${m.mala}  [${m.via}] ${m.detalle}   — ${m.porQue}`);
  const buenasLimpias = FALSAS_DEL_LOTE.filter((f) => revisarOrtografiaRu(f.buena).length === 0).length;
  console.log(`\n${malas.filter((m) => m.rechaza).length}/${malas.length} rechazadas · ${buenasLimpias}/${FALSAS_DEL_LOTE.length} buenas limpias.`);
  if (malas.some((m) => !m.rechaza)) { console.log('⚠ UNA FORMA FALSA NO SE RECHAZA: el control positivo está en rojo.'); process.exit(1); }
  console.log('\n## Gates\n');
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio: un hueco por ítem, tiempo y persona en la pista con su forma canónica y la');
  console.log('clase NUNCA, pronombre sujeto delante del hueco y concordante con la persona,');
  console.log('respuesta derivada por presente(), ningún verbo perfectivo, irregular ni reflexivo,');
  console.log('la variante sin ё aceptada donde la clave la lleva, ortografía y homóglifos, toda');
  console.log('respuesta atestada, cinco pares de marco idéntico con respuestas distintas, el eje');
  console.log('de cada par RECOMPUTADO contra el lexicón, tres ejes distintos, TRES fronteras de');
  console.log('reglas distintas y las tres con su distractor ALCANZABLE dentro del lote, ninguna');
  console.log('desinencia verbal de un ítem escrita en el marco de otro, y las siete formas del');
  console.log('control positivo rechazadas por ortografía o por corpus.');
}

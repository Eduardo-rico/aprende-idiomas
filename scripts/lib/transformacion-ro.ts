// scripts/lib/transformacion-ro.ts — LA MÁQUINA DE TRANSFORMACIÓN DEL RUMANO.
//
// Se da una frase y una consigna EN ESPAÑOL, y el alumno PRODUCE la frase
// transformada. Es el formato que bloqueaba 12 puntos del inventario —la
// clase bloqueada más grande— y el único que puede medir lo que la
// corrección no ve: **la SUBPRODUCCIÓN**. Una tarjeta de corrección enseña
// una frase mala y pide arreglarla, así que mide lo que el alumno pone de
// más y nunca lo que deja de poner; los puntos cuya dificultad es la
// OMISIÓN (`r5-imperativo-negativo`, `r7-infinitivo-residual`,
// `r11-periodo-condicional`) murieron por eso y esperaban esto.
//
// El formato `transformation` YA existe en el producto: `ExerciseRunner` y
// `lib/exercises/respuesta.ts` lo pintan y lo comparan, y el portugués
// tiene 87 ítems publicados. Lo que faltaba era la AUTORÍA en rumano.
//
// ══ POR QUÉ ESTA MÁQUINA NO ES EL PUERTO DE LA DE PT ═════════════════
//
// La de portugués (`scripts/lib/transformacion.ts`) mide **un** atajo, el
// de traducción, y lo hace ÍTEM A ÍTEM. Aquí hay dos cambios de fondo,
// y los dos vienen de fallos que ya se pagaron:
//
// **1 · LA COMPROBACIÓN ES DE LOTE, NO POR ÍTEM.** Un gate que fuerza una
// propiedad ítem a ítem la vuelve CONSTANTE en el lote, y una constante es
// una estrategia gratis. Es literal: en el latín de este mismo repo, vetar
// un orden de palabras en cada ítem hizo que «invierte los dos nombres»
// acertara 12 de 12 con el gate en cero hallazgos. Y es §4.25 otra vez —
// ocho ítems correctos donde insertar `pe` era invariante, así que lo que
// discriminaba era otra cosa y esa otra cosa era de otro punto.
//
// **2 · LAS ESTRATEGIAS SE EJECUTAN, NO SE RAZONAN.** No basta con
// preguntarse si un ítem se puede contestar copiando: se escribe la
// estrategia como función, se corre sobre el lote y se cuenta cuántos
// acierta. Razonar sobre un ítem lo aprueba; ejecutarla sobre ocho lo
// suspende. Las tres que van de serie:
//
//   · `copiar-el-foco` — el alumno deja la palabra como está;
//   · `edición-modal` — el alumno aplica al foco la MISMA edición que ha
//     visto en la mayoría del lote (es la que caza la constante que deja
//     un gate por-ítem, y la que habría cazado el lote de latín);
//   · `traducir-del-español` — no es computable, así que se DECLARA
//     (`espejoEs`) y se mide en el lote, como en PT.
//
// Y hay una cuarta que el lote añade por su cuenta cuando su punto la
// tiene: `verificar()` acepta estrategias propias. **Al cerrar una
// estrategia, la pregunta obligatoria es qué regularidad deja el cierre**,
// y la nueva se comprueba ejecutándola.
//
// ══ LO QUE ESTE FORMATO NO NECESITA, Y ES SU MAYOR VENTAJA ═══════════
//
// **No declara ninguna forma mala.** No hay asterisco que fundamentar, así
// que se salta entera la clase de fallos del §0: la mala que estaba bien,
// la mala de anglófono, la mala arcaica, la mala de otro registro. Lo que
// sí necesita —y lo que el gate persigue— es que la respuesta esté
// DETERMINADA: si la frase admite dos salidas correctas, la tarjeta
// suspende a un alumno que escribió rumano impecable.
import { revisarOrtografiaRo } from '../../lib/lang/ortografia-ro';
import { varianzaDe, UMBRAL } from './varianza';
import { answersMatchCard } from '../../lib/exercises/normalize';
import { buscar, controles, INI, FIN } from '../corpus-ro';

export const TOPE_ESTRATEGIA = 0.5;
export const TOPE_ESPEJO = 0.5;
export const TOPE_LATIN = 0.5;
/** El umbral es EL MISMO que el de la pasada sobre lo publicado, y se
 *  importa en vez de repetirse: un criterio copiado se desincroniza en la
 *  copia que nadie actualiza. Aquí se aplica ANTES de publicar. No
 *  bloquea: EXIGE juicio escrito. */
export const UMBRAL_VARIANZA = UMBRAL;

export interface ItemTransRo {
  /** punto del inventario */
  p: string;
  pasada: number;
  /** la frase de partida, en rumano */
  s: string;
  /** qué hay que hacer, EN ESPAÑOL. Es la superficie con más fugas del
   *  formato: la consigna va en la lengua del alumno y es facilísimo que
   *  deletree la respuesta o la regla. */
  instruccion: string;
  /** la respuesta completa */
  r: string;
  /** las OTRAS salidas correctas. Cuenta los EJES de variación libre y
   *  multiplica: si las declaradas no son el producto, falta la esquina
   *  que combina dos, que es la que siempre se olvida (§4.28). */
  alt?: string[];
  hint?: string;
  /** La palabra de la FUENTE sobre la que opera la transformación. */
  foco: string;
  /** La palabra que la transformación PRODUCE, dentro de `r`. Puede ser
   *  igual al foco: ése es el ítem donde la respuesta correcta es NO
   *  tocar nada, y el lote lo necesita (ver `juicios.copia`). */
  nucleo: string;
  /** ¿Se llega a la respuesta traduciendo la fuente al español,
   *  transformando en español y traduciendo de vuelta? **Es la lectura
   *  OPERATIVA, no la estructural**, y la distinción costó una
   *  observación del lingüista: `faci` → `fă` y `sunteți` → `fiți` son
   *  ESTRUCTURALMENTE lo mismo que «haces» → «haz» y «sois» → «sed»
   *  —apócope del mismo étimo y supletivismo—, y aun así se declaran
   *  `false`, porque el español no produce la cadena rumana. El gate y el
   *  tope cuentan la lectura operativa; quien lo declare por la otra
   *  hará que el número deje de significar lo mismo. */
  espejoEs: boolean;
  /** ¿La raíz románica común deja acertar sin saber la morfología?
   *  Se declara **para un público sólo hispanohablante**, que es el de
   *  este curso: el italiano `fa'`/`sii` daría `fă`/`fii` casi
   *  directamente, y aun así va `false` porque el alumno no sabe
   *  italiano. Si algún día el curso se abre a otra L1, este campo hay
   *  que recontarlo entero, no reinterpretarlo. */
  transparenteLatin: boolean;
  /** ¿Es el ítem cuyo error sería SOBREaplicar la regla del punto? Sin
   *  uno de éstos el alumno saca 8/8 sobregeneralizando y el autor puede
   *  publicar una regla falsa con ocho ítems que la respaldan (§0.6). */
  sobreaplicacion?: boolean;
  /** El núcleo NO aparece en el corpus del proyecto. La ausencia no
   *  prohíbe —el corpus es prosa del XIX-XX— pero exige motivo escrito. */
  ausenteDelCorpus?: string;
}

/** Los juicios que el lote declara por escrito. El invariante no es un
 *  número: es «cero señales sin motivo escrito», igual que `pisoCero`, la
 *  cuarentena y la pasada de varianza.
 *
 *  ⚠ **LO QUE ESTE GATE NO CERTIFICA, y hay caso.** Comprueba que el
 *  juicio EXISTE y que NOMBRA la pieza marcada; no comprueba que sea
 *  verdad. En el estreno, el juicio decía «el imperativo rumano no admite
 *  pronombre sujeto antepuesto» —falso: `tu vino` sale 3 veces en el
 *  corpus del proyecto, en Eminescu— y **pasó el gate exactamente igual
 *  que uno verdadero**, porque contiene la subcadena `-tu`. Un sello
 *  responde a UNA pregunta. La segunda —¿es cierto?— la contestan el
 *  corpus y el lingüista, y por eso las dos son pasos del ciclo y no
 *  opcionales. */
export interface JuiciosLote {
  /** Cuántos ítems se contestan copiando el foco, y por qué ése es el
   *  número correcto. Ni 0 ni N valen sin explicación: N es una estrategia
   *  gratis, y 0 deja la regularidad «la forma SIEMPRE cambia». */
  copia: string;
  /** El contexto donde la regla NO se aplica y qué ítem lo enseña. Si el
   *  punto no tiene frontera, se escribe por qué y se empieza por
   *  `SIN FRONTERA:`. */
  frontera: string;
  /** Qué VARÍA entre los ítems, y si eso pertenece a este punto o a otro.
   *  La señal de invariancia es necesaria y no suficiente. */
  varianza: string;
}

/** LO QUE EL ALUMNO VE del ítem que tiene delante. El tipo es la mitad
 *  importante de esta interfaz, y nació de un fallo propio: la primera
 *  estrategia que se escribió aquí —«cambiar siempre la forma»— devolvía
 *  `x.nucleo` y acertaba 5 de 8, o sea que **se leía la respuesta y se
 *  daba la razón a sí misma**. Ni siquiera es una estrategia: un alumno
 *  que decide «esto cambia» no sabe todavía A QUÉ cambia.
 *
 *  El arreglo no es una norma en un comentario —«no mires la respuesta»,
 *  que se hereda mal—, sino el invariante estructural que la implica: la
 *  respuesta **no está en el tipo**, así que una estrategia tramposa no
 *  compila. Es §4.23 aplicado a la máquina nueva. */
export type Vista = Pick<ItemTransRo, 's' | 'instruccion' | 'hint' | 'foco'>;

/** UNA AFIRMACIÓN DEL LOTE, ESCRITA PARA PODER EJECUTARLA CONTRA EL CORPUS.
 *
 *  ══ POR QUÉ EXISTE, Y ES UN FALLO DEL ESTRENO ══════════════════════
 *  El gate de varianza exige un motivo ESCRITO, y en el lote 23 aceptó
 *  uno falso —«el imperativo rumano no admite pronombre sujeto
 *  antepuesto»— **exactamente igual que uno verdadero**, porque comprueba
 *  que el texto NOMBRE la pieza, no que sea cierto. `tu vino` sale tres
 *  veces en el corpus del proyecto, en Eminescu.
 *
 *  La lección general es que **exigir un motivo escrito garantiza
 *  presencia, nunca verdad**. Y el arreglo no es pedirle al autor que se
 *  acuerde de comprobarlo —lo que depende de acordarse, falla—, sino
 *  quitarle al lote la posibilidad de publicar sin haber puesto sus
 *  afirmaciones delante del corpus. Es el mismo movimiento que la `Vista`
 *  sin respuesta: no una norma, un invariante que se ejecuta.
 *
 *  ══ LAS DOS ASIMETRÍAS, Y AQUÍ NO SE PUEDEN CONFUNDIR ══════════════
 *  · `presente`: la afirmación dice que la forma se usa. Cero apariciones
 *    la REFUTA y el lote no sale.
 *  · `ausente`: la afirmación dice que la forma no se usa. Una sola
 *    aparición la REFUTA y el lote no sale — que es justo el caso del
 *    lote 23. Pero cero apariciones **NO la demuestra**: la ausencia no
 *    prohíbe, el corpus es prosa del XIX-XX, y hace falta cita normativa
 *    aparte. El informe lo dice con esas palabras en vez de dar un visto
 *    bueno que nadie ha ganado. */
export interface Comprobacion {
  /** La afirmación, tal como se lee en el juicio o en la prosa del punto. */
  afirmacion: string;
  /** El patrón que la pone a prueba. Se le ponen los límites de palabra
   *  unicode automáticamente, y `corpus-ro` rechaza `\b`, que en JS no es
   *  unicode-aware y dispara dentro de las palabras rumanas. */
  patron: string;
  espera: 'presente' | 'ausente';
}

/** Corre las afirmaciones del lote contra los 2,9 M de palabras. Devuelve
 *  las líneas del informe y los problemas, por separado: el número se
 *  imprime SIEMPRE, salga verde o rojo. */
export function comprobarEnCorpus(cs: readonly Comprobacion[]): { lineas: string[]; problemas: string[] } {
  const lineas: string[] = ['| afirmación | patrón | espera | corpus |', '|---|---|---|---:|'];
  const problemas: string[] = [];
  const c = controles();
  if (!c.ok) return { lineas, problemas: [`CORPUS: ${c.fallo}`] };
  for (const x of cs) {
    const n = buscar(INI + x.patron + FIN).n;
    lineas.push(`| ${x.afirmacion} | \`${x.patron}\` | ${x.espera} | **${n}** |`);
    if (x.espera === 'presente' && n === 0)
      problemas.push(`AFIRMACIÓN REFUTADA (${x.afirmacion}): «${x.patron}» no aparece ni una vez en el corpus`);
    if (x.espera === 'ausente' && n > 0)
      problemas.push(`AFIRMACIÓN REFUTADA (${x.afirmacion}): «${x.patron}» aparece ${n} ${n === 1 ? 'vez' : 'veces'} en el corpus — la presencia prueba`);
  }
  if (cs.some((x) => x.espera === 'ausente'))
    lineas.push('', '⚠ Un `ausente` que da cero **no queda demostrado**: la ausencia no prohíbe y el corpus es prosa del XIX-XX. Sólo significa que el corpus no lo refuta; la prohibición necesita cita normativa aparte.');
  return { lineas, problemas };
}

/** Una estrategia del alumno, escrita como función para poder EJECUTARLA.
 *  Devuelve lo que ese alumno pondría en el hueco del núcleo, o null si la
 *  estrategia no se aplica a ese ítem. */
export interface Estrategia {
  nombre: string;
  /** Contra QUÉ se compara lo que la estrategia produce. Por defecto el
   *  núcleo, o sea la palabra que la transformación cambia. Pero la
   *  estrategia que de verdad amenaza a este formato produce **la frase
   *  entera** —«copio la fuente, le quito el pronombre y cambio el punto
   *  por admiración»— y una estrategia así comparada contra el núcleo no
   *  se ve: el núcleo es una palabra y ella escribe ocho. Lo destapó el
   *  lingüista sobre el estreno, y el defecto era de la máquina, no del
   *  lote. */
  objetivo?: 'nucleo' | 'respuesta';
  /** `x` es lo que el alumno ve AHORA: nunca su propia respuesta. `otros`
   *  son los DEMÁS ítems enteros, porque el alumno sí ha visto la
   *  corrección de los que ya hizo — es leave-one-out, y sin él la
   *  edición modal se cuenta a sí misma. */
  aplicar(x: Vista, otros: ItemTransRo[]): string | null;
}

export const norm = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^\p{L}\p{N}\- ]/gu, ' ').replace(/\s+/g, ' ').trim();

const palabras = (s: string) => norm(s).split(' ').filter(Boolean);
const contiene = (texto: string, palabra: string) =>
  new RegExp(`(?<![\\p{L}\\p{N}-])${norm(palabra).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}\\p{N}-])`, 'u')
    .test(norm(texto));
/** Cuántas veces aparece la palabra en el texto, con límite unicode de
 *  verdad: `\b` de JS no lo es, y en rumano dispara dentro de la palabra. */
const cuenta = (texto: string, palabra: string) =>
  (norm(texto).match(new RegExp(`(?<![\\p{L}\\p{N}-])${norm(palabra).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}\\p{N}-])`, 'gu')) ?? []).length;

// ══ LAS ESTRATEGIAS DE SERIE ═════════════════════════════════════════

/** «Dejo la palabra como está.» */
export const COPIAR: Estrategia = { nombre: 'copiar-el-foco', aplicar: (x) => x.foco };

/** La EDICIÓN entre el foco y el núcleo, como sufijo quitado y sufijo
 *  puesto. `citești` → `citește` es (`ti` → `te`); `mergi` → `mergi` es
 *  (`` → ``), o sea la identidad, que es la estrategia de copiar. */
export function edicion(foco: string, nucleo: string): { quita: string; pone: string } {
  const a = norm(foco), b = norm(nucleo);
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return { quita: a.slice(i), pone: b.slice(i) };
}

function aplicarEdicion(e: { quita: string; pone: string }, foco: string): string | null {
  const a = norm(foco);
  if (!a.endsWith(e.quita)) return null;
  return a.slice(0, a.length - e.quita.length) + e.pone;
}

/** LA ESTRATEGIA QUE CAZA LA CONSTANTE. El alumno mira los ítems que ya ha
 *  hecho, ve que casi todos aplican la misma edición al foco, y la repite
 *  a ciegas. Si acierta la mayoría del lote, el lote no examina el punto:
 *  examina la moda. Es la que habría cazado «invierte los dos nombres». */
export const EDICION_MODAL: Estrategia = {
  nombre: 'edición-modal-del-lote',
  aplicar(x, otros) {
    const conteo = new Map<string, { e: { quita: string; pone: string }; n: number }>();
    for (const y of otros) {
      const e = edicion(y.foco, y.nucleo);
      const k = `${e.quita}→${e.pone}`;
      const v = conteo.get(k) ?? { e, n: 0 };
      v.n++; conteo.set(k, v);
    }
    const modal = [...conteo.values()].sort((a, b) => b.n - a.n)[0];
    return modal ? aplicarEdicion(modal.e, x.foco) : null;
  },
};

/** «Copio la frase tal cual.» Va contra la RESPUESTA, no contra el
 *  núcleo, y por eso hacía falta el campo `objetivo`: la comparación
 *  además es la del PRODUCTO (`answersMatchCard`), no una propia, porque
 *  una estrategia acierta si y sólo si la tarjeta se la daría por buena —
 *  y la tarjeta acepta el punto final donde la clave lleva admiración. Una
 *  medición más estricta que el producto mide otra cosa. */
export const COPIAR_LA_FRASE: Estrategia = {
  nombre: 'copiar-la-frase-entera', objetivo: 'respuesta', aplicar: (x) => x.s,
};

export const ESTRATEGIAS_DE_SERIE: Estrategia[] = [COPIAR, COPIAR_LA_FRASE, EDICION_MODAL];

/** Distancia de edición entre el foco y el núcleo, sobre las formas
 *  normalizadas SIN quitar diacríticos —aquí el diacrítico es justo lo que
 *  se mide—. */
export function distancia(a: string, b: string): number {
  const x = a.toLowerCase().trim(), y = b.toLowerCase().trim();
  const d: number[][] = Array.from({ length: x.length + 1 }, (_, i) => [i, ...Array<number>(y.length).fill(0)]);
  for (let j = 0; j <= y.length; j++) d[0]![j] = j;
  for (let i = 1; i <= x.length; i++)
    for (let j = 1; j <= y.length; j++)
      d[i]![j] = Math.min(d[i - 1]![j]! + 1, d[i]![j - 1]! + 1, d[i - 1]![j - 1]! + (x[i - 1] === y[j - 1] ? 0 : 1));
  return d[x.length]![y.length]!;
}

/** EL CONTRASTE DE UNA SOLA LETRA, que es un ítem de ortografía disfrazado
 *  de ítem de morfología.
 *
 *  Medido sobre el lexicón rumano entero antes de que existiera este
 *  gate: entre la 3.ª sg del presente y el infinitivo corto —las dos
 *  casillas del imperativo negativo— **18 de 43 verbos se separan por una
 *  letra o menos**, y la 3.ª conjugación completa (`merge`, `face`,
 *  `spune`, `zice`, `scrie`, `pune`, `începe`) por CERO. En la 1.ª son
 *  pares como `cântă!` / `nu cânta!`, donde lo único que cambia es la
 *  vocal final.
 *
 *  Un ítem así **puede estar perfecto y no examinar la regla**: el alumno
 *  que acierta puede haber acertado la ortografía de la `ă` final. No es
 *  el §4.13bis —ahí la frase contiene una copia del rasgo— sino su primo:
 *  el contraste existe, pero es tan pequeño que no distingue saber la
 *  casilla de saber escribirla. Se CUENTA siempre y sólo tumba el lote
 *  cuando es la mayoría, porque un lote puede querer un par mínimo a
 *  propósito para enseñar precisamente esa diferencia. */
export const contrasteMinimo = (items: readonly ItemTransRo[]) =>
  items.filter((x) => { const d = distancia(x.foco, x.nucleo); return d > 0 && d <= 1; });

export interface Resultado { nombre: string; aciertos: number; total: number; sobre: string[] }

/** Corre una estrategia sobre el lote y cuenta. **Esto es lo que sustituye
 *  a razonar sobre un ítem.** */
export function correr(e: Estrategia, lote: ItemTransRo[]): Resultado {
  const sobre: string[] = [];
  let aciertos = 0;
  for (const [i, x] of lote.entries()) {
    // La vista se CONSTRUYE, no se pasa el ítem entero con un tipo más
    // estrecho: un tipo estructural protege al que escribe la estrategia
    // y no al objeto, y con un `as` cualquiera se lee la respuesta igual.
    // Lo que no está en el objeto no se puede leer de ninguna manera.
    const vista: Vista = { s: x.s, instruccion: x.instruccion, hint: x.hint, foco: x.foco };
    const g = e.aplicar(vista, lote.filter((_, k) => k !== i));
    if (g === null) continue;
    const acierta = e.objetivo === 'respuesta' ? answersMatchCard(g, x.r) : norm(g) === norm(x.nucleo);
    if (acierta) { aciertos++; sobre.push(x.s); }
  }
  return { nombre: e.nombre, aciertos, total: lote.length, sobre };
}

// ══ LOS GATES ════════════════════════════════════════════════════════

export interface Opciones {
  juicios: JuiciosLote;
  /** Estrategias propias del punto, además de las de serie. */
  estrategias?: Estrategia[];
  /** Las afirmaciones de atestación del lote, ejecutables. **Obligatorio
   *  al menos una**: un lote que no ha puesto ninguna de sus afirmaciones
   *  delante del corpus no se publica. Lo que el gate NO puede saber es si
   *  las declaradas son LAS que la prosa hace — un sello responde a una
   *  pregunta — pero sí impide el caso que ya se pagó: afirmar que algo no
   *  existe cuando el corpus lo trae tres veces. */
  comprobaciones?: readonly Comprobacion[];
  /** Los gates que sólo valen para ESTE punto. Viajan en las opciones —y
   *  no en un `verificar` propio que el lote exporte— porque el publicador
   *  ya recibe las opciones: así un lote no puede olvidarse de enchufar
   *  sus gates, que es la forma en que un gate declarado acaba ausente.
   *
   *  El caso que lo pidió: cuando la CONSIGNA hace una promesa comprobable
   *  («que la frase te quede con exactamente una palabra más que ésta»),
   *  esa promesa tiene que tener un gate, o la consigna y las claves se
   *  desincronizan en el ítem que alguien añada dentro de dos meses. */
  gatesPropios?: (items: readonly ItemTransRo[]) => string[];
}

export function verificar(items: ItemTransRo[], op: Opciones): string[] {
  const v: string[] = [];
  const vistas = new Set<string>();

  for (const [i, x] of items.entries()) {
    const id = `TR-${String(i + 1).padStart(3, '0')} (${x.p})`;

    // ── COHERENCIA DE LA DECLARACIÓN ────────────────────────────────
    // Foco y núcleo son de lo que cuelgan todas las estrategias: si están
    // mal declarados, los gates de lote miden otra cosa y salen verdes.
    if (!contiene(x.s, x.foco)) v.push(`${id}: el foco «${x.foco}» no está en la fuente`);
    if (!contiene(x.r, x.nucleo)) v.push(`${id}: el núcleo «${x.nucleo}» no está en la respuesta`);

    if (norm(x.s) === norm(x.r)) v.push(`${id}: la respuesta es idéntica a la fuente — no hay transformación`);

    // ── LA FUGA: EL NÚCLEO YA ESTÁ EN LA FUENTE ─────────────────────
    // «Si la frase ya contiene una copia del rasgo que pides, el ítem se
    // contesta copiando.» Pero el ítem cuya respuesta correcta ES no
    // tocar nada tiene el núcleo en la fuente POR DISEÑO, así que aquí se
    // cuenta sólo la copia que NO es el foco. La otra la decide el lote.
    const copiasEnFuente = cuenta(x.s, x.nucleo) - (norm(x.foco) === norm(x.nucleo) ? cuenta(x.s, x.foco) : 0);
    if (copiasEnFuente > 0)
      v.push(`${id}: el núcleo «${x.nucleo}» ya está escrito en la fuente fuera del foco — el ítem se contesta copiando`);

    // ── LA CONSIGNA NO PUEDE CONTENER LA RESPUESTA ──────────────────
    // Es el gate propio de este formato: la consigna va en ESPAÑOL, así
    // que nadie la mira con ojos de rumano y una palabra rumana suelta
    // pasa desapercibida. Se comprueba sin diacríticos, porque «vino» y
    // «vină» no engañan a nadie pero «citeste» sí.
    for (const [campo, texto] of [['instrucción', x.instruccion], ['pista', x.hint ?? '']] as const) {
      if (!texto) continue;
      if (contiene(texto, x.nucleo)) v.push(`${id}: la ${campo} deletrea el núcleo «${x.nucleo}»`);
      for (const w of palabras(x.r))
        if (w.length > 3 && !contiene(x.s, w) && contiene(texto, w))
          v.push(`${id}: la ${campo} contiene «${w}», que es de la respuesta y no de la fuente`);
    }

    if (!x.instruccion.trim()) v.push(`${id}: sin instrucción`);
    // Una consigna que no dice qué hacer deja la salida abierta, y una
    // salida abierta cobra fallos falsos que entran en el FSRS.
    if (x.instruccion.trim().length < 15) v.push(`${id}: instrucción demasiado corta para determinar la salida`);

    const k = norm(x.s);
    if (vistas.has(k)) v.push(`${id}: fuente repetida dentro del lote`);
    vistas.add(k);

    for (const a of x.alt ?? []) {
      if (norm(a) === norm(x.r)) v.push(`${id}: la alternativa «${a}» es la respuesta`);
      if (norm(a) === norm(x.s)) v.push(`${id}: la alternativa «${a}» es la fuente`);
    }

    // ── ORTOGRAFÍA DOOM3 sobre todo lo que se publica ───────────────
    for (const [campo, texto] of [['fuente', x.s], ['respuesta', x.r], ...(x.alt ?? []).map((a) => ['alternativa', a] as const)] as const)
      for (const h of revisarOrtografiaRo(texto))
        v.push(`${id}: ortografía (${h.clase}) en la ${campo}: «${h.palabra}»`);
  }

  v.push(...verificarLote(items, op));
  return v;
}

/** LA MITAD QUE NO EXISTE EN LA MÁQUINA DE PORTUGUÉS: lo que sólo se ve
 *  mirando los ocho ítems a la vez. */
export function verificarLote(items: ItemTransRo[], op: Opciones): string[] {
  const v: string[] = [];
  const n = items.length;
  if (!n) return ['el lote está vacío'];

  // ── LAS ESTRATEGIAS, EJECUTADAS ─────────────────────────────────
  for (const e of [...ESTRATEGIAS_DE_SERIE, ...(op.estrategias ?? [])]) {
    const r = correr(e, items);
    if (r.aciertos / n > TOPE_ESTRATEGIA)
      v.push(`ESTRATEGIA GRATIS «${r.nombre}»: acierta ${r.aciertos}/${n} sin saber rumano (tope ${TOPE_ESTRATEGIA * 100} %)`);
  }

  // ── EL ATAJO QUE NO SE CALCULA, DECLARADO Y MEDIDO ──────────────
  const espejo = items.filter((x) => x.espejoEs).length;
  if (espejo / n > TOPE_ESPEJO) v.push(`ESTRATEGIA GRATIS «traducir del español»: ${espejo}/${n} ítems son espejo (tope ${TOPE_ESPEJO * 100} %)`);
  const latin = items.filter((x) => x.transparenteLatin).length;
  if (latin / n > TOPE_LATIN) v.push(`ESTRATEGIA GRATIS «la raíz románica»: ${latin}/${n} transparentes (tope ${TOPE_LATIN * 100} %)`);

  // ── EL CONTRASTE DE UNA LETRA ───────────────────────────────────
  const minimos = contrasteMinimo(items);
  if (minimos.length / n > TOPE_ESTRATEGIA)
    v.push(`CONTRASTE MÍNIMO: ${minimos.length}/${n} ítems separan foco y núcleo por UNA letra (tope ${TOPE_ESTRATEGIA * 100} %) — el lote mide ortografía, no la casilla`);

  // ── LA VARIANZA, ANTES DE PUBLICAR ──────────────────────────────
  // Toda pieza que la operación añade o quita en ≥80 % de los ítems se
  // aprende en el primero. No bloquea: exige que el juicio escrito la
  // nombre, porque la señal es necesaria y no suficiente — en
  // `r3-negacion-antepuesta` la invariancia era de la LENGUA.
  for (const [pieza, k] of piezasInvariantes(items))
    if (!op.juicios.varianza.includes(pieza))
      v.push(`VARIANZA: la pieza «${pieza}» aparece en ${k}/${n} ítems (≥${UMBRAL_VARIANZA * 100} %) y el juicio del lote no la nombra`);

  // ── LOS JUICIOS ESCRITOS: cero señales sin motivo ───────────────
  const copias = items.filter((x) => norm(x.foco) === norm(x.nucleo)).length;
  if (op.juicios.copia.trim().length < 40)
    v.push(`JUICIO AUSENTE «copia»: ${copias}/${n} ítems se contestan copiando el foco y el lote no explica por qué ése es el número`);
  if (op.juicios.varianza.trim().length < 40) v.push('JUICIO AUSENTE «varianza»: qué varía entre los ítems y si pertenece a este punto');
  if (op.juicios.frontera.trim().length < 40) v.push('JUICIO AUSENTE «frontera»: dónde NO se aplica la regla, y qué ítem lo enseña');
  else if (!items.some((x) => x.sobreaplicacion) && !op.juicios.frontera.startsWith('SIN FRONTERA:'))
    v.push('FRONTERA: ningún ítem declara `sobreaplicacion` y el juicio no empieza por «SIN FRONTERA:» con su motivo');

  v.push(...(op.gatesPropios?.(items) ?? []));

  // ── LAS AFIRMACIONES, EJECUTADAS CONTRA EL CORPUS ───────────────
  // No es «acuérdate de comprobarlo»: sin esto el lote no sale.
  if (!op.comprobaciones?.length)
    v.push('COMPROBACIÓN AUSENTE: el lote no pone ni una de sus afirmaciones de atestación delante del corpus, y un motivo escrito garantiza presencia, nunca verdad');
  else v.push(...comprobarEnCorpus(op.comprobaciones).problemas);

  return v;
}

/** Las piezas que la operación añade o quita, contadas sobre el lote.
 *
 *  **No implementa la cuenta: la importa.** La primera versión la escribió
 *  aquí, y era la copia N+1 de una regla que ya vive en
 *  `scripts/lib/varianza.ts` para las cuatro lenguas — el defecto que ya
 *  ha fallado cinco veces en este repo. Lo que sí hizo falta fue enseñarle
 *  a `operacionDe` a leer el formato `transformation`, que devolvía null:
 *  un ítem que ningún instrumento sabe leer se cuenta como «no medido», y
 *  ésos son justo los 24 de mediación que la pasada de varianza no puede
 *  mirar. */
export function piezasInvariantes(items: ItemTransRo[]): [string, number][] {
  const v = varianzaDe('lote', items.map(publicable));
  return v.invariantes.map((i) => [i.pieza, i.en] as [string, number]);
}

/** La forma EXACTA que el ítem tendrá publicado. Los instrumentos leen lo
 *  publicado, así que medir el borrador con otra forma mide otra cosa. */
const publicable = (x: ItemTransRo) => ({ type: 'transformation', data: { source: x.s, answer: x.r } });

/** El informe, que se imprime SIEMPRE — salga verde o rojo. Una cifra que
 *  sólo aparece cuando falla no es una medición, es una alarma. */
export function informe(items: ItemTransRo[], op: Opciones): string[] {
  const L: string[] = [];
  const n = items.length;
  L.push(`**${n} ítems · las estrategias del alumno, EJECUTADAS sobre el lote:**`);
  L.push('');
  L.push('| estrategia | acierta | de |');
  L.push('|---|---:|---:|');
  for (const e of [...ESTRATEGIAS_DE_SERIE, ...(op.estrategias ?? [])]) {
    const r = correr(e, items);
    L.push(`| \`${r.nombre}\` | ${r.aciertos} | ${n} |`);
  }
  L.push(`| \`traducir-del-español\` (declarado) | ${items.filter((x) => x.espejoEs).length} | ${n} |`);
  L.push(`| \`la-raíz-románica\` (declarado) | ${items.filter((x) => x.transparenteLatin).length} | ${n} |`);
  L.push('');
  const piezas = piezasInvariantes(items);
  L.push(piezas.length
    ? `**Piezas invariantes (≥${UMBRAL_VARIANZA * 100} %):** ${piezas.map(([p, k]) => `\`${p}\` ${k}/${n}`).join(', ')}`
    : '**Ninguna pieza de la operación llega al umbral de invariancia.**');
  L.push(`**Ítems que se contestan copiando el foco:** ${items.filter((x) => norm(x.foco) === norm(x.nucleo)).length}/${n}`);
  L.push(`**Ítems de sobreaplicación (la frontera):** ${items.filter((x) => x.sobreaplicacion).length}/${n}`);
  const min = contrasteMinimo(items);
  L.push(`**Ítems cuyo contraste es de UNA letra** (miden ortografía, no la casilla): ${min.length}/${n}${min.length ? ` — ${min.map((x) => `${x.foco}→${x.nucleo}`).join(', ')}` : ''}`);
  if (op.comprobaciones?.length) {
    L.push('', '**Las afirmaciones del lote, contra los 2,9 M de palabras del corpus:**', '');
    L.push(...comprobarEnCorpus(op.comprobaciones).lineas);
  }
  return L;
}

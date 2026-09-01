// scripts/lib/atajos-cloze.ts
//
// LA BATERÍA DE ATAJOS DEL FORMATO CLOZE.
//
// `atajos.ts` mide rasgos que predicen una ETIQUETA BINARIA. Un cloze no
// tiene etiqueta, así que sus trece rasgos no aplican — y de ahí el
// razonamiento que el lote 11 v2 escribió en su cabecera: «la familia
// entera de atajos deja de aplicar». Es verdad y es la trampa: que los
// atajos de UN formato no apliquen no significa que el formato nuevo no
// tenga los SUYOS. Simplemente nadie los había medido nunca.
//
// Un atajo de cloze no es un rasgo que prediga una etiqueta: es un
// RESOLUTOR — una función que produce la respuesta a partir de un
// SUBCONJUNTO ESTRICTO de la información del ítem (la pista sola, la
// palabra funcional que abre la frase, el ancho del input, la traducción
// al español) y acierta por encima del azar. La fórmula es la misma que
// la de la batería vieja y por la misma razón: **acierto sobre N**, con
// su p exacta, y aquí además con su BASELINE declarada, porque en un
// cloze el azar no es 0,5 sino 1/k, donde k es el tamaño del espacio de
// respuestas que el formato deja abierto.
//
// Los resolutores se declaran con QUÉ INFORMACIÓN usan. Un resolutor que
// usa toda la frase no prueba nada; lo que acusa a un ítem es que un
// resolutor CIEGO —que no lee el contexto que el ítem dice examinar—
// acierte igual.
import { infinitivoPessoal, type Persona } from './paradigma-pt';

export interface ItemCloze {
  id: string;
  /** el punto: los resolutores se miden por punto, no sobre la mezcla */
  seccion: string;
  /** la frase COMO LA VE EL ALUMNO: con `___` y con la pista entre
   *  paréntesis, que es la única pista que la tarjeta renderiza */
  sentence: string;
  answer: string;
  alternatives?: string[];
  /** posición en el lote, 0-based; la rellena `bateriaCloze()` */
  pos?: number;

  // ── lo que permite recalcular formas (sección de verbos) ──
  lema?: string;
  persona?: Persona;
  /** la CLASE que el ítem dice examinar; es el target de los rasgos */
  construccion?: string;
  /** las formas RIVALES: las que produciría la regla equivocada. Sin
   *  esto no se puede medir si el formato las distingue por su ancho. */
  rivales?: string[];

  // ── DECLARADO, igual que `glosaEsCorrecta` en la batería vieja ──
  /** Qué pondría en el hueco un hispanohablante que traduce la frase
   *  palabra por palabra, y a qué forma portuguesa corresponde ese verbo
   *  español por la correspondencia obvia (es→é, está→está, queda→fica,
   *  soy→sou, estuvo→esteve). `null` = el español no da la respuesta.
   *  No hay regex que lo calcule: es juicio, y por eso se declara con la
   *  glosa escrita al lado, como el rasgo 12. */
  esEnElHueco?: string | null;
  traduccionDa?: string | null;
}

export interface Resolutor {
  nombre: string;
  /** qué información usa. Un resolutor que no mira la frase y acierta es
   *  el hallazgo; uno que la mira entera no prueba nada. */
  usa: string;
  /** la probabilidad de acertar por azar CON ESA MISMA información */
  baseline: number;
  /** null = el resolutor se abstiene (cuenta como fallo) */
  f: (x: ItemCloze, todos: ItemCloze[]) => string | null;
}

export interface MedidaResolutor {
  nombre: string;
  usa: string;
  aciertos: number;
  n: number;
  acierto: number;
  baseline: number;
  p: number;
  abstenciones: number;
}

// ── la tabla cerrada de disparadores ──────────────────────────────────
// Ocho palabras funcionales. Si esta tabla resuelve la sección, entonces
// el ítem no examina «la elección entre tres construcciones»: examina un
// lookup, y el alumno no necesita saber POR QUÉ (sujeto expreso frente a
// no expreso) para acertar siempre.
const DISPARADORES: [RegExp, string][] = [
  [/(?<![\p{L}])assim que(?![\p{L}])/iu, 'conjuntivo-futuro'],
  [/(?<![\p{L}])logo que(?![\p{L}])/iu, 'conjuntivo-futuro'],
  [/(?<![\p{L}])enquanto(?![\p{L}])/iu, 'conjuntivo-futuro'],
  [/(?<![\p{L}])quando(?![\p{L}])/iu, 'conjuntivo-futuro'],
  [/(?<![\p{L}])se(?![\p{L}])/iu, 'conjuntivo-futuro'],
  [/(?<![\p{L}])que(?![\p{L}])/iu, 'conjuntivo-presente'],
  [/(?<![\p{L}])antes de(?![\p{L}])/iu, 'pessoal'],
  [/(?<![\p{L}])depois de(?![\p{L}])/iu, 'pessoal'],
  [/(?<![\p{L}])apesar de(?![\p{L}])/iu, 'pessoal'],
  [/(?<![\p{L}])para(?![\p{L}])/iu, 'pessoal'],
  [/(?<![\p{L}])sem(?![\p{L}])/iu, 'pessoal'],
  [/(?<![\p{L}])até(?![\p{L}])/iu, 'pessoal'],
];

/** El disparador que manda: el que TERMINA más cerca del hueco, y a
 *  igualdad de final, el más largo («assim que» gana a «que»). */
export function disparadorDe(sentence: string): string | null {
  const izq = sentence.split('___')[0] ?? '';
  let mejor: { fin: number; len: number; clase: string } | null = null;
  for (const [re, clase] of DISPARADORES) {
    for (const m of izq.matchAll(new RegExp(re.source, 'giu'))) {
      const fin = m.index! + m[0].length;
      const len = m[0].length;
      if (!mejor || fin > mejor.fin || (fin === mejor.fin && len > mejor.len)) mejor = { fin, len, clase };
    }
  }
  return mejor?.clase ?? null;
}

/** El ancho del `<input>` que pinta `FillBlankCard`:
 *  `size={Math.max(6, answer.length)}`. No es una metáfora — es el canal
 *  por el que el formato filtra la longitud de la respuesta. */
export const anchoDelInput = (respuesta: string) => Math.max(6, respuesta.length);

const acierta = (x: ItemCloze, s: string | null) =>
  s !== null && (s === x.answer || (x.alternatives ?? []).includes(s));

export function medirResolutor(r: Resolutor, items: ItemCloze[]): MedidaResolutor {
  const conPos = items.map((x, i) => ({ ...x, pos: x.pos ?? i }));
  const salidas = conPos.map((x) => r.f(x, conPos));
  const aciertos = conPos.filter((x, i) => acierta(x, salidas[i]!)).length;
  return {
    nombre: r.nombre, usa: r.usa, aciertos, n: items.length,
    acierto: items.length ? aciertos / items.length : 0,
    baseline: r.baseline, p: pBinom(aciertos, items.length, r.baseline),
    abstenciones: salidas.filter((s) => s === null).length,
  };
}

// ── rasgos binarios: lo mismo que la batería vieja, pero el target no es
//    «está BIEN» sino una propiedad binaria de la RESPUESTA (¿es
//    conjuntivo?, ¿el lema es ser?). El truco de las dos direcciones se
//    mantiene: un rasgo vale por su mejor lectura. ─────────────────────
export interface RasgoCloze { nombre: string; f: (x: ItemCloze, todos: ItemCloze[]) => boolean }
export interface MedidaRasgo {
  nombre: string; aciertos: number; n: number; acierto: number;
  direccion: 'presente⇒SÍ' | 'presente⇒NO'; presentes: number; p: number;
}

export function medirRasgoCloze(
  nombre: string, presente: (x: ItemCloze) => boolean,
  target: (x: ItemCloze) => boolean, items: ItemCloze[],
): MedidaRasgo {
  const n = items.length;
  const a = items.filter((x) => presente(x) === target(x)).length;
  const mejor = Math.max(a, n - a);
  return {
    nombre, aciertos: mejor, n, acierto: n ? mejor / n : 0,
    direccion: a >= n - a ? 'presente⇒SÍ' : 'presente⇒NO',
    presentes: items.filter(presente).length,
    p: pBinom(mejor, n, 0.5),
  };
}

/** Binomial exacta a una cola: P(X ≥ aciertos) con n ensayos y prob p0.
 *  El baseline NO es 0,5 en un cloze: es 1/k sobre el espacio que el
 *  formato deja abierto (tres construcciones, tres lemas). Usar 0,5 por
 *  inercia infla toda la tabla. */
export function pBinom(aciertos: number, n: number, p0: number): number {
  const comb = (a: number, b: number) => { let r = 1; for (let i = 0; i < b; i++) r = (r * (a - i)) / (i + 1); return r; };
  let p = 0;
  for (let k = aciertos; k <= n; k++) p += comb(n, k) * p0 ** k * (1 - p0) ** (n - k);
  return Math.min(1, p);
}

export const SOSPECHOSO = 0.05;

// ── LOS RESOLUTORES ───────────────────────────────────────────────────
export const RESOLUTORES: Resolutor[] = [
  {
    // La pregunta del coordinador (a): ¿cuántos se resuelven pegándole la
    // terminación de la persona al lema que la pista pone entre
    // paréntesis, sin entender la regla? El paradigma correcto.
    nombre: 'lema del paréntesis + terminación de la persona (infinitivo pessoal SIEMPRE)',
    usa: 'el paréntesis y el sujeto contiguo; NADA del resto de la frase',
    baseline: 1 / 3,
    f: (x) => (x.lema && x.persona ? infinitivoPessoal(x.lema, x.persona) : null),
  },
  {
    // La misma sin saber ortografía: concatenar y ya. Mide cuánto del
    // ítem sobrevive al alumno que ni siquiera sabe que «sair» abre hiato.
    nombre: 'concatenación ingenua: lema visible + desinencia, sin ajuste ortográfico',
    usa: 'el paréntesis y el sujeto contiguo',
    baseline: 1 / 3,
    f: (x) => {
      if (!x.lema || !x.persona) return null;
      const d: Record<Persona, string> = { eu: '', tu: 'es', ele: '', 'nós': 'mos', eles: 'em' };
      return x.lema + d[x.persona];
    },
  },
  {
    // El gordo de la sección A: la tabla cerrada de ocho palabras.
    nombre: 'tabla de disparadores (8 palabras funcionales) + lema + persona',
    usa: 'UNA palabra funcional a la izquierda del hueco, el paréntesis y el sujeto',
    baseline: 1 / 3,
    f: (x) => {
      const clase = disparadorDe(x.sentence);
      if (!clase || !x.lema || !x.persona) return null;
      return FORMAS[x.id]?.[clase] ?? null;
    },
  },
  {
    // El rasgo 12 de la batería vieja, reencarnado: en un cloze no se
    // «juzga» la glosa, se PRODUCE desde ella. Si el español elige el
    // mismo verbo, el alumno lo traduce y sólo le queda morfología A1.
    nombre: 'traducir la frase al español y poner el verbo español (DECLARADO)',
    usa: 'la frase, pero sólo como español: cero conocimiento del portugués salvo la morfología de ser/estar',
    baseline: 1 / 3,
    f: (x) => x.traduccionDa ?? null,
  },
  {
    nombre: 'responder siempre la forma más frecuente del punto',
    usa: 'nada del ítem: sólo el reparto del lote',
    baseline: 1 / 3,
    f: (x, todos) => {
      const m = new Map<string, number>();
      for (const y of todos) if (y.seccion === x.seccion) m.set(y.answer, (m.get(y.answer) ?? 0) + 1);
      return [...m].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
    },
  },
];

/** Las formas de cada construcción, declaradas por ítem. El conjugador
 *  del proyecto sólo deriva el infinitivo pessoal; el conjuntivo se
 *  declara para poder medir qué produciría la REGLA EQUIVOCADA. */
export const FORMAS: Record<string, Record<string, string>> = {};

export function bateriaCloze(items: ItemCloze[]): MedidaResolutor[] {
  return RESOLUTORES.map((r) => medirResolutor(r, items)).sort((a, b) => b.acierto - a.acierto);
}

/** ¿En cuántos ítems el ANCHO DEL INPUT distingue ya la respuesta de la
 *  forma que produciría la regla equivocada? Es el atajo propio del
 *  formato: no está en el texto, está en el DOM. */
export function fugaPorAncho(items: ItemCloze[]): { id: string; ancho: number; rivales: string; distingue: boolean }[] {
  return items.map((x) => {
    const a = anchoDelInput(x.answer);
    const rs = x.rivales ?? [];
    return {
      id: x.id, ancho: a,
      rivales: rs.map((r) => `${r}(${anchoDelInput(r)})`).join(' '),
      distingue: rs.length > 0 && rs.every((r) => anchoDelInput(r) !== a),
    };
  });
}

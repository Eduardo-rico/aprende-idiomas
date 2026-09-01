// scripts/lib/transformacion.ts
//
// LA TERCERA MÁQUINA: transformación. Se da una frase y se pide la otra.
//
// Es el formato que 15 puntos del currículo llevaban esperando, y el
// único que puede examinar `b3-pron-directo`: el cloze no puede, porque
// el clítico de OD es homógrafo del artículo que lo precede y el ítem
// necesita el antecedente en la frase, así que la respuesta queda escrita
// al lado. Aquí el clítico es la SALIDA — «Comprei a revista» →
// «Comprei-a» — y eso sí se mide.
//
// ── EL ATAJO QUE ESTE FORMATO REGALA ─────────────────────────────────
//
// Traducir la fuente al español, transformar en español y traducir de
// vuelta. En muchos puntos el español hace la misma operación, y entonces
// el ítem mide español y no portugués. No se puede detectar por regex,
// así que cada ítem lo DECLARA (`espejoEs`) y el preflight imprime la
// proporción del lote. Es el mismo tratamiento que la glosa cognada de
// E2#13: lo que no se calcula, se declara, y lo declarado se mide.
//
// El tope está en la mitad. Por encima de ahí el lote enseña más
// castellano que portugués, por muy verdes que salgan los demás gates.
import {
  conjugar, encliseReal, proclise, mqpSimples, futuroConjuntivo, infinitivoPessoal,
  imperfeitoConjuntivo, type Clitico, type Persona, type Tiempo,
} from './paradigma-pt';

export const TOPE_ESPEJO = 0.5;

export interface ItemTrans {
  /** punto del currículo */
  p: string;
  pasada: number;
  /** la frase de partida */
  s: string;
  /** qué hay que hacer, en español, sin decir CÓMO */
  instruccion: string;
  /** la respuesta ÚNICA. Si el ítem la deriva, se deja fuera y se
   *  declaran `lema`/`t`/`per`; si no, va aquí literal. */
  r?: string;
  alt?: string[];
  hint?: string;
  /** ¿El español hace la MISMA transformación? Se declara siempre: es el
   *  atajo mayor del formato y no se puede calcular. */
  espejoEs: boolean;
  /** derivación verbal opcional, como en el cloze */
  lema?: string; t?: Tiempo | 'mqpSimples' | 'futSubj' | 'infPess' | 'imperfSubj'; per?: Persona;
  /** derivación de colocación: «dar» + «lhe» → «dá-lhe» / «não lhe dá» */
  coloc?: { verbo: string; clitico: Clitico; proclitico?: boolean };
  /** Frase completa con `{}` donde va la forma derivada. Los ítems de
   *  colocación lo necesitan: la instrucción pide reescribir la frase, no
   *  el verbo suelto, y una respuesta que es un fragmento cuando la
   *  consigna pide una frase cobra fallos falsos. Los de forma verbal
   *  («escribe sólo el verbo») no lo llevan, y su consigna lo dice. */
  molde?: string;
}

export function respuestaDe(x: ItemTrans): string | null {
  const nucleo = nucleoDe(x);
  if (nucleo === null) return null;
  return x.molde ? x.molde.replace('{}', nucleo) : nucleo;
}

/** La forma que la transformación produce, sin la frase alrededor. */
function nucleoDe(x: ItemTrans): string | null {
  if (x.r) return x.r;
  if (x.coloc) {
    const { verbo, clitico, proclitico } = x.coloc;
    // `encliseReal`, NO `enclise`: la segunda es la ingenua, la que
    // fabrica el distractor de un juicio. Con ella este lote habría
    // publicado «fez-o» por «fê-lo».
    return proclitico ? proclise(clitico, verbo) : encliseReal(verbo, clitico);
  }
  if (x.lema && x.t && x.per) {
    switch (x.t) {
      case 'mqpSimples': return mqpSimples(x.lema, x.per);
      case 'futSubj': return futuroConjuntivo(x.lema, x.per);
      case 'infPess': return infinitivoPessoal(x.lema, x.per);
      case 'imperfSubj': return imperfeitoConjuntivo(x.lema, x.per);
      default: return conjugar(x.lema, x.t as Tiempo, x.per);
    }
  }
  return null;
}

const norm = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^\p{L}\p{N} ]/gu, ' ').replace(/\s+/g, ' ').trim();

/** Como `norm`, pero CONSERVA el guion. El gate de «la respuesta ya está
 *  en la fuente» tiene que usar ésta: con la normalización blanda,
 *  «Comprei-a» se convierte en «comprei a», que sí está en «Comprei a
 *  revista» — y el gate marcaba como fuga justo el rasgo que el ítem
 *  enseña. Comerse el guion es comerse la ênclise. */
const normDuro = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^\p{L}\p{N}\- ]/gu, ' ').replace(/\s+/g, ' ').trim();

export function verificar(items: ItemTrans[]): string[] {
  const v: string[] = [];
  const vistas = new Set<string>();
  const porPunto = new Map<string, ItemTrans[]>();

  for (const [i, x] of items.entries()) {
    const id = `TR-${String(i + 1).padStart(3, '0')} (${x.p})`;
    const r = respuestaDe(x);
    if (!r) { v.push(`${id}: sin respuesta — ni declarada ni derivable`); continue; }

    // LA CICATRIZ DEL CLOZE, aplicada: un ejercicio de producción cuya
    // respuesta ya está en el enunciado no mide nada.
    if (norm(x.s) === norm(r)) v.push(`${id}: la respuesta es idéntica a la fuente — no hay transformación`);
    if (new RegExp(`(?<![\\p{L}-])${normDuro(r)}(?![\\p{L}-])`, 'u').test(normDuro(x.s)))
      v.push(`${id}: la respuesta «${r}» ya está escrita en la fuente`);
    if (x.hint && new RegExp(`(?<![\\p{L}])${norm(r)}(?![\\p{L}])`, 'u').test(norm(x.hint)))
      v.push(`${id}: la pista deletrea la respuesta «${r}»`);
    if (new RegExp(`(?<![\\p{L}])${norm(r)}(?![\\p{L}])`, 'u').test(norm(x.instruccion)))
      v.push(`${id}: la INSTRUCCIÓN deletrea la respuesta «${r}»`);

    if (!x.instruccion.trim()) v.push(`${id}: sin instrucción`);
    // Una instrucción que no dice qué hacer deja la salida abierta, y una
    // salida abierta cobra fallos falsos que entran en el FSRS.
    if (x.instruccion.trim().length < 15) v.push(`${id}: instrucción demasiado corta para determinar la salida`);

    const k = norm(x.s);
    if (vistas.has(k)) v.push(`${id}: fuente repetida dentro del lote`);
    vistas.add(k);

    // Las alternativas tienen que ser DISTINTAS de la respuesta y entre
    // sí: una alternativa igual a la respuesta es ruido que finge holgura.
    for (const a of x.alt ?? []) {
      if (norm(a) === norm(r)) v.push(`${id}: la alternativa «${a}» es la respuesta`);
      if (norm(a) === norm(x.s)) v.push(`${id}: la alternativa «${a}» es la fuente`);
    }

    const g = porPunto.get(x.p) ?? [];
    g.push(x); porPunto.set(x.p, g);
  }

  // El atajo, por punto: si TODOS los ítems de un punto son espejo del
  // español, ese punto no está midiendo portugués en absoluto.
  for (const [p, xs] of porPunto) {
    const espejo = xs.filter((x) => x.espejoEs).length;
    if (espejo === xs.length && xs.length >= 3)
      v.push(`${p}: los ${xs.length} ítems son espejo del español — el punto se resuelve traduciendo`);
    if (espejo / xs.length > TOPE_ESPEJO)
      v.push(`${p}: ${espejo}/${xs.length} ítems son espejo del español (tope ${TOPE_ESPEJO * 100} %)`);
  }
  return v;
}

/** El informe del atajo, para pegar en el doc. Se imprime SIEMPRE, salga
 *  verde o rojo: una cifra que sólo aparece cuando falla no es una
 *  medición, es una alarma. */
export function informeEspejo(items: ItemTrans[]): string[] {
  const L: string[] = [];
  const porPunto = new Map<string, ItemTrans[]>();
  for (const x of items) { const g = porPunto.get(x.p) ?? []; g.push(x); porPunto.set(x.p, g); }
  const total = items.length;
  const espejo = items.filter((x) => x.espejoEs).length;
  L.push(`**Atajo de traducción: ${espejo}/${total} ítems (${Math.round((espejo / total) * 100)} %) son espejo del español.**`);
  L.push('');
  L.push('| punto | ítems | espejo | mide portugués en |');
  L.push('|---|---:|---:|---|');
  for (const [p, xs] of porPunto) {
    const e = xs.filter((x) => x.espejoEs).length;
    L.push(`| \`${p}\` | ${xs.length} | ${e} | ${xs.length - e} |`);
  }
  return L;
}

// scripts/lib/gate-pro-drop.ts
//
// GATE DE PRO-DROP. Punto: `l5-pro-drop`.
//
// El punto se corrigió el 2026-09-04 después de medirlo: la OMISIÓN del
// sujeto SÍ transfiere del español al latín —1.397 sujetos pronominales
// expresos sobre 38.026 verbos finitos, el 3,67 %—. Lo que NO transfiere es
// **recuperar la persona**, y falla exactamente donde el español funde dos
// casillas que el latín distingue.
//
// Por eso el hueco va en la GLOSA ESPAÑOLA y no en el latín: está puesto en
// la casilla donde el regalo se acaba.
//
// ── LA COMPROBACIÓN QUE ES EL PUNTO ──────────────────────────────────
//
// Un ítem sólo mide si se cumplen las DOS cosas a la vez, y cada una se
// comprueba por un camino distinto:
//
//   · **el español funde** las dos personas. Se declara cuál es la otra y
//     cuál la forma compartida, y el gate exige que esa forma aparezca
//     LITERALMENTE en la glosa. Es una comprobación de texto, no de fe.
//   · **el latín las distingue.** Se calcula con la máquina conjugando las
//     dos personas: si diera la misma forma, el ítem no tendría respuesta.
//
// Sin la primera, el ítem no examina nada porque el español ya lo dice.
// Sin la segunda, el ítem no tiene solución. Y ninguna de las dos se puede
// dar por supuesta: el `varia` del punto exige cuatro valores y sólo dos de
// ellos son del imperfecto.
//
// ── EL SEGUNDO FRENTE: EL ESPAÑOL DE MÉXICO ──────────────────────────
//
// La 2.ª y la 3.ª del plural NO se funden en el español peninsular —«sois»
// contra «son»— pero SÍ en el de México, donde no hay «vosotros». Ahí el
// latín omite y el español obliga a decir «ustedes». Es un caso en el que la
// dificultad depende de la variedad del alumno, así que el ítem declara cuál
// asume y el gate lo exige escrito.
import { conjugar, type Persona, type Tiempo, type EntradaVerbal } from '../../lib/data/languages/la/paradigma-la';
import { separablePorPosicion } from './atajos';
import { revisarCobertura, type Cobertura } from './cobertura';

export type Variedad = 'general' | 'mexico';

export interface ItemProDrop {
  id: string;
  punto: string;
  verbo: EntradaVerbal;
  persona: Persona;
  tiempo: Tiempo;
  /** La frase latina, con el sujeto OMITIDO: si lo lleva expreso, el ítem no
   *  es de pro-drop. */
  latin: string;
  /** La glosa española con `___` donde va el sujeto que el español obliga a
   *  poner y el latín no. */
  glosa: string;
  /** Lo que hay que escribir en el hueco. */
  respuesta: string;
  fusion: {
    /** La persona con la que el español lo confunde. */
    laOtraPersona: Persona;
    /** La forma verbal ESPAÑOLA que las dos comparten. Tiene que aparecer
     *  literalmente en la glosa: es lo que hace que el hueco no sea gratis. */
    formaCompartida: string;
    /** En qué español se funden. `mexico` para el par 2.ª/3.ª del plural. */
    variedad: Variedad;
    /** Por qué se funden, para que no haya que reconstruirlo. */
    motivo: string;
  };
}

export type ClaseFalloPD =
  | 'persona-no-derivada'
  | 'sujeto-expreso'
  | 'el-espanol-no-funde'
  | 'el-latin-tampoco-distingue'
  | 'fuga-por-la-glosa'
  | 'valor-sin-cubrir'
  | 'estrategia-constante'
  | 'orden-separable'
  | 'cobertura-cero'
  | 'cobertura-sin-motivo';

export interface FalloPD { item: string; clase: ClaseFalloPD; detalle: string }

// ── EL SEGUNDO CAMINO PARA LA FUSIÓN ─────────────────────────────────
//
// La primera versión de este gate comprobaba que `formaCompartida` apareciera
// en la glosa, y con eso se daba por satisfecha. Pero que «estaba» esté en la
// glosa no demuestra que «estaba» funda la primera con la tercera: se estaba
// creyendo al autor. Un ítem en PRESENTE con «soy» declarado como forma
// compartida pasaba el gate y no mide nada, porque el español distingue
// «soy» de «es» perfectamente.
//
// Esta tabla es el hecho independiente. Es corta y cerrada porque el español
// tiene catorce paradigmas finitos y se sabe cuáles funden:
//
//   1.ª sg = 3.ª sg  en imperfecto, condicional y los dos subjuntivos
//                    (y sus cuatro compuestos) — OCHO de catorce
//   2.ª pl = 3.ª pl  en TODOS, pero sólo donde no hay «vosotros»
//
// De los tiempos que L1 tiene, sólo el imperfecto funde el par del singular.
// Presente, futuro y perfecto los distinguen («soy/es», «seré/será»,
// «fui/fue»), así que ahí el punto no tiene nada que enseñar.

const FUNDE_EL_SINGULAR: Tiempo[] = ['imperfecto'];

/** ¿Funde el español ESAS DOS personas en ESE tiempo? Es una propiedad del
 *  español, no de cómo se escriba el ítem, y por eso se calcula en vez de
 *  declararse. */
export function elEspanolFundeDeVerdad(a: Persona, b: Persona, tiempo: Tiempo, variedad: Variedad): boolean {
  const par = [a, b].sort().join('+');
  if (par === '1sg+3sg') return FUNDE_EL_SINGULAR.includes(tiempo);
  if (par === '2pl+3pl') return variedad === 'mexico';
  return false;
}

/** Los pronombres sujeto latinos. Si aparece uno, el sujeto está expreso y el
 *  ítem no examina la omisión. */
const SUJETOS_EXPRESOS = ['ego', 'tū', 'tu', 'nōs', 'nos', 'vōs', 'vos', 'is', 'ea', 'id',
  'ille', 'illa', 'illud', 'ipse', 'ipsa', 'ipsum', 'hic', 'haec', 'hoc'];

/** Palabras españolas que delatan la persona por otra vía que el hueco. `su`
 *  y `sus` NO están: son ambiguas en español y por eso no filtran. */
const DELATAN_LA_PERSONA = ['mi', 'mis', 'mío', 'mía', 'míos', 'mías', 'me', 'conmigo',
  'tu', 'tus', 'tuyo', 'tuya', 'te', 'contigo', 'nuestro', 'nuestra', 'nuestros', 'nuestras',
  'nos', 'vuestro', 'vuestra', 'vuestros', 'vuestras', 'os'];

const palabras = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-́̄̆]/g, '').normalize('NFC')
    .split(/[^a-zñü]+/).filter(Boolean);

export function revisarItemProDrop(it: ItemProDrop): FalloPD[] {
  const out: FalloPD[] = [];
  const push = (clase: ClaseFalloPD, detalle: string) => out.push({ item: it.id, clase, detalle });

  const forma = conjugar(it.verbo, it.persona, it.tiempo);
  if (!it.latin.includes(forma))
    push('persona-no-derivada', `la máquina da «${forma}» para ${it.persona} de ${it.tiempo} y la frase no la trae`);

  for (const p of palabras(it.latin))
    if (SUJETOS_EXPRESOS.includes(p))
      push('sujeto-expreso', `«${p}» pone el sujeto: el ítem ya no examina la omisión`);

  // El español funde, por DOS caminos independientes: que la forma declarada
  // esté en la glosa (texto) y que ese par de personas se funda de verdad en
  // ese tiempo (tabla). El primero solo se creía al autor.
  if (!it.glosa.toLowerCase().includes(it.fusion.formaCompartida.toLowerCase()))
    push('el-espanol-no-funde',
      `declara que «${it.fusion.formaCompartida}» es la forma compartida y la glosa no la contiene`);

  if (!elEspanolFundeDeVerdad(it.persona, it.fusion.laOtraPersona, it.tiempo, it.fusion.variedad))
    push('el-espanol-no-funde',
      `el español NO funde ${it.persona} con ${it.fusion.laOtraPersona} en ${it.tiempo}${
        it.fusion.variedad === 'mexico' ? ' ni en México' : ''}: el hueco no hace falta, la traducción ya dice la persona`);

  // El latín distingue: se comprueba con la máquina, no de palabra.
  const otra = conjugar(it.verbo, it.fusion.laOtraPersona, it.tiempo);
  if (otra === forma)
    push('el-latin-tampoco-distingue',
      `«${forma}» vale para ${it.persona} y para ${it.fusion.laOtraPersona}: el ítem no tiene respuesta única`);

  if (!it.glosa.includes('___')) push('fuga-por-la-glosa', 'la glosa no tiene hueco');
  for (const p of palabras(it.glosa.replace('___', ' ')))
    if (DELATAN_LA_PERSONA.includes(p))
      push('fuga-por-la-glosa', `«${p}» en la glosa ya dice la persona: el hueco es gratis`);

  if (!it.fusion.motivo || it.fusion.motivo.length < 20)
    push('el-espanol-no-funde', 'no dice por qué se funden');

  return out;
}

/** El azar con cuatro valores obligatorios. Ninguna respuesta constante puede
 *  pasar de ahí en un lote repartido. */
export const TECHO_CONSTANTE = 0.25;

export function tasaConstante(items: ItemProDrop[]): { mejor: string; tasa: number } {
  const n = items.length || 1;
  const cuenta = new Map<string, number>();
  for (const it of items) {
    const r = it.respuesta.toLowerCase();
    cuenta.set(r, (cuenta.get(r) ?? 0) + 1);
  }
  let mejor = '', max = 0;
  for (const [r, c] of cuenta) if (c > max) { max = c; mejor = r; }
  return { mejor, tasa: max / n };
}

export function revisarLoteProDrop(items: ItemProDrop[]): {
  fallos: FalloPD[]; constante: { mejor: string; tasa: number }; cobertura: Cobertura[];
} {
  const fallos = items.flatMap(revisarItemProDrop);
  const push = (clase: ClaseFalloPD, detalle: string) => fallos.push({ item: '(lote)', clase, detalle });

  // Los cuatro valores que el `varia` exige OBLIGATORIAMENTE.
  const EXIGIDOS: [Persona, Tiempo][] = [
    ['1sg', 'imperfecto'], ['3sg', 'imperfecto'], ['2pl', 'presente'], ['3pl', 'presente'],
  ];
  for (const [p, t] of EXIGIDOS)
    if (!items.some((it) => it.persona === p && it.tiempo === t))
      push('valor-sin-cubrir', `el punto exige ${p} de ${t} y el lote no lo trae`);

  const constante = tasaConstante(items);
  if (constante.tasa > TECHO_CONSTANTE + 0.1)
    push('estrategia-constante',
      `contestar siempre «${constante.mejor}» saca ${(100 * constante.tasa).toFixed(0)} %, y el azar con cuatro valores es ${100 * TECHO_CONSTANTE} %`);

  const sep = separablePorPosicion(items.map((it) => (it.persona.endsWith('sg') ? 'A' : 'B')).join(''));
  if (sep) push('orden-separable', sep);

  const mexico = items.filter((it) => it.fusion.variedad === 'mexico').length;
  const cobertura: Cobertura[] = [
    { comprobacion: 'la persona contra la máquina', decididos: items.length, total: items.length },
    { comprobacion: 'el español funde, comprobado en la glosa', decididos: items.length, total: items.length },
    { comprobacion: 'los que dependen del español de México', decididos: mexico, total: items.length,
      motivoDeLosQueQuedanFuera: 'los del imperfecto, que se funden en cualquier variedad («era» para 1.ª y 3.ª). Este renglón dice cuánto del lote asume que el alumno no usa «vosotros»' },
  ];
  fallos.push(...revisarCobertura(cobertura));

  return { fallos, constante, cobertura };
}

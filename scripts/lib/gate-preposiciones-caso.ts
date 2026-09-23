// scripts/lib/gate-preposiciones-caso.ts — «in urbem» frente a «in urbe».
//
// Punto `l11-preposiciones-caso`. `descripcion`: «in, sub, super: con
// acusativo indican dirección, con ablativo situación». `motivo`: «el
// español usa la misma preposición para las dos […]: el alumno ignora el
// caso y pierde la mitad del sentido». `varia`: «la preposición y el caso,
// con los dos valores presentes».
//
// ══ EL FORMATO: el hueco va en la GLOSA ═══════════════════════════════
//
//     Pueri in viam currunt.    «Los niños corren ___ calle.»  → a la
//     Pueri in via currunt.     «Los niños corren ___ calle.»  → por la
//
// El hueco lleva preposición y artículo juntos para que «a» + «el» pueda
// salir «al» sin que el alumno tenga que escribir español malo.
//
// ══ POR QUÉ PARES, Y POR QUÉ LA GLOSA ES IDÉNTICA DENTRO DEL PAR ═════
//
// El lote retirado de `l3-ablativo-agente` (§5.tricies septies) cayó por
// una ruta ciega que leía la GLOSA y acertaba 10 de 12: la pista estaba en
// el español. Aquí eso se cierra por construcción y no por detección: los
// dos ítems de un par llevan la MISMA glosa, carácter a carácter, así que
// cualquier ruta que lea la glosa contesta lo mismo en los dos y acierta
// exactamente uno. El gate lo exige.
//
// Y el mismo argumento con el VERBO: el verbo es el mismo en los dos, así
// que «un verbo de movimiento pide dirección» —la ruta que el español sí
// sabe usar— tampoco decide. Lo único que cambia dentro del par es la
// desinencia del nombre, que es el punto.
//
// El par paga con la pista del reencuentro (§5.tricies ter): techo 0,75 de
// «lo contrario de la vez anterior», declarado, con piso de distancia.
//
// ══ LAS DOS COSAS QUE ESTE GATE NO MODELA, dichas ════════════════════
//
//   · el GÉNERO del artículo español. Comprueba el NÚMERO (artículo plural
//     ⇔ nombre español en -s) y nada más: «la templo» pasaría. Lo juzga el
//     lingüista, y un test fija que este gate calla ahí (§C5).
//   · el SENTIDO local del ablativo. El sello del treebank dice que el
//     verbo aparece con los dos casos, no que las apariciones sean de
//     lugar (ver la cabecera de `atestar-in-caso.ts`).
import { conjugar, declinar, declinacionDe, type Numero } from '../../lib/data/languages/la/paradigma-la';
import { NOMBRES_L1, VERBOS_L1 } from '../../lib/data/languages/la/lexicon-l1';
import { NOMBRES_IMPORTADOS, VERBOS_IMPORTADOS } from '../../lib/data/languages/la/importados';
import { formasUnicasDeL1 } from '../../lib/data/languages/la/todas-las-formas';
import { PLURALIA_TANTUM, paradigmaPluralTantum } from '../../lib/data/languages/la/plural-tantum';
import SELLO from '../../lib/data/languages/la/atestacion-in-caso.json';
import { palabrasDesconocidas } from './gate-vocabulario-del-marco';
import { revisarCobertura, type Cobertura } from './cobertura';
import { separablePorPosicion } from './atajos';
import { patronDe } from './orden-publicado';
import { coberturaDeLosPares, distanciasEnElPar, DISTANCIA_MINIMA_EN_EL_PAR, techoDeLaSegundaVez } from './coste-del-par';

export { distanciasEnElPar, DISTANCIA_MINIMA_EN_EL_PAR, techoDeLaSegundaVez };

type Cuenta = { ac: number; abl: number };
const S = SELLO as unknown as {
  porPreposicion: Record<'in' | 'sub' | 'super', { vulgata: Cuenta; resto: Cuenta }>;
  inPorVerbo: Record<string, Cuenta>;
  inPorNombre: Record<string, Cuenta>;
};

export type Lado = 'direccion' | 'situacion';
export type Articulo = 'el' | 'la' | 'los' | 'las' | '';

export interface ItemPrepCaso {
  id: string;
  punto: string;
  pareja: string;
  /** Sin cantidad: es como el corpus lo escribe (0 mácrones en 227.301). */
  latin: string;
  latinConCantidad: string;
  /** El verbo tal como sale; su lema CON cantidad, como está en el
   *  lexicón —la forma se deriva de él con `conjugar`—; y el verbo
   *  español: el infinitivo, que tiene que ser una de las glosas del
   *  lexicón, y la forma que sale en la glosa del ítem. */
  verbo: { forma: string; lema: string; infinitivoEs: string; enEspanol: string };
  /** El nombre que rige `in`. La forma NO se declara: la deriva la máquina
   *  del lema, el caso y el número. */
  nombre: { lema: string; caso: 'ac' | 'abl'; numero: Numero; enEspanol: string };
  lado: Lado;
  /** La glosa con `___` justo delante del nombre español. */
  glosa: string;
  articulo: Articulo;
  respuesta: string;
  aceptadas: string[];
  /** La respuesta de la otra lectura: la del otro ítem del par. */
  elErrorDiana: string;
}

export type ClaseFalloPC =
  | 'marco-con-macrones' | 'cantidad-mal-puesta' | 'verbo-no-esta-en-la-frase'
  | 'nombre-no-derivable' | 'nombre-no-sigue-a-in' | 'lado-no-lo-decide-el-caso'
  | 'glosa-sin-hueco' | 'glosa-no-nombra-el-lugar' | 'articulo-numero'
  | 'aceptadas-no-derivadas' | 'respuesta-no-aceptada' | 'error-diana-no-es-del-otro-lado'
  | 'verbo-sin-los-dos-casos-en-el-corpus' | 'nombre-sin-ese-caso-en-el-corpus'
  | 'latin-fuera-de-l1' | 'punto-ajeno'
  | 'verbo-no-es-del-lema' | 'verbo-espanol-no-es-la-glosa' | 'verbo-espanol-no-esta-en-la-glosa'
  | 'verbo-espanol-con-en-de-movimiento' | 'lugar-no-es-la-glosa' | 'verbo-espanol-no-es-del-infinitivo'
  | 'pareja-incompleta' | 'pareja-sin-contraste' | 'pareja-glosas-distintas'
  | 'pareja-no-minima' | 'pareja-verbos-distintos' | 'error-diana-no-es-la-respuesta-del-par'
  | 'varia-incompleto' | 'estrategia-ciega' | 'lectura-parcial-sin-contraejemplo'
  | 'orden-publicado' | 'pareja-adyacente' | 'pareja-demasiado-cerca'
  | 'cobertura-cero' | 'cobertura-sin-motivo';

export interface FalloPC { item: string; clase: ClaseFalloPC; detalle: string }

const sinM = (s: string) =>
  s.normalize('NFD').replace(/[̄̆]/g, '').normalize('NFC').toLowerCase().replace(/v/g, 'u').replace(/j/g, 'i');
const palabras = (s: string) => s.split(/[^\p{L}]+/u).filter((w) => w.length > 0);

/** El sello va keyed por el lema TAL COMO LO ESCRIBE el treebank —PROIEL
 *  pone `voco`, y Perseus podría poner `uoco`—, y este gate compara con
 *  `sinM`, que funde u/v. La primera versión buscaba la clave normalizada
 *  en el sello crudo y `vocō` salía con 0 y 0 teniendo 15 y 11: el gate se
 *  puso rojo la primera vez que se corrió, y por esto. Se normaliza el
 *  sello del mismo modo, SUMANDO las grafías que se funden. */
function normalizado(r: Record<string, Cuenta>): Map<string, Cuenta> {
  const m = new Map<string, Cuenta>();
  for (const [k, v] of Object.entries(r)) {
    const c = m.get(sinM(k)) ?? { ac: 0, abl: 0 };
    m.set(sinM(k), { ac: c.ac + v.ac, abl: c.abl + v.abl });
  }
  return m;
}
const IN_POR_VERBO = normalizado(S.inPorVerbo);
const IN_POR_NOMBRE = normalizado(S.inPorNombre);

const VERBOS = [...VERBOS_L1, ...VERBOS_IMPORTADOS];
const NOMBRES = [...NOMBRES_L1, ...NOMBRES_IMPORTADOS];

/** Las formas CON cantidad que produce la máquina, en minúscula. Contra
 *  esto se mira `latinConCantidad` palabra a palabra: un mácron inventado
 *  (`Pūerī`) o uno que falta (`Pueri`) da una forma que la máquina no
 *  produce. Antes sólo se miraba la forma del nombre, y las dos mutaciones
 *  pasaban en verde. */
let formasConCantidad: Set<string> | null = null;
function conCantidad(): Set<string> {
  formasConCantidad ??= new Set(formasUnicasDeL1().flatMap((f) => f.split(/\s+/)).map((f) => f.normalize('NFC').toLowerCase()));
  return formasConCantidad;
}

/** Verbos españoles cuyo complemento de DIRECCIÓN lleva «en»: «entró en la
 *  ciudad», «cayó en el agua», «lo metió en la casa». Con uno de ellos en
 *  la glosa, «en» sería correcto en los dos lados y el ítem suspendería a
 *  quien lee bien (§D8). Es una lista escrita a mano y se declara así: el
 *  gate no modela la sintaxis española, sólo la veta donde se sabe que
 *  muerde. */
export const VERBOS_ES_CON_EN_DE_MOVIMIENTO = ['entrar', 'caer', 'meter', 'poner', 'introducir', 'penetrar', 'hundir', 'echar', 'arrojar'];

/** La glosa del lexicón, partida por comas, sin artículo. Vacía en lo
 *  importado, que entra sin glosa (ver `importados.ts`). */
const glosasDe = (g: string) => g.split(/[,;]/).map((x) => x.trim().replace(/^(el|la|los|las) /, '')).filter((x) => x !== '');
/** «montes» → «monte», «campos» → «campo», «ciudades» → «ciudad»: se
 *  prueban las dos formas de quitar el plural y vale la que esté en la glosa. */
const singulares = (w: string) => [w, w.replace(/s$/, ''), w.replace(/es$/, '')];

/** La forma del nombre, de la máquina: lexicón, importados o la tabla de
 *  los pluralia tantum (`castra`). `null` si no la da ninguna. */
export function nombreDerivado(n: ItemPrepCaso['nombre']): string | null {
  const e = NOMBRES.find((x) => x.lema === n.lema);
  if (e) return declinar(e, n.caso, n.numero);
  const pt = PLURALIA_TANTUM.find((x) => x.lema === n.lema);
  if (pt && n.numero === 'pl') return paradigmaPluralTantum(pt)[`${n.caso}.pl`] ?? null;
  return null;
}

/** Lo que vale en el hueco, DERIVADO del lado y del artículo. Las dos
 *  listas son disjuntas por construcción, y un test lo afirma: si alguna
 *  vez compartieran una cadena, un ítem se podría aprobar con la lectura
 *  contraria (§D8 al revés).
 *
 *  Las amplió el lingüista, y cada una es una respuesta que un mexicano
 *  escribe con naturalidad y que la primera versión suspendía (§D8):
 *  «para» («huyen para los montes») y «rumbo a» en la dirección; «adentro
 *  de» —más mexicano que «dentro de»—, «sobre» («corren sobre la calle») y
 *  «entre», sólo con plural, en la situación. Aceptar de más no suspende
 *  a nadie; aceptar la lectura CONTRARIA sí, y por eso ninguna cadena está
 *  en las dos. */
export function aceptadasDe(lado: Lado, art: Articulo): string[] {
  const con = (p: string) => (art === '' ? p : `${p} ${art}`);
  const pl = art === 'los' || art === 'las';
  if (lado === 'direccion')
    return [art === 'el' ? 'al' : con('a'), con('hacia'), con('hasta'), con('para'), art === 'el' ? 'rumbo al' : con('rumbo a')];
  return [con('en'), con('por'), art === 'el' ? 'dentro del' : con('dentro de'), art === 'el' ? 'adentro del' : con('adentro de'),
    con('sobre'), ...(pl ? [con('entre')] : [])];
}

export function revisarItemPC(item: ItemPrepCaso): FalloPC[] {
  const out: FalloPC[] = [];
  const push = (clase: ClaseFalloPC, detalle: string) => out.push({ item: item.id, clase, detalle });
  const ws = palabras(item.latin).map(sinM);

  if (/[āēīōūȳĀĒĪŌŪ]/.test(item.latin))
    push('marco-con-macrones', `el marco lleva macrones y el corpus tiene 0: «${item.latin}»`);
  if (sinM(item.latinConCantidad) !== sinM(item.latin))
    push('cantidad-mal-puesta', `«${item.latinConCantidad}» no es la misma frase que «${item.latin}»`);
  if (item.punto !== 'l11-preposiciones-caso') push('punto-ajeno', `el ítem dice ser de «${item.punto}»`);
  if (!ws.includes(sinM(item.verbo.forma)))
    push('verbo-no-esta-en-la-frase', `declara «${item.verbo.forma}» y la frase no lo lleva`);
  for (const w of palabras(item.latinConCantidad))
    if (!conCantidad().has(w.normalize('NFC').toLowerCase()))
      push('cantidad-mal-puesta', `«${w}» no es una forma que la máquina produzca con esa cantidad`);

  // ── EL VERBO: la forma sale del lema, y el español de la glosa del lexicón ──
  const v0 = VERBOS.find((x) => x.lema === item.verbo.lema);
  const formas = v0 ? (['3sg', '3pl'] as const).map((p) => sinM(conjugar(v0, p))) : [];
  if (!formas.includes(sinM(item.verbo.forma)))
    push('verbo-no-es-del-lema', `«${item.verbo.forma}» no es la 3.ª persona de presente de «${item.verbo.lema}»`);
  // La glosa del lexicón IMPORTADO va vacía a propósito; ahí el infinitivo
  // español no se puede atar y la cobertura lo cuenta.
  if (v0 && v0.glosa !== '' && !glosasDe(v0.glosa).includes(item.verbo.infinitivoEs))
    push('verbo-espanol-no-es-la-glosa', `«${item.verbo.infinitivoEs}» no es ninguna de las glosas de «${item.verbo.lema}» (${v0.glosa})`);
  if (!new RegExp(`(?<!\\p{L})${item.verbo.enEspanol}(?!\\p{L})`, 'u').test(item.glosa))
    push('verbo-espanol-no-esta-en-la-glosa', `«${item.verbo.enEspanol}» no sale en «${item.glosa}»`);
  // La forma española no se DERIVA del infinitivo: este gate no conjuga
  // español. Lo que sí se exige es que empiecen igual, que es lo que caza
  // una glosa cambiada entera («se sientan» con `caminar` declarado). Un
  // irregular de raíz (`venir` / «vienen») saldría ROJO: falso positivo
  // ruidoso y visible, que es preferible a un verde mudo (§B5 al revés).
  if (item.verbo.enEspanol.slice(0, 3) !== item.verbo.infinitivoEs.slice(0, 3))
    push('verbo-espanol-no-es-del-infinitivo', `«${item.verbo.enEspanol}» no empieza como «${item.verbo.infinitivoEs}»`);
  if (VERBOS_ES_CON_EN_DE_MOVIMIENTO.includes(item.verbo.infinitivoEs))
    push('verbo-espanol-con-en-de-movimiento', `con «${item.verbo.infinitivoEs}» el español dice «en» también con dirección, y el ítem suspendería a quien lee bien (§D8)`);

  // ── EL CASO LO DERIVA LA MÁQUINA, Y TIENE QUE IR DETRÁS DE `in` ──
  const f = nombreDerivado(item.nombre);
  if (f === null) push('nombre-no-derivable', `la máquina no deriva ${item.nombre.lema} ${item.nombre.caso}.${item.nombre.numero}`);
  else {
    const k = ws.indexOf('in');
    if (k < 0 || ws[k + 1] !== sinM(f))
      push('nombre-no-sigue-a-in', `la máquina da «${f}» y la frase no lo lleva detrás de «in»: «${item.latin}»`);
    if (!item.latinConCantidad.normalize('NFC').includes(f.normalize('NFC')))
      push('cantidad-mal-puesta', `la versión con cantidad no lleva «${f}»`);
  }
  if ((item.lado === 'direccion') !== (item.nombre.caso === 'ac'))
    push('lado-no-lo-decide-el-caso', `declara «${item.lado}» con ${item.nombre.caso}: el acusativo es dirección y el ablativo situación`);

  // ── LA GLOSA ──
  const huecos = item.glosa.split('___').length - 1;
  if (huecos !== 1) push('glosa-sin-hueco', `la glosa tiene ${huecos} huecos y tiene que tener 1`);
  else if (!new RegExp(`___ ${item.nombre.enEspanol}(?!\\p{L})`, 'u').test(item.glosa))
    push('glosa-no-nombra-el-lugar', `el hueco no va justo delante de «${item.nombre.enEspanol}»: «${item.glosa}»`);
  const n0 = NOMBRES.find((x) => x.lema === item.nombre.lema);
  const glN = n0 ? n0.glosa : PLURALIA_TANTUM.find((x) => x.lema === item.nombre.lema)?.glosa ?? '';
  if (glN !== '' && !singulares(item.nombre.enEspanol).some((w) => glosasDe(glN).includes(w)))
    push('lugar-no-es-la-glosa', `«${item.nombre.enEspanol}» no es ninguna de las glosas de «${item.nombre.lema}» (${glN})`);
  const plEs = /s$/.test(item.nombre.enEspanol);
  const plArt = item.articulo === 'los' || item.articulo === 'las';
  if (item.articulo !== '' && plEs !== plArt)
    push('articulo-numero', `«${item.articulo}» y «${item.nombre.enEspanol}» no concuerdan en número`);

  // ── LAS RESPUESTAS SE DERIVAN; NO SE ESCRIBEN ──
  const esp = aceptadasDe(item.lado, item.articulo);
  if (esp.join('|') !== item.aceptadas.join('|'))
    push('aceptadas-no-derivadas', `declara [${item.aceptadas.join(', ')}] y del lado y el artículo sale [${esp.join(', ')}]`);
  if (!esp.includes(item.respuesta))
    push('respuesta-no-aceptada', `«${item.respuesta}» no está entre [${esp.join(', ')}]`);
  const otro = aceptadasDe(item.lado === 'direccion' ? 'situacion' : 'direccion', item.articulo);
  if (!otro.includes(item.elErrorDiana))
    push('error-diana-no-es-del-otro-lado', `«${item.elErrorDiana}» no es una lectura del lado contrario`);

  // ── EL SEGUNDO CAMINO: el treebank ──
  const v = IN_POR_VERBO.get(sinM(item.verbo.lema));
  if (!v || v.ac === 0 || v.abl === 0)
    push('verbo-sin-los-dos-casos-en-el-corpus',
      `«${item.verbo.lema}» sale con in+ac ${v?.ac ?? 0} y con in+abl ${v?.abl ?? 0}: el par necesita los dos`);
  const n = IN_POR_NOMBRE.get(sinM(item.nombre.lema));
  if (!n || n[item.nombre.caso] === 0)
    push('nombre-sin-ese-caso-en-el-corpus', `«in» + ${item.nombre.lema} en ${item.nombre.caso}: 0 en el corpus`);

  const desc = palabrasDesconocidas(item.latin);
  if (desc.length > 0) push('latin-fuera-de-l1', `palabras que la máquina no produce: ${desc.join(', ')}`);
  return out;
}

export function revisarParejasPC(items: ItemPrepCaso[]): FalloPC[] {
  const out: FalloPC[] = [];
  const porPar = new Map<string, ItemPrepCaso[]>();
  for (const i of items) porPar.set(i.pareja, [...(porPar.get(i.pareja) ?? []), i]);
  for (const [p, xs] of porPar) {
    const push = (clase: ClaseFalloPC, detalle: string) => out.push({ item: `(par ${p})`, clase, detalle });
    if (xs.length !== 2) { push('pareja-incompleta', `el par tiene ${xs.length} ítems`); continue; }
    const d = xs.find((x) => x.lado === 'direccion');
    const s = xs.find((x) => x.lado === 'situacion');
    if (!d || !s) { push('pareja-sin-contraste', 'los dos ítems tienen el mismo lado'); continue; }
    if (d.glosa !== s.glosa)
      push('pareja-glosas-distintas', `«${d.glosa}» / «${s.glosa}»: una ruta que lea el español podría separarlos`);
    if (sinM(d.verbo.forma) !== sinM(s.verbo.forma))
      push('pareja-verbos-distintos', `«${d.verbo.forma}» / «${s.verbo.forma}»: el verbo decidiría la lectura`);
    const a = palabras(d.latin).map(sinM), b = palabras(s.latin).map(sinM);
    const dif = a.length !== b.length ? -1 : a.reduce((k, w, j) => k + (w === b[j] ? 0 : 1), 0);
    if (dif !== 1)
      push('pareja-no-minima', dif < 0 ? 'las dos frases no tienen el mismo número de palabras'
        : `las dos frases difieren en ${dif} palabras y tienen que diferir sólo en el nombre`);
    if (d.elErrorDiana !== s.respuesta || s.elErrorDiana !== d.respuesta)
      push('error-diana-no-es-la-respuesta-del-par', 'el error diana de cada lado tiene que ser la respuesta del otro');
  }
  return out;
}

/** Las rutas ciegas, cada una con su denominador (el lote entero: las
 *  tres pueden acertar y fallar en cualquier ítem). */
export function tasasCiegasPC(items: ItemPrepCaso[]) {
  const n = items.length;
  const t = (nombre: string, ok: (i: ItemPrepCaso) => boolean) => {
    const a = items.filter(ok).length;
    return { nombre, aciertos: a, n, tasa: n === 0 ? 0 : a / n };
  };
  return {
    // El CALCO: «in» es «en». Acierta todas las situaciones.
    calcoEn: t('traducir «in» por «en» siempre', (i) => i.lado === 'situacion'),
    siempreDireccion: t('contestar siempre dirección', (i) => i.lado === 'direccion'),
  };
}

/** NO es una ruta ciega: es una lectura PARCIAL del acusativo —«acaba en
 *  `-m`, luego es acusativo»—, que es saber latín a medias. Acierta todos
 *  los singulares y falla el lado de dirección de cada plural, donde el
 *  acusativo acaba en `-s` (`agrōs`, `montēs`) o en `-a` (`castra`). Se
 *  mide para exigir que el lote la haga fallar: un lote de puros
 *  singulares la dejaría al 100 % y enseñaría «`-m` = dirección». */
export function lecturaSoloAcusativoSingular(items: ItemPrepCaso[]) {
  const dice = (i: ItemPrepCaso): Lado => {
    const f = nombreDerivado(i.nombre);
    return f !== null && /m$/.test(sinM(f)) ? 'direccion' : 'situacion';
  };
  const fallos = items.filter((i) => dice(i) !== i.lado);
  return { aciertos: items.length - fallos.length, n: items.length, fallos: fallos.map((i) => i.id) };
}

/** Lo que el formato no puede examinar, con las cifras del sello y no
 *  escritas a mano (§E3: el motivo escrito puede ser falso).
 *
 *  Y el motivo ya fue falso una vez: decía que `super` va con acusativo
 *  «también sin movimiento», y el sello cuenta CASOS, no sentidos. Lo cazó
 *  el lingüista, que además trajo contraejemplos con movimiento de la
 *  Vulgata («cecidit super», «venit super eos»). Lo que no está medido no
 *  se afirma. */
export function motivoDeLasOtrasPreposiciones(): string {
  const p = S.porPreposicion;
  const tot = (x: { vulgata: Cuenta; resto: Cuenta }) => ({ ac: x.vulgata.ac + x.resto.ac, abl: x.vulgata.abl + x.resto.abl });
  const sub = tot(p.sub), sup = tot(p.super);
  return `sub y super no entran, por dos motivos. (1) El FORMATO: en su sentido LOCAL el español dice «bajo» y «sobre» ` +
    `con los dos casos, así que un hueco en la glosa tiene la misma respuesta en los dos lados y no examina nada (§5.undevicies); ` +
    `sus otros sentidos —«sub noctem», «super» + ablativo «acerca de»— son otro punto. ` +
    `(2) El CORPUS: «sub» + acusativo sale ${sub.ac} veces frente a ${sub.abl} con ablativo, y «super» va con acusativo ` +
    `${sup.ac} veces frente a ${sup.abl} (Vulgata ${p.super.vulgata.ac} a ${p.super.vulgata.abl}, resto ${p.super.resto.ac} a ${p.super.resto.abl}). ` +
    `El sello cuenta casos y no sentidos: cuántos de esos acusativos son de dirección NO está medido y no se afirma`;
}

export function coberturaPC(items: ItemPrepCaso[]): Cobertura[] {
  const n = items.length;
  const pl = items.filter((i) => i.nombre.numero === 'pl');
  const atadoV = items.filter((i) => (VERBOS.find((x) => x.lema === i.verbo.lema)?.glosa ?? '') !== '');
  const atadoN = items.filter((i) => ((NOMBRES.find((x) => x.lema === i.nombre.lema)?.glosa
    ?? PLURALIA_TANTUM.find((x) => x.lema === i.nombre.lema)?.glosa) ?? '') !== '');
  const decl = new Set(items.map((i) => {
    const e = NOMBRES.find((x) => x.lema === i.nombre.lema);
    if (e) return declinacionDe(e);
    return PLURALIA_TANTUM.find((x) => x.lema === i.nombre.lema)?.declinacion === 2 ? '2ª' : '?';
  }));
  const parcial = lecturaSoloAcusativoSingular(items);
  return [
    { comprobacion: 'lado DIRECCIÓN (in + acusativo)', decididos: items.filter((i) => i.lado === 'direccion').length, total: n,
      motivoDeLosQueQuedanFuera: 'la otra mitad es situación, y con un solo lado el lote instala la regla contraria (§D6)' },
    { comprobacion: 'lado SITUACIÓN (in + ablativo)', decididos: items.filter((i) => i.lado === 'situacion').length, total: n,
      motivoDeLosQueQuedanFuera: 'la otra mitad es dirección' },
    { comprobacion: 'nombres en PLURAL, donde el acusativo no acaba en -m', decididos: pl.length, total: n,
      motivoDeLosQueQuedanFuera: 'los singulares enseñan el caso por la -m; los plurales son los que hacen fallar la lectura parcial «-m = dirección»' },
    { comprobacion: 'la lectura parcial «-m ⇒ dirección» FALLA', decididos: parcial.n - parcial.aciertos, total: n,
      motivoDeLosQueQuedanFuera: 'en los demás la -m sí coincide con el caso: es saber latín a medias, no una ruta ciega' },
    { comprobacion: 'declinaciones distintas', decididos: decl.size, total: n,
      motivoDeLosQueQuedanFuera: 'no es una fracción: cuenta cuántas declinaciones distintas trae el lote (castra, plurale tantum, cuenta como 2.ª)' },
    { comprobacion: 'el verbo español ATADO a la glosa del lexicón', decididos: atadoV.length, total: n,
      motivoDeLosQueQuedanFuera: `${[...new Set(items.filter((i) => !atadoV.includes(i)).map((i) => i.verbo.lema))].join(', ')} es importado y entra sin glosa (importados.ts): ahí el verbo español no se puede comprobar contra nada del repositorio y lo juzga el lingüista` },
    { comprobacion: 'el lugar español ATADO a la glosa del lexicón', decididos: atadoN.length, total: n,
      motivoDeLosQueQuedanFuera: `${[...new Set(items.filter((i) => !atadoN.includes(i)).map((i) => i.nombre.lema))].join(', ')} es importado y entra sin glosa: ahí «${items.filter((i) => !atadoN.includes(i)).map((i) => i.nombre.enEspanol)[0] ?? ''}» lo juzga el lingüista` },
    { comprobacion: 'el GÉNERO del artículo español', decididos: 0, total: n,
      motivoDeLosQueQuedanFuera: 'no lo mira en ninguno: ver `elCeroEsUnResultado`',
      elCeroEsUnResultado: 'este gate no modela el género español: comprueba que el artículo concuerde en NÚMERO con el lugar y nada más. «la templo» pasaría, y un test lo fija para que nadie crea que está vigilado (§C5)' },
    { comprobacion: 'preposiciones examinadas de las tres que nombra el punto', decididos: new Set(items.map(() => 'in')).size, total: 3,
      motivoDeLosQueQuedanFuera: motivoDeLasOtrasPreposiciones() },
    coberturaDeLosPares(items),
  ];
}

export function revisarLotePC(items: ItemPrepCaso[]): FalloPC[] {
  const out: FalloPC[] = items.flatMap(revisarItemPC);
  out.push(...revisarParejasPC(items));
  for (const c of revisarCobertura(coberturaPC(items))) out.push({ item: c.item, clase: c.clase, detalle: c.detalle });

  if (!items.some((i) => i.lado === 'direccion') || !items.some((i) => i.lado === 'situacion'))
    out.push({ item: '(lote)', clase: 'varia-incompleto', detalle: 'falta uno de los dos lados' });
  for (const x of Object.values(tasasCiegasPC(items)))
    if (x.n > 0 && x.tasa > 0.6)
      out.push({ item: '(lote)', clase: 'estrategia-ciega', detalle: `«${x.nombre}» acierta ${x.aciertos} de ${x.n}` });
  // Absoluto, no contra la medida (§B7): la lectura parcial tiene que
  // fallar al menos en DOS ítems, o sea dos plurales de dirección.
  const parcial = lecturaSoloAcusativoSingular(items);
  if (parcial.n - parcial.aciertos < 2)
    out.push({ item: '(lote)', clase: 'lectura-parcial-sin-contraejemplo',
      detalle: `«-m ⇒ dirección» acierta ${parcial.aciertos} de ${parcial.n}: el lote enseñaría que el acusativo es la -m` });

  const pat = separablePorPosicion(patronDe(items, (i) => i.lado === 'direccion'));
  if (pat) out.push({ item: '(lote)', clase: 'orden-publicado', detalle: pat });
  for (let k = 1; k < items.length; k++)
    if (items[k]!.pareja === items[k - 1]!.pareja)
      out.push({ item: `(par ${items[k]!.pareja})`, clase: 'pareja-adyacente', detalle: `posiciones ${k} y ${k + 1}` });
  for (const { pareja, distancia } of distanciasEnElPar(items))
    if (distancia < DISTANCIA_MINIMA_EN_EL_PAR)
      out.push({ item: `(par ${pareja})`, clase: 'pareja-demasiado-cerca', detalle: `distancia ${distancia}, el piso es ${DISTANCIA_MINIMA_EN_EL_PAR}` });
  return out;
}

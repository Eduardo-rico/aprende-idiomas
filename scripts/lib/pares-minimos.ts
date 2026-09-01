// scripts/lib/pares-minimos.ts
//
// PARES MÍNIMOS POR CONSTRUCCIÓN — el generador de juicios de
// gramaticalidad que no deja superficie donde nazca un atajo.
//
// El bucle que esto rompe, medido sesión a sesión: cada atajo que se
// arreglaba fabricaba otro del mismo calibre. Se mató la LONGITUD (13/16)
// alargando los MAL «con su propia coleta» — y como se alargaron por
// DELANTE, nació el ARRANQUE (12/16, p=0,038). Y esa misma coleta CEGÓ el
// gate de virginidad, porque envolver una frase publicada en una
// subordinada diluye el solape IDF. Tres sesiones, tres rasgos nuevos, y
// el siguiente estaba garantizado.
//
// **Eso no se gana midiendo, se gana por construcción.** Si el BIEN y el
// MAL salen del MISMO esqueleto y sólo difieren en el hueco que se juzga,
// entonces TODO rasgo que no mire el hueco vale exactamente igual en los
// dos miembros del par: aporta un acierto y un fallo, o sea 50 %, sea el
// rasgo que sea — la longitud, el arranque, la coma, el marcador
// temporal, y también el rasgo número doce que a nadie se le ha ocurrido
// todavía. La batería deja de ser el motor de diseño y pasa a ser lo que
// debió ser siempre: **verificación**.
//
// Es la misma derivación que la línea industrial usa desde E2#9 (la
// respuesta se calcula, no se juzga). La artesanal no la tenía.
//
// Lo que esto NO resuelve, y hay que seguir vigilando con revisores:
// que el veredicto sea inequívoco (la barra de retirada), que el
// contexto determine la respuesta, y que el rasgo juzgado no sea
// detectable por una regla superficial — si el hueco es «é»/«está», un
// rasgo «contiene está» acierta el 100 %, pero ese rasgo ES la destreza
// que el punto enseña, no un atajo. La diferencia está declarada en cada
// par: el campo `rasgo` dice qué se juzga, y un rasgo que lo detecte es
// legítimo. Cualquier otro no.

import { separablePorPosicion } from './atajos';

/** Un par mínimo: un esqueleto y los dos rellenos del hueco. */
export interface ParMinimo {
  /** id del par, p. ej. 'P-01' */
  id: string;
  /** el punto del currículo que cubre */
  concepto: string;
  /** el rasgo juzgado, en una línea. Es lo único en que difieren los dos. */
  rasgo: string;
  /** la frase con exactamente un hueco «{}» */
  esqueleto: string;
  /** relleno que produce la frase BIEN formada */
  bien: string;
  /** relleno que produce la frase MAL formada */
  mal: string;
  explicacionBien: string;
  explicacionMal: string;
  /** La glosa palabra-por-palabra al español de cada miembro. Alimenta el
   *  rasgo 12 de la batería, que es el único que los pares NO neutralizan
   *  porque mira DENTRO del hueco. */
  glosaBien?: string;
  glosaMal?: string;
  /** Válvula EXPLÍCITA del gate de objeto duplicado, para los casos en
   *  que el sintagma que sigue al hueco es legítimo (sujeto pospuesto,
   *  adjunto temporal sin preposición, predicativo). Obliga a
   *  justificarlo por escrito en vez de esconderlo en un `if`. */
  permiteSNPosterior?: boolean;
}

export interface ItemGenerado {
  id: string;
  parId: string;
  concepto: string;
  verdict: boolean;
  sentence: string;
  /** sólo en los MAL: es el miembro BIEN del par, por construcción */
  repair?: string;
  explicacion: string;
}

const HUECO = '{}';

export const rellenar = (esqueleto: string, relleno: string) =>
  esqueleto.replace(HUECO, relleno).replace(/\s+/g, ' ').trim();

const palabras = (s: string) => s.trim().split(/\s+/).filter(Boolean);

/** Las violaciones de un par. Vacío = el par es mínimo de verdad. */
export function verificarPar(p: ParMinimo): string[] {
  const v: string[] = [];
  const huecos = p.esqueleto.split(HUECO).length - 1;
  if (huecos !== 1) v.push(`${p.id}: el esqueleto tiene ${huecos} huecos, tiene que tener exactamente 1`);
  if (!p.rasgo.trim()) v.push(`${p.id}: sin rasgo declarado — hay que decir QUÉ se juzga`);
  if (!p.concepto.trim()) v.push(`${p.id}: sin concepto`);
  if (!p.bien.trim() || !p.mal.trim()) v.push(`${p.id}: un relleno vacío`);
  if (p.bien.trim() === p.mal.trim()) v.push(`${p.id}: los dos rellenos son iguales`);
  if (!p.explicacionBien.trim() || !p.explicacionMal.trim()) v.push(`${p.id}: falta una explicación`);
  if (huecos !== 1) return v;

  const sBien = rellenar(p.esqueleto, p.bien);
  const sMal = rellenar(p.esqueleto, p.mal);

  // El arranque tiene que ser el MISMO. Es el rasgo que nació de arreglar
  // el de la longitud, así que se comprueba explícitamente aunque el
  // esqueleto compartido lo haga casi siempre cierto: si el hueco está en
  // posición 0 y los rellenos empiezan distinto, el par no es mínimo.
  const p0 = palabras(sBien)[0] ?? '', p1 = palabras(sMal)[0] ?? '';
  if (p0.toLowerCase() !== p1.toLowerCase())
    v.push(`${p.id}: arranques distintos («${p0}» / «${p1}») — el hueco está al principio y los rellenos no empiezan igual`);

  // Longitud: la diferencia sólo puede venir del hueco, y tiene que ser
  // pequeña o el rasgo «más corta que la mediana» vuelve a discriminar.
  const dPal = Math.abs(palabras(sBien).length - palabras(sMal).length);
  const dChr = Math.abs(sBien.length - sMal.length);
  if (dPal > 1) v.push(`${p.id}: los rellenos difieren en ${dPal} palabras (máximo 1)`);
  if (dChr > LIMITE_CHARS) v.push(`${p.id}: los rellenos difieren en ${dChr} caracteres (máximo ${LIMITE_CHARS})`);

  // Y el resto de la frase tiene que ser literalmente el mismo texto.
  const [antes, despues] = p.esqueleto.split(HUECO) as [string, string];
  if (!sBien.startsWith(antes.replace(/\s+$/, '').trim()) || !sMal.startsWith(antes.replace(/\s+$/, '').trim()))
    v.push(`${p.id}: el tramo anterior al hueco no se conserva`);
  const cola = despues.replace(/^\s+/, '').trim();
  if (cola && (!sBien.endsWith(cola) || !sMal.endsWith(cola)))
    v.push(`${p.id}: la coleta posterior al hueco no se conserva`);

  const dup = objetoDuplicado(p);
  if (dup) v.push(dup);

  return v;
}

/** Diferencia máxima en caracteres entre los dos miembros de un par. */
export const LIMITE_CHARS = 8;

/** Tramo máximo (en caracteres) que puede diferir entre los dos miembros
 *  de un par al re-derivarlo desde las frases. Lo usa el preflight para
 *  no fiarse de la ETIQUETA `**par:**` del markdown. */
export const LIMITE_TRAMO = 24;

// ── El gate que el fallo de la v1 del lote 12 obligó a escribir ──────
//
// EL ENUNCIADO GENERAL, y es la advertencia que acompaña al método para
// siempre: **el par mínimo compra validez DIFERENCIAL y no compra ni un
// gramo de validez ABSOLUTA.** Garantiza que los dos miembros difieren
// sólo en el tramo juzgado; no dice nada sobre si alguno de los dos es
// un ítem bueno. Y todo defecto COMPARTIDO por los dos miembros es, por
// construcción, invisible tanto para `verificarPar()` como para la
// batería — que lo puntúa 6/12, «limpio», tanto si el rasgo compartido
// es inocuo como si es letal.
//
// El objeto duplicado de la v1 es la instancia canónica: estaba en el
// BIEN **y** en el MAL, la batería le dio 6/12 y firmó «preflight
// limpio» mientras cuatro ítems eran agramaticales por una razón que el
// ítem no juzga. El gate no falló por descuido: hizo lo que sabe hacer.

const ACUSATIVO = /(?:^|[\s-])(?:o|a|os|as|lo|la|los|las|no|na|nos|nas)(?:$|[\s-])/iu;
const DETERMINANTE = /^(?:o|a|os|as|um|uma|uns|umas|este|esta|estes|estas|esse|essa|esses|essas|aquele|aquela|aqueles|aquelas|meu|minha|seu|sua|nosso|nossa|todo|toda|todos|todas)$/iu;

/** El hueco aporta un clítico acusativo y el esqueleto ya realiza el
 *  objeto directo: «comunicá-lo-á **o resultado**».
 *
 *  Medido: caza 2 de 2 de los pares rotos de la v1 del lote 12, con 0
 *  falsos positivos sobre la v2 y sobre el banco de siete pares de
 *  ser/estar del test.
 *
 *  DOS AVISOS DE HONESTIDAD. (1) Va a dar falsos positivos con sujetos
 *  pospuestos, con sintagmas temporales sin preposición («…{} a semana
 *  passada») y con predicativos: por eso la válvula es explícita
 *  (`permiteSNPosterior`) y obliga a justificarlo por escrito, no un
 *  `if` silencioso. (2) Es un gate ESTRECHO, no «el gate de
 *  gramaticalidad»: cubre el caso medido y nada más. */
export function objetoDuplicado(p: ParMinimo): string | null {
  if (p.permiteSNPosterior) return null;
  for (const relleno of [p.bien, p.mal]) {
    if (!ACUSATIVO.test(relleno)) continue;
    const w = (p.esqueleto.split(HUECO)[1] ?? '').trim().split(/\s+/).filter(Boolean);
    if (w.length >= 2 && DETERMINANTE.test(w[0]!.replace(/[.,;:]/g, '')) && /^[\p{L}]{3,}[.,;:]?$/u.test(w[1]!))
      return `${p.id}: el relleno «${relleno}» aporta un clítico ACUSATIVO y el esqueleto sigue con «${w[0]} ${w[1]}» sin preposición — objeto duplicado`;
  }
  return null;
}

// ─── El barajado, con semilla ────────────────────────────────────────
//
// La posición BIEN/MAL se aleatoriza porque la batería midió 24/24 por
// pura paridad de posición en un lote que salió `MBMBMB…` — la
// alternancia mecánica que la skill prohíbe desde el lote 2 y que nadie
// había medido nunca. Con semilla, para que el lote sea reproducible: un
// barajado que no se puede repetir no se puede auditar.

function mulberry32(a: number) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const semillaDe = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
};

/** Separación mínima entre los dos miembros de un par dentro del lote. */
export const SEPARACION_MINIMA = 3;

export interface OpcionesExpansion {
  semilla: string;
  /** patrones B/M ya publicados, para no repetir ninguno */
  publicados?: string[];
  /** intentos de barajado antes de rendirse */
  intentos?: number;
}

/**
 * Convierte los pares en el lote de ítems, ya barajado y con el molde
 * validado. Lanza si no encuentra un orden que cumpla — que es lo
 * correcto: un molde que no cumple no se publica.
 */
export function expandir(pares: ParMinimo[], opts: OpcionesExpansion): ItemGenerado[] {
  const malos = pares.flatMap(verificarPar);
  if (malos.length) throw new Error(`pares no mínimos:\n- ${malos.join('\n- ')}`);

  const base: ItemGenerado[] = [];
  for (const p of pares) {
    const sBien = rellenar(p.esqueleto, p.bien);
    const sMal = rellenar(p.esqueleto, p.mal);
    base.push({ id: `${p.id}B`, parId: p.id, concepto: p.concepto, verdict: true, sentence: sBien, explicacion: p.explicacionBien });
    base.push({ id: `${p.id}M`, parId: p.id, concepto: p.concepto, verdict: false, sentence: sMal, repair: sBien, explicacion: p.explicacionMal });
  }

  // 200k y no 5k: la invariante del repair hace que la mayoría de los
  // barajados no valgan, y con doce pares el rechazo simple no llega.
  const intentos = opts.intentos ?? 200000;
  const rnd = mulberry32(semillaDe(opts.semilla));
  for (let k = 0; k < intentos; k++) {
    const orden = base.slice();
    for (let i = orden.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [orden[i], orden[j]] = [orden[j]!, orden[i]!];
    }
    // La invariante del repair se CONSTRUYE, no se sortea: la
    // probabilidad de que doce pares salgan solos con el BIEN delante es
    // 1/4096, y el muestreo por rechazo no llega. Tras barajar, se
    // intercambian las posiciones de los dos miembros de cada par que
    // hayan salido al revés — el orden sigue siendo el del barajado, y
    // sólo se corrige la dirección dentro de cada par.
    enderezarPares(orden);
    if (separacionOk(orden)
        && sinFugaDeRepair(orden)
        && !separablePorPosicion(patronDe(orden))
        && !evaluarMolde(patronDe(orden), opts.publicados ?? []).length) {
      return orden.map((x, i) => ({ ...x, id: `GJ-${String(i + 1).padStart(2, '0')}` }));
    }
  }
  throw new Error(
    `no se encontró un orden válido en ${intentos} intentos con la semilla «${opts.semilla}». ` +
    `Con ${pares.length} pares puede que NO EXISTA: con dos, cero de los 24 órdenes evitan a la vez ` +
    `la fuga del repair y la separabilidad por posición. El suelo del método son tres pares.`);
}

/** La separación exigible en un lote de N: la mínima, pero nunca más de
 *  lo que caben N ítems — con dos ítems no hay separación de 3 que valga
 *  y exigirla dejaría el generador en un bucle infinito. */
export const separacionExigible = (n: number) =>
  Math.min(SEPARACION_MINIMA, Math.max(1, Math.floor(n / 4)));

/** El `repair` de un MAL **es** la frase del BIEN de su par, y la tarjeta
 *  lo imprime como forma correcta. Si el MAL va delante, su feedback
 *  contesta el BIEN antes de que el alumno lo vea. Medido en el lote 13:
 *  **2 de 4 ítems regalados**.
 *
 *  Y el corolario duro, que fija el suelo del método: con DOS pares no
 *  existe ningún orden que evite la fuga y no sea a la vez resoluble por
 *  posición — de los 24 órdenes posibles, cero cumplen las dos cosas.
 *  **Un lote de pares mínimos necesita TRES pares como mínimo.** */
/** Pone el BIEN delante del MAL en cada par, intercambiándolos donde
 *  hayan salido al revés. No reordena el lote: sólo corrige la dirección
 *  dentro de cada par, así que el barajado sigue gobernando el patrón. */
function enderezarPares(orden: ItemGenerado[]): void {
  const primera = new Map<string, number>();
  for (let i = 0; i < orden.length; i++) {
    const p = orden[i]!.parId;
    if (!primera.has(p)) { primera.set(p, i); continue; }
    const j = primera.get(p)!;
    if (!orden[j]!.verdict) { const t = orden[i]!; orden[i] = orden[j]!; orden[j] = t; }
  }
}

function sinFugaDeRepair(orden: ItemGenerado[]): boolean {
  const vistos = new Set<string>();
  for (const x of orden) {
    if (x.verdict) { vistos.add(x.parId); continue; }
    if (!vistos.has(x.parId)) return false;
  }
  return true;
}

function separacionOk(orden: ItemGenerado[]): boolean {
  const minima = separacionExigible(orden.length);
  const pos = new Map<string, number>();
  for (let i = 0; i < orden.length; i++) {
    const p = orden[i]!.parId;
    if (pos.has(p) && i - pos.get(p)! < minima) return false;
    pos.set(p, i);
  }
  return true;
}

export const patronDe = (items: { verdict: boolean }[]) => items.map((x) => (x.verdict ? 'B' : 'M')).join('');

// ─── EL MOLDE, con el criterio que NO se agota ───────────────────────
//
// El criterio viejo era «prefijo de CUATRO no visto». Con 16 prefijos
// posibles y uno por lote **se agota por construcción**, y ya no queda
// margen: de los 16 se han quemado 11, y de los 5 que sobran TRES violan
// la regla de rachas (BBBB, MMMM y otro), así que el criterio real
// muere en dos lotes, no en el lote 15 como decía la skill.
//
// El sustituto no enumera: mide. Un patrón vale si está equilibrado, no
// tiene rachas largas, no repite ninguno publicado, y **su solape con
// cada lote publicado está cerca del azar**. Esa última es la que hace
// que no se agote: el espacio es 2^N (16,7 millones para N=24) y cada
// lote publicado sólo excluye una cáscara fina alrededor de sí mismo y
// de su complementario. La fracción aceptada no se desploma al acumular
// lotes; con la enumeración de prefijos sí, por definición.
//
// El umbral del solape es el que la skill ya traía escrito para N=20
// —«|solape−10| ≤ 4»— generalizado a cualquier N: floor(sqrt(N)), que
// para N=20 da 4 exacto. Son dos desviaciones típicas de una binomial
// (N, ½), cuya σ es sqrt(N)/2. Y se mide contra el patrón Y contra su
// complementario, porque la casi-complementaria de un lote es un calco
// igual que la copia — corrección pagada en el lote 5, donde presenté un
// 2/20 como virtud y estaba a 3,6σ.

export function evaluarMolde(patron: string, publicados: string[]): string[] {
  const v: string[] = [];
  const n = patron.length;
  const nB = [...patron].filter((c) => c === 'B').length;
  if (Math.abs(nB - (n - nB)) > 2) v.push(`molde: ${nB} BIEN contra ${n - nB} MAL, desequilibrio ${Math.abs(nB - (n - nB))}`);

  let racha = 1, rachaMax = 1;
  for (let i = 1; i < n; i++) { racha = patron[i] === patron[i - 1] ? racha + 1 : 1; rachaMax = Math.max(rachaMax, racha); }
  if (rachaMax > 3) v.push(`molde: racha de ${rachaMax} iguales seguidos`);

  for (const q of publicados) {
    const L = Math.min(n, q.length);
    if (L < 8) continue;                       // con menos de 8 el solape no dice nada
    if (q === patron) { v.push(`molde: el patrón es idéntico al del lote publicado \`${q}\``); continue; }
    let iguales = 0;
    for (let i = 0; i < L; i++) if (patron[i] === q[i]) iguales++;
    const tope = Math.floor(Math.sqrt(L));
    const desvio = Math.abs(iguales - L / 2);
    if (desvio > tope)
      v.push(`molde: solape ${iguales}/${L} contra \`${q.slice(0, L)}\` — se desvía ${desvio.toFixed(1)} del azar (tope ${tope}); ${iguales > L / 2 ? 'calca' : 'es la casi-complementaria de'} ese lote`);
  }
  return v;
}

/**
 * Los patrones B/M de los lotes ya publicados, leídos del corpus.
 * Agrupa los juicios por su lote (`b2c2-gj-lN-XX`) y los ordena por su
 * número dentro del lote.
 */
export function patronesPublicados(corpus: { id: string; type: string; data: unknown }[]): Map<string, string> {
  const lotes = new Map<string, { n: number; v: boolean }[]>();
  for (const ex of corpus) {
    if (ex.type !== 'grammaticality_judgment') continue;
    const m = ex.id.match(/^b2c2-gj-(?:(l\d+)-)?(\d+)$/);
    if (!m) continue;
    const lote = m[1] ?? 'piloto';
    const v = (ex.data as { verdict?: boolean })?.verdict;
    if (typeof v !== 'boolean') continue;
    if (!lotes.has(lote)) lotes.set(lote, []);
    lotes.get(lote)!.push({ n: Number(m[2]), v });
  }
  const out = new Map<string, string>();
  for (const [lote, xs] of lotes) {
    xs.sort((a, b) => a.n - b.n);
    out.set(lote, xs.map((x) => (x.v ? 'B' : 'M')).join(''));
  }
  return out;
}

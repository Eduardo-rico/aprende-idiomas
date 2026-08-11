// scripts/lib/virginidad.ts — gate de virginidad de contenido.
//
// POR QUÉ EXISTE (medido, no supuesto): la skill /lote-b2c2 manda
// «puntos vírgenes verificados CONTRA LOS JSON publicados», y se estaba
// cumpliendo sólo sobre los ids `b2c2-`. Barrer 112 ítems en vez de los
// 2.151 del corpus dejó pasar DOS duplicados a producción:
//
//   b2c2-gj-l3-01 «Talvez ele vem amanhã à reunião.»  ↔ b6/31da58c8
//   b2c2-gj-l4-12 «A porta foi abrida pelo vento.»    ↔ b7/cc7715be
//
// `check-bleed-docs` no podía verlos: es un guard de ESCRITURAS (CJK,
// cirílico, homóglifos), no de duplicación.
//
// CÓMO FUNCIONA, y por qué no basta con contar palabras compartidas:
// «Talvez ele está em casa agora» y «Talvez ele vem amanhã à reunião»
// comparten UNA palabra de contenido — «talvez» — y son el mismo
// ejercicio. Lo que las delata no es cuántas palabras comparten, sino
// que la que comparten es RARA: «talvez» es el pivote didáctico de las
// dos. Por eso el solape se pondera por IDF (inverse document
// frequency) sobre el propio corpus: compartir «talvez» o «praia» pesa;
// compartir «de» o «que» no pesa nada.
//
// Es determinista y offline. No opina sobre estilo: sólo dice «esto ya
// está publicado ahí».

type Json = Record<string, unknown>;

export interface ExIndexable extends Json {
  id: string;
  type: string;
  blockId?: number;
  data: Json;
}

/** Campos que llevan PORTUGUÉS didáctico, por tipo. Deliberadamente NO
 *  incluye las glosas ni explicaciones en español (`explanationEs`,
 *  `hintEs`, `question`): dos ítems que comparten explicación española
 *  no son el mismo ejercicio, y meterlas dispararía falsos positivos en
 *  cadena. Es el mismo criterio de CAMPOS_PT en variant-guard, más los
 *  campos de FORMA CORRECTA (`correct`, `repair`, `answer`), que son
 *  justamente los que un duplicado repite. */
const CAMPOS: Record<string, string[]> = {
  flashcard: ['back', 'example', 'audioText'],
  fill_blank: ['sentence'],
  listening: ['audioText'],
  verb_preposition: ['sentence'],
  sentence_construction: ['words'],
  chunk: ['chunk', 'examples'],
  error_correction: ['sentence', 'correct'],
  conjugation: ['answer', 'example'],
  matching: ['pairs'],
  multiple_choice: ['options'],
  shadowing: ['text'],
  grammaticality_judgment: ['sentence', 'repair'],
  mediation: ['sourceText', 'modelAnswer'],
  translation: [], // se resuelve por sourceLang/targetLang, abajo
  lesson: [],
};

/** Palabras vacías: función gramatical pura. Compartirlas no significa
 *  nada. La lista es corta a propósito — el IDF ya hunde a las
 *  frecuentes; esto sólo evita que el ruido llegue al numerador. */
const VACIAS = new Set([
  'o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas', 'de', 'do', 'da', 'dos', 'das',
  'em', 'no', 'na', 'nos', 'nas', 'por', 'pelo', 'pela', 'para', 'com', 'sem',
  'e', 'ou', 'mas', 'que', 'se', 'não', 'sim', 'ao', 'à', 'aos', 'às',
  'é', 'era', 'foi', 'ser', 'estar', 'está', 'ele', 'ela', 'eles', 'elas', 'eu',
  'me', 'te', 'lhe', 'se', 'this', 'muito', 'mais', 'já', 'aqui', 'ali',
]);

/** Extrae el texto portugués didáctico de un ítem.
 *  Devuelve [] para tipos sin campos declarados — y eso se REPORTA en el
 *  índice (`sinTexto`), nunca se descarta en silencio. */
export function enunciadosDe(ex: ExIndexable): string[] {
  const out: string[] = [];
  const d = ex.data ?? {};

  let campos = CAMPOS[ex.type];
  if (campos === undefined) return []; // tipo desconocido: no inventamos

  // translation: sólo cuenta el lado que está en portugués.
  if (ex.type === 'translation') {
    const src = String(d.sourceLang ?? '');
    const tgt = String(d.targetLang ?? '');
    campos = [
      ...(src.startsWith('pt') ? ['source'] : []),
      ...(tgt.startsWith('pt') ? ['target'] : []),
    ];
  }

  for (const c of campos) {
    const v = d[c];
    if (typeof v === 'string') out.push(v);
    else if (Array.isArray(v)) {
      for (const item of v) {
        if (typeof item === 'string') out.push(item);
        else if (item && typeof item === 'object') {
          // `pairs` de matching: {left, right}; `options` de MC: strings
          for (const sub of Object.values(item as Json)) {
            if (typeof sub === 'string') out.push(sub);
          }
        }
      }
    }
  }
  return out;
}

/** Desplural conservador: quita la -s final a partir de 4 caracteres.
 *  «manhãs»→«manhã», «praias»→«praia». Se aplica a los DOS lados, así
 *  que aunque produzca un pseudolema («português»→«portuguê») sigue
 *  casando consigo mismo. Sin esto, el duplicado real
 *  «Todas as manhãs vou à praia» / «Vamos à praia no sábado de manhã»
 *  no se detecta: comparten el punto y difieren en el número. */
function deplural(w: string): string {
  return w.length > 3 && w.endsWith('s') ? w.slice(0, -1) : w;
}

/** Tokeniza a palabras de contenido, en minúsculas, conservando los
 *  diacríticos (en portugués «pao» y «pão» no son la misma palabra) y
 *  tirando los huecos de fill_blank (`___`). */
export function tokenizar(texto: string): Set<string> {
  const limpio = texto
    .toLowerCase()
    .replace(/_+/g, ' ')
    .replace(/[^\p{L}\p{M}\s-]/gu, ' ');
  const out = new Set<string>();
  for (const w of limpio.split(/\s+/)) {
    if (w.length < 2) continue;
    if (VACIAS.has(w)) continue;
    const lema = deplural(w);
    if (VACIAS.has(lema)) continue;
    out.add(lema);
  }
  return out;
}

export interface IndiceCorpus {
  /** id → tokens de contenido */
  tokens: Map<string, Set<string>>;
  /** token → nº de ítems que lo contienen */
  df: Map<string, number>;
  /** id → ítem, para poder devolver contexto en el hallazgo */
  items: Map<string, ExIndexable>;
  total: number;
  /** ids que no aportaron ni un token — declarados, no descartados */
  sinTexto: string[];
}

export function indexarCorpus(corpus: ExIndexable[]): IndiceCorpus {
  const tokens = new Map<string, Set<string>>();
  const df = new Map<string, number>();
  const items = new Map<string, ExIndexable>();
  const sinTexto: string[] = [];

  for (const ex of corpus) {
    items.set(ex.id, ex);
    const t = tokenizar(enunciadosDe(ex).join(' '));
    if (t.size === 0) sinTexto.push(ex.id);
    tokens.set(ex.id, t);
    for (const w of t) df.set(w, (df.get(w) ?? 0) + 1);
  }
  return { tokens, df, items, total: corpus.length, sinTexto };
}

/** IDF suavizado. Un token que sale en 1 de 2.151 ítems pesa ~7,7; uno
 *  que sale en la mitad pesa ~0,7. */
function idf(df: Map<string, number>, total: number, w: string): number {
  return Math.log((total + 1) / ((df.get(w) ?? 0) + 1)) + 1;
}

function pesoTotal(df: Map<string, number>, total: number, t: Set<string>): number {
  let s = 0;
  for (const w of t) s += idf(df, total, w) ** 2;
  return Math.sqrt(s);
}

export interface HallazgoVirginidad {
  id: string;
  score: number;
  blockId?: number;
  type: string;
  /** los tokens raros que comparten, ordenados por peso — la PRUEBA */
  compartidos: string[];
  texto: string;
}

/** Umbral por defecto. Calibrado contra los cuatro duplicados reales
 *  conocidos (los dos ya publicados y los dos del lote 5): todos quedan
 *  por encima, y los puntos vírgenes del mismo lote por debajo. */
export const UMBRAL = 0.34;

export function buscarDuplicados(
  idx: IndiceCorpus,
  candidato: ExIndexable,
  umbral = UMBRAL,
): HallazgoVirginidad[] {
  const crudos = tokenizar(enunciadosDe(candidato).join(' '));
  if (crudos.size === 0) return [];

  // SOLO el vocabulario que el corpus YA contiene puede indicar
  // duplicación. Una palabra que el corpus no ha visto nunca («reunião»,
  // «tiver») es prueba de NOVEDAD, y contarla en el denominador diluía
  // justo la señal que buscamos: el duplicado «talvez…» comparte una
  // sola palabra con su gemelo, y las otras cuatro son nuevas. Con la
  // norma sobre el total, ese par puntuaba 0,19 y se escapaba.
  const tc = new Set([...crudos].filter((w) => (idx.df.get(w) ?? 0) > 0));
  if (tc.size === 0) return [];
  const normC = pesoTotal(idx.df, idx.total, tc);
  if (normC === 0) return [];

  const out: HallazgoVirginidad[] = [];
  for (const [id, tp] of idx.tokens) {
    if (id === candidato.id) continue; // nunca contra sí mismo
    if (tp.size === 0) continue;

    let num = 0;
    const compartidos: Array<[string, number]> = [];
    for (const w of tc) {
      if (!tp.has(w)) continue;
      const peso = idf(idx.df, idx.total, w);
      num += peso ** 2;
      compartidos.push([w, peso]);
    }
    if (num === 0) continue;

    const score = num / (normC * pesoTotal(idx.df, idx.total, tp));
    if (score < umbral) continue;

    const ex = idx.items.get(id)!;
    out.push({
      id,
      score: Number(score.toFixed(3)),
      blockId: ex.blockId,
      type: ex.type,
      compartidos: compartidos.sort((a, b) => b[1] - a[1]).map(([w]) => w),
      texto: enunciadosDe(ex).join(' · ').slice(0, 120),
    });
  }
  return out.sort((a, b) => b.score - a.score);
}

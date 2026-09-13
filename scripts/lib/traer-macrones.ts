// scripts/lib/traer-macrones.ts
//
// TRAE LA CANTIDAD VOCÁLICA DE UNA FUENTE EXTERNA. Genera
// `lib/data/languages/la/macrones.json`.
//
//   npx tsx scripts/lib/traer-macrones.ts
//
// ══ PROCEDENCIA ══════════════════════════════════════════════════════
//
//   obra:      Wiktionary, edición inglesa — secciones `==Latin==`
//   de dónde:  https://en.wiktionary.org/w/api.php (action=query, wikitexto)
//   licencia:  CC BY-SA 4.0 y GFDL. Lo que se importa son formas de cita
//              con su cantidad: datos lexicográficos, no prosa. La
//              atribución va aquí y en el JSON generado.
//   fecha:     ver el campo `generado` del JSON.
//
// ══ POR QUÉ ESTA FUENTE Y NO UN DICCIONARIO DEL XIX ══════════════════
//
// Se probó primero Lewis & Short (1879, dominio público, vía PerseusDL/
// lexica, 74 MB) y **no sirve**. Medido sobre los 218 lemas del lexicón:
//
//     vocales en esos lemas:                457
//     con marca de cantidad:                194   (42,5 %)
//     lemas donde calla sobre alguna vocal: 182 de 200
//
// `rēgnum` sale como «regnum», sin una sola marca; `rex`, `mens`, `nox`,
// `vox` y `pax` tampoco llevan ninguna. **L&S no marca la cantidad: marca
// lo justo para colocar el acento** —la penúltima—, que es otra cosa. Una
// fuente que calla sobre la mitad de las vocales no es una fuente de
// cantidad, y confundir las dos cosas habría metido 500 silencios con
// pinta de datos.
//
// ══ LA PRUEBA DE QUE AQUÍ «SIN MÁCRON» SIGNIFICA BREVE ═══════════════
//
// Una fuente puede callar donde no sabe, y entonces la ausencia de mácron
// no afirma nada. Se comprueba al revés: cruzando los 218 lemas escritos a
// mano contra la fuente, **en 0 casos marcamos nosotros un mácron que la
// fuente no marque** —sobre 178 lemas comparables, 102 con cantidad—. L&S
// falla ese mismo test en 182 de 200.
//
// ══ Y LO QUE NO SE HACE ══════════════════════════════════════════════
//
// **Nada de macronizadores automáticos.** Existen y resolverían los 800 de
// una pasada, pero su salida es una inferencia de un modelo, no una
// atestación: sería el mácron inventado a escala y con pinta de dato.
// Diccionario = atestación. Macronizador = conjetura. Si alguna vez se usa
// uno, que sea para PROPONER candidatos que esta fuente confirme.
//
// ══ DOS CAMINOS DENTRO DE LA FUENTE ══════════════════════════════════
//
// De cada página se leen dos plantillas independientes —`la-IPA` (la
// pronunciación) y `la-noun`/`la-verb`/… (el encabezado)— y se exige que
// coincidan. Y el candidato se valida solo: de los argumentos se coge el
// que, quitándole la cantidad, da el título de la página. Así no hay que
// adivinar posiciones —en `la-verb` la primera es el código de conjugación—
// ni se cuela un argumento cualquiera.
import fs from 'node:fs';
// `INDECLINABLES_A_MANO` y NO `INDECLINABLES_L1`: la segunda incluye los que
// este mismo generador importó, y leerlos los devolvería al registro como
// `lexicon-propio`, el filtro del lexicón dejaría de encontrarlos y la
// importación se borraría sola. Pasó una vez: de 61 a 0.
import { NOMBRES_L1, VERBOS_L1, ADJETIVOS_L1, INDECLINABLES_A_MANO } from '../../lib/data/languages/la/lexicon-l1';
import { ADJETIVOS_3A } from '../../lib/data/languages/la/adjetivos-3a';
import { IRREGULARES_L1 } from '../../lib/data/languages/la/irregulares';
import { DEPONENTES_L1 } from '../../lib/data/languages/la/deponentes';
import { PLURALIA_TANTUM } from '../../lib/data/languages/la/plural-tantum';
import { leerFrases } from './atestar-ut';

const SALIDA = 'lib/data/languages/la/macrones.json';
const API = 'https://en.wiktionary.org/w/api.php';
const UA = 'latin-course-lexicon/1.0 (curso de latín; importa cantidad vocálica de lemas)';

/** El origen de una cantidad. `sin-dato` es un VALOR, no un hueco: un lema
 *  cuya cantidad no se conoce no se rellena. */
export type Origen = 'fuente-externa' | 'lexicon-propio' | 'sin-dato';

export interface FilaDeMacron {
  /** El lema sin cantidad, que es el título de la página. */
  clave: string;
  /** La forma con cantidad, o `null` si no hay dato. */
  cantidad: string | null;
  origen: Origen;
  /** Cuántos de los dos caminos de la fuente dieron la forma. */
  caminos: 0 | 1 | 2;
  /** La categoría según la FUENTE (su plantilla de encabezado) y según el
   *  CORPUS (el UPOS del treebank). Son dos caminos independientes y hay
   *  que cruzarlos: el corpus etiqueta `tantus` y `cēterus` como ADV —es su
   *  uso adverbial— y son adjetivos que DECLINAN. Importarlos como
   *  indeclinables por fiarse de una sola etiqueta es un error de datos.
   *  Donde no coinciden, la fila lleva `categoriaEnDisputa` y no se importa
   *  sin mirarla. */
  posFuente?: string | null;
  uposCorpus?: string | null;
  categoriaEnDisputa?: true;
  /** La fuente marca la cantidad como VARIABLE (`ō̆`): no es un dato que
   *  este lexicón pueda guardar, que tiene una forma por lema. */
  cantidadVariable?: true;
  /** TERCER CAMINO, y el que de verdad decide si algo es indeclinable: el
   *  treebank. Un indeclinable no lleva NUNCA `Case=`. `lātus` viene
   *  etiquetado ADV por el corpus y su categoría no contradice a la fuente
   *  —que calla—, pero sale 41 veces con caso y 2 sin: es un adjetivo
   *  declinado y meterlo como invariable habría sido un error que ni la
   *  cantidad ni la categoría podían ver. */
  conCasoEnElCorpus?: number;
  sinCasoEnElCorpus?: number;
  flexiona?: true;
  /** CUARTO filtro, y es la regla propia del proyecto: ningún lema entra
   *  sin UNA sola forma atestiguada. `amplē` es latín correcto y la fuente
   *  lo da bien, pero el corpus sólo trae su comparativo `amplius`: la
   *  forma de cita no aparece. Un lema así no se puede usar en un marco. */
  formaAtestiguada?: number;
  /** Los argumentos CRUDOS de la plantilla de encabezado. De ahí sale el
   *  paradigma —`rēx/rēg<3>|g=m` da tema, declinación y género;
   *  `4.pass-impers|veniō|vēn|vent` da conjugación y temas—. Se guardan sin
   *  interpretar para que el parseo se pueda rehacer sin volver a la red:
   *  la fuente se pide una vez, el análisis las que hagan falta. */
  plantilla?: string;
  /** Si el lema ya estaba en el lexicón escrito a mano, lo que decía. */
  enElLexicon?: string;
  /** Escrito sólo cuando el lexicón y la fuente discrepan. */
  discrepancia?: string;
}

export const sinCantidad = (s: string) => s.normalize('NFD').replace(/[̄̆]/g, '')
  .normalize('NFC').toLowerCase().replace(/j/g, 'i').replace(/v/g, 'u');
const jiUV = (s: string) => s.replace(/j/g, 'i').replace(/J/g, 'I');
const tieneBreve = (s: string) => /̆/.test(s.normalize('NFD'));

function seccionLatina(txt: string): string | null {
  const i = txt.startsWith('==Latin==') ? 0 : txt.indexOf('\n==Latin==') + 1;
  if (i <= 0 && !txt.startsWith('==Latin==')) return null;
  const resto = txt.slice(i);
  const j = resto.slice(3).search(/\n==[A-Z][^=]/);
  return j < 0 ? resto : resto.slice(0, j + 3);
}

/** El argumento que ES el lema: el que sin cantidad da el título. */
export function argQueEsElLema(args: string, titulo: string): string | null {
  const t = sinCantidad(titulo);
  for (const a of args.split('|')) {
    const bruto = a.trim();
    if (bruto === '' || /^[a-z0-9_]+\s*=/.test(bruto)) continue;
    const cand = (bruto.replace(/<[^>]*>/g, '').split('/')[0] ?? '').trim();
    if (sinCantidad(cand) === t) return cand;
  }
  return null;
}

const POS = 'noun|verb|adj|proper noun|num|pron|adv|prep|conj|part|det|suffix|prefix';
export function macronesDe(txt: string, titulo: string): { ipa: string | null; head: string | null; pos: string | null; plantilla: string | null } {
  const la = seccionLatina(txt);
  if (!la) return { ipa: null, head: null, pos: null, plantilla: null };
  const mi = la.match(/\{\{la-IPA\|([^}]*)\}\}/);
  const mh = la.match(new RegExp(`\\{\\{la-(${POS})\\|([^}]*)\\}\\}`));
  return {
    ipa: mi ? argQueEsElLema(mi[1]!, titulo) : null,
    head: mh ? argQueEsElLema(mh[2]!, titulo) : null,
    pos: mh ? mh[1]! : null,
    plantilla: mh ? mh[2]! : null,
  };
}

/** ¿La categoría de la fuente CONTRADICE la del corpus? Sólo importa para
 *  decidir si un lema es INDECLINABLE, que es lo que cambia el módulo al que
 *  va.
 *
 *  Hay que separar CONTRADICCIÓN de SILENCIO, que no es lo mismo: los
 *  indeclinables de esta fuente no llevan plantilla de encabezado —`nam` y
 *  `quoniam` no tienen ninguna—, así que su categoría viene en blanco. Eso
 *  no es una disputa: es que sólo hay un camino. Tratarlo como disputa
 *  excluía diecisiete lemas buenos, y es la misma confusión que hace que un
 *  silencio parezca un dato (ver lo de Lewis & Short en la cabecera). */
const INDECLINABLE_FUENTE = new Set(['adv', 'prep', 'conj', 'part', 'det']);
const INDECLINABLE_CORPUS = new Set(['ADV', 'ADP', 'SCONJ', 'CCONJ', 'PART', 'INTJ']);
export function categoriaContradice(pos: string | null, upos: string | null): boolean {
  if (!pos || !upos) return false;   // silencio, no contradicción
  return INDECLINABLE_FUENTE.has(pos) !== INDECLINABLE_CORPUS.has(upos);
}

/** Concilia los dos caminos. `null` cuando se contradicen de verdad: la
 *  discrepancia j/i es gráfica y la marca de cantidad variable (`ō̆`) es la
 *  fuente diciendo que varía, no contradiciéndose. */
export function conciliar(ipa: string | null, head: string | null): { forma: string | null; caminos: 0 | 1 | 2 } {
  if (ipa && head) {
    if (ipa === head) return { forma: ipa, caminos: 2 };
    if (jiUV(ipa) === jiUV(head)) return { forma: jiUV(ipa), caminos: 2 };
    if (tieneBreve(ipa) !== tieneBreve(head)) return { forma: tieneBreve(ipa) ? head : ipa, caminos: 2 };
    return { forma: null, caminos: 0 };   // homógrafos: la fuente no sabe cuál pedimos
  }
  const uno = ipa ?? head;
  return uno ? { forma: uno, caminos: 1 } : { forma: null, caminos: 0 };
}

const dormir = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function lote(titulos: string[], intento = 0): Promise<{ title: string; missing?: boolean; revisions?: { slots: { main: { content: string } } }[] }[]> {
  const u = new URL(API);
  for (const [k, v] of Object.entries({
    action: 'query', format: 'json', formatversion: '2',
    prop: 'revisions', rvprop: 'content', rvslots: 'main', titles: titulos.join('|'),
  })) u.searchParams.set(k, v);
  const r = await fetch(u, { headers: { 'User-Agent': UA } });
  if (r.status === 429) {
    if (intento >= 5) throw new Error('429 persistente de Wikimedia tras cinco esperas');
    const espera = 5000 * 2 ** intento;
    console.error(`  429 de Wikimedia — esperando ${espera / 1000}s`);
    await dormir(espera);
    return lote(titulos, intento + 1);
  }
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return ((await r.json()) as { query?: { pages?: never[] } }).query?.pages ?? [];
}

/** Todo lo que el lexicón escribió a mano. */
export function lemasDelLexicon(): { lema: string; modulo: string }[] {
  return [
    ...NOMBRES_L1.map((n) => ({ lema: n.lema, modulo: 'NOMBRES_L1' })),
    ...VERBOS_L1.map((v) => ({ lema: v.lema, modulo: 'VERBOS_L1' })),
    ...ADJETIVOS_L1.map((a) => ({ lema: a.lema, modulo: 'ADJETIVOS_L1' })),
    ...ADJETIVOS_3A.map((a) => ({ lema: a.lema, modulo: 'ADJETIVOS_3A' })),
    ...IRREGULARES_L1.map((v) => ({ lema: v.lema, modulo: 'IRREGULARES_L1' })),
    ...DEPONENTES_L1.map((d) => ({ lema: d.lema, modulo: 'DEPONENTES_L1' })),
    ...PLURALIA_TANTUM.map((p) => ({ lema: p.lema, modulo: 'PLURALIA_TANTUM' })),
    ...INDECLINABLES_A_MANO.map((i) => ({ lema: i, modulo: 'INDECLINABLES_A_MANO' })),
  ];
}

async function main() {
  const propios = lemasDelLexicon();
  const nucleo = JSON.parse(fs.readFileSync('lib/data/languages/la/nucleo-800.json', 'utf8')) as { lemas: { lema: string; cubierto: number }[] };

  // EL NÚCLEO ENTERO, no «los que están a cero».
  //
  // La primera versión pedía sólo los no cubiertos, y eso es un valor
  // DERIVADO de la máquina: en cuanto se importan unos cuantos dejan de
  // estar a cero, salen de la lista, desaparecen del registro y el lexicón
  // —que los lee de ahí— los pierde. El registro encogía cuando la
  // cobertura crecía. Segunda circularidad del mismo día y la misma forma:
  // leer como entrada algo que uno mismo produjo.
  const delNucleo = nucleo.lemas.map((l) => l.lema);
  const titulos = [...new Set([...propios.map((p) => sinCantidad(p.lema)), ...delNucleo])];
  console.error(`${titulos.length} títulos (${propios.length} del lexicón a mano + los ${delNucleo.length} del núcleo)`);

  const uposDelCorpus = new Map(nucleo.lemas.map((l) => [sinCantidad(l.lema), (l as unknown as { upos: string }).upos]));
  // TERCER CAMINO: cuenta de rasgos de caso en el treebank, por lema.
  const casos = new Map<string, { con: number; sin: number }>();
  const formasDelCorpus = new Map<string, number>();
  for (const fr of leerFrases()) {
    for (const t of fr) {
      const k = sinCantidad(t.lema);
      let r = casos.get(k);
      if (!r) { r = { con: 0, sin: 0 }; casos.set(k, r); }
      if (/Case=/.test(t.feats)) r.con++; else r.sin++;
      const f = sinCantidad(t.forma);
      formasDelCorpus.set(f, (formasDelCorpus.get(f) ?? 0) + 1);
    }
  }
  const crudo = new Map<string, { ipa: string | null; head: string | null; pos: string | null; plantilla: string | null; falta: boolean }>();
  for (let i = 0; i < titulos.length; i += 50) {
    for (const p of await lote(titulos.slice(i, i + 50))) {
      const txt = p.revisions?.[0]?.slots?.main?.content ?? '';
      crudo.set(sinCantidad(p.title), p.missing ? { ipa: null, head: null, pos: null, plantilla: null, falta: true } : { ...macronesDe(txt, p.title), falta: false });
    }
    console.error(`  ${Math.min(i + 50, titulos.length)}/${titulos.length}`);
    await dormir(1500);
  }

  const filas: FilaDeMacron[] = [];
  const vistos = new Set<string>();
  for (const p of propios) {
    const k = sinCantidad(p.lema);
    if (vistos.has(k)) continue;
    vistos.add(k);
    const c = crudo.get(k);
    const { forma, caminos } = conciliar(c?.ipa ?? null, c?.head ?? null);
    // El lexicón propio MANDA sobre lo que ya tenía: la fuente sirve para
    // contrastarlo, no para pisarlo en silencio. Lo que la fuente añade se
    // escribe como discrepancia y se decide a mano.
    const discrepa = forma !== null && forma.normalize('NFC') !== p.lema.normalize('NFC') && jiUV(forma) !== jiUV(p.lema);
    filas.push({
      clave: k, cantidad: p.lema, origen: 'lexicon-propio', caminos,
      enElLexicon: p.lema,
      ...(discrepa ? { discrepancia: `la fuente da «${forma}»` } : {}),
    });
  }
  for (const l of delNucleo) {
    const k = sinCantidad(l);
    if (vistos.has(k)) continue;
    vistos.add(k);
    const c = crudo.get(k);
    const { forma, caminos } = conciliar(c?.ipa ?? null, c?.head ?? null);
    const upos = uposDelCorpus.get(k) ?? null;
    const pos = c?.pos ?? null;
    const fx = casos.get(k);
    filas.push(forma
      ? {
        clave: k, cantidad: forma, origen: 'fuente-externa', caminos,
        posFuente: pos, uposCorpus: upos,
        ...(categoriaContradice(pos, upos) ? { categoriaEnDisputa: true as const } : {}),
        ...(tieneBreve(forma) ? { cantidadVariable: true as const } : {}),
        ...(fx ? { conCasoEnElCorpus: fx.con, sinCasoEnElCorpus: fx.sin } : {}),
        ...(fx && fx.con > fx.sin ? { flexiona: true as const } : {}),
        formaAtestiguada: formasDelCorpus.get(sinCantidad(forma)) ?? 0,
        ...(c?.plantilla ? { plantilla: c.plantilla } : {}),
      }
      : { clave: k, cantidad: null, origen: 'sin-dato', caminos: 0, posFuente: pos, uposCorpus: upos });
  }

  const cuenta = (o: Origen) => filas.filter((f) => f.origen === o).length;
  const disputadas = filas.filter((f) => f.categoriaEnDisputa).length;
  const variables = filas.filter((f) => f.cantidadVariable).length;
  const flexionan = filas.filter((f) => f.flexiona).length;
  fs.writeFileSync(SALIDA, `${JSON.stringify({
    generado: new Date().toISOString().slice(0, 10),
    procedencia: {
      obra: 'Wiktionary, edición inglesa — secciones ==Latin==',
      url: 'https://en.wiktionary.org/w/api.php',
      licencia: 'CC BY-SA 4.0 / GFDL',
      queSeImporta: 'formas de cita con su cantidad vocálica (datos lexicográficos), no prosa',
      comoSeLee: 'dos plantillas independientes de la misma página, la-IPA y la-noun/la-verb/…, exigiendo que coincidan; el argumento se valida contra el título de la página',
    },
    fuenteDescartada: {
      obra: 'Lewis & Short (1879), vía PerseusDL/lexica',
      porQue: 'no marca la cantidad sino lo justo para colocar el acento: 42,5 % de las vocales, y calla sobre alguna en 182 de 200 lemas. `rēgnum` sale como «regnum»',
    },
    loQueNoSeHace: 'macronizadores automáticos: su salida es una inferencia de un modelo, no una atestación',
    total: filas.length,
    porOrigen: { 'lexicon-propio': cuenta('lexicon-propio'), 'fuente-externa': cuenta('fuente-externa'), 'sin-dato': cuenta('sin-dato') },
    discrepanciasConElLexicon: filas.filter((f) => f.discrepancia).length,
    categoriaEnDisputa: disputadas,
    cantidadVariable: variables,
    flexionanEnElCorpus: flexionan,
    conLaFormaDeCitaSinAtestiguar: filas.filter((f) => f.origen === 'fuente-externa' && f.formaAtestiguada === 0).length,
    porQueSeMiraLaFlexion: 'un indeclinable no lleva nunca `Case=`. `lātus` viene etiquetado ADV por el corpus y la fuente calla sobre su categoría, así que ni la cantidad ni la categoría lo cazan: sale 41 veces CON caso y 2 sin, y es un adjetivo declinado',
    porQueLaCategoriaSeCruza: 'el corpus etiqueta `tantus` y `cēterus` como ADV —su uso adverbial— y son adjetivos que DECLINAN: importarlos como indeclinables por fiarse de una etiqueta sola mete un error de datos que ningún gate de cantidad puede ver. Y `categoriaEnDisputa` es CONTRADICCIÓN, no silencio: los indeclinables de la fuente no llevan plantilla de encabezado, así que su categoría viene en blanco y eso no descalifica nada',
    filas,
  }, null, 1)}\n`);
  console.log(`${SALIDA}: ${filas.length} filas`);
  console.log(`  lexicón propio ${cuenta('lexicon-propio')} · fuente externa ${cuenta('fuente-externa')} · sin dato ${cuenta('sin-dato')}`);
  console.log(`  discrepancias con el lexicón: ${filas.filter((f) => f.discrepancia).length}`);
  console.log(`  categoría en disputa: ${disputadas} · cantidad variable: ${variables} · flexionan en el corpus: ${flexionan}`);
  for (const f of filas.filter((x) => x.discrepancia)) console.log(`    ${f.enElLexicon} — ${f.discrepancia}`);
}
if (process.argv[1]?.endsWith('traer-macrones.ts')) void main();

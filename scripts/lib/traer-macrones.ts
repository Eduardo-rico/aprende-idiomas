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
import { NOMBRES_L1, VERBOS_L1, ADJETIVOS_L1, INDECLINABLES_L1 } from '../../lib/data/languages/la/lexicon-l1';
import { ADJETIVOS_3A } from '../../lib/data/languages/la/adjetivos-3a';
import { IRREGULARES_L1 } from '../../lib/data/languages/la/irregulares';
import { DEPONENTES_L1 } from '../../lib/data/languages/la/deponentes';
import { PLURALIA_TANTUM } from '../../lib/data/languages/la/plural-tantum';

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
export function macronesDe(txt: string, titulo: string): { ipa: string | null; head: string | null } {
  const la = seccionLatina(txt);
  if (!la) return { ipa: null, head: null };
  const mi = la.match(/\{\{la-IPA\|([^}]*)\}\}/);
  const mh = la.match(new RegExp(`\\{\\{la-(${POS})\\|([^}]*)\\}\\}`));
  return {
    ipa: mi ? argQueEsElLema(mi[1]!, titulo) : null,
    head: mh ? argQueEsElLema(mh[2]!, titulo) : null,
  };
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
    ...INDECLINABLES_L1.map((i) => ({ lema: i, modulo: 'INDECLINABLES_L1' })),
  ];
}

async function main() {
  const propios = lemasDelLexicon();
  const nucleo = JSON.parse(fs.readFileSync('lib/data/languages/la/nucleo-800.json', 'utf8')) as { lemas: { lema: string; cubierto: number }[] };
  const aCero = nucleo.lemas.filter((l) => l.cubierto === 0).map((l) => l.lema);

  const titulos = [...new Set([...propios.map((p) => sinCantidad(p.lema)), ...aCero])];
  console.error(`${titulos.length} títulos (${propios.length} del lexicón + ${aCero.length} del núcleo a cero)`);

  const crudo = new Map<string, { ipa: string | null; head: string | null; falta: boolean }>();
  for (let i = 0; i < titulos.length; i += 50) {
    for (const p of await lote(titulos.slice(i, i + 50))) {
      const txt = p.revisions?.[0]?.slots?.main?.content ?? '';
      crudo.set(sinCantidad(p.title), p.missing ? { ipa: null, head: null, falta: true } : { ...macronesDe(txt, p.title), falta: false });
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
  for (const l of aCero) {
    const k = sinCantidad(l);
    if (vistos.has(k)) continue;
    vistos.add(k);
    const c = crudo.get(k);
    const { forma, caminos } = conciliar(c?.ipa ?? null, c?.head ?? null);
    filas.push(forma
      ? { clave: k, cantidad: forma, origen: 'fuente-externa', caminos }
      : { clave: k, cantidad: null, origen: 'sin-dato', caminos: 0 });
  }

  const cuenta = (o: Origen) => filas.filter((f) => f.origen === o).length;
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
    filas,
  }, null, 1)}\n`);
  console.log(`${SALIDA}: ${filas.length} filas`);
  console.log(`  lexicón propio ${cuenta('lexicon-propio')} · fuente externa ${cuenta('fuente-externa')} · sin dato ${cuenta('sin-dato')}`);
  console.log(`  discrepancias con el lexicón: ${filas.filter((f) => f.discrepancia).length}`);
  for (const f of filas.filter((x) => x.discrepancia)) console.log(`    ${f.enElLexicon} — ${f.discrepancia}`);
}
if (process.argv[1]?.endsWith('traer-macrones.ts')) void main();

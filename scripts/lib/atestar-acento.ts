// scripts/lib/atestar-acento.ts
//
// CONGELA EL ACENTO Y LA ATESTACIÓN DE TODAS LAS FORMAS DE L1. Genera
// `lib/data/languages/la/atestacion-acento.json`.
//
//   npx tsx scripts/lib/atestar-acento.ts
//
// Lo mismo que `atestar-irregulares` y por el mismo motivo: los treebanks
// están en `.gitignore`, así que un gate que los leyera en caliente pasaría
// aquí y fallaría en cualquier otro sitio. El contador del corpus se
// importa en vez de copiarse.
//
// ── LAS CIFRAS QUE EL LOTE NECESITA DECLARAR ─────────────────────────
//
// Este punto tiene un suelo que pone la lengua, y hay que medirlo antes de
// elegir ni una palabra: si el latín acentúa la penúltima la mayor parte
// de las veces, un lote que copie esa proporción se contesta adivinando.
// El fichero trae el reparto de las 1.429 formas de L1 y el de las que
// están atestiguadas, que es sobre lo que se puede construir.
//
// Y trae la cuenta de la categoría escasa: la penúltima larga POR POSICIÓN
// sin mácron, que es la única que refuta la estrategia «mirar sólo el
// mácrón». Si es rara en la lengua, el lote tiene que sobrerrepresentarla
// A PROPÓSITO y decirlo, porque si no el punto no se puede examinar.
import fs from 'node:fs';
import path from 'node:path';
import { contarCorpus, sinCantidad } from './atestar-irregulares';
import { acentoLatino } from '../voz/cuanto-duele';
import { NOMBRES_L1, VERBOS_L1, ADJETIVOS_L1 } from '../../lib/data/languages/la/lexicon-l1';
import { paradigmaNominal, infectum, perfectum, declinacionDe } from '../../lib/data/languages/la/paradigma-la';

const SALIDA = 'lib/data/languages/la/atestacion-acento.json';
const MACRON = /[āēīōūȳ]/;
const DIPTONGOS = ['ae', 'au', 'oe'];

export type TipoDeAcento = 'macron' | 'diptongo' | 'posicion' | 'breve' | 'bisilabo' | 'monosilabo';

/** Por qué esta palabra lleva el acento donde lo lleva. Es el eje del
 *  `varia`: «si la penúltima es larga por naturaleza o por posición». */
export function tipoDeAcento(palabra: string): { tipo: TipoDeAcento; silabas: string[]; tonica: string } {
  const r = acentoLatino(palabra);
  const s = r.silabas;
  if (r.acento === 'monosilabo') return { tipo: 'monosilabo', silabas: s, tonica: s[0]! };
  if (r.acento === 'bisilabo') return { tipo: 'bisilabo', silabas: s, tonica: s[0]! };
  const pen = s[s.length - 2]!;
  if (r.acento === 'antepenultima') return { tipo: 'breve', silabas: s, tonica: s[s.length - 3]! };
  if (MACRON.test(pen)) return { tipo: 'macron', silabas: s, tonica: pen };
  if (DIPTONGOS.some((d) => pen.includes(d))) return { tipo: 'diptongo', silabas: s, tonica: pen };
  return { tipo: 'posicion', silabas: s, tonica: pen };
}

export function todasLasFormasL1(): string[] {
  const out = new Set<string>();
  for (const n of NOMBRES_L1) {
    try { declinacionDe(n); } catch { continue; }
    for (const f of Object.values(paradigmaNominal(n))) out.add(f);
  }
  for (const v of VERBOS_L1) {
    for (const f of Object.values(infectum(v))) out.add(f);
    for (const f of Object.values(perfectum(v))) out.add(f);
  }
  for (const a of ADJETIVOS_L1) out.add(a.lema);
  return [...out];
}

if (process.argv[1] && path.resolve(process.argv[1]).endsWith('atestar-acento.ts')) {
  const { unigramas, tokens } = contarCorpus();
  const formas = todasLasFormasL1();
  const porTipo: Record<string, { total: number; atestiguadas: number }> = {};
  const tabla: Record<string, { silabas: string[]; tonica: string; tipo: TipoDeAcento; n: number }> = {};
  for (const f of formas) {
    const t = tipoDeAcento(f);
    const n = unigramas.get(sinCantidad(f)) ?? 0;
    (porTipo[t.tipo] ??= { total: 0, atestiguadas: 0 }).total++;
    if (n > 0) porTipo[t.tipo]!.atestiguadas++;
    tabla[f] = { silabas: t.silabas, tonica: t.tonica, tipo: t.tipo, n };
  }
  const llanas = (porTipo['macron']?.total ?? 0) + (porTipo['diptongo']?.total ?? 0)
    + (porTipo['posicion']?.total ?? 0) + (porTipo['bisilabo']?.total ?? 0);
  const atest = Object.values(porTipo).reduce((a, b) => a + b.atestiguadas, 0);
  const posicionAtest = porTipo['posicion']?.atestiguadas ?? 0;

  fs.writeFileSync(SALIDA, `${JSON.stringify({
    generado: new Date().toISOString().slice(0, 10),
    corpus: 'la_perseus + la_proiel (UD)', tokens,
    formas: formas.length,
    // EL SUELO QUE PONE LA LENGUA: qué acierta quien conteste «la penúltima»
    // a todo, sin saber nada. Es lo que el lote tiene que romper a propósito.
    sueloDeLaPenultima: llanas / formas.length,
    reparto: porTipo,
    // La categoría escasa. Es la única que refuta «mirar sólo el mácrón», y
    // sobre las formas atestiguadas es lo poco que es.
    posicionSobreAtestiguadas: posicionAtest / Math.max(1, atest),
    tabla,
  }, null, 1)}\n`);
  const pct = (x: number) => `${(100 * x).toFixed(1)} %`;
  console.log(`${formas.length} formas · suelo de «siempre la penúltima»: ${pct(llanas / formas.length)}`);
  for (const [k, v] of Object.entries(porTipo)) console.log(`   ${k.padEnd(11)} ${String(v.total).padStart(4)} · atestiguadas ${v.atestiguadas}`);
  console.log(`   penúltima larga POR POSICIÓN sobre las atestiguadas: ${pct(posicionAtest / Math.max(1, atest))}`);
  console.log(`escrito ${SALIDA}`);
}

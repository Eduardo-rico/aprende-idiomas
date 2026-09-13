// scripts/lib/atestar-por-analisis.ts
//
// CONGELA LA ATESTACIÓN POR ANÁLISIS. Genera
// `lib/data/languages/la/atestacion-por-analisis.json`.
//
//   npx tsx scripts/lib/atestar-por-analisis.ts
//
// ── POR QUÉ NO BASTABA LA CUENTA POR CADENA ──────────────────────────
//
// `atestacion-acento.json` cuenta CADENAS, y para su pregunta —cómo se
// pronuncia esto— la cadena es la pregunta entera: `vocem` suena igual sea
// el acusativo de `vōx` o el presente de subjuntivo de `vocō`.
//
// El lote `l7-morfologia-subj` usó ese mismo sello para responder OTRA
// pregunta: «¿se encontrará el alumno esta forma?». Y ahí la cadena miente.
// Medido sobre los 16 ítems del lote, contando el rasgo `Mood=Sub` del
// treebank en vez de la cadena:
//
//     laudem   15 apariciones · 0 como subjuntivo   (las 15 son `laus`)
//     vocem    81 apariciones · 1 como subjuntivo   (80 son `vōx`)
//
// Y eran los DOS presentes de la 1.ª conjugación, es decir, los dos únicos
// ítems que examinaban la inversión `amem`/`moneam`, que es el punto. Los
// elegí por tener la cuenta más alta y la cuenta era alta porque son
// sustantivos corrientes: el sello premiaba exactamente lo que había que
// evitar.
//
// Este fichero cuenta por RASGO. Sirve al subjuntivo, a la pasiva, y a los
// participios y los infinitivos que vienen detrás —todos preguntan por un
// análisis y ninguno por una cadena.
import fs from 'node:fs';
import { todasLasFormasDeL1 } from '../../lib/data/languages/la/todas-las-formas';
import { sinCantidad } from './atestar-irregulares';

const DIR = 'scripts/.cache/treebanks';
const SALIDA = 'lib/data/languages/la/atestacion-por-analisis.json';

/** Los análisis que este proyecto distingue. No es la lista de UD entera:
 *  es la de los puntos que hay o habrá, y crece cuando llegue el que falte. */
export type Analisis = 'ind' | 'sub' | 'imp' | 'inf' | 'part' | 'ger' | 'sup' | 'nominal' | 'otro'
  | 'partPres' | 'partPast' | 'partFut';

export function analisisDe(feats: string, upos: string): Analisis {
  if (/Mood=Sub/.test(feats)) return 'sub';
  if (/Mood=Imp/.test(feats)) return 'imp';
  if (/Mood=Ind/.test(feats)) return 'ind';
  if (/VerbForm=Inf/.test(feats)) return 'inf';
  if (/VerbForm=Part/.test(feats)) return 'part';   // el tiempo se añade aparte
  if (/VerbForm=Ger/.test(feats)) return 'ger';
  if (/VerbForm=Sup/.test(feats)) return 'sup';
  if (['NOUN', 'PROPN', 'ADJ', 'PRON', 'DET', 'NUM'].includes(upos)) return 'nominal';
  return 'otro';
}

export function contarPorAnalisis(dir = DIR): { tabla: Map<string, Record<string, number>>; tokens: number } {
  const tabla = new Map<string, Record<string, number>>();
  let tokens = 0;
  for (const f of fs.readdirSync(dir).filter((x) => x.startsWith('la_') && x.endsWith('.conllu'))) {
    for (const l of fs.readFileSync(`${dir}/${f}`, 'utf8').split('\n')) {
      if (!l || l.startsWith('#')) continue;
      const c = l.split('\t');
      if (c.length < 6 || c[0]!.includes('-') || c[0]!.includes('.')) continue;
      tokens++;
      const k = sinCantidad(c[1]!);
      const fe = c[5] ?? '';
      const a = analisisDe(fe, c[3] ?? '');
      const fila = tabla.get(k) ?? {};
      fila[a] = (fila[a] ?? 0) + 1;
      // Los tres participios son un punto del currículo (`l8-tres-participios`)
      // y `part` a secas no los separa: el de presente, el de perfecto y el
      // de futuro son tres formas distintas con tres valores distintos.
      if (a === 'part') {
        const t = fe.match(/Tense=(\w+)/)?.[1] ?? '';
        const k2 = t === 'Pres' ? 'partPres' : t === 'Past' ? 'partPast' : t === 'Fut' ? 'partFut' : null;
        if (k2) fila[k2] = (fila[k2] ?? 0) + 1;
      }
      tabla.set(k, fila);
    }
  }
  return { tabla, tokens };
}

async function main() {
  const { tabla, tokens } = contarPorAnalisis();
  const salida: Record<string, Record<string, number>> = {};
  // Sólo las formas del dominio: el fichero es para responder por lo que la
  // máquina produce, no para llevarse el corpus al repositorio.
  for (const f of todasLasFormasDeL1()) {
    const fila = tabla.get(sinCantidad(f.forma));
    if (fila) salida[f.forma] = fila;
  }
  const conSub = Object.values(salida).filter((r) => (r.sub ?? 0) > 0).length;
  const porParticipio = {
    presente: Object.values(salida).filter((r) => (r.partPres ?? 0) > 0).length,
    perfecto: Object.values(salida).filter((r) => (r.partPast ?? 0) > 0).length,
    futuro: Object.values(salida).filter((r) => (r.partFut ?? 0) > 0).length,
  };
  fs.writeFileSync(SALIDA, `${JSON.stringify({
    generado: new Date().toISOString().slice(0, 10),
    corpus: 'UD Latin (scripts/.cache/treebanks)',
    tokens,
    formasDelDominio: todasLasFormasDeL1().length,
    formasAtestiguadas: Object.keys(salida).length,
    formasAtestiguadasComoSubjuntivo: conSub,
    formasAtestiguadasPorParticipio: porParticipio,
    tabla: salida,
  }, null, 1)}\n`);
  console.log(`${SALIDA}: ${Object.keys(salida).length} formas atestiguadas de ${todasLasFormasDeL1().length} · ${conSub} como subjuntivo · ${tokens} tokens`);
  console.log(`  participios: presente ${porParticipio.presente} · perfecto ${porParticipio.perfecto} · futuro ${porParticipio.futuro}`);
}
main();

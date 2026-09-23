// scripts/lib/atestar-consecutio.ts
//
// CONGELA LO QUE EL CORPUS DICE DE LA CONCORDANCIA DE TIEMPOS. Genera
// `lib/data/languages/la/atestacion-consecutio.json`.
//
//   npx tsx scripts/lib/atestar-consecutio.ts
//
// ── POR QUÉ UN SELLO NUEVO Y NO `atestacion-ut.json` ─────────────────
//
// `atestacion-ut.json` ya cuenta la concordancia, pero SÓLO en las
// subordinadas con `ut`/`nē`: finales y completivas, que miran hacia
// adelante y no tienen ANTERIORIDAD. El perfecto y el pluscuamperfecto de
// subjuntivo —la mitad de la tabla de `l7-consecutio`— no pueden salir de
// ahí. Salen de la INTERROGATIVA INDIRECTA, que sí pregunta por lo ya
// ocurrido («rogat cūr vēnerit»).
//
// ── CÓMO SE CUENTA ───────────────────────────────────────────────────
//
//   · la cabeza lleva `Mood=Sub` y es `ccomp`/`csubj` de un verbo en
//     INDICATIVO personal (el regente);
//   · de ella cuelga, ANTES de ella, un interrogativo de la lista de abajo
//     (`quis` sólo con `PronType=Int`, para no contar relativos);
//   · el tiempo es `Tense` más el aspecto, como en `atestar-ut.ts`:
//     `Past` = imperfecto, `PastPerf` = perfecto, `Pqp`/`PqpPerf` =
//     pluscuamperfecto.
//
// Y una segunda tabla sin exigir interrogativo —TODA subordinada en
// subjuntivo con regente en indicativo—, porque la primera es pequeña y
// porque la segunda mezcla lo que la regla NO gobierna (condicionales
// irreales, relativas): lo que hace que la primera sea la que decide.
//
// ── LO QUE ESTE SELLO NO PUEDE DECIR ─────────────────────────────────
//
// La ANTERIORIDAD no está anotada. El sello dice qué tiempos del
// subjuntivo salen con cada regente, no cuál de los dos corresponde a
// cada ítem: eso lo decide el ítem, que declara la relación. Un sello
// responde a una pregunta (§E6).
import fs from 'node:fs';
import { leerFrases, tiempoDe, type Tok } from './atestar-ut';

const SALIDA = 'lib/data/languages/la/atestacion-consecutio.json';

export const INTERROGATIVOS = new Set([
  'cur', 'ubi', 'quando', 'num', 'an', 'quomodo', 'quis', 'unde', 'quo', 'utrum',
  'quare', 'qualis', 'quantus', 'quot', 'quemadmodum',
]);

/** `Pqp` y `PqpPerf` son el mismo tiempo anotado de dos maneras. */
export function tiempoNormalizado(t: Tok): string {
  const x = tiempoDe(t);
  return x === 'PqpPerf' ? 'Pqp' : x;
}

export interface Hallazgo { regente: string; subordinada: string; frase: string }

export function interrogativasIndirectas(frases: Tok[][]): Hallazgo[] {
  const out: Hallazgo[] = [];
  for (const fr of frases) for (const h of fr) {
    if (!/Mood=Sub/.test(h.feats) || !/VerbForm=Fin/.test(h.feats)) continue;
    if (!['ccomp', 'csubj', 'csubj:pass'].includes(h.deprel)) continue;
    const q = fr.find((x) => x.head === h.id && x.id < h.id && INTERROGATIVOS.has(x.lema)
      && (x.lema !== 'quis' || /PronType=Int/.test(x.feats)));
    if (!q) continue;
    const r = fr.find((x) => x.id === h.head);
    if (!r || !/VerbForm=Fin/.test(r.feats) || !/Mood=Ind/.test(r.feats)) continue;
    out.push({ regente: tiempoNormalizado(r), subordinada: tiempoNormalizado(h), frase: fr.map((t) => t.forma).join(' ') });
  }
  return out;
}

export function todasLasSubordinadas(frases: Tok[][]): Hallazgo[] {
  const out: Hallazgo[] = [];
  for (const fr of frases) for (const h of fr) {
    if (!/Mood=Sub/.test(h.feats) || !/VerbForm=Fin/.test(h.feats)) continue;
    if (!['ccomp', 'csubj', 'csubj:pass', 'advcl', 'acl', 'acl:relcl'].includes(h.deprel)) continue;
    const r = fr.find((x) => x.id === h.head);
    if (!r || !/VerbForm=Fin/.test(r.feats) || !/Mood=Ind/.test(r.feats)) continue;
    out.push({ regente: tiempoNormalizado(r), subordinada: tiempoNormalizado(h), frase: '' });
  }
  return out;
}

export function tabla(hs: Hallazgo[]): Record<string, Record<string, number>> {
  const t: Record<string, Record<string, number>> = {};
  for (const h of hs) {
    const fila = (t[h.regente] ??= {});
    fila[h.subordinada] = (fila[h.subordinada] ?? 0) + 1;
  }
  return t;
}

async function main() {
  const frases = leerFrases();
  const ii = interrogativasIndirectas(frases);
  const ejemplos: Record<string, string[]> = {};
  for (const h of ii) {
    const k = `${h.regente} → ${h.subordinada}`;
    const xs = (ejemplos[k] ??= []);
    if (xs.length < 3) xs.push(h.frase.slice(0, 160));
  }
  const salida = {
    generado: new Date().toISOString().slice(0, 10),
    corpus: 'UD Latin (scripts/.cache/treebanks)',
    comoSeCuenta: 'cabeza con Mood=Sub, ccomp/csubj de un regente en indicativo personal, con un interrogativo dependiente delante (quis sólo con PronType=Int). Tense+Aspect: Past = imperfecto, PastPerf = perfecto, Pqp = pluscuamperfecto',
    total: ii.length,
    interrogativaIndirecta: tabla(ii),
    todasLasSubordinadas: tabla(todasLasSubordinadas(frases)),
    ejemplos,
  };
  fs.writeFileSync(SALIDA, `${JSON.stringify(salida, null, 1)}\n`);
  console.log(`${SALIDA}: ${ii.length} interrogativas indirectas`);
  for (const [r, fila] of Object.entries(salida.interrogativaIndirecta))
    console.log(`  ${r.padEnd(9)} ${JSON.stringify(fila)}`);
}

// Se importa desde el gate y el test: el generador no corre al importarlo.
if (process.argv[1]?.endsWith('atestar-consecutio.ts')) void main();

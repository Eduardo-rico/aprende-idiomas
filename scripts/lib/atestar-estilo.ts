// scripts/lib/atestar-estilo.ts
//
// CONGELA LA DIFERENCIA ENTRE LA VULGATA Y EL LATÍN CLÁSICO. Genera
// `lib/data/languages/la/atestacion-estilo.json`.
//
//   npx tsx scripts/lib/atestar-estilo.ts
//
// ── QUÉ AFIRMA EL MATERIAL Y QUÉ DICE EL CORPUS ─────────────────────
//
// `l13-vulgata-sintaxis`: «Jerónimo coordina donde el clásico subordina, y
// su orden de palabras se parece mucho más al español. Por eso el curso
// empieza aquí.» Las dos mitades son medibles y las dos salen confirmadas.
//
// ── EL CORTE QUE NO VALE ────────────────────────────────────────────
//
// La primera medición cortó por TREEBANK —PROIEL contra Perseus— y dio lo
// contrario: 1,29 frente a 1,54, o sea que el «clásico» coordinaba más.
// El corte era falso: **PROIEL es 55 % Vulgata y 45 % Cicerón, César y
// Paladio**, así que comparaba «Vulgata + clásico» contra «clásico». Hay
// que cortar por FUENTE, que es lo que hace este fichero.
//
//     Jerome's Vulgate            109.198 tokens
//     Epistulae ad Atticum         42.192
//     Commentarii belli Gallici    25.272
//     Opus agriculturae            10.931
//     De officiis                  10.485
//
// ── Y UNA ADVERTENCIA SOBRE UNA CIFRA YA PUBLICADA ──────────────────
//
// `gate-cloze-glosa.ts` cita «SOV 38,9 % SVO 29,4 %… el sujeto precede al
// objeto en el 73,1 % del latín real». Esa media se toma sobre un corpus que
// es casi la mitad Vulgata, así que «el latín real» ahí es «un corpus mitad
// Vulgata». Por fuente, el clásico va del 44 % al 70 % de SOV y la Vulgata
// del 24 %. La conclusión de aquel gate —mezclar órdenes en vez de
// prohibirlos— no cambia; la cifra hay que leerla sabiendo de dónde sale.
import fs from 'node:fs';

const DIR = 'scripts/.cache/treebanks';
const SALIDA = 'lib/data/languages/la/atestacion-estilo.json';

export interface CuentaDeEstilo {
  tokens: number; frases: number; tokensPorFrase: number;
  coordinacionPorMil: number; subordinacionPorMil: number; coordSobreSubord: number;
  ordenes: Record<string, number>;
  clausulasConSujetoYObjeto: number;
  verboFinal: number;
}

interface Bruto {
  frases: number; tokens: number; conj: number; cc: number;
  advcl: number; ccomp: number; acl: number; csubj: number;
  ordenes: Map<string, number>;
}

export function medirEstilo(dir = DIR): Map<string, CuentaDeEstilo> {
  const bruto = new Map<string, Bruto>();
  const meter = (f: string) => {
    let r = bruto.get(f);
    if (!r) { r = { frases: 0, tokens: 0, conj: 0, cc: 0, advcl: 0, ccomp: 0, acl: 0, csubj: 0, ordenes: new Map() }; bruto.set(f, r); }
    return r;
  };
  for (const f of fs.readdirSync(dir).filter((x) => x.startsWith('la_') && x.endsWith('.conllu'))) {
    const esPerseus = f.includes('perseus');
    let fuente = esPerseus ? 'Perseus (varios clásicos)' : '?';
    let actual = meter(fuente);
    let frase: { id: number; head: number; deprel: string }[] = [];
    const cerrar = () => {
      if (frase.length > 0) actual.frases++;
      const verbos = new Map<number, { s?: number; o?: number }>();
      for (const t of frase) {
        if (t.deprel !== 'nsubj' && t.deprel !== 'obj') continue;
        let e = verbos.get(t.head);
        if (!e) { e = {}; verbos.set(t.head, e); }
        if (t.deprel === 'nsubj') e.s = t.id; else e.o = t.id;
      }
      for (const [v, { s, o }] of verbos) {
        if (s === undefined || o === undefined) continue;
        const tri = ([[s, 'S'], [o, 'O'], [v, 'V']] as [number, string][])
          .sort((a, b) => a[0] - b[0]).map((x) => x[1]).join('');
        actual.ordenes.set(tri, (actual.ordenes.get(tri) ?? 0) + 1);
      }
      frase = [];
    };
    for (const l of fs.readFileSync(`${dir}/${f}`, 'utf8').split('\n')) {
      if (l.startsWith('# source = ') && !esPerseus) { cerrar(); fuente = l.slice(11).replace(/,.*/, ''); actual = meter(fuente); continue; }
      if (!l.trim()) { cerrar(); continue; }
      if (l.startsWith('#')) continue;
      const c = l.split('\t');
      if (c.length < 8 || c[0]!.includes('-') || c[0]!.includes('.')) continue;
      actual.tokens++;
      const d = (c[7] ?? '').split(':')[0]!;
      if (d === 'conj' || d === 'cc' || d === 'advcl' || d === 'ccomp' || d === 'acl' || d === 'csubj') actual[d]++;
      frase.push({ id: +c[0]!, head: +(c[6] ?? 0), deprel: d });
    }
    cerrar();
  }
  const out = new Map<string, CuentaDeEstilo>();
  for (const [f, r] of bruto) {
    if (r.tokens < 5000) continue;
    const coord = r.conj + r.cc, sub = r.advcl + r.ccomp + r.acl + r.csubj;
    const tot = [...r.ordenes.values()].reduce((a, b) => a + b, 0);
    const pct = (k: string) => Number((100 * (r.ordenes.get(k) ?? 0) / tot).toFixed(1));
    out.set(f, {
      tokens: r.tokens, frases: r.frases,
      tokensPorFrase: Number((r.tokens / r.frases).toFixed(1)),
      coordinacionPorMil: Number((1000 * coord / r.tokens).toFixed(1)),
      subordinacionPorMil: Number((1000 * sub / r.tokens).toFixed(1)),
      coordSobreSubord: Number((coord / sub).toFixed(2)),
      ordenes: Object.fromEntries(['SOV', 'SVO', 'OSV', 'OVS', 'VSO', 'VOS'].map((k) => [k, pct(k)])),
      clausulasConSujetoYObjeto: tot,
      verboFinal: Number((100 * ((r.ordenes.get('SOV') ?? 0) + (r.ordenes.get('OSV') ?? 0)) / tot).toFixed(1)),
    });
  }
  return out;
}

async function main() {
  const m = medirEstilo();
  const vulgata = m.get("Jerome's Vulgate")!;
  const clasicos = [...m].filter(([f]) => f !== "Jerome's Vulgate");
  fs.writeFileSync(SALIDA, `${JSON.stringify({
    generado: new Date().toISOString().slice(0, 10),
    corpus: 'UD Latin (scripts/.cache/treebanks), cortado POR FUENTE y no por treebank',
    porQuePorFuente: 'PROIEL es 55 % Vulgata y 45 % Cicerón, César y Paladio: cortar por treebank compara «Vulgata + clásico» contra «clásico», y eso dio el resultado contrario al verdadero',
    fuentes: Object.fromEntries(m),
    loQueDiceElMaterial: 'Jerónimo coordina donde el clásico subordina, y su orden de palabras se parece mucho más al español',
    veredicto: {
      subordinacion: `la Vulgata subordina ${vulgata.subordinacionPorMil}‰ y los clásicos entre ${Math.min(...clasicos.map(([, c]) => c.subordinacionPorMil))}‰ y ${Math.max(...clasicos.map(([, c]) => c.subordinacionPorMil))}‰`,
      frase: `la Vulgata tiene las frases más cortas del corpus: ${vulgata.tokensPorFrase} tokens frente a ${Math.max(...clasicos.map(([, c]) => c.tokensPorFrase))} de César`,
      orden: `la Vulgata es SVO en el ${vulgata.ordenes.SVO} % de sus cláusulas y César en el ${m.get('Commentarii belli Gallici')!.ordenes.SVO} %`,
      verboFinal: `el verbo va al final en el ${vulgata.verboFinal} % de la Vulgata y en el ${m.get('Commentarii belli Gallici')!.verboFinal} % de César`,
    },
  }, null, 1)}\n`);
  console.log(`${SALIDA}: ${m.size} fuentes`);
  console.log('fuente                          tokens  tok/frase  subord‰  coord/sub    SOV    SVO  V-final');
  for (const [f, c] of [...m].sort((a, b) => b[1].tokens - a[1].tokens))
    console.log(`  ${f.padEnd(28)} ${String(c.tokens).padStart(6)} ${String(c.tokensPorFrase).padStart(10)} ${String(c.subordinacionPorMil).padStart(8)} ${String(c.coordSobreSubord).padStart(11)} ${String(c.ordenes.SOV).padStart(6)} ${String(c.ordenes.SVO).padStart(6)} ${String(c.verboFinal).padStart(8)}`);
}
if (process.argv[1]?.endsWith('atestar-estilo.ts')) void main();

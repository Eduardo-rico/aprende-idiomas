// scripts/lib/atestar-grado.ts
//
// CONGELA LA ATESTACIÓN DEL GRADO. Genera
// `lib/data/languages/la/atestacion-grado.json`.
//
//   npx tsx scripts/lib/atestar-grado.ts
//
// ── QUÉ SE CUENTA ────────────────────────────────────────────────────
//
// El rasgo `Degree` del treebank, no la cadena: `maius` es comparativo
// neutro y también podría ser otra cosa en otro contexto. UD usa tres
// valores donde el material usa dos —`Cmp`, `Sup` y `Abs`—, y el tercero es
// el superlativo ELATIVO («muy grande», no «el más grande»). Se cuentan los
// dos últimos juntos como superlativo, y por separado, porque la distinción
// es la de `l4-comparativo-absoluto`.
//
// ── PARA QUÉ SIRVE ───────────────────────────────────────────────────
//
// Para saber cuáles de las formas que la máquina produce EXISTEN. Una
// máquina de grado genera un comparativo para cualquier adjetivo, y hay
// adjetivos que no se comparan: `*omnior` no está en ningún texto porque
// «todo» no admite grados. La máquina tiene que callarse ahí, y la única
// manera de saber dónde es mirarlo.
import fs from 'node:fs';
import { ADJETIVOS_L1 } from '../../lib/data/languages/la/lexicon-l1';
import { ADJETIVOS_3A, temaDelAdjetivo } from '../../lib/data/languages/la/adjetivos-3a';
import { gradosDe } from '../../lib/data/languages/la/grado';
import { todasLasFormasDeL1 } from '../../lib/data/languages/la/todas-las-formas';
import { sinCantidad } from './atestar-irregulares';

const DIR = 'scripts/.cache/treebanks';
const SALIDA = 'lib/data/languages/la/atestacion-grado.json';

export interface CuentaDeGrado { cmp: number; sup: number; abs: number }

export function contarGrados(dir = DIR): { porLema: Map<string, CuentaDeGrado>; porForma: Map<string, CuentaDeGrado> } {
  const porLema = new Map<string, CuentaDeGrado>();
  const porForma = new Map<string, CuentaDeGrado>();
  const toca = (m: Map<string, CuentaDeGrado>, k: string) => {
    let v = m.get(k); if (!v) { v = { cmp: 0, sup: 0, abs: 0 }; m.set(k, v); } return v;
  };
  for (const f of fs.readdirSync(dir).filter((x) => x.startsWith('la_') && x.endsWith('.conllu'))) {
    for (const l of fs.readFileSync(`${dir}/${f}`, 'utf8').split('\n')) {
      if (!l.trim() || l.startsWith('#')) continue;
      const c = l.split('\t');
      if (c.length < 6 || c[0]!.includes('-') || c[0]!.includes('.')) continue;
      const g = (c[5] ?? '').match(/Degree=(\w+)/)?.[1];
      if (!g || !['Cmp', 'Sup', 'Abs'].includes(g)) continue;
      const clave = g === 'Cmp' ? 'cmp' : g === 'Sup' ? 'sup' : 'abs';
      toca(porLema, (c[2] ?? '').toLowerCase())[clave]++;
      toca(porForma, sinCantidad(c[1]!))[clave]++;
    }
  }
  return { porLema, porForma };
}

async function main() {
  const { porLema, porForma } = contarGrados();
  const adjetivos = [
    ...ADJETIVOS_L1.map((a) => ({ lema: a.lema, tema: (a as { tema: string }).tema, clase: '1ª/2ª' })),
    ...ADJETIVOS_3A.map((a) => ({ lema: a.lema, tema: temaDelAdjetivo(a), clase: '3ª' })),
  ];
  const tabla: Record<string, {
    clase: string; claseDeSuperlativo: string;
    comparativo: string | null; superlativo: string | null;
    lemaEnCorpus: CuentaDeGrado; comparativoEnCorpus: number; superlativoEnCorpus: number;
  }> = {};
  for (const a of adjetivos) {
    const g = gradosDe(a.lema, a.tema);
    const cmp = g.comparativo === null ? 0 : (porForma.get(sinCantidad(g.comparativo))?.cmp ?? 0);
    const sup = g.superlativo === null ? 0 : (() => {
      const f = porForma.get(sinCantidad(g.superlativo));
      return (f?.sup ?? 0) + (f?.abs ?? 0);
    })();
    tabla[a.lema] = {
      clase: a.clase, claseDeSuperlativo: g.clase,
      comparativo: g.comparativo, superlativo: g.superlativo,
      lemaEnCorpus: porLema.get(sinCantidad(a.lema)) ?? { cmp: 0, sup: 0, abs: 0 },
      comparativoEnCorpus: cmp, superlativoEnCorpus: sup,
    };
  }
  // LA CUENTA POR FORMA, que es lo que el gate mira: para cada forma de
  // grado que la máquina produce, cuántas veces sale en el corpus con ese
  // rasgo. Sin esto el gate tendría que preguntar por el lema, que no
  // distingue `maiōrem` de `maiōribus`.
  const formas: Record<string, { cmp: number; sup: number }> = {};
  for (const f of todasLasFormasDeL1()) {
    if (f.tabla !== 'COMPARATIVOS' && f.tabla !== 'SUPERLATIVOS') continue;
    if (formas[f.forma]) continue;
    const c = porForma.get(sinCantidad(f.forma));
    formas[f.forma] = { cmp: c?.cmp ?? 0, sup: (c?.sup ?? 0) + (c?.abs ?? 0) };
  }
  const sinNada = Object.entries(tabla).filter(([, v]) =>
    v.comparativo !== null && v.lemaEnCorpus.cmp === 0 && v.lemaEnCorpus.sup === 0 && v.lemaEnCorpus.abs === 0);
  fs.writeFileSync(SALIDA, `${JSON.stringify({
    generado: new Date().toISOString().slice(0, 10),
    corpus: 'UD Latin (scripts/.cache/treebanks)',
    comoSeCuenta: 'el rasgo Degree del treebank (Cmp / Sup / Abs), no la cadena; `Abs` es el superlativo elativo y se suma al superlativo',
    adjetivos: adjetivos.length,
    lemasConAlgunGrado: Object.values(tabla).filter((v) => v.lemaEnCorpus.cmp + v.lemaEnCorpus.sup + v.lemaEnCorpus.abs > 0).length,
    lemasQueLaMaquinaGRADUAySINningunaAtestacion: sinNada.map(([k]) => k),
    formasDelDominio: Object.keys(formas).length,
    formasAtestiguadas: Object.values(formas).filter((v) => v.cmp + v.sup > 0).length,
    tabla,
    formas,
  }, null, 1)}\n`);
  console.log(`${SALIDA}: ${adjetivos.length} adjetivos`);
  for (const [k, v] of Object.entries(tabla))
    console.log(`  ${k.padEnd(12)} ${String(v.comparativo).padEnd(14)} cmp=${String(v.comparativoEnCorpus).padStart(3)}  ${String(v.superlativo).padEnd(16)} sup=${String(v.superlativoEnCorpus).padStart(3)}  lema: cmp=${v.lemaEnCorpus.cmp} sup=${v.lemaEnCorpus.sup} abs=${v.lemaEnCorpus.abs}`);
  console.log(`\n  formas de grado en el dominio: ${Object.keys(formas).length} · atestiguadas: ${Object.values(formas).filter((v) => v.cmp + v.sup > 0).length}`);
  console.log(`⚠ la máquina gradúa y el corpus no atestigua NINGÚN grado: ${sinNada.map(([k]) => k).join(', ') || '(ninguno)'}`);
}
if (process.argv[1]?.endsWith('atestar-grado.ts')) void main();

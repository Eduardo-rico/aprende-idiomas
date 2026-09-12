// scripts/voz/veredicto-acento.mjs
//
// EL VEREDICTO DE LA SONDA, sobre los clips ya generados.
//
//   node scripts/voz/veredicto-acento.mjs scripts/.cache/voz/romans
//
// No gasta nada: lee el audio que la sonda pagó.
import { grupo, permutacionSilaba } from './pico-por-silaba.mjs';

const DIR = process.argv[2] ?? 'scripts/.cache/voz/romans';

const CASOS = [
  { titulo: 'discipulum → discìpulum', a: 'esdrujula-a', b: 'esdrujula-b', n: 4, marcada: 2,
    latin: 2, nota: 'dis-CI-pu-lum en latín; el italiano pondría dis-ci-PU-lum' },
  { titulo: 'dominos → dòminos', a: 'tilde-a', b: 'tilde-b', n: 3, marcada: 1,
    latin: 1, nota: 'DO-mi-nōs: esdrújula. La penúltima «mi» es BREVE; que la última sea larga da igual porque el latín nunca acentúa la última. Lo tuve mal escrito y el par no era el control que yo creía' },
];

console.log(`  clips: ${DIR}\n`);
for (const c of CASOS) {
  const A = grupo(DIR, c.a, c.n), B = grupo(DIR, c.b, c.n);
  const media = (g, i) => g.reduce((s, e) => s + e[i], 0) / g.length;
  const votos = (g) => { const v = new Array(c.n).fill(0); for (const t of g) v[t.indexOf(Math.max(...t))]++; return v; };
  const vA = votos(A), vB = votos(B);
  console.log(`  ${c.titulo}   —  ${c.nota}`);
  console.log(`    pico sin tilde: sílaba ${vA.indexOf(Math.max(...vA)) + 1} (${vA.join('/')})   con tilde: sílaba ${vB.indexOf(Math.max(...vB)) + 1} (${vB.join('/')})`);
  for (let i = 0; i < c.n; i++) {
    const r = permutacionSilaba(A, B, i);
    console.log(`      sílaba ${i + 1}: ${media(A, i).toFixed(3)} → ${media(B, i).toFixed(3)}   Δ ${(-r.obs).toFixed(3)}  p = ${r.p.toFixed(4)}${r.p < 0.05 ? '  SIGNIFICATIVO' : ''}${i + 1 === c.marcada ? '   ← la que marca la tilde' : ''}`);
  }
  console.log();
}

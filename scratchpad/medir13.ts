// Medición del lote 13 — revisor PEDAGÓGICO. Re-baseline sobre el estado
// de HEAD 89ae861: 4 ítems, 2 pares (P-01 muerto en el round de gramática).
import { RASGOS, medirRasgo, pValor, bateria, SOSPECHOSO, type ItemJuicio } from '../scripts/lib/atajos';
import { PARES } from '../scripts/lotes/lote13-c2-borde';
import { rellenar, separacionExigible, expandir, patronesPublicados, evaluarMolde } from '../scripts/lib/pares-minimos';
import fs from 'node:fs';
import path from 'node:path';

const DIR = path.join(process.cwd(), 'lib/data/languages/pt/blocks');
const corpus: { id: string; type: string; data: unknown }[] = [];
for (const f of fs.readdirSync(DIR).filter((x) => /^b\d+\.json$/.test(x)).sort())
  for (const ex of JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'))) corpus.push(ex);
const publicados = [...patronesPublicados(corpus).values()];
const items = expandir(PARES, { semilla: 'lote13-c2-borde-e2-14', publicados });

// La glosa, tal y como la declara HOY el generador.
const GLOSA: Record<string, boolean> = {};
for (const p of PARES) {
  const buena = p.id === 'P-03' ? undefined : false;
  GLOSA[rellenar(p.esqueleto, p.bien)] = buena ?? true;
  GLOSA[rellenar(p.esqueleto, p.mal)] = buena ?? false;
}
const ITEMS: (ItemJuicio & { parId: string })[] = items.map((x, i) => ({
  id: x.id, pos: i, verdict: x.verdict, sentence: x.sentence, glosaEsCorrecta: GLOSA[x.sentence], parId: x.parId,
}));
const N = ITEMS.length;
const line = (s = '') => console.log(s);

line('==================== 1 · EL LOTE, TAL CUAL SE GENERA HOY ====================');
for (const x of ITEMS)
  line(`${x.id} pos=${(x.pos ?? 0) + 1} par=${x.parId} ${x.verdict ? 'BIEN' : 'MAL '} | pal=${x.sentence.trim().split(/\s+/).length} car=${x.sentence.length} | glosa=${x.glosaEsCorrecta ? 'CORRECTA' : 'incorrecta'} | ${x.sentence}`);
line(`patrón: ${ITEMS.map((x) => (x.verdict ? 'B' : 'M')).join('')} · N=${N}`);
line();

line('==================== 2 · EL GATE BINOMIAL A N=4: NO EXISTE ====================');
const kCrit = (n: number, alfa = SOSPECHOSO) => { for (let k = Math.ceil(n / 2); k <= n; k++) if (pValor(k, n) < alfa) return k; return n + 1; };
line('| N | p de un rasgo PERFECTO (N/N) | k mínimo para p<0,05 | ¿el gate puede rechazar? |');
line('|---|---|---|---|');
for (const n of [2, 4, 5, 6, 8, 10, 12, 16, 24]) {
  const k = kCrit(n);
  line(`| ${n} | ${pValor(n, n).toFixed(4)} | ${k > n ? '—' : `${k}/${n}`} | ${k > n ? '**NO. Ningún rasgo puede bloquear, ni acertando el 100 %**' : 'sí'} |`);
}
line();
const comb = (a: number, b: number) => { let r = 1; for (let i = 0; i < b; i++) r = (r * (a - i)) / (i + 1); return r; };
const pmf = (k: number, n: number, q: number) => comb(n, k) * q ** k * (1 - q) ** (n - k);
const potencia = (n: number, q: number) => { const k = kCrit(n); if (k > n) return 0; let p = 0; for (let i = k; i <= n; i++) p += pmf(i, n, q); for (let i = 0; i <= n - k; i++) p += pmf(i, n, q); return p; };
line('POTENCIA = P(el gate dispara | el atajo acierta de verdad una fracción q de los ítems)');
line('| q | N=4 | N=6 | N=12 | N=16 | N=24 |');
line('|---|---|---|---|---|---|');
for (const q of [0.667, 0.75, 0.8, 0.833, 0.9, 0.95, 1.0])
  line(`| ${(q * 100).toFixed(1)} % | ${[4, 6, 12, 16, 24].map((n) => (potencia(n, q) * 100).toFixed(1) + ' %').join(' | ')} |`);
line();
for (const n of [4, 6, 12, 16, 24]) {
  let qmin = -1;
  for (let q = 0.5; q <= 1.0001; q += 0.001) if (potencia(n, q) >= 0.8) { qmin = q; break; }
  line(`N=${n}: fuerza mínima detectable con potencia 0,80 → ${qmin < 0 ? 'NINGUNA (el gate no puede rechazar)' : (qmin * 100).toFixed(1) + ' %'}`);
}
line();

line('==================== 3 · TECHO DE CADA RASGO BAJO EL DISEÑO DE PARES ====================');
line('| rasgo | difiere en P-02 | P-03 | techo | ¿puede disparar? |');
line('|---|---|---|---|---|');
for (const r of RASGOS) {
  const dif = PARES.map((p) => {
    const b = ITEMS.find((x) => x.parId === p.id && x.verdict)!;
    const m = ITEMS.find((x) => x.parId === p.id && !x.verdict)!;
    return r.f(b, ITEMS) !== r.f(m, ITEMS) ? 'SÍ' : 'no';
  });
  const techo = N / 2 + dif.filter((d) => d === 'SÍ').length;
  line(`| ${r.nombre.slice(0, 60)} | ${dif.join(' | ')} | ${techo}/${N} | ${techo >= kCrit(N) ? 'sí' : '**NO — imposible por construcción**'} |`);
}
line();

line('==================== 4 · BARRIDO MECÁNICO EXHAUSTIVO ====================');
const toks = (s: string) => s.toLowerCase().replace(/[.,;:«»]/g, '').split(/\s+/).filter(Boolean);
const vocab = new Set<string>(); for (const x of ITEMS) for (const t of toks(x.sentence)) vocab.add(t);
const cands: { nombre: string; f: (x: ItemJuicio) => boolean }[] = [];
for (const t of [...vocab].sort()) cands.push({ nombre: `contiene el token «${t}»`, f: (x) => toks(x.sentence).includes(t) });
const grams = new Set<string>();
for (const x of ITEMS) { const s = x.sentence.toLowerCase(); for (let n = 2; n <= 6; n++) for (let i = 0; i + n <= s.length; i++) grams.add(s.slice(i, i + n)); }
for (const g of grams) cands.push({ nombre: `contiene «${g}»`, f: (x) => x.sentence.toLowerCase().includes(g) });
const bg = new Set<string>();
for (const x of ITEMS) { const t = toks(x.sentence); for (let i = 0; i + 1 < t.length; i++) bg.add(`${t[i]} ${t[i + 1]}`); }
for (const g of bg) cands.push({ nombre: `contiene el bigrama «${g}»`, f: (x) => x.sentence.toLowerCase().includes(g) });
for (const u of [10, 11, 12, 13, 14]) cands.push({ nombre: `tiene ≥ ${u} palabras`, f: (x) => x.sentence.trim().split(/\s+/).length >= u });
for (let u = 55; u <= 90; u++) cands.push({ nombre: `tiene ≥ ${u} caracteres`, f: (x) => x.sentence.length >= u });
for (let u = 1; u <= N; u++) cands.push({ nombre: `posición ≥ ${u} en el lote`, f: (x) => (x.pos ?? 0) + 1 >= u });
cands.push({ nombre: 'nº de caracteres par', f: (x) => x.sentence.length % 2 === 0 });
cands.push({ nombre: 'lleva guion intraléxico', f: (x) => /\p{L}-\p{L}/u.test(x.sentence) });
const filas = cands.map((c) => medirRasgo(c.nombre, c.f, ITEMS)).sort((a, b) => b.aciertos - a.aciertos);
line(`candidatos mecánicos probados: ${cands.length}`);
const perfectos = filas.filter((f) => f.aciertos === N);
line(`los que alcanzan ${N}/${N} (100 %): ${perfectos.length}`);
for (const f of perfectos.slice(0, 30)) line(`  ${N}/${N} · ${f.nombre} (${f.direccion}, presente en ${f.presentes}) — p=${pValor(f.aciertos, N).toFixed(4)}, NO bloquea`);
line();

line('==================== 5 · RASGOS DECLARADOS ====================');
const ESPEJO: Record<string, boolean> = {
  'GJ-01': true,  // «atrás meu» ← «detrás mío»
  'GJ-02': true,  // «visitar ao teu avô» ← «visitar a tu abuelo»
  'GJ-03': false, // «atrás do meu»: el default español coloquial es «detrás mío»
  'GJ-04': false, // el español obliga a «a tu abuelo»
};
const a = medirRasgo('espejo estructural del español', (x) => ESPEJO[x.id] === true, ITEMS);
line(`espejo estructural del español: **${a.aciertos}/${N}** (${Math.round(a.acierto * 100)} %) · ${a.direccion} · p=${pValor(a.aciertos, N).toFixed(4)} · ${pValor(a.aciertos, N) < SOSPECHOSO ? 'BLOQUEA' : 'NO BLOQUEA (el gate no puede a N=4)'}`);
for (const x of ITEMS) line(`   ${x.id} ${x.verdict ? 'BIEN' : 'MAL '} espejo=${ESPEJO[x.id]} → la regla «espejo ⇒ MAL» ${((ESPEJO[x.id] === true) === !x.verdict) ? 'ACIERTA' : 'falla'}`);
line();

line('==================== 6 · SEPARACIÓN Y FUGA POR EL `repair` ====================');
line(`separacionExigible(${N}) = ${separacionExigible(N)} · SEPARACION_MINIMA declarada = 3`);
const pos = new Map<string, number[]>();
ITEMS.forEach((x, i) => pos.set(x.parId, [...(pos.get(x.parId) ?? []), i]));
for (const [p, ps] of [...pos].sort()) line(`  par ${p}: posiciones ${ps.map((i) => i + 1).join(' y ')} → distancia ${ps[1]! - ps[0]!}`);
let fugas = 0;
for (const x of items) {
  if (x.verdict || !x.repair) continue;
  const iM = items.findIndex((y) => y.id === x.id);
  const iB = items.findIndex((y) => y.sentence === x.repair);
  if (iB > iM) { fugas++; line(`  FUGA: ${x.id} (MAL, pos ${iM + 1}) imprime como «Forma correcta» la frase de ${items[iB]!.id} (BIEN, pos ${iB + 1}) — ${iB - iM} cartas después`); }
}
line(`  ítems del lote regalados por el feedback de un ítem anterior: ${fugas} de ${N} (${Math.round((100 * fugas) / N)} %)`);
// ¿había órdenes sin fuga y con más separación?
const perms: { par: string; v: boolean }[][] = [];
const base = PARES.flatMap((p) => [{ par: p.id, v: true }, { par: p.id, v: false }]);
const permutar = (arr: typeof base, pre: typeof base = []) => { if (!arr.length) { perms.push(pre); return; } for (let i = 0; i < arr.length; i++) permutar([...arr.slice(0, i), ...arr.slice(i + 1)], [...pre, arr[i]!]); };
permutar(base);
const clave = (o: typeof base) => o.map((s) => `${s.par}${s.v ? 'B' : 'M'}`).join('|');
const vistos = new Set<string>(); let sinFuga = 0, tot = 0, sinFugaYMolde = 0;
for (const o of perms) {
  if (vistos.has(clave(o))) continue; vistos.add(clave(o)); tot++;
  const ok = PARES.every((p) => { const iB = o.findIndex((s) => s.par === p.id && s.v); const iM = o.findIndex((s) => s.par === p.id && !s.v); return iB < iM; });
  if (ok) { sinFuga++; if (!evaluarMolde(o.map((s) => (s.v ? 'B' : 'M')).join(''), publicados).length) sinFugaYMolde++; }
}
line(`  órdenes distintos: ${tot} · sin fuga (BIEN antes que su MAL en los dos pares): ${sinFuga} · y además con molde válido: ${sinFugaYMolde}`);
line();

line('==================== 7 · LA TABLA DE SOLAPE DEL MOLDE ====================');
line(`patrón: ${ITEMS.map((x) => (x.verdict ? 'B' : 'M')).join('')} · lotes publicados: ${publicados.length}`);
let comparados = 0;
for (const q of publicados) if (Math.min(N, q.length) >= 8) comparados++;
line(`lotes con los que el preflight LLEGA a comparar (necesita L≥8, y L=min(${N}, largo)): ${comparados}`);

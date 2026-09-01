// Medición del lote 13 — revisor pedagógico. No toca el repo.
import { RASGOS, medirRasgo, pValor, bateria, type ItemJuicio } from '../scripts/lib/atajos';
import { PARES } from '../scripts/lotes/lote13-c2-borde';
import { rellenar, separacionExigible, expandir, patronesPublicados } from '../scripts/lib/pares-minimos';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = '/Users/lalo/idiomas/portugues-app';
const DIR = path.join(ROOT, 'lib/data/languages/pt/blocks');
const corpus: { id: string; type: string; data: unknown }[] = [];
for (const f of fs.readdirSync(DIR).filter((x) => /^b\d+\.json$/.test(x)).sort())
  for (const ex of JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'))) corpus.push(ex);

const items = expandir(PARES, { semilla: 'lote13-c2-borde-e2-14', publicados: [...patronesPublicados(corpus).values()] });

// glosa declarada como en el doc
const GLOSA_OK: Record<string, boolean> = {};
for (const p of PARES) {
  const buena = p.id !== 'P-02';
  GLOSA_OK[rellenar(p.esqueleto, p.bien)] = buena;
  GLOSA_OK[rellenar(p.esqueleto, p.mal)] = buena;
}
const ITEMS: (ItemJuicio & { parId: string })[] = items.map((x, i) => ({
  id: x.id, pos: i, verdict: x.verdict, sentence: x.sentence, glosaEsCorrecta: GLOSA_OK[x.sentence], parId: x.parId,
}));

const line = (s = '') => console.log(s);

line('==================== 1 · EL LOTE, TAL CUAL SE GENERA ====================');
for (const x of ITEMS)
  line(`${x.id} pos=${x.pos} par=${x.parId} ${x.verdict ? 'BIEN' : 'MAL '} | pal=${x.sentence.trim().split(/\s+/).length} car=${x.sentence.length} | ${x.sentence}`);
line(`patrón: ${ITEMS.map((x) => (x.verdict ? 'B' : 'M')).join('')}`);
line();

line('==================== 2 · SEPARACIÓN DE LOS MIEMBROS DEL PAR ====================');
line(`SEPARACION_MINIMA (constante del módulo) = 3`);
for (const n of [6, 8, 12, 16, 20, 24]) line(`  separacionExigible(${n}) = ${separacionExigible(n)}`);
const pos = new Map<string, number[]>();
ITEMS.forEach((x, i) => pos.set(x.parId, [...(pos.get(x.parId) ?? []), i]));
for (const [p, ps] of [...pos].sort()) line(`  par ${p}: posiciones ${ps.map((i) => i + 1).join(' y ')} → distancia ${ps[1]! - ps[0]!}`);
line();

line('==================== 3 · POTENCIA DEL GATE BINOMIAL ====================');
const kCrit = (n: number, alfa = 0.05) => { for (let k = Math.ceil(n / 2); k <= n; k++) if (pValor(k, n) < alfa) return k; return n + 1; };
const kCrit2 = (n: number, alfa = 0.05) => { for (let k = Math.ceil(n / 2); k <= n; k++) if (2 * pValor(k, n) < alfa) return k; return n + 1; };
const comb = (a: number, b: number) => { let r = 1; for (let i = 0; i < b; i++) r = (r * (a - i)) / (i + 1); return r; };
const pmf = (k: number, n: number, q: number) => comb(n, k) * q ** k * (1 - q) ** (n - k);
const potencia = (n: number, q: number, k: number) => {
  let p = 0;
  for (let i = k; i <= n; i++) p += pmf(i, n, q);
  for (let i = 0; i <= n - k; i++) p += pmf(i, n, q);
  return p;
};
line('| N | k mínimo para p<0,05 (p una cola, como el repo) | p en ese k | k con p a DOS colas | falsa alarma por rasgo |');
line('|---|---|---|---|---|');
for (const n of [6, 8, 10, 12, 14, 16, 20, 24]) {
  const k = kCrit(n), k2 = kCrit2(n);
  line(`| ${n} | ${k}/${n} (${Math.round((100 * k) / n)} %) | ${pValor(k, n).toFixed(4)} | ${k2}/${n} | ${(2 * pValor(k, n)).toFixed(4)} |`);
}
line();
line('POTENCIA = P(el gate dispara | el atajo acierta de verdad una fracción q de los ítems)');
line('| q (fuerza real del atajo) | N=6 | N=12 | N=16 | N=24 |');
line('|---|---|---|---|---|');
for (const q of [0.6, 0.667, 0.7, 0.75, 0.8, 0.833, 0.875, 0.9, 0.95, 1.0]) {
  const c = [6, 12, 16, 24].map((n) => potencia(n, q, kCrit(n)));
  line(`| ${(q * 100).toFixed(1)} % | ${c.map((x) => (x * 100).toFixed(1) + ' %').join(' | ')} |`);
}
line();
for (const n of [6, 12, 16, 24]) {
  let qmin = 1;
  for (let q = 0.5; q <= 1.0001; q += 0.001) if (potencia(n, q, kCrit(n)) >= 0.8) { qmin = q; break; }
  line(`N=${n}: fuerza mínima del atajo detectable con potencia 0,80 → q = ${(qmin * 100).toFixed(1)} %`);
}
line();
line('FALSA ALARMA de la batería entera (13 rasgos), cota si fueran independientes:');
for (const n of [6, 12, 16, 24]) {
  const fa = 2 * pValor(kCrit(n), n);
  line(`  N=${n}: por rasgo ${(fa * 100).toFixed(2)} % → al menos uno de 13: ${((1 - (1 - fa) ** 13) * 100).toFixed(1)} %`);
}
line();

line('==================== 4 · QUÉ RASGOS PUEDEN SIQUIERA DISPARAR BAJO EL DISEÑO DE PARES ====================');
line('Un rasgo sólo alcanza 6/6 si DIFIERE entre los dos miembros en LOS TRES pares.');
line('| rasgo | difiere en P-01 | P-02 | P-03 | pares en que difiere | techo alcanzable |');
line('|---|---|---|---|---|---|');
for (const r of RASGOS) {
  const dif: string[] = [];
  for (const p of PARES) {
    const b = ITEMS.find((x) => x.parId === p.id && x.verdict)!;
    const m = ITEMS.find((x) => x.parId === p.id && !x.verdict)!;
    dif.push(r.f(b, ITEMS) !== r.f(m, ITEMS) ? 'SÍ' : 'no');
  }
  const nd = dif.filter((d) => d === 'SÍ').length;
  line(`| ${r.nombre.slice(0, 62)} | ${dif.join(' | ')} | ${nd}/3 | ${3 + nd}/6 |`);
}
line();

line('==================== 5 · TEST DE ALEATORIZACIÓN CONDICIONADO AL DISEÑO ====================');
line('Las 8 etiquetaciones posibles (cada par 1 BIEN + 1 MAL). ¿En cuántas dispara algún rasgo de los 13?');
let disparan = 0;
for (let mask = 0; mask < 8; mask++) {
  const alt = ITEMS.map((x) => {
    const idx = PARES.findIndex((p) => p.id === x.parId);
    const flip = (mask >> idx) & 1;
    return { ...x, verdict: flip ? !x.verdict : x.verdict };
  });
  const max = Math.max(...bateria(alt).map((a) => a.aciertos));
  const hit = max >= kCrit(6);
  if (hit) disparan++;
  line(`  máscara ${mask.toString(2).padStart(3, '0')} patrón ${alt.map((x) => (x.verdict ? 'B' : 'M')).join('')} → mejor rasgo ${max}/6 ${hit ? '⚠ DISPARA' : ''}`);
}
line(`→ la batería dispara en ${disparan}/8 de las etiquetaciones compatibles con el diseño`);
line();

line('==================== 6 · BARRIDO MECÁNICO EXHAUSTIVO ====================');
const toks = (s: string) => s.toLowerCase().normalize('NFC').replace(/[.,;:«»]/g, '').split(/\s+/).filter(Boolean);
const vocab = new Set<string>();
for (const x of ITEMS) for (const t of toks(x.sentence)) vocab.add(t);
const cands: { nombre: string; f: (x: ItemJuicio) => boolean }[] = [];
for (const t of [...vocab].sort()) cands.push({ nombre: `contiene el token «${t}»`, f: (x) => toks(x.sentence).includes(t) });
// n-gramas de caracteres 2..6
const grams = new Set<string>();
for (const x of ITEMS) { const s = x.sentence.toLowerCase(); for (let n = 2; n <= 6; n++) for (let i = 0; i + n <= s.length; i++) grams.add(s.slice(i, i + n)); }
for (const g of grams) cands.push({ nombre: `contiene «${g}»`, f: (x) => x.sentence.toLowerCase().includes(g) });
// bigramas de tokens
const bg = new Set<string>();
for (const x of ITEMS) { const t = toks(x.sentence); for (let i = 0; i + 1 < t.length; i++) bg.add(`${t[i]} ${t[i + 1]}`); }
for (const g of bg) cands.push({ nombre: `contiene el bigrama «${g}»`, f: (x) => x.sentence.toLowerCase().includes(g) });
// longitudes y umbrales
for (const u of [10, 11, 12, 13, 14]) cands.push({ nombre: `tiene ≥ ${u} palabras`, f: (x) => x.sentence.trim().split(/\s+/).length >= u });
for (let u = 55; u <= 90; u++) cands.push({ nombre: `tiene ≥ ${u} caracteres`, f: (x) => x.sentence.length >= u });
// posiciones
for (let u = 1; u <= 6; u++) cands.push({ nombre: `posición ≥ ${u}`, f: (x) => (x.pos ?? 0) + 1 >= u });
cands.push({ nombre: 'nº de palabras par', f: (x) => x.sentence.trim().split(/\s+/).length % 2 === 0 });
cands.push({ nombre: 'nº de caracteres par', f: (x) => x.sentence.length % 2 === 0 });
cands.push({ nombre: 'nº de «ao» ≥ 2', f: (x) => (x.sentence.toLowerCase().match(/(?<![\p{L}])ao(?![\p{L}])/gu) ?? []).length >= 2 });
cands.push({ nombre: 'nº de contracciones con «a» ≥ 2', f: (x) => (x.sentence.toLowerCase().match(/(?<![\p{L}])(ao|aos|à|às)(?![\p{L}])/gu) ?? []).length >= 2 });
cands.push({ nombre: 'lleva guion intraléxico', f: (x) => /\p{L}-\p{L}/u.test(x.sentence) });
cands.push({ nombre: 'posesivo desnudo (meu/teu/seu) sin preposición delante', f: (x) => /(?<![\p{L}])(?!do |da |de )\p{L}+\s+(meu|teu|seu|minha|tua|sua)(?![\p{L}])/iu.test(x.sentence) && !/(?<![\p{L}])(do|da|de|no|na)\s+(meu|teu|seu|minha|tua|sua)(?![\p{L}])/iu.test(x.sentence) });

const filas = cands.map((c) => ({ ...medirRasgo(c.nombre, c.f, ITEMS), })).sort((a, b) => b.aciertos - a.aciertos);
const seis = filas.filter((f) => f.aciertos === 6);
line(`candidatos mecánicos probados: ${cands.length}`);
line(`los que alcanzan 6/6: ${seis.length}`);
for (const f of seis.slice(0, 40)) line(`  6/6 · ${f.nombre} (${f.direccion}, presente en ${f.presentes})`);
const cinco = filas.filter((f) => f.aciertos === 5);
line(`los que alcanzan 5/6: ${cinco.length}`);
for (const f of cinco.slice(0, 25)) line(`  5/6 · ${f.nombre} (${f.direccion}, presente en ${f.presentes})`);
line();

line('==================== 7 · RASGOS DECLARADOS (juicio, como la glosa) ====================');
// Cada uno se declara ítem a ítem, igual que glosaEsCorrecta.
const DECL: Record<string, Record<string, boolean>> = {
  // ¿La frase portuguesa es el CALCO ESTRUCTURAL de lo que el hispanohablante
  // produce por defecto para ese contenido? (no «¿la glosa es español bueno?»)
  'espejo estructural del español (lo que el hispanohablante produciría)': {
    'GJ-01': true,  // «atrás meu» ← «detrás mío»
    'GJ-02': false, // «atrás do meu» ← «detrás del mío», no es el default
    'GJ-03': false, // el español obliga a «le dijo»
    'GJ-04': false, // el español obliga a «a tu abuelo»
    'GJ-05': true,  // «visitar ao teu avô» ← «visitar a tu abuelo»
    'GJ-06': true,  // «disse-lhe ao director» ← «le dijo al director»
  },
  // La glosa cognada RE-DECLARADA con la convención que usa un alumno real:
  // «o teu avô» → «tu abuelo» (el alumno ya sabe que el artículo no se copia)
  'glosa cognada con el artículo posesivo normalizado': {
    'GJ-01': true,  // «detrás mío» — correcto (extendido)
    'GJ-02': true,  // «detrás del mío»
    'GJ-03': true,  // «dijo al director»
    'GJ-04': false, // «visitar tu abuelo» — falta la «a» personal
    'GJ-05': true,  // «visitar a tu abuelo»
    'GJ-06': true,  // «le dijo al director»
  },
  'es el miembro MÁS LARGO de su par (sólo visible si ves los dos)': {
    'GJ-01': false, 'GJ-02': true, 'GJ-03': false, 'GJ-04': false, 'GJ-05': true, 'GJ-06': true,
  },
  'lleva una pieza funcional DE MÁS pegada a un argumento humano': {
    'GJ-01': false, 'GJ-02': false, 'GJ-03': false, 'GJ-04': false, 'GJ-05': true, 'GJ-06': true,
  },
};
line('| rasgo declarado | acierto | dirección | presente en | p (repo, 1 cola) | p (2 colas) |');
line('|---|---|---|---|---|---|');
for (const [nombre, tabla] of Object.entries(DECL)) {
  const a = medirRasgo(nombre, (x) => tabla[x.id] === true, ITEMS);
  line(`| ${nombre} | **${a.aciertos}/6** (${Math.round(a.acierto * 100)} %) | ${a.direccion} | ${a.presentes} | ${pValor(a.aciertos, 6).toFixed(4)} | ${(2 * pValor(a.aciertos, 6)).toFixed(4)} |`);
}
line();

line('==================== 8 · TASA BASE DEL «ESPEJO» EN LOS JUICIOS YA PUBLICADOS ====================');
const gj = corpus.filter((x) => x.type === 'grammaticality_judgment');
line(`juicios publicados: ${gj.length}`);
const porLote = new Map<string, number>();
for (const x of gj) { const m = x.id.match(/^b2c2-gj-(?:(l\d+)-)?\d+$/); porLote.set(m?.[1] ?? 'piloto', (porLote.get(m?.[1] ?? 'piloto') ?? 0) + 1); }
line([...porLote].sort().map(([k, v]) => `${k}=${v}`).join(' · '));

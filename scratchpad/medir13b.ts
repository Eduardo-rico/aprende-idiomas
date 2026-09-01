import { evaluarMolde, patronesPublicados, separacionExigible } from '../scripts/lib/pares-minimos';
import { medirRasgo, pValor, type ItemJuicio } from '../scripts/lib/atajos';
import fs from 'node:fs';
import path from 'node:path';

const DIR = path.join(process.cwd(), 'lib/data/languages/pt/blocks');
const corpus: { id: string; type: string; data: unknown }[] = [];
for (const f of fs.readdirSync(DIR).filter((x) => /^b\d+\.json$/.test(x)).sort())
  for (const ex of JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'))) corpus.push(ex);
const publicados = [...patronesPublicados(corpus).values()];
const line = (s = '') => console.log(s);

line('===== A · ¿EXISTE UN ORDEN CON SEPARACIÓN 3 QUE PASE EL MOLDE? (N=6) =====');
line(`separacionExigible(6) = ${separacionExigible(6)} · SEPARACION_MINIMA declarada = 3`);
const idsP = ['P-01', 'P-02', 'P-03'];
type Slot = { par: string; v: boolean };
const perms: Slot[][] = [];
const base: Slot[] = idsP.flatMap((p) => [{ par: p, v: true }, { par: p, v: false }]);
const permutar = (arr: Slot[], pre: Slot[] = []) => {
  if (!arr.length) { perms.push(pre); return; }
  for (let i = 0; i < arr.length; i++) permutar([...arr.slice(0, i), ...arr.slice(i + 1)], [...pre, arr[i]!]);
};
permutar(base);
const distancias = (o: Slot[]) => idsP.map((p) => { const ix = o.flatMap((s, i) => (s.par === p ? [i] : [])); return ix[1]! - ix[0]!; });
const vistos = new Set<string>();
let okSep3 = 0, total = 0;
const ejemplos: string[] = [];
for (const o of perms) {
  const clave = o.map((s) => `${s.par}${s.v ? 'B' : 'M'}`).join('|');
  if (vistos.has(clave)) continue;
  vistos.add(clave);
  total++;
  const pat = o.map((s) => (s.v ? 'B' : 'M')).join('');
  const d = distancias(o);
  if (Math.min(...d) >= 3 && !evaluarMolde(pat, publicados).length) {
    okSep3++;
    if (ejemplos.length < 8) ejemplos.push(`${pat}  (${o.map((s) => s.par).join(' ')})  distancias ${d.join(',')}`);
  }
}
line(`órdenes distintos: ${total}`);
line(`órdenes con separación ≥3 EN LOS TRES PARES y molde válido: ${okSep3}`);
for (const e of ejemplos) line(`  ${e}`);
const conAdy = [...vistos].length;
let ady0 = 0, ady1 = 0, ady2 = 0, ady3 = 0;
vistos.clear();
for (const o of perms) {
  const clave = o.map((s) => `${s.par}${s.v ? 'B' : 'M'}`).join('|');
  if (vistos.has(clave)) continue; vistos.add(clave);
  const n = distancias(o).filter((x) => x === 1).length;
  if (n === 0) ady0++; else if (n === 1) ady1++; else if (n === 2) ady2++; else ady3++;
}
line(`reparto de pares ADYACENTES sobre los ${conAdy} órdenes: 0→${ady0} · 1→${ady1} · 2→${ady2} · 3→${ady3}`);
line(`el lote elegido tiene 2 pares adyacentes (P-03 en 1-2, P-02 en 4-5)`);
line();

line('===== B · SENSIBILIDAD DEL 6/6: ¿cuánto aguanta una declaración discutida? =====');
const S = [
  'O carro dele ficou estacionado atrás meu durante toda a tarde.',
  'O carro dele ficou estacionado atrás do meu durante toda a tarde.',
  'O advogado disse ao director que a proposta seguia por correio registado.',
  'Fomos visitar o teu avô ao lar, mas ele já estava a dormir.',
  'Fomos visitar ao teu avô ao lar, mas ele já estava a dormir.',
  'O advogado disse-lhe ao director que a proposta seguia por correio registado.',
];
const V = [false, true, true, true, false, false];
const ITEMS: ItemJuicio[] = S.map((s, i) => ({ id: `GJ-0${i + 1}`, pos: i, verdict: V[i]!, sentence: s }));
const ESPEJO = [true, false, false, false, true, true];
const medir = (tabla: boolean[]) => {
  const a = medirRasgo('espejo', (x) => tabla[Number(x.id.slice(3)) - 1] === true, ITEMS);
  return { k: a.aciertos, p: pValor(a.aciertos, 6), dir: a.direccion };
};
const b0 = medir(ESPEJO);
line(`declaración base: ${b0.k}/6 · p=${b0.p.toFixed(4)} (${b0.dir})`);
for (let i = 0; i < 6; i++) {
  const t = [...ESPEJO]; t[i] = !t[i];
  const r = medir(t);
  line(`  si se voltea la declaración de GJ-0${i + 1}: ${r.k}/6 · p=${r.p.toFixed(4)} → ${r.p < 0.05 ? 'SIGUE BLOQUEANDO' : 'ya NO bloquea'}`);
}
line();

line('===== C · ¿DÓNDE SE ENSEÑA YA CADA FENÓMENO? (nivel real) =====');
const bloqueNivel: Record<number, string> = { 1: 'A1', 2: 'A2', 3: 'A2', 4: 'B1', 5: 'B1', 6: 'B2', 7: 'B2', 8: 'B2', 9: 'A2', 10: 'B1', 11: 'C1', 12: 'C2' };
const buscar = (nombre: string, re: RegExp) => {
  const hits: { id: string; b: number; type: string; frag: string }[] = [];
  for (const ex of corpus) {
    const s = JSON.stringify((ex as any).data ?? {});
    const m = s.match(re);
    if (m) hits.push({ id: ex.id, b: (ex as any).blockId, type: ex.type, frag: m[0].slice(0, 70) });
  }
  const porB = new Map<number, number>();
  for (const h of hits) porB.set(h.b, (porB.get(h.b) ?? 0) + 1);
  line(`${nombre}: ${hits.length} ítems · bloques ${[...porB].sort((a, b) => a[0] - b[0]).map(([b, n]) => `b${b}(${bloqueNivel[b] ?? '?'})=${n}`).join(' ')}`);
  for (const h of hits.slice(0, 4)) line(`    ${h.id} b${h.b} ${h.type}: ${h.frag}`);
};
buscar('«a» personal (mención explícita)', /a personal|«a» personal|preposici[oó]n .{0,20}objeto directo|objeto directo .{0,25}sin preposici[oó]n/i);
buscar('duplicación / doblado del clítico', /duplic\w+ (el|o) cl[ií]tico|doblado del cl[ií]tico|le dijo a/i);
buscar('posesivo tras adverbio de lugar', /atr[aá]s d[eo]|à frente d[ea]|detr[aá]s d[eo]|ao lado d[eo] m/i);
line();

line('===== D · PUNTOS DECLARADOS DEL CURRÍCULO PARA b12-borde =====');
const curr = fs.readFileSync(path.join(process.cwd(), 'lib/data/languages/pt/curriculum.ts'), 'utf8');
const m = curr.match(/id: 'b12-borde-gramaticalidad'[^}]*}/);
line(m?.[0] ?? '(no encontrado)');

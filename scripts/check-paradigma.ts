// scripts/check-paradigma.ts
//
//   npx tsx scripts/check-paradigma.ts <doc.md>
//
// El gate de la familia industrial de PARADIGMA. Su trabajo es no
// creerse al autor: cada ítem declara de qué derivación sale su
// respuesta, y el gate **la recalcula** con `scripts/lib/paradigma-pt.ts`
// (12 tests) y la compara. Si el documento y el conjugador discrepan,
// gana el conjugador y cae el ítem.
//
// Más los controles de lote que la familia de mediación ya pagó: reparto
// de la clave, proporción de ítems de CONTRASTE (donde la forma marcada
// es la incorrecta), y que ningún distractor sea la respuesta.
import fs from 'node:fs';
import { futuro, condicional, futuroComposto, mesoclise, participio, type Persona, type Clitico } from './lib/paradigma-pt';

const DOC = process.argv[2];
if (!DOC) { console.error('uso: check-paradigma.ts <doc.md>'); process.exit(2); }
const txt = fs.readFileSync(DOC, 'utf8');

interface Item {
  id: string; tipo: string; punto: string; contraste: boolean;
  derivacion?: string; declarada?: string;
  frase: string; opciones: string[]; correctIndex: number; respuesta?: string; glosa: string;
}

const items: Item[] = [];
for (const sec of txt.split(/\n### /).slice(1)) {
  const cab = sec.split('\n')[0]!;
  const m = cab.match(/^PAR-(\d+)\s+·\s+(\w+)\s+·\s+(.+)$/);
  if (!m) continue;
  const contexto = m[3]!;
  const der = sec.match(/\*\*derivación:\*\*\s*`([^`]+)`\s*→\s*\*\*([^*]+)\*\*/);
  const opcLinea = sec.match(/\*\*opciones:\*\*\s*([^\n]+)/)?.[1] ?? '';
  const opciones: string[] = []; let correctIndex = -1;
  for (const t of opcLinea.split(' · ')) {
    const om = t.match(/\[(\d)\]\s*(.+)$/); if (!om) continue;
    const i = Number(om[1]); let e = om[2]!.trim();
    if (/✅/.test(e)) correctIndex = i;
    opciones[i] = e.replace(/✅/g, '').replace(/\*\*/g, '').trim();
  }
  items.push({
    id: `PAR-${m[1]}`, tipo: m[2]!, contraste: /CONTRASTE|CON ATRACTOR/i.test(contexto),
    punto: Number(m[1]) <= 12 ? 'b5-futcomp-composto-real' : 'b8-coloc-mesoclise',
    derivacion: der?.[1], declarada: der?.[2]?.trim(),
    frase: (sec.match(/\*\*frase:\*\*\s*«([\s\S]*?)»/)?.[1] ?? '').replace(/\s+/g, ' ').trim(),
    opciones, correctIndex,
    respuesta: sec.match(/\*\*respuesta:\*\*\s*`([^`]+)`/)?.[1],
    glosa: (sec.match(/\*\*glosa:\*\*\s*([\s\S]*?)(?=\n\n|\n### |$)/)?.[1] ?? '').replace(/\s+/g, ' ').trim(),
  });
}

/** Recalcula la derivación declarada. No se hace `eval`: se parsea la
 *  llamada, porque el documento es un dato, no código. */
/** Comparación de formas: la mayúscula que ABRE la frase no es una
 *  diferencia de paradigma. «Dir-te-ei» al principio de la oración es la
 *  misma forma que «dir-te-ei». */
const mismaForma = (a: string, b: string) =>
  a.replace(/^./, (c) => c.toLowerCase()) === b.replace(/^./, (c) => c.toLowerCase());

function recalcular(expr: string): string {
  const m = expr.match(/^(\w+)\(([^)]*)\)$/);
  if (!m) throw new Error(`derivación ilegible: ${expr}`);
  const fn = m[1]!;
  const args = m[2]!.split(',').map((a) => a.trim().replace(/^'|'$/g, ''));
  switch (fn) {
    case 'futuro': return futuro(args[0]!, args[1] as Persona);
    case 'condicional': return condicional(args[0]!, args[1] as Persona);
    case 'participio': return participio(args[0]!);
    case 'futuroComposto': return futuroComposto(args[0]!, args[1] as Persona);
    case 'mesoclise': return mesoclise(args[0]!, args[1] as Clitico, args[2] as Persona, (args[3] as 'futuro' | 'condicional') ?? 'futuro');
    default: throw new Error(`derivación desconocida: ${fn}`);
  }
}

console.log(`ítems parseados: ${items.length}\n`);
let fallos = 0;
for (const x of items) {
  const problemas: string[] = [];

  // Gate 1 · la forma la decide el CONJUGADOR, no el autor.
  if (x.derivacion) {
    let calc = '';
    try { calc = recalcular(x.derivacion); } catch (e) { problemas.push(String((e as Error).message)); }
    if (calc && x.declarada && !mismaForma(calc, x.declarada)) {
      problemas.push(`el documento declara «${x.declarada}» pero el paradigma da «${calc}»`);
    }
    if (calc && x.respuesta && !mismaForma(calc, x.respuesta)) {
      problemas.push(`la respuesta dice «${x.respuesta}» pero el paradigma da «${calc}»`);
    }
    // Antes esta comprobación se saltaba en los ítems de CONTRASTE, y por
    // ese hueco entraron los dos errores reales que el muestreo encontró:
    // **10 de los 24 no pasaban por el conjugador**. Ahora, si el ítem
    // declara su derivación, se comprueba siempre — un ítem de contraste
    // también tiene una forma correcta, sólo que de otra función.
    if (calc && x.opciones.length && x.correctIndex >= 0 && !mismaForma(x.opciones[x.correctIndex] ?? '', calc)) {
      problemas.push(`la clave es «${x.opciones[x.correctIndex]}» y el paradigma da «${calc}»`);
    }
  }

  // Gate 2 · higiene del ítem.
  if (x.tipo === 'multiple_choice') {
    if (x.opciones.length !== 4) problemas.push(`${x.opciones.length} opciones, la familia pide 4`);
    if (x.correctIndex < 0) problemas.push('ninguna opción marcada con ✅');
    if (new Set(x.opciones).size !== x.opciones.length) problemas.push('opciones repetidas');
  }
  if (x.tipo === 'fill_blank' && !x.respuesta) problemas.push('sin respuesta declarada');
  if (!x.frase) problemas.push('sin frase');
  if (!x.glosa) problemas.push('sin glosa');
  if (x.frase && x.tipo === 'fill_blank' && !x.frase.includes('___')) problemas.push('la frase no tiene hueco «___»');

  if (problemas.length) { fallos += problemas.length; console.log(`  ✗ ${x.id}`); for (const p of problemas) console.log(`      ${p}`); }
  else console.log(`  ✔ ${x.id}  ${x.tipo.padEnd(15)} ${x.contraste ? 'CONTRASTE' : 'directo  '}  ${x.declarada ?? x.opciones[x.correctIndex] ?? ''}`);
}

// ── Auditoría de lote ────────────────────────────────────────────────
const mc = items.filter((x) => x.tipo === 'multiple_choice');
const pos = [0, 0, 0, 0];
for (const x of mc) if (x.correctIndex >= 0) pos[x.correctIndex] = (pos[x.correctIndex] ?? 0) + 1;
console.log(`\n── auditoría del lote ──`);
console.log(`reparto de la clave en los ${mc.length} multiple_choice: ${pos.join(' / ')}`);
for (const punto of ['b5-futcomp-composto-real', 'b8-coloc-mesoclise']) {
  const xs = items.filter((x) => x.punto === punto);
  const c = xs.filter((x) => x.contraste).length;
  console.log(`${punto}: ${xs.length} ítems, ${c} de CONTRASTE (${Math.round(c / xs.length * 100)} %)`);
  // Si NUNCA gana la forma marcada, el alumno aprende «elige la rara».
  if (c === 0) { fallos++; console.log(`  ✗ sin ítems de contraste: se acierta eligiendo siempre la forma marcada`); }
  if (c === xs.length) { fallos++; console.log(`  ✗ TODOS son de contraste: se acierta eligiendo siempre la otra`); }
}
if (mc.length >= 8 && Math.max(...pos) - Math.min(...pos) > Math.ceil(mc.length / 3)) {
  fallos++; console.log(`  ✗ la clave se reparte ${pos.join('/')} — se acierta por posición`);
}

console.log(fallos ? `\n✗ ${fallos} fallos` : '\n✔ el gate del paradigma, limpio');
process.exit(fallos ? 1 : 0);

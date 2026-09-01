// scripts/cola-dictamen.ts — la cola de los que SÍ hacen falta.
//
//   npx tsx scripts/cola-dictamen.ts            # la cola entera
//   npx tsx scripts/cola-dictamen.ts 100        # el primer tramo
//
// De los 879 ítems sin dictamen, 595 eran excedente y están en cuarentena.
// Los otros 284 cubren déficit real, así que hay que dictaminarlos: son el
// trabajo que sirve a las dos líneas a la vez —cierra triaje y cierra
// cobertura—, y por eso van primero.
//
// Se ordenan por CUÁNTO déficit desbloquea cada uno: el que cubre tres
// puntos flacos vale más que el que cubre uno, y un punto a 1/8 pesa más
// que uno a 7/8. Así, si la cola se corta por la mitad, la mitad leída es
// la que más cierra.
import fs from 'node:fs';
import path from 'node:path';
import { ALL_CONCEPTS } from '../lib/data/languages/pt/curriculum';
import { CONCEPTOS_FINOS } from '../lib/data/languages/pt/conceptos-finos.generated';
import { BLOCKS_DIR } from './config';
import { contarPuntos, padreCubierto, pisoCero, conPisoCero, conPadreCubierto } from './lib/conceptos-finos';

const N = Number(process.argv[2] ?? 0);
const items = fs.readdirSync(BLOCKS_DIR).filter((x) => /^b\d+\.json$/.test(x)).sort()
  .flatMap((f) => JSON.parse(fs.readFileSync(path.join(BLOCKS_DIR, f), 'utf8')) as any[]);
const servible = (x: any) => x.variantStatus !== 'needs-human';
const sellado = (x: any) => x.variantStatus === 'neutral' || x.variantStatus === 'divergent';
// ESCUCHA no entra en una cola de dictamen: espera el oído de Edu.
const esEscucha = (x: any) => /par mínimo|Escucha/i.test(String(x.variantVerificacion ?? ''));

const cuentaDe = (xs: any[]) => {
  const { cuenta } = contarPuntos(xs);
  for (const c of [...ALL_CONCEPTS, ...CONCEPTOS_FINOS]) if (!cuenta.has(c.id)) cuenta.set(c.id, 0);
  return cuenta;
};
const conSello = cuentaDe(items.filter((x) => servible(x) && sellado(x)));
const piso = conPadreCubierto(conPisoCero((id: string) => (id.startsWith('b12') ? 6 : 8), pisoCero()), conSello);
const falta = new Map<string, number>();
for (const [id, n] of conSello) { const f = piso(id) - n; if (f > 0) falta.set(id, f); }

const pendientes = items.filter((x) => servible(x) && !sellado(x) && !esEscucha(x));
// Greedy: se elige el que más déficit cubre, y se recalcula. Es el mismo
// criterio con el que se decidió qué NO era excedente, así que la cola y
// la cuarentena no pueden discrepar.
const pend = new Map(falta);
const cola: { x: any; cubre: string[] }[] = [];
for (;;) {
  let mejor: any = null, mejorPts: string[] = [];
  for (const x of pendientes) {
    if (cola.some((c) => c.x === x)) continue;
    const pts = ((x.concepts ?? []) as string[]).filter((p) => pend.get(p));
    if (pts.length > mejorPts.length) { mejor = x; mejorPts = pts; }
  }
  if (!mejor) break;
  cola.push({ x: mejor, cubre: mejorPts });
  for (const p of mejorPts) { const v = pend.get(p)!; if (v <= 1) pend.delete(p); else pend.set(p, v - 1); }
}

const tramo = N ? cola.slice(0, N) : cola;
console.log(`# Cola de dictamen — ${cola.length} ítems${N ? ` (tramo de ${tramo.length})` : ''}\n`);
console.log(`Cubren **${[...falta.values()].reduce((a, b) => a + b, 0) - [...pend.values()].reduce((a, b) => a + b, 0)}** unidades de déficit en ${falta.size} puntos.`);
console.log(`Quedan **${[...pend.values()].reduce((a, b) => a + b, 0)}** unidades que ningún ítem viejo cubre: hay que producirlas.\n`);
console.log('| # | id | tipo | bloque | puntos que desbloquea |');
console.log('|---:|---|---|---:|---|');
tramo.forEach((c, i) => console.log(`| ${i + 1} | \`${c.x.id}\` | ${c.x.type} | ${c.x.blockId} | ${c.cubre.join(', ')} |`));

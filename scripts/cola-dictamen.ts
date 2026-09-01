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
import { servibleAlAlumno, selladoDeVariante, esDeEscucha } from './lib/estado-item';
import { contarPuntos, padreCubierto, pisoCero, conPisoCero, conPadreCubierto } from './lib/conceptos-finos';

const N = Number(process.argv[2] ?? 0);
const CON_TEXTO = process.argv.includes('--texto');
const DESDE = Number(process.argv[process.argv.indexOf('--desde') + 1] ?? 0) || 0;
const items = fs.readdirSync(BLOCKS_DIR).filter((x) => /^b\d+\.json$/.test(x)).sort()
  .flatMap((f) => JSON.parse(fs.readFileSync(path.join(BLOCKS_DIR, f), 'utf8')) as any[]);
const servible = servibleAlAlumno;
const sellado = selladoDeVariante;
// ESCUCHA no entra en una cola de dictamen: espera el oído de Edu.
const esEscucha = esDeEscucha;

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

const tramo = N ? cola.slice(DESDE, DESDE + N) : cola.slice(DESDE);
console.log(`# Cola de dictamen — ${cola.length} ítems${N ? ` (tramo de ${tramo.length})` : ''}\n`);
console.log(`Cubren **${[...falta.values()].reduce((a, b) => a + b, 0) - [...pend.values()].reduce((a, b) => a + b, 0)}** unidades de déficit en ${falta.size} puntos.`);
console.log(`Quedan **${[...pend.values()].reduce((a, b) => a + b, 0)}** unidades que ningún ítem viejo cubre: hay que producirlas.\n`);
if (!CON_TEXTO) {
  console.log('| # | id | tipo | bloque | puntos que desbloquea |');
  console.log('|---:|---|---|---:|---|');
  tramo.forEach((c, i) => console.log(`| ${DESDE + i + 1} | \`${c.x.id}\` | ${c.x.type} | ${c.x.blockId} | ${c.cubre.join(', ')} |`));
} else {
  // Con `--texto`, el ítem ENSAMBLADO: la frase con el hueco relleno y sin
  // el infinitivo del molde. Leer la plantilla en vez de lo que el alumno
  // ve es cómo dos barridos de esta ola dieron 0 hallazgos.
  const texto = (x: any) => {
    const d = x.data ?? {};
    let s2 = d.sentence ?? '';
    // El hueco se marca con «‹…›», no con corchetes: el volcado se copia a
    // mano al corregir, y un `[daquele]` pegado en `sentence` rompe la
    // cuenta de huecos. Lo cazó `verify:content` en el primer tramo.
    for (const b2 of (d.blanks ?? [])) s2 = s2.replace('___', `‹${b2.answer}›`);
    // TODOS los campos de texto, con su nombre. Volcar una selección fija
    // dejaba fuera `source` y `audioText`, y una traducción sin su origen
    // o una escucha sin su locución no se pueden dictaminar: se estaría
    // juzgando media frase.
    const partes: string[] = [];
    if (s2) partes.push(`sentence: ${s2}`);
    for (const [k, v] of Object.entries(d)) {
      if (k === 'sentence' || k === 'blanks') continue;
      if (typeof v === 'string' && v.trim()) partes.push(`${k}: ${v}`);
      else if (Array.isArray(v) && v.every((z) => typeof z === 'string') && v.length) partes.push(`${k}: [${v.join(' | ')}]`);
    }
    return partes.join('  ⟡  ').replace(/\s+/g, ' ').slice(0, 420);
  };
  tramo.forEach((c, i) => console.log(`${String(DESDE + i + 1).padStart(3)}. ${c.x.id} [${c.x.type}] {${c.cubre.join(', ')}}\n     ${texto(c.x)}\n`));
}

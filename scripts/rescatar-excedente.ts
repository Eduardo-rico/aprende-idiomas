// scripts/rescatar-excedente.ts — devuelve a la cola el excedente que ha
// dejado de sobrar.
//
//   npx tsx scripts/rescatar-excedente.ts             # dry-run
//   npx tsx scripts/rescatar-excedente.ts --aplicar
//
// El excedente se calculó con el corpus de ese momento: eran ítems cuyo
// punto llegaba al piso SIN ellos. Cuando el dictamen retira un ítem roto,
// su punto baja — y alguno de los aparcados vuelve a hacer falta.
//
// Devolverlo a `unchecked` para dictaminarlo es más barato que producir un
// reemplazo desde cero, y no cuesta nada comprobarlo: el invariante del
// test de cuarentena («retirar excedente no puede dejar ningún punto bajo
// su piso») lo detecta solo. Cuando ese test falla después de un tramo de
// dictamen, no está mal: está pidiendo esto.
import fs from 'node:fs';
import path from 'node:path';
import { ALL_CONCEPTS } from '../lib/data/languages/pt/curriculum';
import { CONCEPTOS_FINOS } from '../lib/data/languages/pt/conceptos-finos.generated';
import { BLOCKS_DIR } from './config';
import { contarPuntos, pisoCero, conPisoCero, conPadreCubierto } from './lib/conceptos-finos';
import { servibleAlAlumno, selladoDeVariante } from './lib/estado-item';

const APLICAR = process.argv.includes('--aplicar');
const ficheros = fs.readdirSync(BLOCKS_DIR).filter((x) => /^b\d+\.json$/.test(x)).sort();
const porFichero = new Map(ficheros.map((f) => [f, JSON.parse(fs.readFileSync(path.join(BLOCKS_DIR, f), 'utf8')) as any[]]));
const items = [...porFichero.values()].flat();
const esExcedente = (x: any) => String(x.variantVerificacion ?? '').includes('excedente sobre la cobertura');

const cuentaDe = (xs: any[]) => {
  const { cuenta } = contarPuntos(xs, { incluirCuarentena: true });
  for (const c of [...ALL_CONCEPTS, ...CONCEPTOS_FINOS]) if (!cuenta.has(c.id)) cuenta.set(c.id, 0);
  return cuenta;
};
const servibles = items.filter(servibleAlAlumno);
const hoy = cuentaDe(servibles);
const piso = conPadreCubierto(conPisoCero((id: string) => (id.startsWith('b12') ? 6 : 8), pisoCero()), hoy);

const cortos = new Map<string, number>();
for (const [id, n] of hoy) { const f = piso(id) - n; if (f > 0) cortos.set(id, f); }

// Se rescata el excedente que cubre un punto corto, uno a uno, hasta que
// el punto deja de estarlo. Nunca más de lo que hace falta.
const rescatados: any[] = [];
const pend = new Map(cortos);
for (const x of items.filter((y) => !servibleAlAlumno(y) && esExcedente(y))) {
  const pts = ((x.concepts ?? []) as string[]).filter((p) => pend.get(p));
  if (!pts.length) continue;
  rescatados.push(x);
  for (const p of pts) { const v = pend.get(p)!; if (v <= 1) pend.delete(p); else pend.set(p, v - 1); }
}

console.log('# Excedente que ha dejado de sobrar\n');
console.log(`Puntos por debajo del piso hoy: **${cortos.size}** (${[...cortos.values()].reduce((a, b) => a + b, 0)} unidades)`);
console.log(`Excedente rescatable: **${rescatados.length}** ítems`);
console.log(`Déficit que seguirá sin cubrir y hay que PRODUCIR: **${[...pend.values()].reduce((a, b) => a + b, 0)}** unidades en ${pend.size} puntos\n`);
for (const x of rescatados.slice(0, 20)) console.log(`- \`${x.id}\` (${(x.concepts ?? []).join(', ')})`);
if (rescatados.length > 20) console.log(`- …y ${rescatados.length - 20} más`);

if (!APLICAR) { console.log('\nDRY-RUN. Repite con --aplicar.'); process.exit(0); }
for (const x of rescatados) {
  x.variantStatus = 'unchecked';
  x.variantVerificacion = `${x.variantVerificacion} · RESCATADO en E2#22: su punto volvió a bajar del piso al retirarse un ítem roto`;
}
for (const [f, d] of porFichero) fs.writeFileSync(path.join(BLOCKS_DIR, f), JSON.stringify(d, null, 2) + '\n');
console.log(`\nRescatados ${rescatados.length} ítems: vuelven a la cola de dictamen.`);

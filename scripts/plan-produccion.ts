// scripts/plan-produccion.ts — qué producir, cuánto y con qué máquina.
//
//   npx tsx scripts/plan-produccion.ts
//   npx tsx scripts/plan-produccion.ts cloze     # sólo un formato
//
// Cambio de estrategia de E2#22, con los números del tramo 1 delante:
// **leer** rinde 27 unidades selladas por sesión y **producir** rinde
// 100-180, con gates, muestreo y sello automático. Y los ítems viejos sin
// sello se están sirviendo AHORA con un 55 % de error medido, así que cada
// sesión de lectura es una sesión más de material malo servido.
//
// El déficit que cuenta aquí es el de lo SELLADO: cuando un punto se cubre
// con material nuevo y sellado, sus ítems viejos sin leer pasan a ser
// excedente por definición y salen por la vía que ya existe —cuarentena
// con motivo, reversible, con el invariante de que ningún punto caiga.
// No hay que leerlos: la producción los vuelve innecesarios.
import fs from 'node:fs';
import path from 'node:path';
import { ALL_CONCEPTS } from '../lib/data/languages/pt/curriculum';
import { CONCEPTOS_FINOS } from '../lib/data/languages/pt/conceptos-finos.generated';
import { BLOCKS_DIR } from './config';
import { contarPuntos, pisoCero, conPisoCero, conPadreCubierto } from './lib/conceptos-finos';
import { servibleAlAlumno, selladoDeVariante } from './lib/estado-item';
import { formatoDe } from './lib/formato-punto';

const soloFormato = process.argv[2];
const items = fs.readdirSync(BLOCKS_DIR).filter((x) => /^b\d+\.json$/.test(x)).sort()
  .flatMap((f) => JSON.parse(fs.readFileSync(path.join(BLOCKS_DIR, f), 'utf8')) as any[]);

const cuentaDe = (xs: any[]) => {
  const { cuenta } = contarPuntos(xs, { incluirCuarentena: true });
  for (const c of [...ALL_CONCEPTS, ...CONCEPTOS_FINOS]) if (!cuenta.has(c.id)) cuenta.set(c.id, 0);
  return cuenta;
};
const sellado = cuentaDe(items.filter((x) => servibleAlAlumno(x) && selladoDeVariante(x)));
const piso = conPadreCubierto(conPisoCero((id: string) => (id.startsWith('b12') ? 6 : 8), pisoCero()), sellado);

// Cuántos ítems VIEJOS sin sello podrían cubrir cada punto. Es lo que
// decide si leer sale más barato que escribir.
const viejosPorPunto = new Map<string, number>();
for (const x of items) {
  if (!servibleAlAlumno(x) || selladoDeVariante(x)) continue;
  for (const p2 of (x.concepts ?? []) as string[]) viejosPorPunto.set(p2, (viejosPorPunto.get(p2) ?? 0) + 1);
}

// ── LA VÍA SE ELIGE POR PUNTO, no para todo el corpus ────────────────
//
// Producir cuesta más por unidad cuando el punto pide 2-3 que cuando pide
// 12: la máquina amortiza el molde, el ancla y la comprobación contra lo
// publicado en varios ítems de golpe. Y leer cuesta lo mismo por ítem
// siempre — 27 de cada 33 se salvan, medido en el tramo 1.
//
// Así que: mucho déficit ⇒ producir; poco déficit y con ítems viejos que
// lo cubran ⇒ leer ESOS (que son tres lecturas dirigidas, no una cola);
// sin ítems viejos ⇒ producir, que no hay alternativa.
const UMBRAL = 5;
const via = (falta: number, viejos: number) =>
  falta >= UMBRAL ? { v: 'producir', porque: `pide ${falta}: la máquina amortiza molde y ancla` }
  : viejos >= falta ? { v: 'leer', porque: `pide ${falta} y hay ${viejos} viejos que lo cubren: leerlos sale más barato que escribirlos` }
  : viejos > 0 ? { v: 'mixta', porque: `pide ${falta} y sólo hay ${viejos} viejos: leer ésos y producir ${falta - viejos}` }
  : { v: 'producir', porque: `pide ${falta} y no hay ningún ítem viejo que lo cubra` };

const filas = [...sellado].map(([id, n]) => {
  const falta = piso(id) - n, viejos = viejosPorPunto.get(id) ?? 0;
  return { id, n, falta, viejos, f: formatoDe(id), ...via(falta, viejos) };
})
  .filter((r) => r.falta > 0)
  .sort((a, b) => b.falta - a.falta || a.id.localeCompare(b.id));

const porFormato = new Map<string, { puntos: number; unidades: number }>();
for (const r of filas) {
  const o = porFormato.get(r.f.formato) ?? { puntos: 0, unidades: 0 };
  o.puntos++; o.unidades += r.falta; porFormato.set(r.f.formato, o);
}
const porVia = new Map<string, { puntos: number; unidades: number; itemsALeer: number }>();
for (const r of filas) {
  const o = porVia.get(r.v) ?? { puntos: 0, unidades: 0, itemsALeer: 0 };
  o.puntos++; o.unidades += r.falta;
  if (r.v === 'leer') o.itemsALeer += r.falta;
  if (r.v === 'mixta') o.itemsALeer += r.viejos;
  porVia.set(r.v, o);
}

if (!soloFormato) {
  console.log(`# Plan de producción — déficit de lo SELLADO Y SERVIBLE\n`);
  console.log(`Σ **${filas.reduce((a, r) => a + r.falta, 0)} unidades** en **${filas.length} puntos**.\n`);
  console.log('| formato | puntos | unidades |');
  console.log('|---|---:|---:|');
  for (const [f, o] of [...porFormato].sort((a, b) => b[1].unidades - a[1].unidades))
    console.log(`| **${f}** | ${o.puntos} | ${o.unidades} |`);
  console.log('\n## La vía, punto por punto\n');
  console.log('| vía | puntos | unidades | ítems viejos a leer |');
  console.log('|---|---:|---:|---:|');
  for (const [v, o] of [...porVia].sort((a, b) => b[1].unidades - a[1].unidades))
    console.log(`| **${v}** | ${o.puntos} | ${o.unidades} | ${o.itemsALeer || '—'} |`);
  console.log(`\nLa lectura dirigida son **${[...porVia.values()].reduce((a, o) => a + o.itemsALeer, 0)} ítems**, no 360: sólo los que un punto flaco reclama.`);
} else {
  const xs = filas.filter((r) => r.f.formato === soloFormato);
  console.log(`# ${soloFormato} — ${xs.reduce((a, r) => a + r.falta, 0)} unidades en ${xs.length} puntos\n`);
  console.log('| punto | sellado | falta | viejos | vía | por qué |');
  console.log('|---|---:|---:|---:|---|---|');
  for (const r of xs) console.log(`| \`${r.id}\` | ${r.n} | ${r.falta} | ${r.viejos} | **${r.v}** | ${r.porque} |`);
}

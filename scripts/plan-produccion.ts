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

const filas = [...sellado].map(([id, n]) => ({ id, n, falta: piso(id) - n, f: formatoDe(id) }))
  .filter((r) => r.falta > 0)
  .sort((a, b) => b.falta - a.falta || a.id.localeCompare(b.id));

const porFormato = new Map<string, { puntos: number; unidades: number }>();
for (const r of filas) {
  const o = porFormato.get(r.f.formato) ?? { puntos: 0, unidades: 0 };
  o.puntos++; o.unidades += r.falta; porFormato.set(r.f.formato, o);
}

if (!soloFormato) {
  console.log(`# Plan de producción — déficit de lo SELLADO Y SERVIBLE\n`);
  console.log(`Σ **${filas.reduce((a, r) => a + r.falta, 0)} unidades** en **${filas.length} puntos**.\n`);
  console.log('| formato | puntos | unidades |');
  console.log('|---|---:|---:|');
  for (const [f, o] of [...porFormato].sort((a, b) => b[1].unidades - a[1].unidades))
    console.log(`| **${f}** | ${o.puntos} | ${o.unidades} |`);
} else {
  const xs = filas.filter((r) => r.f.formato === soloFormato);
  console.log(`# ${soloFormato} — ${xs.reduce((a, r) => a + r.falta, 0)} unidades en ${xs.length} puntos\n`);
  console.log('| punto | sellado | falta | por qué este formato |');
  console.log('|---|---:|---:|---|');
  for (const r of xs) console.log(`| \`${r.id}\` | ${r.n} | ${r.falta} | ${r.f.motivo} |`);
}

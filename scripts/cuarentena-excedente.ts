// scripts/cuarentena-excedente.ts — retira de servicio el excedente sin
// dictamen.
//
//   npx tsx scripts/cuarentena-excedente.ts             # dry-run
//   npx tsx scripts/cuarentena-excedente.ts --aplicar   # escribe
//
// Decisión de E2#22: **no se paga por validar material que el curso no
// necesita, y no se sirve material que no hace falta y probablemente
// miente.** Los ítems sin dictamen cuyo punto llega al piso sin ellos son
// excedente; su tasa de error medida en ocho colas es del orden del 45 %,
// así que servirlos no es «más práctica»: es estudiar portugués mal
// escrito casi una de cada dos veces y que el FSRS hunda el dominio de lo
// que ya se sabe.
//
// NO se borra nada. Se pasan a `needs-human`, que `lib/data/loaders.ts`
// filtra en el embudo, con el motivo escrito en el propio ítem para que
// dentro de seis meses se pueda reconstruir por qué salió cada uno.
import fs from 'node:fs';
import path from 'node:path';
import { ALL_CONCEPTS } from '../lib/data/languages/pt/curriculum';
import { CONCEPTOS_FINOS } from '../lib/data/languages/pt/conceptos-finos.generated';
import { BLOCKS_DIR } from './config';
import { servibleAlAlumno, selladoDeVariante, esDeEscucha } from './lib/estado-item';
import { contarPuntos, padreCubierto, pisoCero, conPisoCero } from './lib/conceptos-finos';

const APLICAR = process.argv.includes('--aplicar');
const MOTIVO = 'excedente sobre la cobertura de su punto, sin dictamen (E2#22, 2026-09-01)';
const MOTIVO2 = 'excedente sobre la cobertura de su punto, sin dictamen que cubra variante (E2#22 segunda pasada, 2026-09-01)';

const ficheros = fs.readdirSync(BLOCKS_DIR).filter((x) => /^b\d+\.json$/.test(x)).sort();
const porFichero = new Map(ficheros.map((f) => [f, JSON.parse(fs.readFileSync(path.join(BLOCKS_DIR, f), 'utf8')) as any[]]));
const items = [...porFichero.values()].flat();

const servible = servibleAlAlumno;
// SELLADO tiene que significar lo MISMO aquí que en `sellar-familia-a.ts`
// y `sellar-familia-b.ts`. Tener `variantVerificacion` ya no basta: las
// colas 1 y 2 lo tienen y NO se sellaron, porque su dictamen no cubría
// variante. Si los tres scripts no comparten el criterio, uno manda a
// cuarentena lo que otro cuenta como cobertura.
const sellado = selladoDeVariante;
// ESCUCHA va por otra vía: espera el oído de Edu, no un dictamen de cola.
// Ni se sella ni se cuarentena aquí.
const esEscucha = esDeEscucha;
const piso = conPisoCero((id: string) => (id.startsWith('b12') ? 6 : 8), pisoCero());

const cuentaDe = (xs: any[]) => {
  const { cuenta } = contarPuntos(xs);
  // El inventario es el MISMO que el de `split-conceptos.ts`:
  // ALL_CONCEPTS **más** CONCEPTOS_FINOS. Con sólo el primero salían 72
  // donde el contador oficial dice 80 — dos cuentas de lo mismo con dos
  // cifras es la cicatriz de E2#16, repetida por mirar el inventario
  // corto.
  for (const c of [...ALL_CONCEPTS, ...CONCEPTOS_FINOS]) if (!cuenta.has(c.id)) cuenta.set(c.id, 0);
  for (const id of [...cuenta.keys()]) if (cuenta.get(id)! < piso(id) && padreCubierto(id, cuenta, piso)) cuenta.set(id, piso(id));
  return cuenta;
};
const deficitDe = (cuenta: Map<string, number>) =>
  [...cuenta].reduce((a, [id, n]) => a + Math.max(0, piso(id) - n), 0);

const antes = cuentaDe(items);
const selladoYServible = cuentaDe(items.filter((x) => servible(x) && sellado(x)));

// Greedy: se CONSERVA el ítem sin sello que más déficit cubre, hasta que
// no quede déficit cubrible. El resto es excedente.
const pend = new Map<string, number>();
for (const [id, n] of selladoYServible) { const f = piso(id) - n; if (f > 0) pend.set(id, f); }
const sinSello = items.filter((x) => servible(x) && !sellado(x) && !esEscucha(x));
const conservar = new Set<any>();
for (;;) {
  let mejor: any = null, mejorN = 0;
  for (const x of sinSello) {
    if (conservar.has(x)) continue;
    const n = ((x.concepts ?? []) as string[]).reduce((a, p) => a + (pend.get(p) ? 1 : 0), 0);
    if (n > mejorN) { mejorN = n; mejor = x; }
  }
  if (!mejor) break;
  conservar.add(mejor);
  for (const p of (mejor.concepts ?? []) as string[]) {
    const v = pend.get(p); if (v) { if (v <= 1) pend.delete(p); else pend.set(p, v - 1); }
  }
}
const excedente = sinSello.filter((x) => !conservar.has(x));

console.log(`# Cuarentena del excedente sin dictamen\n`);
console.log(`Sin sello y servibles: **${sinSello.length}**`);
console.log(`- se CONSERVAN por cubrir déficit real: **${conservar.size}** → van a dictamen manual`);
console.log(`- a CUARENTENA por excedente: **${excedente.length}**\n`);

// Condición 2 del par: el recuento de cobertura, antes y después.
for (const x of excedente) { const m = x.variantVerificacion ? MOTIVO2 : MOTIVO; x.variantStatus = 'needs-human'; x.variantVerificacion = `${m} · puntos: ${((x.concepts ?? []) as string[]).join(', ') || '(sin punto)'}${x.variantVerificacion ? ` · sello anterior: ${x.variantVerificacion}` : ''}`; }
const despues = cuentaDe(items);
console.log(`| | déficit de cobertura servible |`);
console.log(`|---|---:|`);
console.log(`| antes | ${deficitDe(antes)} |`);
console.log(`| después | ${deficitDe(despues)} |`);
const movidos = [...despues].filter(([id, n]) => n !== antes.get(id));
console.log(`\nPuntos cuya cuenta cambia: **${movidos.length}**` + (movidos.length ? ' — si alguno baja del piso, la selección está mal:' : '.'));
for (const [id, n] of movidos.slice(0, 12)) console.log(`- \`${id}\`: ${antes.get(id)} → ${n} (piso ${piso(id)})${n < piso(id) ? '  ✗ CAE' : ''}`);
const caen = movidos.filter(([id, n]) => n < piso(id) && antes.get(id)! >= piso(id));
if (caen.length) { console.log(`\n✗ ${caen.length} puntos caen por debajo del piso. NO se escribe.`); process.exit(1); }

if (!APLICAR) { console.log('\nDRY-RUN. Repite con --aplicar.'); process.exit(0); }
for (const [f, d] of porFichero) fs.writeFileSync(path.join(BLOCKS_DIR, f), JSON.stringify(d, null, 2) + '\n');
console.log(`\nEscritos ${porFichero.size} ficheros.`);

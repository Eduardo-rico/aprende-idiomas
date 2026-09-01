// scripts/triaje-excedente.ts — ¿qué ítems SIN dictamen hacen falta?
//
//   npx tsx scripts/triaje-excedente.ts
//
// Principio (E2#22): **no se paga por validar material que el curso no
// necesita.** Un ítem sin dictamen o se dictamina o no se sirve; lo que
// no se hace es gastar sesiones en certificar excedente.
//
// Para cada punto se cuenta lo que tiene SELLADO Y SERVIBLE. Si con eso
// ya llega a su piso, los ítems sin sello de ese punto son excedente y
// pueden ir a cuarentena. Si no llega, hacen falta y hay que dictaminarlos
// — o producirlos de nuevo con las máquinas, que sale más barato.
import fs from 'node:fs';
import path from 'node:path';
import { ALL_CONCEPTS } from '../lib/data/languages/pt/curriculum';
import { BLOCKS_DIR } from './config';
import { servibleAlAlumno, selladoDeVariante, esDeEscucha } from './lib/estado-item';
import { contarPuntos, padreCubierto, pisoCero, conPisoCero } from './lib/conceptos-finos';

const items = fs.readdirSync(BLOCKS_DIR).filter((x) => /^b\d+\.json$/.test(x))
  .flatMap((f) => JSON.parse(fs.readFileSync(path.join(BLOCKS_DIR, f), 'utf8')) as any[]);

// SERVIBLE: lo que el alumno puede ver. `needs-human` está filtrado en el
// embudo de `lib/data/loaders.ts`, así que no cuenta como cobertura.
const servible = servibleAlAlumno;
// SELLADO: alguien escribió QUÉ se le hizo. `divergent` cuenta: está
// verificado como divergencia real, no pendiente.
const sellado = selladoDeVariante;

const piso0 = (id: string) => (id.startsWith('b12') ? 6 : 8);
const piso = conPisoCero(piso0, pisoCero());

const cuentaDe = (xs: any[]) => {
  const { cuenta } = contarPuntos(xs);
  for (const c of ALL_CONCEPTS) if (!cuenta.has(c.id)) cuenta.set(c.id, 0);
  for (const id of [...cuenta.keys()]) if (cuenta.get(id)! < piso(id) && padreCubierto(id, cuenta, piso)) cuenta.set(id, piso(id));
  return cuenta;
};

const todo = cuentaDe(items);
const soloServible = cuentaDe(items.filter(servible));
const selladoYServible = cuentaDe(items.filter((x) => servible(x) && sellado(x)));

// ── 1 · La cuarentena cuenta hoy como cobertura, y no se sirve ────────
const porCuarentena = [...todo].filter(([id, n]) => n > (soloServible.get(id) ?? 0));
const caenPorCuarentena = porCuarentena.filter(([id]) => (soloServible.get(id) ?? 0) < piso(id) && todo.get(id)! >= piso(id));
console.log('## 1 · Lo que la cuarentena tapa\n');
console.log(`Puntos cuya cuenta baja al descontar la cuarentena: **${porCuarentena.length}**.`);
console.log(`De ésos, los que **caen por debajo del piso** al descontarla: **${caenPorCuarentena.length}** ` +
  `(${caenPorCuarentena.reduce((a, [id]) => a + piso(id) - (soloServible.get(id) ?? 0), 0)} unidades).`);
if (caenPorCuarentena.length) {
  console.log('\nLos peores:');
  for (const [id] of caenPorCuarentena.sort((a, b) => (soloServible.get(a[0]) ?? 0) - (soloServible.get(b[0]) ?? 0)).slice(0, 10))
    console.log(`- \`${id}\`: ${soloServible.get(id)} servibles de ${todo.get(id)} contados · piso ${piso(id)}`);
}

// ── 2 · El triaje de los sin sello ────────────────────────────────────
const sinSello = items.filter((x) => servible(x) && !sellado(x));
const excedente: any[] = [], necesarios: any[] = [];
const puntosNecesarios = new Map<string, number>();
for (const x of sinSello) {
  const ps = (x.concepts ?? []) as string[];
  // Un ítem es NECESARIO si alguno de sus puntos no llega al piso sin él.
  const hace = ps.some((p) => (selladoYServible.get(p) ?? 0) < piso(p));
  if (hace) { necesarios.push(x); for (const p of ps) if ((selladoYServible.get(p) ?? 0) < piso(p)) puntosNecesarios.set(p, (puntosNecesarios.get(p) ?? 0) + 1); }
  else excedente.push(x);
}
console.log('\n## 2 · Los 879 sin dictamen, por rama\n');
console.log(`| rama | ítems |`);
console.log(`|---|---:|`);
console.log(`| **2 · excedente** (su punto ya llega al piso con lo sellado) → cuarentena | ${excedente.length} |`);
console.log(`| **3 · necesarios** (su punto NO llega sin ellos) → dictamen o reposición | ${necesarios.length} |`);
console.log(`| sin punto declarado | ${sinSello.filter((x) => !(x.concepts ?? []).length).length} |`);
console.log(`\nLos necesarios se reparten en **${puntosNecesarios.size} puntos**. Los que más piden:`);
for (const [p, n] of [...puntosNecesarios].sort((a, b) => b[1] - a[1]).slice(0, 12))
  console.log(`- \`${p}\`: ${selladoYServible.get(p) ?? 0}/${piso(p)} sellados · ${n} sin sello disponibles`);

// ── 3 · El coste REAL, que no es «los necesarios» ─────────────────────
// Un punto a 4/8 no necesita que se revisen sus 22 ítems sin sello:
// necesita CUATRO. Contar los 498 como coste es el mismo error que contar
// 879 como trabajo — sobreestimar lo que hay que pagar es tan malo como
// subestimarlo, porque lleva a tirar por la borda lo que sí valía.
const faltaPorPunto = new Map<string, number>();
for (const [id] of selladoYServible) {
  const f = piso(id) - (selladoYServible.get(id) ?? 0);
  if (f > 0) faltaPorPunto.set(id, f);
}
// Selección greedy: se toma el ítem sin sello que más déficit cubre.
const pend = new Map(faltaPorPunto);
const restantes = [...sinSello];
const elegidos: any[] = [];
for (;;) {
  let mejor: any = null, mejorN = 0;
  for (const x of restantes) {
    const n = ((x.concepts ?? []) as string[]).reduce((a, p) => a + (pend.get(p) ? 1 : 0), 0);
    if (n > mejorN) { mejorN = n; mejor = x; }
  }
  if (!mejor) break;
  elegidos.push(mejor);
  restantes.splice(restantes.indexOf(mejor), 1);
  for (const p of (mejor.concepts ?? []) as string[]) {
    const v = pend.get(p); if (v) { if (v <= 1) pend.delete(p); else pend.set(p, v - 1); }
  }
}
const sumaDeficit = [...faltaPorPunto.values()].reduce((a, b) => a + b, 0);
console.log('\n## 3 · El coste real de la revisión manual\n');
console.log(`Déficit de lo SELLADO Y SERVIBLE: **${sumaDeficit} unidades** en ${faltaPorPunto.size} puntos.`);
console.log(`Ítems sin sello que hay que dictaminar para cubrirlo: **${elegidos.length}**`);
console.log(`(los ${sinSello.length - elegidos.length} restantes son excedente y van a cuarentena).`);
console.log(`Déficit que NINGÚN ítem sin sello puede cubrir —hay que producirlo—: **${[...pend.values()].reduce((a, b) => a + b, 0)}** en ${pend.size} puntos.`);

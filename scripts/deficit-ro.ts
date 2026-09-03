// scripts/deficit-ro.ts — LA FOTO DEL DÉFICIT RUMANO, por punto y con
// reconciliación.
//
//   npx tsx scripts/deficit-ro.ts                       # informe + reconcilia con la última foto
//   npx tsx scripts/deficit-ro.ts --registrar "nota"    # y guarda la foto
//
// Es el `split-conceptos.ts` de PT reducido a lo que el rumano tiene hoy:
// no hay particiones ni transversales (los puntos del inventario YA son
// finos), así que la cuenta es directa: ítems SERVIBLES por `concepts`.
// Lo que sí se hereda entero es la reconciliación (`reconciliar-deficit`):
// anterior + publicado − retirado = actual, residuo 0. Sin ella, en tres
// lotes se cruzan dos cifras de dos momentos (cautela del coordinador,
// 2026-09-01; y la ficción del calendario de E2#11 en PT).
//
// Los puntos a CERO cuentan: el inventario da el universo, no el corpus.
// El piso es el del inventario (8; C2 6). `sinDescriptor` no baja el
// piso: es un hueco del currículo, no del punto.
import fs from 'node:fs';
import path from 'node:path';
import { PUNTOS_RO, pisoDePuntoRo } from '../lib/data/languages/ro/inventario-puntos';
import { blocksDir } from '../lib/data/registry';
import { contarPuntosRo, pisoDePunto, bloquesSinLeccion } from './lib/asigna-ro';
import { reconciliar, informe, type PorPunto } from './lib/reconciliar-deficit';
import { puntosConRasgoInvariante } from './lib/varianza';

const HIST = path.join(process.cwd(), 'docs/plans/deficit-ro-historico.json');
const NIVELES = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

const items: any[] = [];
const dir = blocksDir('ro');
if (fs.existsSync(dir)) for (const f of fs.readdirSync(dir).filter((x) => /^b\d+\.json$/.test(x))) {
  const arr = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  if (Array.isArray(arr)) items.push(...arr);
}
// El contador vive en `lib/asigna-ro.ts`, no aquí: el `--asigna` de los
// lotes usa EXACTAMENTE el mismo, y una regla copiada se desincroniza.
const { cuenta, desconocidos, servibles: nServibles } = contarPuntosRo(items);
const pisoId = pisoDePunto;

console.log(`# Déficit rumano — cobertura por punto (piso 8, C2 6)\n`);
console.log(`Corpus: ${items.length} ítems (${nServibles} servibles) · ${PUNTOS_RO.length} puntos del inventario.\n`);
console.log('| nivel | puntos | ítems | puntos <piso | faltan |');
console.log('|---|---:|---:|---:|---:|');
let faltaTotal = 0;
for (const n of NIVELES) {
  const ps = PUNTOS_RO.filter((p) => p.nivel === n);
  const its = ps.reduce((a, p) => a + cuenta.get(p.id)!, 0);
  // El piso por PUNTO, no por nivel: un punto puede declarar piso cero
  // con su motivo (`pisoCero`), y entonces no debe unidades.
  const bajo = ps.filter((p) => cuenta.get(p.id)! < pisoDePuntoRo(p));
  const falta = bajo.reduce((a, p) => a + (pisoDePuntoRo(p) - cuenta.get(p.id)!), 0);
  faltaTotal += falta;
  console.log(`| ${n} | ${ps.length} | ${its} | ${bajo.length} | ${falta} |`);
}
console.log(`| **Σ** | **${PUNTOS_RO.length}** | **${nServibles}** | **${[...cuenta].filter(([id, n]) => n < pisoId(id)).length}** | **${faltaTotal}** |`);
const cubiertos = [...cuenta].filter(([id, n]) => n >= pisoId(id));
if (cubiertos.length) console.log(`\nPuntos cubiertos (${cubiertos.length}): ${cubiertos.map(([id, n]) => `${id} (${n})`).join(', ')}.`);
// Los de PISO CERO se imprimen aparte y con su motivo: bajar el piso sin
// decirlo sería exactamente la forma de hacer desaparecer déficit sin
// producir nada.
const cero = PUNTOS_RO.filter((p) => p.pisoCero);
if (cero.length) {
  console.log(`\n**Piso CERO declarado (${cero.length}), con su motivo — no deben unidades:**`);
  for (const p of cero) console.log(`- \`${p.id}\`: ${p.pisoCero}`);
}
if (desconocidos.size) console.log(`\n⚠ ítems con puntos que NO están en el inventario: ${[...desconocidos].map(([k, v]) => `${k} ×${v}`).join(', ')}`);

// ── EL BLOQUEO ESTRUCTURAL, ANTES DE INTENTAR PUBLICAR ───────────────
// Un punto cuyo bloque no tiene lecciones NO PUEDE recibir un ítem, por
// limpio que salga el lote: el publicador lo rechaza entero. Hasta el
// 2026-09-03 eso valía para B1, B2, C1 y C2 completos —42 puntos, la
// mitad del curso— y no estaba escrito en ningún sitio. Aquí sale sin
// tener que escribir un lote para descubrirlo.
const sinLeccion = bloquesSinLeccion();
const puntosBloqueados = sinLeccion.reduce((a, b) => a + b.puntos.length, 0);
if (sinLeccion.length) {
  console.log(`\n## ⚠ BLOQUEADOS POR FALTA DE LECCIÓN (${puntosBloqueados} puntos en ${sinLeccion.length} bloques)\n`);
  console.log('Estos puntos NO pueden recibir un ítem aunque el lote salga limpio: `curriculum.ts`');
  console.log('sólo declara los bloques con `lessons/bN.json`, y el publicador rechaza el lote entero.\n');
  console.log('| bloque | puntos | ids |');
  console.log('|---|---:|---|');
  for (const b of sinLeccion) console.log(`| b${b.bloque} · ${b.nombre} | ${b.puntos.length} | ${b.puntos.join(', ')} |`);
} else {
  console.log(`\nBloqueados por falta de lección: **0** — los ${PUNTOS_RO.length} puntos tienen dónde caer.`);
}

// ── EL RASGO DIANA QUE NO VARÍA ─────────────────────────────────────
// «Ocho ítems por punto» presupone que los ocho MIDEN el punto. Si el
// rasgo diana es constante entre ellos, se aprende en el primero y la
// cobertura real es 1, no 8 — y eso no lo ve ningún gate por ítem,
// porque no es propiedad de ningún ítem sino del CONJUNTO. Lo destapó
// `r8-relativas-pe-care` en el lote 19: ocho ítems impecables uno a uno
// que eran uno repetido ocho veces.
//
// La señal es NECESARIA Y NO SUFICIENTE (ver `lib/varianza.ts`), así que
// esto NO bloquea por sí solo: lo que se exige es que cada punto marcado
// lleve su JUICIO ESCRITO, igual que la cuarentena y el piso cero. Cero
// marcados sin juicio.
const porPunto = new Map<string, any[]>();
for (const x of items.filter((i: any) => i?.variantStatus !== 'needs-human'))
  for (const c of ((x.concepts ?? []) as string[])) { const g = porPunto.get(c) ?? []; g.push(x); porPunto.set(c, g); }
const invariantes = puntosConRasgoInvariante(porPunto);
const juicio = new Map(PUNTOS_RO.map((p) => [p.id, p.varianza]));
console.log(`\n## Rasgo diana INVARIANTE (${invariantes.length} puntos con ≥4 ítems)\n`);
console.log('Una pieza de la operación presente en ≥80 % de los ítems se aprende en el');
console.log('primero: a partir del segundo, lo que discrimina es otra cosa. La señal no');
console.log('decide — decide qué varía en su lugar y si pertenece al punto —, así que');
console.log('cada uno lleva su juicio escrito en el inventario.\n');
console.log('| punto | ítems | invariante | varía en su lugar | juicio |');
console.log('|---|---:|---|---|---|');
const mudos: string[] = [];
for (const v of invariantes) {
  const j = juicio.get(v.punto);
  if (!j) mudos.push(v.punto);
  const cab = j ? j.split('.')[0]!.slice(0, 46) : '**SIN JUICIO ESCRITO**';
  const var_ = v.variable.length ? '`' + v.variable.slice(0, 5).join('`, `') + '`' : '—';
  console.log(`| \`${v.punto}\` | ${v.n} | ${v.invariantes.map((i) => `\`${i.pieza}\` ${i.en}/${v.n}`).join(', ')} | ${var_} | ${cab} |`);
}
if (mudos.length) {
  console.log(`\n✗ ${mudos.length} punto(s) marcados SIN juicio escrito: ${mudos.join(', ')}`);
  process.exitCode = 1;
} else console.log(`\nMarcados sin juicio escrito: **0**.`);

// ── reconciliación ───────────────────────────────────────────────────
const porPuntoAhora: PorPunto = Object.fromEntries(cuenta);
const historico: { fecha: string; nota?: string; porPunto: PorPunto; piso?: PorPunto }[] = fs.existsSync(HIST) ? JSON.parse(fs.readFileSync(HIST, 'utf8')) : [];
console.log('');
if (historico.length) {
  const ultima = historico[historico.length - 1]!;
  // El piso de la foto anterior sale de la foto, no del código de hoy.
  // Las fotos 1-11 no lo guardaban: para ellas se usa el piso ACTUAL y
  // el informe no puede separar la causa — se dice, no se disimula.
  const pisoAntes = ultima.piso ? (id: string) => ultima.piso![id] ?? pisoId(id) : undefined;
  if (!ultima.piso) console.log('> (la foto anterior no guardaba su piso: la línea de PISO no puede calcularse para ella)\n');
  const r = reconciliar(ultima.porPunto, porPuntoAhora, pisoId, pisoAntes);
  console.log(informe(r, '8, C2 6'));
  console.log(`\n(foto anterior: ${ultima.fecha}${ultima.nota ? ' — ' + ultima.nota : ''})`);
  if (r.residuo !== 0) { console.log(`\n✗ RESIDUO ${r.residuo}: hay déficit sin explicar.`); process.exitCode = 1; }
} else {
  console.log('## Reconciliación\n\nNo hay foto anterior: ésta es la primera. Se registra con `--registrar`.');
}
const i = process.argv.indexOf('--registrar');
if (i >= 0) {
  const nota = process.argv[i + 1];
  historico.push({
    fecha: new Date().toISOString().slice(0, 10),
    nota: nota && !nota.startsWith('--') ? nota : undefined,
    porPunto: porPuntoAhora,
    piso: Object.fromEntries(PUNTOS_RO.map((p) => [p.id, pisoDePuntoRo(p)])),
  });
  fs.writeFileSync(HIST, JSON.stringify(historico, null, 1) + '\n');
  console.log(`\nFoto registrada en ${path.relative(process.cwd(), HIST)} (${historico.length} en el histórico).`);
}

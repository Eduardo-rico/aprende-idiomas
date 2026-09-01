// scripts/gate-e5.ts — la checklist de TERMINADO, medida.
//
//   npx tsx scripts/gate-e5.ts
//
// E5 es «recorrer la checklist de TERMINADO con cifras medidas y comandos
// adjuntos». Recorrerla a mano es exactamente el procedimiento que en
// esta ola ha fallado media docena de veces: se lee la tabla equivocada,
// se cruzan dos cifras que no son intercambiables, o se declara verde lo
// que nadie midió. Así que la checklist se ejecuta.
//
// Cada línea sale con SU número, SU meta y el comando que la produce. Lo
// que este script NO puede medir se imprime igual, marcado, en vez de
// omitirse: una checklist con líneas invisibles se declara terminada sin
// estarlo.
//
// Sale con código 1 si alguna línea medible falla, para que «E5 verde» no
// pueda ser una frase — tenga que ser una salida.
import fs from 'node:fs';
import path from 'node:path';
import { BLOCKS, ALL_CONCEPTS } from '../lib/data/languages/pt/curriculum';
import { BLOCKS_DIR } from './config';
import { contarPuntos, pisoCero, conPisoCero, conPadreCubierto, servibleAlAlumno } from './lib/conceptos-finos';

const LECTURAS = path.join(process.cwd(), 'lib/data/languages/pt/lecturas');

interface Linea {
  eje: string;
  medido: string;
  meta: string;
  pasa: boolean | null; // null = no medible aquí
  comando: string;
  nota?: string;
}
const L: Linea[] = [];

// ── 1 · Lectura ──────────────────────────────────────────────────────
// Las palabras viven en `parrafos[].palabras[]` sólo en las lecturas con
// karaoke; en el resto están en `parrafos[].texto`. Contar sólo el primer
// campo daba 29.695 de 3.219.799 — el 0,9 %.
let palabras = 0, lecturas = 0;
for (const f of fs.readdirSync(LECTURAS).filter((x) => x.endsWith('.json'))) {
  const d = JSON.parse(fs.readFileSync(path.join(LECTURAS, f), 'utf8'));
  lecturas++;
  for (const p of d.parrafos ?? [])
    palabras += (p.palabras?.length as number) || String(p.texto ?? '').split(/\s+/).filter(Boolean).length;
}
L.push({ eje: 'Lectura', medido: `${palabras.toLocaleString('es')} palabras · ${lecturas} lecturas`,
  meta: '1.900.000', pasa: palabras >= 1_900_000, comando: 'npx tsx scripts/gate-e5.ts' });

// ── 2 · Cobertura ────────────────────────────────────────────────────
// El conteo es el CANÓNICO de `conceptos-finos`, el mismo de `hueco.ts` y
// `split-conceptos.ts`. Tres scripts que cuentan lo mismo tienen que
// contarlo con el mismo código: el mapa duplicado de E2#13 hizo
// desaparecer ocho puntos del déficit en silencio.
const items = fs.readdirSync(BLOCKS_DIR).filter((x) => /^b\d+\.json$/.test(x))
  .flatMap((f) => JSON.parse(fs.readFileSync(path.join(BLOCKS_DIR, f), 'utf8')) as any[]);
// `contarPuntos` descuenta la cuarentena: un punto «cubierto» con ocho
// ítems que el alumno no ve no está cubierto.
const { cuenta: n } = contarPuntos(items);
const servibles = items.filter(servibleAlAlumno);
for (const c of ALL_CONCEPTS) if (!n.has(c.id)) n.set(c.id, 0);
// El piso pasa por `conPisoCero`: el de un punto enterrado ES cero. Con
// el piso crudo, este script decía 5 puntos bajo el piso mientras
// `split-conceptos` decía 3 — dos cuentas de lo mismo que no coinciden es
// exactamente el defecto que este gate existe para no repetir.
const cero = pisoCero();
// Mismo piso que `split-conceptos.ts`: cero para los enterrados y cero
// para los padres cubiertos. Los dos BAJAN el piso; ninguno sube la
// cuenta, para que ni la foto ni este informe cuenten ítems inexistentes.
const piso = conPadreCubierto(conPisoCero((id: string) => (id.startsWith('b12') ? 6 : 8), cero), n);
const bajoPiso = [...n].filter(([id]) => n.get(id)! < piso(id));
const falta = bajoPiso.reduce((a, [id, hay]) => a + piso(id) - hay, 0);

L.push({ eje: 'Cobertura (piso 8, C2 6)', medido: `${n.size} puntos · ${servibles.length} ejercicios servibles de ${items.length} · ${bajoPiso.length} bajo el piso`,
  meta: 'cero bajo el piso', pasa: bajoPiso.length === 0, comando: 'npx tsx scripts/split-conceptos.ts',
  nota: `FALTA ${falta} unidades. Los ${cero.size} puntos de piso cero declarado NO cuentan, por decisión escrita en docs/plans/puntos-piso-cero.json. Los ${items.length - servibles.length} restantes están en cuarentena y no se sirven ni cuentan. Y ojo: el recuento de ejercicios no es la Σ por PUNTO de \`split-conceptos\`, donde un ejercicio puede enseñar varios.` });

// ── 3 · Mediación: TAREAS ────────────────────────────────────────────
const tareas = servibles.filter((x) => x.type === 'mediation').length;
L.push({ eje: 'Mediación (tareas)', medido: `${tareas}`, meta: '230', pasa: tareas >= 230,
  comando: 'npx tsx scripts/recuento-conceptos.ts' });

// ── 4 · Bloque 11 ────────────────────────────────────────────────────
const b11 = BLOCKS.find((b) => b.id === 11);
L.push({ eje: 'Lecciones de b11', medido: `${b11?.lessons.length ?? 0}`, meta: '6-8',
  pasa: (b11?.lessons.length ?? 0) >= 6, comando: 'npx tsx scripts/gate-e5.ts' });

// ── 5 · Triaje de variante ───────────────────────────────────────────
const est = new Map<string, number>();
for (const x of items) if (x.variantStatus) est.set(x.variantStatus, (est.get(x.variantStatus) ?? 0) + 1);
const unchecked = est.get('unchecked') ?? 0;
const sinResolver = (est.get('needs-human') ?? 0) + (est.get('divergent') ?? 0);
L.push({ eje: 'Corpus sin triar', medido: `${unchecked} unchecked · ${sinResolver} needs-human/divergent`,
  meta: 'cero de los dos', pasa: unchecked === 0 && sinResolver === 0, comando: 'npx tsx scripts/triage-variante.ts' });

// ── 6 · Lo que este script no mide ───────────────────────────────────
for (const [eje, comando] of [
  ['Suite + typecheck', 'npx vitest run && npx tsc --noEmit'],
  ['Contenido y audio', 'npx tsx scripts/verify-content.ts && npx tsx scripts/check-audio-stale.ts'],
  ['Gates de virginidad', 'npx tsx scripts/check-virginidad.ts --strict'],
  ['Build real', 'npx next build'],
  ['Smoke E2E', 'npx playwright test'],
  ['Backlog de producción', 'a mano: duplicados, b7-gerundio, med-20, flashcards viejos, MDX b8'],
  ['Escalera karaoke', 'a mano, cadencia E4'],
] as const) L.push({ eje, medido: '—', meta: 'verde', pasa: null, comando });

// ── Informe ──────────────────────────────────────────────────────────
console.log('# Gate E5 — checklist de TERMINADO, medida\n');
console.log('| eje | medido | meta | |');
console.log('|---|---|---|:-:|');
for (const x of L) console.log(`| ${x.eje} | ${x.medido} | ${x.meta} | ${x.pasa === null ? '·' : x.pasa ? '✅' : '❌'} |`);

console.log('\n## Comandos\n');
for (const x of L) console.log(`- **${x.eje}**: \`${x.comando}\``);

const notas = L.filter((x) => x.nota);
if (notas.length) {
  console.log('\n## Notas\n');
  for (const x of notas) console.log(`- **${x.eje}**: ${x.nota}`);
}

const fallan = L.filter((x) => x.pasa === false);
const noMedidas = L.filter((x) => x.pasa === null);
console.log(`\n## Veredicto\n`);
console.log(`Medibles: ${L.length - noMedidas.length} · pasan ${L.length - noMedidas.length - fallan.length} · fallan ${fallan.length}.`);
console.log(`Sin medir aquí: ${noMedidas.length} — hay que correr sus comandos y pegar la salida.`);
if (fallan.length) {
  console.log(`\n**NO se declara terminado.** Falla:`);
  for (const x of fallan) console.log(`- ${x.eje}: ${x.medido} (meta ${x.meta})`);
  process.exitCode = 1;
} else {
  console.log('\nNinguna línea medible falla. Las de arriba sin medir siguen siendo condición.');
}

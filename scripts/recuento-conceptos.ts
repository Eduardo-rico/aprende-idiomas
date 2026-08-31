// scripts/recuento-conceptos.ts — la medición que decide el re-corte de la meta.
//
//   npx tsx scripts/recuento-conceptos.ts
//
// Los 6.300 de la meta salieron de una extrapolación POR HORAS, no de una
// medición. Este script da la base alternativa: **N ítems por concepto**.
// Responde tres preguntas, con la aritmética a la vista:
//
//   1. ¿Cuántos puntos de enseñanza declara el currículo por nivel?
//   2. ¿Cuántos ítems tiene HOY cada concepto? (distribución, no media:
//      la media esconde que un concepto tenga 300 y otro 2)
//   3. ¿Cuánto daría la meta bajo N = 6, 8 y 10 ítems por concepto,
//      comparado con los 6.300 de hoy?
//
// NO recomienda un recorte. Da la tabla.
import fs from 'node:fs';
import path from 'node:path';

const BLOQUE_A_NIVEL: Record<number, string> = {
  1: 'A1', 2: 'A2', 3: 'A2', 4: 'B1', 5: 'B1', 6: 'B2',
  7: 'B2', 8: 'B2', 9: 'A2', 10: 'B1', 11: 'C1',
};
const NIVELES = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const PIDE: Record<string, number> = { A1: 900, A2: 1100, B1: 1400, B2: 1600, C1: 1200, C2: 800 };
const MOTOR: Record<string, number> = { A1: 0, A2: 0, B1: 200, B2: 300, C1: 200, C2: 0 };

const ROOT = process.cwd();
const items: any[] = [];
for (const f of fs.readdirSync(path.join(ROOT, 'lib/data/languages/pt/blocks')).filter((x) => /^b\d+\.json$/.test(x)).sort()) {
  const j = JSON.parse(fs.readFileSync(path.join(ROOT, 'lib/data/languages/pt/blocks', f), 'utf8'));
  items.push(...(Array.isArray(j) ? j : j.exercises));
}
const conceptos: any[] = JSON.parse(fs.readFileSync(path.join(ROOT, 'lib/data/languages/pt/concepts.json'), 'utf8'));

// ─────────────────────────────────────────────────────────────────────
// 1 · PUNTOS QUE DECLARA EL CURRÍCULO, por nivel.
//
// El currículo describe los puntos en prosa, separados por «;» dentro de
// las secciones GRAMÁTICA / LÉXICO / FONOLOGÍA / PRAGMÁTICA / MEDIACIÓN.
// No hay lista de conceptos que contar, así que se cuentan los puntos
// ENUMERADOS y se imprime el desglose por sección para que la cifra sea
// auditable: quien no esté de acuerdo con el conteo ve de dónde sale.
// ─────────────────────────────────────────────────────────────────────
const curr = fs.readFileSync(path.join(ROOT, 'docs/plans/2026-07-28-curriculos-completos.md'), 'utf8').split('\n');
const iniPT = curr.findIndex((l) => l.startsWith('## Portugués'));
const finPT = curr.findIndex((l, i) => i > iniPT && l.startsWith('## ') && !l.startsWith('## Portugués'));
const bloquePT = curr.slice(iniPT, finPT < 0 ? curr.length : finPT);

const SECCIONES = ['GRAMÁTICA', 'LÉXICO', 'FONOLOGÍA', 'PRAGMÁTICA', 'MEDIACIÓN'];
const puntos: Record<string, Record<string, number>> = {};
const sepUsado: string[] = [];
let nivelActual = '';
for (const l of bloquePT) {
  const h = l.match(/^### Portugués · (A1|A2|B1|B2|C1|C2) /);
  if (h) { nivelActual = h[1] ?? ""; puntos[nivelActual] = {}; continue; }
  if (!nivelActual) continue;
  for (const s of SECCIONES) {
    const re = new RegExp(`${s}[^:]{0,140}:(.*)$`);
    const m = l.match(re);
    if (!m) continue;
    // El currículo NO enumera igual en todas las secciones: unas usan «;»
    // y otras «,». Contar siempre por «;» daba 1 punto a la GRAMÁTICA de
    // C2, que enumera ocho con comas. Se elige el separador por sección y
    // se DECLARA cuál se usó, para que el conteo sea auditable.
    const cuerpo = (m[1] ?? "").replace(/\([^)]*\)/g, '');
    const sep = (cuerpo.match(/;/g) ?? []).length >= 2 ? ';' : ',';
    const n = cuerpo
      .split(sep)
      .map((x) => x.trim())
      .filter((x) => x.replace(/[^\p{L}]/gu, '').length >= 12).length;
    (puntos[nivelActual] ??= {})[s] = ((puntos[nivelActual] ?? {})[s] ?? 0) + n;
    sepUsado.push(`${nivelActual}/${s}: «${sep}» → ${n}`);
  }
}

console.log('# 1 · Puntos de enseñanza que ENUMERA el currículo (conteo auditable)\n');
console.log('Un punto = un segmento de la enumeración de esa sección. El');
console.log('separador se elige por sección («;» si hay dos o más, si no «,»)');
console.log('y se declara abajo, porque el currículo no enumera igual en todas.\n');
console.log(`| nivel | ${SECCIONES.map((s) => s.padEnd(10)).join(' | ')} | TOTAL |`);
console.log(`|-------|${SECCIONES.map(() => '------------|').join('')}-------|`);
const totalPuntos: Record<string, number> = {};
for (const n of NIVELES) {
  const p = puntos[n] ?? {};
  const t = SECCIONES.reduce((a, s) => a + (p[s] ?? 0), 0);
  totalPuntos[n] = t;
  console.log(`| ${n}    | ${SECCIONES.map((s) => String(p[s] ?? 0).padStart(10)).join(' | ')} | ${String(t).padStart(5)} |`);
}
const sumaPuntos = NIVELES.reduce((a, n) => a + (totalPuntos[n] ?? 0), 0);
console.log(`| **Σ** | ${SECCIONES.map((s) => String(NIVELES.reduce((a, n) => a + ((puntos[n] ?? {})[s] ?? 0), 0)).padStart(10)).join(' | ')} | ${String(sumaPuntos).padStart(5)} |`);
console.log(`\nSeparador usado en cada sección (para auditar el conteo):`);
console.log('  ' + sepUsado.join(' · '));
console.log(`A1 no tiene sección MEDIACIÓN en el currículo: la mediación arranca en A2 por diseño.`);

// ─────────────────────────────────────────────────────────────────────
// 2 · ÍTEMS POR CONCEPTO, HOY. Distribución, no media.
// ─────────────────────────────────────────────────────────────────────
const porConcepto = new Map<string, number>();
for (const c of conceptos) porConcepto.set(c.id, 0);
let sinConcepto = 0;
for (const ex of items) {
  const cs: string[] = ex.concepts ?? [];
  if (!cs.length) { sinConcepto++; continue; }
  for (const c of cs) porConcepto.set(c, (porConcepto.get(c) ?? 0) + 1);
}
const nivelDeConcepto = (id: string): string => {
  const c = conceptos.find((x) => x.id === id);
  if (c) return BLOQUE_A_NIVEL[c.blockId] ?? '?';
  const m = id.match(/^b(\d+)-/);
  return m ? (BLOQUE_A_NIVEL[Number(m[1])] ?? '?') : '?';
};
const stats = (xs: number[]) => {
  if (!xs.length) return { min: 0, p50: 0, max: 0, media: 0 };
  const s = [...xs].sort((a, b) => a - b);
  return { min: s[0], p50: s[Math.floor(s.length / 2)], max: s[s.length - 1], media: Math.round(s.reduce((a, b) => a + b, 0) / s.length) };
};

console.log('\n\n# 2 · Ítems por concepto HOY — distribución\n');
console.log('| nivel | conceptos | a CERO | <6 | mín | mediana | máx | media | ítems |');
console.log('|-------|----------:|-------:|---:|----:|--------:|----:|------:|------:|');
const declarados = new Set(conceptos.map((c) => c.id));
for (const n of NIVELES) {
  const ids = [...porConcepto.keys()].filter((id) => nivelDeConcepto(id) === n);
  const vs = ids.map((id) => porConcepto.get(id)!);
  const s = stats(vs);
  const tot = vs.reduce((a, b) => a + b, 0);
  console.log(`| ${n}    | ${String(ids.length).padStart(9)} | ${String(vs.filter((v) => v === 0).length).padStart(6)} | ${String(vs.filter((v) => v < 6).length).padStart(2)} | ${String(s.min).padStart(3)} | ${String(s.p50).padStart(7)} | ${String(s.max).padStart(3)} | ${String(s.media).padStart(5)} | ${String(tot).padStart(5)} |`);
}
const todos = [...porConcepto.values()];
const st = stats(todos);
console.log(`| **Σ** | ${String(porConcepto.size).padStart(9)} | ${String(todos.filter((v) => v === 0).length).padStart(6)} | ${String(todos.filter((v) => v < 6).length).padStart(2)} | ${String(st.min).padStart(3)} | ${String(st.p50).padStart(7)} | ${String(st.max).padStart(3)} | ${String(st.media).padStart(5)} | ${String(todos.reduce((a, b) => a + b, 0)).padStart(5)} |`);
console.log(`\nConceptos declarados en concepts.json: ${conceptos.length} · usados por algún ítem pero NO declarados: ${[...porConcepto.keys()].filter((k) => !declarados.has(k)).length} (${[...porConcepto.keys()].filter((k) => !declarados.has(k)).join(', ')})`);
console.log(`Ejercicios sin ningún concept declarado: ${sinConcepto} de ${items.length} (${Math.round(sinConcepto / items.length * 100)} %)`);

// Los diez conceptos más cargados: es donde vive la cola larga de la media.
const top = [...porConcepto.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
console.log('\nLos 10 conceptos con más ítems (la media miente sin esto):');
for (const [id, n] of top) console.log(`  ${String(n).padStart(4)}  ${id}  [${nivelDeConcepto(id)}]`);

// ─────────────────────────────────────────────────────────────────────
// 3 · LA META BAJO «N ÍTEMS POR CONCEPTO».
//
// Dos bases, porque dan números muy distintos y la diferencia ES la
// decisión:
//   (a) conceptos DECLARADOS hoy — sólo cubren lo ya construido;
//   (b) puntos que ENUMERA el currículo (tabla 1) — cubre A1→C2.
// ─────────────────────────────────────────────────────────────────────
console.log('\n\n# 3 · La meta bajo N ítems por concepto\n');
const metaHoy: Record<string, number> = {};
for (const n of NIVELES) metaHoy[n] = (PIDE[n] ?? 0) - (MOTOR[n] ?? 0);
const sumaMetaHoy = NIVELES.reduce((a, n) => a + (metaHoy[n] ?? 0), 0);

for (const [etq, base] of [
  ['(a) conceptos DECLARADOS hoy en concepts.json', Object.fromEntries(NIVELES.map((n) => [n, [...porConcepto.keys()].filter((id) => nivelDeConcepto(id) === n).length]))],
  ['(b) puntos que ENUMERA el currículo (tabla 1)', totalPuntos],
] as [string, Record<string, number>][]) {
  console.log(`\n**${etq}**\n`);
  console.log('| nivel | base | N=6 | N=8 | N=10 | meta hoy |');
  console.log('|-------|-----:|----:|----:|-----:|---------:|');
  let b6 = 0, b8 = 0, b10 = 0, bb = 0;
  for (const n of NIVELES) {
    const k = base[n] ?? 0;
    console.log(`| ${n}    | ${String(k).padStart(4)} | ${String(k * 6).padStart(3)} | ${String(k * 8).padStart(3)} | ${String(k * 10).padStart(4)} | ${String(metaHoy[n]).padStart(8)} |`);
    bb += k; b6 += k * 6; b8 += k * 8; b10 += k * 10;
  }
  console.log(`| **Σ** | ${String(bb).padStart(4)} | **${b6}** | **${b8}** | **${b10}** | **${sumaMetaHoy}** |`);
}

// ─────────────────────────────────────────────────────────────────────
// 4 · MEDIACIÓN — con la cifra corregida.
//
// El recuento de E2#8 calculaba mediación-ÍTEM = 1580 − 230 = 1350. Es
// un error: son buckets SEPARADOS y salen de líneas distintas del
// currículo. EJERCICIOS de mediación por nivel (A2 200 · B1 280 · B2 400
// · C1 400 · C2 300) = 1.580, dentro de los 7.000 de ejercicios.
// PRODUCCIÓN de mediación (A2 20 · B1 40 · B2 60 · C1 60 · C2 50) = 230,
// dentro de las 830 tareas de producción. Restar una de la otra
// desaparecía 230 ítems del faltante.
// ─────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────
// 3-bis · LA INVERSIÓN, que es el número que de verdad decide.
//
// Las dos bases de arriba dan metas de 300 a 1.280 — entre 5 y 20 veces
// menos que 6.300. Antes de creérselo hay que mirar la GRANULARIDAD: el
// concepto más cargado del corpus tiene 125 ítems, y no porque sobren,
// sino porque «registro» o «contraste indicativo/conjuntivo» no son UN
// punto de enseñanza, son familias enteras. Con conceptos así de gruesos,
// «N por concepto» no mide lo que dice medir.
//
// Por eso el número útil es el inverso: si la meta se mantiene, ¿cuántos
// conceptos hace falta declarar? Y comparado con los que hay hoy, ¿cuánto
// más fino tendría que ser el inventario?
// ─────────────────────────────────────────────────────────────────────
console.log('\n\n# 3-bis · La inversión: qué inventario de conceptos implica cada meta\n');
console.log('| meta | N=6 | N=8 | N=10 |');
console.log('|------|----:|----:|-----:|');
for (const meta of [sumaMetaHoy, 4200, 3000, 2000]) {
  console.log(`| ${String(meta).padStart(4)} | ${String(Math.ceil(meta / 6)).padStart(3)} | ${String(Math.ceil(meta / 8)).padStart(3)} | ${String(Math.ceil(meta / 10)).padStart(4)} |`);
}
console.log(`\nHoy hay **${porConcepto.size}** conceptos y **${todos.reduce((a, b) => a + b, 0)}** ítems asignados:`);
console.log(`densidad real **${Math.round(todos.reduce((a, b) => a + b, 0) / porConcepto.size)} ítems por concepto** (mediana ${st.p50}, máx ${st.max}).`);
console.log(`Sostener la meta de ${sumaMetaHoy} a N=8 pide ${Math.ceil(sumaMetaHoy / 8)} conceptos: **${(Math.ceil(sumaMetaHoy / 8) / porConcepto.size).toFixed(1)}× el inventario actual**.`);
console.log(`Los ${sumaPuntos} puntos que enumera el currículo son ${(sumaPuntos / porConcepto.size).toFixed(1)}× el inventario actual — ni de lejos suficientes para ${sumaMetaHoy} a N=8.`);
console.log(`\nDicho de otro modo: **la meta y el inventario de conceptos no son`);
console.log(`independientes.** Elegir 6.300 con 50 conceptos declarados obliga a 126`);
console.log(`ítems por concepto, que es 2,4× la densidad que el propio corpus tiene hoy`);
console.log(`(${Math.round(todos.reduce((a, b) => a + b, 0) / porConcepto.size)}). O baja la meta, o sube el inventario, o se acepta esa densidad.`);

const MED_ITEMS_NIVEL: Record<string, number> = { A1: 0, A2: 200, B1: 280, B2: 400, C1: 400, C2: 300 };
const MED_TAREAS = 230;
const med = items.filter((x) => x.type === 'mediation');
// El ÍTEM de mediación no es del tipo `mediation` — ése es la TAREA con
// rúbrica. El ítem es cerrado y usa el tipo que le convenga
// (`multiple_choice` en la familia «fidelidad de relay», E2#9), así que
// se cuenta por CONCEPTO. Sin esto el bucket marcaría 0 para siempre
// mientras se llena, que es el peor fallo que puede tener un recuento.
const CONCEPTOS_MED_ITEM = ['b10-fidelidad-relay'];
const medItems = items.filter((x) => (x.concepts ?? []).some((c: string) => CONCEPTOS_MED_ITEM.includes(c)));
const MED_ITEMS = NIVELES.reduce((a, n) => a + (MED_ITEMS_NIVEL[n] ?? 0), 0);
console.log('\n\n# 4 · Mediación, con la cifra CORREGIDA\n');
console.log(`| bucket | hay | pide | falta |`);
console.log(`|---|---:|---:|---:|`);
console.log(`| mediación-ÍTEM (dentro de los ${sumaMetaHoy} de ejercicios) | ${medItems.length} | ${MED_ITEMS} | ${MED_ITEMS - medItems.length} |`);
console.log(`| mediación-TAREA (dentro de las 830 de producción) | ${med.length} | ${MED_TAREAS} | ${Math.max(0, MED_TAREAS - med.length)} |`);
console.log(`\nEl recuento de E2#8 daba 1.350 al bucket de ítems restando las 230 tareas.`);
console.log(`Son buckets separados: el faltante de mediación-ÍTEM es ${MED_ITEMS}, no 1350.`);

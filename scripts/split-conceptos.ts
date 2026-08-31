// scripts/split-conceptos.ts
//
//   npx tsx scripts/split-conceptos.ts            # informe, no escribe
//   npx tsx scripts/split-conceptos.ts --write    # re-etiqueta el corpus
//
// Aplica la partición de `scripts/lib/conceptos-finos.ts` al corpus y
// saca la tabla de cobertura por nivel: cuántos puntos hay, cuántos
// ítems tiene cada uno y cuántos quedan por debajo del piso.
//
// El sub-punto se asigna por PRIMERA REGLA QUE CASA, y las reglas van de
// la más específica a la más general dentro de cada concepto — por eso
// el orden del fichero de particiones importa y está declarado ahí.
//
// Lo que no casa con ningún sub-punto se queda en el concepto padre y se
// REPORTA: el residuo es información. En la primera pasada destapó ítems
// de regência verbal viviendo bajo «pretérito perfeito irregular».
import fs from 'node:fs';
import path from 'node:path';
import { PARTICIONES, TRANSVERSALES } from './lib/conceptos-finos';
import { CONCEPTOS_FINOS } from '../lib/data/languages/pt/conceptos-finos.generated';
import { ALL_CONCEPTS } from '../lib/data/languages/pt/curriculum';
import { reconciliar, informe, type PorPunto } from './lib/reconciliar-deficit';

const WRITE = process.argv.includes('--write');
const PISO = Number(process.env.PISO ?? 12);

const BLOQUE_A_NIVEL: Record<number, string> = {
  1: 'A1', 2: 'A2', 3: 'A2', 4: 'B1', 5: 'B1', 6: 'B2',
  7: 'B2', 8: 'B2', 9: 'A2', 10: 'B1', 11: 'C1',
};
const NIVELES = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

/** El texto que se mira para decidir el sub-punto: la frase ENSAMBLADA
 *  (la del hueco relleno) más todo lo didáctico. Aquí no se busca si el
 *  ítem está en portugués sino QUÉ ENSEÑA, así que entra todo. */
function textoItem(x: any, conExplicacion = false): string {
  const d = x.data ?? {};
  const partes: string[] = [];
  const push = (v: unknown) => {
    if (typeof v === 'string') partes.push(v);
    else if (Array.isArray(v)) v.forEach(push);
    else if (v && typeof v === 'object') Object.values(v as any).forEach(push);
  };
  if (x.type === 'fill_blank' && typeof d.sentence === 'string') {
    let s = d.sentence as string;
    for (const b of (d.blanks ?? [])) s = s.replace('___', String(b.answer ?? ''));
    partes.push(s);
    for (const b of (d.blanks ?? [])) push(b.alternatives);
  } else push(d);
  // La EXPLICACIÓN se mira sólo como último recurso, y se declara cuántas
  // asignaciones salen de ahí. Motivo medido: la glosa suele NOMBRAR las
  // formas como contraejemplo — un ítem sobre «veria» cuya glosa dice
  // «sólo dizer, fazer y trazer son irregulares: diria, faria, traria»
  // entraba como irregular por citar justamente lo que no es. Lo cazó la
  // validación a mano de 20 asignaciones.
  if (conExplicacion) { push(x.esContrast); push(x.tags); }
  return partes.join(' · ');
}

const DIR = path.join(process.cwd(), 'lib/data/languages/pt/blocks');
const ficheros = fs.readdirSync(DIR).filter((x) => /^b\d+\.json$/.test(x)).sort();
const porFichero = new Map<string, any[]>();
for (const f of ficheros) porFichero.set(f, JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')));
const items = [...porFichero.values()].flat();

const porPadre = new Map(PARTICIONES.map((p) => [p.padre, p]));
const cuenta = new Map<string, number>();
const residuo = new Map<string, number>();
const ejemplosResiduo = new Map<string, string[]>();
let reasignados = 0;
let porGlosa = 0;   // asignaciones que sólo casan mirando la explicación: más débiles

for (const x of items) {
  const nuevos: string[] = [];
  for (const c of (x.concepts ?? [])) {
    // Las transversales tienen precedencia: un ítem de regência verbal
    // no enseña el concepto bajo el que lo etiquetaron.
    const tr = TRANSVERSALES.find((r) => r.aplica(x));
    if (tr) { nuevos.push(tr.id); cuenta.set(tr.id, (cuenta.get(tr.id) ?? 0) + 1); reasignados++; continue; }
    const part = porPadre.get(c);
    if (!part) { nuevos.push(c); cuenta.set(c, (cuenta.get(c) ?? 0) + 1); continue; }
    const t = textoItem(x);
    let sub = part.subs.find((s) => s.re.test(t));
    if (!sub) { sub = part.subs.find((s) => s.re.test(textoItem(x, true))); if (sub) porGlosa++; }
    if (sub) {
      nuevos.push(sub.id);
      cuenta.set(sub.id, (cuenta.get(sub.id) ?? 0) + 1);
      reasignados++;
    } else {
      nuevos.push(c);
      cuenta.set(c, (cuenta.get(c) ?? 0) + 1);
      residuo.set(c, (residuo.get(c) ?? 0) + 1);
      const ej = ejemplosResiduo.get(c) ?? [];
      if (ej.length < 4) { ej.push(`${x.id}: ${textoItem(x, true).slice(0, 95)}`); ejemplosResiduo.set(c, ej); }
    }
  }
  x.__nuevos = [...new Set(nuevos)];
}

// ── Informe 1 · qué hizo la partición ────────────────────────────────
console.log(`# Partición de conceptos — ${PARTICIONES.length} conceptos gruesos → ${PARTICIONES.reduce((a, p) => a + p.subs.length, 0)} sub-puntos\n`);
console.log(`ítems del corpus: ${items.length} · asignaciones movidas a un sub-punto: ${reasignados} (de ellas ${porGlosa} sólo casan mirando la explicación, no el contenido: más débiles)\n`);
console.log('| concepto padre | ítems | → sub-puntos | residuo |');
console.log('|---|---:|---|---:|');
for (const p of PARTICIONES) {
  const tot = p.subs.reduce((a, s) => a + (cuenta.get(s.id) ?? 0), 0) + (residuo.get(p.padre) ?? 0);
  const det = p.subs.map((s) => `${s.id.replace(/^b\d+-/, '')}:${cuenta.get(s.id) ?? 0}`).join(' · ');
  console.log(`| ${p.padre} | ${tot} | ${det} | ${residuo.get(p.padre) ?? 0} |`);
}

const totalResiduo = [...residuo.values()].reduce((a, b) => a + b, 0);
console.log(`\n**Residuo total: ${totalResiduo}** — ítems que no casan con ningún sub-punto de su concepto.`);
console.log('No es basura: es la lista de lo que probablemente esté mal etiquetado de origen.\n');
for (const [c, n] of [...residuo.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8)) {
  console.log(`  ${c} — ${n} sin sub-punto`);
  for (const e of ejemplosResiduo.get(c) ?? []) console.log(`     ${e}`);
}

// ── Informe 2 · LA TABLA DE COBERTURA ────────────────────────────────
// El nivel sale del blockId declarado del concepto; los transversales
// (reg-verbal-*) no llevan prefijo de bloque en el id y sin esto salían
// sin nivel.
const BLOQUE_DE = new Map([...ALL_CONCEPTS, ...CONCEPTOS_FINOS].map((c) => [c.id, c.blockId]));
const nivelDe = (id: string): string => {
  const b = BLOQUE_DE.get(id) ?? Number(id.match(/^b(\d+)-/)?.[1] ?? 0);
  return BLOQUE_A_NIVEL[b] ?? '?';
};
// EL INVENTARIO DE PUNTOS son los conceptos DECLARADOS, no los que
// resultan tener ítems. La v1 medía el déficit sobre `cuenta`, que sólo
// contiene conceptos con al menos una asignación, así que **un punto a
// cero era invisible**: no aparecía en la lista de déficit ni sumaba sus
// 12. Medido en E2#12: 15 puntos declarados están a cero y valían 180
// unidades que la tabla no veía.
//
// Ése es el motivo de que E2#11 publicara 24 ítems, cerrara dos puntos
// (uno de 0→12 y otro de 1→13, −23 de déficit real) y el total sólo
// bajara 1: el punto que iba de CERO nunca había estado contado, así que
// llenarlo no descontó nada. Un indicador que no ve el trabajo que se
// hace convierte el calendario en ficción.
const PUNTOS_DECLARADOS = [...new Set([...ALL_CONCEPTS, ...CONCEPTOS_FINOS].map((c) => c.id))];
for (const id of PUNTOS_DECLARADOS) if (!cuenta.has(id)) cuenta.set(id, 0);

const stats = (xs: number[]) => {
  if (!xs.length) return { min: 0, p50: 0, max: 0 };
  const s = [...xs].sort((a, b) => a - b);
  return { min: s[0]!, p50: s[Math.floor(s.length / 2)]!, max: s[s.length - 1]! };
};

console.log(`\n\n# COBERTURA — piso de ${PISO} ítems por punto\n`);
console.log('| nivel | puntos | ítems | mín | mediana | máx | puntos <' + PISO + ' | faltan para el piso |');
console.log('|-------|-------:|------:|----:|--------:|----:|----------:|--------------------:|');
let tPuntos = 0, tItems = 0, tBajo = 0, tFaltan = 0;
for (const n of NIVELES) {
  const ids = [...cuenta.keys()].filter((id) => nivelDe(id) === n);
  const vs = ids.map((id) => cuenta.get(id)!);
  const s = stats(vs);
  const bajo = vs.filter((v) => v < PISO);
  const faltan = bajo.reduce((a, v) => a + (PISO - v), 0);
  console.log(`| ${n}    | ${String(ids.length).padStart(6)} | ${String(vs.reduce((a, b) => a + b, 0)).padStart(5)} | ${String(s.min).padStart(3)} | ${String(s.p50).padStart(7)} | ${String(s.max).padStart(3)} | ${String(bajo.length).padStart(9)} | ${String(faltan).padStart(19)} |`);
  tPuntos += ids.length; tItems += vs.reduce((a, b) => a + b, 0); tBajo += bajo.length; tFaltan += faltan;
}
console.log(`| **Σ** | ${String(tPuntos).padStart(6)} | ${String(tItems).padStart(5)} | | | | ${String(tBajo).padStart(9)} | ${String(tFaltan).padStart(19)} |`);

console.log(`\nPuntos por debajo del piso (${tBajo}), con lo que le falta a cada uno:`);
for (const [id, n] of [...cuenta.entries()].filter(([, v]) => v < PISO).sort((a, b) => a[1] - b[1])) {
  console.log(`  ${String(n).padStart(3)}/${PISO}  [${nivelDe(id)}] ${id}   (faltan ${PISO - n})`);
}


// ── Informe 3 · CONTRA LO QUE EL CURRÍCULO DECLARA ───────────────────
// La tabla de arriba mide los puntos que el corpus TIENE. Falta la otra
// mitad: los que el currículo declara y el corpus no tiene siquiera
// empezados — que es donde vive C1 y C2 entero.
// «SIN EMPEZAR» son los puntos que el currículo enumera y para los que
// **ni siquiera hay un concepto declarado** — no los que tienen cero
// ítems, que ahora sí entran en la tabla de arriba con su déficit
// completo. Mezclarlos era la segunda mitad del descuadre: el término
// `max(0, currículo − puntosConItems)` daba 0 para A2/B1/B2 (la
// partición hizo más puntos que los que el currículo enumera) y por eso
// cerrar un punto a cero en B1 no descontaba nada por ninguna vía.
const PUNTOS_CURRICULO: Record<string, number> = { A1: 31, A2: 31, B1: 27, B2: 31, C1: 32, C2: 34 };
console.log(`\n\n# LO QUE FALTA PARA CUBRIR — piso ${PISO}, contra los puntos que enumera el currículo\n`);
console.log('| nivel | puntos currículo | puntos con corpus | puntos SIN empezar | déficit de los empezados | × piso los nuevos | FALTA |');
console.log('|-------|-----------------:|------------------:|-------------------:|-------------------------:|------------------:|------:|');
let gTot = 0;
for (const n of NIVELES) {
  const ids = [...cuenta.keys()].filter((id) => nivelDe(id) === n);
  const vs = ids.map((id) => cuenta.get(id)!);
  const deficit = vs.filter((v) => v < PISO).reduce((a, v) => a + (PISO - v), 0);
  const pc = PUNTOS_CURRICULO[n] ?? 0;
  // `ids` ya son los DECLARADOS del nivel (los ceros incluidos), así que
  // esto cuenta sólo lo que falta por declarar.
  const sinEmpezar = Math.max(0, pc - ids.length);
  const nuevos = sinEmpezar * PISO;
  const falta = deficit + nuevos;
  gTot += falta;
  console.log(`| ${n}    | ${String(pc).padStart(16)} | ${String(ids.length).padStart(17)} | ${String(sinEmpezar).padStart(18)} | ${String(deficit).padStart(24)} | ${String(nuevos).padStart(17)} | ${String(falta).padStart(5)} |`);
}
console.log(`| **Σ** | ${String(Object.values(PUNTOS_CURRICULO).reduce((a, b) => a + b, 0)).padStart(16)} | ${String([...cuenta.keys()].length).padStart(17)} | | | | **${gTot}** |`);
console.log(`\nB1 y B2 tienen MÁS puntos que los que el currículo enumera: la partición`);
console.log(`salió más fina que la prosa del currículo, así que ahí no hay puntos sin`);
console.log(`empezar y el trabajo es sólo llenar los que están por debajo del piso.`);

// ── Informe 4 · RECONCILIACIÓN, obligatoria ──────────────────────────
// Cada sesión tiene que cerrar la cuenta: cuánto había, qué entró, qué
// puntos nacieron o murieron, y cuánto queda. Con `--registrar` se
// guarda la foto para que la próxima sesión reconcilie contra ella.
const HIST = path.join(process.cwd(), 'docs/plans/deficit-historico.json');
const porPuntoAhora: PorPunto = Object.fromEntries(cuenta);
const historico: { fecha: string; nota?: string; porPunto: PorPunto }[] =
  fs.existsSync(HIST) ? JSON.parse(fs.readFileSync(HIST, 'utf8')) : [];

console.log('\n');
if (historico.length) {
  const ultima = historico[historico.length - 1]!;
  const r = reconciliar(ultima.porPunto, porPuntoAhora, PISO);
  console.log(informe(r, PISO));
  console.log(`\n(foto anterior: ${ultima.fecha}${ultima.nota ? ' — ' + ultima.nota : ''})`);
  if (r.residuo !== 0) {
    console.log(`\n✗ RESIDUO ${r.residuo}: hay déficit sin explicar. No se cierra la sesión así.`);
    process.exitCode = 1;
  }
} else {
  console.log('## Reconciliación del déficit\n');
  console.log('No hay foto anterior: ésta es la primera. Se registra con `--registrar`.');
}

if (process.argv.includes('--registrar')) {
  const nota = process.argv[process.argv.indexOf('--registrar') + 1];
  historico.push({ fecha: new Date().toISOString().slice(0, 10), nota: nota && !nota.startsWith('--') ? nota : undefined, porPunto: porPuntoAhora });
  fs.writeFileSync(HIST, JSON.stringify(historico, null, 1) + '\n');
  console.log(`\nFoto registrada en ${path.relative(process.cwd(), HIST)} (${historico.length} en el histórico).`);
}

// ── Escritura ────────────────────────────────────────────────────────
if (!WRITE) { console.log('\nDRY-RUN: el corpus no se ha tocado.'); process.exit(0); }
let escritos = 0;
for (const [f, arr] of porFichero) {
  for (const x of arr) {
    if (!x.__nuevos) continue;
    const antes = JSON.stringify(x.concepts ?? []);
    x.concepts = x.__nuevos;
    delete x.__nuevos;
    if (JSON.stringify(x.concepts) !== antes) escritos++;
  }
  fs.writeFileSync(path.join(DIR, f), JSON.stringify(arr, null, 2) + '\n');
}
console.log(`\nESCRITO: ${escritos} ítems re-etiquetados en ${porFichero.size} ficheros.`);

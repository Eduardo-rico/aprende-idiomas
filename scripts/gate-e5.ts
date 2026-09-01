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
import { selladoDeVariante } from './lib/estado-item';

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
// PALABRA = algo con una LETRA dentro. Contar por `split(/\s+/)` suma la
// puntuación suelta, y eso importó de verdad: al separar las 53.101 rayas
// del transcriptor —«minguar--quando» → «minguar — quando»— esta cifra
// subió de 3.219.799 a 3.289.461 **sin que se hubiera leído una palabra
// más de portugués**. Un cambio de formato movió el número de portada un
// 2 %. Y los tokens de `palabras[]` tampoco valen tal cual: llevan la raya
// suelta desde ese mismo cambio.
const conLetra = (t: string) => /\p{L}/u.test(t);
let palabras = 0, lecturas = 0;
for (const f of fs.readdirSync(LECTURAS).filter((x) => x.endsWith('.json'))) {
  const d = JSON.parse(fs.readFileSync(path.join(LECTURAS, f), 'utf8'));
  lecturas++;
  for (const p of d.parrafos ?? [])
    palabras += (p.palabras as { t: string }[] | undefined)?.filter((w) => conLetra(String(w.t ?? ''))).length
      ?? String(p.texto ?? '').split(/\s+/).filter(conLetra).length;
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
// DOS CIFRAS, y las dos son ciertas porque responden a preguntas
// distintas. Se imprimen las DOS con su nombre, porque cuando sólo se
// imprimía la fácil el par se la dio a Edu sin la otra al lado:
//
//   · SERVIBLE — lo que el alumno puede ver hoy. Cuenta los 124 ítems que
//     nadie ha dictaminado todavía. Es verdad HOY y deja de serlo en
//     cuanto el trabajo avanza, igual que la cuarentena cuando contaba
//     como cobertura.
//   · SELLADO — lo que alguien ha mirado. Es la que gobierna la
//     planificación, porque es la única que no puede empeorar sola.
//
// Y no se pasa de una a otra restando: `conPadreCubierto` depende de las
// cuentas, así que cubrir un punto puede liberar el piso de su padre. Por
// eso se calculan las dos enteras y no una como corrección de la otra.
const medir = (xs: any[]) => {
  const { cuenta } = contarPuntos(xs);
  for (const c of ALL_CONCEPTS) if (!cuenta.has(c.id)) cuenta.set(c.id, 0);
  const piso = conPadreCubierto(conPisoCero((id: string) => (id.startsWith('b12') ? 6 : 8), pisoCero()), cuenta);
  const bajo = [...cuenta].filter(([id]) => cuenta.get(id)! < piso(id));
  return { cuenta, bajo, falta: bajo.reduce((a, [id, hay]) => a + piso(id) - hay, 0) };
};
const servibles = items.filter(servibleAlAlumno);
const SERV = medir(items);          // `contarPuntos` ya descuenta la cuarentena
const SELL = medir(items.filter(selladoDeVariante));
const n = SERV.cuenta;
const cero = pisoCero();
const sinSellar = servibles.length - items.filter(selladoDeVariante).length;

// El gate PASA por la estricta. Un ítem servible sin dictaminar es una
// promesa, no cobertura: la lectura de los 60 midió 36 % de defectuosos
// entre los que nadie había mirado.
L.push({ eje: 'Cobertura (piso 8, C2 6)',
  medido: `SELLADO: ${SELL.bajo.length} puntos bajo el piso · SERVIBLE HOY: ${SERV.bajo.length}`,
  meta: 'cero bajo el piso (sellado)', pasa: SELL.bajo.length === 0, comando: 'npx tsx scripts/split-conceptos.ts',
  nota: `**FALTA ${SELL.falta} contando SELLADO · ${SERV.falta} contando SERVIBLE HOY.** Las dos son ciertas y responden a preguntas distintas; la que gobierna la planificación es la de SELLADO, porque la otra cuenta ${sinSellar} ítems que nadie ha dictaminado y deja de ser verdad en cuanto se dictaminan. Medido: de los ítems que han pasado por dictamen manual, el dictamen declaró irreparable al **0,7 %** —la política es corregir, no cuarentenar—, así que la distancia entre las dos cifras se cierra casi entera LEYENDO, no escribiendo: \`cola-dictamen.ts\` dice cuántas unidades cubre cada ítem viejo. Los ${cero.size} puntos de piso cero declarado NO cuentan (docs/plans/puntos-piso-cero.json); los ${items.length - servibles.length} en cuarentena no se sirven ni cuentan. Y ojo: el recuento de ejercicios no es la Σ por PUNTO de \`split-conceptos\`, donde un ejercicio puede enseñar varios.` });

const tareas = servibles.filter((x) => x.type === 'mediation').length;
L.push({ eje: 'Mediación (tareas)', medido: `${tareas}`, meta: '230', pasa: tareas >= 230,
  comando: 'npx tsx scripts/recuento-conceptos.ts' });

// ── 4 · Bloque 11 ────────────────────────────────────────────────────
const b11 = BLOCKS.find((b) => b.id === 11);
L.push({ eje: 'Lecciones de b11', medido: `${b11?.lessons.length ?? 0}`, meta: '6-8',
  pasa: (b11?.lessons.length ?? 0) >= 6, comando: 'npx tsx scripts/gate-e5.ts' });

// ── 5 · Triaje de variante ───────────────────────────────────────────
//
// LA META «CERO needs-human» QUEDÓ DEROGADA cuando Edu aprobó la
// cuarentena por excedente en E2#22: **1.161 ítems retirados a propósito
// no son deuda, son la decisión funcionando**. Un gate que los cuenta como
// pendientes dice que faltan mil ciento sesenta y un arreglos, y eso es
// falso. Es el tercer caso de la misma familia en este proyecto —
// `recuento-paso0` midiendo contra los 6.300 derogados, y esta misma
// checklist pidiendo un piso de 12 que llevaba semanas en 8—, y se cura
// igual: **no se borra la línea, se re-etiqueta**.
//
// Y `divergent` no pintaba nada aquí: son divergencias VERIFICADAS con su
// override, o sea selladas. Contarlas como «sin triar» era falso de
// entrada, no sólo desactualizado.
//
// El veredicto pasa a colgar del único número que significa «esto no lo ha
// mirado nadie»: **ítems sin estado resuelto Y SIN MOTIVO ESCRITO**. Es un
// invariante que no se puede ganar cuarentenando, porque cuarentenar exige
// escribir el porqué — y si alguien retira algo sin decir por qué, salta.
const conMotivo = (x: any) => String(x.variantVerificacion ?? '').trim() !== '';
const enCuarentena = items.filter((x) => x.variantStatus === 'needs-human');
const porMotivo = (re: RegExp) => enCuarentena.filter((x) => re.test(String(x.variantVerificacion ?? ''))).length;
const excedente = porMotivo(/excedente/i);
const rotos = porMotivo(/rehacer|roto|irreparable/i);
const olasPrevias = enCuarentena.length - excedente - rotos;
const sinDictamen = items.filter((x) => (x.variantStatus ?? 'unchecked') === 'unchecked');
const esperandoAEdu = sinDictamen.filter(conMotivo).length;
// Lo ÚNICO que cuenta para el veredicto.
const sinMirar = sinDictamen.filter((x) => !conMotivo(x)).length + enCuarentena.filter((x) => !conMotivo(x)).length;

L.push({ eje: 'Triaje de variante',
  medido: `sin mirar: ${sinMirar} · parados en el oído de Edu: ${esperandoAEdu} · retirados por decisión: ${enCuarentena.length}`,
  meta: 'cero sin mirar', pasa: sinMirar === 0, comando: 'npx tsx scripts/triage-variante.ts',
  nota: `**Los ${enCuarentena.length} retirados NO son deuda: son decisiones, y cada uno lleva su motivo escrito en el propio ítem.** ${excedente} son el excedente que Edu aprobó retirar en E2#22 —sobraban para su punto, y su tasa medida de error era ~45 %—, ${olasPrevias} vienen de la cuarentena de olas anteriores (Ola V, el dictamen de «você» de E2#11, la regla-inerte) y ${rotos} son irreparables declarados. La meta «cero needs-human» quedó derogada con la decisión de E2#22 y contarlos como pendientes hace leer que faltan mil arreglos. Los ${esperandoAEdu} parados son los pares mínimos de \`escucha\`: **no se sellan a propósito**, porque la pregunta es si la VOZ realiza el rasgo europeo y eso sólo lo contesta el oído de Edu — sellarlos afirmaría justo lo que está en duda. Su déficit ya sale, una sola vez, en la línea de cobertura. Y los ${items.filter((x: any) => x.variantStatus === 'divergent').length} \`divergent\` no aparecen aquí porque están SELLADOS: son divergencias verificadas con su override.` });

// ── 6 · Lo que este script no mide ───────────────────────────────────
for (const [eje, comando] of [
  ['Suite + typecheck', 'npx vitest run && npx tsc --noEmit'],
  ['Contenido y audio', 'npx tsx scripts/verify-content.ts && npx tsx scripts/check-audio-stale.ts'],
  ['Gates de virginidad', 'npx tsx scripts/check-virginidad.ts --strict'],
  ['Glosas de acentuación', 'npx tsx scripts/check-acentuacion.ts --strict'],
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

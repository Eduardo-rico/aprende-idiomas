// scripts/dictamen-c1c2.ts — lee el dictamen de los 66 puntos que el
// currículo enumera para C1/C2 y dice cuántos son de verdad puntos de
// enseñanza que haya que declarar.
//
// Existe porque «51 puntos sin declarar» era una RESTA (32−7, 34−8) y no
// una lista, y de ahí salían 356 unidades de déficit — el 58 % de todo lo
// que el proyecto cree que le falta. Al sacar el TEXTO de cada segmento,
// una parte no son puntos.
import fs from 'node:fs';
import { ALL_CONCEPTS } from '../lib/data/languages/pt/curriculum';

const D = JSON.parse(fs.readFileSync('docs/plans/puntos-c1c2-dictamen.json', 'utf8'));
const PISO: Record<string, number> = { A1: 8, C1: 8, C2: 6 };
const declarados = new Set(ALL_CONCEPTS.map((c) => c.id));
const ORDEN = ['declarado', 'nuevo', 'oral', 'lexico', 'fragmento', 'artefacto', 'no-es-punto'];
const QUE_ES: Record<string, string> = {
  declarado: 'ya tiene concepto',
  nuevo: 'punto real SIN declarar — cuenta para el déficit',
  oral: 'oral o interacción — a cero POR DECISIÓN',
  lexico: 'meta de vocabulario — se cubre leyendo, no con ejercicios',
  fragmento: 'cola de la frase anterior, partida por el separador',
  artefacto: 'prosa del documento que el regex tragó',
  'no-es-punto': 'objetivo profesional, no contenido',
};

let errores = 0;
console.log('# Los 66 puntos de C1/C2, dictaminados\n');
console.log('| nivel | ' + ORDEN.join(' | ') + ' | TOTAL |');
console.log('|---|' + ORDEN.map(() => '---:').join('|') + '|---:|');
const nuevos: { nivel: string; id: string; texto: string }[] = [];
for (const n of ['A1', 'C1', 'C2']) {
  const xs = D[n] as any[];
  const fila = ORDEN.map((k) => xs.filter((x) => x.clase === k).length);
  console.log(`| ${n} | ${fila.join(' | ')} | ${xs.length} |`);
  for (const x of xs) {
    if (x.clase === 'declarado' && !declarados.has(x.concepto)) {
      console.log(`\n✗ ${n}#${x.n} dice estar declarado como «${x.concepto}» y ese concepto NO existe`);
      errores++;
    }
    if (x.clase === 'nuevo') nuevos.push({ nivel: n, id: x.propuesto, texto: x.texto });
  }
}

const deficitNuevo = nuevos.reduce((a, x) => a + (PISO[x.nivel] ?? 8), 0);
console.log(`\n## Qué significa para el déficit\n`);
console.log('| | puntos | × piso | unidades |');
console.log('|---|---:|---:|---:|');
for (const n of ['A1', 'C1', 'C2']) {
  const k = nuevos.filter((x) => x.nivel === n).length;
  console.log(`| ${n} nuevos | ${k} | ${PISO[n]} | ${k * (PISO[n] ?? 8)} |`);
}
console.log(`| **Σ** | **${nuevos.length}** | | **${deficitNuevo}** |`);
console.log(`\nLa aritmética vieja contaba **51 puntos de C1/C2 y 356 unidades**, más 8 de A1 (64).`);
console.log(`El dictamen deja **${nuevos.length} puntos y ${deficitNuevo} unidades**: **${356 - deficitNuevo} de déficit que no existían**.`);

const yaDeclarados = nuevos.filter((x) => declarados.has(x.id)).length;
console.log(`\n## Los ${nuevos.length} que sí hay que declarar — **${yaDeclarados} ya declarados**\n`);
for (const x of nuevos)
  console.log(`- ${declarados.has(x.id) ? '✔' : '·'} **${x.nivel}** \`${x.id}\` — ${x.texto}`);

console.log(`\n### Clases, para que nadie tenga que adivinar qué significan\n`);
for (const k of ORDEN) console.log(`- \`${k}\`: ${QUE_ES[k]}`);
if (errores) { console.log(`\n✗ ${errores} inconsistencias`); process.exit(1); }

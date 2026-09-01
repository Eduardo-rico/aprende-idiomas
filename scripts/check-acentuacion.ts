// scripts/check-acentuacion.ts — una glosa que nombra una clase de
// acentuación tiene que poder comprobarse contra la palabra.
//
//   npx tsx scripts/check-acentuacion.ts
//   npx tsx scripts/check-acentuacion.ts --strict   # sale 1 si hay fallos
//
// Cierra el nido que lleva desde E2#3 apareciendo en cada ola: «mãe
// esdrújula», «corazón llana», «Brasil paroxítona», «ônibus paroxítona sin
// tilde», «difícil esdrújula». Cinco olas de glosas falsas sobre lo único
// del curso que se puede verificar entero con código.
//
// Es DELIBERADAMENTE callado: sólo opina cuando identifica la palabra sin
// ambigüedad —silabeada en la propia glosa, entrecomillada, o la respuesta
// del ítem si es una sola palabra— y cuando el clasificador no devuelve
// `null`. Un gate que marca de más se deja de leer.
import fs from 'node:fs';
import path from 'node:path';
import { BLOCKS_DIR } from './config';
import { claseDe, NOMBRES, esNombreDeSigno, type Clase } from './lib/acentuacion';

const CAMPOS = ['hintEs', 'explanationEs', 'back', 'front', 'instructionEs'] as const;
const RE_CLASE = new RegExp(`(?<![\\p{L}])(${Object.keys(NOMBRES).join('|')})(?![\\p{L}])`, 'giu');
// «di-FÍ-cil», «ma-mãe», «ô-ni-bus»: la palabra silabeada dentro de la
// glosa. Con `u` y lookaround Unicode, porque `\b` es ASCII y cortaba
// «ô-ni-bus» en «nibus» — la palabra que el gate juzgaba no existía.
const RE_SILABEADA = /(?<![\p{L}])(\p{L}+(?:-\p{L}+)+)(?![\p{L}])/u;
const RE_CITADA = /[«"']([\p{L}]{3,})[»"']/u;

interface Fallo { id: string; campo: string; palabra: string; dice: Clase; es: Clase; texto: string }

const items = fs.readdirSync(BLOCKS_DIR).filter((x) => /^b\d+\.json$/.test(x)).sort()
  .flatMap((f) => JSON.parse(fs.readFileSync(path.join(BLOCKS_DIR, f), 'utf8')) as any[]);

const fallos: Fallo[] = [];
let mirados = 0, sinPalabra = 0, sinVeredicto = 0, enCuarentena = 0;
for (const x of items) {
  // Lo que no se sirve no bloquea: `needs-human` está fuera del embudo y
  // su defecto ya está declarado. Se cuenta, para que no desaparezca.
  if (x.variantStatus === 'needs-human') { enCuarentena++; continue; }
  const d = x.data ?? {};
  for (const campo of CAMPOS) {
    const t = d[campo];
    if (typeof t !== 'string') continue;
    // Se descartan las apariciones que nombran el SIGNO, no la clase.
    const clases = [...t.matchAll(RE_CLASE)]
      .filter((m) => !esNombreDeSigno(t, m.index!))
      .map((m) => NOMBRES[m[1]!.toLowerCase()]!);
    const distintas = new Set(clases);
    // Una PREGUNTA que enumera las tres —«¿es aguda, grave o esdrújula?»—
    // no afirma nada: sólo se juzga cuando la glosa nombra UNA.
    if (distintas.size !== 1) continue;
    mirados++;
    const dice = [...distintas][0]!;
    // La palabra, por orden de fiabilidad.
    const sil = t.match(RE_SILABEADA)?.[1]?.replace(/-/g, '');
    const cit = t.match(RE_CITADA)?.[1];
    const resp = (d.blanks?.[0]?.answer ?? d.answer ?? d.front ?? '').toString().trim();
    // La forma silabeada gana, y si no aparece se prefiere la CITADA sólo
    // cuando lleva acento: en «hábito es proparoxítona… «habito» sin
    // tilde» hay dos palabras y la que se juzga es la primera.
    const conAcento = (w?: string) => (w && /[áâàãéêíóôõú]/i.test(w) ? w : undefined);
    const palabra = sil ?? conAcento(cit) ?? conAcento(resp) ?? cit ?? (/^\p{L}+$/u.test(resp) ? resp : undefined);
    if (!palabra) { sinPalabra++; continue; }
    const es = claseDe(palabra);
    if (!es) { sinVeredicto++; continue; }
    if (es !== dice) fallos.push({ id: x.id, campo, palabra, dice, es, texto: t.slice(0, 100) });
  }
}

console.log(`# Glosas de acentuación\n`);
console.log(`glosas que nombran una clase: ${mirados}`);
console.log(`  · comprobadas: ${mirados - sinPalabra - sinVeredicto}`);
console.log(`  · sin poder identificar la palabra: ${sinPalabra}`);
console.log(`  · el clasificador no se pronuncia: ${sinVeredicto}`);
console.log(`ítems en cuarentena, no mirados: ${enCuarentena}\n`);
if (!fallos.length) { console.log('Ninguna glosa contradice a su palabra.'); process.exit(0); }
console.log(`**${fallos.length} GLOSAS FALSAS:**\n`);
for (const f of fallos) console.log(`- \`${f.id}\` [${f.campo}] «${f.palabra}» es ${f.es}, la glosa dice ${f.dice}\n    "${f.texto}"`);
if (process.argv.includes('--strict')) process.exit(1);

// scripts/check-campos-tirados.ts
//
//   npx tsx scripts/check-campos-tirados.ts [--strict]
//
// CAMPOS QUE EL AUTOR ESCRIBE Y EL ESQUEMA TIRA EN SILENCIO.
//
// Generalización del bug de `hintEs` (E2#14): `z.object` **descarta las
// claves que no declara sin dar error**. Así que un autor podía escribir
// un campo, el esquema decía «válido», y el campo desaparecía antes de
// llegar a la tarjeta. Nadie se enteraba porque no hay error, no hay
// aviso y el ejercicio sigue funcionando — sólo que sin lo que el autor
// quiso poner.
//
// Es un bug **invisible por diseño**: la única forma de verlo es
// comparar las claves de antes y después del parseo, que es lo que hace
// este barrido. Un `strictObject` daría error y sería peor: rompería el
// contenido viejo. Lo que hace falta es SABER qué se cae.
import fs from 'node:fs';
import path from 'node:path';
import { ExerciseDataByTypeSchema } from '../lib/data/zod-schemas';

const DIR = path.join(process.cwd(), 'lib/data/languages/pt/blocks');
const STRICT = process.argv.includes('--strict');

const items: { fichero: string; ex: any }[] = [];
for (const f of fs.readdirSync(DIR).filter((x) => /^b\d+\.json$/.test(x)).sort())
  for (const ex of JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'))) items.push({ fichero: f, ex });

/** Claves que sobreviven al parseo, recursivamente en el primer nivel de
 *  los arrays de objetos (los `blanks`, los `pairs`). */
function clavesQueCaen(antes: any, despues: any, prefijo = ''): string[] {
  if (!antes || typeof antes !== 'object') return [];
  const caidas: string[] = [];
  for (const k of Object.keys(antes)) {
    if (!(k in (despues ?? {}))) { caidas.push(prefijo + k); continue; }
    const a = antes[k], d = despues[k];
    if (Array.isArray(a) && Array.isArray(d)) {
      for (let i = 0; i < Math.min(a.length, d.length); i++)
        caidas.push(...clavesQueCaen(a[i], d[i], `${prefijo}${k}[].`));
    } else if (a && typeof a === 'object' && !Array.isArray(a)) {
      caidas.push(...clavesQueCaen(a, d, `${prefijo}${k}.`));
    }
  }
  return [...new Set(caidas)];
}

const porCampo = new Map<string, { n: number; tipos: Set<string>; ejemplos: string[] }>();
let conPerdida = 0;
for (const { ex } of items) {
  const esquema = (ExerciseDataByTypeSchema as any)[ex.type];
  if (!esquema) continue;
  const r = esquema.safeParse(ex.data);
  if (!r.success) continue;               // los inválidos son otro problema
  const caidas = clavesQueCaen(ex.data, r.data);
  if (!caidas.length) continue;
  conPerdida++;
  for (const c of caidas) {
    const o = porCampo.get(c) ?? { n: 0, tipos: new Set<string>(), ejemplos: [] };
    o.n++; o.tipos.add(ex.type);
    if (o.ejemplos.length < 3) o.ejemplos.push(ex.id);
    porCampo.set(c, o);
  }
}

console.log(`# Campos que el esquema TIRA en silencio — ${items.length} ejercicios\n`);
console.log(`Ejercicios que pierden al menos un campo: **${conPerdida}** (${((conPerdida / items.length) * 100).toFixed(1)} %)\n`);
if (!porCampo.size) {
  console.log('Ninguno. Todo lo que el autor escribe llega a la tarjeta.\n');
  console.log('**Límite honesto del barrido**: sólo ve un campo cuando ALGUIEN YA LO');
  console.log('ESCRIBIÓ. `hintEs` estuvo declarado en el esquema de `conjugation` y');
  console.log('ausente del de `fill_blank` durante 417 ejercicios sin que nadie lo');
  console.log('notara, porque nadie lo escribía — y nadie lo escribía porque no servía');
  console.log('de nada. El bucle se rompe declarando el campo, no barriendo.');
  process.exit(0);
}
console.log('| campo | ejercicios | tipos | ejemplos |');
console.log('|---|---:|---|---|');
for (const [c, o] of [...porCampo].sort((a, b) => b[1].n - a[1].n))
  console.log(`| \`${c}\` | ${o.n} | ${[...o.tipos].join(', ')} | ${o.ejemplos.join(', ')} |`);

console.log(`\nUn campo que el autor escribe y el esquema tira es un bug **invisible por diseño**:`);
console.log(`no hay error, no hay aviso, y el ejercicio funciona — sin lo que el autor quiso poner.`);
if (STRICT && porCampo.size) process.exit(1);

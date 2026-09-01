// scripts/barrido-punto-examinado.ts — ¿el hueco cae sobre el rasgo que
// el punto enseña?
//
//   npx tsx scripts/barrido-punto-examinado.ts
//   npx tsx scripts/barrido-punto-examinado.ts --lista
//
// La lectura de los 60 encontró una clase de defecto que no perseguía
// ningún gate: **el ítem está bien escrito, tiene respuesta única, y aun
// así no mide su punto**. Dos ejemplos reales, los dos sellados como
// correctos por tres revisiones antes de que alguien mirara esto:
//
//   · «Os capitães ___ (trazer) os seus barcos» — hueco en el VERBO,
//     punto declarado `b2-plural-ao`, el plural de los nombres en «-ão».
//   · «As ___ de hoje são difíceis. (lição)» → «lições» — punto declarado
//     `b2-plural-l`, el plural de los nombres en «-l». La respuesta es un
//     plural en «-ões», que es el punto de al lado.
//
// Estos ítems SUMAN COBERTURA A PUNTOS QUE SIGUEN VACÍOS, así que el
// déficit real de esos puntos está subestimado. Ninguna pista los arregla:
// hay que mover el hueco.
//
// LO QUE ESTE BARRIDO PUEDE Y LO QUE NO. Sólo es mecanizable donde el
// nombre del punto declara un RASGO DE SUPERFICIE de la respuesta —una
// terminación, una clase cerrada, un guion—. Un punto como «contraste
// indicativo/conjuntivo» o «registro» no tiene firma en la cadena, y para
// ésos el barrido calla en vez de inventarse un criterio. Por eso los
// hallazgos son AVISOS y no fallos: dicen «mira esto», no «esto está mal».
//
// Y las dos cautelas de siempre, que en esta ola costaron caras:
// el denominador va DENTRO —un cero no dice nada si no dice sobre
// cuántos—, y la regla sólo dispara cuando está segura.
import fs from 'node:fs';
import path from 'node:path';
import { BLOCKS_DIR } from './config';
import { servibleAlAlumno } from './lib/estado-item';
import { textoAnalizable } from './lib/texto-cloze';
import { esClaseCerrada } from './lib/clase-cerrada';

const LISTA = process.argv.includes('--lista');

/** Una regla: qué puntos cubre, qué exige de la respuesta, y cómo se
 *  llama el rasgo cuando falta. `cubre` se compara contra el id del punto
 *  ENTERO —no por prefijo suelto— para no arrastrar puntos vecinos. */
interface Regla {
  nombre: string;
  puntos: RegExp;
  /** true = la respuesta exhibe el rasgo. */
  exhibe: (r: string, frase: string) => boolean;
}

// El inventario de vocales incluye las ACENTUADAS: mi primera versión
// escribió `[aeiou]` a secas y «alguém» —que es literalmente el ejemplo
// del punto «nasal por -m final»— salió marcada como que no tiene nasal.
const V = 'aeiouáéíóúâêôàãõ';
const NASAL = new RegExp(`[ãõ]|[${V}][mn](?![${V}])`, 'i');

export const REGLAS: Regla[] = [
  {
    nombre: 'el plural en «-ão» (ães/ões/ãos)',
    puntos: /^b\d+-plural-ao$/,
    exhibe: (r) => /(ães|ões|ãos)$/i.test(r),
  },
  {
    nombre: 'el plural en «-l» (-is)',
    puntos: /^b\d+-plural-l$/,
    // «papéis», «funis», «azuis»; y el singular en -l si el hueco pide el
    // singular. Lo que NO vale es un plural de otra clase.
    exhibe: (r) => /is$/i.test(r) || /l$/i.test(r),
  },
  {
    nombre: 'un clítico reflexivo',
    puntos: /^b\d+-pron-reflexivo$|reflexiv/i,
    exhibe: (r, s) => /(^|[\s-])(me|te|se|nos|vos)([\s-]|$)/i.test(r) || /-(me|te|se|nos|vos)\b/i.test(s),
  },
  {
    // OJO AL NOMBRE: `b4-contr-narrativa` y `b6-contr-duvida` NO son
    // contracciones, son CONTRASTES. Mi primera versión los metió por
    // prefijo y produjo 17 avisos falsos de 21 — la forma exacta de matar
    // un gate, porque nadie vuelve a leer una lista que miente.
    nombre: 'una contracción de preposición y artículo',
    puntos: /^b\d+-art-contr-|^b\d+-dem-contracciones$/,
    exhibe: (r) => esClaseCerrada(r) && /^(a?o|a?a|à|ao|no|na|do|da|pelo|pela|num|numa|dum|duma|nos|nas|dos|das|aos|às|pelos|pelas|neste|nesta|nesse|nessa|naquele|naquela|deste|desta|desse|dessa|daquele|daquela|disto|disso|daquilo|nisto|nisso|naquilo|àquele|àquela|àquilo)$/i.test(r),
  },
  {
    // Y las de CLÍTICO son otra familia: «mo», «ta», «lho» son
    // contracciones de pleno derecho y no salían en la lista de
    // preposición+artículo. Segunda vez en el mismo barrido que dos cosas
    // distintas comparten nombre y la regla aprueba una y suspende la otra.
    nombre: 'una contracción de dos clíticos (mo, ta, lho)',
    puntos: /^b\d+-pron-contracoes$/,
    exhibe: (r) => /^(m[oa]s?|t[oa]s?|lh[oa]s?|no-l[oa]s?|vo-l[oa]s?)$/i.test(r.trim()),
  },
  {
    nombre: 'la mesóclisis (dos guiones: verbo-clítico-desinencia)',
    puntos: /mesocli|mesócli/i,
    exhibe: (r) => (r.match(/-/g) ?? []).length >= 2,
  },
  // La nasal se parte por SUB-PUNTO, porque cada uno nombra un rasgo
  // distinto y el genérico los aprueba a todos: «uma» tiene nasal y no es
  // un plural en «-ão», que es lo que su punto enseña.
  {
    nombre: 'el plural nasal (ão/ães/ões)',
    puntos: /^b1-nasal-ao-oes$/,
    exhibe: (r) => /(ão|ães|ões|ãos)$/i.test(r),
  },
  {
    nombre: 'la «-m» final',
    puntos: /^b1-nasal-m-final$/,
    exhibe: (r) => /m$/i.test(r),
  },
  {
    nombre: 'la «n»/«m» ante consonante',
    puntos: /^b1-nasal-n-interior$/,
    exhibe: (r) => new RegExp(`[${V}][mn][^${V}]`, 'i').test(r),
  },
  {
    nombre: 'el til sobre a/o',
    puntos: /^b1-nasal-til$/,
    exhibe: (r) => /[ãõ]/i.test(r),
  },
  {
    nombre: 'una vocal nasal (cualquiera)',
    puntos: /^b1-vogais-nasais$/,
    exhibe: (r) => NASAL.test(r),
  },
  {
    nombre: 'una forma verbal con clítico pegado (ênclise)',
    puntos: /^b\d+-coloc-enclise$/,
    exhibe: (r) => /-\p{L}+$/u.test(r),
  },
];

const items = fs.readdirSync(BLOCKS_DIR).filter((x) => /^b\d+\.json$/.test(x)).sort()
  .flatMap((f) => JSON.parse(fs.readFileSync(path.join(BLOCKS_DIR, f), 'utf8')) as any[])
  .filter(servibleAlAlumno)
  .filter((x) => x.type === 'fill_blank' && x.data?.blanks?.length === 1);

type Aviso = { x: any; punto: string; regla: Regla };
const avisos: Aviso[] = [];
const denom = new Map<string, number>();
for (const x of items) {
  const r = String(x.data.blanks[0].answer ?? '');
  const s = textoAnalizable(x, { conRespuesta: true });
  for (const p of (x.concepts ?? []) as string[]) {
    const regla = REGLAS.find((g) => g.puntos.test(p));
    if (!regla) continue;
    denom.set(regla.nombre, (denom.get(regla.nombre) ?? 0) + 1);
    if (!regla.exhibe(r, s)) avisos.push({ x, punto: p, regla });
  }
}

console.log('# ¿El hueco cae sobre el rasgo que el punto enseña?\n');
console.log('Sólo se miran los puntos cuyo nombre declara un rasgo de SUPERFICIE.');
console.log('Los demás —contraste modal, registro, orden— no tienen firma en la');
console.log('cadena, y ahí el barrido calla en vez de inventarse un criterio.\n');
console.log('| rasgo que el punto exige | cloze en esos puntos | no lo exhiben |');
console.log('|---|---:|---:|');
for (const g of REGLAS) {
  const n = denom.get(g.nombre) ?? 0;
  const k = avisos.filter((a) => a.regla === g).length;
  console.log(`| ${g.nombre} | ${n} | ${k ? `**${k}**` : '0'} |`);
}
console.log(`\nTotal: **${avisos.length}** avisos sobre **${[...denom.values()].reduce((a, b) => a + b, 0)}** pares ítem-punto medibles, de ${items.length} cloze de un hueco.`);

if (avisos.length || LISTA) {
  console.log('\n## Los avisos, uno a uno\n');
  for (const a of avisos)
    console.log(`- \`${a.x.id}\` [${a.punto}] no exhibe ${a.regla.nombre}\n  «${textoAnalizable(a.x, { conRespuesta: true })}» → «${a.x.data.blanks[0].answer}»`);
}

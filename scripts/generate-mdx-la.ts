// scripts/generate-mdx-la.ts — LAS NOTAS DE LECCIÓN DEL LATÍN, GENERADAS.
//
//   npx tsx scripts/generate-mdx-la.ts            # comprueba (falla si hay drift)
//   npx tsx scripts/generate-mdx-la.ts --write    # escribe
//
// ══ POR QUÉ GENERADAS Y NO ESCRITAS ══════════════════════════════════
//
// La prosa que el alumno lee como lección es la superficie sin gate del
// proyecto: la auditoría del 2026-09-04 encontró 8 afirmaciones FALSAS en
// ella, y el 2026-09-10 el intento de corregirlas metió 9 más. Escribir a
// mano catorce lecciones de latín sería abrir esa superficie de par en par
// en una lengua nueva.
//
// Así que no se escribe: se DERIVA de `inventario-puntos.ts`, que es el
// documento que el latinista adversarial ya atacó punto por punto. Cada
// `<Rule>` de cada lección es el `nombre` y la `descripcion` de un punto,
// literales. Si mañana el inventario corrige un punto, este script lo
// propaga y un test comprueba que no hay drift — que es justo lo que
// faltaba cuando `concepts.json` del portugués llevaba meses parado en 50
// de 241 conceptos.
//
// Lo que esto NO resuelve, y hay que decirlo: que la descripción del
// inventario sea VERDADERA. El sello responde a una pregunta —«¿es esta
// la prosa revisada?»— y no a la otra.
import fs from 'node:fs';
import path from 'node:path';
import { TALLAS } from '../lib/data/languages/la/curriculum';
import { PUNTOS_LA } from '../lib/data/languages/la/inventario-puntos';

const RAIZ = path.join(process.cwd(), 'lib/data/languages/la/mdx');
const PUNTO = new Map(PUNTOS_LA.map((p) => [p.id, p]));
const write = process.argv.includes('--write');

/** MDX interpreta `{` y `<`. Las descripciones son prosa y no deberían
 *  traerlos; si aparecen, se escapan en vez de romper el build en silencio. */
const seguro = (s: string) => s.replace(/[{}]/gu, (c) => `&#${c.charCodeAt(0)};`).replace(/</gu, '&lt;');

export function mdxDe(t: (typeof TALLAS)[number]): string {
  const partes = t.conceptIds.map((id) => {
    const p = PUNTO.get(id);
    if (!p) throw new Error(`la lección ${t.id} declara «${id}», que no está en el inventario`);
    return `<Rule title="${seguro(p.nombre)}">${seguro(p.descripcion)}</Rule>`;
  });
  return [
    `{/* GENERADO por scripts/generate-mdx-la.ts desde inventario-puntos.ts.`,
    `    No editar a mano: el cambio se pierde y un test lo caza. La prosa`,
    `    de cada regla es la \`descripcion\` del punto, que es lo que el`,
    `    latinista adversarial atacó. */}`,
    '',
    ...partes.flatMap((r) => [r, '']),
  ].join('\n');
}

// ⚠ El cuerpo sólo corre como SCRIPT. Sin esta guarda, importar `mdxDe`
//   desde un test ejecutaba el generador entero y llamaba a
//   `process.exit(0)` durante la carga del módulo: vitest lo reportaba
//   como «0 tests» y el fichero parecía vacío en vez de roto.
function main(): void {
const drift: string[] = [];
for (const t of TALLAS) {
  const dest = path.join(RAIZ, t.mdx);
  const texto = mdxDe(t);
  const actual = fs.existsSync(dest) ? fs.readFileSync(dest, 'utf8') : null;
  if (actual === texto) continue;
  drift.push(t.mdx);
  if (write) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, texto);
  }
}

if (!drift.length) { console.log(`Sin drift: las ${TALLAS.length} notas de lección coinciden con el inventario.`); return; }
console.log(`${drift.length} de ${TALLAS.length} ${write ? 'escritas' : 'DESINCRONIZADAS'}:`);
for (const d of drift) console.log(`  ${d}`);
if (!write) process.exit(1);
}

if (/[/\\]generate-mdx-la\.ts$/.test(process.argv[1] ?? '')) main();

// scripts/etiquetar-c1c2.ts — backfill de los puntos de C1/C2 recién
// declarados sobre ítems que YA los enseñan bajo otro concepto.
//
//   npx tsx scripts/etiquetar-c1c2.ts [--write]
//
// Es la lección de E2#13/E2#14 aplicada al frente nuevo: antes de escribir
// un ítem para un punto en cero, mirar si el punto ya está enseñado y sin
// declarar. Allí cerró cinco puntos sin escribir nada.
//
// CRITERIO, estrecho a propósito: se etiqueta sólo cuando **la TAREA del
// ítem es el punto**, no cuando lo roza. Los 13 `cross_variety` PT↔BR, por
// ejemplo, NO entran en `b12-cortesia-pt-br-es`: practican el cambio de
// variedad, y el punto de C2 pide EXPLICAR en qué se diferencian los
// sistemas. Etiquetar generosamente sube la cobertura y baja la
// enseñanza, que es justo al revés de para qué existe el piso.
import fs from 'node:fs';
import path from 'node:path';
import { BLOCKS_DIR } from './config';
import { ALL_CONCEPTS } from '../lib/data/languages/pt/curriculum';

const AÑADIR: Record<string, string> = {
  // Mediación de textos en el sentido del Companion Volume: los siete
  // `synthesise_sources` son exactamente eso — dos fuentes que se
  // contradicen y un destinatario concreto.
  'b2c2-med-27': 'b12-mediacao-de-textos',
  'b2c2-med-37': 'b12-mediacao-de-textos',
  'b2c2-med-52': 'b12-mediacao-de-textos',
  'b2c2-med-96': 'b12-mediacao-de-textos',
  'b2c2-med-129': 'b12-mediacao-de-textos',
  'b2c2-med-130': 'b12-mediacao-de-textos',
  'b2c2-med-131': 'b12-mediacao-de-textos',
  // Leer la posición social por el habla: uno pide explicar los TRES
  // tratamientos de una escena, el otro qué delata a dos chavales.
  'b2c2-med-134': 'b12-ler-posicao-social',
  'b2c2-med-133': 'b12-ler-posicao-social',
  // Ironía y understatement: los dos piden explicar dónde está la ironía.
  'b2c2-med-36': 'b11-ironia-understatement',
  'b2c2-med-135': 'b11-ironia-understatement',
  // Humor por doble lectura: el «andar → mais depressa» y el João Pateta
  // que entiende literalmente. Los dos son juego de palabras, no chiste
  // cultural — por eso el del bacalhau (med-29) NO entra.
  'b2c2-med-08': 'b12-humor-jogo-palavras',
  'b2c2-med-95': 'b12-humor-jogo-palavras',
  // Mediación intercultural: explicar una costumbre o un refrán de una
  // cultura a la otra, que es el punto entero.
  'b2c2-med-103': 'b11-mediacao-intercultural',
  'b2c2-med-59': 'b11-mediacao-intercultural',
  'b2c2-med-44': 'b11-mediacao-intercultural',
};

const write = process.argv.includes('--write');
const validos = new Set(ALL_CONCEPTS.map((c) => c.id));
for (const c of Object.values(AÑADIR))
  if (!validos.has(c)) { console.error(`✗ «${c}» no está declarado`); process.exit(1); }

const nuevos = new Map<string, number>();
let tocados = 0, yaTenia = 0;
for (const f of fs.readdirSync(BLOCKS_DIR).filter((x) => /^b\d+\.json$/.test(x))) {
  const p = path.join(BLOCKS_DIR, f);
  const arr = JSON.parse(fs.readFileSync(p, 'utf8')) as any[];
  let cambio = false;
  for (const ex of arr) {
    const c = AÑADIR[ex.id];
    if (!c) continue;
    ex.concepts ??= [];
    if (ex.concepts.includes(c)) { yaTenia++; continue; }
    ex.concepts.push(c);
    nuevos.set(c, (nuevos.get(c) ?? 0) + 1);
    tocados++; cambio = true;
    console.log(`  ${ex.id.padEnd(14)} + ${c}   (tenía: ${ex.concepts.slice(0, -1).join(',') || '—'})`);
  }
  if (cambio && write) fs.writeFileSync(p, JSON.stringify(arr, null, 2) + '\n');
}
console.log(`\n${tocados} ítems etiquetados${yaTenia ? ` · ${yaTenia} ya lo tenían` : ''}`);
console.log('\n| punto | ítems que gana | piso | ¿cierra? |');
console.log('|---|---:|---:|---|');
for (const [c, n] of [...nuevos].sort((a, b) => b[1] - a[1])) {
  const piso = c.startsWith('b12') ? 6 : 8;
  console.log(`| \`${c}\` | ${n} | ${piso} | ${n >= piso ? '**SÍ**' : `no (faltan ${piso - n})`} |`);
}
if (!write) console.log('\nDRY-RUN: el corpus no se ha tocado.');

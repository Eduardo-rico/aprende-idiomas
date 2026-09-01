// scripts/hueco.ts — qué falta, por formato, para dimensionar el lote.
//
//   npx tsx scripts/hueco.ts                # todos los formatos
//   npx tsx scripts/hueco.ts mediacion      # sólo uno, con la lista
//
// Existe porque la regla del proyecto es dimensionar el lote por el HUECO
// MEDIDO y no por un número redondo: un ítem por encima del piso baja el
// déficit en cero.
import fs from 'node:fs'; import path from 'node:path';
import { formatoDe } from './lib/formato-punto';
import { BLOCKS_DIR } from './config';
import { ALL_CONCEPTS } from '../lib/data/languages/pt/curriculum';
import { contarPuntos, padreCubierto } from './lib/conceptos-finos';

// El conteo es el CANÓNICO de `conceptos-finos.ts`, el mismo que usa
// `split-conceptos.ts`. La primera versión de este script leía el campo
// `concepts` crudo y daba 353 donde el oficial daba 368, porque no
// aplicaba particiones ni transversales. Dos scripts que cuentan lo mismo
// tienen que contarlo con el mismo código.
const items = fs.readdirSync(BLOCKS_DIR).filter((x) => /^b\d+\.json$/.test(x))
  .flatMap((f) => JSON.parse(fs.readFileSync(path.join(BLOCKS_DIR, f), 'utf8')) as any[]);
const { cuenta: n } = contarPuntos(items);
// El inventario sale de ALL_CONCEPTS, NO de la última foto del déficit:
// la foto es de la sesión anterior y un concepto declarado después queda
// invisible. Es el cero invisible de E2#12, que ya ha mordido tres veces
// por leer la tabla equivocada.
for (const c of ALL_CONCEPTS) if (!n.has(c.id)) n.set(c.id, 0);
const piso = (id: string) => (id.startsWith('b12') ? 6 : 8);
// Mismo ajuste que en `split-conceptos.ts`: un padre con todos sus
// sub-puntos cubiertos no tiene hueco, tiene residuo.
for (const id of [...n.keys()]) if (n.get(id)! < piso(id) && padreCubierto(id, n, piso)) n.set(id, piso(id));

const filas = [...n].filter(([id]) => n.get(id)! < piso(id))
  .map(([id, hay]) => ({ id, hay, falta: piso(id) - hay, f: formatoDe(id) }))
  .sort((a, b) => b.falta - a.falta || a.id.localeCompare(b.id));

const soloUno = process.argv[2];
if (soloUno) {
  const xs = filas.filter((x) => x.f.formato === soloUno);
  console.log(`# Hueco de **${soloUno}** — ${xs.reduce((a, x) => a + x.falta, 0)} unidades en ${xs.length} puntos\n`);
  console.log('| punto | tiene | falta | por qué este formato |');
  console.log('|---|---:|---:|---|');
  for (const x of xs) console.log(`| \`${x.id}\` | ${x.hay} | ${x.falta} | ${x.f.motivo} |`);
} else {
  const por = new Map<string, { p: number; u: number }>();
  for (const x of filas) { const o = por.get(x.f.formato) ?? { p: 0, u: 0 }; o.p++; o.u += x.falta; por.set(x.f.formato, o); }
  console.log('| formato | puntos | unidades |'); console.log('|---|---:|---:|');
  for (const [k, o] of [...por].sort((a, b) => b[1].u - a[1].u)) console.log(`| **${k}** | ${o.p} | ${o.u} |`);
  console.log(`\nΣ ${filas.reduce((a, x) => a + x.falta, 0)} unidades en ${filas.length} puntos`);
}

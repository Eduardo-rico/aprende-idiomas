// scripts/publicar-escucha.ts
//
//   npx tsx scripts/publicar-escucha.ts            # dry-run
//   npx tsx scripts/publicar-escucha.ts --write    # escribe
//
// Publica el lote de pares mínimos como ítems `listening`. No hizo falta
// tipo nuevo: `listening` ya lleva `options`/`answer` y su tarjeta puntúa
// comparando, sin el «siempre true» que tenía `ShadowingCard`.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { BLOCKS, ALL_CONCEPTS } from '../lib/data/languages/pt/curriculum';
import { BLOCKS_DIR } from './config';
import { ITEMS, verificar } from './lotes/escucha-e2-20';

const write = process.argv.includes('--write');
const problemas = [...verificar(ITEMS)];
const porDefecto: string[] = [];
const CONCEPTO = new Map(ALL_CONCEPTS.map((c) => [c.id, c]));
const porBloque = new Map<number, unknown[]>();

ITEMS.forEach((x, i) => {
  const id = `es20-${String(i + 1).padStart(3, '0')}`;
  const c = CONCEPTO.get(x.p);
  if (!c) { problemas.push(`${id}: el punto «${x.p}» no existe`); return; }
  const bloque = BLOCKS.find((b) => b.id === (c as any).blockId);
  if (!bloque) { problemas.push(`${id}: bloque inexistente`); return; }
  const padres = new Set<string>([x.p, ...(((c as any).prereqs ?? []) as string[])]);
  const leccion = bloque.lessons.find((l) => (l.conceptIds ?? []).some((k: string) => padres.has(k))) ?? bloque.lessons[0];
  if (!leccion) { problemas.push(`${id}: bloque sin lecciones`); return; }
  if (!(leccion.conceptIds ?? []).some((k: string) => padres.has(k))) porDefecto.push(`${id} (${x.p}) → ${leccion.id}`);

  const ex = {
    id, blockId: bloque.id, lessonId: leccion.id, difficulty: 2,
    concepts: [x.p], tags: ['e2-20', 'escucha', 'par-minimo'],
    contentHash: crypto.createHash('sha256').update(`${x.audio}|${x.par.join('/')}`).digest('hex'),
    variantStatus: 'unchecked',
    // La verificación dice EXACTAMENTE lo que falta, para que nadie dé el
    // punto por enseñado antes de tiempo.
    variantVerificacion: `Par mínimo de escucha E2#20. Gates: lo locutado está entre las opciones, las dos son palabras distintas con glosas distintas y difieren en una letra. PENDIENTE DE OÍDO: que la voz realice la oposición ${x.rasgo} — eso no lo puede comprobar un script, y hasta que alguien lo diga el punto no se da por enseñado.`,
    register: 'neutro',
    type: 'listening',
    data: {
      audioText: x.audio,
      question: `¿Cuál de las dos oíste? (${x.par[0]} = ${x.glosas[0]} · ${x.par[1]} = ${x.glosas[1]})`,
      options: x.par,
      answer: x.audio,
    },
  };
  if (!porBloque.has(bloque.id)) porBloque.set(bloque.id, []);
  porBloque.get(bloque.id)!.push(ex);
});

console.log(`# Publicar escucha — ${ITEMS.length} ítems\n`);
for (const [b, xs] of porBloque) console.log(`- b${b}: ${xs.length}`);
if (porDefecto.length) { console.log(`\n**${porDefecto.length} en lección por DEFECTO:**`); for (const s of porDefecto) console.log(`- ${s}`); }
if (problemas.length) { console.log(`\n**${problemas.length} PROBLEMAS:**`); for (const s of problemas) console.log(`- ${s}`); process.exit(1); }
console.log('\nGates limpios.');
if (!write) { console.log('DRY-RUN. Repite con --write.'); process.exit(0); }
for (const [b, xs] of porBloque) {
  const f = path.join(BLOCKS_DIR, `b${b}.json`);
  const arr = JSON.parse(fs.readFileSync(f, 'utf8')) as unknown[];
  arr.push(...xs);
  fs.writeFileSync(f, JSON.stringify(arr, null, 2) + '\n');
  console.log(`escrito b${b}.json (+${xs.length})`);
}

// scripts/marcar-metalinguisticos.ts
//
// Repara un fallo de `invert-variant-base.ts`.
//
// Aquella migración intercambió el texto de las variantes —`data` pasó a
// ser europeo y `variantOverrides['pt-br']` brasileño— y eso es correcto
// para un ejercicio normal. Pero hay ejercicios que HABLAN de las
// variantes: su enunciado dice «No Brasil…» o «Em Portugal…». A ésos, el
// intercambio les invirtió el marco además del contenido, y quedaron
// diciendo lo contrario de lo que enseñaban.
//
// Casos confirmados a mano por el lingüista y verificados aquí:
//
//   b10/02ab9316  base europea: «No Brasil… O trem ___ à estação»
//                 override br:  «Em Portugal… O comboio…»
//   b5/affe3489   base europea: «…um novo celular»
//                 override br:  «…um novo telemóvel»
//   b10/c398eb39  base: «Palabra para 'afecto' en PT-BR» → afeto
//                 override br: afecto, que es la grafía pre-AO90 de PORTUGAL
//
// Decidir qué forma va en qué lado exige leer cada ítem: no es un scrub
// mecánico y no se intenta. Lo que sí se puede hacer mecánicamente es
// dejar de servirlos como verificados. Pasan a `needs-human` y a la cola.
//
// Uso:  npx tsx scripts/marcar-metalinguisticos.ts [--write]

import { promises as fs } from 'node:fs';
import path from 'node:path';

const BLOCKS = path.join(process.cwd(), 'lib', 'data', 'languages', 'pt', 'blocks');
const QUEUE = path.join(process.cwd(), 'lib', 'data', 'languages', 'pt', 'variant-human-queue.json');
const WRITE = process.argv.includes('--write');

/** Un ítem es metalingüístico si su texto NOMBRA una variedad. Ésos son
 *  exactamente los que el intercambio pudo dejar del revés. */
const META = /No Brasil|Em Portugal|\bPT-BR\b|\bPT-PT\b|brasileir[oa]|portugu[êe]s europeu|portugu[êe]s do Brasil/i;

interface Ex {
  id: string;
  data: Record<string, unknown>;
  variantOverrides?: Record<string, Record<string, unknown>>;
  variantStatus?: string;
}

async function main() {
  const cola: { id: string; motivo: string; base: string; override: string }[] = [];
  try {
    const prev = JSON.parse(await fs.readFile(QUEUE, 'utf8'));
    if (Array.isArray(prev)) cola.push(...prev);
  } catch { /* la cola aún no existe */ }

  let marcados = 0;
  let revisados = 0;

  for (const f of (await fs.readdir(BLOCKS)).filter((x) => x.endsWith('.json')).sort()) {
    const full = path.join(BLOCKS, f);
    const parsed = JSON.parse(await fs.readFile(full, 'utf8')) as Ex[] | { exercises: Ex[] };
    const items = Array.isArray(parsed) ? parsed : parsed.exercises;

    for (const ex of items) {
      const ov = ex.variantOverrides?.['pt-br'];
      if (!ov) continue;
      revisados++;
      const texto = `${JSON.stringify(ex.data)} ${JSON.stringify(ov)}`;
      if (!META.test(texto)) continue;

      ex.variantStatus = 'needs-human';
      marcados++;
      if (!cola.some((c) => c.id === ex.id)) {
        cola.push({
          id: ex.id,
          motivo:
            'metalingüístico: el enunciado nombra una variedad, así que la inversión del 2026-07-28 pudo dejar el marco al revés. Hay que leerlo y decidir qué forma va en cada lado.',
          base: JSON.stringify(ex.data).slice(0, 260),
          override: JSON.stringify(ov).slice(0, 260),
        });
      }
    }

    if (WRITE) {
      const out = Array.isArray(parsed) ? items : { ...parsed, exercises: items };
      await fs.writeFile(full, JSON.stringify(out, null, 2) + '\n');
    }
  }

  if (WRITE) await fs.writeFile(QUEUE, JSON.stringify(cola, null, 2) + '\n');

  console.log(WRITE ? '=== ESCRITO ===' : '=== DRY-RUN ===');
  console.log(`ítems con override pt-br      : ${revisados}`);
  console.log(`marcados needs-human          : ${marcados}`);
  console.log(`cola humana total             : ${cola.length}`);
  console.log(
    `cobertura europea que queda   : ${revisados - marcados} ítems realmente verificables`,
  );
  if (!WRITE) console.log('\nPara aplicar: npx tsx scripts/marcar-metalinguisticos.ts --write');
}

main().catch((e) => { console.error(e); process.exit(1); });

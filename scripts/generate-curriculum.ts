// scripts/generate-curriculum.ts
// Escribe lib/data/languages/{lang}/concepts.json desde curriculum.ts. Idempotente (sort by id).
import fs from 'node:fs/promises';
import path from 'node:path';
import { dataDir } from '@/lib/data/registry';
import { parseLangArgs } from './lib/cli';
import type { Concept } from '@/lib/data/curriculum-types';

// ⚠ ESTO ESTABA CLAVADO A PORTUGUÉS, con el comentario «Phase 5: solo PT
//   tiene curriculum real». Dejó de ser verdad dos veces sin que nadie
//   tocara este fichero: el rumano tiene currículo desde la fase F y el
//   latín desde el 2026-09-10. Con el import fijo, `--lang la` imprimía un
//   «no-op» tranquilizador y escribía el fichero de PORTUGUÉS: un fallo
//   que devuelve un número plausible. Ahora la fuente se resuelve por
//   idioma, y un scaffold vacío genera `[]`, que es su respuesta correcta.
async function main() {
  const { lang } = parseLangArgs();
  const mod = await import(`../lib/data/languages/${lang}/curriculum`) as { ALL_CONCEPTS: Concept[] };
  const ALL_CONCEPTS = mod.ALL_CONCEPTS;
  const dir = dataDir(lang);
  await fs.mkdir(dir, { recursive: true });
  const file = path.join(dir, 'concepts.json');
  const sorted = [...ALL_CONCEPTS].sort((a, b) => a.id.localeCompare(b.id));
  await fs.writeFile(file, JSON.stringify(sorted, null, 2) + '\n', 'utf8');
  console.log(`Wrote ${sorted.length} concepts → ${path.relative(process.cwd(), file)}`);
}

main().catch(err => { console.error(err); process.exit(1); });

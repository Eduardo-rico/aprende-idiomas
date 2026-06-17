// scripts/generate-curriculum.ts
// Escribe lib/data/languages/{lang}/concepts.json desde curriculum.ts. Idempotente (sort by id).
import fs from 'node:fs/promises';
import path from 'node:path';
import { dataDir } from '@/lib/data/registry';
import { ALL_CONCEPTS } from '@/lib/data/languages/pt/curriculum';
import { parseLangArgs, noopForLang } from './lib/cli';

async function main() {
  const { lang } = parseLangArgs();
  // Phase 5: solo PT tiene curriculum real; scaffolds sin contenido no
  // pueden generar `concepts.json`.
  if (lang !== 'pt') {
    console.log(noopForLang(lang, 'generate-curriculum'));
    return;
  }
  const dir = dataDir(lang);
  await fs.mkdir(dir, { recursive: true });
  const file = path.join(dir, 'concepts.json');
  const sorted = [...ALL_CONCEPTS].sort((a, b) => a.id.localeCompare(b.id));
  await fs.writeFile(file, JSON.stringify(sorted, null, 2) + '\n', 'utf8');
  console.log(`Wrote ${sorted.length} concepts → ${path.relative(process.cwd(), file)}`);
}

main().catch(err => { console.error(err); process.exit(1); });

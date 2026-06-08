// scripts/generate-curriculum.ts
// Escribe lib/data/concepts.json desde curriculum.ts. Idempotente (sort by id).
import fs from 'node:fs/promises';
import path from 'node:path';
import { ALL_CONCEPTS } from '@/lib/data/curriculum';
import { DATA_DIR } from './config';

async function main() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const file = path.join(DATA_DIR, 'concepts.json');
  const sorted = [...ALL_CONCEPTS].sort((a, b) => a.id.localeCompare(b.id));
  await fs.writeFile(file, JSON.stringify(sorted, null, 2) + '\n', 'utf8');
  console.log(`Wrote ${sorted.length} concepts → ${path.relative(process.cwd(), file)}`);
}

main().catch(err => { console.error(err); process.exit(1); });

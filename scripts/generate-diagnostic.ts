// scripts/generate-diagnostic.ts
//
// NOTE: lib/data/diagnostic.json is HAND-WRITTEN and checked in. The LLM
// version proved too unreliable — the model would not respect a strict
// {id, blockId, conceptId, prompt, options, correctIndex} schema even with
// 4 layers of post-processing repairs. For now, regenerate by hand.
//
// This script remains as a placeholder so `npm run generate:diagnostic`
// works in CI. It just reports the current state of the file.
import fs from 'node:fs/promises';
import path from 'node:path';
import { DiagnosticSchema } from './lib/zod-schemas';

const DIAGNOSTIC_FILE = path.join(process.cwd(), 'lib', 'data', 'diagnostic.json');

async function main() {
  try {
    const raw = await fs.readFile(DIAGNOSTIC_FILE, 'utf-8');
    const parsed = DiagnosticSchema.parse(JSON.parse(raw));
    const dist: Record<number, number> = {};
    for (const q of parsed.questions) {
      dist[q.blockId] = (dist[q.blockId] ?? 0) + 1;
    }
    console.log(`✓ diagnostic.json OK: ${parsed.questions.length} questions`);
    console.log(`  Distribution by blockId: ${JSON.stringify(dist)}`);
    console.log(`  generatedAt: ${parsed.generatedAt}`);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      console.error(`✗ diagnostic.json missing. Create it by hand at lib/data/diagnostic.json`);
      console.error(`  Format: { generatedAt, schemaVersion, questions: [{id, blockId, conceptId, prompt, options[4], correctIndex}] }`);
      console.error(`  20 questions, distribution 8/6/6 across blockId 1/2/3.`);
      process.exit(1);
    }
    throw err;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

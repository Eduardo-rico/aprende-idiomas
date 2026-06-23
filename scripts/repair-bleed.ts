// scripts/repair-bleed.ts
// Surgically repairs multilingual "bleed" (stray CJK/Cyrillic/… characters) in
// already-generated content. For each string value that contains foreign-script
// characters, asks the LLM to return a corrected version (same meaning, target
// language preserved, zero foreign-script chars), validates it with the
// anti-bleed guard, and writes it back in place. Does NOT regenerate whole
// blocks — every clean string is left byte-for-byte untouched.
//
//   bash scripts/with-env.sh npx tsx scripts/repair-bleed.ts            # dry-run
//   bash scripts/with-env.sh npx tsx scripts/repair-bleed.ts --write    # apply
//
// After --write, re-run `generate:audio` (full) to resync audio for any changed
// pt text and rebuild the manifest, then GC orphans.
import fs from 'node:fs';
import path from 'node:path';
import { callLlm } from './lib/minimax-llm';
import { findNonLatin } from './lib/latin-guard';

const WRITE = process.argv.includes('--write');
const DATA = path.join(process.cwd(), 'lib/data/languages/pt');

const SYSTEM =
  'Eres un corrector de textos para una app de aprendizaje de portugués (para ' +
  'hispanohablantes). Recibes UN fragmento de texto que contiene caracteres ' +
  'colados de otro sistema de escritura (chino, cirílico, etc.) que corrompen una ' +
  'palabra. Devuelve EXCLUSIVAMENTE el texto corregido: mismo idioma (portugués o ' +
  'español, el que ya predomine), mismo significado y registro, reemplazando la ' +
  'palabra corrompida por la correcta. No agregues comillas, prefijos ni ' +
  'explicaciones. No traduzcas a otro idioma. Conserva la puntuación y los símbolos ' +
  '(→, ≠, ∅, IPA) tal cual.';

const failures: string[] = [];

// Returns the corrected string, or null if the model couldn't produce a clean
// version after retries (non-fatal: caller keeps the original and we report it).
async function fixString(s: string, label: string): Promise<string | null> {
  for (let attempt = 1; attempt <= 4; attempt++) {
    const offenders = [...new Set(findNonLatin(s))].join(' ');
    let text: string;
    try {
      ({ text } = await callLlm({
        system: SYSTEM,
        user:
          `Campo: ${label}\nTexto con caracteres colados (${offenders}):\n${s}\n\n` +
          `Devuelve SOLO el texto corregido. Tu respuesta NO debe contener ningún ` +
          `carácter chino, cirílico, japonés ni coreano.`,
        maxTokens: 800,
      }));
    } catch (err) {
      console.warn(`  retry ${attempt} (${label}): ${err instanceof Error ? err.message : err}`);
      continue;
    }
    // Strip only a matched pair of wrapping double-quotes the model may add;
    // never touch leading/trailing single-quotes (legit in 'word' content).
    let cleaned = text.trim();
    if (cleaned.length >= 2 && cleaned.startsWith('"') && cleaned.endsWith('"')) {
      cleaned = cleaned.slice(1, -1).trim();
    }
    if (findNonLatin(cleaned).length === 0 && cleaned.length > 0) return cleaned;
    console.warn(`  retry ${attempt} (${label}): model returned bleed or empty`);
  }
  failures.push(label);
  console.warn(`  ✗ SKIP ${label} (could not repair): "${s.slice(0, 60)}"`);
  return null;
}

// Walk an arbitrary JSON value, repairing string leaves that contain bleed.
// Returns [repairedValue, count].
async function repairValue(v: unknown, label: string): Promise<[unknown, number]> {
  if (typeof v === 'string') {
    if (findNonLatin(v).length === 0) return [v, 0];
    const fixed = await fixString(v, label);
    if (fixed === null) return [v, 0]; // keep original; reported in failures
    console.log(`  ✓ ${label}\n      - ${v.slice(0, 80)}\n      + ${fixed.slice(0, 80)}`);
    return [fixed, 1];
  }
  if (Array.isArray(v)) {
    let n = 0;
    const out = [];
    for (let i = 0; i < v.length; i++) {
      const [nv, c] = await repairValue(v[i], `${label}[${i}]`);
      out.push(nv); n += c;
    }
    return [out, n];
  }
  if (v && typeof v === 'object') {
    let n = 0;
    const out: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(v)) {
      const [nv, c] = await repairValue(val, `${label}.${k}`);
      out[k] = nv; n += c;
    }
    return [out, n];
  }
  return [v, 0];
}

async function repairFile(file: string): Promise<number> {
  const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
  const rel = path.relative(process.cwd(), file);
  if (findNonLatin(JSON.stringify(raw)).length === 0) return 0;
  console.log(`\n── ${rel} ──`);
  const [fixed, n] = await repairValue(raw, path.basename(file, '.json'));
  if (n > 0 && WRITE) {
    fs.writeFileSync(file, JSON.stringify(fixed, null, 2) + '\n', 'utf8');
    console.log(`  → wrote ${n} fix(es) to ${rel}`);
  }
  return n;
}

async function main(): Promise<void> {
  const targets: string[] = [];
  for (const f of fs.readdirSync(path.join(DATA, 'blocks')).filter(x => /^b\d+\.json$/.test(x)))
    targets.push(path.join(DATA, 'blocks', f));
  for (const f of fs.readdirSync(path.join(DATA, 'stories')).filter(x => /^b\d+-s\d+-.+\.json$/.test(x)))
    targets.push(path.join(DATA, 'stories', f));
  targets.push(path.join(DATA, 'vocab-catalog.json'));

  let total = 0;
  const changedBlocks = new Set<string>();
  for (const file of targets) {
    const n = await repairFile(file);
    total += n;
    if (n > 0) {
      const m = /b(\d+)\.json$/.exec(file) ?? /\/b(\d+)-s/.exec(file);
      if (m?.[1]) changedBlocks.add(m[1]);
    }
  }
  console.log(`\n${WRITE ? 'APPLIED' : 'DRY-RUN'}: ${total} string(s) repaired.`);
  if (changedBlocks.size) console.log(`Blocks touched (re-sync audio): ${[...changedBlocks].sort((a, b) => +a - +b).join(', ')}`);
  if (failures.length) console.log(`UNREPAIRED (${failures.length}, fix by hand): ${failures.join(', ')}`);
  if (!WRITE && total > 0) console.log('Re-run with --write to apply.');
}

main().catch((e) => { console.error('[repair-bleed]', e instanceof Error ? e.message : e); process.exit(1); });

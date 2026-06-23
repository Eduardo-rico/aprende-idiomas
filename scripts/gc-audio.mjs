// Dry-run by default; pass --delete to remove orphans.
// Orphan = public/audio/<hash>.mp3 whose hash is referenced by NOTHING:
// not an exercise, story, story-vocab, lesson example, or manifest.audioIndex.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DATA = path.join(ROOT, 'lib/data/languages/pt');
const AUDIO = path.join(ROOT, 'public/audio');
const DELETE = process.argv.includes('--delete');

const live = new Set();
const add = (h) => { if (typeof h === 'string' && /^[a-f0-9]{64}$/.test(h)) live.add(h); };

// 1) Exercises (block JSON): ex.audio[variant].hash
let exN = 0;
for (const f of fs.readdirSync(path.join(DATA, 'blocks')).filter(x => /^b\d+\.json$/.test(x))) {
  let arr; try { arr = JSON.parse(fs.readFileSync(path.join(DATA, 'blocks', f), 'utf8')); } catch { continue; }
  if (!Array.isArray(arr)) continue;
  for (const ex of arr) {
    if (ex && ex.audio && typeof ex.audio === 'object') {
      for (const v of Object.values(ex.audio)) { if (v && v.hash) { add(v.hash); exN++; } }
    }
  }
}

// 2) Stories: variants[v].audioHash + vocab[].audioHash[v]
let stN = 0;
const storiesDir = path.join(DATA, 'stories');
for (const f of fs.readdirSync(storiesDir).filter(x => /^b\d+-s\d+-.+\.json$/.test(x))) {
  let s; try { s = JSON.parse(fs.readFileSync(path.join(storiesDir, f), 'utf8')); } catch { continue; }
  for (const v of Object.values(s.variants ?? {})) { if (v && v.audioHash) { add(v.audioHash); stN++; } }
  for (const w of s.vocab ?? []) { for (const h of Object.values(w.audioHash ?? {})) { add(h); stN++; } }
}

// 3) Lessons: audio-refs.json -> [lessonId].audioRefs[variant][i].hash
let lsN = 0;
const refsFile = path.join(DATA, 'lessons/audio-refs.json');
if (fs.existsSync(refsFile)) {
  const refs = JSON.parse(fs.readFileSync(refsFile, 'utf8'));
  for (const entry of Object.values(refs)) {
    for (const arr of Object.values(entry.audioRefs ?? {})) {
      for (const r of arr ?? []) { if (r && r.hash) { add(r.hash); lsN++; } }
    }
  }
}

// 3b) Vocab catalog: [].audioHash[variant]
let vcN = 0;
const vcFile = path.join(DATA, 'vocab-catalog.json');
if (fs.existsSync(vcFile)) {
  const vc = JSON.parse(fs.readFileSync(vcFile, 'utf8'));
  for (const e of (Array.isArray(vc) ? vc : [])) {
    for (const h of Object.values(e.audioHash ?? {})) { add(h); vcN++; }
  }
}

// 4) Manifest audioIndex: [variant][text] = hash  (must keep or verify errors)
let mfN = 0;
const manifest = JSON.parse(fs.readFileSync(path.join(DATA, 'manifest.json'), 'utf8'));
for (const idx of Object.values(manifest.audioIndex ?? {})) {
  for (const h of Object.values(idx ?? {})) { add(h); mfN++; }
}

// Scan files
const files = fs.readdirSync(AUDIO).filter(f => f.endsWith('.mp3'));
const orphans = [];
let liveFiles = 0, orphanBytes = 0;
for (const f of files) {
  const h = f.replace(/\.mp3$/, '');
  if (live.has(h)) { liveFiles++; }
  else { orphans.push(f); orphanBytes += fs.statSync(path.join(AUDIO, f)).size; }
}

console.log('Live refs collected:');
console.log(`  exercises: ${exN}, stories: ${stN}, lessons: ${lsN}, vocab: ${vcN}, manifest: ${mfN}`);
console.log(`  unique live hashes: ${live.size}`);
console.log('');
console.log(`Audio files: ${files.length} total | ${liveFiles} live | ${orphans.length} ORPHAN`);
console.log(`Orphan size: ${(orphanBytes / 1024 / 1024).toFixed(1)} MB`);

if (DELETE && orphans.length) {
  for (const f of orphans) fs.rmSync(path.join(AUDIO, f));
  console.log(`\nDELETED ${orphans.length} orphan mp3.`);
} else if (orphans.length) {
  console.log('\n(dry-run — pass --delete to remove. Sample orphans:)');
  console.log(orphans.slice(0, 5).map(f => '  ' + f).join('\n'));
}

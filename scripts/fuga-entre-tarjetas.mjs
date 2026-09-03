// scripts/fuga-entre-tarjetas.mjs — uso: node scripts/fuga-entre-tarjetas.mjs <lang>
//
// Mide una fuga que NINGÚN gate del proyecto ve, porque todos son
// intra-ítem: la respuesta de un ítem impresa en el texto VISIBLE de otro.
// Si FSRS los junta en la misma sesión, el segundo se contesta por memoria
// del primero y deja de medir su punto.
//
// Lo encontró el agente del lote 15 RO con un caso concreto (`aceasta`,
// impresa en una frase del lote 1 y clave de un demostrativo del 15).
//
// EL CRITERIO, y es lo que separa esto de un gate ruidoso: sólo cuenta si
// (a) el otro ítem examina OTRO punto —dentro del mismo punto la forma se
// repite por diseño— y (b) la forma es RARA en el corpus. «o» impresa en
// 50 frases no señala nada; «cafeluță» en dos, sí. El poder de pista es
// inverso a la frecuencia.
import fs from 'node:fs';
import path from 'node:path';

const LANG = process.argv[2] ?? 'ro';
const MAX_APARICIONES = 3;
const D = path.join('lib/data/languages', LANG, 'blocks');

const items = [];
for (const f of fs.readdirSync(D).filter((x) => x.endsWith('.json'))) {
  const j = JSON.parse(fs.readFileSync(path.join(D, f), 'utf8'));
  const arr = Array.isArray(j) ? j : j.items ?? Object.values(j).find(Array.isArray);
  if (arr) items.push(...arr);
}
if (items.length === 0) {
  console.error(`sin ítems en ${D} — ¿lengua equivocada?`);
  process.exit(1);
}

const norm = (s) => String(s).normalize('NFC').toLowerCase();

/** Lo que el alumno LEE en la tarjeta, incluido lo que aparece al revelar. */
function visible(it) {
  const d = it.data ?? {};
  const t = [d.sentence, d.correct, d.sourceText, d.modelAnswer, ...(d.alternatives ?? [])];
  return norm(t.filter(Boolean).join(' \n '));
}
function respuestas(it) {
  const d = it.data ?? {};
  const r = [];
  for (const b of d.blanks ?? []) {
    const v = b?.answer ?? b?.correct ?? b;
    if (typeof v === 'string') r.push(v);
    for (const a of b?.answers ?? []) if (typeof a === 'string') r.push(a);
  }
  return r.map(norm).filter((x) => x && /^[\p{L}\p{M}'’-]+$/u.test(x));
}
const esc = (w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const comoPalabra = (w, txt) => new RegExp(`(?<![\\p{L}\\p{M}])${esc(w)}(?![\\p{L}\\p{M}])`, 'u').test(txt);

const vis = items.map(visible);
const filas = [];
items.forEach((it, i) => {
  if (it.type !== 'fill_blank') return;
  for (const r of respuestas(it)) {
    const mismo = [], otro = [];
    items.forEach((ot, j) => {
      if (j === i || !comoPalabra(r, vis[j])) return;
      const suyos = new Set(ot.concepts ?? []);
      ((it.concepts ?? []).some((c) => suyos.has(c)) ? mismo : otro).push(ot.id);
    });
    filas.push({ id: it.id, punto: (it.concepts ?? [])[0], resp: r, total: mismo.length + otro.length, otro });
  }
});

const utilizable = filas.filter((f) => f.otro.length > 0 && f.total <= MAX_APARICIONES);
console.log(`# Fuga entre tarjetas — ${LANG}\n`);
console.log(`respuestas de hueco analizadas: ${filas.length} (de ${items.length} ítems)`);
console.log(`con la forma impresa en algún otro ítem: ${filas.filter((f) => f.total > 0).length}`);
console.log(`FUGA UTILIZABLE (otro punto + forma rara ≤${MAX_APARICIONES}): ${utilizable.length}\n`);
for (const f of utilizable) console.log(`  «${f.resp}» ${f.id} [${f.punto}] ← impresa en ${f.otro.join(', ')}`);
console.log(`\nNo es un gate de publicación: marcaría demasiado y casi todo inofensivo.`);
console.log(`Es la entrada para ordenar la sesión (ver docs/plans/2026-09-03-fuga-entre-tarjetas.md).`);

// scripts/resincronizar-pista-ru.ts — CUANDO LA PISTA PUBLICADA ESTÁ MAL Y
// LA RESPUESTA ESTÁ BIEN.
//
//   npx tsx scripts/resincronizar-pista-ru.ts --motivo "<por qué>"           # dry-run, todos los lotes
//   npx tsx scripts/resincronizar-pista-ru.ts --motivo "<por qué>" --write
//
// ── POR QUÉ EXISTE ───────────────────────────────────────────────────
// El publicador AÑADE y rechaza una frase ya publicada, así que no hay forma
// de corregir lo que el alumno ya ve. El 2026-09-23 apareció el caso: la
// glosa de `карта` en el lexicón («mapa, carta») entra LITERAL en la pista de
// dos ítems publicados, y para un mexicano «carta» es письмо — en el ítem de
// b5 la frase dice además «старое письмо». Las respuestas estaban bien. Es el
// hermano ruso de `resincronizar-correccion-ro.ts`: retirar y republicar
// sería mentir sobre lo ocurrido.
//
// ── LO QUE HACE Y LO QUE SE NIEGA A HACER ────────────────────────────
// Recalcula cada ítem de cada lote registrado en `lib/lotes-ru.ts` (con la
// glosa NUEVA del lexicón), busca el publicado por su FRASE, y:
//   - si sólo difiere `hintEs`, lo reescribe;
//   - si difieren la respuesta o las alternativas, NO toca nada y sale en
//     rojo: eso no es resincronizar una pista, es contenido nuevo, y va por
//     retirada + publicación con su motivo escrito;
//   - si un ítem del lote no está publicado, lo dice (no lo publica).
// Y antes de nada corre el `verificar` del lote: una pista nueva que rompa un
// gate del lote no se publica.
//
// ── LO QUE CUESTA, dicho ─────────────────────────────────────────────
// `id` y `contentHash` son el hash de `data`, y `hintEs` está DENTRO de
// `data`. Corregir la pista CAMBIA EL ID, y con él el historial FSRS de quien
// ya estudiara la tarjeta. Sacar la pista del hash sería peor (dos ítems con
// distinta pista dejarían de distinguirse). El cambio se imprime ítem por
// ítem para que quede en el commit.
import fs from 'node:fs';
import path from 'node:path';
import { blocksDir } from '../lib/data/registry';
import { hashKey } from './lib/cache';
import { LOTES } from './lib/lotes-ru';

const arg = (n: string) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : undefined; };
const motivo = arg('--motivo');
if (!motivo) { console.error('Falta --motivo "<por qué se corrige la pista>": va al sello del ítem.'); process.exit(2); }
const soloLote = arg('--lote');
const write = process.argv.includes('--write');
const HOY = new Date().toISOString().slice(0, 10);
const clave = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();

const DIR = blocksDir('ru');
const publicados = new Map<string, { fichero: string; ex: any }>();
const ficheros = new Map<string, any[]>();
for (const f of fs.readdirSync(DIR).filter((x) => /^b\d+\.json$/.test(x))) {
  const p = path.join(DIR, f);
  const arr = JSON.parse(fs.readFileSync(p, 'utf8')) as any[];
  ficheros.set(p, arr);
  for (const ex of arr) if (typeof ex?.data?.sentence === 'string') publicados.set(clave(ex.data.sentence), { fichero: p, ex });
}
if (publicados.size === 0) { console.error(`0 ítems publicados leídos en ${DIR}: un cero aquí es «no he mirado» (§A2)`); process.exit(1); }

const cambios: string[] = [];
const problemas: string[] = [];
const tocados = new Set<string>();
let examinados = 0;
for (const [nombre, L] of Object.entries(LOTES)) {
  if (soloLote && nombre !== soloLote) continue;
  for (const v of L.verificar(L.items)) problemas.push(`lote ${nombre}: ${v}`);
  for (const x of L.items) {
    const frase = L.frase(x);
    const pub = publicados.get(clave(frase));
    if (!pub) { problemas.push(`lote ${nombre}: «${frase}» no está publicado — esto corrige, no publica`); continue; }
    examinados++;
    const answer = L.respuestaDe(x);
    const blank = pub.ex.data.blanks?.[0];
    if (!answer || blank?.answer !== answer || JSON.stringify(blank?.alternatives ?? []) !== JSON.stringify(L.alternativasDe(x))) {
      problemas.push(`${pub.ex.id}: la RESPUESTA o las alternativas difieren del lote («${blank?.answer}» publicado, «${answer}» ahora) — eso es contenido nuevo, no una pista`);
      continue;
    }
    const hint = L.pista(x);
    if (pub.ex.data.hintEs === hint) continue;
    const data = { ...pub.ex.data, hintEs: hint };
    const idNuevo = hashKey({ type: 'fill_blank', data, variantOverrides: undefined, esContrast: undefined }).slice(0, 8);
    cambios.push(`${pub.ex.id} → ${idNuevo}  (${(pub.ex.concepts ?? []).join(',')})  «${frase}»\n    antes:   ${pub.ex.data.hintEs}\n    después: ${hint}`);
    pub.ex.data = data;
    pub.ex.id = idNuevo;
    pub.ex.contentHash = hashKey({ type: 'fill_blank', data });
    pub.ex.variantVerificacion = `${pub.ex.variantVerificacion} · PISTA RESINCRONIZADA ${HOY}: ${motivo}`;
    tocados.add(pub.fichero);
  }
}

console.log(`# Resincronizar pistas RU${soloLote ? ` — lote ${soloLote}` : ''} (${examinados} ítems publicados examinados)\n`);
if (problemas.length) { console.log(`**${problemas.length} PROBLEMAS — no se escribe nada:**`); for (const s of problemas) console.log(`- ${s}`); process.exit(1); }
console.log(`**${cambios.length} pistas a corregir**, y con ellas cambia el id (el hash cubre \`data\`):\n`);
for (const c of cambios) console.log(`- ${c}`);
if (!cambios.length) { console.log('\nNada que hacer.'); process.exit(0); }
if (!write) { console.log('\nDRY-RUN. Repite con --write.'); process.exit(0); }
for (const p of tocados) { fs.writeFileSync(p, JSON.stringify(ficheros.get(p), null, 2) + '\n'); console.log(`\nescrito ${path.relative(process.cwd(), p)}`); }

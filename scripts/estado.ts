/**
 * `npx tsx scripts/estado.ts` — la foto del proyecto entero, en un sitio.
 *
 * POR QUÉ EXISTE (2026-09-13). El coordinador venía midiendo el estado a
 * mano con `grep` y `find`, y se equivocó tres veces: contó 42 y 43
 * puntos latinos donde había 48 —porque un `grep` sobre el fuente no ve
 * lo que se construye al ejecutar (§G3)—, y reportó «suite verde, N
 * tests» como si fuera un ESTADO cuando es una foto de un instante.
 *
 * Lo segundo es lo que este script arregla de verdad: con varias
 * sesiones escribiendo en el mismo checkout, la suite dio **1, 10 y 0
 * rojos en tres corridas seguidas sin tocar nada**. Así que toda cifra
 * sale acompañada de QUÉ HABÍA EN VUELO cuando se midió. Una foto con la
 * hora puesta es honesta; sin ella es una afirmación falsa sobre un
 * estado.
 *
 * No mide la suite: eso tarda y cambia. Mide lo que SÍ es estable —
 * ítems publicados, puntos con lote, déficit— y declara el contexto.
 */
import { execSync } from 'node:child_process';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { LANGUAGES, type LanguageId } from '../lib/locales';
import { TITULO } from './paso0-idioma';

const sh = (c: string) => { try { return execSync(c, { encoding: 'utf8' }).trim(); } catch { return ''; } };

function itemsPublicados(lang: LanguageId): number {
  const dir = `lib/data/languages/${lang}/blocks`;
  if (!existsSync(dir)) return 0;
  let n = 0;
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.json'))) {
    const raw = JSON.parse(readFileSync(join(dir, f), 'utf8'));
    n += (Array.isArray(raw) ? raw : (raw as { items?: unknown[] }).items ?? []).length;
  }
  return n;
}

function puntosDeclarados(lang: LanguageId): number | null {
  const f = `lib/data/languages/${lang}/inventario-puntos.ts`;
  if (!existsSync(f)) return null;
  return (readFileSync(f, 'utf8').match(/^\s+P\(\{/gm) ?? []).length;
}

function lecciones(lang: LanguageId): number {
  const dir = `lib/data/languages/${lang}/lessons`;
  if (!existsSync(dir)) return 0;
  let n = 0;
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.json'))) {
    const raw = JSON.parse(readFileSync(join(dir, f), 'utf8'));
    n += (Array.isArray(raw) ? raw : [raw]).length;
  }
  return n;
}

let sinCampo = 0;
function palabrasDeLectura(lang: LanguageId): number {
  const dir = `lib/data/languages/${lang}/lecturas`;
  if (!existsSync(dir)) return 0;
  let n = 0;
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.json'))) {
    try {
      // El campo es `parrafos` en el catálogo real; `bloques` fue un
      // nombre anterior. Se aceptan los dos y se DECLARA cuál se usó, en
      // vez de devolver 0 en silencio si cambia — que fue exactamente el
      // fallo de la primera versión de este script: la columna salía «—»
      // para las seis lenguas y parecía que no había lectura.
      const d = JSON.parse(readFileSync(join(dir, f), 'utf8')) as {
        parrafos?: Array<{ texto?: string }>; bloques?: Array<{ texto?: string }>;
      };
      const trozos = d.parrafos ?? d.bloques;
      if (!trozos) sinCampo++;
      for (const b of trozos ?? []) n += (b.texto ?? '').split(/\s+/).filter(Boolean).length;
    } catch { /* una lectura ilegible se cuenta como 0, y se ve en el total */ }
  }
  return n;
}

const mil = (n: number) => n.toLocaleString('es-ES');

// ── EL CONTEXTO VA PRIMERO, no al final ─────────────────────────────
// Si va al final, se lee la tabla y se ignora. La salvedad tiene que
// llegar ANTES que la cifra que matiza.
const enVuelo = sh('git status --porcelain').split('\n').filter(Boolean);
const rama = sh('git rev-parse --abbrev-ref HEAD');
const head = sh('git log --oneline -1');

console.log(`# Estado · ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`);
console.log(`\nrama \`${rama}\` · HEAD \`${head}\``);
if (enVuelo.length) {
  console.log(`\n⚠ **${enVuelo.length} ficheros en vuelo** mientras se midió. Las cifras de`);
  console.log(`abajo son una FOTO, no un estado: otra sesión está escribiendo.`);
  for (const l of enVuelo.slice(0, 12)) console.log(`     ${l}`);
  if (enVuelo.length > 12) console.log(`     … y ${enVuelo.length - 12} más`);
} else {
  console.log(`\nÁrbol limpio: nadie estaba escribiendo. Las cifras son el estado.`);
}

console.log(`\n| lengua | puntos | con lote | ejercicios | lecciones | lectura |`);
console.log(`|---|---:|---:|---:|---:|---:|`);
for (const lang of LANGUAGES) {
  const pts = puntosDeclarados(lang);
  const it = itemsPublicados(lang);
  const lec = lecciones(lang);
  const pal = palabrasDeLectura(lang);
  console.log(
    `| ${TITULO[lang]} | ${pts ?? '—'} | ${pts === null ? '—' : 'ver abajo'} | ${mil(it)} | ${lec} | ${pal ? mil(pal) : '—'} |`,
  );
}

console.log(`\n**Los "con lote" y los déficits salen de su propio contador**, que es el`);
console.log(`que lee el DATO FINAL y no el código fuente (§G3 de la doctrina):`);
console.log(`\n    npx tsx scripts/deficit-ro.ts     # rumano`);
console.log(`    npx tsx scripts/deficit-ru.ts     # ruso`);
console.log(`    npx tsx -e "import('./scripts/lib/cobertura-de-puntos').then(m=>m.puntosConLote()).then(s=>console.log(s.size))"   # latín`);
if (sinCampo) {
  console.log(`\n⚠ **${sinCampo} lecturas sin campo de texto reconocido**: la cifra de`);
  console.log(`lectura está por debajo de la real. Un contador que devuelve menos no`);
  console.log(`levanta sospecha (§G2), así que lo dice en vez de callárselo.`);
}

console.log(`\nY la suite NO se mide aquí a propósito: con varias sesiones escribiendo`);
console.log(`dio 1, 10 y 0 rojos en tres corridas seguidas sin tocar nada.`);

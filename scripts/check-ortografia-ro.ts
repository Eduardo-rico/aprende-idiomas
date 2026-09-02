// scripts/check-ortografia-ro.ts — el gate de escritura del rumano NUEVO.
//
//   npx tsx scripts/check-ortografia-ro.ts            # informa
//   npx tsx scripts/check-ortografia-ro.ts --strict   # sale 1 si algo nuevo rompe la norma
//
// Norma: DOOM3 (ver `lib/lang/ortografia-ro.ts`). Tres clases: cedilla en
// ș/ț, «î» interior fuera de compuesto, formas de «a fi» con î.
//
// QUÉ CERTIFICA Y QUÉ NO — un sello responde a UNA pregunta:
//   · Certifica que el contenido NUEVO (ejercicios de `blocks/`, textos del
//     inventario de puntos) sigue la norma ortográfica vigente.
//   · NO certifica lengua: una frase puede pasar este gate y ser rumano
//     malo. Eso es del paradigma con su gate en rojo y del lingüista.
//   · NO juzga la biblioteca: 157 lecturas llevan grafía anterior a 1993
//     declarada en `notaOrtografia`, y ahí el texto se respeta. Se mide y
//     se imprime con su denominador, sin bloquear, para que el número
//     exista.
//
// Probado en rojo antes de creerle (tests/unit/ortografia-ro.test.ts):
// «şi», «şi» descompuesta, «cînd», «sînt» disparan; «neîncetat»,
// «început», «într-însul», «sunt» no.
import fs from 'node:fs';
import path from 'node:path';
import { revisarOrtografiaRo, type HallazgoOrtografia } from '../lib/lang/ortografia-ro';
import { PUNTOS_RO } from '../lib/data/languages/ro/inventario-puntos';
import { blocksDir, dataDir } from '../lib/data/registry';

const STRICT = process.argv.includes('--strict');

type Hallazgo = HallazgoOrtografia & { donde: string };
const nuevos: Hallazgo[] = [];

/** Recorre todas las cadenas de un JSON; el campo se nombra por su ruta. */
function recorrer(v: unknown, ruta: string, sink: (texto: string, ruta: string) => void) {
  if (typeof v === 'string') sink(v, ruta);
  else if (Array.isArray(v)) v.forEach((x, i) => recorrer(x, `${ruta}[${i}]`, sink));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) recorrer(x, ruta ? `${ruta}.${k}` : k, sink);
}

// ── 1 · Ejercicios nuevos de `blocks/` ───────────────────────────────
let ejercicios = 0;
const bdir = blocksDir('ro');
if (fs.existsSync(bdir)) {
  for (const f of fs.readdirSync(bdir).filter((x) => x.endsWith('.json'))) {
    const items = JSON.parse(fs.readFileSync(path.join(bdir, f), 'utf8'));
    if (!Array.isArray(items)) continue;
    for (const it of items) {
      ejercicios += 1;
      recorrer(it.data ?? {}, `${f}/${it.id}`, (t, ruta) => {
        for (const h of revisarOrtografiaRo(t)) nuevos.push({ ...h, donde: ruta });
      });
    }
  }
}

// ── 2 · El inventario de puntos: nombre, descripción, motivo ─────────
for (const p of PUNTOS_RO) {
  for (const campo of ['nombre', 'descripcion', 'motivo'] as const) {
    for (const h of revisarOrtografiaRo(p[campo])) nuevos.push({ ...h, donde: `${p.id}.${campo}` });
  }
}

// ── 3 · La biblioteca: se mide, no se juzga ──────────────────────────
const ldir = path.join(dataDir('ro'), 'lecturas');
let lecturas = 0, conNota = 0, conHallazgos = 0, sinNotaConHallazgos: string[] = [];
const porClase: Record<string, number> = {};
if (fs.existsSync(ldir)) {
  for (const f of fs.readdirSync(ldir).filter((x) => x.endsWith('.json'))) {
    const d = JSON.parse(fs.readFileSync(path.join(ldir, f), 'utf8'));
    lecturas += 1;
    const nota = String(d.notaOrtografia ?? '');
    const declaraAntigua = /1993|1953|î|antigu|anterior|apóstrofo|pre-/i.test(nota);
    if (declaraAntigua) conNota += 1;
    let n = 0;
    for (const p of d.parrafos ?? []) for (const h of revisarOrtografiaRo(String(p.texto ?? ''))) { n += 1; porClase[h.clase] = (porClase[h.clase] ?? 0) + 1; }
    if (n) { conHallazgos += 1; if (!declaraAntigua) sinNotaConHallazgos.push(`${f} (${n})`); }
  }
}

console.log('# Ortografía del rumano — norma DOOM3 (coma, â interior, sunt)\n');
console.log(`Contenido NUEVO revisado: ${ejercicios} ejercicios en blocks/ · ${PUNTOS_RO.length} puntos del inventario (nombre, descripción, motivo).`);
if (nuevos.length) {
  console.log(`\n**${nuevos.length} hallazgos en contenido nuevo:**\n`);
  for (const h of nuevos) console.log(`- ${h.donde}: «${h.palabra}» (${h.clase})`);
} else {
  console.log('Hallazgos en contenido nuevo: **0**.');
}
console.log(`\nBiblioteca (informativo, no bloquea): ${lecturas} lecturas · ${conHallazgos} con grafía fuera de la norma · ${conNota} declaran grafía antigua en notaOrtografia.`);
console.log(`Por clase: ${Object.entries(porClase).map(([k, v]) => `${k} ${v}`).join(' · ') || '—'}.`);
if (sinNotaConHallazgos.length) {
  console.log(`\n⚠ ${sinNotaConHallazgos.length} lecturas con grafía fuera de la norma y SIN nota que lo declare (para el agente de lecturas, no para este gate):`);
  for (const x of sinNotaConHallazgos.slice(0, 30)) console.log(`  - ${x}`);
  if (sinNotaConHallazgos.length > 30) console.log(`  … y ${sinNotaConHallazgos.length - 30} más`);
}

if (STRICT && nuevos.length) { console.log('\n✖ --strict: contenido nuevo fuera de la norma.'); process.exit(1); }

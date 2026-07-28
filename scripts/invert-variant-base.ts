// scripts/invert-variant-base.ts
//
// Invierte el modelo de variante: PT-PT pasa a ser el contenido base.
//
// ESTADO ANTERIOR (el que produjo el corpus):
//   scripts/prompts/system.md ordenaba «usa `data` para la versión brasileña
//   y `ptOverrides` para los campos que cambian en europea». De ahí que:
//     ex.data                        → texto brasileño
//     ex.variantOverrides["pt-br"]   → texto EUROPEO, bajo una clave mentirosa
//   lib/exercise-resolver.ts:69 compensaba esa mentira con LEGACY_EUROPEAN_KEY.
//
// ESTADO NUEVO:
//     ex.data                        → texto europeo (la meta del usuario)
//     ex.variantOverrides["pt-br"]   → texto brasileño, sólo los campos que difieren
//     ex.variantStatus               → 'divergent' | 'unchecked' | 'needs-human'
//
// El campo `variantStatus` existe para matar la ambigüedad que causó todo esto:
// hasta hoy, la AUSENCIA de override significaba o «verificado idéntico en las
// dos variantes» o «nadie lo miró», y no había forma de distinguirlas. Por eso
// el 91 % del corpus pasó silenciosamente como brasileño.
//
// Uso:
//   npx tsx scripts/invert-variant-base.ts            (dry-run, no escribe)
//   npx tsx scripts/invert-variant-base.ts --write    (escribe los JSON)

import { promises as fs } from 'node:fs';
import path from 'node:path';

const BLOCKS_DIR = path.join(process.cwd(), 'lib', 'data', 'languages', 'pt', 'blocks');
const WRITE = process.argv.includes('--write');

type Json = Record<string, unknown>;

interface Exercise extends Json {
  id: string;
  type: string;
  data: Json;
  variantOverrides?: Record<string, Json>;
  variantStatus?: string;
}

/** Ítems que NO se migran automáticamente: el override no es una variante,
 *  es otra cosa (contenido distinto, o las dos versiones agramaticales).
 *  Verificados a mano; ver docs/auditoria/2026-07-28-material-nivel-por-nivel.html */
const COLA_HUMANA = new Set([
  // Base y override intercambian avó/avô y AMBOS son agramaticales
  // («Minha avô» = posesivo femenino + sustantivo masculino). Además el ítem
  // entero enseña que avó/avô es una diferencia entre países, que es falso.
  '086de331',
]);

/** El override no cambia la variante: cambia la frase. No es migrable. */
function esOtraFrase(base: Json, ov: Json): boolean {
  for (const k of ['sentence', 'audioText', 'front', 'source']) {
    const b = base[k];
    const o = ov[k];
    if (typeof b === 'string' && typeof o === 'string') {
      // Si comparten menos de la mitad de sus palabras, no es una variante.
      const wb = new Set(b.toLowerCase().split(/\W+/).filter(Boolean));
      const wo = o.toLowerCase().split(/\W+/).filter(Boolean);
      if (wo.length === 0) continue;
      const comunes = wo.filter((w) => wb.has(w)).length;
      if (comunes / wo.length < 0.5) return true;
    }
  }
  return false;
}

const eq = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

interface Stats {
  total: number;
  invertidos: number;
  identicosBorrados: number;
  sinVerificar: number;
  colaHumana: number;
  otraFrase: number;
}

async function main() {
  const stats: Stats = {
    total: 0, invertidos: 0, identicosBorrados: 0,
    sinVerificar: 0, colaHumana: 0, otraFrase: 0,
  };
  const humanQueue: { id: string; motivo: string; base: string; override: string }[] = [];
  const files = (await fs.readdir(BLOCKS_DIR)).filter((f) => f.endsWith('.json')).sort();

  for (const file of files) {
    const full = path.join(BLOCKS_DIR, file);
    const raw = await fs.readFile(full, 'utf8');
    const parsed = JSON.parse(raw) as Exercise[] | { exercises: Exercise[] };
    const items: Exercise[] = Array.isArray(parsed) ? parsed : parsed.exercises;

    for (const ex of items) {
      stats.total++;
      const ov = ex.variantOverrides?.['pt-br'];

      // 1 · Sin override: nadie verificó si esto es europeo. Queda marcado.
      if (!ov || Object.keys(ov).length === 0) {
        ex.variantStatus = 'unchecked';
        stats.sinVerificar++;
        if (ex.variantOverrides && Object.keys(ex.variantOverrides).length === 0) {
          delete ex.variantOverrides;
        }
        continue;
      }

      // 2 · Override idéntico al base: ruido. Se borra.
      const campos = Object.keys(ov);
      if (campos.every((k) => eq(ov[k], ex.data[k]))) {
        delete ex.variantOverrides!['pt-br'];
        if (Object.keys(ex.variantOverrides!).length === 0) delete ex.variantOverrides;
        ex.variantStatus = 'unchecked';
        stats.identicosBorrados++;
        stats.sinVerificar++;
        continue;
      }

      // 3 · Cola humana declarada, o el override es otra frase.
      const motivo = COLA_HUMANA.has(ex.id)
        ? 'marcado a mano: el ítem es incorrecto en las dos variantes'
        : esOtraFrase(ex.data, ov)
          ? 'el override cambia la frase, no la variante'
          : null;
      if (motivo) {
        ex.variantStatus = 'needs-human';
        humanQueue.push({
          id: ex.id, motivo,
          base: JSON.stringify(ex.data).slice(0, 220),
          override: JSON.stringify(ov).slice(0, 220),
        });
        if (COLA_HUMANA.has(ex.id)) stats.colaHumana++; else stats.otraFrase++;
        continue;
      }

      // 4 · La inversión propiamente dicha.
      //     data ← europeo (base + override europeo)
      //     variantOverrides['pt-br'] ← brasileño, sólo los campos que difieren
      const brasileno: Json = {};
      for (const k of campos) {
        if (!eq(ex.data[k], ov[k])) brasileno[k] = ex.data[k];
      }
      ex.data = { ...ex.data, ...ov };
      if (Object.keys(brasileno).length > 0) {
        ex.variantOverrides = { ...ex.variantOverrides, 'pt-br': brasileno };
        ex.variantStatus = 'divergent';
      } else {
        delete ex.variantOverrides!['pt-br'];
        if (Object.keys(ex.variantOverrides!).length === 0) delete ex.variantOverrides;
        ex.variantStatus = 'unchecked';
        stats.sinVerificar++;
      }
      stats.invertidos++;
    }

    if (WRITE) {
      const out = Array.isArray(parsed) ? items : { ...parsed, exercises: items };
      await fs.writeFile(full, JSON.stringify(out, null, 2) + '\n');
    }
  }

  const qPath = path.join(process.cwd(), 'lib', 'data', 'languages', 'pt', 'variant-human-queue.json');
  if (WRITE) await fs.writeFile(qPath, JSON.stringify(humanQueue, null, 2) + '\n');

  console.log(WRITE ? '=== ESCRITO ===' : '=== DRY-RUN (nada escrito) ===');
  console.log(`ejercicios totales          : ${stats.total}`);
  console.log(`invertidos a base europea   : ${stats.invertidos}`);
  console.log(`overrides idénticos borrados: ${stats.identicosBorrados}`);
  console.log(`marcados 'unchecked'        : ${stats.sinVerificar}`);
  console.log(`a cola humana               : ${stats.colaHumana + stats.otraFrase}` +
    ` (${stats.colaHumana} marcados a mano, ${stats.otraFrase} porque el override es otra frase)`);
  console.log();
  console.log(`cobertura europea verificada: ${stats.invertidos} / ${stats.total}` +
    ` = ${((stats.invertidos / stats.total) * 100).toFixed(1)} %`);
  if (!WRITE) console.log('\nPara aplicar: npx tsx scripts/invert-variant-base.ts --write');
}

main().catch((e) => { console.error(e); process.exit(1); });

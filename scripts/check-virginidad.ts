// scripts/check-virginidad.ts — corre el gate de virginidad.
//
//   npx tsx scripts/check-virginidad.ts --self [--prefijo b2c2-] [--umbral 0.34]
//     Cada ítem del corpus contra todos los demás. Con --prefijo, sólo
//     se AUDITAN los ítems cuyo id empieza así (pero se comparan contra
//     el corpus ENTERO — que es justo lo que no se estaba haciendo).
//
//   npx tsx scripts/check-virginidad.ts --nuevos <fichero.json>
//     Un array de ítems candidatos (aún sin publicar) contra el corpus.
//
// --strict sale con código 1 si hay hallazgos: así entra en un gate.
import { promises as fs } from 'node:fs';
import path from 'node:path';
import {
  indexarCorpus, buscarDuplicados, revisarConceptos, UMBRAL, SIN_DECLARAR,
  type ExIndexable,
} from './lib/virginidad';

function arg(nombre: string): string | undefined {
  const i = process.argv.indexOf(nombre);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function cargarCorpus(): Promise<ExIndexable[]> {
  const DIR = path.join(process.cwd(), 'lib/data/languages/pt/blocks');
  const out: ExIndexable[] = [];
  // SOLO los bloques reales: el directorio también acumula sidecars
  // (b*.audio-failures.json del generador de audio) que no son corpus —
  // 87 entradas sin type/id colaron aquí el 2026-08-12.
  for (const f of (await fs.readdir(DIR)).filter((x) => /^b\d+\.json$/.test(x)).sort()) {
    const d = JSON.parse(await fs.readFile(path.join(DIR, f), 'utf8'));
    for (const ex of (Array.isArray(d) ? d : d.exercises)) out.push(ex as ExIndexable);
  }
  return out;
}

async function main() {
  const umbral = Number(arg('--umbral') ?? UMBRAL);
  const corpus = await cargarCorpus();
  const idx = indexarCorpus(corpus);

  console.log(`corpus indexado: ${idx.total} ejercicios · ${idx.df.size} tipos de palabra · umbral ${umbral}`);
  // Ningún descarte silencioso: los que no aportaron texto se declaran.
  if (idx.sinTexto.length) {
    const porTipo: Record<string, number> = {};
    for (const id of idx.sinTexto) {
      const t = idx.items.get(id)?.type ?? '?';
      porTipo[t] = (porTipo[t] ?? 0) + 1;
    }
    console.log(
      `sin texto portugués indexable: ${idx.sinTexto.length} ` +
      `(${Object.entries(porTipo).map(([t, n]) => `${t}×${n}`).join(', ')}) — NO se comparan`,
    );
  }

  let candidatos: ExIndexable[];
  const nuevos = arg('--nuevos');
  if (nuevos) {
    const d = JSON.parse(await fs.readFile(nuevos, 'utf8'));
    candidatos = Array.isArray(d) ? d : d.exercises;
    console.log(`candidatos nuevos: ${candidatos.length} (de ${nuevos})`);
  } else {
    const prefijo = arg('--prefijo');
    candidatos = prefijo ? corpus.filter((e) => e.id.startsWith(prefijo)) : corpus;
    console.log(`auditados: ${candidatos.length}${prefijo ? ` (prefijo «${prefijo}»)` : ' (todo el corpus)'}`);
  }

  // ── Eje 2: reuso de PUNTO (concepts). Va primero porque caza la clase
  //    que el eje por palabras no puede ver.
  console.log('\n── PUNTO (concepts) ──');
  if (idx.sinConceptos.length) {
    console.log(
      `corpus sin declarar punto: ${idx.sinConceptos.length} de ${idx.total} ` +
      `— su punto NO es comparable (declara \`concepts\` para que lo sea)`,
    );
  }
  let puntos = 0, mudos = 0;
  for (const c of candidatos) {
    for (const h of revisarConceptos(idx, c)) {
      if (h.concepto === SIN_DECLARAR) { mudos++; continue; }
      puntos++;
      console.log(
        `  ${c.id} (b${c.blockId ?? '?'}) declara «${h.concepto}» — ` +
        `ya lo enseñan ${h.publicados} ítems, bloques ${h.bloques.join(',')} ` +
        `(ANTERIORES: ${h.bloquesAnteriores.join(',')})`,
      );
      for (const e of h.ejemplos) console.log(`      ${e.id} (b${e.blockId}): ${e.texto}`);
    }
  }
  if (mudos) console.log(`  ${mudos} candidato(s) sin \`concepts\`: su punto no se pudo comparar`);
  console.log(`puntos reenseñados desde un bloque anterior: ${puntos}`);

  // ── Eje 1: reuso de PALABRAS (solape IDF).
  // Cada par sale UNA vez: si A caza a B, no volvemos a informar B↔A.
  const vistos = new Set<string>();
  let pares = 0;
  console.log('\n── PALABRAS (solape IDF) ──');
  for (const c of candidatos) {
    for (const h of buscarDuplicados(idx, c, umbral)) {
      const clave = [c.id, h.id].sort().join('|');
      if (vistos.has(clave)) continue;
      vistos.add(clave);
      pares++;
      const a = idx.items.get(c.id);
      console.log(
        `${String(h.score).padStart(5)}  ${c.id} (b${a?.blockId ?? '?'} ${c.type})` +
        `  ↔  ${h.id} (b${h.blockId ?? '?'} ${h.type})`,
      );
      console.log(`         comparten: ${h.compartidos.join(', ')}`);
      console.log(`         ${h.texto}`);
    }
  }
  console.log(`pares por encima del umbral: ${pares}`);
  if (process.argv.includes('--strict') && (pares > 0 || puntos > 0)) process.exit(1);
}
main().catch((e) => { console.error(e); process.exit(1); });

// scripts/lib/hunspell-ro.ts — el SEGUNDO camino del paradigma rumano.
//
// Hunspell con el diccionario `ro_RO` vendorizado en `tools/hunspell/`
// (LibreOffice). Es un gate LÉXICO: dice si una forma está en el
// diccionario o se deriva de él por sus reglas de afijos. Caza `*draji`,
// `*domne`, `*fate`, `*cumpări`. NO certifica que una forma ausente sea
// mala: rechaza `doctorule` y `tato`, que existen (dexonline). Un sello
// responde a una pregunta, y la de éste es «¿está en el diccionario?».
//
// Se llama en LOTE, una sola vez por conjunto de formas: cada proceso de
// hunspell tarda ~0,3 s en cargar los 2 MB del .dic.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

export const DIC = path.join(process.cwd(), 'tools', 'hunspell', 'ro_RO');

export function hunspellDisponible(): boolean {
  if (!fs.existsSync(DIC + '.dic')) return false;
  const r = spawnSync('hunspell', ['-v'], { encoding: 'utf8' });
  return r.status === 0;
}

/** Las formas que Hunspell NO reconoce, de la lista dada. Las devuelve en
 *  el orden y con la grafía en que llegaron (sin diacríticos perdidos). */
export function desconocidas(formas: string[]): string[] {
  const unicas = [...new Set(formas.filter((f) => f && /\p{L}/u.test(f)))];
  if (!unicas.length) return [];
  // `-l` lista las palabras mal; una por línea, sin repetir.
  const r = spawnSync('hunspell', ['-d', DIC, '-l', '-i', 'UTF-8'], { input: unicas.join('\n') + '\n', encoding: 'utf8' });
  if (r.status !== 0 && !r.stdout) throw new Error(`hunspell falló: ${r.stderr}`);
  const malas = new Set(r.stdout.split('\n').map((x) => x.trim()).filter(Boolean));
  return unicas.filter((f) => malas.has(f));
}

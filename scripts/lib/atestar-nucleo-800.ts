// scripts/lib/atestar-nucleo-800.ts
//
// CONGELA LA SELECCIÓN DEL NÚCLEO DE 800. Genera
// `lib/data/languages/la/nucleo-800.json`.
//
//   npx tsx scripts/lib/atestar-nucleo-800.ts
//
// ── QUÉ ESTÁ HECHO Y QUÉ NO ──────────────────────────────────────────
//
// `l11-nucleo-800` pide 800 lemas «seleccionados sobre los treebanks por
// frecuencia, no por lo que salga en los textos — el error diagnosticado en
// portugués». **La selección es mecánica y está aquí.** Lo que falta no es
// elegir: es la CANTIDAD.
//
// El corpus se escribe sin mácrones. Meter 600 lemas nuevos al lexicón
// exige 600 formas de cita con su cantidad marcada, y este repositorio no
// tiene ninguna fuente que las dé: `vocab-catalog.json` está vacío y
// `fallback-dictionary.ts` es un andamio. Escribirlas a mano sería afirmar
// 600 cantidades sin fuente, que es exactamente lo que la regla de la casa
// prohíbe, y encima en el eje del que cuelga toda la línea de fonología.
//
// Así que este fichero deja la lista lista y dice lo que falta. Quien traiga
// una fuente de cantidad —un diccionario macronizado, un texto macronizado—
// tiene los 800 esperando con su frecuencia, su categoría y si la máquina ya
// los cubre.
//
// ── LO QUE MIDE ──────────────────────────────────────────────────────
//
// Para cada lema del corpus: cuántas veces sale, de qué categoría, y qué
// proporción de sus formas produce ya la máquina de L1. «Cubierto» no es
// «está el lema en una lista»: es que la máquina produzca sus formas, que es
// lo que decide si un marco pasa el gate de vocabulario.
import fs from 'node:fs';
import { leerFrases } from './atestar-ut';
import { formasUnicasDeL1 } from '../../lib/data/languages/la/todas-las-formas';

const SALIDA = 'lib/data/languages/la/nucleo-800.json';
const CUANTOS = 800;

export const sinM = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').normalize('NFC').toLowerCase().replace(/v/g, 'u').replace(/j/g, 'i');

export interface LemaDelNucleo {
  lema: string;
  n: number;
  upos: string;
  /** Cuántos tokens del lema tienen su forma producida por la máquina. */
  cubierto: number;
  /** Las tres formas más frecuentes, para que quien ponga los mácrones vea
   *  qué paradigma está comprando. */
  formas: string[];
}

async function main() {
  const PRODUCE = new Set(formasUnicasDeL1().map(sinM));
  const porLema = new Map<string, { n: number; upos: string; formas: Map<string, number> }>();
  let tokens = 0;
  for (const fr of leerFrases()) {
    for (const t of fr) {
      // Fuera la puntuación, los símbolos, lo no analizado y los nombres
      // propios: `Caesar` ×349 no es vocabulario que enseñar.
      if (['PUNCT', 'X', 'SYM', 'PROPN'].includes(t.upos)) continue;
      tokens++;
      const k = sinM(t.lema);
      let v = porLema.get(k);
      if (!v) { v = { n: 0, upos: t.upos, formas: new Map() }; porLema.set(k, v); }
      v.n++;
      v.formas.set(sinM(t.forma), (v.formas.get(sinM(t.forma)) ?? 0) + 1);
    }
  }
  const orden = [...porLema].sort((a, b) => b[1].n - a[1].n).slice(0, CUANTOS);
  const lista: LemaDelNucleo[] = orden.map(([lema, v]) => ({
    lema, n: v.n, upos: v.upos,
    cubierto: [...v.formas].filter(([f]) => PRODUCE.has(f)).reduce((a, [, n]) => a + n, 0) / v.n,
    formas: [...v.formas].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([f]) => f),
  }));
  const plenos = lista.filter((l) => l.cubierto >= 0.8).length;
  const aCero = lista.filter((l) => l.cubierto === 0).length;
  const cobertura = orden.reduce((a, [, v]) => a + v.n, 0) / tokens;

  fs.writeFileSync(SALIDA, `${JSON.stringify({
    generado: new Date().toISOString().slice(0, 10),
    corpus: 'UD Latin (scripts/.cache/treebanks)',
    comoSeSelecciona: 'por frecuencia de LEMA sobre el corpus entero, fuera puntuación, símbolos, no analizados y nombres propios',
    loQueFalta: 'la CANTIDAD. El corpus no marca mácrones y este repositorio no tiene fuente que los dé. Escribir 600 formas de cita a mano sería afirmar 600 cantidades sin fuente, y justo en el eje del que cuelga la línea de fonología. La selección está hecha; falta un diccionario o un texto macronizados.',
    tokensDelCorpus: tokens,
    cuantos: CUANTOS,
    porcentajeDeTokensQueCubren: Number((100 * cobertura).toFixed(1)),
    yaCubiertosPorLaMaquina: plenos,
    sinNingunaFormaProducida: aCero,
    lemas: lista,
  }, null, 1)}\n`);
  console.log(`${SALIDA}: ${CUANTOS} lemas · cubren el ${(100 * cobertura).toFixed(1)} % de los ${tokens} tokens`);
  console.log(`  la máquina ya cubre ≥80 % de: ${plenos} · a cero: ${aCero}`);
  console.log(`  FALTA: la cantidad. No hay fuente de mácrones en el repositorio.`);
}
if (process.argv[1]?.endsWith('atestar-nucleo-800.ts')) void main();

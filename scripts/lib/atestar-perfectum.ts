// scripts/lib/atestar-perfectum.ts
//
// CONGELA LA ATESTACIÓN DE LA PASIVA DEL PERFECTUM. Genera
// `lib/data/languages/la/atestacion-perfectum.json`.
//
//   npx tsx scripts/lib/atestar-perfectum.ts
//
// ── POR QUÉ AQUÍ LA UNIDAD ES EL BIGRAMA ─────────────────────────────
//
// `amātus est` son dos palabras y ninguna de las dos es la construcción.
// `amātus` sale por su cuenta como adjetivo y `est` es el verbo más
// frecuente de la lengua: preguntar por cada una por separado da que sí
// siempre, y no dice nada de si el alumno se va a encontrar la perífrasis.
// Lo que se cuenta es el par, y se cuenta con el RASGO del participio
// —`VerbForm=Part` y `Tense=Past`—, no con la cadena, porque `facta` es a
// la vez femenino singular y neutro plural y la cadena no los separa.
//
// Medido: 1.502 pares participio+auxiliar en los 227.301 tokens.
import fs from 'node:fs';
import { VERBOS_L1 } from '../../lib/data/languages/la/lexicon-l1';
import { participioPerfecto } from '../../lib/data/languages/la/participios';
import { sinCantidad } from './atestar-irregulares';

const DIR = 'scripts/.cache/treebanks';
const SALIDA = 'lib/data/languages/la/atestacion-perfectum.json';

/** Los auxiliares que forman la perífrasis, con el tiempo que le imponen
 *  al conjunto. `est` + participio NO es presente: es perfecto, y ésa es
 *  la trampa entera del punto. */
export const AUXILIARES: Record<string, { tiempo: 'perfecto' | 'pluscuamperfecto' | 'futuro-perfecto'; numero: 'sg' | 'pl' }> = {
  est: { tiempo: 'perfecto', numero: 'sg' },
  sunt: { tiempo: 'perfecto', numero: 'pl' },
  erat: { tiempo: 'pluscuamperfecto', numero: 'sg' },
  erant: { tiempo: 'pluscuamperfecto', numero: 'pl' },
  erit: { tiempo: 'futuro-perfecto', numero: 'sg' },
  erunt: { tiempo: 'futuro-perfecto', numero: 'pl' },
};

export interface ParPerfectum {
  participio: string; auxiliar: string; n: number;
  genero: string; numero: string;
}

export function contarPares(dir = DIR): { pares: Map<string, ParPerfectum>; total: number } {
  const pares = new Map<string, ParPerfectum>();
  let total = 0;
  for (const f of fs.readdirSync(dir).filter((x) => x.startsWith('la_') && x.endsWith('.conllu'))) {
    let prev = '', prevG = '', prevN = '', prevPart = false;
    for (const l of fs.readFileSync(`${dir}/${f}`, 'utf8').split('\n')) {
      if (!l.trim()) { prev = ''; prevPart = false; continue; }   // el par no cruza frase
      if (l.startsWith('#')) continue;
      const c = l.split('\t');
      if (c.length < 6 || c[0]!.includes('-') || c[0]!.includes('.')) continue;
      const w = sinCantidad(c[1]!), fe = c[5] ?? '';
      const esPart = /VerbForm=Part/.test(fe) && /Tense=Past/.test(fe);
      if (prevPart && AUXILIARES[w]) {
        total++;
        const k = `${prev} ${w}`;
        const y = pares.get(k);
        if (y) y.n++;
        else pares.set(k, { participio: prev, auxiliar: w, n: 1, genero: prevG, numero: prevN });
      }
      prev = w; prevG = fe.match(/Gender=(\w+)/)?.[1] ?? '?'; prevN = fe.match(/Number=(\w+)/)?.[1] ?? '?';
      prevPart = esPart;
    }
  }
  return { pares, total };
}

async function main() {
  const { pares, total } = contarPares();
  // Sólo los pares cuyo participio sale de un verbo de L1: el fichero
  // responde por lo que la máquina produce.
  const deL1 = new Set<string>();
  for (const v of VERBOS_L1) {
    const p = participioPerfecto(v); if (!p) continue;
    const raiz = p.lema.normalize('NFC').slice(0, -2);
    for (const t of ['us', 'a', 'um', 'ī', 'ae', 'ōs', 'ās']) deL1.add(sinCantidad(raiz + t));
  }
  const tabla: Record<string, ParPerfectum & { deL1: boolean }> = {};
  for (const [k, v] of pares) tabla[k] = { ...v, deL1: deL1.has(v.participio) };
  const nL1 = Object.values(tabla).filter((v) => v.deL1).length;
  const porAux: Record<string, number> = {};
  for (const v of Object.values(tabla)) porAux[v.auxiliar] = (porAux[v.auxiliar] ?? 0) + v.n;
  fs.writeFileSync(SALIDA, `${JSON.stringify({
    generado: new Date().toISOString().slice(0, 10),
    corpus: 'UD Latin (scripts/.cache/treebanks)',
    comoSeCuenta: 'bigrama participio(VerbForm=Part,Tense=Past) + auxiliar, sin cruzar frase; género y número del rasgo, no de la cadena',
    paresDistintos: pares.size,
    ocurrencias: total,
    paresConParticipioDeL1: nL1,
    porAuxiliar: porAux,
    tabla,
  }, null, 1)}\n`);
  console.log(`${SALIDA}: ${pares.size} pares distintos · ${total} ocurrencias · ${nL1} con participio de L1`);
  console.log(`  por auxiliar: ${Object.entries(porAux).sort((a, b) => b[1] - a[1]).map(([a, n]) => `${a}=${n}`).join(' ')}`);
}
main();

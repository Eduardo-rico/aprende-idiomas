// scripts/lectura/formas-que-la-maquina-no-produce.ts
//
// LA AUDITORÍA QUE MIRA AL REVÉS.
//
// El gate de atestación pregunta «¿está atestiguada cada forma que produzco?»
// y con eso caza inventos. Esta pregunta la contraria: **¿produzco cada forma
// atestiguada de los lemas que conozco?** Y caza otra cosa: los huecos de la
// máquina, que el primer gate no puede ver porque callar no es inventar.
//
// Lo que destapó al escribirla:
//
//   · LA VOZ PASIVA — 10.669 tokens del corpus anotados `Voice=Pass` y la
//     máquina no tiene ninguna. Es un punto entero, `l6-pasiva-infectum`, y
//     el hueco de máquina más grande que queda.
//   · EL PERFECTO SINCOPADO — «audiērunt» ×25, «audīstis» ×20, «audīsse»
//     ×11, «petiērunt» ×8. 61 tokens de lemas que el lexicón ya tenía.
//     Añadido a `variantesDelPerfecto`.
//   · `loca` ×28 — el plural neutro de `locus`, que también hace `locī`.
//     Heteróclito, pendiente.
//   · Y un ERROR DEL CORPUS: «voice» por «vōce» en `perseus-ud-test`, con la
//     anotación latina correcta (`vōx`, Abl Fem Sing). La frase es «taeterrima
//     vōce de Laserpiciario mimo canticum extorsit». Alguien pasó un
//     corrector inglés por encima.
//
// ── POR QUÉ NO SIRVIÓ UNA HEURÍSTICA MÁS AMPLIA ─────────────────────
//
// Antes de esto probé a buscar tokens que fueran palabras inglesas: devolvió
// 26 y TODOS eran falsos —`quod`, `sunt`, `dīxit`, `haec`, `rebus`—, porque
// el diccionario inglés contiene medio latín. Cero aciertos.
//
// Lo que encontró el error de verdad fue tener un GENERADOR INDEPENDIENTE
// contra el que comparar. Sin la máquina, «voice» sería para siempre «una
// forma de vōx» y nadie lo miraría dos veces.
import fs from 'node:fs';
import { NOMBRES_L1, VERBOS_L1 } from '../../lib/data/languages/la/lexicon-l1';
import { paradigmaNominal, infectum, perfectum, declinacionDe, variantesDelPerfecto } from '../../lib/data/languages/la/paradigma-la';
import type { Persona, TiempoPerfecto } from '../../lib/data/languages/la/paradigma-la';

const D = 'scripts/.cache/treebanks';
const sinM = (s: string) =>
  s.normalize('NFD').replace(/[̄̆]/g, '').normalize('NFC').toLowerCase().replace(/j/g, 'i').replace(/v/g, 'u');

const PERSONAS: Persona[] = ['1sg', '2sg', '3sg', '1pl', '2pl', '3pl'];
const TIEMPOS: TiempoPerfecto[] = ['perfecto', 'pluscuamperfecto', 'futuro-perfecto'];

export function loQueLaMaquinaProduce(): Map<string, Set<string>> {
  const puede = new Map<string, Set<string>>();
  for (const n of NOMBRES_L1) {
    try { declinacionDe(n); } catch { continue; }
    puede.set(sinM(n.lema), new Set(Object.values(paradigmaNominal(n)).map(sinM)));
  }
  for (const v of VERBOS_L1) {
    const s = new Set([...Object.values(infectum(v)), ...Object.values(perfectum(v))].map(sinM));
    for (const p of PERSONAS) for (const t of TIEMPOS)
      for (const f of variantesDelPerfecto(v, p, t)) s.add(sinM(f));
    puede.set(sinM(v.lema), s);
  }
  return puede;
}

export interface NoProducida { lema: string; forma: string; n: number; fichero: string }

export function auditar(): NoProducida[] {
  const puede = loQueLaMaquinaProduce();
  const out = new Map<string, NoProducida>();
  for (const f of fs.readdirSync(D).filter((x) => x.startsWith('la_') && x.endsWith('.conllu')))
    for (const l of fs.readFileSync(`${D}/${f}`, 'utf8').split('\n')) {
      if (!l || l[0] === '#') continue;
      const t = l.split('\t');
      if (t.length < 6 || !/^\d+$/.test(t[0] ?? "")) continue;
      const lem = sinM(t[2] ?? '');
      const s = puede.get(lem);
      if (!s) continue;
      const w = sinM(t[1] ?? '');
      if (s.has(w)) continue;
      const r = Object.fromEntries((t[5] ?? '').split('|').map((x) => x.split('=')));
      // Sólo lo que la máquina SÍ pretende cubrir: indicativo activo y los
      // seis casos. Pedirle subjuntivos o participios sería contarle como
      // hueco lo que nunca dijo tener.
      if (r.VerbForm && r.VerbForm !== 'Fin') continue;
      if (r.Mood && r.Mood !== 'Ind') continue;
      if (r.Voice === 'Pass') continue;
      if (r.Case && !['Nom', 'Acc', 'Gen', 'Dat', 'Abl', 'Voc'].includes(r.Case)) continue;
      const k = `${lem}|${w}`;
      const prev = out.get(k);
      if (prev) prev.n++;
      else out.set(k, { lema: t[2] ?? '', forma: t[1] ?? '', n: 1, fichero: f.replace('la_', '').replace('.conllu', '') });
    }
  return [...out.values()].sort((a, b) => b.n - a.n);
}

if (process.argv[1]?.endsWith('formas-que-la-maquina-no-produce.ts')) {
  const r = auditar();
  console.log(`  formas atestiguadas que la máquina no produce: ${r.length}\n`);
  for (const x of r.slice(0, 25))
    console.log(`    ${x.forma.padEnd(15)} ×${String(x.n).padStart(3)}  lema «${x.lema}»  ${x.fichero}`);
}

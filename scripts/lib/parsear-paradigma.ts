// scripts/lib/parsear-paradigma.ts
//
// DE LA PLANTILLA DE LA FUENTE AL PARADIGMA DEL LEXICÓN.
//
// La fuente da la entrada codificada: `pēs/ped<3>|g=m` para un nombre,
// `3|scrībō|scrīps|scrīpt` para un verbo. De ahí salen el genitivo, el
// género y las partes principales, que es lo que `EntradaNominal` y
// `EntradaVerbal` necesitan.
//
// ══ NO SE REIMPLEMENTA EL MÓDULO DE LA FUENTE ════════════════════════
//
// Esa plantilla la interpreta un módulo de Lua con cientos de casos, y
// copiar su lógica sería copiar sus errores sin poder verlos. Lo que se hace
// es más barato y más seguro: **se PROPONE la forma por la regla general y
// se COMPRUEBA contra el corpus**. El treebank marca `Case=Gen`; si el
// genitivo propuesto no aparece ahí, la entrada no se importa.
//
// Es el mismo reparto que con la cantidad: la fuente propone, un camino de
// otra naturaleza confirma, y lo que no se confirma no entra. Una regla que
// acierta el 90 % sin verificación mete un 10 % de formas inventadas en el
// sitio del que cuelga toda la declinación.
import type { EntradaNominal, EntradaVerbal } from '../../lib/data/languages/la/paradigma-la';

export const sinM = (x: string) => x.normalize('NFD').replace(/[̄̆]/g, '').normalize('NFC')
  .toLowerCase().replace(/v/g, 'u').replace(/j/g, 'i');
/** Las variantes van con `/`: se coge la primera y se dice que había más. */
const primera = (s: string) => (s.split('/')[0] ?? '').trim();

export interface PlantillaNominal {
  lema: string; tema: string | null; declinacion: string | null; genero: string | null;
  /** `<3.I>`: tema en -i, que cambia el genitivo plural (`hostium`). */
  iStem?: boolean;
}

export function leerPlantillaNominal(args: string): PlantillaNominal | null {
  const partes = args.split('|');
  const cabeza = (partes[0] ?? '').trim();
  const m = cabeza.match(/^([^<]+)<([^>]*)>$/);
  if (!m) return null;
  const antes = m[1]!;
  const decl = m[2]!;
  const conTema = antes.includes('/');
  // El sufijo de la declinación lleva información que NO está en `g=`:
  // `<3.N>` dice NEUTRO y `<3.I>` dice tema en -i. `caput/capit<3.N>` no
  // trae `g=` porque el `.N` ya lo dice, y tirarlo dejaba fuera todos los
  // neutros de la 3.ª —`caput`, `flūmen`, `corpus`, `nōmen`, `tempus`—.
  const marcas = decl.split('.').slice(1);
  const gDeMarca = marcas.includes('N') ? 'n' : null;
  return {
    lema: primera(antes),
    tema: conTema ? (antes.split('/')[1] ?? '').trim() : null,
    declinacion: decl.split('.')[0] ?? null,
    iStem: marcas.includes('I'),
    genero: partes.slice(1).map((p) => p.trim()).find((p) => /^g=/.test(p))?.slice(2) ?? gDeMarca,
  };
}

/** El genitivo por la REGLA GENERAL de cada declinación. Propuesta, no
 *  verdad: quien decide es el corpus. */
export function genitivoPropuesto(p: PlantillaNominal): string | null {
  const l = p.lema.normalize('NFC');
  switch (p.declinacion) {
    case '1': return l.replace(/a$/, 'ae');
    // La 2.ª en `-er` NO se deriva: `puer` hace `puerī` y `ager` hace
    // `agrī`, y desde el nominativo no hay forma de saber cuál. La fuente da
    // el tema cuando hace falta —`minister/ministr<2>`— y sin él no se
    // propone nada. Ignorarlo producía `*ministī`, que el corpus refutó con
    // `ministrōrum`.
    case '2':
      if (/(er|ir)$/.test(l)) return p.tema ? `${p.tema}ī` : null;
      return p.tema ? `${p.tema}ī` : l.replace(/(us|um)$/, 'ī');
    case '3': return p.tema ? `${p.tema}is` : (/is$/.test(l) ? l : null);
    case '4': return l.replace(/us$/, 'ūs');
    case '5': return l.replace(/ēs$/, 'eī');
    default: return null;
  }
}

const GENERO: Record<string, 'm' | 'f' | 'n'> = { m: 'm', f: 'f', n: 'n' };

/** La fuente OMITE el género cuando se deduce de la declinación —la 1.ª en
 *  `-a` es femenina, la 2.ª en `-us` masculina, la 2.ª en `-um` neutra— y
 *  sólo lo escribe cuando rompe la regla. Su silencio es información, no
 *  falta de ella: tratarlo como «no hay dato» dejaba fuera 141 de 162
 *  nombres. Es la misma lección de `nam` y `quoniam`, por tercera vez.
 *
 *  Lo que la regla propone, el corpus lo confirma: el treebank marca
 *  `Gender=`. */
export function generoPropuesto(p: PlantillaNominal): 'm' | 'f' | 'n' | null {
  if (p.genero) return GENERO[p.genero] ?? null;
  const l = p.lema.normalize('NFC');
  if (p.declinacion === '1' && /a$/.test(l)) return 'f';
  if (p.declinacion === '2' && /um$/.test(l)) return 'n';
  if (p.declinacion === '2' && /(us|er|r)$/.test(l)) return 'm';
  if (p.declinacion === '4' && /ū$/.test(l)) return 'n';
  if (p.declinacion === '4' && /us$/.test(l)) return 'm';
  if (p.declinacion === '5') return 'f';
  return null;   // la 3.ª no tiene regla: sin `g=` no se importa
}

export function entradaNominal(p: PlantillaNominal): EntradaNominal | null {
  const gen = genitivoPropuesto(p);
  const g = generoPropuesto(p);
  if (!gen || !g) return null;
  return { lema: p.lema, genitivo: gen, genero: g, glosa: '' };
}

// ══ VERBOS ═══════════════════════════════════════════════════════════

export interface PlantillaVerbal {
  conjugacion: string; presente: string; temaPerfecto: string | null; temaSupino: string | null;
}

export function leerPlantillaVerbal(args: string): PlantillaVerbal | null {
  const partes = args.split('|').map((x) => x.trim());
  const conj = (partes[0] ?? '').split('.')[0] ?? '';
  if (!conj || conj === 'irreg') return null;     // los irregulares van a mano
  const pres = primera(partes[1] ?? '');
  if (!pres) return null;
  // Los DEPONENTES tienen lema en `-or` y no van a `VERBOS_L1`: su
  // paradigma es el pasivo de una activa que no existe y vive en
  // `DEPONENTES_L1`. Metidos aquí producían `*arbitrorāvī`.
  if (/(or|ior)$/.test(pres.normalize('NFC'))) return null;
  const resto = partes.slice(2).filter((x) => x !== '' && !x.includes('='));
  return {
    conjugacion: conj.replace(/\+.*$/, ''),
    presente: pres,
    temaPerfecto: resto[0] ? primera(resto[0]) : null,
    temaSupino: resto[1] ? primera(resto[1]) : null,
  };
}

/** La raíz DEPENDE DE LA CONJUGACIÓN, y ahí tenía un fallo que el corpus
 *  cazó: en la 1.ª sólo se quita la `-ō` —`nūntiō` da raíz `nūnti`— y
 *  quitando `-iō` salía `*nūntāvī` en vez de `nūntiāvī`. En la 3.ª y la 4.ª
 *  sí se quita la `-iō` entera. Una regla que recorta igual cuatro
 *  conjugaciones distintas se equivoca en la que no mira. */
export function raizDe(p: PlantillaVerbal): string {
  const l = p.presente.normalize('NFC');
  if (p.conjugacion === '1') return l.replace(/ō$/, '');
  if (p.conjugacion === '2') return l.replace(/(eō|ō)$/, '');
  return l.replace(/(iō|ō)$/, '');
}

/** La RAÍZ es consonántica y el TEMA lleva la vocal temática. `putō` da raíz
 *  `put` y tema `putā`; `nūntiō` da raíz `nūnti` y tema `nūntiā`. Confundir
 *  las dos produce `*putre` por un lado o `*nūntāvī` por el otro, según se
 *  recorte de más o de menos. Las dos versiones equivocadas salieron hoy. */
export function temaDe(p: PlantillaVerbal): string | null {
  const raiz = raizDe(p);
  switch (p.conjugacion) {
    case '1': return `${raiz}ā`;
    case '2': return `${raiz}ē`;
    case '3': return raiz;        // la 3.ª no tiene vocal temática larga
    case '4': return `${raiz}ī`;
    default: return null;
  }
}

/** El infinitivo por la conjugación. La fuente no lo da: lo da el número. */
export function infinitivoPropuesto(p: PlantillaVerbal): string | null {
  const t = temaDe(p);
  if (t === null) return null;
  return p.conjugacion === '3' ? `${t}ere` : `${t}re`;
}

export function entradaVerbal(p: PlantillaVerbal): EntradaVerbal | null {
  const inf = infinitivoPropuesto(p);
  if (!inf) return null;
  // Sin tema de perfecto, la 1.ª y la 4.ª lo hacen en `-āvī`/`-īvī` por
  // regla; las demás no se adivinan y la entrada no entra.
  const t = temaDe(p);
  const regular = t !== null && (p.conjugacion === '1' || p.conjugacion === '4');
  const perf = p.temaPerfecto ? `${p.temaPerfecto}ī` : regular ? `${t}vī` : null;
  const sup = p.temaSupino ? `${p.temaSupino}um` : regular ? `${t}tum` : null;
  if (!perf) return null;
  return { lema: p.presente, infinitivo: inf, perfecto: perf, ...(sup ? { supino: sup } : {}), glosa: '' };
}

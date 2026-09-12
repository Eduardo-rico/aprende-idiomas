// scripts/lib/atestar-irregulares.ts
//
// CONGELA LA ATESTACIÓN DE LOS SEIS IRREGULARES. Genera
// `lib/data/languages/la/atestacion-irregulares.json`.
//
//   npx tsx scripts/lib/atestar-irregulares.ts
//
// ── POR QUÉ UN FICHERO Y NO UNA CONSULTA EN CALIENTE ─────────────────
//
// Los treebanks viven en `scripts/.cache/treebanks/` y están en
// `.gitignore`: 227.301 tokens que no van al repositorio. Un gate que los
// leyera en caliente pasaría aquí y fallaría en cualquier sitio donde no
// estén, así que la cuenta se congela en un JSON comprometido y este script
// es la única forma de volver a producirla.
//
// ── LAS DOS CUENTAS QUE NO SON LA MISMA ──────────────────────────────
//
// `nōlō` hace su segunda y su tercera del singular con `nōn` suelto delante
// de la forma de `volō`. Contar «nōn vīs» por la palabra `vīs` le atribuye
// las 46 apariciones de `volō`, y eso es falso: lo que hay que contar es el
// BIGRAMA. Medido, son 2 y no 46. La diferencia no es cosmética — un lote
// que presuma de 46 atestaciones para una forma que sale dos veces está
// mintiendo con datos verdaderos.
import fs from 'node:fs';
import path from 'node:path';
import { IRREGULARES_L1, conjugarIrregular } from '../../lib/data/languages/la/irregulares';
import type { Persona, Tiempo } from '../../lib/data/languages/la/paradigma-la';

const DIR = 'scripts/.cache/treebanks';
const SALIDA = 'lib/data/languages/la/atestacion-irregulares.json';
const PERSONAS: Persona[] = ['1sg', '2sg', '3sg', '1pl', '2pl', '3pl'];
const TIEMPOS: Tiempo[] = ['presente', 'imperfecto', 'futuro'];

/** El corpus escribe sin mácrons y no distingue u/v ni i/j. */
export const sinCantidad = (s: string) =>
  s.normalize('NFD').replace(/[̄̆]/g, '').normalize('NFC').toLowerCase().replace(/v/g, 'u').replace(/j/g, 'i');

/** Lo que escribiría quien aplicara la regla general de la 3.ª al lema.
 *  No es un hombre de paja: es exactamente lo que enseña `l5-presente`. */
export const DESINENCIAS_REGULARES: Record<Tiempo, string[]> = {
  presente: ['ō', 'is', 'it', 'imus', 'itis', 'unt'],
  imperfecto: ['ēbam', 'ēbās', 'ēbat', 'ēbāmus', 'ēbātis', 'ēbant'],
  futuro: ['am', 'ēs', 'et', 'ēmus', 'ētis', 'ent'],
};

export function regularIngenuo(lema: string, p: Persona, t: Tiempo): string {
  const tema = lema.normalize('NFC').replace(/ō$/, '');
  return tema + DESINENCIAS_REGULARES[t][PERSONAS.indexOf(p)]!;
}

if (process.argv[1] && path.resolve(process.argv[1]).endsWith('atestar-irregulares.ts')) {
  const unigramas = new Map<string, number>();
  const bigramas = new Map<string, number>();
  for (const f of fs.readdirSync(DIR).filter((x) => x.startsWith('la_') && x.endsWith('.conllu'))) {
    let previa = '';
    for (const l of fs.readFileSync(path.join(DIR, f), 'utf8').split('\n')) {
      if (!l.trim()) { previa = ''; continue; }
      if (l[0] === '#') continue;
      const c = l.split('\t');
      if (c.length < 10 || c[0]!.includes('-')) continue;
      const w = sinCantidad(c[1] ?? '');
      unigramas.set(w, (unigramas.get(w) ?? 0) + 1);
      if (previa) bigramas.set(`${previa} ${w}`, (bigramas.get(`${previa} ${w}`) ?? 0) + 1);
      previa = w;
    }
  }

  const out: Record<string, Record<string, { forma: string; n: number; regular: string; refuta: boolean }>> = {};
  let refutan = 0, atestiguadas = 0, celdas = 0;
  for (const v of IRREGULARES_L1) {
    out[v.lema] = {};
    for (const t of TIEMPOS) for (const p of PERSONAS) {
      celdas++;
      const forma = conjugarIrregular(v, p, t);
      const regular = regularIngenuo(v.lema, p, t);
      const refuta = forma.normalize('NFC') !== regular.normalize('NFC');
      // Una forma con espacio es una LOCUCIÓN y se cuenta como BIGRAMA: la
      // palabra suelta le prestaría las cuentas de otro verbo. Es la
      // diferencia entre decir que «nōn vīs» sale 46 veces y decir que sale
      // 2, y la primera cifra es falsa con datos verdaderos.
      const clave = sinCantidad(forma);
      const n = clave.includes(' ') ? (bigramas.get(clave) ?? 0) : (unigramas.get(clave) ?? 0);
      out[v.lema]![`${t}.${p}`] = { forma, n, regular, refuta };
      if (refuta) { refutan++; if (n > 0) atestiguadas++; }
    }
  }

  fs.writeFileSync(SALIDA, `${JSON.stringify({
    generado: new Date().toISOString().slice(0, 10),
    corpus: 'la_perseus + la_proiel (UD)',
    comoSeCuenta: 'las formas de una palabra por unigrama; las locuciones de `nōlō` («nōn vīs») por BIGRAMA, porque contarlas por la palabra suelta les presta las apariciones de `volō`',
    celdas, refutanLaReglaGeneral: refutan, deEsasAtestiguadas: atestiguadas,
    lemas: out,
  }, null, 1)}\n`);
  console.log(`${celdas} celdas · ${refutan} refutan la regla general · ${atestiguadas} de ésas están atestiguadas`);
  console.log(`escrito ${SALIDA}`);
}

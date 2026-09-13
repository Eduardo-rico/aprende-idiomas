// scripts/lib/atestar-pares-cantidad.ts
//
// CONGELA LA CUENTA REAL DE CADA MIEMBRO DE LOS PARES DE CANTIDAD.
// Genera `lib/data/languages/la/atestacion-pares-cantidad.json`.
//
//   npx tsx scripts/lib/atestar-pares-cantidad.ts
//
// ── POR QUÉ NO VALE CONTAR POR LA CADENA ─────────────────────────────
//
// **El corpus no lleva mácrones.** `venit` y `vēnit` son la misma cadena
// ahí, así que buscarlas por texto devuelve 236 para las DOS — el mismo
// número dos veces, que es la señal de que la comprobación no está
// contestando. Un gate que exige «los dos miembros atestiguados» con esa
// cuenta aprueba siempre: es un fallo que devuelve un número plausible.
//
// Lo que SÍ separa los dos miembros es la ANOTACIÓN, que el treebank trae:
// `Tense=Pres` contra `Tense=Past`, `Case=Nom` contra `Case=Abl`. Se cuenta
// por lema más rasgos, que es preguntarle a la fuente en su idioma.
//
// ── Y CUANDO NO SE PUEDE MAPEAR, SE DICE ─────────────────────────────
//
// No todas las casillas del proyecto tienen traducción a rasgos UD. Las que
// no la tienen salen con `n: null` —no con cero—, porque «no lo sé» y «no
// aparece» son cosas distintas y confundirlas es lo que este proyecto lleva
// todo el día evitando.
import fs from 'node:fs';
import path from 'node:path';
import { contarCorpus, sinCantidad } from './atestar-irregulares';
import { paresDeCantidad } from '../../lib/data/languages/la/pares-de-cantidad';

const SALIDA = 'lib/data/languages/la/atestacion-pares-cantidad.json';
const DIR = 'scripts/.cache/treebanks';

const CASOS: Record<string, string> = { nom: 'Nom', ac: 'Acc', gen: 'Gen', dat: 'Dat', abl: 'Abl', voc: 'Voc' };
const TIEMPOS: Record<string, string> = { presente: 'Pres', imperfecto: 'Past', futuro: 'Fut', perfecto: 'Past', pluscuamperfecto: 'Past', 'futuro-perfecto': 'Fut' };

/** Los rasgos que se pueden exigir a partir de la clave del dominio.
 *  Devuelve `null` si la casilla no se sabe traducir. */
export function rasgosDe(clave: string): Record<string, string> | null {
  const p = clave.split('.');
  const r: Record<string, string> = {};
  // nominal: lema.caso.num
  if (p.length === 3 && CASOS[p[1]!] && (p[2] === 'sg' || p[2] === 'pl')) {
    r.Case = CASOS[p[1]!]!; r.Number = p[2] === 'sg' ? 'Sing' : 'Plur'; return r;
  }
  // verbal: lema.tiempo.persona
  if (p.length === 3 && TIEMPOS[p[1]!] && /^[123](sg|pl)$/.test(p[2]!)) {
    r.Tense = TIEMPOS[p[1]!]!;
    r.Person = p[2]![0]!;
    r.Number = p[2]!.endsWith('sg') ? 'Sing' : 'Plur';
    // El perfecto y el imperfecto comparten `Tense=Past` y se separan por
    // el aspecto, que UD sí anota.
    if (p[1] === 'perfecto') r.Aspect = 'Perf';
    if (p[1] === 'imperfecto') r.Aspect = 'Imp';
    return r;
  }
  // pronominal o adjetival: lema.genero.caso.num
  if (p.length === 4 && CASOS[p[2]!] && (p[3] === 'sg' || p[3] === 'pl')) {
    r.Case = CASOS[p[2]!]!; r.Number = p[3] === 'sg' ? 'Sing' : 'Plur'; return r;
  }
  return null;
}

if (process.argv[1] && path.resolve(process.argv[1]).endsWith('atestar-pares-cantidad.ts')) {
  // Se recorre el corpus guardando (forma, lema, rasgos) para poder contar
  // por anotación y no por cadena.
  const tokens: { w: string; lema: string; feats: Record<string, string> }[] = [];
  for (const f of fs.readdirSync(DIR).filter((x) => x.startsWith('la_') && x.endsWith('.conllu')))
    for (const l of fs.readFileSync(path.join(DIR, f), 'utf8').split('\n')) {
      if (!l.trim() || l[0] === '#') continue;
      const c = l.split('\t');
      if (c.length < 6 || c[0]!.includes('-')) continue;
      const feats: Record<string, string> = {};
      for (const kv of (c[5] ?? '').split('|')) { const [k, v] = kv.split('='); if (k && v) feats[k] = v; }
      tokens.push({ w: sinCantidad(c[1] ?? ''), lema: sinCantidad(c[2] ?? ''), feats });
    }
  contarCorpus();   // valida que la caché está donde se espera

  const pares = paresDeCantidad();
  const out: Record<string, { tipo: string; vocal: string; miembros: { forma: string; clave: string; n: number | null }[] }> = {};
  let conCuenta = 0, sinMapear = 0, unoACero = 0;
  for (const p of pares) {
    const miembros = p.miembros.map((m) => {
      const clave = m.claves[0]!;
      const lema = sinCantidad(clave.split('.')[0]!);
      const r = rasgosDe(clave);
      if (!r) { sinMapear++; return { forma: m.forma, clave, n: null }; }
      const n = tokens.filter((t) => t.lema === lema && t.w === sinCantidad(m.forma)
        && Object.entries(r).every(([k, v]) => t.feats[k] === v)).length;
      conCuenta++;
      return { forma: m.forma, clave, n };
    });
    if (miembros.some((m) => m.n === 0)) unoACero++;
    out[p.sinMacrones] = { tipo: p.tipo, vocal: p.vocal, miembros };
  }
  fs.writeFileSync(SALIDA, `${JSON.stringify({
    generado: new Date().toISOString().slice(0, 10),
    comoSeCuenta: 'por LEMA más RASGOS del treebank, no por cadena: el corpus no lleva mácrones y buscar la cadena devuelve el mismo número para los dos miembros del par',
    pares: pares.length, miembrosConCuenta: conCuenta, miembrosSinMapear: sinMapear, paresConUnMiembroACero: unoACero,
    lista: out,
  }, null, 1)}\n`);
  console.log(`${pares.length} pares · ${conCuenta} miembros contados por anotación · ${sinMapear} sin mapear · ${unoACero} pares con un miembro a cero`);
  console.log(`escrito ${SALIDA}`);
}

// lib/data/languages/la/pares-de-cantidad.ts
//
// LOS PARES QUE SÓLO SE SEPARAN POR LA CANTIDAD. Punto:
// `l1-cantidad-fonemica`.
//
// «mălus (malo) frente a mālus (manzano); vĕnit (viene) frente a vēnit
// (vino) — un presente y un perfecto separados por una vocal larga. El
// español no distingue cantidad y el alumno no la oye ni la busca.»
//
// ── NO SE LISTAN A MANO: SE BUSCAN ───────────────────────────────────
//
// Un par mínimo de cantidad es una cadena que, **escrita sin mácrones, es
// la misma** y con ellos son dos formas distintas. Eso es una pregunta
// mecánica sobre el dominio, así que se contesta con el dominio en vez de
// con una lista, y la respuesta cambia sola cuando la máquina crece.
//
// Medido el 2026-09-12 sobre las 2.835 formas: **61 pares**. Y salen los
// dos tipos que el `varia` pide, sin haberlos buscado por separado:
//
//   MORFOLÓGICO  el mismo lema en dos casillas
//                `venit`/`vēnit` ×236 — presente contra perfecto, que es
//                el ejemplo del propio punto
//                `terra`/`terrā` ×110 — nominativo contra ablativo de la 1.ª
//                `spīritus`/`spīritūs` ×141 — nominativo contra genitivo de la 4.ª
//
//   LÉXICO       dos lemas distintos que colisionan
//                `lēge` (de `lēx`) contra `lege` (imperativo de `legō`) ×81
//                `īs` (de `eō`) contra `is` (el pronombre) ×72
//
// ── POR QUÉ ESTE PUNTO EXISTE, EN UNA CIFRA ──────────────────────────
//
// El español no tiene cantidad vocálica: para un hispanohablante los dos
// miembros de cada par son **la misma palabra**. No es que los confunda:
// es que no puede oír que son dos. Por eso el material lleva mácrones
// siempre y por eso este punto se compara en modo sensible a la cantidad.
import { todasLasFormasDeL1 } from './todas-las-formas';

export type TipoDePar = 'morfologico' | 'lexico';

export interface ParDeCantidad {
  /** La cadena compartida, sin mácrones: lo que el alumno ve si no los mira. */
  sinMacrones: string;
  /** Las dos (o más) formas reales, con su casilla. */
  miembros: { forma: string; claves: string[] }[];
  tipo: TipoDePar;
  /** La vocal que lleva la cantidad y en qué posición de la palabra. */
  vocal: string;
  posicion: number;
}

const sinM = (s: string) =>
  s.normalize('NFD').replace(/[̄̆]/g, '').normalize('NFC').toLowerCase();

/** Dónde difieren dos formas que sin mácrones son la misma. */
function dondeDifieren(a: string, b: string): { vocal: string; posicion: number } | null {
  const x = a.normalize('NFC'), y = b.normalize('NFC');
  if (x.length !== y.length) return null;
  for (let i = 0; i < x.length; i++)
    if (x[i] !== y[i]) return { vocal: sinM(x[i]!), posicion: i };
  return null;
}

export function paresDeCantidad(): ParDeCantidad[] {
  const por = new Map<string, Map<string, string[]>>();
  for (const { clave, forma } of todasLasFormasDeL1()) {
    if (forma.includes(' ')) continue;                 // los perifrásticos no son una palabra
    const k = sinM(forma);
    if (!por.has(k)) por.set(k, new Map());
    const m = por.get(k)!;
    const f = forma.normalize('NFC');
    if (!m.has(f)) m.set(f, []);
    m.get(f)!.push(clave);
  }
  const out: ParDeCantidad[] = [];
  for (const [k, m] of por) {
    if (m.size < 2) continue;
    const miembros = [...m].map(([forma, claves]) => ({ forma, claves }));
    const d = dondeDifieren(miembros[0]!.forma, miembros[1]!.forma);
    if (!d) continue;
    // El tipo lo decide el LEMA: si los dos miembros salen del mismo, la
    // oposición es morfológica; si no, es léxica y el alumno tiene además
    // que saber de qué palabra viene.
    const lemas = new Set(miembros.flatMap((x) => x.claves.map((c) => c.split('.')[0]!)));
    out.push({ sinMacrones: k, miembros, tipo: lemas.size === 1 ? 'morfologico' : 'lexico', ...d });
  }
  return out.sort((a, b) => a.sinMacrones.localeCompare(b.sinMacrones));
}

/** El par de una cadena concreta, o `null` si no lo es. */
export function parDe(sinMacrones: string): ParDeCantidad | null {
  return paresDeCantidad().find((p) => p.sinMacrones === sinM(sinMacrones)) ?? null;
}

// scripts/lotes/cloze-ro-b1b.ts — ADENDA AL LOTE 17: el ítem que faltaba
// para que `r7-gerunziu` mida algo.
//
//   npx tsx scripts/lotes/cloze-ro-b1b.ts
//
// UN solo ítem, y existe por una medición incómoda del ataque al lote 17:
// **el calco español del sufijo acierta 3 de los 8 gerundios publicados**
// (`-ando → -ând`, `-iendo → -ind`), y son justamente `scriind`,
// `coborând` y `citind` — los dos ítems-ancla del punto y uno más. Para el
// diseño sostienen la rejilla (sin ellos el lote enseñaría «-ând por
// defecto»); para el alumno hispanohablante son gratis. Lo que sostiene la
// REJILLA y lo que MIDE al alumno son dos preguntas distintas, y el punto
// estaba bien por la primera y flojo por la segunda.
//
// `a tăia → tăind` es el único caso donde las dos preguntas se contestan
// a la vez: el español dice «cortando», que empuja a `-ând`, y la
// respuesta rumana es `-ind`. El calco **produce la forma equivocada**, y
// por eso este ítem mide lo que el punto dice medir.
//
// ── LO QUE COSTÓ METER `a tăia`, que es el hallazgo de la adenda ──────
// La regla del gerunziu tenía una TERCERA mitad de menos. Con el tema
// acabado en `i`, lo que decide es qué hay DELANTE:
//   · consonante ⇒ la i se conserva (apropi + ind = apropiind, scri +
//     ind = scriind, ști + ind = știind);
//   · vocal ⇒ la i CAE (tăi → tăind, îndoi → îndoind).
// Sin esa rama la regla daba `*tăiind`. Van tres correcciones a la misma
// regla en dos días —le faltaba la conjugación, luego el tema, ahora
// esto— y las tres salieron de aplicarla al lexicón ENTERO antes de
// creérsela.
//
// Y el segundo camino falló otra vez, medido: Hunspell **rechaza**
// `tăiind` pero **acepta `îndoiind`**, que no existe. Segundo agujero
// suyo documentado esta noche, después de `vedă`.
import { verificar as verificarBase, respuestaDe, type ClozeRo } from './cloze-ro-a1';
import { VERBOS_A1 } from '../../lib/data/languages/ro/lexicon-a1';
import { informeAsigna } from '../lib/asigna-ro';

const GER = 'r7-gerunziu';

export const ITEMS: ClozeRo[] = [
  { p: GER, inf: 'a tăia', t: 'gerunziu', s: '___ (a tăia) ceapa, am început să plâng.', pista: 'cortar — gerundio', ancla: 'ceapa, am început', transparenteLatin: false },
];

/** EL GERUNDIO QUE EL ALUMNO TRAE PUESTO. Declarado por lema, porque el
 *  español de la pista sólo lleva el infinitivo y de ahí no sale.
 *
 *  Vive aquí y no en `lib/` a propósito: hoy lo usa un lote. El día que lo
 *  necesite un segundo, sube a `lib/` y los dos lo importan — copiarlo
 *  sería la regla duplicada que falla en la copia N+1. */
export const GERUNDIO_ES: Record<string, string> = {
  'a tăia': 'cortando', 'a merge': 'yendo', 'a scrie': 'escribiendo', 'a coborî': 'bajando',
  'a citi': 'leyendo', 'a face': 'haciendo', 'a vedea': 'viendo', 'a vorbi': 'hablando', 'a pleca': 'yéndose',
};

/** LA REGLA MALA, PREGUNTADA AL ÍTEM. Es la plantilla que el coordinador
 *  pidió reutilizar: en vez de comprobar que la respuesta es la que da la
 *  regla buena —que es darse la razón a uno mismo—, se le pregunta al ítem
 *  **qué produciría el atajo**, y se exige que no coincida.
 *
 *  El atajo aquí es el sufijo español: `-ando → -ând`, `-iendo → -ind`.
 *  Devuelve la desinencia rumana que el calco produce, o null si la glosa
 *  no está declarada. */
export function desinenciaPorCalcoEs(inf: string): 'ând' | 'ind' | null {
  const g = GERUNDIO_ES[inf];
  if (!g) return null;
  // La v0 escribía `/[ié]ndo$/` y no casaba «escribiendo»: la clase de un
  // carácter pide `Xndo`, y ahí la X es la «e» de «endo», con la «i»
  // delante. El gate callaba en los tres ítems publicados que existe para
  // marcar — otra vez un gate que se ve limpio porque no mira donde dice.
  if (/[aá]ndo(se)?$/.test(g)) return 'ând';
  if (/[eé]ndo(se)?$/.test(g)) return 'ind';
  return null;
}

export function verificar(items: ClozeRo[]): string[] {
  const v = verificarBase(items);
  const VERB = new Map(VERBOS_A1.map((x) => [x.inf, x]));
  for (const [i, x] of items.entries()) {
    const id = `CLRO7B-${String(i + 1).padStart(3, '0')} (${x.p})`;
    const r = respuestaDe(x);
    if (!r) continue;
    if (x.p !== GER) { v.push(`${id}: esta adenda sólo produce ${GER}`); continue; }
    if (!VERB.has(x.inf ?? '')) v.push(`${id}: «${x.inf}» no está en el lexicón`);
    const calco = desinenciaPorCalcoEs(x.inf ?? '');
    if (calco === null) v.push(`${id}: «${x.inf}» no declara su gerundio español — el atajo no se ha medido, y «no medido» no es «limpio»`);
    else if (r.endsWith(calco))
      v.push(`${id}: el gerundio español «${GERUNDIO_ES[x.inf!]}» da la desinencia «-${calco}», que es la de «${r}» — el ítem se acierta calcando el sufijo y no mide la regla del tema`);
    if (x.transparenteLatin) v.push(`${id}: declara transparenteLatin, y el ítem existe justamente porque el calco FALLA aquí`);
  }
  return v;
}

if (new RegExp(`[/\\\\]cloze-ro-b1b\\.ts$`).test(process.argv[1] ?? '')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--asigna')) {
    const r = informeAsigna(ITEMS.map((x) => ({ p: x.p, sentence: x.s.replace('___', String(respuestaDe(x) ?? '')), hintEs: x.pista, answer: String(respuestaDe(x) ?? '') })));
    console.log('# A qué punto cuenta el ítem de la adenda\n');
    console.log(r.lineas.join('\n'));
    process.exit(r.desvio ? 1 : 0);
  }
  console.log(`# Cloze RO-B1b (adenda al lote 17) — ${ITEMS.length} ítem\n`);
  for (const [i, x] of ITEMS.entries()) console.log(`${String(i + 1).padStart(2, '0')}. ${x.s}  → **${respuestaDe(x)}**  · ${x.pista}`);
  console.log(`\nEl calco español del sufijo daría «-${desinenciaPorCalcoEs('a tăia')}»; la respuesta es «${respuestaDe(ITEMS[0]!)}».`);
  console.log('\n## Gates\n');
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

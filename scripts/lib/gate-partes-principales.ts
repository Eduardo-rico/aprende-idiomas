// scripts/lib/gate-partes-principales.ts
//
// GATE DE LAS CUATRO PARTES PRINCIPALES. Punto: `l5-partes-principales`.
//
// «amō, amāre, amāvī, amātum. De la primera sale la persona, de la segunda
// la conjugación, de la tercera todo el perfectum y de la cuarta los
// participios y el supino. No es un apéndice: es el lugar donde vive lo que
// no se deduce.» `varia`: cuál de las cuatro partes se pide **y cuánto se
// aparta el verbo del patrón regular**.
//
// ── EL EJE SE CALCULA, NO SE JUZGA ───────────────────────────────────
//
// El patrón regular predice el perfecto y el supino desde el infinitivo:
//
//     -āre  →  -āvī, -ātum        -ēre  →  -uī, -itum
//     -īre  →  -īvī, -ītum        -ere  →  NADA: no hay regla
//
// Medido sobre los 22 verbos del lexicón:
//
//     0   doce verbos regulares del todo    (amō, habeō, audiō…)
//     1   `doceō` — supino `doctum`, no *`docitum`
//     2   `videō` (vīdī/vīsum) e `inveniō` (invēnī/inventum)
//     ∞   `faciō`, `capiō`, `dūcō`, `mittō`, `legō` — 3.ª y mixta: el
//         perfecto no lo predice ninguna regla y hay que guardarlo
//     irr `sum`
//
// El infinito no es una exageración: para la 3.ª **no existe patrón**, y por
// eso el punto dice que las partes principales son «el lugar donde vive lo
// que no se deduce». Un lote que no llegue hasta ahí enseña una regla y no
// el motivo de que la ficha tenga cuatro casillas.
import type { EntradaVerbal } from '../../lib/data/languages/la/paradigma-la';
import { esMixta } from '../../lib/data/languages/la/paradigma-la';
import { separablePorPosicion } from './atajos';
import { revisarCobertura, type Cobertura } from './cobertura';

const sinM = (s: string) => s.normalize('NFD').replace(/[̄̆]/g, '').normalize('NFC');

/** Lo que el patrón regular PREDICE, o `null` si no hay patrón. */
export function loQuePredicelaRegla(v: EntradaVerbal): { perfecto: string; supino: string } | null {
  const i = v.infinitivo.normalize('NFC');
  if (i.endsWith('āre')) { const t = i.slice(0, -3); return { perfecto: `${t}āvī`, supino: `${t}ātum` }; }
  if (i.endsWith('ēre')) { const t = i.slice(0, -3); return { perfecto: `${t}uī`, supino: `${t}itum` }; }
  if (i.endsWith('īre')) { const t = i.slice(0, -3); return { perfecto: `${t}īvī`, supino: `${t}ītum` }; }
  return null;   // 3.ª y mixta: no hay patrón, y eso ES el punto
}

/** Cuánto se aparta: 0 regular, 1 o 2 según cuántas partes desvíen, y
 *  `null` cuando no hay regla contra la que compararlo. */
export function cuantoSeAparta(v: EntradaVerbal): number | null {
  const p = loQuePredicelaRegla(v);
  if (!p) return null;
  let d = 0;
  if (sinM(v.perfecto ?? '') !== sinM(p.perfecto)) d++;
  if (v.supino && sinM(v.supino) !== sinM(p.supino)) d++;
  return d;
}

export type ParteQueSePide = 'infinitivo' | 'perfecto' | 'supino';

export interface ItemPartes {
  id: string;
  punto: string;
  verbo: EntradaVerbal;
  /** Qué parte se pide. La primera nunca: es la que se da. */
  parte: ParteQueSePide;
  /** Lo que se muestra: siempre la primera parte, y las anteriores a la
   *  pedida. */
  entrada: string;
  respuesta: string;
  pista: string;
  ejes: {
    /** Declarado a mano y contrastado contra `cuantoSeAparta`. `null`
     *  significa «no hay regla», que es distinto de «se aparta 0». */
    seAparta: number | null;
    /** Obligatorio cuando no hay regla: hay que decir que se memoriza. */
    porQueNoHayRegla?: string;
  };
}

export type ClaseFalloPP =
  | 'respuesta-no-esta-en-la-ficha' | 'entrada-no-muestra-la-primera'
  | 'distancia-mal-declarada' | 'silencio-sobre-la-falta-de-regla'
  | 'rango-plano' | 'la-regla-resuelve-el-lote'
  | 'parte-sin-cubrir' | 'orden-separable' | 'cobertura-cero' | 'cobertura-sin-motivo';

export interface FalloPP { item: string; clase: ClaseFalloPP; detalle: string }

export function revisarItemPartes(it: ItemPartes): FalloPP[] {
  const out: FalloPP[] = [];
  const push = (c: ClaseFalloPP, d: string) => out.push({ item: it.id, clase: c, detalle: d });

  const enLaFicha = { infinitivo: it.verbo.infinitivo, perfecto: it.verbo.perfecto, supino: it.verbo.supino }[it.parte];
  if (!enLaFicha) push('respuesta-no-esta-en-la-ficha', `el verbo no declara «${it.parte}»`);
  else if (enLaFicha.normalize('NFC') !== it.respuesta.normalize('NFC'))
    push('respuesta-no-esta-en-la-ficha', `la ficha da «${enLaFicha}» y el ítem escribe «${it.respuesta}»`);

  if (!it.entrada.includes(it.verbo.lema))
    push('entrada-no-muestra-la-primera', `«${it.entrada}» no muestra la primera parte, de la que sale todo lo demás`);
  if (it.entrada.includes(it.respuesta))
    push('respuesta-no-esta-en-la-ficha', `la entrada ya contiene la respuesta «${it.respuesta}»`);

  const real = cuantoSeAparta(it.verbo);
  if (real !== it.ejes.seAparta)
    push('distancia-mal-declarada',
      `el ítem declara ${it.ejes.seAparta} y el cálculo da ${real === null ? 'null (no hay regla)' : real}`);
  if (real === null && !it.ejes.porQueNoHayRegla)
    push('silencio-sobre-la-falta-de-regla',
      `«${it.verbo.lema}» es de 3.ª o mixta y su perfecto no lo predice ninguna regla, y el ítem no lo dice`);

  return out;
}

export function revisarLotePartes(items: ItemPartes[]): {
  fallos: FalloPP[]; tasaDeLaRegla: number; piso: number; cobertura: Cobertura[];
} {
  const fallos = items.flatMap(revisarItemPartes);
  const push = (c: ClaseFalloPP, d: string) => fallos.push({ item: '(lote)', clase: c, detalle: d });
  const n = items.length || 1;

  for (const p of ['perfecto', 'supino'] as ParteQueSePide[])
    if (!items.some((it) => it.parte === p))
      push('parte-sin-cubrir', `el varia dice «cuál de las cuatro partes se pide» y falta «${p}»`);

  const ds = items.map((it) => it.ejes.seAparta);
  if (!ds.includes(0)) push('rango-plano', 'ningún verbo regular: falta el extremo contra el que se mide la desviación');
  if (!ds.includes(null)) push('rango-plano', 'ningún verbo SIN regla: el lote enseña un patrón y no el motivo de que la ficha tenga cuatro casillas');

  // La ruta ciega es aplicar el patrón regular. Su piso es exactamente la
  // fracción de verbos regulares del lote: ahí acierta por saber la regla,
  // que es media destreza legítima.
  const acierta = items.filter((it) => {
    const p = loQuePredicelaRegla(it.verbo);
    if (!p || it.parte === 'infinitivo') return false;
    return sinM(p[it.parte]) === sinM(it.respuesta);
  }).length / n;
  const piso = items.filter((it) => it.ejes.seAparta === 0 && it.parte !== 'infinitivo').length / n;
  if (acierta > piso + 1e-9)
    push('la-regla-resuelve-el-lote',
      `aplicar el patrón regular acierta el ${(100 * acierta).toFixed(0)} % y sólo debería llegar al ${(100 * piso).toFixed(0)} % de los verbos regulares`);

  const sep = separablePorPosicion(items.map((it) => (it.ejes.seAparta === 0 ? 'A' : 'B')).join(''));
  if (sep) push('orden-separable', sep);

  const sinRegla = items.filter((it) => it.ejes.seAparta === null).length;
  const cobertura: Cobertura[] = [
    { comprobacion: 'la respuesta contra la ficha del lexicón', decididos: items.length, total: items.length },
    { comprobacion: 'verbos donde NO hay regla que aplicar', decididos: sinRegla, total: items.length,
      motivoDeLosQueQuedanFuera: 'los que tienen patrón, regular o desviado. Los de dentro son los de 3.ª y mixta, donde el perfecto no lo predice nada y hay que guardarlo: son la razón de que la ficha tenga cuatro casillas y no dos' },
  ];
  fallos.push(...revisarCobertura(cobertura));

  return { fallos, tasaDeLaRegla: acierta, piso, cobertura };
}

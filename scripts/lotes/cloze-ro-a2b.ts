// scripts/lotes/cloze-ro-a2b.ts — EL SEXTO LOTE RUMANO: elección del
// sufijo diminutivo, A2.
//
//   npx tsx scripts/lotes/cloze-ro-a2b.ts            # gates + tabla
//   npx tsx scripts/lotes/cloze-ro-a2b.ts --asigna   # a qué punto cuenta
//
// 8 ítems, UN punto a piso: `r10-diminutivo-atenuador`, RE-ENCUADRADO por
// el coordinador el 2026-09-02. El punto ya no se examina por mediación de
// registro, y el motivo está escrito en el inventario: el lingüista midió
// que la función atenuadora es espejo del español de México (ahorita,
// cafecito, un ratito) y que en la dirección atenuado→directo el alumno
// sólo tiene que BORRAR un sufijo. Eso medía castellano.
//
// Lo que sí diverge es la ELECCIÓN del sufijo. Y aquí va la corrección
// que el lingüista hizo a la v0 de este comentario, que decía «no
// derivable» a secas y era FALSO a medias — la mitad falsa siendo justo
// la mitad del lote. Hay DOS tendencias reales:
//     · femenino en -e  → -icică  (carte→cărticică, floare→floricică)
//     · femenino en -ă  → -uță    (casă→căsuță, masă→măsuță), el default
// Un alumno que las induzca DE LOS PROPIOS ÍTEMS acierta 4 de 8 sin
// saber nada léxico. Lo genuinamente léxico son los otros cuatro:
//     · fată→fetiță     femenino en -ă que NO toma -uță (el contraejemplo
//                       interno, y lo mejor que tiene el lote)
//     · cafea→cafeluță  no es -uță sobre el lema sino sobre el alomorfo
//                       cafel- (el de cafele): la regla ingenua da *cafeuță
//     · copil→copilaș vs om→omuleț  dos masculinos sin nada que los separe
// Formulación honesta, y la que vale: el sufijo NO ES PREDECIBLE desde el
// lema; hay dos tendencias que fallan en fată, en cafea y en todo el
// masculino. El punto enseña cuatro casos, no ocho. Queda ANOTADO y no
// tapado: el lingüista propuso cambiar un -uță por ușă→ușiță para que la
// falsedad de la regla fuera visible, pero ușiță entra con alt largo
// (ușuță, ușuliță, ușcioară) y el ítem dejaría de estar determinado. Se
// prefiere el ítem determinado y la afirmación corregida.
// Por eso la respuesta sale del
// campo `dim` del lexicón —guardado, con su fuente, y con un invariante
// que rechaza un diminutivo sin atestar— y NO de ninguna regla: si mañana
// alguien escribe «-ă → -uță», el módulo fabricaría *apuță por apșoară y
// nadie lo vería.
//
// Los gates propios de este punto, además de los del lote 1:
//   1. La PISTA no puede nombrar el sufijo. Si lo nombra, el ítem mide
//      lectura de la pista, no elección: es [[gotcha: un ítem puede no
//      medir su punto]] con otra cara.
//   2. La FRASE no puede contener ya el diminutivo ni otro del lote: el
//      hueco tiene que ser el único sitio donde aparece.
//   3. Ningún sufijo puede dominar el lote. Con 8 ítems y un solo sufijo
//      repetido cuatro veces, la respuesta se adivina por frecuencia y el
//      punto vuelve a ser una regla.
import { verificar as verificarBase, type ClozeRo } from './cloze-ro-a1';
import { SUSTANTIVOS_A1 } from '../../lib/data/languages/ro/lexicon-a1';
import { diminutivo } from '../lib/paradigma-ro';
import { informeAsigna } from '../lib/asigna-ro';

const DIM = 'r10-diminutivo-atenuador';

/** Los sufijos del reparto. Se listan para PROHIBIRLOS en la pista, no
 *  para derivar con ellos: el reparto vive en el lexicón. */
const SUFIJOS = ['uleț', 'șoară', 'cică', 'ică', 'uță', 'iță', 'aș', 'el'];

const LEMA = new Map(SUSTANTIVOS_A1.map((l) => [l.lema, l]));
export const respuestaDim = (x: ClozeRo): string | null => {
  const l = LEMA.get(x.lema ?? '');
  return l ? diminutivo(l) : null;
};

export const ITEMS: ClozeRo[] = [
  // La pista da el LEMA y pide el diminutivo; el contexto dice por qué se
  // usa (cariño, cortesía, tamaño pequeño), que es lo que motiva la forma
  // sin regalarla.
  { p: DIM, casilla: 'DIM sg', lema: 'cafea', s: 'Vrei o ___ (cafea) înainte de plecare?', pista: 'café — en diminutivo, el que se ofrece con amabilidad', ancla: 'Vrei o', transparenteLatin: false },
  { p: DIM, casilla: 'DIM sg', lema: 'casă', alt: ['căscioară'], s: 'Bunicii au o ___ (casă) albă la marginea satului.', pista: 'vivienda (lema «casă») — en diminutivo, una pequeña', ancla: 'albă la marginea satului', transparenteLatin: false },
  { p: DIM, casilla: 'DIM sg', lema: 'floare', s: 'Copilul a desenat o ___ (floare) galbenă pe caiet.', pista: 'flor — en diminutivo, la del dibujo de un niño', ancla: 'a desenat', transparenteLatin: false },
  { p: DIM, casilla: 'DIM sg', lema: 'carte', s: 'Am cumpărat o ___ (carte) cu poze pentru nepoata mea.', pista: 'libro — en diminutivo, uno pequeño de ilustraciones', ancla: 'cu poze', transparenteLatin: false },
  { p: DIM, casilla: 'DIM sg', lema: 'fată', s: 'O ___ (fată) de vreo cinci ani plângea în parc.', pista: 'chica — en diminutivo, una niña pequeña', ancla: 'de vreo cinci ani', transparenteLatin: true },
  { p: DIM, casilla: 'DIM sg', lema: 'copil', s: 'Vecina noastră are un ___ (copil) de doi ani.', pista: 'niño — en diminutivo, el de dos años', ancla: 'de doi ani', transparenteLatin: false },
  { p: DIM, casilla: 'DIM sg', lema: 'om', s: 'Pe raft era un ___ (om) de lemn, cât degetul.', pista: 'hombre — en diminutivo, la figurita de madera', ancla: 'de lemn, cât degetul', transparenteLatin: false },
  { p: DIM, casilla: 'DIM sg', lema: 'masă', alt: ['mescioară'], s: 'Am pus cafeaua pe o ___ (masă) joasă, lângă fereastră.', pista: 'mesa — en diminutivo, una baja de salón', ancla: 'joasă, lângă fereastră', transparenteLatin: false },
];

export function verificar(items: ClozeRo[]): string[] {
  const v = verificarBase(items);
  const usados = new Map<string, number>();
  for (const [i, x] of items.entries()) {
    const id = `CLRO3-${String(i + 1).padStart(3, '0')} (${x.lema})`;
    const r = respuestaDim(x);
    if (!r) { v.push(`${id}: el lema no tiene diminutivo guardado en el lexicón`); continue; }

    // 1 · la pista no deletrea el sufijo
    for (const suf of SUFIJOS)
      if (new RegExp(`-\\s*${suf}|«${suf}»`, 'i').test(x.pista))
        v.push(`${id}: la pista nombra el sufijo «-${suf}» — el ítem mediría lectura de la pista, no elección`);
    if (x.pista.includes(r)) v.push(`${id}: la pista contiene la respuesta «${r}»`);

    // 2 · el diminutivo no puede estar ya en la frase
    const resto = x.s.replace('___', '').replace(/\([^)]*\)/g, ' ');
    if (new RegExp(`(?<![\\p{L}])${r}(?![\\p{L}])`, 'iu').test(resto))
      v.push(`${id}: la frase ya contiene «${r}» fuera del hueco`);

    // 3 · reparto de sufijos
    const suf = SUFIJOS.find((sf) => r.endsWith(sf)) ?? '(otro)';
    usados.set(suf, (usados.get(suf) ?? 0) + 1);
  }
  for (const [suf, n] of usados)
    if (n > Math.ceil(items.length / 3))
      v.push(`el sufijo «-${suf}» sale ${n} de ${items.length} veces — con un sufijo dominante la respuesta se adivina por frecuencia y el punto vuelve a ser una regla`);
  return v;
}

if (process.argv[1]?.includes('cloze-ro-a2b')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--asigna')) {
    const r = informeAsigna(ITEMS.map((x) => ({ p: x.p, sentence: x.s.replace('___', String(respuestaDim(x) ?? '')), hintEs: x.pista, answer: String(respuestaDim(x) ?? '') })));
    console.log('# A qué punto cuenta cada ítem del lote 6\n');
    console.log(r.lineas.join('\n'));
    process.exit(r.desvio ? 1 : 0);
  }
  console.log(`# Cloze derivado RO-A2b — elección del sufijo diminutivo · ${ITEMS.length} ítems\n`);
  for (const [i, x] of ITEMS.entries()) {
    const l = LEMA.get(x.lema!);
    console.log(`${String(i + 1).padStart(2, '0')}. ${x.s}  → **${respuestaDim(x)}**  · ${x.pista}\n      fuente del diminutivo: ${l?.dimFuente ?? '—'}`);
  }
  const rep = new Map<string, string[]>();
  for (const x of ITEMS) { const r = respuestaDim(x)!; const sf = SUFIJOS.find((s) => r.endsWith(s)) ?? '(otro)'; rep.set(sf, [...(rep.get(sf) ?? []), r]); }
  console.log(`\nReparto de sufijos: ${[...rep].map(([s, xs]) => `-${s} ×${xs.length} (${xs.join(', ')})`).join(' · ')}`);
  console.log('\n## Gates\n');
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

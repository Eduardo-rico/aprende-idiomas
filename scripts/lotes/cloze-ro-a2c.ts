// scripts/lotes/cloze-ro-a2c.ts — EL SÉPTIMO LOTE RUMANO: los tres puntos
// de genitivo-dativo que quedaban bajo el piso. A2.
//
//   npx tsx scripts/lotes/cloze-ro-a2c.ts            # gates + tabla
//   npx tsx scripts/lotes/cloze-ro-a2c.ts --asigna   # a qué punto cuenta
//
// 24 ítems, 3 puntos × 8, TODOS por la misma máquina (`genitivoDativo`) y
// el mismo lexicón. El criterio de prioridad es del coordinador: producir
// contra los puntos BAJO EL PISO, y dentro de ellos los que amortizan el
// molde. Estos tres son el resto del bloque 4 que la máquina ya cubría:
//   · r4-gd-indefinido    `genitivoDativo(l, 'sg', false)`
//   · r4-gd-definido-pl   `genitivoDativo(l, 'pl', true)`
//   · r4-preposiciones-gd la misma forma, regida por preposición
//
// DECISIÓN sobre `r4-gd-indefinido`, escrita porque se nota en la tabla:
// los 8 son FEMENINOS. En masculino y neutro el GD indefinido es IGUAL al
// nominativo (unui băiat), así que un cloze pediría escribir el lema y no
// examinaría nada — la lección la lleva el artículo, no el sustantivo, y
// eso se enseña en la lección, no se puntúa en un hueco. El femenino es
// donde la forma diverge de verdad (unei case, unei cărți: la del plural)
// y es lo único que aquí se puntúa. Lo contrario sería un ítem que no
// mide su punto con otra cara.
import { verificar as verificarBase, respuestaDe, type ClozeRo } from './cloze-ro-a1';
import { informeAsigna } from '../lib/asigna-ro';

const GDI = 'r4-gd-indefinido';
const GDP = 'r4-gd-definido-pl';
const PREP = 'r4-preposiciones-gd';

/** Las de GENITIVO del punto (`asupra, contra, deasupra, împotriva,
 *  înaintea, în fața`). Se listan para EXIGIRLAS delante del hueco: sin
 *  la preposición el ítem sería otro punto (gd-definido-sg), que ya está
 *  cubierto, y el `--asigna` no lo vería porque cuenta lo declarado. */
const PREPS_GEN = ['asupra', 'contra', 'deasupra', 'împotriva', 'înaintea', 'în fața', 'în favoarea'];
/** Las de DATIVO del mismo punto. La FORMA que piden es la misma (el
 *  genitivo-dativo rumano es un solo caso), así que el gate las trata
 *  igual; lo que cambia es lo que el alumno tiene que saber. */
const PREPS_DAT = ['datorită', 'grație', 'mulțumită', 'conform', 'potrivit'];
const PREPS = [...PREPS_GEN, ...PREPS_DAT];

export const ITEMS: ClozeRo[] = [
  // ── r4-gd-indefinido · 8 · femeninos: la forma es la del PLURAL ──
  { p: GDI, lema: 'casă', casilla: 'GD sg indef', s: 'Am găsit cheia unei ___ (casă) din centru.', pista: 'casa — genitivo-dativo INDEFINIDO, singular (femenino)', ancla: 'cheia unei', transparenteLatin: false },
  { p: GDI, lema: 'carte', casilla: 'GD sg indef', s: 'Este coperta unei ___ (carte) vechi.', pista: 'libro — genitivo-dativo indefinido, singular (femenino)', ancla: 'coperta unei', transparenteLatin: false },
  { p: GDI, lema: 'fată', casilla: 'GD sg indef', s: 'I-am dat cartea unei ___ (fată) din clasa mea.', pista: 'chica — genitivo-dativo indefinido, singular (femenino, con alternancia a → e)', ancla: 'cartea unei', transparenteLatin: false },
  { p: GDI, lema: 'mașină', casilla: 'GD sg indef', s: 'Am notat numărul unei ___ (mașină) albastre.', pista: 'coche — genitivo-dativo indefinido, singular (femenino)', ancla: 'numărul unei', transparenteLatin: false },
  { p: GDI, lema: 'stradă', casilla: 'GD sg indef', s: 'La capătul unei ___ (stradă) înguste este o biserică.', pista: 'calle — genitivo-dativo indefinido, singular (femenino, con alternancia)', ancla: 'La capătul unei', transparenteLatin: false },
  { p: GDI, lema: 'școală', casilla: 'GD sg indef', s: 'Este directoarea unei ___ (școală) mari.', pista: 'escuela — genitivo-dativo indefinido, singular (femenino)', ancla: 'directoarea unei', transparenteLatin: false },
  { p: GDI, lema: 'familie', casilla: 'GD sg indef', s: 'Vorbim despre povestea unei ___ (familie) din Cluj.', pista: 'familia — genitivo-dativo indefinido, singular (femenino en -ie)', ancla: 'povestea unei', transparenteLatin: false },
  { p: GDI, lema: 'oră', casilla: 'GD sg indef', s: 'La sfârșitul unei ___ (oră) întregi de discuții, nu am ajuns la nicio concluzie.', pista: 'hora — genitivo-dativo indefinido, singular (femenino)', ancla: 'La sfârșitul unei', transparenteLatin: false },

  // ── r4-gd-definido-pl · 8 · triple flexión: plural + artículo + caso ──
  { p: GDP, lema: 'om', casilla: 'GD pl def', s: 'Le-am explicat ___ (om) de la birou situația.', pista: 'persona — genitivo-dativo definido PLURAL (plural + -lor); plural irregular', ancla: 'Le-am explicat', transparenteLatin: false },
  { p: GDP, lema: 'copil', casilla: 'GD pl def', s: 'Le citim ___ (copil) o poveste în fiecare seară.', pista: 'niño — genitivo-dativo definido plural (plural + -lor)', ancla: 'Le citim', transparenteLatin: false },
  { p: GDP, lema: 'prieten', casilla: 'GD pl def', s: 'Le-am trimis ___ (prieten) mei o fotografie.', pista: 'amigo — genitivo-dativo definido plural (plural + -lor)', ancla: 'Le-am trimis', transparenteLatin: false },
  { p: GDP, lema: 'casă', casilla: 'GD pl def', s: 'Acoperișurile ___ (casă) din sat sunt roșii.', pista: 'casa — genitivo-dativo definido plural (plural + -lor)', ancla: 'Acoperișurile', transparenteLatin: false },
  { p: GDP, lema: 'oraș', casilla: 'GD pl def', s: 'Primarii ___ (oraș) mari s-au întâlnit ieri.', pista: 'ciudad — genitivo-dativo definido plural (plural + -lor)', ancla: 'Primarii', transparenteLatin: false },
  { p: GDP, lema: 'tren', casilla: 'GD pl def', s: 'Orarul ___ (tren) de noapte s-a schimbat.', pista: 'tren — genitivo-dativo definido plural (plural + -lor)', ancla: 'Orarul', transparenteLatin: false },
  { p: GDP, lema: 'fată', casilla: 'GD pl def', s: 'Le-am dat ___ (fată) câte un caiet.', pista: 'chica — genitivo-dativo definido plural (plural + -lor, con alternancia)', ancla: 'Le-am dat', transparenteLatin: false },
  { p: GDP, lema: 'doamnă', casilla: 'GD pl def', s: 'Le-am mulțumit ___ (doamnă) de la recepție.', pista: 'señora — genitivo-dativo definido plural (plural + -lor)', ancla: 'Le-am mulțumit', transparenteLatin: false },

  // ── r4-preposiciones-gd · 8 · la preposición RIGE el genitivo ──────
  // La trampa que el inventario declara: la preposición se reconoce
  // (contra, conform) y por eso engaña — *contra guvernul por contra
  // guvernului. El hueco pide la forma, no la preposición.
  { p: PREP, lema: 'școală', casilla: 'GD sg def', s: 'Am parcat în fața ___ (școală).', pista: 'escuela — tras «în fața»', ancla: 'în fața', transparenteLatin: false },
  { p: PREP, lema: 'masă', casilla: 'GD sg def', s: 'Lampa atârnă deasupra ___ (masă).', pista: 'mesa — tras «deasupra»', ancla: 'deasupra', transparenteLatin: false },
  { p: PREP, lema: 'magazin', casilla: 'GD sg def', s: 'Vecinii au semnat o petiție contra ___ (magazin).', pista: 'tienda — tras «contra»', ancla: 'contra', transparenteLatin: false },
  // Las de DATIVO, que el inventario declara y el lote no tocaba: la
  // forma es la misma (el GD es un solo caso), pero el alumno tiene que
  // saber que `conform` y `datorită` la rigen — y son las que más engañan
  // porque se reconocen enteras desde el español.
  { p: PREP, lema: 'lege', casilla: 'GD sg def', s: 'Conform ___ (lege), plata se face în avans.', pista: 'ley — tras «conform», que pide dativo', ancla: 'Conform', transparenteLatin: false },
  { p: PREP, lema: 'prieten', casilla: 'GD sg def', s: 'Am ajuns la timp datorită ___ (prieten) meu.', pista: 'amigo — tras «datorită», que pide dativo', ancla: 'datorită', transparenteLatin: false },
  { p: PREP, lema: 'vecin', casilla: 'GD sg def', s: 'Nu am nimic împotriva ___ (vecin).', pista: 'vecino — tras «împotriva»', ancla: 'împotriva', transparenteLatin: false },
  { p: PREP, lema: 'carte', casilla: 'GD sg def', s: 'Ne-am concentrat asupra ___ (carte) pe care am citit-o.', pista: 'libro — tras «asupra»', ancla: 'asupra', transparenteLatin: false },
  { p: PREP, lema: 'copil', casilla: 'GD pl def', s: 'Legea este în favoarea ___ (copil), nu împotriva lor.', pista: 'niño, en plural — tras «în favoarea»', ancla: 'în favoarea', transparenteLatin: false },
];

export function verificar(items: ClozeRo[]): string[] {
  const v = verificarBase(items);
  for (const [i, x] of items.entries()) {
    const id = `CLRO4-${String(i + 1).padStart(3, '0')} (${x.p})`;
    const antes = x.s.split('___')[0] ?? '';

    // GDI: el artículo indefinido de GD tiene que estar DELANTE, y ser el
    // femenino. Sin «unei» el hueco no dice qué casilla se pide.
    if (x.p === GDI && !/(?<![\p{L}])unei\s*$/u.test(antes))
      v.push(`${id}: el hueco no va tras «unei» — sin el indefinido declinado la casilla no está determinada`);
    if (x.p === GDI && x.casilla !== 'GD sg indef')
      v.push(`${id}: el punto es el indefinido y la casilla declarada es «${x.casilla}»`);

    // GDP: o va tras un clítico dativo plural («le»), o tras un
    // sustantivo articulado (genitivo). Y la forma tiene que acabar en
    // -lor: es literalmente lo que el punto examina.
    if (x.p === GDP) {
      if (!/(?<![\p{L}])(le|Le)[- ]/u.test(antes) && !/\p{L}+(ul|le|a|ua|ea|ia|ele|ile|ii|urile)\s+$/u.test(antes))
        v.push(`${id}: ni clítico dativo plural ni sustantivo articulado delante — el genitivo-dativo plural no está determinado`);
      if (x.casilla !== 'GD pl def') v.push(`${id}: el punto es el definido plural y la casilla es «${x.casilla}»`);
    }

    // PREP: la preposición de genitivo tiene que estar pegada al hueco.
    // Sin ella el ítem sería `r4-gd-definido-sg`, que YA está cubierto, y
    // `--asigna` no lo cazaría: cuenta el punto DECLARADO, no el medido.
    if (x.p === PREP && !PREPS.some((pr) => new RegExp(`(?<![\\p{L}])${pr}\\s*$`, 'iu').test(antes)))
      v.push(`${id}: el hueco no va tras una preposición del punto (${PREPS.join(', ')}) — el ítem mediría gd-definido-sg, que ya está cubierto`);
    // Y la pista no puede nombrar el caso: si lo dice, el alumno no tiene
    // que saber que la preposición lo rige, que es LO QUE EL PUNTO MIDE.
    if (x.p === PREP && /(genitiv|forma definida|definido)/i.test(x.pista))
      v.push(`${id}: la pista nombra el caso — con el caso dado el ítem es r4-gd-definido-sg, que ya está cubierto`);
  }
  return v;
}

if (process.argv[1]?.includes('cloze-ro-a2c')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--asigna')) {
    const r = informeAsigna(ITEMS.map((x) => ({ p: x.p, sentence: x.s.replace('___', String(respuestaDe(x) ?? '')), hintEs: x.pista, answer: String(respuestaDe(x) ?? '') })));
    console.log('# A qué punto cuenta cada ítem del lote 7\n');
    console.log(r.lineas.join('\n'));
    process.exit(r.desvio ? 1 : 0);
  }
  console.log(`# Cloze derivado RO-A2c — genitivo-dativo · ${ITEMS.length} ítems · transparenteLatin ${ITEMS.filter((x) => x.transparenteLatin).length}/${ITEMS.length}\n`);
  for (const [i, x] of ITEMS.entries()) console.log(`${String(i + 1).padStart(2, '0')}. ${x.s}  → **${respuestaDe(x)}**  · ${x.pista}`);
  console.log('\n## Gates\n');
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

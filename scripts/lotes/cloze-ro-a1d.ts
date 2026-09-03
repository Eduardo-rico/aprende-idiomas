// scripts/lotes/cloze-ro-a1d.ts — EL DECIMOTERCER LOTE RUMANO: la
// ortografía del bloque 1. A1.
//
//   npx tsx scripts/lotes/cloze-ro-a1d.ts            # gates + tabla
//   npx tsx scripts/lotes/cloze-ro-a1d.ts --asigna   # a qué punto cuenta
//
// 24 ítems, 3 puntos × 8, los tres de clase `ortografico` y los tres con
// la MISMA mecánica: **cloze del GRAFEMA, no de la palabra**. Es lo que
// el propio inventario manda («cloze del grafema», motivo de
// `r1-ortografia-a-i`) y no es un detalle de forma: si el hueco fuera la
// palabra entera, el ítem mediría vocabulario —quien sabe «puerta = ușă»
// la escribe— y no la correspondencia grafía↔sonido, que es el punto.
// El hueco cae DENTRO de la palabra y lo único que se decide es qué
// letra o dígrafo va ahí.
//   · r1-consonantes-ausentes  ș ț j z y los dígrafos ce/ge/che/ghe
//   · r1-ortografia-a-i        â interior / î inicial, final y de raíz
//   · r1-diptongos             ea oa ia ie io iu
//
// LA PISTA NO PUEDE LLEVAR LA LETRA, y aquí el gate base ya lo impone
// solo por una razón bonita: `normalizeAnswer` quita los diacríticos, así
// que una pista que dijera «â interior» se normaliza a «a interior» y el
// gate la caza como deletreo de la respuesta. La pista dice la POSICIÓN
// y el sonido, nunca el grafema.
//
// `r1-diacriticos-coma` se queda FUERA a propósito, y su propio motivo lo
// dice: «se enseña una vez y lo vigila el gate de escritura, NO un lote
// entero». Un punto cuyo contenido es «usa U+0219 y no U+015F» no da
// ocho ítems distintos: daría ocho veces el mismo. Queda declarado para
// que el coordinador decida si baja su piso o si el gate ES su cobertura.
import { verificar as verificarBase, type ClozeRo } from './cloze-ro-a1';
import { informeAsigna } from '../lib/asigna-ro';

const CONS = 'r1-consonantes-ausentes';
const AI = 'r1-ortografia-a-i';
const DIP = 'r1-diptongos';

/** Los grafemas de cada punto. La respuesta tiene que ser UNO de ellos:
 *  si no lo es, el hueco no está examinando este punto sino otra cosa. */
const GRAFEMAS: Record<string, string[]> = {
  [CONS]: ['ș', 'ț', 'j', 'z', 'ce', 'ci', 'ge', 'gi', 'che', 'chi', 'ghe', 'ghi'],
  [AI]: ['â', 'î'],
  [DIP]: ['ea', 'oa', 'ia', 'ie', 'io', 'iu'],
};

export const ITEMS: ClozeRo[] = [
  // ── r1-consonantes-ausentes · 8 ───────────────────────────────────
  { p: CONS, r: 'ș', s: 'Am închis u___a de la intrare.', pista: 'puerta — el sonido «sh», que el español no tiene', ancla: 'de la intrare', transparenteLatin: false },
  { p: CONS, r: 'ț', s: 'România este o ___ară frumoasă.', pista: 'país — el sonido «ts», como la z del italiano «pizza»', ancla: 'România este o', transparenteLatin: false },
  { p: CONS, r: 'j', s: 'Cartea a căzut ___os, sub masă.', pista: 'abajo — el sonido inicial de «Jean» en francés, que el español no tiene', ancla: 'sub masă', transparenteLatin: false },
  { p: CONS, r: 'z', s: 'Am zece degete și ___ero probleme.', pista: 'cero — la ese SONORA, que el español fusiona con la sorda', ancla: 'Am zece degete', transparenteLatin: false },
  { p: CONS, r: 'ce', s: 'Beau un ___ai cald dimineața.', pista: 'té — se lee «ch» ante e: la grafía es la latina, la lectura no', ancla: 'cald dimineața', transparenteLatin: false },
  { p: CONS, r: 'ge', s: 'Am spart un ___am din bucătărie.', pista: 'cristal, ventanal — se lee como la «y» argentina ante e', ancla: 'din bucătărie', transparenteLatin: false },
  { p: CONS, r: 'che', s: 'Nu găsesc ___ia de la casă.', pista: 'llave — el dígrafo que se lee «que», con la hache muda', ancla: 'de la casă', transparenteLatin: false },
  { p: CONS, r: 'ghe', s: 'Iarna port ___te groase.', pista: 'botas — el dígrafo que se lee «gue», con la hache muda', ancla: 'Iarna port', transparenteLatin: false },

  // ── r1-ortografia-a-i · 8 · la regla de POSICIÓN de DOOM3 ─────────
  // Cuatro y cuatro a propósito: el punto ES binario y el gate del
  // reparto lo admite justo en el 50 %. Lo que decide no es la letra
  // sino DÓNDE está, y por eso la pista da la posición y nunca el signo.
  { p: AI, r: 'â', s: 'Eu sunt rom___n și vorbesc românește.', pista: 'rumano (gentilicio) — la vocal central va en el INTERIOR de la palabra', ancla: 'și vorbesc', transparenteLatin: false },
  { p: AI, r: 'â', s: 'Ne vedem m___ine la ora nouă.', pista: 'mañana (el día siguiente) — vocal central en el interior', ancla: 'la ora nouă', transparenteLatin: false },
  { p: AI, r: 'â', s: 'Nu știu c___nd ajunge trenul.', pista: 'cuándo — vocal central en el interior', ancla: 'ajunge trenul', transparenteLatin: false },
  { p: AI, r: 'â', s: 'Am cumpărat p___ine de la brutărie.', pista: 'pan — vocal central en el interior', ancla: 'de la brutărie', transparenteLatin: false },
  { p: AI, r: 'î', s: 'Filmul a ___nceput acum zece minute.', pista: 'ha empezado — vocal central al PRINCIPIO de la palabra', ancla: 'acum zece minute', transparenteLatin: false },
  { p: AI, r: 'î', s: 'Te ___ntreb ceva foarte scurt.', pista: 'te pregunto — vocal central al principio de la palabra', ancla: 'ceva foarte scurt', transparenteLatin: false },
  { p: AI, r: 'î', s: 'Vreau să cobor___ la stația următoare.', pista: 'bajar (infinitivo) — vocal central al FINAL de la palabra', ancla: 'la stația următoare', transparenteLatin: false },
  { p: AI, r: 'î', s: 'A plouat ne___ncetat toată noaptea.', pista: 'sin cesar — es un compuesto, y la vocal central abre la RAÍZ aunque no abra la palabra', ancla: 'toată noaptea', transparenteLatin: false },

  // ── r1-diptongos · 8 · sólo la forma base (la alternancia va en r2) ──
  { p: DIP, r: 'ea', s: 'S___ra citesc o oră în pat.', pista: 'tarde-noche — el diptongo de «a» abierta que el español no tiene', ancla: 'citesc o oră', transparenteLatin: false },
  { p: DIP, r: 'ea', s: 'În fața casei este un d___l mic.', pista: 'colina — el mismo diptongo, aquí ante l', ancla: 'În fața casei', transparenteLatin: false },
  { p: DIP, r: 'oa', s: 'Azi este s___re și cald.', pista: 'sol — el diptongo de «o» abierta', ancla: 'și cald', transparenteLatin: false },
  { p: DIP, r: 'oa', s: 'Am deschis p___rta de la grădină.', pista: 'portón — el diptongo de «o» abierta', ancla: 'de la grădină', transparenteLatin: false },
  { p: DIP, r: 'ia', s: '___rna este foarte lungă aici.', pista: 'invierno — el diptongo que abre la palabra con «i» semiconsonante', ancla: 'foarte lungă aici', transparenteLatin: false },
  { p: DIP, r: 'ie', s: 'Biletul a fost foarte ___ftin.', pista: 'barato — el diptongo con «i» semiconsonante ante «e»', ancla: 'Biletul a fost', transparenteLatin: false },
  { p: DIP, r: 'iu', s: 'Te ___besc și îți mulțumesc.', pista: 'te amo — el diptongo con «i» semiconsonante ante «u»', ancla: 'și îți mulțumesc', transparenteLatin: false },
  { p: DIP, r: 'io', s: 'Am desenat cu un cre___n roșu.', pista: 'lápiz — el diptongo con «i» semiconsonante ante «o»', ancla: 'roșu', transparenteLatin: false },
];

export function verificar(items: ClozeRo[]): string[] {
  const v = verificarBase(items);
  for (const [i, x] of items.entries()) {
    const id = `CLRO8-${String(i + 1).padStart(3, '0')} (${x.p})`;
    const r = x.r ?? '';

    // 1 · La respuesta tiene que ser un GRAFEMA del punto. Si es una
    // palabra, el ítem mide vocabulario y no la correspondencia
    // grafía↔sonido — que es la trampa entera de este bloque.
    if (!GRAFEMAS[x.p]?.includes(r))
      v.push(`${id}: «${r}» no es un grafema de este punto (${GRAFEMAS[x.p]?.join(', ')}) — con la palabra entera el ítem mediría vocabulario`);

    // 2 · El hueco tiene que ir DENTRO de una palabra: pegado a letra por
    // los dos lados, o por uno si el grafema abre o cierra la palabra.
    const [antes = '', despues = ''] = x.s.split('___');
    const pegadoIzq = /\p{L}$/u.test(antes);
    const pegadoDer = /^\p{L}/u.test(despues);
    if (!pegadoIzq && !pegadoDer)
      v.push(`${id}: el hueco no está dentro de una palabra — este punto examina el grafema, no la palabra`);

    // 3 · Y el grafema NO puede estar ya en la misma palabra: si está, se
    // copia. El gate base sólo mira la palabra suelta, y aquí el hueco
    // vive dentro de una.
    const palabra = (antes.match(/\p{L}*$/u)?.[0] ?? '') + r + (despues.match(/^\p{L}*/u)?.[0] ?? '');
    const resto = palabra.slice(0, (antes.match(/\p{L}*$/u)?.[0] ?? '').length) + palabra.slice((antes.match(/\p{L}*$/u)?.[0] ?? '').length + r.length);
    if (resto.includes(r)) v.push(`${id}: el grafema «${r}» ya aparece en la misma palabra («${palabra}») — se contesta copiando`);

    // 4 · Invariante del punto â/î: la letra la decide la POSICIÓN, así
    // que la posición tiene que ser inequívoca. `â` sólo en interior;
    // `î` sólo al principio, al final, o abriendo raíz tras prefijo.
    if (x.p === AI) {
      const inicial = !pegadoIzq;
      const final = !pegadoDer;
      const trasPrefijo = /(?:^|[^\p{L}])(ne|re|pre|des|în)$/u.test(antes);
      if (r === 'â' && (inicial || final))
        v.push(`${id}: «â» en posición inicial o final — DOOM3 la reserva al interior y el ítem enseñaría lo contrario`);
      if (r === 'î' && !inicial && !final && !trasPrefijo)
        v.push(`${id}: «î» en interior sin prefijo delante — DOOM3 pide «â» ahí`);
    }
  }
  // El reparto por grafema DENTRO del punto: con un solo grafema el
  // bloque no enseña un reparto, enseña una constante.
  for (const p of [CONS, AI, DIP]) {
    const xs = items.filter((x) => x.p === p);
    if (!xs.length) continue;
    const distintos = new Set(xs.map((x) => x.r));
    const min = p === AI ? 2 : 4;   // â/î es binario por naturaleza
    if (distintos.size < min) v.push(`${p}: sólo ${distintos.size} grafema(s) distinto(s) en ${xs.length} ítems — el punto pide al menos ${min}`);
  }
  return v;
}

if (new RegExp(`[/\\\\]cloze-ro-a1d\\.ts$`).test(process.argv[1] ?? '')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--asigna')) {
    const r = informeAsigna(ITEMS.map((x) => ({ p: x.p, sentence: x.s.replace('___', String(x.r ?? '')), hintEs: x.pista, answer: String(x.r ?? '') })));
    console.log('# A qué punto cuenta cada ítem del lote 13\n');
    console.log(r.lineas.join('\n'));
    process.exit(r.desvio ? 1 : 0);
  }
  console.log(`# Cloze RO-A1d — ortografía del bloque 1 · ${ITEMS.length} ítems · transparenteLatin ${ITEMS.filter((x) => x.transparenteLatin).length}/${ITEMS.length}\n`);
  for (const [i, x] of ITEMS.entries()) console.log(`${String(i + 1).padStart(2, '0')}. ${x.s.replace('___', '[' + x.r + ']')}  → **${x.r}**  · ${x.pista}`);
  console.log('\n## Gates\n');
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

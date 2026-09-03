// scripts/lotes/cloze-ro-a2e.ts — EL DÉCIMO LOTE RUMANO: las dos
// alternancias del plural y el vocativo. A1-A2.
//
//   npx tsx scripts/lotes/cloze-ro-a2e.ts            # gates + tabla
//   npx tsx scripts/lotes/cloze-ro-a2e.ts --asigna   # a qué punto cuenta
//
// 24 ítems, 3 puntos × 8, los tres desde el MISMO lexicón y sin código
// nuevo: la respuesta sale de `paradigmaNominal`, que ya lleva las tres
// casillas. Criterio del coordinador: puntos a cero primero, y dentro de
// ellos los que amortizan el molde.
//   · r2-alternancia-vocalica     `N pl`, lemas con alternancia de VOCAL
//   · r2-alternancia-consonantica `N pl`, lemas con alternancia de CONSONANTE
//   · r4-vocativo                 `V sg` / `V pl`
//
// La casilla `N pl` es la misma que la de `r2-plural-i-e-uri` (lote 4, ya
// cubierto) y el punto es OTRO: allí se examina la DESINENCIA (-i/-e/-uri)
// y aquí lo que le pasa a la RAÍZ. Por eso cada bloque lleva un gate que
// comprueba que el lema tiene esa alternancia y NO la otra: un `stradă →
// străzi` (a→ă Y d→z) mediría las dos a la vez y ninguna limpiamente.
//
// Y el vocativo llega con la cicatriz del inventario escrita: **no es
// derivable del género**. El singular se guarda POR LEMA con su registro
// (-ule sobre un común es BRUSCO: doctorule!), y lo único derivable es el
// plural (-lor). Por eso `alt` no se escribe a mano aquí: se toma de
// `vocAlt` del lexicón, que es donde vive el reparto comprobado en
// dexonline lema a lema (§12 del Paso 0). Una lista copiada se
// desincroniza, y en esta fase ya ha pasado tres veces.
import { verificar as verificarBase, respuestaDe, type ClozeRo } from './cloze-ro-a1';
import { SUSTANTIVOS_A1 } from '../../lib/data/languages/ro/lexicon-a1';
import { informeAsigna } from '../lib/asigna-ro';

const VOC_ALT = 'r2-alternancia-vocalica';
const CONS = 'r2-alternancia-consonantica';
const VOC = 'r4-vocativo';

const LEMA = new Map(SUSTANTIVOS_A1.map((l) => [l.lema, l]));

/** La raíz sin la desinencia: lo que hay que comparar para ver si la
 *  alternancia está en la vocal o en la consonante. Se corta la vocal
 *  final del lema y la desinencia del plural. */
const raiz = (s: string) => s.replace(/(uri|ele|le|i|e)$/u, '').replace(/[ăaeiou]$/u, '');
const vocalesDe = (s: string) => s.replace(/[^aăâeiîou]/gu, '');
const consonantesDe = (s: string) => s.replace(/[aăâeiîou]/gu, '');

export const ITEMS: ClozeRo[] = [
  // ── r2-alternancia-vocalica · 8 · cambia la VOCAL de la raíz ──────
  { p: VOC_ALT, lema: 'fată', casilla: 'N pl', s: 'În clasă sunt douăsprezece ___ (fată) și opt băieți.', pista: 'chica — plural femenino en -e; la raíz no se queda igual', ancla: 'douăsprezece', transparenteLatin: false },
  { p: VOC_ALT, lema: 'masă', casilla: 'N pl', s: 'În sală sunt zece ___ (masă) libere.', pista: 'mesa — plural femenino en -e; la raíz no se queda igual', ancla: 'zece', transparenteLatin: true },
  { p: VOC_ALT, lema: 'seară', casilla: 'N pl', s: 'Am lucrat trei ___ (seară) la rând.', pista: 'tarde-noche — plural femenino en -i; la raíz no se queda igual', ancla: 'trei', transparenteLatin: false },
  { p: VOC_ALT, lema: 'fereastră', casilla: 'N pl', s: 'Camera are două ___ (fereastră) mari.', pista: 'ventana — plural femenino en -e; la raíz no se queda igual', ancla: 'două', transparenteLatin: false },
  { p: VOC_ALT, lema: 'măr', casilla: 'N pl', s: 'Am cules șapte ___ (măr) din grădină.', pista: 'manzana — plural; la vocal de la raíz cambia (ă → e)', ancla: 'șapte', transparenteLatin: false },
  { p: VOC_ALT, lema: 'școală', casilla: 'N pl', s: 'În oraș sunt patru ___ (școală) primare.', pista: 'escuela — plural femenino en -i; la raíz no se queda igual', ancla: 'patru', transparenteLatin: false },
  { p: VOC_ALT, lema: 'floare', casilla: 'N pl', s: 'Am cumpărat cinci ___ (floare) albe.', pista: 'flor — plural femenino en -i; la raíz no se queda igual', ancla: 'cinci', transparenteLatin: true },
  { p: VOC_ALT, lema: 'țară', casilla: 'N pl', s: 'A vizitat multe ___ (țară) în ultimii ani.', pista: 'país — plural femenino en -i; la raíz no se queda igual', ancla: 'multe', transparenteLatin: false },

  // ── r2-alternancia-consonantica · 8 · cambia la CONSONANTE final ──
  { p: CONS, lema: 'brad', casilla: 'N pl', s: 'În pădure sunt mulți ___ (brad) înalți.', pista: 'abeto — plural masculino en -i; la raíz no se queda igual', ancla: 'mulți', transparenteLatin: false },
  { p: CONS, lema: 'urs', casilla: 'N pl', s: 'În munți trăiesc încă niște ___ (urs) bruni.', pista: 'oso — plural masculino en -i; la raíz no se queda igual', ancla: 'niște', transparenteLatin: false },
  { p: CONS, lema: 'obraz', casilla: 'N pl', s: 'Copilul a venit de afară cu ___ (obraz) roșii de la frig.', pista: 'mejilla — plural masculino en -i; la raíz no se queda igual', ancla: 'roșii de la frig', transparenteLatin: false },
  { p: CONS, lema: 'frate', casilla: 'N pl', s: 'Are trei ___ (frate) mai mari.', pista: 'hermano — plural masculino en -i; la raíz no se queda igual', ancla: 'trei', transparenteLatin: false },
  { p: CONS, lema: 'tată', casilla: 'N pl', s: 'La ședință au venit mulți ___ (tată).', pista: 'padre — plural; la consonante final cambia (t → ț)', ancla: 'mulți', transparenteLatin: false },
  { p: CONS, lema: 'nepot', casilla: 'N pl', s: 'Bunicii au patru ___ (nepot) în străinătate.', pista: 'nieto — plural masculino en -i; la raíz no se queda igual', ancla: 'patru', transparenteLatin: false },
  { p: CONS, lema: 'bărbat', casilla: 'N pl', s: 'În sală erau numai ___ (bărbat) tineri.', pista: 'hombre, varón — plural masculino en -i; la raíz no se queda igual', ancla: 'numai', transparenteLatin: false },
  { p: CONS, lema: 'student', casilla: 'N pl', s: 'În amfiteatru sunt o sută de ___ (student).', pista: 'estudiante — plural masculino en -i; la raíz no se queda igual', ancla: 'o sută de', transparenteLatin: false },

  // ── r4-vocativo · 8 · NO derivable del género; el registro va en la pista ──
  { p: VOC, lema: 'om', casilla: 'V sg', s: '___ (om), ai grijă pe unde calci!', pista: 'hombre — vocativo singular; familiar, entre iguales', ancla: 'ai grijă pe unde calci', transparenteLatin: false },
  { p: VOC, lema: 'domn', casilla: 'V sg', s: '___ (domn), v-ați uitat umbrela pe scaun.', pista: 'señor — vocativo singular; es el tratamiento cortés estándar', ancla: 'v-ați uitat umbrela', transparenteLatin: false },
  { p: VOC, lema: 'băiat', casilla: 'V sg', s: '___ (băiat), vino puțin încoace!', pista: 'chico — vocativo singular; familiar, a alguien más joven', ancla: 'vino puțin încoace', transparenteLatin: false },
  { p: VOC, lema: 'prieten', casilla: 'V sg', s: '___ (prieten), nu te supăra pe mine.', pista: 'amigo — vocativo singular; neutro', ancla: 'nu te supăra pe mine', transparenteLatin: false },
  { p: VOC, lema: 'copil', casilla: 'V sg', s: '___ (copil), spune-mi ce s-a întâmplat.', pista: 'niño — vocativo singular; familiar', ancla: 'spune-mi ce s-a întâmplat', transparenteLatin: false },
  { p: VOC, lema: 'doctor', casilla: 'V sg', s: '___ (doctor), mai durează mult?', pista: 'médico — vocativo singular; BRUSCO: el trato cortés es nominal (domnule doctor)', ancla: 'mai durează mult', transparenteLatin: false },
  // Aquí iba `frate → frate` (sin marca). NO PUEDE SER UN CLOZE: la
  // respuesta ES el lema y el lema está impreso entre paréntesis dos
  // palabras antes, así que se contesta copiando. Lo cazó el gate base
  // («la respuesta ya está escrita en la frase»), que existía desde el
  // lote 1 para el artículo. Los vocativos sin marca (frate, tată,
  // Maria, Mihai) se enseñan en la lección y no se puntúan aquí; queda
  // escrito porque son la MITAD segura del punto en A2.
  { p: VOC, lema: 'vecin', casilla: 'V sg', s: '___ (vecin), îmi dai și mie o mână de ajutor?', pista: 'vecino — vocativo singular; familiar, entre conocidos', ancla: 'îmi dai și mie o mână de ajutor', transparenteLatin: false },
  { p: VOC, lema: 'frate', casilla: 'V pl', s: '___ (frate), nu uitați ce v-am spus!', pista: 'hermano — vocativo PLURAL; lo único derivable por regla del punto (-lor sobre el plural)', ancla: 'nu uitați', transparenteLatin: false },
];

export function verificar(items: ClozeRo[]): string[] {
  const v = verificarBase(items);
  for (const [i, x] of items.entries()) {
    const id = `CLRO6-${String(i + 1).padStart(3, '0')} (${x.p})`;
    const l = LEMA.get(x.lema ?? '');
    if (!l) { v.push(`${id}: el lema no está en el lexicón`); continue; }

    if (x.p === VOC_ALT || x.p === CONS) {
      const rs = raiz(l.lema), rp = raiz(l.plural);
      const cambiaVocal = vocalesDe(rs) !== vocalesDe(rp);
      const cambiaCons = consonantesDe(rs) !== consonantesDe(rp);
      // El punto es lo que le pasa a la RAÍZ, no la desinencia (ése es
      // r2-plural-i-e-uri, ya cubierto). Y un lema que cambia las DOS
      // cosas (stradă → străzi) no mide ninguna limpiamente.
      if (x.p === VOC_ALT && !cambiaVocal) v.push(`${id}: «${l.lema} → ${l.plural}» no cambia la vocal de la raíz — el ítem no examina este punto`);
      if (x.p === VOC_ALT && cambiaCons) v.push(`${id}: «${l.lema} → ${l.plural}» cambia TAMBIÉN la consonante — mide las dos alternancias a la vez y ninguna limpiamente`);
      if (x.p === CONS && !cambiaCons) v.push(`${id}: «${l.lema} → ${l.plural}» no cambia la consonante de la raíz — el ítem no examina este punto`);
      if (x.p === CONS && cambiaVocal) v.push(`${id}: «${l.lema} → ${l.plural}» cambia TAMBIÉN la vocal — mide las dos alternancias a la vez`);
      if (x.casilla !== 'N pl') v.push(`${id}: la casilla declarada es «${x.casilla}» y el punto se examina en el plural`);
    }

    if (x.p === VOC) {
      if (x.casilla !== 'V sg' && x.casilla !== 'V pl') v.push(`${id}: la casilla declarada es «${x.casilla}»`);
      // La cicatriz del inventario: el vocativo NO es derivable del
      // género y el singular exige registro declarado. Si el lexicón no
      // lo trae, el ítem no puede salir — y la pista tiene que DECIRLO,
      // porque «doctorule!» está atestado y es brusco: enseñarlo sin el
      // registro enseña a ser maleducado con la gramática correcta.
      // Invariante propia: un vocativo sin marca se contesta copiando el
      // lema del paréntesis. No es que «el gate base lo pille»: es que no
      // se puede examinar en este formato, y hay que decirlo aquí.
      if (x.casilla === 'V sg' && [l.vocSg, ...(l.vocAlt ?? [])].includes(l.lema))
        v.push(`${id}: una de las formas correctas de «${l.lema}» es el lema mismo, impreso en el paréntesis de la frase — se contesta copiando`);
      if (x.casilla === 'V sg' && l.vocSg === null)
        v.push(`${id}: «${l.lema}» tiene vocativo SIN MARCA (= el lema) y el lema está impreso en la frase — se contesta copiando; este punto no se examina con cloze`);
      if (x.casilla === 'V sg' && l.vocSg === undefined)
        v.push(`${id}: «${l.lema}» no declara vocativo singular en el lexicón y no se inventa`);
      if (x.casilla === 'V sg' && l.vocSg && !l.registro)
        v.push(`${id}: vocativo marcado «${l.vocSg}» sin registro en el lexicón`);
      // El gate v0 comprobaba que ALGUNA palabra de registro apareciera,
      // no que fuera LA DEL LEXICÓN. O sea que la única cosa contra la que
      // el comentario de arriba dice proteger —enseñar `doctorule!` como
      // cortés— pasaba en silencio. Lo cazó el lingüista corriéndolo
      // contra dos ítems inventados: `fată` (brusc) con pista «familiar,
      // cariñoso» y `doctor` (brusc) con pista «neutro, cortés»: el gate
      // no dijo nada en ninguno de los dos.
      const PALABRA_REG: Record<string, RegExp> = { neutru: /neutro|cortés/i, familiar: /familiar/i, brusc: /brusco/i, popular: /popular/i };
      if (x.casilla === 'V sg' && l.registro && !PALABRA_REG[l.registro]?.test(x.pista))
        v.push(`${id}: la pista no declara el REGISTRO del lexicón («${l.registro}»), y -ule sobre un común es brusco (doctorule!)`);
      // `alt` NO se escribe a mano: sale de `vocAlt`. Si el lexicón trae
      // una segunda forma y el ítem no la declara, la tarjeta suspende
      // rumano correcto — la regla del coordinador, pagada en los lotes
      // 2 y 3.
      const esperado = x.casilla === 'V sg' ? (l.vocAlt ?? []) : [];
      const faltan = esperado.filter((a) => !(x.alt ?? []).includes(a));
      if (faltan.length) v.push(`${id}: faltan alternativas del lexicón: ${faltan.join(', ')}`);
    }
  }
  return v;
}

/** `alt` derivado del lexicón, no escrito a mano: una lista copiada se
 *  desincroniza, y el reparto -e/-ule está comprobado lema a lema en
 *  dexonline (§12) dentro de `vocAlt`. */
export const ITEMS_CON_ALT: ClozeRo[] = ITEMS.map((x) => {
  const l = LEMA.get(x.lema ?? '');
  return x.p === VOC && x.casilla === 'V sg' && l?.vocAlt?.length ? { ...x, alt: [...(x.alt ?? []), ...l.vocAlt] } : x;
});

// EL GUARDIÁN DEL BLOQUE PRINCIPAL VA ANCLADO AL FINAL. La v0 usaba
// `includes('<nombre>')`, y `cloze-ro-a1` es PREFIJO de `cloze-ro-a1c`,
// `cloze-ro-a2` lo es de a2b/a2c/a2d/a2e y `corr-ro-a1` de `corr-ro-a1b`:
// al importar un lote hijo, el bloque principal del padre corría entero
// —imprimía su tabla y podía llamar a `process.exit(1)` con SUS gates—.
// Falso rojo hoy; falso verde el día que alguien lea sólo el código de
// salida y se lo atribuya al lote equivocado. Lo cazó el lingüista
// adversarial en el lote 11. Tres colisiones reales en once ficheros.
if (new RegExp(`[/\\\\]cloze-ro-a2e\\.ts$`).test(process.argv[1] ?? '')) {
  const v = verificar(ITEMS_CON_ALT);
  if (process.argv.includes('--asigna')) {
    const r = informeAsigna(ITEMS_CON_ALT.map((x) => ({ p: x.p, sentence: x.s.replace('___', String(respuestaDe(x) ?? '')), hintEs: x.pista, answer: String(respuestaDe(x) ?? '') })));
    console.log('# A qué punto cuenta cada ítem del lote 10\n');
    console.log(r.lineas.join('\n'));
    process.exit(r.desvio ? 1 : 0);
  }
  console.log(`# Cloze derivado RO-A2e — alternancias y vocativo · ${ITEMS_CON_ALT.length} ítems · transparenteLatin ${ITEMS_CON_ALT.filter((x) => x.transparenteLatin).length}/${ITEMS_CON_ALT.length}\n`);
  for (const [i, x] of ITEMS_CON_ALT.entries())
    console.log(`${String(i + 1).padStart(2, '0')}. ${x.s}  → **${respuestaDe(x)}**${x.alt?.length ? ` (alt: ${x.alt.join(', ')})` : ''}  · ${x.pista}`);
  console.log('\n## Gates\n');
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

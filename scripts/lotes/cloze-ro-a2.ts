// scripts/lotes/cloze-ro-a2.ts — EL CUARTO LOTE RUMANO: cloze derivado, A1-A2.
//
//   npx tsx scripts/lotes/cloze-ro-a2.ts            # gates + tabla
//
// 24 ítems, los tres puntos `paradigma` de A1-A2 que el inventario manda a
// cloze derivado (género y neutro va a transformación, «o să» a corrección:
// el formato lo asigna el inventario, no la lista del encargo):
//   · r2-plural-i-e-uri       la respuesta es el plural GUARDADO del lexicón
//   · r2-articulo-enclitico-pl la deriva `articulado(l, 'pl')`
//   · r4-gd-definido-sg        la deriva `genitivoDativo(l, 'sg', true)`
//
// Contrato del lote 1 (`cloze-ro-a1.ts`, mismo `verificar`) más lo propio
// de cada casilla: el plural exige un TESTIGO de número (numeral, «multe»,
// «toate», verbo en plural); el artículo plural exige un testigo de
// determinación (posesivo, demostrativo, «toate», «din/de …»); el
// genitivo-dativo exige que el hueco vaya tras un sustantivo articulado
// (genitivo) o tras un verbo con clítico dativo («îi dau»). Sin testigo, el
// hueco admite otra casilla del paradigma y el ítem no mide.
import { ITEMS as _unused, verificar as verificarBase, respuestaDe, type ClozeRo } from './cloze-ro-a1';
import { informeAsigna } from '../lib/asigna-ro';
void _unused;

const PL = 'r2-plural-i-e-uri';
const ARTPL = 'r2-articulo-enclitico-pl';
const GD = 'r4-gd-definido-sg';

export const ITEMS: ClozeRo[] = [
  // ── r2-plural-i-e-uri · 8 ────────────────────────────────────────
  // La desinencia -i / -e / -uri sale del lexicón porque no es predecible
  // del singular. Un solo lema con alternancia (măr → mere, ă → e) y va
  // DECLARADA en la pista: el punto sigue siendo la desinencia. La v0 decía
  // «lemas SIN alternancia vocálica» y el ítem 05 la desmentía — el
  // lingüista lo cazó en la 2.ª pasada: un comentario en rojo es la misma
  // deuda que un gate en rojo.
  { p: PL, lema: 'scaun', casilla: 'N pl', s: 'În cameră sunt patru ___ (scaun).', pista: 'silla — plural (neutro en -e)', ancla: 'patru', transparenteLatin: false },
  { p: PL, lema: 'prieten', casilla: 'N pl', s: 'Am trei ___ (prieten) în Cluj.', pista: 'amigo — plural (masculino en -i)', ancla: 'trei', transparenteLatin: false },
  { p: PL, lema: 'tren', casilla: 'N pl', s: 'Sunt două ___ (tren) spre Brașov dimineața.', pista: 'tren — plural (neutro en -uri)', ancla: 'două', transparenteLatin: false },
  { p: PL, lema: 'copil', casilla: 'N pl', s: 'Bunica are doi ___ (copil).', pista: 'niño — plural (masculino en -i; el lema pierde la -l)', ancla: 'doi', transparenteLatin: false },
  { p: PL, lema: 'măr', casilla: 'N pl', s: 'Am mâncat cinci ___ (măr) roșii.', pista: 'manzana — plural (neutro en -e, con alternancia ă → e)', ancla: 'cinci', transparenteLatin: false },
  // v0 traía «zi» aquí: su plural es «zile», con la -l- del tema extendido
  // (lat. dies → zi / zile), y NO es la desinencia -i/-e/-uri que el punto
  // examina. Lo cazó el lingüista adversarial: el ítem estaba bien escrito y
  // no medía su punto. Sustituido por «oră → ore», femenino en -e sin
  // alternancia ni tema extendido.
  { p: PL, lema: 'oră', casilla: 'N pl', s: 'Filmul durează două ___ (oră).', pista: 'hora — plural (femenino en -e)', ancla: 'două', transparenteLatin: false },
  { p: PL, lema: 'an', casilla: 'N pl', s: 'Locuiesc aici de doi ___ (an).', pista: 'año — plural (masculino en -i)', ancla: 'doi', transparenteLatin: true },
  { p: PL, lema: 'lucru', casilla: 'N pl', s: 'Am multe ___ (lucru) de făcut azi.', pista: 'cosa — plural (neutro en -uri)', ancla: 'multe', transparenteLatin: false },

  // ── r2-articulo-enclitico-pl · 8 ─────────────────────────────────
  { p: ARTPL, lema: 'copil', casilla: 'N pl art', s: '___ (copil) noștri merg la școală.', pista: 'niño — plural con artículo definido enclítico (masculino: sobre el PLURAL, + -i)', ancla: 'noștri', transparenteLatin: false },
  { p: ARTPL, lema: 'prieten', casilla: 'N pl art', s: '___ (prieten) mei vin diseară.', pista: 'amigo — plural con artículo definido enclítico (masculino: sobre el PLURAL, + -i)', ancla: 'mei', transparenteLatin: false },
  { p: ARTPL, lema: 'carte', casilla: 'N pl art', s: '___ (carte) acestea sunt vechi.', pista: 'libro — plural con artículo definido enclítico (femenino: sobre el PLURAL, + -le)', ancla: 'acestea', transparenteLatin: false },
  // «lente» se QUEDA: DEX lo da como adjetivo estándar (lent, -ă, lenți,
  // lente) y Hunspell lo acepta; «încete» es más coloquial. El lingüista
  // retiró su objeción de la 1.ª pasada — menos frecuente ≠ agramatical, y
  // sólo se cambia lo atestado como agramatical.
  { p: ARTPL, lema: 'tren', casilla: 'N pl art', s: '___ (tren) acelea de noapte sunt lente.', pista: 'tren — plural con artículo definido enclítico (neutro: sobre el PLURAL, + -le)', ancla: 'acelea de noapte sunt lente', transparenteLatin: false },
  // D3 CERRADO (2026-09-02, orden del coordinador: reforzar o declarar,
  // no dejarlo «no bloqueante» una segunda sesión). Aquí y en el 12 el
  // testigo era el más débil del lote: para un nativo el hueco está
  // determinado —el sujeto plural escueto preverbal es agramatical en
  // rumano—, pero es una restricción que el alumno NO conoce, así que el
  // ítem le pedía adivinar. Se refuerza con el demostrativo pospuesto
  // «acelea», que no usaba ningún otro ítem: determina sin convertir el
  // lote en ocho «Toate».
  { p: ARTPL, lema: 'casă', casilla: 'N pl art', s: '___ (casă) acelea din sat sunt mici.', pista: 'casa — plural con artículo definido enclítico (femenino: sobre el PLURAL, + -le)', ancla: 'acelea din sat sunt mici', transparenteLatin: false },
  { p: ARTPL, lema: 'floare', casilla: 'N pl art', s: 'Toate ___ (floare) din grădină sunt albe.', pista: 'flor — plural con artículo definido enclítico (femenino: sobre el PLURAL en -i, + -le)', ancla: 'Toate', transparenteLatin: false },
  { p: ARTPL, lema: 'oraș', casilla: 'N pl art', s: '___ (oraș) acestea au metrou.', pista: 'ciudad — plural con artículo definido enclítico (neutro: sobre el PLURAL, + -le)', ancla: 'acestea', transparenteLatin: false },
  { p: ARTPL, lema: 'mașină', casilla: 'N pl art', s: 'Toate ___ (mașină) sunt parcate afară.', pista: 'coche — plural con artículo definido enclítico (femenino: sobre el PLURAL, + -le)', ancla: 'Toate', transparenteLatin: false },

  // ── r4-gd-definido-sg · 8 ────────────────────────────────────────
  // El hueco va tras un sustantivo articulado (genitivo: «casa ___») o tras
  // un verbo con clítico dativo («îi dau ___»); el femenino toma la forma
  // del plural + i (fetei, casei), regla que el paradigma lleva escrita.
  { p: GD, lema: 'frate', casilla: 'GD sg def', s: 'Casa ___ (frate) este mare.', pista: 'hermano — genitivo-dativo definido, singular («del hermano»: -lui)', ancla: 'Casa', transparenteLatin: false },
  { p: GD, lema: 'casă', casilla: 'GD sg def', s: 'Ușa ___ (casă) este deschisă.', pista: 'casa — genitivo-dativo definido, singular (femenino: desde el plural + i)', ancla: 'Ușa', transparenteLatin: false },
  { p: GD, lema: 'oraș', casilla: 'GD sg def', s: 'Numele ___ (oraș) este Cluj.', pista: 'ciudad — genitivo-dativo definido, singular (neutro: -ului)', ancla: 'Numele', transparenteLatin: false },
  { p: GD, lema: 'copil', casilla: 'GD sg def', s: 'Îi dau ___ (copil) o carte.', pista: 'niño — genitivo-dativo definido, singular (dativo tras «îi dau»: -ului)', ancla: 'Îi dau', transparenteLatin: false },
  { p: GD, lema: 'profesor', casilla: 'GD sg def', s: 'Cartea ___ (profesor) este pe masă.', pista: 'profesor — genitivo-dativo definido, singular (-ului)', ancla: 'Cartea', transparenteLatin: false },
  { p: GD, lema: 'fată', casilla: 'GD sg def', s: 'Mama ___ (fată) lucrează la spital.', pista: 'chica — genitivo-dativo definido, singular (femenino: desde el plural fete + i)', ancla: 'Mama', transparenteLatin: false },
  { p: GD, lema: 'birou', casilla: 'GD sg def', s: 'Fereastra ___ (birou) este mare.', pista: 'oficina — genitivo-dativo definido, singular (neutro en -u: -lui)', ancla: 'Fereastra', transparenteLatin: false },
  { p: GD, lema: 'bunic', casilla: 'GD sg def', s: 'Îi scriu ___ (bunic) o scrisoare.', pista: 'abuelo — genitivo-dativo definido, singular (dativo tras «îi scriu»: -ului)', ancla: 'Îi scriu', transparenteLatin: false },
];

export function verificar(items: ClozeRo[]): string[] {
  const v = verificarBase(items);
  for (const [i, x] of items.entries()) {
    const id = `CLRO2-${String(i + 1).padStart(3, '0')} (${x.p})`;
    const resto = x.s.replace('___', '').replace(/\([^)]*\)/g, ' ');
    if (x.p === PL && !/(?<![\p{L}])(doi|două|trei|patru|cinci|șase|șapte|opt|nouă|zece|multe|mulți|toate|toți|niște|câteva|câțiva)(?![\p{L}])/iu.test(resto))
      v.push(`${id}: sin testigo de plural (numeral, multe, toate…) — el hueco admite el singular`);
    if (x.p === ARTPL && !/(?<![\p{L}])(noștri|noastre|mei|mele|tăi|tale|lor|acestea|aceștia|acelea|aceia|toate|toți)(?![\p{L}])|(?<![\p{L}])(din|de) \p{L}+ (sunt|au)(?![\p{L}])/iu.test(resto))
      v.push(`${id}: sin testigo de determinación en plural — el hueco admite el plural sin artículo`);
    if (x.p === GD && !/^(\p{L}+(ul|le|a|ua|ea|ia|ele|ile|ii|urile) ___|Îi (dau|scriu|spun|aduc|trimit) ___)/u.test(x.s))
      v.push(`${id}: el hueco no va tras sustantivo articulado ni tras verbo con clítico dativo — el genitivo-dativo no está determinado`);
  }
  return v;
}

if (process.argv[1]?.includes('cloze-ro-a2')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--asigna')) {
    // A qué punto va a contar cada ítem DE VERDAD, con el contador de
    // `deficit-ro.ts` (importado, no copiado). Caza el punto declarado
    // que no existe en el inventario: cuenta cero y el total del lote
    // sigue siendo 24, así que no se nota por ninguna otra vía.
    const r = informeAsigna(ITEMS.map((x) => ({ p: x.p, sentence: x.s.replace('___', String(respuestaDe(x) ?? '')), hintEs: x.pista, answer: String(respuestaDe(x) ?? '') })));
    console.log('# A qué punto cuenta cada ítem del lote 4\n');
    console.log(r.lineas.join('\n'));
    process.exit(r.desvio ? 1 : 0);
  }
  console.log(`# Cloze derivado RO-A2 — ${ITEMS.length} ítems · transparenteLatin ${ITEMS.filter((x) => x.transparenteLatin).length}/${ITEMS.length}\n`);
  for (const [i, x] of ITEMS.entries()) console.log(`${String(i + 1).padStart(2, '0')}. ${x.s}  → **${respuestaDe(x)}**  · ${x.pista}`);
  console.log('\n## Gates\n');
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

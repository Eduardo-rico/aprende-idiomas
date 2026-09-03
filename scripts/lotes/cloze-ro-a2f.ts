// scripts/lotes/cloze-ro-a2f.ts — EL DECIMOCUARTO LOTE RUMANO: futuro,
// condicional e irregulares del presente. A1-A2.
//
//   npx tsx scripts/lotes/cloze-ro-a2f.ts            # gates + tabla
//   npx tsx scripts/lotes/cloze-ro-a2f.ts --asigna   # a qué punto cuenta
//
// 24 ítems, 3 puntos × 8, los tres por `paradigmaVerbal`.
//   · r5-futuro-cuatro-registros  `viitorLiterar()`  (nuevo)
//   · r5-condicional              `conditional()` y `conditionalPerfect()` (nuevos)
//   · r3-irregulares-a1           `presente()`
//
// LO QUE EL LOTE 12 DEJÓ APRENDIDO Y AQUÍ MANDA: los cuatro futuros
// rumanos son TODOS correctos —`voi merge` formal, `o să merg` coloquial
// estándar, `am să merg` coloquial, `oi merge` popular—, y el lote 12
// cayó entero por marcar como error el cuarto. Así que aquí el ítem
// tiene que FIJAR EL REGISTRO en la pista o no está determinado: sin eso,
// cuatro respuestas distintas serían correctas y la tarjeta suspendería
// tres. Se pide siempre el LITERAR, que además es el único derivable sin
// conjuntivo, y un gate comprueba que la pista lo diga.
//
// Y el condicional trae su propia trampa, que el gate vigila: la 1.ª del
// plural del condicional es `am` — la MISMA palabra que el auxiliar del
// perfect compus (`am mers`). Lo único que las separa es lo que va
// detrás: infinitivo corto (`am merge`, condicional) frente a participio
// (`am mers`, pasado). Un ítem de condicional en 1.ª pl. sin marco
// temporal es ambiguo de verdad, no por descuido.
import { verificar as verificarBase, respuestaDe, type ClozeRo } from './cloze-ro-a1';
import { VERBOS_A1 } from '../../lib/data/languages/ro/lexicon-a1';
import { presente } from '../lib/paradigma-ro';
import { informeAsigna } from '../lib/asigna-ro';

const FUT = 'r5-futuro-cuatro-registros';
const COND = 'r5-condicional';
const IRR = 'r3-irregulares-a1';

const AUX_FUT = ['voi', 'vei', 'va', 'vom', 'veți', 'vor'];
const AUX_COND = ['aș', 'ai', 'ar', 'am', 'ați'];
/** Los otros tres registros del futuro: correctos, y por eso el ítem
 *  tiene que excluirlos con la pista en vez de con el corrector. */
const OTROS_FUTUROS = /(?<![\p{L}])(o să|am să|ai să|are să|avem să|aveți să|au să|oi|ăi|om|oți|or)(?![\p{L}])/iu;

export const ITEMS: ClozeRo[] = [
  // ── r5-futuro-cuatro-registros · 8 · el LITERAR, y la pista lo fija ──
  { p: FUT, inf: 'a merge', per: 'eu', t: 'futuro', s: 'În calitate de delegat, eu ___ (a merge) la Cluj pentru negocieri.', pista: 'ir — futuro en el registro FORMAL Y ESCRITO (el de los cuatro que se usa en un informe), 1.ª singular', ancla: 'În calitate de delegat', transparenteLatin: false },
  { p: FUT, inf: 'a fi', per: 'el', t: 'futuro', s: 'Documentul ___ (a fi) gata până vineri.', pista: 'ser/estar — futuro FORMAL Y ESCRITO, 3.ª singular', ancla: 'gata până vineri', transparenteLatin: false },
  { p: FUT, inf: 'a avea', per: 'noi', t: 'futuro', s: 'Noi ___ (a avea) o ședință marți dimineața.', pista: 'tener — futuro FORMAL Y ESCRITO, 1.ª plural', ancla: 'marți dimineața', transparenteLatin: false },
  { p: FUT, inf: 'a plăti', per: 'tu', t: 'futuro', s: 'Tu ___ (a plăti) chiria la începutul lunii.', pista: 'pagar — futuro FORMAL Y ESCRITO, 2.ª singular', ancla: 'la începutul lunii', transparenteLatin: false },
  { p: FUT, inf: 'a veni', per: 'ei', t: 'futuro', s: 'Inspectorii ___ (a veni) miercuri la ora zece.', pista: 'venir — futuro FORMAL Y ESCRITO, 3.ª plural', ancla: 'miercuri la ora zece', transparenteLatin: false },
  // LA AMBIGÜEDAD DE `voi` QUE JUSTIFICABA SALTARSE ESTA CASILLA NO
  // EXISTE, y la había escrito aquí como doctrina. «Voi citi raportul»
  // NO significa «vosotros leéis el informe»: la 2.ª plural de `a citi`
  // es `citiți`. Y no es cosa de este verbo — todas las 2.ª plurales
  // acaban en -ați/-eți/-iți/-âți y ningún infinitivo corto acaba así,
  // de modo que `voi` + infinitivo corto SÓLO puede ser futuro de 1.ª
  // singular. Lo desmintió el lingüista en el lote 14. La casilla `veți`
  // vuelve, que además es —con `vei`— la que un hispanohablante más
  // falla, porque `voi/vom/vor` se calcan de «voy/vamos/van» y éstas no.
  { p: FUT, inf: 'a lucra', per: 'voi', t: 'futuro', s: 'Voi ___ (a lucra) și sâmbăta anul viitor?', pista: 'trabajar — futuro FORMAL Y ESCRITO, 2.ª plural', ancla: 'și sâmbăta anul viitor', transparenteLatin: false },
  { p: FUT, inf: 'a începe', per: 'el', t: 'futuro', s: 'Cursul ___ (a începe) în luna octombrie.', pista: 'empezar — futuro FORMAL Y ESCRITO, 3.ª singular', ancla: 'în luna octombrie', transparenteLatin: false },
  { p: FUT, inf: 'a citi', per: 'eu', t: 'futuro', s: 'Vă confirm că eu ___ (a citi) raportul înainte de ședință.', pista: 'leer — futuro FORMAL Y ESCRITO, 1.ª singular', ancla: 'Vă confirm că eu', transparenteLatin: false },

  // ── r5-condicional · 8 · analítico donde el español es sintético ──
  { p: COND, inf: 'a merge', per: 'eu', t: 'condicional', s: 'Eu ___ (a merge) cu tine la munte, dar nu am timp deloc.', pista: 'ir — condicional presente, 1.ª singular («iría»)', ancla: 'dar nu am timp deloc', transparenteLatin: false },
  { p: COND, inf: 'a vrea', per: 'tu', t: 'condicional', s: 'Ce ___ (a vrea) tu să bei acum?', pista: 'querer — condicional presente, 2.ª singular («querrías»)', ancla: 'să bei acum', transparenteLatin: false },
  { p: COND, inf: 'a putea', per: 'el', t: 'condicional', s: 'Colegul meu ___ (a putea) veni mâine dacă îl anunț.', pista: 'poder — condicional presente, 3.ª singular («podría»)', ancla: 'dacă îl anunț', transparenteLatin: false },
  { p: COND, inf: 'a merge', per: 'noi', t: 'condicional', s: 'Fără mașină, noi ___ (a merge) pe jos până la gară.', pista: 'ir — condicional presente, 1.ª plural («iríamos»); ojo: el auxiliar es la misma palabra que la del pasado, y lo que va detrás es un INFINITIVO, no un participio', ancla: 'Fără mașină', transparenteLatin: false },
  { p: COND, inf: 'a locui', per: 'voi', t: 'condicional', s: 'Voi ___ (a locui) la țară, dar nu aveți o casă acolo.', pista: 'vivir (residir) — condicional presente, 2.ª plural («viviríais»)', ancla: 'dar nu aveți o casă acolo', transparenteLatin: false },
  { p: COND, inf: 'a fi', per: 'el', t: 'condicional', s: 'Fără tine totul ___ (a fi) mult mai greu.', pista: 'ser/estar — condicional presente, 3.ª singular («sería»)', ancla: 'mult mai greu', transparenteLatin: false },
  { p: COND, inf: 'a spune', per: 'eu', t: 'condicional-perfecto', s: 'În locul tău, eu ___ (a spune) ceva atunci.', pista: 'decir — condicional PERFECTO, 1.ª singular («habría dicho»): lleva «fi» y el participio', ancla: 'În locul tău', transparenteLatin: false },
  { p: COND, inf: 'a veni', per: 'ei', t: 'condicional-perfecto', s: 'Fără ploaia de sâmbătă, ___ (a veni) și ei la petrecere.', pista: 'venir — condicional PERFECTO, 3.ª plural («habrían venido»)', ancla: 'și ei la petrecere', transparenteLatin: false },

  // ── r3-irregulares-a1 · 8 · las formas que se memorizan ───────────
  { p: IRR, inf: 'a fi', per: 'tu', t: 'presente', s: 'Tu ___ (a fi) prietenul meu cel mai bun.', pista: 'ser/estar — presente, 2.ª singular; el ÚNICO copulativo del rumano (no hay ser/estar)', ancla: 'prietenul meu cel mai bun', transparenteLatin: false },
  { p: IRR, inf: 'a avea', per: 'el', t: 'presente', s: 'Vecinul meu ___ (a avea) trei copii mici.', pista: 'tener — presente, 3.ª singular; es también el auxiliar del pasado', ancla: 'trei copii mici', transparenteLatin: false },
  { p: IRR, inf: 'a vrea', per: 'ei', t: 'presente', s: 'Copiii ___ (a vrea) să meargă la mare.', pista: 'querer — presente, 3.ª plural; ojo: la MISMA palabra es el auxiliar de futuro de 3.ª plural, y aquí no lo es porque detrás va «să» + conjuntivo y no un infinitivo', ancla: 'să meargă la mare', transparenteLatin: false },
  { p: IRR, inf: 'a da', per: 'ei', t: 'presente', s: 'Copiii ___ (a da) mereu bacșiș la restaurant.', pista: 'dar — presente, 3.ª plural (la regla daría la forma del singular)', ancla: 'bacșiș la restaurant', transparenteLatin: false },
  { p: IRR, inf: 'a sta', per: 'ei', t: 'presente', s: 'De ce ___ (a sta) oamenii în picioare la concert?', pista: 'estar (de pie), quedarse — presente, 3.ª plural (la regla daría la forma del singular)', ancla: 'în picioare la concert', transparenteLatin: false },
  { p: IRR, inf: 'a lua', per: 'tu', t: 'presente', s: 'Tu ___ (a lua) autobuzul sau metroul?', pista: 'tomar, coger — presente, 2.ª singular; la vocal de la raíz cambia', ancla: 'autobuzul sau metroul', transparenteLatin: false },
  { p: IRR, inf: 'a bea', per: 'eu', t: 'presente', s: 'Dimineața eu ___ (a bea) o cafea mare.', pista: 'beber — presente, 1.ª singular', ancla: 'o cafea mare', transparenteLatin: false },
  { p: IRR, inf: 'a da', per: 'el', t: 'presente', s: 'Bunicul ___ (a da) bani nepoților de ziua lor.', pista: 'dar — presente, 3.ª singular', ancla: 'de ziua lor', transparenteLatin: false },
];

export function verificar(items: ClozeRo[]): string[] {
  const v = verificarBase(items);
  const irregulares = new Set(VERBOS_A1.filter((x) => x.irregular).map((x) => x.inf));
  for (const [i, x] of items.entries()) {
    const id = `CLRO9-${String(i + 1).padStart(3, '0')} (${x.p})`;
    const r = respuestaDe(x) ?? '';
    const resto = x.s.replace('___', '').replace(/\([^)]*\)/g, ' ');

    // FUT · LA INVARIANTE DEL LOTE 12: los cuatro registros son
    // CORRECTOS, así que la pista tiene que fijar cuál se pide. Sin eso
    // el hueco tiene cuatro respuestas buenas y la tarjeta suspende tres.
    if (x.p === FUT) {
      if (x.t !== 'futuro') v.push(`${id}: el punto es el futuro y el tiempo declarado es «${x.t}»`);
      if (!/FORMAL Y ESCRITO/.test(x.pista))
        v.push(`${id}: la pista no fija el REGISTRO — los cuatro futuros son correctos y sin fijarlo el ítem tiene cuatro respuestas buenas`);
      if (!AUX_FUT.some((a) => new RegExp(`^${a} `).test(r)))
        v.push(`${id}: «${r}» no es el viitor literar (voi/vei/va/vom/veți/vor + infinitivo)`);
      // Y la frase no puede llevar OTRO futuro escrito: sería enseñar que
      // el registro da igual justo en el punto que lo examina.
      if (OTROS_FUTUROS.test(resto)) v.push(`${id}: la frase lleva otro registro de futuro — el punto es la ELECCIÓN de registro`);
    }

    // COND · la trampa de `am`: 1.ª pl. del condicional es la misma
    // palabra que el auxiliar del perfect compus, y sólo lo de detrás
    // las separa. Un ítem así sin marco irreal es ambiguo de verdad.
    if (x.p === COND) {
      if (x.t !== 'condicional' && x.t !== 'condicional-perfecto')
        v.push(`${id}: el punto es el condicional y el tiempo declarado es «${x.t}»`);
      if (!AUX_COND.some((a) => new RegExp(`^${a} `).test(r)))
        v.push(`${id}: «${r}» no lleva auxiliar de condicional (aș/ai/ar/am/ați)`);
      if (/^am /.test(r) && !/(dacă|fără|în locul|de-ar|oare)/iu.test(resto))
        v.push(`${id}: 1.ª plural del condicional («am» + infinitivo) sin marco irreal — se confunde con el perfect compus («am» + participio)`);
      if (x.t === 'condicional-perfecto' && !/ fi /.test(r))
        v.push(`${id}: el condicional perfecto lleva «fi» + participio y «${r}» no lo lleva`);
    }

    // IRR · el punto no es «VERBO irregular», es «CASILLA irregular». El
    // gate v0 preguntaba sólo si el LEMA estaba marcado, y con eso
    // pasaban `stai` y `luați`, que la regla general produce sola: la
    // irregularidad de `a sta` vive en `stă/stăm`, no en `stai`, y la de
    // `a lua` en la diptongación `iau/iei/ia`, no en la 2.ª plural. Era
    // «un sello responde a UNA pregunta»: el sello decía «el verbo es
    // irregular» y se usaba para probar «la casilla es irregular».
    if (x.p === IRR) {
      if (!irregulares.has(x.inf ?? '') && !VERBOS_A1.find((y) => y.inf === x.inf)?.invariable)
        v.push(`${id}: «${x.inf}» no está marcado como irregular en el lexicón — su presente se deriva por regla`);
      if (x.t !== 'presente') v.push(`${id}: el punto es el presente y el tiempo declarado es «${x.t}»`);
      const lema = VERBOS_A1.find((y) => y.inf === x.inf);
      // `eu` y `el` se GUARDAN para todos los verbos, así que ahí «se
      // deriva por regla» es vacuo y lo que se examina es memoria.
      if (lema?.irregular && x.per && x.per !== 'eu' && x.per !== 'el') {
        const sinRecord: any = { ...lema }; delete sinRecord.irregular;
        if (presente(sinRecord, x.per) === r)
          v.push(`${id}: «${r}» es lo que da la REGLA GENERAL — la casilla «${x.per}» de «${x.inf}» no es irregular y el ítem no examina su punto`);
      }
    }

    // RESPUESTA ANALÍTICA: el gate base comprueba que la respuesta ENTERA
    // no esté en la frase, y con «ați locui» ≠ «ați avea» dejaba pasar un
    // ítem que regalaba el AUXILIAR —y con él la regla entera del bloque—
    // seis palabras a la derecha. 16 de los 24 ítems tienen respuesta
    // analítica, así que el auxiliar solo también se comprueba.
    if (/ /.test(r)) {
      const aux = r.split(' ')[0]!;
      if (new RegExp(`(?<![\\p{L}])${aux}(?![\\p{L}])`, 'iu').test(resto))
        v.push(`${id}: el auxiliar «${aux}» de la respuesta «${r}» ya está escrito en la frase`);
    }

    // Común a los tres: sin testigo de persona el hueco admite otra
    // casilla. Aquí NO vale el sincretismo como excusa —cada persona da
    // forma distinta en los tres tiempos— así que se exige siempre.
    if (x.per && !new RegExp(`(?<![\\p{L}])${x.per}(?![\\p{L}])`, 'iu').test(resto)) {
      const sujeto = /(?<![\p{L}])(vecinul|copiii|colegul|inspectorii|documentul|cursul|nimeni|totul|angajații|bunicul|oamenii)(?![\p{L}])/iu.test(resto);
      if (!sujeto) v.push(`${id}: sin testigo de persona («${x.per}») ni sujeto explícito — el hueco admite otra casilla`);
    }
  }
  return v;
}

if (new RegExp(`[/\\\\]cloze-ro-a2f\\.ts$`).test(process.argv[1] ?? '')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--asigna')) {
    const r = informeAsigna(ITEMS.map((x) => ({ p: x.p, sentence: x.s.replace('___', String(respuestaDe(x) ?? '')), hintEs: x.pista, answer: String(respuestaDe(x) ?? '') })));
    console.log('# A qué punto cuenta cada ítem del lote 14\n');
    console.log(r.lineas.join('\n'));
    process.exit(r.desvio ? 1 : 0);
  }
  console.log(`# Cloze RO-A2f — futuro, condicional e irregulares · ${ITEMS.length} ítems · transparenteLatin ${ITEMS.filter((x) => x.transparenteLatin).length}/${ITEMS.length}\n`);
  for (const [i, x] of ITEMS.entries()) console.log(`${String(i + 1).padStart(2, '0')}. ${x.s}  → **${respuestaDe(x)}**  · ${x.pista}`);
  console.log('\n## Gates\n');
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

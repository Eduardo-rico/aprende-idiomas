// scripts/lotes/corr-ro-a1.ts — EL SEGUNDO LOTE RUMANO: corrección, A1.
//
//   npx tsx scripts/lotes/corr-ro-a1.ts            # preflight + gates
//   npx tsx scripts/lotes/corr-ro-a1.ts --json     # ítems para publicar
//
// 24 ítems, tres puntos de clase `trampa` del inventario (8 cada uno). Un
// punto es `trampa` cuando el calco del hispanohablante es español
// PERFECTO: no hay glosa que lo cace y hay que PRODUCIR la forma rumana.
//   · r3-sa-vs-infinitivo    «quiero ir» → *vreau a merge → vreau să merg
//   · r3-trebuie-invariable  «debemos» → *trebuim → trebuie
//   · r2-numerales-de        «veinte años» → *douăzeci ani → douăzeci de ani
//
// El contrato es el de PT (`scripts/lib/correccion.ts`, agnóstico de
// lengua): `calcoEs` obligatorio —la frase española de la que sale el
// error, porque si el error no es el que un hispanohablante comete de
// verdad, el ítem corrige algo que nadie escribe—, corrección MÍNIMA por
// multiconjunto, explicación que enseña la regla y no repite la frase,
// alternativas sólo donde la tarjeta no las aceptaría ya. Y los dos del
// rumano: la frase BUENA entera por Hunspell (la mala lleva el error a
// propósito y no se pasa) y ortografía DOOM3 en mala y buena.
import { verificar as verificarBase, preflight, type ItemCorreccion } from '../lib/correccion';
import { revisarOrtografiaRo } from '../../lib/lang/ortografia-ro';
import { medirAtajo } from '../lib/atajo-correccion';
import { revisarCopula } from '../lib/copula-ro';
import { hunspellDisponible, desconocidas } from '../lib/hunspell-ro';

const SA = 'r3-sa-vs-infinitivo';
const TREBUIE = 'r3-trebuie-invariable';
const NUM = 'r2-numerales-de';

export const ITEMS: ItemCorreccion[] = [
  // ══ r3-sa-vs-infinitivo (8) ═══════════════════════════════════════
  // El infinitivo NO es el complemento por defecto: tras vreau, pot,
  // trebuie, îmi place, încep va să + conjuntivo (que en 1.ª/2.ª es el
  // presente y en 3.ª tiene forma propia: să doarmă, să vină). El calco
  // «vreau a merge» es exactamente «quiero ir», palabra por palabra.
  { p: SA, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Vreau a merge la mare vara aceasta.', buena: 'Vreau să merg la mare vara aceasta.',
    calcoEs: 'Quiero ir al mar este verano.',
    explicacion: 'Tras «vreau» el rumano actual no pone infinitivo sino «să» + presente: el verbo se conjuga con la misma persona que «vreau». (Otros verbos, como «a putea» o «a începe», sí admiten infinitivo; «a vrea» no.)' },
  { p: SA, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Pot a veni mâine la tine.', buena: 'Pot să vin mâine la tine.', alt: ['Pot veni mâine la tine.'],
    calcoEs: 'Puedo venir mañana a tu casa.',
    explicacion: 'Con «a putea» hay dos salidas: «pot să vin» (conjuntivo) o «pot veni» (infinitivo SIN la partícula «a»). En rumano actual no se dice «pot a veni»: la «a» del infinitivo cae detrás de «a putea».' },
  // «Îmi place a citi» salió: el infinitivo-sujeto es libresco pero lícito
  // (GALR; «îmi place a crede că» vive en registro culto). El lingüista lo
  // cazó: un ítem de corrección sólo entra con la mala atestada agramatical.
  { p: SA, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Putem a merge pe jos până la gară.', buena: 'Putem să mergem pe jos până la gară.', alt: ['Putem merge pe jos până la gară.'],
    calcoEs: 'Podemos ir a pie hasta la estación.',
    explicacion: 'Con «a putea» hay dos salidas: «putem să mergem» o «putem merge» (infinitivo sin «a»). La partícula «a» detrás de «putem» es el calco de «podemos ir».' },
  { p: SA, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Eu trebuie a pleca acum.', buena: 'Eu trebuie să plec acum.',
    calcoEs: 'Yo debo irme ahora.',
    explicacion: '«Trebuie» es invariable y el sujeto lo lleva el conjuntivo: «trebuie să plec» (yo), «trebuie să pleci» (tú). «Trebuie a pleca» calca «tener que irse» y no existe.' },
  { p: SA, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Vrem a mânca ceva înainte de film.', buena: 'Vrem să mâncăm ceva înainte de film.',
    calcoEs: 'Queremos comer algo antes de la película.',
    explicacion: 'El verbo subordinado se conjuga con «să» en la MISMA persona que el principal: «vrem să mâncăm». La 1.ª del plural sale del tema del infinitivo (mânc-), no de «mănânc».' },
  { p: SA, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Ea vrea a dormi puțin după masă.', buena: 'Ea vrea să doarmă puțin după masă.',
    calcoEs: 'Ella quiere dormir un poco después de la comida.',
    explicacion: 'En 3.ª persona el conjuntivo tiene forma propia, distinta del indicativo: «doarme» → «să doarmă». Tras «vrea» va esa forma, nunca el infinitivo.' },
  { p: SA, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Poți a mă ajuta cu bagajul?', buena: 'Poți să mă ajuți cu bagajul?', alt: ['Mă poți ajuta cu bagajul?'],
    calcoEs: '¿Puedes ayudarme con el equipaje?',
    explicacion: 'Con «poți» el complemento va con «să» + presente («să mă ajuți») o con infinitivo sin «a» y el clítico delante («mă poți ajuta»). «Poți a mă ajuta» mezcla las dos y en rumano actual no se dice.' },
  // «Începem a lucra» salió: «a începe» RIGE infinitivo con «a» (DGLR; «a
  // început a ninge» es literario vivo). Era el único ítem del lote donde el
  // calco acertaba. Lo cazó el lingüista.
  { p: SA, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Nu poți a intra fără bilet.', buena: 'Nu poți să intri fără bilet.', alt: ['Nu poți intra fără bilet.'],
    calcoEs: 'No puedes entrar sin billete.',
    explicacion: 'Tras «a putea» el infinitivo va SIN «a» («nu poți intra») o se usa «să» + presente («nu poți să intri»). «Poți a intra» calca «puedes entrar» con la partícula puesta.' },

  // ══ r3-trebuie-invariable (8) ═════════════════════════════════════
  // «trebuie» no concuerda: el sujeto lo lleva el conjuntivo. El calco
  // conjuga «deber» (debo, debemos, debéis) y produce *trebuiesc,
  // *trebuim, *trebuiți. («Îmi trebuiesc bani», con sentido léxico de
  // «me hacen falta», es otra cosa y entra en B1: aquí se enseña el modal.)
  { p: TREBUIE, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Trebuim să învățăm mai mult pentru examen.', buena: 'Trebuie să învățăm mai mult pentru examen.',
    calcoEs: 'Debemos estudiar más para el examen.',
    explicacion: 'Como modal (con «să»), «trebuie» es una forma única para todas las personas; la persona la marca el verbo que sigue: «trebuie să învățăm». «Trebuim» calca «debemos».' },
  { p: TREBUIE, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Trebuiți să veniți la timp.', buena: 'Trebuie să veniți la timp.',
    calcoEs: 'Debéis venir a tiempo.',
    explicacion: 'Aunque el sujeto sea «voi», el modal no cambia: «trebuie să veniți». La 2.ª del plural está en «veniți», no en el modal.' },
  { p: TREBUIE, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Copiii trebuiesc să doarmă devreme.', buena: 'Copiii trebuie să doarmă devreme.',
    calcoEs: 'Los niños deben dormir temprano.',
    explicacion: 'Con sujeto plural el modal sigue siendo «trebuie»: «copiii trebuie să doarmă». El plural vive en «copiii» y en «să doarmă», no en el modal.' },
  { p: TREBUIE, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Trebuiești să mănânci mai mult.', buena: 'Trebuie să mănânci mai mult.',
    calcoEs: 'Debes comer más.',
    explicacion: '«Trebuie» no tiene forma de 2.ª persona: «trebuie să mănânci» ya dice «tú» en «mănânci». Conjugar el modal es calcar «debes».' },
  { p: TREBUIE, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Noi trebuim să plătim chiria azi.', buena: 'Noi trebuie să plătim chiria azi.',
    calcoEs: 'Nosotros debemos pagar el alquiler hoy.',
    explicacion: 'Incluso con «noi» explícito, el modal no concuerda: «noi trebuie să plătim». Es de los pocos verbos rumanos que no se conjugan con su sujeto.' },
  { p: TREBUIE, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Ei trebuiesc să lucreze și sâmbăta.', buena: 'Ei trebuie să lucreze și sâmbăta.',
    calcoEs: 'Ellos deben trabajar también los sábados.',
    explicacion: 'Como modal, «trebuie» vale para «ei» igual que para «eu»: la 3.ª del plural está en «să lucreze». Existe un «trebuiesc» rumano, pero es otro verbo: «îmi trebuiesc bani» = me hacen falta, con la cosa como sujeto.' },
  { p: TREBUIE, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Eu trebuiesc să citesc mai mult în română.', buena: 'Eu trebuie să citesc mai mult în română.',
    calcoEs: 'Yo debo leer más en rumano.',
    explicacion: 'La forma es la misma con «eu»: «eu trebuie să citesc». Al hispanohablante le sale «trebuiesc» porque conjuga «debo»; el rumano deja el modal quieto.' },
  { p: TREBUIE, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Trebuim să cumpărăm pâine și lapte.', buena: 'Trebuie să cumpărăm pâine și lapte.',
    calcoEs: 'Tenemos que comprar pan y leche.',
    explicacion: '«Tenemos que» también lleva al calco «trebuim». En rumano: «trebuie să cumpărăm», con el modal invariable y la persona en «cumpărăm».' },

  // ══ r2-numerales-de (8) ═══════════════════════════════════════════
  // Desde 20, el numeral se une al sustantivo con «de»: douăzeci DE ani,
  // o sută DE lei. «Veinte años» sin nada es español perfecto y el calco
  // *douăzeci ani es lo que escribe todo hispanohablante.
  //
  // (El dativo experimentante —mi-e foame— salió de este lote por una
  // premisa que resultó FALSA: «am foame» NO está en DEX (sólo «a-i fi
  // foame»). Lo que sí está atestado, y NO se puede corregir, es «am
  // teamă» (NODEX), «am frică» (Alecsandri, DLRLC) y «am rușine» (MDA2,
  // raro). Los 8 calcos agramaticales van al lote 3 con su gate propio.)
  { p: NUM, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Am douăzeci ani și locuiesc în Cluj.', buena: 'Am douăzeci de ani și locuiesc în Cluj.',
    calcoEs: 'Tengo veinte años y vivo en Cluj.',
    explicacion: 'A partir de 20, el numeral no va pegado al sustantivo: se une con «de» — «douăzeci de ani». Por debajo de 20 no: «zece ani», «nouăsprezece ani».' },
  { p: NUM, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Biletul costă o sută lei.', buena: 'Biletul costă o sută de lei.',
    calcoEs: 'El billete cuesta cien lei.',
    explicacion: '«O sută» es más de 20: pide «de» antes del sustantivo, «o sută de lei». El español no pone nada entre «cien» y «lei», y de ahí el calco.' },
  { p: NUM, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Sunt treizeci elevi în clasă.', buena: 'Sunt treizeci de elevi în clasă.',
    calcoEs: 'Hay treinta alumnos en la clase.',
    explicacion: 'Con «treizeci» el sustantivo va precedido de «de»: «treizeci de elevi». La regla es constante desde 20 hacia arriba.' },
  { p: NUM, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Am cumpărat douăzeci și cinci mere.', buena: 'Am cumpărat douăzeci și cinci de mere.',
    calcoEs: 'He comprado veinticinco manzanas.',
    explicacion: 'El «de» lo pide el ÚLTIMO tramo del numeral: «douăzeci și cinci DE mere» (25), pero «o sută doi lei» (102) sin «de», porque el tramo final es «doi».' },
  { p: NUM, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Bunicul meu are optzeci ani.', buena: 'Bunicul meu are optzeci de ani.',
    calcoEs: 'Mi abuelo tiene ochenta años.',
    explicacion: '«Optzeci de ani»: la edad se dice siempre con «de» a partir de los 20. «Optzeci ani» es el calco de «ochenta años».' },
  { p: NUM, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Cartea are două sute pagini.', buena: 'Cartea are două sute de pagini.',
    calcoEs: 'El libro tiene doscientas páginas.',
    explicacion: 'Las centenas llevan «de» como las decenas: «două sute de pagini». El español dice «doscientas páginas» sin enlace, y ése es el calco.' },
  { p: NUM, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'Am nevoie de cincizeci lei pentru bilet.', buena: 'Am nevoie de cincizeci de lei pentru bilet.',
    calcoEs: 'Necesito cincuenta lei para el billete.',
    explicacion: 'Aunque ya haya un «de» antes («am nevoie de»), el numeral lleva el suyo: «de cincizeci de lei». Dos «de» seguidos son normales aquí.' },
  { p: NUM, pasada: 1, espejoEs: false, atajoEs: false,
    mala: 'La curs sunt patruzeci studenți.', buena: 'La curs sunt patruzeci de studenți.',
    calcoEs: 'En el curso hay cuarenta estudiantes.',
    explicacion: '«Patruzeci de studenți»: la regla del «de» no depende del sustantivo ni del contexto, sólo del último tramo del numeral (de 20 en adelante; con «o sută unu», «o sută doi», no).' },
];

/** Los gates de PT + los dos del rumano. */
export function verificar(items: ItemCorreccion[]): string[] {
  const v = verificarBase(items);
  const palabras: string[] = [];
  for (const [i, x] of items.entries()) {
    const id = `CORO-${String(i + 1).padStart(3, '0')} (${x.p})`;
    for (const [campo, t] of [['mala', x.mala], ['buena', x.buena], ...(x.alt ?? []).map((a) => ['alt', a] as const)] as const)
      for (const h of revisarOrtografiaRo(t)) v.push(`${id}: ortografía en ${campo}: «${h.palabra}» (${h.clase})`);
    // La frase BUENA (y sus alternativas) por Hunspell; la mala no, que lleva el error.
    for (const t of [x.buena, ...(x.alt ?? [])]) palabras.push(...t.replace(/[^\p{L}\- ]/gu, ' ').split(/\s+/).filter(Boolean).map((w) => w.replace(/^-|-$/g, '')));
    // El error tiene que estar en la mala: si la mala ya es correcta para
    // Hunspell y para la regla, no hay nada que corregir. Comprobación
    // barata: mala ≠ buena ya lo mira la base; aquí, que la palabra que
    // cambia sea la del punto.
    if (x.p === TREBUIE && !/trebui(esc|m|ți|ești)/i.test(x.mala)) v.push(`${id}: el punto es «trebuie» invariable y la mala no conjuga el modal`);
    if (x.p === SA && !/\b(a|să) \p{L}+/u.test(x.mala)) v.push(`${id}: el punto es să vs infinitivo y la mala no lleva infinitivo con «a»`);
    // La tarjeta pinta SÓLO la frase mala (ErrorCorrectionCard): si la mala
    // no fija la persona, «Trebuie a pleca» admite să plec/pleci/plece/…
    // y suspende cuatro respuestas correctas. Con regente invariable
    // («trebuie») hace falta pronombre; con regente conjugado no.
    if (x.p === SA && /(?<![\p{L}])trebuie a(?![\p{L}])/iu.test(x.mala) && !/(?<![\p{L}])(eu|tu|el|ea|noi|voi|ei|ele)(?![\p{L}])/iu.test(x.mala)) v.push(`${id}: la mala no fija la persona y el alumno no ve el calco — indeterminada`);
    // Y el regente de la mala no puede ser uno que RIJA infinitivo con «a»
    // (a începe, a încerca, a învăța, a ști, a apuca…): ahí la «mala» es
    // rumano correcto. Lista DGLR.
    if (x.p === SA && /(?<![\p{L}])(încep\p{L}*|încerc\p{L}*|înv[aă]ț\p{L}*|apuc\p{L}*|îndrăznesc|izbut\p{L}*|pornesc|primesc) a \p{L}/iu.test(x.mala)) v.push(`${id}: el regente rige infinitivo con «a» en rumano — la mala es correcta`);
    if (x.p === NUM && !/(zeci|sută|sute|mie|mii)( și \p{L}+)? \p{L}/u.test(x.mala)) v.push(`${id}: el punto es el «de» de los numerales y la mala no tiene numeral ≥ 20 pegado al sustantivo`);
    if (x.p === NUM && !/(zeci|sută|sute|mie|mii)( și \p{L}+)? de \p{L}/u.test(x.buena)) v.push(`${id}: la buena no lleva el «de» tras el numeral`);
  }
  // EL ATAJO, medido y con gate. `undefined` es un fallo: «no medido» no
  // es «limpio», que es la confusión que dejó este campo sin existir
  // durante nueve lotes.
  // La cópula `este`/`e`: la invariante vive AQUÍ y no en el comparador,
  // que es ciego a la lengua y aceptaría la conjunción «y» portuguesa
  // como el demostrativo. Allowlist: falla cerrado en todo punto que no
  // declare que la alternancia es libre.
  v.push(...revisarCopula(items.map((x) => ({ p: x.p, buena: x.buena, alt: x.alt })), 'COP'));
  const m = medirAtajo(items, 'ATAJO');
  for (const id of m.sinDeclarar) v.push(`${id}: atajoEs sin declarar — el atajo de traducción no se ha medido en este ítem`);
  for (const id of m.atajo) v.push(`${id}: atajoEs=true — traduciendo el calco se llega a la BUENA, así que el ítem mide español`);
  for (const d of m.discrepan) v.push(`${d}`);
  if (!hunspellDisponible()) v.push('hunspell no disponible: el segundo camino NO corrió y esto no es verde');
  else for (const w of desconocidas(palabras.filter((w) => w && !/^[A-ZĂÂÎȘȚ]/.test(w)))) v.push(`hunspell no reconoce «${w}» en una frase buena`);
  return v;
}

// EL GUARDIÁN DEL BLOQUE PRINCIPAL VA ANCLADO AL FINAL. La v0 usaba
// `includes('<nombre>')`, y `cloze-ro-a1` es PREFIJO de `cloze-ro-a1c`,
// `cloze-ro-a2` lo es de a2b/a2c/a2d/a2e y `corr-ro-a1` de `corr-ro-a1b`:
// al importar un lote hijo, el bloque principal del padre corría entero
// —imprimía su tabla y podía llamar a `process.exit(1)` con SUS gates—.
// Falso rojo hoy; falso verde el día que alguien lea sólo el código de
// salida y se lo atribuya al lote equivocado. Lo cazó el lingüista
// adversarial en el lote 11. Tres colisiones reales en once ficheros.
if (new RegExp(`[/\\\\]corr-ro-a1\\.ts$`).test(process.argv[1] ?? '')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--json')) { console.log(JSON.stringify(ITEMS, null, 2)); process.exit(v.length ? 1 : 0); }
  const porPunto = new Map<string, number>();
  for (const x of ITEMS) porPunto.set(x.p, (porPunto.get(x.p) ?? 0) + 1);
  console.log(`# Corrección RO-A1 — ${ITEMS.length} ítems\n`);
  for (const [p, n] of porPunto) console.log(`- \`${p}\`: ${n}`);
  console.log('');
  for (const l of preflight(ITEMS)) console.log(l);
  console.log('\n## Ítems\n');
  for (const [i, x] of ITEMS.entries()) console.log(`${String(i + 1).padStart(2, '0')}. ✗ ${x.mala}\n    ✓ ${x.buena}${x.alt?.length ? `  (alt: ${x.alt.join(' / ')})` : ''}\n    ← ${x.calcoEs}`);
  console.log('\n## Gates\n');
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio: calco declarado, corrección mínima, explicación que enseña, ortografía DOOM3, frase buena por Hunspell.');
}

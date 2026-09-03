// scripts/lotes/cloze-ro-a1c.ts — EL UNDÉCIMO LOTE RUMANO: los clíticos y
// la negación. A1.
//
//   npx tsx scripts/lotes/cloze-ro-a1c.ts            # gates + tabla
//   npx tsx scripts/lotes/cloze-ro-a1c.ts --asigna   # a qué punto cuenta
//
// 24 ítems, 3 puntos × 8, los tres CLASES CERRADAS: la respuesta no se
// deriva de un lema, se elige de una tabla de seis u ocho formas. Por eso
// va declarada (`r`) y no por `paradigmaNominal` — y por eso el gate de
// este lote es distinto: comprueba PERTENENCIA A LA TABLA, que es el
// equivalente honesto de «recalcular la forma» cuando no hay nada que
// calcular.
//   · r6-cliticos-acusativo  mă, te, îl, o, ne, vă, îi, le
//   · r6-cliticos-dativo     îmi, îți, îi, ne, vă, le
//   · r3-negacion-nu         la GRAFÍA del clúster (n-am, nu-l, nu-mi)
//
// `r3-negacion-nu` llega con su regla de `alt` ESCRITA EN EL INVENTARIO,
// que es lo más limpio que ha pasado en esta fase: «la contracción es la
// forma corriente y la plena es la de registro cuidado — las dos son
// correctas (DOOM3), y el ítem acepta las dos». Así que aquí `alt` no es
// algo que el revisor descubra: nace con el punto. Un gate lo exige.
//
// Y la homonimia que el inventario nombra y que hay que vigilar: `îi` es
// dativo singular Y acusativo plural masculino. Los ítems de los dos
// puntos que usan `îi` tienen que determinar cuál es por el contexto, o
// el mismo hueco cuenta a dos puntos.
import { verificar as verificarBase, type ClozeRo } from './cloze-ro-a1';
import { informeAsigna } from '../lib/asigna-ro';

const AC = 'r6-cliticos-acusativo';
const DAT = 'r6-cliticos-dativo';
const NEG = 'r3-negacion-nu';

/** Las tablas. No se derivan: se eligen. */
const TABLA_AC = ['mă', 'te', 'îl', 'o', 'ne', 'vă', 'îi', 'le'];
const TABLA_DAT = ['îmi', 'îți', 'îi', 'ne', 'vă', 'le'];

/** La contracción y su forma plena, POR TABLA y no por regla. La v0 de
 *  este gate las derivaba con `replace('-', ' ')` y salían «nu l», «nu
 *  mi», «nu i»: la contracción se come la «î» inicial del clítico y eso
 *  no es una sustitución de guion por espacio. Marcó tres ítems correctos.
 *  Es la clase de fallo que este lote examina, cometida por el gate que
 *  la examina. Fuente: DOOM3, s.v. «nu». */
const PLENA: Record<string, string> = {
  'n-am': 'nu am', 'n-ai': 'nu ai', 'n-a': 'nu a', 'n-aveți': 'nu aveți', 'n-au': 'nu au',
  'nu-l': 'nu îl', 'nu-i': 'nu îi', 'nu-mi': 'nu îmi', 'nu-ți': 'nu îți',
  'nu-ne': 'nu ne', 'nu-le': 'nu le', 'nu-o': 'nu o',
};

export const ITEMS: ClozeRo[] = [
  // ── r6-cliticos-acusativo · 8 · la posición transfiere, la FORMA no ──
  { p: AC, r: 'îl', s: 'Pe Ion ___ sun în fiecare seară.', pista: 'clítico de acusativo: sustituye a «pe Ion» — masculino singular', ancla: 'Pe Ion', transparenteLatin: false },
  { p: AC, r: 'o', s: 'Cartea este bună; ___ citesc acum.', pista: 'clítico de acusativo: sustituye a «cartea» — femenino singular', ancla: 'Cartea este bună', transparenteLatin: false },
  { p: AC, r: 'îi', s: 'Pe copii ___ aștept la poarta școlii.', pista: 'clítico de acusativo: sustituye a «pe copii» — masculino plural', ancla: 'Pe copii', transparenteLatin: false },
  { p: AC, r: 'le', s: 'Florile sunt frumoase; ___ pun în vază.', pista: 'clítico de acusativo: sustituye a «florile» — femenino plural', ancla: 'Florile sunt frumoase', transparenteLatin: false },
  { p: AC, r: 'mă', s: 'Pe mine Maria ___ ajută mereu la teme.', pista: 'clítico de acusativo: dobla a «pe mine» — 1.ª singular', ancla: 'Pe mine', transparenteLatin: false },
  { p: AC, r: 'te', s: 'Pe tine ___ caută cineva la ușă.', pista: 'clítico de acusativo: dobla a «pe tine» — 2.ª singular', ancla: 'Pe tine', transparenteLatin: true },
  { p: AC, r: 'ne', s: 'Pe noi profesorul ___ ascultă cu atenție.', pista: 'clítico de acusativo: dobla a «pe noi» — 1.ª plural', ancla: 'Pe noi', transparenteLatin: false },
  { p: AC, r: 'vă', s: 'Pe voi ___ aștept la ora șapte.', pista: 'clítico de acusativo: dobla a «pe voi» — 2.ª plural', ancla: 'Pe voi', transparenteLatin: false },

  // ── r6-cliticos-dativo · 8 · îmi/îți no se parecen a nada ─────────
  { p: DAT, r: 'îmi', s: 'Mie ___ place cafeaua dimineața.', pista: 'clítico de dativo: dobla a «mie» — 1.ª singular', ancla: 'Mie', transparenteLatin: false },
  { p: DAT, r: 'îți', s: 'Ție ce ___ place mai mult?', pista: 'clítico de dativo: dobla a «ție» — 2.ª singular', ancla: 'Ție', transparenteLatin: false },
  { p: DAT, r: 'îi', s: 'Mâine ___ spun Mariei tot adevărul.', pista: 'clítico de dativo: dobla a «Mariei» — 3.ª singular', ancla: 'Mariei', transparenteLatin: false },
  { p: DAT, r: 'le', s: 'De Crăciun ___ dau copiilor cadouri.', pista: 'clítico de dativo: dobla a «copiilor» — 3.ª plural', ancla: 'copiilor', transparenteLatin: false },
  { p: DAT, r: 'ne', s: 'Nouă profesorul ___ explică lecția de două ori.', pista: 'clítico de dativo: dobla a «nouă» — 1.ª plural', ancla: 'Nouă', transparenteLatin: false },
  { p: DAT, r: 'vă', s: 'Vouă ___ mulțumesc pentru tot ajutorul.', pista: 'clítico de dativo: dobla a «vouă» — 2.ª plural', ancla: 'Vouă', transparenteLatin: false },
  { p: DAT, r: 'îi', s: 'Lui Ion ___ trebuie o mașină nouă.', pista: 'clítico de dativo: dobla a «lui Ion» — 3.ª singular', ancla: 'Lui Ion', transparenteLatin: false },
  { p: DAT, r: 'îmi', s: 'Cheile de la casă? Mie ___ lipsesc de ieri.', pista: 'clítico de dativo: dobla a «mie» — 1.ª singular', ancla: 'Mie', transparenteLatin: false },

  // ── r3-negacion-nu · 8 · la GRAFÍA del clúster, con las DOS formas ──
  // El inventario lo declara: la contracción es la corriente y la plena
  // la de registro cuidado; las dos son correctas (DOOM3) y el ítem
  // acepta las dos. Por eso `alt` va en los seis de contracción.
  { p: NEG, r: 'n-am', alt: ['nu am'], s: 'Azi ___ (nu + am) timp pentru asta.', pista: 'negación + «am»: la forma contracta, la corriente en la lengua hablada', ancla: 'pentru asta', transparenteLatin: false },
  { p: NEG, r: 'nu-l', alt: ['nu îl'], s: 'De o lună ___ (nu + îl) văd pe vecinul meu.', pista: 'negación + clítico «îl»: la forma contracta', ancla: 'pe vecinul meu', transparenteLatin: false },
  { p: NEG, r: 'nu-mi', alt: ['nu îmi'], s: 'Filmul acesta ___ (nu + îmi) place deloc.', pista: 'negación + clítico «îmi»: la forma contracta', ancla: 'Filmul acesta', transparenteLatin: false },
  { p: NEG, r: 'n-au', alt: ['nu au'], s: 'Ei ___ (nu + au) venit încă de la gară.', pista: 'negación + «au»: la forma contracta', ancla: 'încă de la gară', transparenteLatin: false },
  { p: NEG, r: 'nu-i', alt: ['nu îi'], s: '___ (nu + îi) spun nimic despre asta.', pista: 'negación + clítico dativo «îi»: la forma contracta', ancla: 'nimic despre asta', transparenteLatin: false },
  { p: NEG, r: 'n-ai', alt: ['nu ai'], s: 'Tu ___ (nu + ai) fost niciodată în Moldova?', pista: 'negación + «ai»: la forma contracta', ancla: 'niciodată în Moldova', transparenteLatin: false },
  // Los DOS de doble negación, que el inventario manda meter aquí como
  // REGALO declarado y no como punto propio: transfieren del español.
  { p: NEG, r: 'nimic', s: 'N-am înțeles ___ din ce a spus.', pista: 'doble negación: con «nu» delante, el rumano pone la palabra negativa igual que el español', ancla: 'din ce a spus', transparenteLatin: true },
  { p: NEG, r: 'niciodată', alt: ['nicicând'], s: 'El nu vine ___ la timp.', pista: 'doble negación: con «nu» delante, la palabra negativa se mantiene', ancla: 'la timp', transparenteLatin: true },
];

export function verificar(items: ClozeRo[]): string[] {
  const v = verificarBase(items);
  for (const [i, x] of items.entries()) {
    const id = `CLRO7-${String(i + 1).padStart(3, '0')} (${x.p})`;
    const r = x.r ?? '';
    const antes = x.s.split('___')[0] ?? '';

    // Clase cerrada: la respuesta TIENE que estar en la tabla. Es el
    // equivalente honesto de «recalcular la forma» cuando no hay nada que
    // calcular — y caza la errata que Hunspell no ve, porque `îi`, `le` y
    // `vă` son todas palabras rumanas.
    if (x.p === AC && !TABLA_AC.includes(r)) v.push(`${id}: «${r}» no está en la tabla de acusativo (${TABLA_AC.join(', ')})`);
    if (x.p === DAT && !TABLA_DAT.includes(r)) v.push(`${id}: «${r}» no está en la tabla de dativo (${TABLA_DAT.join(', ')})`);

    // LA HOMONIMIA QUE EL INVENTARIO NOMBRA: `îi` es dativo singular Y
    // acusativo plural masculino. Sin un doblado explícito delante, el
    // mismo hueco vale para los dos puntos y el ítem no mide el suyo.
    // LA HOMONIMIA, comprobada sobre la frase ENTERA y no sólo sobre lo
    // que va delante: el orden natural del doblado dativo pone el nombre
    // DETRÁS del verbo («îi spun Mariei»), y exigirlo delante habría
    // obligado a escribir rumano marcado para contentar al gate. El
    // alumno ve la frase entera, así que lo que determina es que el
    // elemento esté, no dónde.
    const frase = x.s.replace('___', ' ').replace(/\([^)]*\)/g, ' ');
    // El marcador que hace falta depende del CASO, y por eso se bifurca:
    // uno de acusativo no determina un dativo por mucho que esté ahí.
    const MARCA_AC = /(?<![\p{L}])(pe \p{L}+|cartea|florile|cheile)(?![\p{L}])/iu;
    const MARCA_DAT = /(?<![\p{L}])(lui \p{L}+|mie|ție|nouă|vouă|\p{L}+ei|\p{L}+ilor|\p{L}+elor)(?![\p{L}])/iu;
    const marca = x.p === AC ? MARCA_AC : MARCA_DAT;
    if (x.p === AC || x.p === DAT) {
      if (!marca.test(frase))
        v.push(`${id}: la frase no trae un elemento de ${x.p === AC ? 'ACUSATIVO' : 'DATIVO'} que el clítico doble o sustituya — el caso no está determinado`);
      // Las CUATRO formas sincréticas, no sólo «îi»: `le` es acusativo
      // femenino plural Y dativo plural; `ne` y `vă` son la misma forma
      // en los dos casos. Sin el marcador del caso propio, el mismo
      // hueco contaría a los dos puntos.
      if (['îi', 'le', 'ne', 'vă'].includes(r) && !marca.test(frase))
        v.push(`${id}: «${r}» es sincrética entre acusativo y dativo y la frase no dice cuál`);
    }

    // NEG: la regla de `alt` no la descubre el revisor — está escrita en
    // el inventario. Toda contracción nace con su forma plena.
    if (x.p === NEG && r.includes('-')) {
      const plena = PLENA[r];
      if (!plena) v.push(`${id}: la contracción «${r}» no está en la tabla de DOOM3 de este gate`);
      else if (!(x.alt ?? []).length) v.push(`${id}: contracción «${r}» sin la forma plena en \`alt\` — DOOM3 admite las dos y la tarjeta compara exacto`);
      else if (!(x.alt ?? []).some((a) => a.replace(/\s+/g, ' ') === plena)) v.push(`${id}: la alternativa declarada no es la forma plena esperada («${plena}»)`);
      // Y la frase tiene que nombrar las dos piezas del clúster, o el
      // alumno no sabe qué contraer.
      if (!/\(nu \+ \p{L}+\)/u.test(x.s)) v.push(`${id}: la frase no declara las dos piezas del clúster entre paréntesis`);
    }
  }
  // El punto de la negación mezcla DOS cosas por decisión del inventario:
  // la grafía del clúster (lo que se examina) y la doble negación (que es
  // un regalo declarado, porque transfiere del español). Si el regalo
  // pasa de tres, el punto deja de examinar lo suyo.
  const regalos = items.filter((x) => x.p === NEG && x.transparenteLatin);
  if (regalos.length > 3) v.push(`${NEG}: ${regalos.length} ítems de doble negación — el inventario los admite como REGALO declarado (dos o tres), no como la mitad del punto`);
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
if (new RegExp(`[/\\\\]cloze-ro-a1c\\.ts$`).test(process.argv[1] ?? '')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--asigna')) {
    const r = informeAsigna(ITEMS.map((x) => ({ p: x.p, sentence: x.s.replace('___', String(x.r ?? '')), hintEs: x.pista, answer: String(x.r ?? '') })));
    console.log('# A qué punto cuenta cada ítem del lote 11\n');
    console.log(r.lineas.join('\n'));
    process.exit(r.desvio ? 1 : 0);
  }
  console.log(`# Cloze RO-A1c — clíticos y negación · ${ITEMS.length} ítems · transparenteLatin ${ITEMS.filter((x) => x.transparenteLatin).length}/${ITEMS.length}\n`);
  for (const [i, x] of ITEMS.entries()) console.log(`${String(i + 1).padStart(2, '0')}. ${x.s}  → **${x.r}**${x.alt?.length ? ` (alt: ${x.alt.join(', ')})` : ''}  · ${x.pista}`);
  console.log('\n## Gates\n');
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

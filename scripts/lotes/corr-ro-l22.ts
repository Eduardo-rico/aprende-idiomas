// scripts/lotes/corr-ro-l22.ts — LOTE 22: `r7-supin`, y son CINCO.
//
//   npx tsx scripts/lotes/corr-ro-l22.ts            # preflight + gates
//   npx tsx scripts/lotes/corr-ro-l22.ts --asigna
//
// ══ LA MALA DECLARADA DEL PUNTO TENÍA LA FORMA EQUIVOCADA ════════════
// El `motivo` del inventario decía que el calco de «máquina de lavar» es
// `*mașină de spăla` — `de` + infinitivo CORTO. Es agramatical, sí, **y
// no la produce nadie**: para escribirla hay que quitar la partícula `a`,
// que el español no licencia. Y encima es un string HOMÓGRAFO: los `de` +
// forma corta que hay en el corpus (`de se culca`, `de mânca`) son `de`
// CONJUNCIONAL + imperfecto o perfecto simple, no infinitivos.
//
// Lo que un hispanohablante produce de verdad es **`*mașină de a spăla`**,
// y ésa es la mala del punto. La distinción importa porque `de a` +
// infinitivo **es rumano correcto** en general —2.591 apariciones en el
// corpus— y sólo falla con nombre CONCRETO sin estructura argumental: con
// `dorința/plăcerea/ideea/teama de a …` es lo normal, y con
// `mașină/apă/fier/ac de a …` da **cero de 2.591**. La mala no es «`de a`
// está mal», es «`de a` está mal AQUÍ».
//
// ══ Y EL MARCO QUE DA NOMBRE AL PUNTO ES INVÁLIDO ════════════════════
// `e greu de crezut` compite con `e greu să crezi` (correcto) y con
// `e greu de a crede`, que está **ATESTADO** en el corpus: «e ușor de a
// risca», «nu e greu de a trece pragul vieții», «era lesne de a sfărâma».
// Una mala arcaica no es una mala (§0.3). Igual `am ceva de spus`, que
// compite con `aveți de a mînca și de a bea`, también atestado. Los dos
// marcos quedan FUERA, y el nombre del punto se cambia para que el
// siguiente no escriba primero justo el ítem que no se sostiene.
//
// ══ LO QUE EL FORMATO NO PUEDE VER, Y VA ESCRITO EN EL PUNTO ═════════
// El error DOMINANTE del hispanohablante aquí es la EVASIÓN: dice `am
// multe să fac` o `apă pentru a bea` en vez de arriesgarse con el supino.
// Las dos son rumano CORRECTO, así que no hay nada que corregir: es
// subproducción (§0.4/3) y la corrección es ciega a ella. El punto no
// muere por eso —quedan dos ejes con mala real— pero **un 5/5 aquí no es
// dominio del supino**, y eso no se puede leer del número.
import { verificar as verificarBase, preflight, type ItemCorreccion } from '../lib/correccion';
import { revisarOrtografiaRo } from '../../lib/lang/ortografia-ro';
import { hunspellDisponible, desconocidas } from '../lib/hunspell-ro';
import { exenta } from '../lib/exenciones-hunspell-ro';
import { medirAtajo } from '../lib/atajo-correccion';
import { informeAsigna } from '../lib/asigna-ro';
import { camposSinDeclarar } from '../lib/gates-por-formato';

const SUP = 'r7-supin';

export const ITEMS: ItemCorreccion[] = [
  // ══ EJE 1 · `de a` + infinitivo donde el rumano exige supino ══════
  // Nombre CONCRETO de instrumento o materia, sin estructura argumental.
  // `mașină de spălat` está además lexicalizado (DEX s.v. mașină), lo que
  // hace la fuente fuerte y la MEDICIÓN débil: un ítem sobre una locución
  // de diccionario puede estar midiendo léxico y no el supino. Por eso
  // el eje lleva DOS ítems y el segundo NO está lexicalizado.
  { p: SUP, pasada: 1, espejoEs: false, atajoEs: false, transparenteLatin: false, origenError: 'calco',
    mala: 'Am cumpărat o mașină de a spăla.', buena: 'Am cumpărat o mașină de spălat.',
    calcoEs: 'He comprado una máquina de lavar.',
    explicacion: 'Tras un nombre concreto que dice PARA QUÉ sirve algo, el rumano usa el supino: «de» + participio invariable, «de spălat». El infinitivo con «a» («de a spăla») calca el «de lavar» español y ahí no entra — sí entra tras nombres abstractos: «dorința de a pleca», «teama de a greși».' },
  // El mismo eje SIN locución de diccionario: aquí el supino es
  // productivo y el ítem mide la regla, no la memoria de un compuesto.
  { p: SUP, pasada: 1, espejoEs: false, atajoEs: false, transparenteLatin: false, origenError: 'calco',
    mala: 'Aici nu găsești apă de a bea.', buena: 'Aici nu găsești apă de băut.',
    calcoEs: 'Aquí no encuentras agua de beber.',
    explicacion: 'Igual que «mașină de spălat», pero sin ser una palabra de diccionario: el supino es productivo. «apă de băut», «lemne de foc», «haine de purtat». El participio de «a bea» es «băut», y no cambia nunca de forma.' },

  // ══ EJE 2 · LA FRONTERA: el supino es INVARIABLE ══════════════════
  // El alumno viene cebado por dos sitios a la vez: el español («las
  // camisas lavadas») y el prerrequisito `r5-participios`, que le acaba
  // de enseñar que el participio CONCUERDA. `cămăși spălate` es correcto;
  // `de spălate` no, porque el supino no tiene flexión (GALR, GBLR,
  // *supinul*; UD Romanian-RRT lo etiqueta VerbForm=Sup sin rasgos de
  // género ni número, frente a VerbForm=Part con Gender/Number).
  //
  // LEMA ELEGIDO CON CUIDADO: los participios plurales de `a spune`,
  // `a aduce`, `a zice`, `a duce`, `a lua` y `a da` son HOMÓGRAFOS del
  // perfecto simple, así que `de spuse` es rumano correcto («se duse de
  // spuse») y la mala sería lengua real. Hay 17 casos en el corpus. Va
  // en gate.
  { p: SUP, pasada: 1, espejoEs: false, atajoEs: true, transparenteLatin: false, origenError: 'sobreaplicacion',
    mala: 'Am două cămăși de spălate.', buena: 'Am două cămăși de spălat.',
    calcoEs: 'Tengo dos camisas para lavar.',
    explicacion: 'El supino NO concuerda: es siempre «de spălat», con una camisa o con veinte. Lo que sí concuerda es el participio adjetivo, que va sin «de»: «două cămăși spălate» son dos camisas YA lavadas. Con «de» se habla de lo que falta por hacer, y ahí la forma queda fija.' },
  { p: SUP, pasada: 1, espejoEs: false, atajoEs: true, transparenteLatin: false, origenError: 'sobreaplicacion',
    mala: 'Sunt multe lucruri de făcute în casă.', buena: 'Sunt multe lucruri de făcut în casă.',
    calcoEs: 'Hay muchas cosas que hacer en casa.',
    explicacion: 'Otra vez la forma fija: «de făcut», nunca «de făcute», aunque «lucruri» sea plural. La prueba está en que el rumano dice «ce e de făcut?» sin ningún nombre delante con el que concordar.' },

  // ══ LA SEGUNDA CARA DE LA FRONTERA: dónde el supino NO entra ══════
  // `a vrea` selecciona conjuntivo y no licencia supino (`vreau de` +
  // supino = 0 en el corpus). Es la sobreaplicación en la otra dirección:
  // el alumno acaba de aprender «de + supino» y lo mete donde va `să`.
  //
  // Y NO se usa `a trebui`, que sería el ítem obvio: `trebuie de făcut`
  // es un REGIONALISMO MOLDAVO VIVO y está atestado en el corpus
  // («Trebuie de înființat numaidecât un monopol»). Una mala regional no
  // es una mala (§0.3). Va en gate.
  { p: SUP, pasada: 1, espejoEs: false, atajoEs: false, transparenteLatin: false, origenError: 'sobreaplicacion',
    mala: 'Vreau de plecat acum.', buena: 'Vreau să plec acum.',
    calcoEs: 'Quiero irme ahora.',
    explicacion: 'El supino sirve para decir lo que hay POR hacer, no para completar un verbo de voluntad. Tras «vreau» va «să» + verbo conjugado: «vreau să plec». (Y tras «trebuie» el rumano de Moldavia sí dice «trebuie de făcut», así que ahí no hay error, hay región.)' },
];

/** LOS MARCOS PROHIBIDOS, cada uno con la razón por la que su mala NO es
 *  una mala. Todos salen del dictamen del 2026-09-03 y todos están
 *  medidos en el corpus del proyecto: no son cautelas, son hallazgos. */
export const MARCOS_PROHIBIDOS: { re: RegExp; motivo: string; solo?: 'calco' | 'sobreaplicacion' }[] = [
  // Los dos primeros valen SÓLO para los ítems cuya mala es el calco
  // «de a» + infinitivo, y el alcance no es una concesión: lo que
  // invalida esos marcos es que ahí «de a» COMPITE atestado, y esa
  // competencia no toca a un ítem cuya mala es la concordancia.
  { solo: 'calco', re: /\b(e|este|era|nu e|nu-i)\s+(greu|u[șs]or|lesne|cu neputin[țt][ăa])\s+de\b/iu,
    motivo: 'el marco predicativo impersonal («e greu de crezut») admite «de a» + infinitivo, ATESTADO en el corpus («e ușor de a risca», «nu e greu de a trece pragul vieții», «era lesne de a sfărâma»): la mala sería arcaica, no agramatical' },
  { solo: 'calco', re: /\b(am|ai|are|avem|ave[țt]i|au|avea|aveam)\s+(ceva|multe|nimic)\b/iu,
    motivo: 'el marco de «a avea» + supino admite «de a» + infinitivo, ATESTADO («aveți de a mînca și de a bea», «are de a vorbi»)' },
  // EL IDIOMA, y su alcance está MEDIDO, no supuesto. La v0 prohibía «a
  // face» en cualquier marco de supino y cazó un ítem bueno. El corpus
  // dice que la colisión exige «a avea»: de las 29 apariciones de
  // «de-a face», 23 van bajo una forma de «a avea», y «a face» en marco
  // de supino SIN «a avea» es lengua normal y corriente — «ce e de
  // făcut» 32, «nimic de făcut» 4. Se bajó el CRITERIO con la medición
  // delante, no el dato para que cuadrara.
  { re: /\b(am|ai|are|avem|ave[țt]i|au|avea|aveam|n-am|n-are|n-ai)\s+de-?\s?a\s+face\b/iu,
    motivo: 'colisiona con el idioma vivo «a avea de-a face cu», 23 casos en el corpus' },
  { re: /\btrebuie\b/iu,
    motivo: '«trebuie de făcut» es un REGIONALISMO MOLDAVO VIVO y está atestado en el corpus («Trebuie de înființat numaidecât un monopol»): sería marcar como error una variedad, no una agramaticalidad (§0.3)' },
  { re: /\b(permis de conducere|sal[ăa] de a[șs]teptare|cas[ăa] de v[âa]nzare)\b/iu,
    motivo: 'compuestos con INFINITIVO LARGO lexicalizado: conviven con el supino y su alternativa no es agramatical sino no oficial' },
];

/** Los lemas cuyo participio PLURAL es homógrafo del perfecto simple. En
 *  ellos la «mala» de la concordancia es rumano correcto: «se duse DE
 *  SPUSE stăpânului». 17 casos en el corpus. Allowlist invertida a
 *  propósito —enumera lo PROHIBIDO— porque aquí lo que decide el rechazo
 *  es una propiedad del lema, no del ítem, y la lista es cerrada. */
export const HOMOGRAFOS_PERFECTO_SIMPLE = ['spuse', 'aduse', 'zise', 'duse', 'luase', 'luaseră', 'dete', 'dede'];

export function verificar(items: ItemCorreccion[]): string[] {
  const v = verificarBase(items);
  const palabras: string[] = [];
  let calcos = 0, fronteras = 0;

  for (const [i, x] of items.entries()) {
    const id = `CORO22-${String(i + 1).padStart(3, '0')} (${x.p})`;
    for (const c of camposSinDeclarar('correccion', x as unknown as Record<string, unknown>))
      v.push(`${id}: no declara «${c}», que el formato exige`);
    for (const [campo, t] of [['mala', x.mala], ['buena', x.buena], ...(x.alt ?? []).map((a) => ['alt', a] as const)] as const)
      for (const h of revisarOrtografiaRo(t)) v.push(`${id}: ortografía en ${campo}: «${h.palabra}» (${h.clase})`);
    for (const t of [x.buena, ...(x.alt ?? [])])
      palabras.push(...t.replace(/[^\p{L}\- ]/gu, ' ').split(/\s+/).filter(Boolean).map((w) => w.replace(/^-|-$/g, '')));

    // ── GATE 1 · LOS MARCOS DONDE LA MALA NO ES UNA MALA ────────────
    // Se mira la MALA y la BUENA: un marco prohibido contamina el ítem
    // esté donde esté, porque lo que lo invalida es que la construcción
    // admita la variante atestada.
    for (const { re, motivo, solo } of MARCOS_PROHIBIDOS) {
      if (solo && (x.origenError ?? 'calco') !== solo) continue;
      if (re.test(x.mala) || re.test(x.buena)) v.push(`${id}: marco prohibido — ${motivo}`);
    }

    // ── GATE 2 · `de` + INFINITIVO CORTO NO SE USA COMO MALA ────────
    // Es agramatical y aun así inútil: nadie la produce (hay que borrar
    // la partícula «a», que el español no licencia) y el string es
    // homógrafo de «de» conjuncional + perfecto simple. Es la misma
    // huella que `*vreau el să vină` (§0.1), con otra causa.
    if (/\bde\s+(sp[ăa]la|citi|scrie|vedea|bea|mânca|m[âa]nca|pleca|face|spune)(?![\p{L}\p{N}])/iu.test(x.mala))
      v.push(`${id}: la mala es «de» + infinitivo CORTO — agramatical pero improducible por un hispanohablante (hay que borrar la partícula «a»), y homógrafa de «de» conjuncional + perfecto simple`);

    // ── GATE 3 · EL ÍTEM DE CONCORDANCIA NO USA LEMAS HOMÓGRAFOS ────
    if (x.origenError === 'sobreaplicacion')
      for (const w of HOMOGRAFOS_PERFECTO_SIMPLE)
        if (new RegExp(`\\bde\\s+${w}(?![\\p{L}\\p{N}])`, 'iu').test(x.mala))
          v.push(`${id}: la mala usa «de ${w}», que es rumano CORRECTO — «${w}» es homógrafo del perfecto simple («se duse de spuse»), 17 casos en el corpus`);

    // ── GATE 4 · EL SUPINO DE LA BUENA ES INVARIABLE ────────────────
    // La propiedad estructural que implica la intención, no una norma
    // escrita en un comentario (§4.23): si la buena lleva `de` +
    // participio, ese participio no puede acabar en desinencia de
    // género/número.
    const supBuena = x.buena.match(/\bde\s+([\p{L}]+)(?![\p{L}\p{N}])/iu)?.[1];
    if (supBuena && /(?:[ăa]|e|i)$/u.test(supBuena) && /(?:at|ut|it|[âa]t|s|t)e$/u.test(supBuena))
      v.push(`${id}: la BUENA lleva «de ${supBuena}», con desinencia de plural — el supino es invariable y la buena estaría enseñando la mala`);

    if (x.origenError === 'sobreaplicacion') fronteras++; else calcos++;
  }

  // ── GATE 5 · EL PUNTO NECESITA SUS DOS CARAS (§0.6) ───────────────
  // Con sólo calcos, el alumno aprende «pon siempre de + supino» y lo
  // mete donde va `să`. Con sólo fronteras, no se examina el error que
  // da nombre al punto.
  if (items.length >= 4) {
    if (!calcos) v.push(`${SUP}: ningún ítem examina el calco «de a» + infinitivo, que es el error que da nombre al punto`);
    if (!fronteras) v.push(`${SUP}: ningún ítem de SOBREAPLICACIÓN — el alumno aprende «pon siempre de + supino», saca ${items.length}/${items.length} y luego escribe *Vreau de plecat (§0.6)`);
  }
  // ── GATE 6 · LAS DOS DIRECCIONES DE LA SOBREAPLICACIÓN ────────────
  // La frontera tiene dos caras que NO son la misma: la concordancia
  // sobreaplicada (el supino no flexiona) y el marco equivocado (el
  // supino no entra tras un verbo de voluntad). Un lote con sólo la
  // primera enseña media frontera.
  const conc = items.some((x) => x.origenError === 'sobreaplicacion' && /\bde\s+[\p{L}]+e(?![\p{L}\p{N}])/iu.test(x.mala));
  const marco = items.some((x) => x.origenError === 'sobreaplicacion' && /\b(vreau|vrei|vrea|vrem|vre[țt]i|vor)\s+de\b/iu.test(x.mala));
  if (fronteras && !conc) v.push(`${SUP}: falta la cara de la CONCORDANCIA sobreaplicada (*de spălate)`);
  if (fronteras && !marco) v.push(`${SUP}: falta la cara del MARCO equivocado (*Vreau de plecat) — la frontera tiene dos direcciones y con una sola se enseña media`);

  const m = medirAtajo(items, 'ATAJO');
  for (const d of m.discrepan) v.push(d);
  if (!hunspellDisponible()) v.push('hunspell no disponible: el segundo camino NO corrió');
  else {
    const PROPIOS = new Set(['cluj', 'ion', 'maria', 'bucurești']);
    const revisables = palabras.map((w) => w.toLowerCase()).filter((w) => w && !PROPIOS.has(w));
    for (const w of desconocidas(revisables)) if (!exenta(w)) v.push(`hunspell no reconoce «${w}» en una frase buena`);
  }
  return v;
}

if (new RegExp(`[/\\\\]corr-ro-l22\\.ts$`).test(process.argv[1] ?? '')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--asigna')) {
    const r = informeAsigna(ITEMS.map((x) => ({ p: x.p, sentence: x.buena, hintEs: x.explicacion, answer: x.buena })));
    console.log('# A qué punto cuenta cada ítem del lote 22\n');
    console.log(r.lineas.join('\n'));
    process.exit(r.desvio ? 1 : 0);
  }
  console.log(`# Corrección RO-L22 — r7-supin · ${ITEMS.length} ítems\n`);
  for (const [i, x] of ITEMS.entries())
    console.log(`${String(i + 1).padStart(2, '0')}. [${x.origenError}] ~~${x.mala}~~ → **${x.buena}**\n      calco: «${x.calcoEs}»`);
  console.log(''); for (const l of preflight(ITEMS)) console.log(l);
  console.log(''); for (const l of medirAtajo(ITEMS, 'ATAJO').lineas) console.log(l);
  console.log('\n## Gates\n');
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

// scripts/lotes/corr-ro-l20.ts — LOTE 20: LOS ÍTEMS DE FRONTERA.
//
//   npx tsx scripts/lotes/corr-ro-l20.ts            # preflight + gates
//   npx tsx scripts/lotes/corr-ro-l20.ts --asigna   # a qué punto cuenta
//
// ══ POR QUÉ ESTE LOTE VA ANTES DE ABRIR UN BLOQUE NUEVO ══════════════
// No produce cobertura nueva: **arregla cobertura falsa**, que vale más.
// Un punto cubierto en falso no es sólo trabajo por hacer — es una
// mentira dentro del indicador con el que se decide cuándo parar, y
// mientras esté ahí cada foto del déficit dice algo que no es cierto.
//
// La pasada de varianza (`scripts/lib/varianza.ts`) marcó siete puntos
// cubiertos con el rasgo diana invariante. Leídos uno a uno, tres eran
// legítimos y **tres son defectos reales, todos de la misma clase**:
//
//   §0.6 · **la regla tiene un caso negativo y ningún ítem lo muestra.**
//   El alumno aprende la sobregeneralización —«pon siempre `de`», «pon
//   siempre `ca`», «quita siempre `pe`»—, **saca 8/8**, y el corpus
//   certifica que sabe algo que no sabe.
//
// El arreglo es un ítem cuyo error sea la SOBREAPLICACIÓN. Que los tres
// puntos que salieron legítimos ya lo tuvieran —`r4-gd-lui-formula`
// corrige `*Biroul lui domnul Popescu`, `r4-preposicion-caida-articulo`
// corrige `*Merg cu tren`— es la prueba de que la regla describe el
// material bueno en vez de racionalizarlo.
//
// ══ LO QUE ESTE LOTE ROMPE DEL FORMATO, Y HAY QUE DECIRLO ════════════
// El ítem de frontera **se resuelve traduciendo del español**, y eso en
// corrección era la definición de ítem malo. Aquí no lo es: su error no
// viene del español sino de sobregeneralizar una regla RUMANA recién
// aprendida, así que «Compré cinco manzanas» → `Am cumpărat cinci mere`
// sale bien calcando — y **ésa es exactamente su función**. Se declara
// con `origenError: 'sobreaplicacion'` y `medirAtajo` los cuenta aparte
// en vez de silenciar el gate.
import { verificar as verificarBase, preflight, type ItemCorreccion } from '../lib/correccion';
import { revisarOrtografiaRo } from '../../lib/lang/ortografia-ro';
import { hunspellDisponible, desconocidas } from '../lib/hunspell-ro';
import { exenta } from '../lib/exenciones-hunspell-ro';
import { medirAtajo } from '../lib/atajo-correccion';
import { revisarCopula } from '../lib/copula-ro';
import { informeAsigna } from '../lib/asigna-ro';
import { camposSinDeclarar } from '../lib/gates-por-formato';
import { VERBOS_A1 } from '../../lib/data/languages/ro/lexicon-a1';
import { presente } from '../lib/paradigma-ro';

const NUM = 'r2-numerales-de';
const COMPL = 'r8-completivas-ca-sa';
const REL = 'r8-relativas-pe-care';
const PE = 'r6-pe-regla-operativa';

type ItemL20 = ItemCorreccion & { inf?: string };

/** Nombres contables admitidos tras el numeral. ALLOWLIST porque decide
 *  rechazos: lo que no esté, se suspende. */
const NOMBRES_CONTABLES = new Set(['mere', 'elevi', 'copii', 'zile', 'cărți', 'ani', 'lei', 'studenți', 'scaune']);
/** Antecedentes sin lectura locativa posible con `pe care`. */
const ANTECEDENTES_SIN_LECTURA_LOCATIVA = new Set(['omul', 'fata', 'cartea', 'filmul', 'colegii', 'prietenii', 'lecțiile', 'florile', 'studenții']);
/** Objetos con los que el doblado clítico es IMPOSIBLE, no facultativo
 *  (Croitor 2010, ej. 3). `cineva` NO entra: las fuentes discrepan. */
const SIN_DOBLADO_POSIBLE = new Set(['nimeni', 'cine']);

export const ITEMS: ItemL20[] = [
  // ══ r2-numerales-de · la frontera del 19/20 ═══════════════════════
  // Los ocho publicados llevan 20, 25, 30, 40, 50, 80, 100 y 200: TODOS
  // ≥20, o sea que «pon de detrás del numeral» saca 8/8. La frontera es
  // normativa y está en 19/20: hasta 19 el numeral determina al nombre
  // directamente; a partir de 20 la relación se invierte y el nombre se
  // subordina con `de` (limbaromana.net, *Numeralul cardinal*; dictie.ro).
  { p: NUM, pasada: 1, espejoEs: false, atajoEs: true, transparenteLatin: false, origenError: 'sobreaplicacion',
    mala: 'Am mâncat cinci de mere azi-dimineață.', buena: 'Am mâncat cinci mere azi-dimineață.',
    calcoEs: 'Me comí cinco manzanas esta mañana.',
    explicacion: 'La regla del «de» tiene frontera: sólo entra a partir de VEINTE. Del 1 al 19 el nombre va pegado al numeral y sin nada en medio — «cinci mere», «trei copii», «nouă zile».' },
  { p: NUM, pasada: 1, espejoEs: false, atajoEs: true, transparenteLatin: false, origenError: 'sobreaplicacion',
    mala: 'În clasă sunt nouăsprezece de elevi.', buena: 'În clasă sunt nouăsprezece elevi.',
    calcoEs: 'En la clase hay diecinueve alumnos.',
    explicacion: 'Diecinueve es el último número sin «de» y veinte el primero con «de»: «nouăsprezece elevi» pero «douăzeci DE elevi». La frontera está exactamente ahí, y no en si el número suena grande o pequeño.' },

  // ══ r8-completivas-ca-sa · las DOS caras de la frontera ═══════════
  // Y las dos son operaciones DISTINTAS a propósito: si las dos fueran
  // «borra ca», el arreglo repetiría el defecto que viene a arreglar.
  //
  // ⚠ LA REGLA DEL PUNTO ERA FALSA y se corrigió al escribir este lote:
  // `ca` NO se licencia por «haber sujeto expreso» sino por haber un
  // CONSTITUYENTE ADELANTADO a posición preverbal, sea cual sea
  // (Dobrovie-Sorin 1994: 93-95, en Sava 2012, p. 221). Por eso la mala
  // de abajo NO puede llevar ningún adverbial adelantable: con `mâine`
  // dentro, `Vreau CA MÂINE să vin` es GRAMATICAL y el ítem tendría dos
  // arreglos, uno de los cuales el corpus no contempla.
  { p: COMPL, pasada: 1, espejoEs: false, atajoEs: true, transparenteLatin: false, origenError: 'sobreaplicacion',
    mala: 'Vreau ca să plec.', buena: 'Vreau să plec.',
    calcoEs: 'Quiero irme.',
    explicacion: '«Ca» sólo aparece cuando hay algo que colocar delante de «să» — un sujeto, un complemento, un adverbio. Si no hay nada adelantado, «să» va pegado al verbo principal y «ca» sobra. La norma lo condena expresamente fuera de «pentru ca să».' },
  { p: COMPL, pasada: 1, espejoEs: false, atajoEs: false, transparenteLatin: false, origenError: 'sobreaplicacion',
    mala: 'Vreau ca să Ion termine cartea.', buena: 'Vreau ca Ion să termine cartea.',
    calcoEs: 'Quiero que Ion termine el libro.',
    explicacion: 'Aquí «ca» sí hace falta, porque «Ion» va delante del verbo — lo que está mal es el ORDEN. El adelantado se coloca ENTRE «ca» y «să», nunca detrás de «să»: entre «să» y el verbo sólo caben los clíticos, «nu» y «mai, și, tot, prea, cam».' },

  // ══ r8-relativas-pe-care · la frontera del «pe» ═══════════════════
  // ⚠ RESTRICCIÓN DE PLANTILLA, y hay gate: el antecedente NO puede
  // denotar superficie, vía ni vehículo. `drumul pe care vine`, `calul pe
  // care vine`, `autobuzul pe care vine` son CORRECTAS en lectura
  // locativa («el camino por el que viene»), y la mala dejaría de serlo.
  { p: REL, inf: 'a veni', pasada: 1, espejoEs: false, atajoEs: true, transparenteLatin: false, origenError: 'sobreaplicacion',
    mala: 'Omul pe care vine acum este vecinul meu.', buena: 'Omul care vine acum este vecinul meu.',
    alt: ['Omul care vine acum e vecinul meu.'],
    calcoEs: 'El hombre que viene ahora es mi vecino.',
    explicacion: 'Aquí «care» es el SUJETO de «vine»: es el hombre quien viene. El relativo sujeto va desnudo, sin «pe» y sin clítico. Las dos piezas entran juntas y sólo cuando el relativo es el objeto, que se reconoce porque el verbo tiene otro sujeto.' },

  // ══ r6-pe-regla-operativa · la otra mitad de la regla ═════════════
  // El punto quedó con 4 ítems y los 4 del mismo lado: «quita pe» con
  // indefinido no específico. El alumno que sobregeneraliza OMITE `pe`
  // donde es obligatorio, y `nimeni` y `cine` son justo donde lo haría,
  // porque `nimeni` PARECE un indefinido no específico.
  //
  // Y son los únicos contextos que AÍSLAN `pe`: con ellos el doblado
  // clítico es IMPOSIBLE, no facultativo — «Nu (*l-)am văzut pe nimeni»,
  // «(*Îl) văd pe cineva»: «los pronombres indefinidos no pueden doblarse
  // nunca» (Blanca Croitor, *Este dublarea complementului direct un
  // fenomen de acord?*, Univ. din București 2010, ej. (3); y el handout de
  // Iași §2.1-2.2). En todos los demás contextos donde el rumano exige
  // `pe` y el español no marca (`Îl vreau PE acesta`), el doblado es
  // obligatorio y el ítem mediría también `r6-doblado-cliticos`.
  // `cineva` se deja FUERA: las dos fuentes discrepan sobre su doblado.
  { p: PE, inf: 'a vedea', pasada: 1, espejoEs: false, atajoEs: true, transparenteLatin: false, origenError: 'sobreaplicacion',
    mala: 'Nu văd nimeni la ușă.', buena: 'Nu văd pe nimeni la ușă.',
    calcoEs: 'No veo a nadie en la puerta.',
    explicacion: '«Nimeni» parece un indefinido de los que van sin «pe», y no lo es: los pronombres lo llevan siempre. La regla no es «indefinido → sin pe», es «nombre común indeterminado y no específico → sin pe».' },
  { p: PE, inf: 'a vedea', pasada: 1, espejoEs: false, atajoEs: true, transparenteLatin: false, origenError: 'sobreaplicacion',
    mala: 'N-am văzut nimeni la petrecere.', buena: 'N-am văzut pe nimeni la petrecere.',
    calcoEs: 'No vi a nadie en la fiesta.',
    explicacion: 'Con «nimeni» el «pe» es obligatorio también en pasado. Y aquí no se dobla con clítico: los pronombres indefinidos no admiten el doblado, así que la única pieza que falta es «pe».' },
  { p: PE, inf: 'a vedea', pasada: 1, espejoEs: false, atajoEs: true, transparenteLatin: false, origenError: 'sobreaplicacion',
    mala: 'Cine ai văzut la gară?', buena: 'Pe cine ai văzut la gară?',
    calcoEs: '¿A quién viste en la estación?',
    explicacion: 'El interrogativo objeto se marca: «pe cine». Sin «pe», «cine» sólo podría ser el sujeto, y entonces el verbo no sería «ai văzut» sino «a văzut». La forma del verbo delata cuál de los dos es.' },
  { p: PE, inf: 'a aștepta', pasada: 1, espejoEs: false, atajoEs: true, transparenteLatin: false, origenError: 'sobreaplicacion',
    mala: 'Cine aștepți în fața școlii?', buena: 'Pe cine aștepți în fața școlii?',
    calcoEs: '¿A quién esperas delante de la escuela?',
    explicacion: 'Lo mismo en presente: «pe cine aștepți». «Aștepți» es «esperas», así que el sujeto eres tú y «cine» sólo puede ser el objeto — por eso va marcado.' },

];

/** Las palabras que entran o salen entre la mala y la buena, por
 *  multiconjunto. Un movimiento (`ca să Ion` → `ca Ion să`) da vacío, que
 *  es lo correcto: no cambia ninguna pieza, cambia el orden. */
export function diff(mala: string, buena: string): string[] {
  const t = (x: string) => x.toLowerCase().replace(/[^\p{L}\s-]/gu, ' ').split(/\s+/).filter(Boolean);
  const bolsa = new Map<string, number>();
  for (const w of t(mala)) bolsa.set(w, (bolsa.get(w) ?? 0) + 1);
  const entran: string[] = [];
  for (const w of t(buena)) { const c = bolsa.get(w) ?? 0; if (c > 0) bolsa.set(w, c - 1); else entran.push(w); }
  return [...entran, ...[...bolsa].flatMap(([w, n]) => Array<string>(n).fill(w))];
}

/** LA FRONTERA DEL RELATIVO, PREGUNTADA AL PARADIGMA.
 *
 *  El ítem de sobreaplicación de `r8-relativas-pe-care` sólo es válido si
 *  `care` es de verdad el SUJETO, y eso se comprueba exactamente al revés
 *  que en el lote 19: allí la forma tras `care` NO podía ser la 3.ª que
 *  concuerda con el antecedente; aquí TIENE que serlo. Misma pregunta al
 *  paradigma, respuesta opuesta — y por eso se le pregunta a la máquina en
 *  vez de mirarlo a ojo. */
export function concuerdaComoSujeto(inf: string, forma: string): boolean {
  const v = VERBOS_A1.find((x) => x.inf === inf);
  if (!v) return false;
  return [presente(v, 'el'), presente(v, 'ei')].filter(Boolean).includes(forma.toLowerCase());
}

export function verificar(items: ItemL20[]): string[] {
  const v = verificarBase(items);
  const palabras: string[] = [];
  for (const [i, x] of items.entries()) {
    const id = `CORO20-${String(i + 1).padStart(3, '0')} (${x.p})`;
    for (const [campo, t] of [['mala', x.mala], ['buena', x.buena], ...(x.alt ?? []).map((a) => ['alt', a] as const)] as const)
      for (const h of revisarOrtografiaRo(t)) v.push(`${id}: ortografía en ${campo}: «${h.palabra}» (${h.clase})`);
    for (const t of [x.buena, ...(x.alt ?? [])]) palabras.push(...t.replace(/[^\p{L}\- ]/gu, ' ').split(/\s+/).filter(Boolean).map((w) => w.replace(/^-|-$/g, '')));

    // ── EL INVARIANTE DEL LOTE: la corrección sólo puede BORRAR ───────
    // Todo ítem de frontera corrige una SOBREAPLICACIÓN, o sea que la
    // buena es la mala menos la pieza que sobra. Si la buena introduce
    // una palabra, el ítem no está examinando la frontera: está pidiendo
    // producir algo. Es el mismo invariante que cerró `r7-anti-progresivo`,
    // y aquí además es la DEFINICIÓN de la clase.
    if (x.origenError !== 'sobreaplicacion')
      v.push(`${id}: este lote es de ítems de FRONTERA — todos declaran origenError: 'sobreaplicacion'`);
    // EL INVARIANTE DE LA CLASE: el diff entre la mala y la buena sólo
    // puede tocar EL MARCADOR DEL PUNTO.
    //
    // La v0 decía «un ítem de sobreaplicación sólo puede BORRAR», y era
    // media regla: se escribió mirando los tres primeros puntos, donde la
    // pieza sobra. En `r6-pe-regla-operativa` la sobreaplicación va al
    // revés —el alumno sobregeneraliza «quita pe» y OMITE `pe` donde es
    // obligatorio—, así que la corrección AÑADE. Y en la cara de la
    // colocación de `ca` no borra ni añade: mueve. Las tres son la misma
    // clase, y lo que de verdad las une no es la dirección sino que **la
    // única pieza que cambia es la que el punto enseña**.
    for (const [pieza, marcador] of [[NUM, 'de'], [COMPL, 'ca'], [REL, 'pe'], [PE, 'pe']] as const) {
      if (x.p !== pieza) continue;
      for (const w of diff(x.mala, x.buena))
        if (w !== marcador)
          v.push(`${id}: el diff toca «${w}», y el marcador de este punto es «${marcador}» — un ítem de frontera sólo puede cambiar la pieza que el punto enseña`);
    }

    if (x.p === NUM) {
      // RESTRICCIÓN DE PLANTILLA, en ALLOWLIST porque decide RECHAZOS: en
      // coloquial existe `cinci de-alea`, `trei de-ăștia` (numeral + `de` +
      // demostrativo popular), donde ese `de` es OTRO morfema y la mala
      // sería lengua real. Enumerar lo prohibido dejaría pasar lo que
      // falte; enumerar lo admitido suspende lo que falte.
      const nucleo = /(?<![\p{L}])de\s+(\p{L}+)/iu.exec(x.mala)?.[1]?.toLowerCase();
      if (!nucleo || !NOMBRES_CONTABLES.has(nucleo))
        v.push(`${id}: el nombre contado «${nucleo ?? '?'}» no está en la allowlist del lote — falla cerrado porque «cinci de-alea» existe en coloquial y ahí «de» es otro morfema`);
      // La pieza que sobra es «de», y tiene que ir PEGADA al numeral: el
      // «de» de «de la piață» es otro y borrarlo sería otra frase.
      if (!/(?<![\p{L}])(unu|una|doi|două|trei|patru|cinci|șase|șapte|opt|nouă|zece|unsprezece|doisprezece|douăsprezece|treisprezece|paisprezece|cincisprezece|șaisprezece|șaptesprezece|optsprezece|nouăsprezece)\s+de(?![\p{L}])/iu.test(x.mala))
        v.push(`${id}: la mala no lleva un numeral MENOR QUE 20 seguido de «de» — la frontera de este punto está en el 19/20, y con ≥20 el «de» es obligatorio y la mala sería correcta`);
    }
    if (x.p === COMPL) {
      if (!/(?<![\p{L}])ca\s+să(?![\p{L}])/iu.test(x.mala))
        v.push(`${id}: la mala no lleva «ca să» adyacente — la sobreaplicación de este punto es meter «ca» sin sujeto que colocar`);
      // Y lo que la hace mala: que NO haya sujeto entre «ca» y «să». Si lo
      // hubiera, la frase sería correcta y el ítem estaría al revés.
      if (/(?<![\p{L}])ca\s+(?!să)\p{L}+/iu.test(x.mala))
        v.push(`${id}: entre «ca» y «să» hay un sintagma — entonces la mala es CORRECTA y el ítem está invertido`);
      if (/(?<![\p{L}])ca\s+să(?![\p{L}])/iu.test(x.buena)) v.push(`${id}: la buena conserva «ca să»`);
    }
    if (x.p === REL) {
      // RESTRICCIÓN DE PLANTILLA, también en allowlist: con un antecedente
      // que denote superficie, vía o vehículo, `pe care` + verbo de
      // movimiento es CORRECTO en lectura locativa (`drumul pe care vine`
      // = «el camino por el que viene») y la mala deja de ser mala.
      const ante = x.mala.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^\p{L}]/gu, '');
      if (!ante || !ANTECEDENTES_SIN_LECTURA_LOCATIVA.has(ante))
        v.push(`${id}: el antecedente «${ante ?? '?'}» no está en la allowlist — con superficie, vía o vehículo (drum, cal, autobuz, scaun) «pe care» admite lectura LOCATIVA y la mala sería correcta`);
      if (!/(?<![\p{L}])pe\s+care(?![\p{L}])/iu.test(x.mala)) v.push(`${id}: la mala no lleva «pe care»`);
      if (/(?<![\p{L}])pe\s+care(?![\p{L}])/iu.test(x.buena)) v.push(`${id}: la buena conserva «pe care»`);
      // EL PARADIGMA, AL REVÉS QUE EN EL LOTE 19: aquí «care» TIENE que
      // poder ser el sujeto, o la mala no es una sobreaplicación sino una
      // frase a la que además le falta el clítico.
      const m = /(?<![\p{L}])care\s+(\p{L}+)/iu.exec(x.buena);
      if (!x.inf) v.push(`${id}: no declara «inf» — sin lema no se puede preguntar si «care» concuerda como sujeto`);
      else if (!m) v.push(`${id}: la buena no lleva «care» + verbo`);
      else if (!concuerdaComoSujeto(x.inf, m[1]!))
        v.push(`${id}: «${m[1]}» no es la 3.ª persona de «${x.inf}» — si «care» no puede ser el SUJETO, la buena no es una relativa de sujeto y el ítem no examina la frontera`);
      if (/(?<![\p{L}])(îl|o|îi|le)\s|(?<![\p{L}])(l|i|le|o)-/iu.test(x.buena))
        v.push(`${id}: la buena lleva clítico — la relativa de SUJETO va desnuda, sin «pe» y sin nada que repetir`);
    }
    if (x.p === PE) {
      // LO QUE HACE PUBLICABLE A ESTE ÍTEM: el doblado clítico tiene que
      // ser IMPOSIBLE, no facultativo, o el ítem mediría también
      // `r6-doblado-cliticos` — que está cubierto con ocho ítems y se
      // llevaría el fallo. Sólo lo garantizan `nimeni` y `cine`, donde las
      // dos fuentes coinciden; `cineva` queda fuera porque discrepan.
      const objeto = /(?<![\p{L}])pe\s+(\p{L}+)/iu.exec(x.buena)?.[1]?.toLowerCase();
      if (!objeto || !SIN_DOBLADO_POSIBLE.has(objeto))
        v.push(`${id}: «pe ${objeto ?? '?'}» no está en la allowlist de objetos que NO admiten doblado — con cualquier otro el ítem mediría también r6-doblado-cliticos`);
      if (/(?<![\p{L}])(îl|o|îi|le)\s|(?<![\p{L}])(l|i|le|o)-/iu.test(x.buena))
        v.push(`${id}: la buena lleva clítico, y con estos pronombres el doblado es IMPOSIBLE (Croitor 2010)`);
      if (/(?<![\p{L}])pe(?![\p{L}])/iu.test(x.mala)) v.push(`${id}: la mala ya lleva «pe»`);
    }
  }
  for (const [i, x] of items.entries())
    for (const c of camposSinDeclarar('correccion', x as unknown as Record<string, unknown>))
      v.push(`CORO20-${String(i + 1).padStart(3, '0')} (${x.p}): no declara «${c}», que la definición del formato declara gate`);
  v.push(...revisarCopula(items.map((x) => ({ p: x.p, buena: x.buena, alt: x.alt })), 'COP'));
  const m = medirAtajo(items, 'ATAJO');
  for (const id of m.sinDeclarar) v.push(`${id}: atajoEs sin declarar`);
  for (const d of m.discrepan) v.push(d);
  // OJO: aquí NO se suspende por `atajoEs=true`. En un lote de frontera el
  // atajo es la propiedad definitoria, no el defecto, y `medirAtajo` ya los
  // saca de la cuenta y los informa aparte. Silenciar el gate habría sido
  // la otra salida, y es la mala.
  if (!hunspellDisponible()) v.push('hunspell no disponible: el segundo camino NO corrió');
  else {
    const PROPIOS = new Set(['cluj', 'ion', 'maria', 'brașov', 'bucurești', 'andrei']);
    const revisables = palabras.map((w) => w.toLowerCase()).filter((w) => w && !PROPIOS.has(w));
    for (const w of desconocidas(revisables)) if (!exenta(w)) v.push(`hunspell no reconoce «${w}» en una frase buena`);
  }
  return v;
}

if (new RegExp(`[/\\\\]corr-ro-l20\\.ts$`).test(process.argv[1] ?? '')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--asigna')) {
    const r = informeAsigna(ITEMS.map((x) => ({ p: x.p, sentence: x.buena, hintEs: x.explicacion, answer: x.buena })));
    console.log('# A qué punto cuenta cada ítem del lote 20\n');
    console.log(r.lineas.join('\n'));
    process.exit(r.desvio ? 1 : 0);
  }
  console.log(`# Corrección RO-L20 — los ítems de FRONTERA · ${ITEMS.length} ítems\n`);
  for (const [i, x] of ITEMS.entries()) console.log(`${String(i + 1).padStart(2, '0')}. ~~${x.mala}~~ → **${x.buena}**\n      calco: «${x.calcoEs}»`);
  console.log(''); for (const l of preflight(ITEMS)) console.log(l);
  console.log(''); for (const l of medirAtajo(ITEMS, 'ATAJO').lineas) console.log(l);
  console.log('\n## Gates\n');
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

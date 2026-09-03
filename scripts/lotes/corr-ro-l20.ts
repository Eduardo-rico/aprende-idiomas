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

type ItemL20 = ItemCorreccion & { inf?: string };

export const ITEMS: ItemL20[] = [
  // ══ r2-numerales-de · la frontera de los 20 ═══════════════════════
  // Los ocho ítems publicados llevan numerales 20, 25, 30, 40, 50, 80,
  // 100 y 200: TODOS ≥20, o sea que la mitad negativa de la regla no se
  // examina nunca y «pon de detrás del numeral» saca 8/8.
  { p: NUM, pasada: 1, espejoEs: false, atajoEs: true, transparenteLatin: false, origenError: 'sobreaplicacion',
    mala: 'Am cumpărat cinci de mere de la piață.', buena: 'Am cumpărat cinci mere de la piață.',
    calcoEs: 'Compré cinco manzanas en el mercado.',
    explicacion: 'La regla del «de» tiene frontera: sólo entra a partir de VEINTE. Con los numerales del 1 al 19 el nombre va pegado y sin nada en medio — «cinci mere», «trei copii», «nouă zile». El «de» que sí aparece en esta frase es otro, el de «de la piață».' },
  { p: NUM, pasada: 1, espejoEs: false, atajoEs: true, transparenteLatin: false, origenError: 'sobreaplicacion',
    mala: 'În clasă sunt nouăsprezece de studenți.', buena: 'În clasă sunt nouăsprezece studenți.',
    calcoEs: 'En la clase hay diecinueve estudiantes.',
    explicacion: 'Diecinueve es el último número sin «de» y veinte el primero con «de»: «nouăsprezece studenți» pero «douăzeci DE studenți». La frontera está exactamente ahí, y no en si el número parece grande o pequeño.' },

  // ══ r8-completivas-ca-sa · la frontera del «ca» ═══════════════════
  // Los ocho publicados insertan «ca» y nada más. El caso donde NO va
  // —sujeto idéntico al del regente— no aparece en ninguno, y encima el
  // sujeto pospuesto está declarado como ALTERNATIVA dentro de los
  // propios ítems: el lote sabía que existe y no lo examinaba.
  { p: COMPL, pasada: 1, espejoEs: false, atajoEs: true, transparenteLatin: false, origenError: 'sobreaplicacion',
    mala: 'Vreau ca să vin mâine la birou.', buena: 'Vreau să vin mâine la birou.',
    calcoEs: 'Quiero venir mañana a la oficina.',
    explicacion: '«Ca» sólo aparece cuando hay un sujeto expreso que meter delante de «să». Si el sujeto es el mismo que el del verbo principal no hay nada que colocar ahí, y «vreau să vin» va sin «ca». En español se ve igual de claro: «quiero venir», no «quiero que yo venga».' },
  { p: COMPL, pasada: 1, espejoEs: false, atajoEs: true, transparenteLatin: false, origenError: 'sobreaplicacion',
    mala: 'Doresc ca să plec mai devreme astăzi.', buena: 'Doresc să plec mai devreme astăzi.',
    calcoEs: 'Deseo irme más temprano hoy.',
    explicacion: 'Mismo caso con otro verbo de voluntad: sujeto idéntico, así que «să» va pegado al regente sin «ca» en medio. La regla no es «con să siempre ca», es «ca cuando hay un sujeto expreso delante de să».' },

  // ══ r8-relativas-pe-care · la frontera del «pe» ═══════════════════
  // Los ocho publicados insertan «pe» + clítico. La relativa de SUJETO,
  // donde «pe» NO va y no hay nada que repetir, no aparece en ninguno.
  { p: REL, inf: 'a veni', pasada: 1, espejoEs: false, atajoEs: true, transparenteLatin: false, origenError: 'sobreaplicacion',
    mala: 'Omul pe care vine acum este vecinul meu.', buena: 'Omul care vine acum este vecinul meu.',
    calcoEs: 'El hombre que viene ahora es mi vecino.',
    explicacion: 'Aquí «care» es el SUJETO de «vine», no el objeto: es el hombre quien viene. Y el relativo sujeto va desnudo — sin «pe» y sin clítico que lo repita. La marca «pe» y el clítico entran juntos y sólo cuando el relativo es objeto, que se reconoce porque el verbo tiene otro sujeto.' },
];

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
    const enMala = new Set(x.mala.toLowerCase().replace(/[^\p{L}\s-]/gu, ' ').split(/\s+/).filter(Boolean));
    const nuevas = x.buena.toLowerCase().replace(/[^\p{L}\s-]/gu, ' ').split(/\s+/).filter(Boolean).filter((w) => !enMala.has(w));
    if (nuevas.length)
      v.push(`${id}: la buena introduce ${nuevas.map((w) => `«${w}»`).join(', ')}, que no está en la mala — un ítem de sobreaplicación sólo puede BORRAR la pieza que sobra`);

    if (x.p === NUM) {
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

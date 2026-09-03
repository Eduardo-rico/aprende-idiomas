// scripts/lotes/cloze-ro-a1e.ts — EL DECIMOQUINTO LOTE RUMANO:
// determinantes e interrogativos. A1-A2.
//
//   npx tsx scripts/lotes/cloze-ro-a1e.ts            # gates + tabla
//   npx tsx scripts/lotes/cloze-ro-a1e.ts --asigna   # a qué punto cuenta
//
// 24 ítems, 3 puntos × 8, los tres CLASES CERRADAS: la respuesta se
// elige de una tabla de seis u ocho formas, no se deriva de un lema. Es
// la máquina del lote 11 (clíticos y negación), y el gate es el mismo en
// espíritu: comprobar PERTENENCIA A LA TABLA, que es el equivalente
// honesto de «recalcular la forma» cuando no hay nada que calcular.
//   · r2-articulo-indefinido   un / o / niște
//   · r3-interrogativos        ce, cine, pe cine, cui, care, cât/câtă/câți/câte
//   · r4-demostrativos-caso    acest/această · acesta/aceasta · acestui/acestei
//
// LO QUE CADA PUNTO EXAMINA DE VERDAD, que no es lo que parece:
//   · el indefinido NO se examina en `un/o`, que se aciertan por instinto
//     desde el español: se examina en el GÉNERO del sustantivo rumano
//     (`o casă` pero `un tren`, y el neutro que va con `un` en singular)
//     y sobre todo en `niște`, que el español no tiene como artículo —
//     «unos libros» no da nada que copiar.
//   · los interrogativos NO se examinan en `unde/când/cum`, que calcan
//     uno a uno: se examinan en el CASO (`pe cine`, `cui`) y en la
//     CONCORDANCIA de `cât`.
//   · los demostrativos NO se examinan en el antepuesto, que transfiere
//     («este chico» → `acest băiat`): se examinan en la forma POSPUESTA
//     con artículo (`băiatul acesta`) y en el genitivo-dativo.
// Por eso los tres bloques evitan a propósito la mitad que transfiere, y
// un gate lo impone: es la lección del lote 9 con `pe`, donde la mitad
// convergente se coló y el tercer camino la midió.
import { verificar as verificarBase, type ClozeRo } from './cloze-ro-a1';
import { informeAsigna } from '../lib/asigna-ro';
import { SUSTANTIVOS_A1 } from '../../lib/data/languages/ro/lexicon-a1';

const IND = 'r2-articulo-indefinido';
const INT = 'r3-interrogativos';
const DEM = 'r4-demostrativos-caso';

const TABLA_IND = ['un', 'o', 'niște'];
const TABLA_INT = ['ce', 'cine', 'pe cine', 'cui', 'care', 'pe care', 'cât', 'câtă', 'câți', 'câte', 'unde', 'când', 'cum'];
const TABLA_DEM = [
  // cercanía
  'acest', 'această', 'acești', 'aceste', 'acesta', 'aceasta', 'aceștia', 'acestea', 'acestui', 'acestei', 'acestor',
  // lejanía — el paradigma ENTERO. La v0 se quedaba en `acela/aceea` y
  // le faltaban las siete de plural y de genitivo-dativo: no disparaba
  // hoy, y daría rojo falso al primer ítem legítimo de lejanía plural.
  'acel', 'acea', 'acei', 'acele', 'acela', 'aceea', 'aceia', 'acelea', 'acelui', 'acelei', 'acelor',
];

/** Las formas que el español calca UNO A UNO: si la respuesta es una de
 *  éstas, el ítem se acierta traduciendo y no mide rumano. Es la mitad
 *  convergente, y se prohíbe por gate en vez de por buena intención. */
const CALCA_DEL_ESPANOL = new Set(['unde', 'când', 'cum', 'ce', 'acest', 'această', 'acel', 'acea']);

export const ITEMS: ClozeRo[] = [
  // ── r2-articulo-indefinido · 8 · el GÉNERO y el plural `niște` ────
  { p: IND, r: 'o', s: 'Am cumpărat ___ pâine de la brutărie.', pista: 'artículo indefinido: el sustantivo es FEMENINO (en español el equivalente es masculino)', ancla: 'pâine de la brutărie', transparenteLatin: false, generoConvergeEs: false },
  // Un solo convergente, y declarado: sirve de ancla de confianza al
  // principio del bloque. Cuatro eran el bloque entero.
  { p: IND, r: 'un', s: 'Bunicul are ___ câine foarte bătrân.', pista: 'artículo indefinido: el sustantivo es MASCULINO', ancla: 'câine foarte bătrân', transparenteLatin: false, generoConvergeEs: true },
  { p: IND, r: 'un', s: 'Îmi trebuie ___ scaun mai înalt.', pista: 'artículo indefinido: el sustantivo es NEUTRO (en español el equivalente es femenino)', ancla: 'scaun mai înalt', transparenteLatin: false, generoConvergeEs: false },
  { p: IND, r: 'o', s: 'Vreau ___ cafea fără zahăr.', pista: 'artículo indefinido: el sustantivo es femenino (en español el equivalente es masculino)', ancla: 'cafea fără zahăr', transparenteLatin: false, generoConvergeEs: false },
  { p: IND, r: 'niște', s: 'Am cumpărat ___ mere de la piață.', pista: 'artículo indefinido PLURAL: el español no tiene artículo aquí («compré manzanas»), así que no hay nada que copiar', ancla: 'mere de la piață', transparenteLatin: false, generoConvergeEs: false },
  { p: IND, r: 'niște', s: '___ copii se joacă în curte.', pista: 'artículo indefinido plural, con un masculino: en esta posición el sustantivo desnudo NO es posible', ancla: 'se joacă în curte', transparenteLatin: false, generoConvergeEs: false },
  { p: IND, r: 'niște', s: 'Mi-a dat ___ flori foarte frumoase.', pista: 'artículo indefinido plural, con un femenino: la forma NO cambia con el género', ancla: 'flori foarte frumoase', transparenteLatin: false, generoConvergeEs: false },
  { p: IND, r: 'o', s: 'Am ___ problemă cu mașina.', pista: 'artículo indefinido: el sustantivo es femenino (en español el equivalente es masculino)', ancla: 'problemă cu mașina', transparenteLatin: false, generoConvergeEs: false },

  // ── r3-interrogativos · 8 · el CASO y la concordancia ─────────────
  { p: INT, r: 'pe cine', s: '___ ai salutat ieri la gară?', pista: 'interrogativo de persona en función de OBJETO: el rumano lo marca con preposición', ancla: 'ai salutat ieri la gară', transparenteLatin: false },
  { p: INT, r: 'cine', s: '___ a lăsat ușa deschisă, tu sau fratele tău?', pista: 'interrogativo de persona en función de SUJETO: aquí va desnudo', ancla: 'tu sau fratele tău', transparenteLatin: false },
  { p: INT, r: 'cui', s: '___ i-ai dat cheile?', pista: 'interrogativo de persona en DATIVO («¿a quién le…?»): tiene forma propia, no se construye con preposición', ancla: 'i-ai dat cheile', transparenteLatin: false },
  { p: INT, r: 'câte', s: '___ zile mai sunt până sâmbătă?', pista: 'interrogativo de cantidad, concordando con un FEMENINO PLURAL (en español el equivalente es masculino)', ancla: 'zile mai sunt până sâmbătă', transparenteLatin: false, generoConvergeEs: false },
  { p: INT, r: 'câți', s: '___ bani ai la tine?', pista: 'interrogativo de cantidad, concordando con un MASCULINO PLURAL (en español el equivalente va en singular)', ancla: 'bani ai la tine', transparenteLatin: false, generoConvergeEs: false },
  { p: INT, r: 'cât', s: '___ lapte pui în cafea?', pista: 'interrogativo de cantidad, con un incontable que en rumano NO es femenino', ancla: 'lapte pui în cafea', transparenteLatin: false, generoConvergeEs: false },
  { p: INT, r: 'care', s: '___ dintre cele două case îți place mai mult?', pista: 'interrogativo de SELECCIÓN entre varios, en función de sujeto', ancla: 'dintre cele două case', transparenteLatin: false },
  { p: INT, r: 'pe care', s: '___ dintre ei l-ai ales pentru echipă?', pista: 'interrogativo de selección en función de OBJETO, con persona: lleva la misma marca que «pe cine»', ancla: 'dintre ei l-ai ales', transparenteLatin: false },

  // ── r4-demostrativos-caso · 8 · la POSPUESTA y el genitivo-dativo ──
  { p: DEM, r: 'acesta', s: 'Băiatul ___ este colegul meu de bancă.', pista: 'demostrativo POSPUESTO al sustantivo articulado, de CERCANÍA («este»), masculino singular: en esta posición la forma es LARGA', ancla: 'colegul meu de bancă', transparenteLatin: false },
  { p: DEM, r: 'aceasta', s: 'Fotografia ___ este de la nuntă.', pista: 'demostrativo pospuesto, de CERCANÍA («esta»), femenino singular (forma larga)', ancla: 'este de la nuntă', transparenteLatin: false },
  { p: DEM, r: 'aceștia', s: 'Studenții ___ vin de la Iași.', pista: 'demostrativo pospuesto, de CERCANÍA («estos»), masculino plural (forma larga)', ancla: 'vin de la Iași', transparenteLatin: false },
  { p: DEM, r: 'acestea', s: 'Florile ___ sunt pentru mama ta.', pista: 'demostrativo pospuesto, de CERCANÍA («estas»), femenino plural (forma larga)', ancla: 'sunt pentru mama ta', transparenteLatin: false },
  { p: DEM, r: 'acestui', s: 'Numele ___ oraș este greu de pronunțat.', pista: 'demostrativo ANTEPUESTO en genitivo-dativo, de CERCANÍA («de este»), masculino/neutro singular', ancla: 'oraș este greu de pronunțat', transparenteLatin: false },
  { p: DEM, r: 'acestei', s: 'Ușa ___ case este mereu deschisă.', pista: 'demostrativo antepuesto en genitivo-dativo, de CERCANÍA («de esta»), femenino singular', ancla: 'case este mereu deschisă', transparenteLatin: false },
  { p: DEM, r: 'acestor', s: 'Părinții ___ copii lucrează la spital.', pista: 'demostrativo antepuesto en genitivo-dativo PLURAL, de CERCANÍA («de estos/estas»): una sola forma para los dos géneros', ancla: 'copii lucrează la spital', transparenteLatin: false },
  { p: DEM, r: 'aceea', s: 'Cartea ___ de pe raft este mai interesantă.', pista: 'demostrativo de LEJANÍA (no «este» sino «aquel»), pospuesto y en forma larga, femenino singular', ancla: 'de pe raft', transparenteLatin: false },
];

export function verificar(items: ClozeRo[]): string[] {
  const v = verificarBase(items);
  for (const [i, x] of items.entries()) {
    const id = `CLRO10-${String(i + 1).padStart(3, '0')} (${x.p})`;
    const r = x.r ?? '';
    const [antes = '', despues = ''] = x.s.split('___');

    // 1 · clase cerrada: la respuesta tiene que estar en su tabla. Caza
    // la errata que Hunspell no ve, porque `acesta`, `aceasta` y
    // `acestea` son todas palabras rumanas.
    const tabla = x.p === IND ? TABLA_IND : x.p === INT ? TABLA_INT : TABLA_DEM;
    if (!tabla.includes(r)) v.push(`${id}: «${r}» no está en la tabla de este punto (${tabla.join(', ')})`);

    // 2 · LA MITAD QUE TRANSFIERE NO SE EXAMINA. `unde/când/cum` y el
    // demostrativo antepuesto de nominativo se calcan uno a uno del
    // español, así que un ítem con esa respuesta mide traducción. Es la
    // lección del lote 9, donde la mitad convergente de `pe` se coló y
    // sólo la vio el tercer camino.
    if (CALCA_DEL_ESPANOL.has(r))
      v.push(`${id}: «${r}» se calca uno a uno del español — es la mitad que TRANSFIERE y el punto no se examina ahí`);

    // 3 · IND · el hueco va DELANTE del sustantivo, y el sustantivo tiene
    // que estar en la frase: si no, no hay género que decidir.
    if (x.p === IND) {
      if (!/^\s*\p{L}+/u.test(despues)) v.push(`${id}: el indefinido va antepuesto y no hay sustantivo detrás del hueco`);
      // `niște` va con PLURAL o con INCONTABLE (valor partitivo: niște
      // apă, niște pâine, niște zahăr — GALR, «Articolul nehotărât»). La
      // v0 exigía plural y prohibía el partitivo: un gate que cierra
      // contenido legítimo, que es peor que no tenerlo.
      // El NÚMERO se consulta en el lexicón, no se adivina por la
      // terminación: `câine`, `pâine`, `cafea` y `scrisoare` acaban en
      // vocal y son SINGULARES, y la v1 de este gate los marcaba a los
      // cuatro. Una regla de sufijo sobre una lengua cuyo plural ES un
      // sufijo vocálico no puede funcionar; el lexicón sí lo sabe.
      const MASIVOS = /^\s*(apă|pâine|zahăr|lapte|cafea|ceai|vin|carne|orez|sare|timp|bani)(?![\p{L}])/u;
      const siguiente = (despues.match(/^\s*(\p{L}+)/u)?.[1] ?? '').toLowerCase();
      const esPlural = SUSTANTIVOS_A1.some((l) => l.plural.toLowerCase() === siguiente);
      const esSingular = SUSTANTIVOS_A1.some((l) => l.lema.toLowerCase() === siguiente);
      if (siguiente && !esPlural && !esSingular)
        v.push(`${id}: «${siguiente}» no está en el lexicón — el número no se puede comprobar y el gate no puede decir nada`);
      const plural = esPlural;
      if (r === 'niște' && !plural && !MASIVOS.test(despues))
        v.push(`${id}: «niște» pide plural o incontable, y el sustantivo de detrás no es ninguno de los dos`);
      // La rama inversa estaba DESDENTADA: sólo miraba `uri|ele|ile`, así
      // que «un flori» —plural en -i— habría pasado en verde. Ahora mira
      // el mismo test de plural que la rama de arriba.
      if (r !== 'niște' && plural && !MASIVOS.test(despues))
        v.push(`${id}: «${r}» es singular y el sustantivo de detrás es plural`);
    }

    // 4 · INT · el interrogativo abre la pregunta y la frase ES una
    // pregunta: sin el signo, `care` y `cine` son relativos y el ítem
    // cuenta a otro punto.
    if (x.p === INT) {
      if (!x.s.trim().endsWith('?')) v.push(`${id}: el punto son los INTERROGATIVOS y la frase no es una pregunta`);
      if (antes.trim() !== '') v.push(`${id}: el interrogativo no abre la pregunta`);
      // Y la concordancia de `cât` se comprueba de verdad: la forma tiene
      // que casar con el sustantivo que la sigue, o el ítem enseña mal.
      const CAT: Record<string, RegExp> = { 'cât': /^\s*(timp|zahăr|lapte)/u, 'câtă': /^\s*(apă|cafea|pâine|vreme)/u, 'câți': /^\s*\p{L}+(i|ți|și)(?![\p{L}])/u, 'câte': /^\s*\p{L}+(e|le)(?![\p{L}])/u };
      if (CAT[r] && !CAT[r]!.test(despues)) v.push(`${id}: «${r}» no concuerda con el sustantivo que le sigue`);
    }

    // 5 · DEM · las dos mitades que el punto SÍ examina, cada una con su
    // marca. Pospuesto: detrás de un sustantivo ARTICULADO y en forma
    // larga. Genitivo-dativo: delante y sin artículo en el sustantivo.
    if (x.p === DEM) {
      const largo = /(a|ea|ia|ui|ei|or)$/.test(r);
      if (!largo) v.push(`${id}: «${r}» es la forma corta, y el punto examina la pospuesta y el genitivo-dativo`);
      const pospuesto = /\p{L}+(ul|le|a|ua|ea|ii|ile|urile)\s*$/u.test(antes);
      const gd = /(ui|ei|or)$/.test(r);
      if (!gd && !pospuesto) v.push(`${id}: la forma larga «${r}» va POSPUESTA a un sustantivo articulado y aquí no lo está`);
      if (gd && !/^\s*\p{L}+/u.test(despues)) v.push(`${id}: el demostrativo en genitivo-dativo va ANTEPUESTO y no hay sustantivo detrás`);
      if (gd && /^\s*\p{L}+(ul|le|a|ua)(?![\p{L}])/u.test(despues))
        v.push(`${id}: con el demostrativo antepuesto el sustantivo va SIN artículo`);
    }
  }
  // LA CONVERGENCIA DE GÉNERO, declarada y con tope. `transparenteLatin`
  // pregunta por la CADENA («¿la escribiría un hispanohablante?») y ésta
  // por el CAMINO («¿se acierta traduciendo el género?»): son preguntas
  // distintas y el lote 15 salió verde con 4 de 5 singulares acertables
  // por traducción porque sólo existía la primera.
  const sinDeclarar = items.filter((x) => x.p === IND && x.generoConvergeEs === undefined);
  for (const x of sinDeclarar) v.push(`${x.r}: el ítem del indefinido no declara \`generoConvergeEs\` — «no medido» no es «limpio»`);
  const conv = items.filter((x) => x.generoConvergeEs);
  const delPunto = items.filter((x) => x.p === IND);
  if (delPunto.length >= 4 && conv.length / delPunto.length > 0.25)
    v.push(`${IND}: ${conv.length} de ${delPunto.length} ítems se aciertan traduciendo el GÉNERO español — por encima de un cuarto el bloque mide español`);

  // Reparto: con una sola forma por bloque el punto enseña una constante.
  for (const [p, min] of [[IND, 3], [INT, 5], [DEM, 5]] as const) {
    const xs = items.filter((x) => x.p === p);
    if (!xs.length) continue;
    const d = new Set(xs.map((x) => x.r));
    if (d.size < min) v.push(`${p}: sólo ${d.size} formas distintas en ${xs.length} ítems — el punto pide al menos ${min}`);
  }
  return v;
}

if (new RegExp(`[/\\\\]cloze-ro-a1e\\.ts$`).test(process.argv[1] ?? '')) {
  const v = verificar(ITEMS);
  if (process.argv.includes('--asigna')) {
    const r = informeAsigna(ITEMS.map((x) => ({ p: x.p, sentence: x.s.replace('___', String(x.r ?? '')), hintEs: x.pista, answer: String(x.r ?? '') })));
    console.log('# A qué punto cuenta cada ítem del lote 15\n');
    console.log(r.lineas.join('\n'));
    process.exit(r.desvio ? 1 : 0);
  }
  console.log(`# Cloze RO-A1e — determinantes e interrogativos · ${ITEMS.length} ítems · transparenteLatin ${ITEMS.filter((x) => x.transparenteLatin).length}/${ITEMS.length}\n`);
  for (const [i, x] of ITEMS.entries()) console.log(`${String(i + 1).padStart(2, '0')}. ${x.s.replace('___', '[' + x.r + ']')}  → **${x.r}**  · ${x.pista}`);
  console.log('\n## Gates\n');
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio.');
}

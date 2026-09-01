// scripts/barrido-tiempo-declarado.ts — ¿la pista dice el tiempo que la
// respuesta tiene de verdad?
//
//   npx tsx scripts/barrido-tiempo-declarado.ts
//   npx tsx scripts/barrido-tiempo-declarado.ts --lista
//
// La lectura de los 60 cerró la determinación escribiendo pistas que
// NOMBRAN el tiempo: «imperfeito de "ser", 3.ª persona». Eso convierte la
// pista en una afirmación comprobable —y en una nueva forma de mentir, si
// la pista dice un tiempo y la respuesta trae otro. Es el mismo patrón que
// el `espejoEs` que declaré mal y que hizo que un gate rechazara un punto
// entero por mi etiqueta, no por sus ítems.
//
// DOS CAUTELAS, las dos aprendidas a base de golpes:
//
//   · **El denominador va DENTRO.** Un «0 hallazgos» no dice nada si no
//     dice sobre cuántos. Los dos ceros falsos de esta ola pasaron por ahí.
//   · **Sólo dispara cuando está SEGURO.** La morfología portuguesa
//     solapa: «queria» es imperfeito de «querer» y parece condicional;
//     «ria» es imperfeito de «rir». Así que las formas en «-ria» no se
//     clasifican, y punto. Un gate que marca la mitad de los casos es un
//     gate apagado: nadie lee 121 hallazgos.
import fs from 'node:fs';
import path from 'node:path';
import { BLOCKS_DIR } from './config';
import { servibleAlAlumno } from './lib/estado-item';
import { textoAnalizable, palabrasAnalizables } from './lib/texto-cloze';

const ESCRIPT = !!process.argv[1]?.includes('barrido-tiempo-declarado');
const items = !ESCRIPT ? [] : fs.readdirSync(BLOCKS_DIR).filter((x) => /^b\d+\.json$/.test(x)).sort()
  .flatMap((f) => JSON.parse(fs.readFileSync(path.join(BLOCKS_DIR, f), 'utf8')) as any[])
  .filter(servibleAlAlumno);
const LISTA = process.argv.includes('--lista');

// ── 1. Tiempo declarado en la pista contra tiempo de la respuesta ───────

type T = 'presente' | 'imperfeito' | 'perfeito' | 'futuro' | 'subj-imperf'
       | 'participio' | 'gerundio' | 'infinitivo';

/** Lo que la pista DICE. Se lee de más específico a más general: «presente
 *  do conjuntivo» tiene que ganarle a «presente», y «imperfeito do
 *  conjuntivo» a «imperfeito», o el barrido se acusa a sí mismo. */
export function declarado(pista: string): T | null {
  const p = pista.toLowerCase();
  // Lo que NO se clasifica, y por qué: las perífrasis y los compuestos
  // tienen dos verbos y el sufijo del segundo no dice el tiempo del
  // conjunto; el imperativo y la mesóclisis traen clítico pegado.
  if (/mesócli|mesocli|imperativo|compuesto|composto|perífrasis|perifrás|condicional/.test(p)) return null;
  // La pista declara con su PRIMER nombre de tiempo, no con el más
  // específico que aparezca en cualquier sitio: «imperfeito por FUTURO DEL
  // PASADO» declara imperfeito y explica por qué, y «presente de "ir" —
  // sin "a" delante del infinitivo» declara presente. Ordenar por
  // especificidad y no por posición me dio 2 hallazgos falsos de 4: el
  // gate se estaba acusando a sí mismo de lo que hacía bien.
  const ETIQUETAS: [RegExp, T | null][] = [
    [/imperfeito do conjuntivo|imperfecto de subjuntivo|imperfeito de subjuntivo/, 'subj-imperf'],
    [/presente do conjuntivo|presente de subjuntivo/, null], // se solapa con el presente
    [/particip|particíp/, 'participio'],
    [/gerundio|gerúndio/, 'gerundio'],
    [/infinitivo/, 'infinitivo'],
    [/futuro/, 'futuro'],
    [/pretérito|preterito|pasado simple/, 'perfeito'],
    [/imperfeito|imperfecto/, 'imperfeito'],
    [/presente/, 'presente'],
  ];
  let mejor: { i: number; t: T | null; len: number } | null = null;
  for (const [re, t] of ETIQUETAS) {
    const m = p.match(re);
    if (!m || m.index === undefined) continue;
    // A igualdad de posición gana la más larga: «imperfeito do conjuntivo»
    // empieza donde «imperfeito» y no es lo mismo.
    if (!mejor || m.index < mejor.i || (m.index === mejor.i && m[0].length > mejor.len))
      mejor = { i: m.index, t, len: m[0].length };
  }
  return mejor?.t ?? null;
}

const IRREG_PERF = new Set(['fui','foste','foi','fomos','foram','vim','vieste','veio','viemos','vieram',
  'tive','tiveste','teve','tivemos','tiveram','estive','esteve','estiveram','fiz','fizeste','fez','fizemos','fizeram',
  'disse','disseste','dissemos','disseram','trouxe','trouxeste','trouxemos','trouxeram','pude','pôde','pudemos','puderam',
  'quis','quiseste','quisemos','quiseram','soube','soubemos','souberam','pus','pôs','pusemos','puseram','dei','deu','demos','deram',
  'vi','viu','vimos','viram','houve','pôde']);
const IRREG_IMPERF = new Set(['era','eras','éramos','eram','tinha','tinhas','tínhamos','tinham',
  'vinha','vinhas','vínhamos','vinham','punha','punhas','púnhamos','punham','via','vias','víamos','viam']);
const IRREG_PRES = new Set(['sou','és','é','somos','são','estou','está','estamos','estão','tenho','tem','temos','têm',
  'vou','vais','vai','vamos','vão','dou','dás','dá','damos','dão','faço','faz','fazemos','fazem','digo','diz','dizemos','dizem','sei','sabe','sabemos','sabem']);
const IRREG_PART = new Set(['feito','dito','visto','posto','escrito','aberto','coberto','ganho','gasto','pago','vindo','pôsto']);

/** Lo que la respuesta ES, y `null` en cuanto hay la menor duda.
 *  Devolver `null` de más es barato; devolver una etiqueta equivocada
 *  produce un hallazgo falso, y un hallazgo falso quema el gate entero. */
export function real(f: string): T | null {
  const r = f.toLowerCase().normalize('NFC').trim();
  if (/\s/.test(r)) return null;              // compuesto o perífrasis
  if (/-/.test(r)) return null;               // clítico pegado
  if (IRREG_PERF.has(r)) return 'perfeito';
  if (IRREG_IMPERF.has(r)) return 'imperfeito';
  if (IRREG_PRES.has(r)) return 'presente';
  if (IRREG_PART.has(r)) return 'participio';
  // AMBIGUAS de verdad: «-ria» es condicional Y es el imperfeito de los
  // verbos en -er/-ir cuyo radical acaba en r («queria», «ria»). Fuera.
  if (/(ria|rias|ríamos|riam)$/.test(r)) return null;  // ANCLADO: sin paréntesis, «variam» también caía
  if (/(sse|sses|ssem|ssemos|êssemos|íssemos|ássemos)$/.test(r)) return 'subj-imperf';
  if (/(ando|endo|indo)$/.test(r)) return 'gerundio';
  if (/(ad[oa]s?|id[oa]s?)$/.test(r)) return 'participio';
  // El futuro se forma sobre el INFINITIVO ENTERO, así que su desinencia
  // arrastra la vocal temática: «comprarei», no «comprei». Anclar sólo en
  // «-rei» clasificó el pretérito «comprei» como futuro, y los irregulares
  // contraídos —«será», «fará», «dirá», «porá»— caen igual dentro.
  if (/[aeio](rei|rás|rá|remos|rão)$/.test(r)) return 'futuro';
  if (/(ava|avas|ávamos|avam|íamos)$/.test(r)) return 'imperfeito';
  // «-ei» es la 1.ª del pretérito de los verbos en -ar («comprei»), y sólo
  // se puede poner aquí porque el futuro ya se ha decidido arriba: si
  // fuera «comprarei», la regla del futuro se lo habría llevado antes.
  if (/(aste|este|iste|ámos|aram|eram|iram|ou|iu|ei)$/.test(r)) return 'perfeito';
  return null;                                 // presente y presSubj se solapan: no se afirma
}

const conPista = items.filter((x) => x.type === 'fill_blank' && x.data?.blanks?.length === 1
  && String(x.data?.hintEs ?? '').trim());
const comparables = conPista
  .map((x) => ({ x, d: declarado(String(x.data.hintEs)), r: real(String(x.data.blanks[0].answer ?? '')) }))
  .filter((c) => c.d && c.r);
const choques = comparables.filter((c) => c.d !== c.r);

// ── 2. «cujo» seguido de artículo ───────────────────────────────────────
//
// El relativo posesivo portugués NUNCA lleva artículo detrás: «o livro
// cujo autor», nunca «cujo o autor». Es un calco que el hispanohablante no
// comete —el español tampoco lo lleva—, pero sí lo comete quien traduce
// desde «de quien el». Se mide sobre el texto ENSAMBLADO y con el molde
// fuera, que es donde dos barridos de esta ola dieron cero por leer la
// plantilla.
const conCujo = items.filter((x) =>
  palabrasAnalizables(x, { conRespuesta: true }).some((w) => /^cuj[oa]s?$/.test(w)) ||
  /cuj[oa]s?\b/i.test(JSON.stringify(x.data ?? {})));
const CUJO_ART = /\bcuj[oa]s?\s+(?:o|a|os|as)\s+\p{L}/iu;
const malCujo = conCujo.filter((x) => {
  const campos = [textoAnalizable(x, { conRespuesta: true }),
    ...Object.values(x.data ?? {}).filter((v): v is string => typeof v === 'string')];
  return campos.some((s) => CUJO_ART.test(s));
});

// ── Informe ────────────────────────────────────────────────────────────
console.log('# Sexto barrido — el tiempo declarado y el relativo posesivo\n');
console.log('| regla | denominador | hallazgos |');
console.log('|---|---:|---:|');
console.log(`| la pista declara un tiempo y la respuesta trae otro | ${comparables.length} de ${conPista.length} con pista (el resto no se clasifica sin duda) | **${choques.length}** |`);
console.log(`| «cujo» seguido de artículo | ${conCujo.length} ítems con «cujo» | **${malCujo.length}** |`);

if (LISTA || choques.length || malCujo.length) {
  for (const c of choques)
    console.log(`\n- \`${c.x.id}\` dice **${c.d}** y la respuesta «${c.x.data.blanks[0].answer}» es **${c.r}**\n  pista: ${c.x.data.hintEs}`);
  for (const x of malCujo)
    console.log(`\n- \`${x.id}\` «cujo» con artículo: ${textoAnalizable(x, { conRespuesta: true })}`);
}
if (LISTA) {
  console.log(`\n## Lo comparable, por tiempo declarado\n`);
  const porT = new Map<string, number>();
  for (const c of comparables) porT.set(c.d!, (porT.get(c.d!) ?? 0) + 1);
  for (const [t, n] of [...porT].sort((a, b) => b[1] - a[1])) console.log(`- ${t}: ${n}`);
}

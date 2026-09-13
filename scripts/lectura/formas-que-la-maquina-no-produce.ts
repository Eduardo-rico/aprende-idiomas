// scripts/lectura/formas-que-la-maquina-no-produce.ts
//
// LA AUDITORÍA QUE MIRA AL REVÉS.
//
// El gate de atestación pregunta «¿está atestiguada cada forma que produzco?»
// y con eso caza inventos. Esta pregunta la contraria: **¿produzco cada forma
// atestiguada de los lemas que conozco?** Y caza otra cosa: los huecos de la
// máquina, que el primer gate no puede ver porque callar no es inventar.
//
// Lo que destapó al escribirla:
//
//   · LA VOZ PASIVA — 10.669 tokens del corpus anotados `Voice=Pass` y la
//     máquina no tiene ninguna. Es un punto entero, `l6-pasiva-infectum`, y
//     el hueco de máquina más grande que queda.
//   · EL PERFECTO SINCOPADO — «audiērunt» ×25, «audīstis» ×20, «audīsse»
//     ×11, «petiērunt» ×8. 61 tokens de lemas que el lexicón ya tenía.
//     Añadido a `variantesDelPerfecto`.
//   · `loca` ×28 — el plural neutro de `locus`, que también hace `locī`.
//     Heteróclito, pendiente.
//   · Y un ERROR DEL CORPUS: «voice» por «vōce» en `perseus-ud-test`, con la
//     anotación latina correcta (`vōx`, Abl Fem Sing). La frase es «taeterrima
//     vōce de Laserpiciario mimo canticum extorsit». Alguien pasó un
//     corrector inglés por encima.
//
// ── POR QUÉ NO SIRVIÓ UNA HEURÍSTICA MÁS AMPLIA ─────────────────────
//
// Antes de esto probé a buscar tokens que fueran palabras inglesas: devolvió
// 26 y TODOS eran falsos —`quod`, `sunt`, `dīxit`, `haec`, `rebus`—, porque
// el diccionario inglés contiene medio latín. Cero aciertos.
//
// Lo que encontró el error de verdad fue tener un GENERADOR INDEPENDIENTE
// contra el que comparar. Sin la máquina, «voice» sería para siempre «una
// forma de vōx» y nadie lo miraría dos veces.
import fs from 'node:fs';
import { VERBOS_L1 } from '../../lib/data/languages/la/lexicon-l1';
import { todasLasFormasDeL1 } from '../../lib/data/languages/la/todas-las-formas';
import { paradigmaNominal, infectum, perfectum, declinacionDe, variantesDelPerfecto } from '../../lib/data/languages/la/paradigma-la';
import type { Persona, TiempoPerfecto } from '../../lib/data/languages/la/paradigma-la';

const D = 'scripts/.cache/treebanks';
const sinM = (s: string) =>
  s.normalize('NFD').replace(/[̄̆]/g, '').normalize('NFC').toLowerCase().replace(/j/g, 'i').replace(/v/g, 'u');

const PERSONAS: Persona[] = ['1sg', '2sg', '3sg', '1pl', '2pl', '3pl'];
const TIEMPOS: TiempoPerfecto[] = ['perfecto', 'pluscuamperfecto', 'futuro-perfecto'];

export function loQueLaMaquinaProduce(): Map<string, Set<string>> {
  const puede = new Map<string, Set<string>>();
  // El dominio sale de `todas-las-formas`, que mira las diez tablas. La
  // versión anterior miraba tres, y esta auditoría es JUSTO la que pregunta
  // «¿qué trae el corpus que la máquina no produce?»: con un enumerador
  // corto, todo lo que producen las otras siete tablas salía como hueco.
  for (const { clave, forma } of todasLasFormasDeL1()) {
    const lema = sinM(clave.split('.')[0]!);
    if (!puede.has(lema)) puede.set(lema, new Set());
    puede.get(lema)!.add(sinM(forma));
  }
  // ── LA LEMATIZACIÓN DE LA FUENTE MANDA ──
  //
  // UD pone `vōs` bajo el lema `tu` y `nōs` bajo `ego`: para el treebank son
  // una sola entrada por persona, no cuatro pronombres. Nuestra tabla los
  // separa porque son paradigmas distintos, y eso está bien — pero al
  // preguntarle al corpus hay que preguntarle EN SU CONVENCIÓN, o `vos`
  // sale como forma que la máquina no produce cuando sí la produce, bajo
  // otro nombre. No es un hueco de la máquina: es un desencuentro de
  // etiquetas, y confundirlos fabrica trabajo que no existe.
  for (const [nuestro, suyo] of [['nōs', 'ego'], ['vōs', 'tu']] as const) {
    const dellos = puede.get(sinM(nuestro));
    if (!dellos) continue;
    const destino = puede.get(sinM(suyo)) ?? new Set<string>();
    for (const f of dellos) destino.add(f);
    puede.set(sinM(suyo), destino);
  }
  // Las variantes del perfecto no están en el paradigma base y sí en el
  // corpus: `-ēre` por `-ērunt`, las sincopadas.
  for (const v of VERBOS_L1) {
    const s = puede.get(sinM(v.lema)) ?? new Set<string>();
    for (const p of PERSONAS) for (const t of TIEMPOS)
      for (const f of variantesDelPerfecto(v, p, t)) s.add(sinM(f));
    puede.set(sinM(v.lema), s);
  }
  return puede;
}

export interface NoProducida { lema: string; forma: string; n: number; fichero: string; rasgos?: string }

export function auditar(): NoProducida[] {
  const puede = loQueLaMaquinaProduce();
  const out = new Map<string, NoProducida>();
  for (const f of fs.readdirSync(D).filter((x) => x.startsWith('la_') && x.endsWith('.conllu')))
    for (const l of fs.readFileSync(`${D}/${f}`, 'utf8').split('\n')) {
      if (!l || l[0] === '#') continue;
      const t = l.split('\t');
      if (t.length < 6 || !/^\d+$/.test(t[0] ?? "")) continue;
      const lem = sinM(t[2] ?? '');
      const rasgos = t[5] ?? '';
      const s = puede.get(lem);
      if (!s) continue;
      const w = sinM(t[1] ?? '');
      if (s.has(w)) continue;
      const r = Object.fromEntries((t[5] ?? '').split('|').map((x) => x.split('=')));
      // ── LOS FILTROS SE ACTUALIZAN CUANDO CRECE LA MÁQUINA ──
      //
      // Decían «sólo indicativo activo y finito», y era cierto cuando se
      // escribieron. El 2026-09-12 la máquina ganó la PASIVA, los
      // INFINITIVOS, los PARTICIPIOS y el SUBJUNTIVO, y estos tres `continue`
      // seguían saltándose justo el material nuevo: la auditoría habría
      // quedado en verde sin mirar nada de lo recién construido.
      //
      // Es el caso exacto contra el que avisa §5.octies, y por eso se
      // arregla EN EL MISMO COMMIT que añade el subjuntivo y no después.
      //
      // Lo que sigue fuera es lo que la máquina de verdad no produce: el
      // gerundio, el gerundivo declinado y el supino.
      if (r.VerbForm && !['Fin', 'Inf', 'Part'].includes(r.VerbForm)) continue;
      if (r.Mood && !['Ind', 'Sub', 'Imp'].includes(r.Mood)) continue;
      if (r.Case && !['Nom', 'Acc', 'Gen', 'Dat', 'Abl', 'Voc'].includes(r.Case)) continue;
      const k = `${lem}|${w}`;
      const prev = out.get(k);
      if (prev) prev.n++;
      else out.set(k, { lema: t[2] ?? '', forma: t[1] ?? '', n: 1, fichero: f.replace('la_', '').replace('.conllu', ''), rasgos });
    }
  return [...out.values()].sort((a, b) => b.n - a.n);
}

if (process.argv[1]?.endsWith('formas-que-la-maquina-no-produce.ts')) {
  const r = auditar();
  console.log(`  formas atestiguadas que la máquina no produce: ${r.length}\n`);
  for (const x of r.slice(0, 25))
    console.log(`    ${x.forma.padEnd(15)} ×${String(x.n).padStart(3)}  lema «${x.lema}»  ${x.fichero}`);
}

// ══ LA CLASIFICACIÓN, QUE ENTRA EL 2026-09-12 ════════════════════════
//
// Al enchufar la auditoría al enumerador bueno —las diez tablas en vez de
// tres— los huecos pasaron de unos cuarenta a 257. No es ruido: la
// auditoría empezó a mirar lemas que antes no miraba (pronombres,
// irregulares, pluralia, indeclinables) y sus huecos son de CUATRO clases
// nombrables. Un gate que dijera «257» y nada más sería un gate apagado;
// éste dice de qué.
export type ClaseDeHueco = 'grafia-del-indeclinable' | 'grado-del-adjetivo'
  | 'perfectum-del-irregular' | 'grafia-del-pronombre' | 'heteroclito-conocido'
  | 'errata-del-corpus' | 'sin-clasificar';

// ── LAS ERRATAS DE LA FUENTE, EN FICHERO Y NO EN LA CABEZA ───────────
//
// El corpus tiene defectos propios y esta auditoría los encuentra una y
// otra vez. Sin una lista, cada sesión los vuelve a investigar desde cero:
// `voice` parece una forma latina rarísima hasta que uno se da cuenta de
// que es la palabra INGLESA dentro de un texto latino.
//
// Mismo patrón que `erratas-ro.json` para el OCR de la biblioteca rumana, y
// con la misma regla, que es la que le da valor: **una errata que ya no
// case se REPORTA, no se calla.** Si el corpus se corrige río arriba, o si
// cambia la normalización de este lado, hay que enterarse — una lista de
// excepciones que nadie revisa es una lista de excepciones falsas.
export interface ErrataDelCorpus {
  lema: string; forma: string; fichero: string; tokens: number;
  rasgos: string; deberiaSer: string; motivo: string;
}
const ERRATAS: ErrataDelCorpus[] = JSON.parse(
  fs.readFileSync(`${import.meta.dirname}/erratas-corpus-la.json`, 'utf8'),
) as ErrataDelCorpus[];

const esErrata = (lema: string, forma: string) =>
  ERRATAS.some((e) => sinM(e.lema) === sinM(lema) && sinM(e.forma) === sinM(forma));

/** Las erratas declaradas que YA NO aparecen como hueco. Cero es lo sano;
 *  cualquier otra cosa es que la lista se ha quedado vieja y hay que
 *  mirarla, no borrarla en silencio. */
export function erratasQueYaNoCasan(): ErrataDelCorpus[] {
  const huecos = new Set(auditar().map((h) => `${sinM(h.lema)}|${sinM(h.forma)}`));
  return ERRATAS.filter((e) => !huecos.has(`${sinM(e.lema)}|${sinM(e.forma)}`));
}

/** Indeclinables y partículas cuya grafía alterna en el corpus: `ab`/`ā`,
 *  `atque`/`ac`, `neque`/`nec`, `ex`/`ē`, `ut`/`utī`. El lexicón guarda una
 *  y el corpus trae las dos. */
const GRAFIA_INDECLINABLE = new Set(['ab', 'atque', 'que', 'neque', 'ut', 'ex', 'ad', 'cum', 'sed', 'et', 'in', 'de']);
/** LA MÁQUINA NO TIENE GRADO, y eso no es un fallo sino un área del
 *  currículo que aún no está construida. La primera versión de esta clase
 *  listaba sólo los supletivos —`magnus/maior`, `bonus/melior`— y dejaba
 *  fuera el comparativo REGULAR, que es mecánico y era el grueso del
 *  residuo: `gravius`, `fortior`, `longiorem`, `miserrima`, `utilior`,
 *  `amicissimum`, `acriore`. Acotar una clase por una lista de lemas cuando
 *  el fenómeno es morfológico es mover el agujero.
 *
 *  Se detecta por la MARCA, que es lo que el fenómeno tiene: `-ior`/`-ius`
 *  el comparativo, `-issim-`/`-errim-`/`-illim-` el superlativo. */
const GRADO_SUPLETIVO = new Set(['magnus', 'parvus', 'bonus', 'malus', 'multus']);
// La marca por SUFIJO se descartó: adivinaba. `-ius` es comparativo neutro
// en `gravius` y terminación corriente en `fīlius`, y acotarlo por una
// lista de lemas era mover el agujero. El treebank YA LO DICE —`Degree=Cmp`,
// `Degree=Sup`— y esa anotación es una fuente de otra clase, no una
// reescritura de la misma regla.
const gradoAnotado = (rasgos = '') => /Degree=(Cmp|Sup|Abs)/.test(rasgos);
/** Formas que el lexicón declara aparte o que son irregularidades léxicas
 *  conocidas, cada una con su motivo. */
const HETEROCLITOS: Record<string, string> = {
  locus: '«loca» es el plural NEUTRO de un masculino: heteróclito, y es el hueco que la auditoría nombra desde el principio',
  caelum: '«caelōs» es plural masculino de un neutro, y en la Vulgata es la forma corriente',
  deus: '«diī»/«dī» son variantes del nominativo plural, declaradas en IRREGULARES',
  domus: '«domī» es el LOCATIVO, que vive en `LOCATIVO_DOMUS` y no en el paradigma',
};
/** Los irregulares traen infectum en tabla; su perfectum sale del tema de
 *  perfecto, que `irregulares.ts` declara y la máquina general conjuga. */
const IRREGULAR = new Set(['possum', 'volo', 'nolo', 'malo', 'fero', 'eo', 'fio', 'sum',
  'prosum', 'desum', 'absum', 'adsum', 'intersum', 'praesum', 'supersum', 'obsum',
  // `do` entra el 2026-09-12: su tabla de irregular guarda el infectum y su
  // perfectum sale del tema `ded-`, igual que el de los otros. `dedit` ×103.
  'do']);
const PRONOMBRE = new Set(['is', 'hic', 'ille', 'qui', 'ipse', 'idem', 'iste']);

export function claseDeHueco(lema: string, rasgos = '', forma = ''): ClaseDeHueco {
  const l = lema.normalize('NFC').toLowerCase();
  if (forma && esErrata(lema, forma)) return 'errata-del-corpus';
  if (GRAFIA_INDECLINABLE.has(l)) return 'grafia-del-indeclinable';
  if (GRADO_SUPLETIVO.has(l) || gradoAnotado(rasgos)) return 'grado-del-adjetivo';
  if (IRREGULAR.has(l)) return 'perfectum-del-irregular';
  if (PRONOMBRE.has(l)) return 'grafia-del-pronombre';
  if (HETEROCLITOS[l]) return 'heteroclito-conocido';
  return 'sin-clasificar';
}

/** Los huecos agrupados por clase, con sus tokens. Lo que hay que vigilar
 *  es `sin-clasificar`: las otras cuatro están explicadas y acotadas. */
export function huecosPorClase(): Record<ClaseDeHueco, { entradas: number; tokens: number }> {
  const out = {} as Record<ClaseDeHueco, { entradas: number; tokens: number }>;
  for (const h of auditar()) {
    const c = claseDeHueco(h.lema ?? '', h.rasgos ?? '', h.forma ?? '');
    (out[c] ??= { entradas: 0, tokens: 0 }).entradas++;
    out[c]!.tokens += (h as unknown as { n?: number }).n ?? 1;
  }
  return out;
}

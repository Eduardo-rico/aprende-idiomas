// lib/data/languages/la/pronombres-la.ts
//
// LOS PRONOMBRES, Y LA MARCA QUE LOS SEPARA DE LOS NOMBRES.
//
// ── POR QUÉ UNA TABLA Y NO CINCO ENTRADAS SUELTAS ────────────────────
//
// La estructura la elige el PUNTO, no la comodidad de guardarlo. Y aquí
// hay un hecho medido que ninguna entrada suelta puede expresar:
//
//     genitivo singular en `-īus` y dativo en `-ī`, para TODOS
//
//     eius 929 · eī 482 · illī 462 · cui 123 · ipsī 123 · cuius 111 ·
//     huius 94 · illīus 73 · huic 66 · ipsīus 52 · tōtīus 32 · ūnīus 26
//
//     2.603 formas = el 1,1 % del corpus
//
// Es la **declinación pronominal**: seis series que comparten dos casillas,
// o sea seis paradigmas que se memorizan como uno. Con entradas sueltas,
// «comparten paradigma» sería una frase en un comentario que se
// desincroniza en silencio — ya van varias así. Con tabla, toda divergencia
// hay que declararla, y eso da gratis el invariante que caza la errata.
//
// ── LO QUE ESTA MARCA **NO** ES, MEDIDO ──────────────────────────────
//
// La primera versión de este comentario decía que la marca «es lo que separa
// un pronombre de un nombre», y era falso por partida triple. El latinista
// adversarial lo tumbó y yo lo verifiqué por mi cuenta contra el corpus:
//
//   · **el dativo en `-ī` no señala nada.** Es también el dativo singular de
//     TODA la 3.ª declinación. De las 17.872 formas del corpus acabadas en
//     `-i`, sólo 989 son un dativo de esta serie: precisión **5,5 %**, y
//     **32,3 %** aun restringiéndose ya a los dativos singulares. Los tres
//     no pronominales más frecuentes son `mihi` ×727, `tibi` ×418 y
//     `sibi` ×90 — los personales, que NO entran en este sistema.
//
//   · **el genitivo en `-īus` es una moneda al aire.** 2.668 formas del
//     corpus acaban en `-ius` y sólo 1.428 son de la serie: precisión
//     **53,5 %**. Y el primero de los otros es `fīlius` ×162, que es
//     exactamente el error de lectura real —leer `-ius` como NOMINATIVO— y
//     que no es el que yo había nombrado.
//
//   · **la clase no es «pronombre».** La marca la llevan también adjetivos y
//     numerales: `ūnīus`, `tōtīus`, `alterīus`, `nūllīus`. El nombre correcto
//     de la clase es *declinación pronominal*, no *los pronombres*.
//
// O sea: esto es economía de memoria para PRODUCIR seis paradigmas, no una
// pista para RECONOCER una forma al leer. Se escribe aquí porque la
// afirmación contraria estuvo a punto de irse en un mensaje de commit como
// titular.
//
// ── LO REGULAR Y LO QUE NO ───────────────────────────────────────────
//
// `ille`, `iste` e `ipse` siguen la tabla entera desde su tema. `is`,
// `hic` y `quī` divergen, y sus divergencias van ESCRITAS una a una en
// vez de resueltas con una regla que las tape.
import type { Caso, Numero } from './paradigma-la';

export type GeneroPron = 'm' | 'f' | 'n';
export type CeldaPron = `${GeneroPron}.${Caso}.${Numero}`;

/** La declinación pronominal, sobre el tema. Las dos marcas propias son el
 *  genitivo y el dativo del singular; el resto sigue la 1.ª y la 2.ª. */
const PRONOMINAL: Record<CeldaPron, string> = {
  'm.nom.sg': 'e', 'm.ac.sg': 'um', 'm.gen.sg': 'īus', 'm.dat.sg': 'ī', 'm.abl.sg': 'ō', 'm.voc.sg': 'e',
  'f.nom.sg': 'a', 'f.ac.sg': 'am', 'f.gen.sg': 'īus', 'f.dat.sg': 'ī', 'f.abl.sg': 'ā', 'f.voc.sg': 'a',
  'n.nom.sg': 'ud', 'n.ac.sg': 'ud', 'n.gen.sg': 'īus', 'n.dat.sg': 'ī', 'n.abl.sg': 'ō', 'n.voc.sg': 'ud',
  'm.nom.pl': 'ī', 'm.ac.pl': 'ōs', 'm.gen.pl': 'ōrum', 'm.dat.pl': 'īs', 'm.abl.pl': 'īs', 'm.voc.pl': 'ī',
  'f.nom.pl': 'ae', 'f.ac.pl': 'ās', 'f.gen.pl': 'ārum', 'f.dat.pl': 'īs', 'f.abl.pl': 'īs', 'f.voc.pl': 'ae',
  'n.nom.pl': 'a', 'n.ac.pl': 'a', 'n.gen.pl': 'ōrum', 'n.dat.pl': 'īs', 'n.abl.pl': 'īs', 'n.voc.pl': 'a',
};

export interface EntradaPronombre {
  /** Con qué se le nombra: `ille`, `is`, `quī`. */
  lema: string;
  tema: string;
  glosa: string;
  /** Las celdas que NO siguen la tabla, una a una y con su forma. Un
   *  pronombre sin excepciones declaradas sigue la tabla entera, y eso es
   *  una afirmación comprobable, no un supuesto. */
  excepciones?: Partial<Record<CeldaPron, string>>;
  /** Por qué diverge, cuando diverge. */
  porQueDiverge?: string;
}

export const PRONOMBRES_L1: EntradaPronombre[] = [
  // ── Los tres que siguen la tabla entera ──
  { lema: 'ille', tema: 'ill', glosa: 'aquel; en la Vulgata, «él»' },
  { lema: 'iste', tema: 'ist', glosa: 'ese' },
  { lema: 'ipse', tema: 'ips', glosa: 'él mismo; en la Vulgata, «él»',
    excepciones: { 'n.nom.sg': 'ipsum', 'n.ac.sg': 'ipsum', 'n.voc.sg': 'ipsum' },
    porQueDiverge: 'el neutro singular es «ipsum» y no *«ipsud»: es la única celda en que se aparta de `ille`' },

  // ── `is`: el tema alterna entre `e-` e `i-` ──
  { lema: 'is', tema: 'e', glosa: 'él, ella, ello; ese',
    excepciones: {
      'm.nom.sg': 'is', 'n.nom.sg': 'id', 'n.ac.sg': 'id', 'n.voc.sg': 'id',
      'm.voc.sg': 'is', 'm.gen.sg': 'eius', 'f.gen.sg': 'eius', 'n.gen.sg': 'eius',
      'm.dat.sg': 'eī', 'f.dat.sg': 'eī', 'n.dat.sg': 'eī',
      'm.nom.pl': 'iī', 'm.voc.pl': 'iī', 'm.dat.pl': 'eīs', 'm.abl.pl': 'eīs',
      'f.dat.pl': 'eīs', 'f.abl.pl': 'eīs', 'n.dat.pl': 'eīs', 'n.abl.pl': 'eīs',
    },
    porQueDiverge: 'el tema alterna `e-`/`i-` y el nominativo masculino es «is», no *«eus». El genitivo «eius» (929 apariciones, el más frecuente del corpus) sirve para los TRES géneros, que es lo que su punto declara examinar. La alternancia no es libre y va CELDA A CELDA, medida en el corpus que el alumno lee: nominativo plural «iī» ×32 contra «eī» ×1, pero dativo plural «eīs» ×247 contra «iīs» ×34. Las gramáticas dan las dos por buenas en ambas celdas; aquí manda la lectura declarada, y el contraste contra la anotación del treebank es lo que corrigió mi «eī» de manual' },

  // ── `hic`: el más irregular, con la partícula `-c` pegada ──
  { lema: 'hic', tema: 'h', glosa: 'este',
    excepciones: {
      'm.nom.sg': 'hic', 'f.nom.sg': 'haec', 'n.nom.sg': 'hoc',
      'm.ac.sg': 'hunc', 'f.ac.sg': 'hanc', 'n.ac.sg': 'hoc',
      'm.gen.sg': 'huius', 'f.gen.sg': 'huius', 'n.gen.sg': 'huius',
      'm.dat.sg': 'huic', 'f.dat.sg': 'huic', 'n.dat.sg': 'huic',
      'm.abl.sg': 'hōc', 'f.abl.sg': 'hāc', 'n.abl.sg': 'hōc',
      'm.voc.sg': 'hic', 'f.voc.sg': 'haec', 'n.voc.sg': 'hoc',
      'm.nom.pl': 'hī', 'f.nom.pl': 'hae', 'n.nom.pl': 'haec',
      'm.ac.pl': 'hōs', 'f.ac.pl': 'hās', 'n.ac.pl': 'haec',
      'm.gen.pl': 'hōrum', 'f.gen.pl': 'hārum', 'n.gen.pl': 'hōrum',
      'm.dat.pl': 'hīs', 'f.dat.pl': 'hīs', 'n.dat.pl': 'hīs',
      'm.abl.pl': 'hīs', 'f.abl.pl': 'hīs', 'n.abl.pl': 'hīs',
      'm.voc.pl': 'hī', 'f.voc.pl': 'hae', 'n.voc.pl': 'haec',
    },
    porQueDiverge: 'lleva pegada la partícula deíctica `-c` y el tema queda en `h-`: casi ninguna celda sale de la tabla. Se guarda entero porque una regla que lo cubriera dejaría de ser la declinación pronominal' },

  // ── El relativo ──
  { lema: 'quī', tema: 'qu', glosa: 'que, el cual',
    excepciones: {
      'm.nom.sg': 'quī', 'f.nom.sg': 'quae', 'n.nom.sg': 'quod',
      'm.ac.sg': 'quem', 'f.ac.sg': 'quam', 'n.ac.sg': 'quod',
      'm.gen.sg': 'cuius', 'f.gen.sg': 'cuius', 'n.gen.sg': 'cuius',
      'm.dat.sg': 'cui', 'f.dat.sg': 'cui', 'n.dat.sg': 'cui',
      'm.voc.sg': 'quī', 'f.voc.sg': 'quae', 'n.voc.sg': 'quod',
      'm.nom.pl': 'quī', 'n.nom.pl': 'quae',
      'n.ac.pl': 'quae', 'm.voc.pl': 'quī', 'n.voc.pl': 'quae',
      'm.dat.pl': 'quibus', 'f.dat.pl': 'quibus', 'n.dat.pl': 'quibus',
      'm.abl.pl': 'quibus', 'f.abl.pl': 'quibus', 'n.abl.pl': 'quibus',
    },
    porQueDiverge: 'el genitivo y el dativo van con tema `cu-` («cuius» 111, «cui» 123) y el dativo-ablativo plural es «quibus». Conserva la marca pronominal —`-ius`, `-i`— con otro tema, que es lo que lo emparenta con los demás' },
];

export function declinarPronombre(e: EntradaPronombre, g: GeneroPron, caso: Caso, num: Numero): string {
  const celda = `${g}.${caso}.${num}` as CeldaPron;
  const exc = e.excepciones?.[celda];
  if (exc) return exc;
  return e.tema + PRONOMINAL[celda];
}

export function paradigmaPronombre(e: EntradaPronombre): Record<string, string> {
  const out: Record<string, string> = {};
  for (const g of ['m', 'f', 'n'] as GeneroPron[])
    for (const num of ['sg', 'pl'] as Numero[])
      for (const caso of ['nom', 'ac', 'gen', 'dat', 'abl', 'voc'] as Caso[])
        out[`${g}.${caso}.${num}`] = declinarPronombre(e, g, caso, num);
  return out;
}

/** La marca compartida por las seis series: genitivo en `-īus` y dativo en
 *  `-ī`, con el tema que sea.
 *
 *  ES UN INVARIANTE DE LA TABLA, NO UNA PISTA DE LECTURA. Sirve para que
 *  ninguna entrada se salga del sistema sin declararlo; NO sirve para
 *  reconocer un pronombre en un texto, porque medido contra el corpus acierta
 *  el 5,5 % en el dativo y el 53,5 % en el genitivo. Ver el aviso de arriba
 *  antes de usarla para otra cosa. */
export function llevaMarcaPronominal(e: EntradaPronombre): boolean {
  const gen = declinarPronombre(e, 'm', 'gen', 'sg');
  const dat = declinarPronombre(e, 'm', 'dat', 'sg');
  return /(īus|ius)$/.test(gen) && /(ī|i|ic)$/.test(dat);
}

// ── EL CONTRASTE CONTRA EL CORPUS ────────────────────────────────────
//
// La tabla de arriba está escrita a mano. Releerla es darse la razón a uno
// mismo, así que se contrasta contra un camino de otra naturaleza: los
// rasgos `Case`/`Number`/`Gender` que puso quien anotó el treebank. Si me
// equivoqué en una celda, la anotación no se equivoca conmigo.

/** Sin macrones y con la ortografía del corpus (`u`/`i` por `v`/`j`). */
export function comoElCorpus(f: string): string {
  return f.normalize('NFD').replace(/[̄̆]/g, '').normalize('NFC')
    .toLowerCase().replace(/j/g, 'i').replace(/v/g, 'u');
}

export interface DesajustePronominal {
  lema: string; celda: string; miTabla: string;
  elCorpus: { forma: string; n: number }[];
}

/** Contrasta cada celda contra las formas atestiguadas con esos mismos
 *  rasgos. `umbral` deja fuera las celdas con poca evidencia.
 *
 *  `minimoParaValer` existe porque el control positivo lo exigió: envenenar
 *  el dativo de `ille` a «illō» NO se detectaba, porque la celda trae
 *  `illi ×272` y `illo ×1`, y aceptar mi forma por estar atestiguada «alguna
 *  vez» deja que UN desliz del anotador entre 273 bendiga cualquier invento.
 *
 *  El corte no se adivina, se midió: de las 30 celdas con más de una forma,
 *  TODO el ruido aparece exactamente 1 vez (illo ×1, hoc ×1, ipsum ×1,
 *  ilium ×1) y toda variante real llega a 2 o más (quoius ×3, iis ×34,
 *  hii ×67, huiusce ×4). Pedir dos apariciones cae en el hueco. */
export function contrastarConCorpus(
  celdasDelCorpus: Record<string, Record<string, number>>,
  umbral = 3,
  minimoParaValer = 2,
): { desajustes: DesajustePronominal[]; comprobadas: number; sinEvidencia: string[] } {
  const desajustes: DesajustePronominal[] = [];
  const sinEvidencia: string[] = [];
  let comprobadas = 0;
  for (const e of PRONOMBRES_L1) {
    const clave = comoElCorpus(e.lema);
    for (const [celda, mia] of Object.entries(paradigmaPronombre(e))) {
      const atest = celdasDelCorpus[`${clave}|${celda}`];
      const total = atest ? Object.values(atest).reduce((a, b) => a + b, 0) : 0;
      if (!atest || total < umbral) { sinEvidencia.push(`${e.lema} ${celda}`); continue; }
      comprobadas++;
      const formas = Object.entries(atest).map(([forma, n]) => ({ forma, n }));
      // Basta con que mi forma sea UNA de las atestiguadas: el corpus trae
      // variantes gráficas reales (`ii`/`ei`, `quis`/`quibus`) que no son
      // errores míos.
      if (!formas.some((f) => f.forma === comoElCorpus(mia) && f.n >= minimoParaValer))
        desajustes.push({ lema: e.lema, celda, miTabla: mia, elCorpus: formas.sort((a, b) => b.n - a.n) });
    }
  }
  return { desajustes, comprobadas, sinEvidencia };
}

/** Los casos que un pronombre tiene DE VERDAD. La tabla genera también el
 *  vocativo por completitud del tipo, pero un pronombre no se vocea: de las
 *  64 celdas sin evidencia en el corpus, 35 son justo esas. Generarlas y no
 *  marcarlas es dejar puesta una trampa —una forma que la máquina da y el
 *  corpus nunca respalda—, así que la lista de casos utilizables es esta y
 *  ningún ítem debe salirse de ella. */
export const CASOS_DE_PRONOMBRE: Caso[] = ['nom', 'ac', 'gen', 'dat', 'abl'];

export function esCeldaUsable(celda: string): boolean {
  return !celda.includes('.voc.');
}

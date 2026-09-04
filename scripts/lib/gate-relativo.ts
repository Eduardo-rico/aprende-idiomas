// scripts/lib/gate-relativo.ts
//
// GATE DEL RELATIVO. Punto: `l4-relativo`.
//
// La regla de dos mitades: género y número vienen DE FUERA (del antecedente),
// el caso viene DE DENTRO (de la función en su propia oración). El español
// tiene «que» invariable, así que el alumno no lee la forma del relativo.
//
// ── EL SUELO QUE PONE LA LENGUA ──────────────────────────────────────
//
// Este es el tercer punto donde aparece la misma figura, y conviene
// nombrarla: hay un suelo de acierto ciego que **no lo pone el diseño del
// ítem sino la lengua**, y contra el que no hay ítem que valga.
//
//   · en el ablativo, tres funciones latinas comparten preposición española;
//   · en rumano, el artículo enclítico y el clítico son los mismos segmentos;
//   · aquí, el sincretismo del relativo.
//
// La salida no es bajar el techo ni fingir que no está: es **medir
// exactamente qué parte de la respuesta regala y construir el contraste en
// lo que no regala**.
//
// Medido celda a celda sobre las 30 usables del relativo — una celda mide la
// mitad de fuera si cambiar género o número (dejando el caso) cambia la
// forma, y la de dentro si cambiar el caso (dejando género y número) la
// cambia:
//
//     ✓✓ miden las DOS mitades      6
//     ✓· sólo la de fuera           3
//     ·✓ sólo la de dentro         14
//     ·· ninguna de las dos         7
//
// Y por los tres casos que el `varia` del punto EXIGE cubrir:
//
//     nom  NINGUNA celda mide las dos mitades
//     ac   quem (m.sg) · quōs (m.pl) · quam (f.sg) · quās (f.pl)
//     gen  quārum (f.pl), y sólo esa
//
// `quī` sirve para masculino singular y plural; `quae` para femenino
// singular, femenino plural y neutro plural; `quod` para nominativo y
// acusativo neutros; `cuius` para los tres géneros. Así que el punto pide
// cubrir un caso —el nominativo— en el que **regala media regla por la forma
// del paradigma**, no por cómo se escriba el ítem.
//
// La decisión tomada es declarar la asimetría como CONTENIDO: cada ítem dice
// cuál de las dos mitades examina, el lote debe traer las dos, y ningún ítem
// puede acreditarse una mitad que su celda no puede medir. Que en `cuius` el
// género no se lea no es una limitación del ejercicio: es lo que el alumno
// necesita saber cuando se encuentre un `cuius` y tenga que sacar el género
// del contexto.
import {
  PRONOMBRES_L1, paradigmaPronombre, declinarPronombre, CASOS_DE_PRONOMBRE,
  type GeneroPron,
} from '../../lib/data/languages/la/pronombres-la';
import type { Caso, Numero } from '../../lib/data/languages/la/paradigma-la';
import { separablePorPosicion } from './atajos';
import { revisarCobertura, type Cobertura } from './cobertura';

const QUI = PRONOMBRES_L1.find((e) => e.lema === 'quī')!;
const PARADIGMA = paradigmaPronombre(QUI);
const GENEROS: GeneroPron[] = ['m', 'f', 'n'];
const NUMEROS: Numero[] = ['sg', 'pl'];

export type Mitad = 'fuera' | 'dentro';

/** Qué mitades puede medir UNA celda. No es opinión: se calcula moviendo el
 *  rasgo y mirando si la forma cambia. */
export function mitadesQueMide(g: GeneroPron, caso: Caso, num: Numero): Mitad[] {
  const f = PARADIGMA[`${g}.${caso}.${num}`];
  let fuera = true, dentro = true;
  for (const g2 of GENEROS) for (const n2 of NUMEROS)
    if ((g2 !== g || n2 !== num) && PARADIGMA[`${g2}.${caso}.${n2}`] === f) fuera = false;
  for (const c2 of CASOS_DE_PRONOMBRE)
    if (c2 !== caso && PARADIGMA[`${g}.${c2}.${num}`] === f) dentro = false;
  const out: Mitad[] = [];
  if (fuera) out.push('fuera');
  if (dentro) out.push('dentro');
  return out;
}

export interface ItemRelativo {
  id: string;
  punto: string;
  /** El marco latino con `___` donde va el relativo. */
  marco: string;
  /** El antecedente, con los rasgos que impone DE FUERA. */
  antecedente: { forma: string; glosa: string; genero: GeneroPron; numero: Numero };
  /** El caso que le toca al relativo por su función DENTRO de su oración. */
  caso: Caso;
  /** El caso en que va el ANTECEDENTE. Es el eje de la estrategia ciega
   *  «copiar el caso de fuera», y por eso va declarado y no deducido. */
  casoDelAntecedente: Caso;
  /** La forma, escrita a mano y contrastada contra la tabla. */
  respuesta: string;
  glosa: string;
  pista: string;
  ejes: {
    /** Qué mitad se acredita este ítem. Se contrasta contra `mitadesQueMide`:
     *  un ítem no puede cobrar una mitad que su celda no distingue. */
    examina: Mitad[];
    /** Por qué la celda no mide la otra mitad, cuando no la mide. Obliga a
     *  escribirlo en vez de dejarlo pasar en silencio. */
    porQueNoLaOtra?: string;
    /** Un ítem que NO MIDE NADA y aun así se queda, porque enseña el
     *  sincretismo en vez de examinarlo. Es la única excusa admitida, tiene
     *  que estar escrita, y la cobertura los cuenta aparte para que nunca se
     *  confundan con los que sí miden. Sin este campo, un ítem que no mide
     *  nada es un hallazgo. */
    enseñaSinMedir?: { motivo: string };
  };
}

export type ClaseFalloRel =
  | 'respuesta-no-derivada'
  | 'antecedente-no-concuerda'
  | 'mitad-que-la-celda-no-mide'
  | 'item-que-no-mide-nada'
  | 'mitad-no-declarada'
  | 'silencio-sobre-la-otra-mitad'
  | 'falta-una-mitad-en-el-lote'
  | 'caso-sin-cubrir'
  | 'sobre-el-piso-de-la-lengua'
  | 'orden-separable'
  | 'cobertura-cero'
  | 'cobertura-sin-motivo';

export interface FalloRel { item: string; clase: ClaseFalloRel; detalle: string }

// ── LAS DOS ESTRATEGIAS DE MEDIO ALUMNO ──────────────────────────────
//
// No son inventos: son exactamente los dos alumnos que el punto teme. El que
// sólo hace la mitad de fuera copia género y número del antecedente y le pone
// el caso del antecedente encima; el que sólo hace la de dentro acierta el
// caso y da por hecho el masculino singular.

export function soloLaMitadDeFuera(it: ItemRelativo): string {
  return declinarPronombre(QUI, it.antecedente.genero, it.casoDelAntecedente, it.antecedente.numero);
}

export function soloLaMitadDeDentro(it: ItemRelativo): string {
  return declinarPronombre(QUI, 'm', it.caso, 'sg');
}

// ── LA TERCERA FUGA: LA GLOSA ESPAÑOLA ───────────────────────────────
//
// El punto se apoya en que el español tiene «que» invariable, y por eso la
// traducción no delata nada. Pero eso **sólo es verdad en dos casos**:
//
//   nom, ac  → «que», invariable: no dice ni el caso ni el género
//   gen      → «cuyo/cuya/cuyos/cuyas», que SÍ dice que hay posesión
//   dat, abl → «al que», «con el que»: la preposición dice el caso
//
// O sea que en el genitivo el español regala la mitad DE DENTRO, y hay que
// contarlo: un ítem de genitivo singular no mide nada en absoluto, porque
// `cuius` no distingue el género (mitad de fuera) y «cuyo» delata el caso
// (mitad de dentro). Es la misma figura del suelo que pone la lengua, sólo
// que aquí la pone la lengua DE PARTIDA y no la de llegada.
//
// Y todavía peor de lo que parece: «cuyo» concuerda en español con lo
// POSEÍDO, mientras `cuius`/`quārum` concuerdan con el antecedente. En
// «las niñas cuyas rosas veo», el español dice femenino plural por «rosas»
// y el latín dice femenino plural por «puellae»: coinciden por casualidad.

const CASOS_QUE_EL_ESPANOL_DELATA: Caso[] = ['gen', 'dat', 'abl'];

/** ¿La traducción española regala el caso? Depende del caso y de nada más:
 *  es una propiedad del par de lenguas, no de cómo se escriba el ítem. */
export function elEspanolRegalaElCaso(it: ItemRelativo): boolean {
  return CASOS_QUE_EL_ESPANOL_DELATA.includes(it.caso);
}

/** Las mitades que el ítem mide DE VERDAD: las que el paradigma latino
 *  distingue, menos las que la traducción española ya ha entregado. Es esta
 *  —y no `mitadesQueMide`— la que decide si un ítem sirve. */
export function mitadesQueMideDeVerdad(it: ItemRelativo): Mitad[] {
  const latinas = mitadesQueMide(it.antecedente.genero, it.caso, it.antecedente.numero);
  return elEspanolRegalaElCaso(it) ? latinas.filter((m) => m !== 'dentro') : latinas;
}

const norm = (s: string) => s.normalize('NFC').trim().toLowerCase();

/** EL PISO QUE PONE LA LENGUA. Para cada estrategia de medio alumno, la
 *  fracción de ítems que acierta **sin ejercer la mitad que le falta**,
 *  porque el sincretismo se la regala. Contra este número se compara la tasa
 *  real: si la tasa lo iguala, el lote no mide nada por encima de lo que la
 *  lengua ya daba; si lo supera, hay una fuga añadida por el diseño. */
export function pisoDeLaLengua(items: ItemRelativo[]): { fuera: number; dentro: number } {
  const n = items.length || 1;
  let fuera = 0, dentro = 0;
  for (const it of items) {
    const mide = mitadesQueMideDeVerdad(it);
    // Al que no hace la mitad de dentro, la celda se la regala si no la mide.
    if (!mide.includes('dentro')) fuera++;
    if (!mide.includes('fuera')) dentro++;
  }
  return { fuera: fuera / n, dentro: dentro / n };
}

export function tasasDeMedioAlumno(items: ItemRelativo[]): { fuera: number; dentro: number } {
  const n = items.length || 1;
  return {
    fuera: items.filter((it) => norm(soloLaMitadDeFuera(it)) === norm(it.respuesta)).length / n,
    dentro: items.filter((it) => norm(soloLaMitadDeDentro(it)) === norm(it.respuesta)).length / n,
  };
}

/** Margen sobre el piso. No es un techo elegido: el piso lo pone la lengua y
 *  esto sólo tolera el azar de que una celda coincida por otra vía. */
export const MARGEN_SOBRE_EL_PISO = 0.15;

export function revisarItemRelativo(it: ItemRelativo): FalloRel[] {
  const out: FalloRel[] = [];
  const push = (clase: ClaseFalloRel, detalle: string) => out.push({ item: it.id, clase, detalle });

  const dela = declinarPronombre(QUI, it.antecedente.genero, it.caso, it.antecedente.numero);
  if (norm(dela) !== norm(it.respuesta))
    push('respuesta-no-derivada', `la tabla da «${dela}» y el ítem escribe «${it.respuesta}»`);

  if (!it.marco.includes('___')) push('respuesta-no-derivada', 'el marco no tiene hueco');

  const mide = mitadesQueMideDeVerdad(it);
  if (it.ejes.examina.length === 0 && !it.ejes.enseñaSinMedir)
    push('mitad-no-declarada', 'no dice qué mitad examina ni declara que enseñe sin medir');
  for (const m of it.ejes.examina)
    if (!mide.includes(m)) {
      const porLaGlosa = m === 'dentro' && elEspanolRegalaElCaso(it)
        && mitadesQueMide(it.antecedente.genero, it.caso, it.antecedente.numero).includes('dentro');
      push('mitad-que-la-celda-no-mide',
        porLaGlosa
          ? `se acredita «dentro» pero el ${it.caso} se traduce con «cuyo» o con preposición: la glosa española ya ha dicho el caso antes de que el alumno mire el latín`
          : `se acredita «${m}» pero «${it.respuesta}» (${it.antecedente.genero}.${it.caso}.${it.antecedente.numero}) no la distingue: ${
              m === 'fuera' ? 'la misma forma vale para otro género o número' : 'la misma forma vale para otro caso'}`);
    }

  if (mide.length === 0 && !it.ejes.enseñaSinMedir)
    push('item-que-no-mide-nada',
      `«${it.respuesta}» (${it.antecedente.genero}.${it.caso}.${it.antecedente.numero}): el latín no distingue la mitad de fuera y el español ya ha regalado la de dentro. El ítem está bien escrito y no examina nada`);

  if (it.ejes.enseñaSinMedir && it.ejes.examina.length > 0)
    push('mitad-no-declarada',
      `dice que enseña sin medir y a la vez se acredita «${it.ejes.examina.join(', ')}»: o una cosa o la otra`);

  const faltan = (['fuera', 'dentro'] as Mitad[]).filter((m) => !it.ejes.examina.includes(m));
  if (faltan.length > 0 && !it.ejes.porQueNoLaOtra && !it.ejes.enseñaSinMedir)
    push('silencio-sobre-la-otra-mitad', `no examina «${faltan.join(', ')}» y no dice por qué`);

  return out;
}

export function revisarLoteRelativo(items: ItemRelativo[]): {
  fallos: FalloRel[];
  piso: { fuera: number; dentro: number };
  tasas: { fuera: number; dentro: number };
  cobertura: Cobertura[];
} {
  const fallos = items.flatMap(revisarItemRelativo);
  const push = (clase: ClaseFalloRel, detalle: string) => fallos.push({ item: '(lote)', clase, detalle });

  for (const m of ['fuera', 'dentro'] as Mitad[])
    if (!items.some((it) => it.ejes.examina.includes(m)))
      push('falta-una-mitad-en-el-lote', `ningún ítem examina la mitad de «${m}»`);

  // El `varia` del punto exige nominativo, acusativo y genitivo.
  for (const c of ['nom', 'ac', 'gen'] as Caso[])
    if (!items.some((it) => it.caso === c))
      push('caso-sin-cubrir', `el punto exige cubrir «${c}» y el lote no lo trae`);

  const piso = pisoDeLaLengua(items);
  const tasas = tasasDeMedioAlumno(items);
  for (const m of ['fuera', 'dentro'] as Mitad[])
    if (tasas[m] > piso[m] + MARGEN_SOBRE_EL_PISO)
      push('sobre-el-piso-de-la-lengua',
        `el alumno que sólo hace la mitad de «${m}» saca ${(100 * tasas[m]).toFixed(0)} %, y el sincretismo sólo le regalaba ${(100 * piso[m]).toFixed(0)} %: la diferencia la pone el diseño`);

  // El eje que un alumno podría contar si el fichero se publicara agrupado:
  // qué ítems examinan las DOS mitades y cuáles sólo una.
  const sep = separablePorPosicion(items.map((it) => (it.ejes.examina.length === 2 ? 'A' : 'B')).join(''));
  if (sep) push('orden-separable', sep);

  const enteros = items.filter((it) => mitadesQueMideDeVerdad(it).length === 2).length;
  const ensenyan = items.filter((it) => it.ejes.enseñaSinMedir).length;
  const cobertura: Cobertura[] = [
    { comprobacion: 'la respuesta contra la tabla', decididos: items.length, total: items.length },
    { comprobacion: 'la mitad declarada contra la celda', decididos: items.length, total: items.length },
    { comprobacion: 'ítems que enseñan sin medir', decididos: ensenyan, total: items.length,
      motivoDeLosQueQuedanFuera: 'los que sí miden alguna mitad. Este renglón se lee al revés que los demás: aquí un número ALTO sería el problema' },
    { comprobacion: 'las celdas que miden la regla entera', decididos: enteros, total: items.length,
      motivoDeLosQueQuedanFuera:
        'los ítems cuya celda sólo distingue una mitad. No son un defecto que corregir: es el suelo que pone la lengua, y por eso el lote los declara y las estrategias de medio alumno se comparan contra ese piso en vez de contra un techo elegido' },
  ];
  fallos.push(...revisarCobertura(cobertura));

  return { fallos, piso, tasas, cobertura };
}

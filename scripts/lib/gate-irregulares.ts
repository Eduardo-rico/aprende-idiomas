// scripts/lib/gate-irregulares.ts — EL GATE DE LOS SEIS IRREGULARES.
//
// Punto `l5-irregulares`. `varia`: «el verbo y la persona, cubriendo las
// formas más irregulares y no sólo la 1.ª singular».
//
// ══ LO QUE DICE LA MÁQUINA, Y ES LA MITAD DEL GATE ═══════════════════
//
// Comparadas las 108 celdas de los seis verbos con lo que escribiría quien
// aplicara la regla general de la 3.ª al lema:
//
//   **35 de 108 refutan la regla. Y de esas 35, sólo 24 están
//   atestiguadas en el corpus.**
//
// La estructura de esas 35 dice sola cómo tiene que ser el lote:
//
//   · **la 1.ª del singular NO refuta nunca**, en ninguno de los seis: es
//     el lema, o sea la palabra que el alumno tiene delante. Un lote de
//     primeras personas no examina nada, que es exactamente lo que el
//     `varia` avisa al decir «y no sólo la 1.ª singular».
//   · **la 3.ª del plural tampoco**, en ninguno: las seis acaban en
//     `-unt`, que es lo que da la regla.
//   · **el imperfecto y el futuro son regulares en cinco de los seis.**
//     Sólo `eō` es irregular ahí, y lo es entero: 12 celdas de 12.
//
// Así que fuera de `eō` toda la irregularidad vive en el presente, en la
// 2.ª y 3.ª del singular y la 1.ª y 2.ª del plural.
//
// ══ Y LA OTRA MITAD: LA FORMA TIENE QUE EXISTIR ══════════════════════
//
// Once de esas 35 celdas no aparecen ni una vez en 227.301 tokens:
// `ītis`, `ībam`, `ībās`, `ībātis`, `ībitis`, `fertis`, `mālumus`,
// `māvultis`, `fīs`, `fīmus`, `fītis`. Son formas de manual. Enseñar una
// como respuesta es la cara simétrica de marcar como agramatical algo que
// no lo es, y este proyecto no hace ni lo uno ni lo otro sin fuente.
//
// El caso extremo es `fīō`: de sus cuatro celdas examinables, **sólo `fit`
// está atestiguada**. Un lote que le pidiera al alumno `fīmus` le estaría
// enseñando latín que nadie escribió.
//
// La cuenta viene congelada de `atestacion-irregulares.json`, porque los
// treebanks están en `.gitignore` y un gate que los leyera en caliente
// pasaría aquí y fallaría en cualquier otro sitio.
import { conjugarIrregular, type VerboIrregular } from '../../lib/data/languages/la/irregulares';
import type { Persona, Tiempo } from '../../lib/data/languages/la/paradigma-la';
import atestacion from '../../lib/data/languages/la/atestacion-irregulares.json';
import porAnalisis from '../../lib/data/languages/la/atestacion-por-analisis.json';
import { revisarCobertura, type Cobertura } from './cobertura';
import { separablePorPosicion } from './atajos';
import { patronDe } from './orden-publicado';

const POR_ANALISIS = (porAnalisis as { tabla: Record<string, Record<string, number>> }).tabla;
const comoVerbo = (f: string) =>
  (POR_ANALISIS[f]?.ind ?? 0) + (POR_ANALISIS[f]?.sub ?? 0) + (POR_ANALISIS[f]?.imp ?? 0);
const comoNombre = (f: string) => POR_ANALISIS[f]?.nominal ?? 0;

export interface CeldaAtestiguada { forma: string; n: number; regular: string; refuta: boolean }
const LEMAS = (atestacion as { lemas: Record<string, Record<string, CeldaAtestiguada>> }).lemas;

export function celdaDe(lema: string, tiempo: Tiempo, persona: Persona): CeldaAtestiguada | null {
  return LEMAS[lema]?.[`${tiempo}.${persona}`] ?? null;
}

export interface ItemIrregular {
  id: string;
  punto: string;
  verbo: VerboIrregular;
  persona: Persona;
  tiempo: Tiempo;
  /** Escrita a mano y contrastada contra la tabla. */
  respuesta: string;
  marco: string;
  pista: string;
  glosa: string;
  /** Obligatorio si la celda NO refuta la regla general: un ítem que se
   *  contesta con la regla no examina «guardar y no derivar», y si está
   *  ahí por otro motivo hay que escribirlo. */
  porQueSiNoRefuta?: string;
  /** Obligatorio si la forma no aparece en el corpus. */
  porQueSinAtestiguar?: string;
  /** Obligatorio si el marco lleva un pronombre personal sujeto. */
  porQueConPronombre?: string;
}

export type ClaseFalloI =
  | 'respuesta-no-derivable'
  | 'forma-sin-atestiguar'
  | 'celda-que-no-examina'
  | 'pista-regala-la-forma'
  | 'marco-mal'
  | 'pronombre-explicito'
  | 'celdas-repetidas'
  | 'varia-incompleto'
  | 'estrategia-ciega'
  | 'orden-separable'
  | 'cobertura-cero'
  | 'cobertura-sin-motivo';

export interface FalloI { item: string; clase: ClaseFalloI; detalle: string }

const norm = (s: string) => s.normalize('NFC').toLowerCase();

export function revisarItemIrregular(item: ItemIrregular): FalloI[] {
  const out: FalloI[] = [];
  const push = (clase: ClaseFalloI, detalle: string) => out.push({ item: item.id, clase, detalle });

  // EL SEGUNDO CAMINO: la respuesta a mano contra la tabla guardada.
  let deLaTabla = '';
  try { deLaTabla = conjugarIrregular(item.verbo, item.persona, item.tiempo); }
  catch (e) { push('respuesta-no-derivable', String(e)); }
  if (deLaTabla && norm(deLaTabla) !== norm(item.respuesta)) {
    push('respuesta-no-derivable', `la respuesta es «${item.respuesta}» y la tabla da «${deLaTabla}»`);
  }

  const celda = celdaDe(item.verbo.lema, item.tiempo, item.persona);
  if (!celda) {
    push('respuesta-no-derivable', `no hay celda ${item.tiempo}.${item.persona} de «${item.verbo.lema}» en la atestación congelada`);
    return out;
  }

  // LA FORMA TIENE QUE EXISTIR EN EL CORPUS.
  if (celda.n === 0 && (item.porQueSinAtestiguar ?? '').trim().length < 20) {
    push('forma-sin-atestiguar',
      `«${item.respuesta}» no aparece ni una vez en los 227.301 tokens: enseñarla como respuesta es enseñar latín de manual (y si hay motivo, hay que escribirlo)`);
  }
  // Y TIENE QUE EXISTIR COMO VERBO. `celda.n` cuenta la CADENA, y ahí `īs`
  // marcaba 72 apariciones de las que ninguna es el verbo: las 72 son el
  // pronombre `iīs`. La supleción de `nōlō` va en dos palabras y su cuenta
  // es un bigrama, que esta tabla —de un token por fila— no puede tener.
  else if (!item.respuesta.includes(' ') && (item.porQueSinAtestiguar ?? '').trim().length < 20) {
    if (comoVerbo(item.respuesta) === 0)
      push('forma-sin-atestiguar',
        `«${item.respuesta}» sale ${celda.n} vez/veces pero NINGUNA como verbo: la cadena está atestiguada y la forma no`);
    else if (comoNombre(item.respuesta) > comoVerbo(item.respuesta))
      push('forma-sin-atestiguar',
        `«${item.respuesta}» sale ${comoNombre(item.respuesta)} vez/veces como nombre y sólo ${comoVerbo(item.respuesta)} como verbo`);
  }

  // UNA CELDA QUE NO REFUTA LA REGLA NO EXAMINA ESTE PUNTO.
  if (!celda.refuta && (item.porQueSiNoRefuta ?? '').trim().length < 20) {
    push('celda-que-no-examina',
      `«${item.respuesta}» es exactamente lo que da la regla general («${celda.regular}»): el ítem se contesta sin saber que el verbo es irregular`);
  }

  for (const [donde, txt] of [['la pista', item.pista], ['la glosa', item.glosa], ['el marco', item.marco]] as const) {
    if (norm(txt).includes(norm(item.respuesta))) push('pista-regala-la-forma', `${donde} contiene «${item.respuesta}»`);
  }
  // Ni el lema, que es lo que se le enseña junto al infinitivo.
  if (norm(item.marco).replace('___', '').includes(norm(item.verbo.lema))) {
    push('pista-regala-la-forma', `el marco lleva el lema «${item.verbo.lema}»`);
  }
  if (!item.marco.includes('___')) push('marco-mal', 'el marco latino no tiene hueco `___`');

  // ── EL PRONOMBRE SUJETO, QUE NO ES UN DETALLE DE ESTILO ──
  //
  // Salió del pase adversarial sobre este mismo lote, ya verde: tres marcos
  // míos decían `Tū corpus ___`, `Nōs gaudium ___`, `Vōs lēgem ___`. Es
  // latín gramatical, pero el curso tiene un punto entero —`l5-pro-drop`—
  // que enseña que el latín NO pone esos pronombres salvo para contrastar.
  // Un lote que los modela como neutros le enseña al alumno la costumbre
  // que otro punto le va a quitar, y además le regala la persona sin que
  // tenga que leer la desinencia, que es lo único que este punto examina.
  {
    const pron = ['ego', 'tū', 'nōs', 'vōs'];
    const hay = pron.filter((q) => new RegExp(`(?<!\\p{L})${q}(?!\\p{L})`, 'iu').test(item.marco.normalize('NFC')));
    if (hay.length > 0 && (item.porQueConPronombre ?? '').trim().length < 20) {
      push('pronombre-explicito',
        `el marco lleva «${hay.join('», «')}»: el latín no pone el pronombre sujeto salvo para contrastar (l5-pro-drop), y aquí además regala la persona que la desinencia tenía que dar`);
    }
  }
  return out;
}

export function coberturaIrregulares(items: ItemIrregular[]): Cobertura[] {
  const n = items.length;
  const conCelda = items.filter((i) => celdaDe(i.verbo.lema, i.tiempo, i.persona) !== null);
  const refutan = conCelda.filter((i) => celdaDe(i.verbo.lema, i.tiempo, i.persona)!.refuta).length;
  const locuciones = items.filter((i) => i.respuesta.includes(' ')).length;
  const fueraDelPresente = items.filter((i) => i.tiempo !== 'presente').length;
  return [
    // Las dos contaban `n` de `n`, que es decir 100 % sin mirar.
    { comprobacion: 'la respuesta contra la tabla guardada',
      decididos: items.filter((i) => norm(conjugarIrregular(i.verbo, i.persona, i.tiempo) ?? '\u0000') === norm(i.respuesta)).length, total: n },
    // Y la segunda contaba CADENAS. `īs` pasaba con 72 apariciones de las
    // que ninguna es el verbo: son el pronombre `iīs`. Ahora, para las
    // respuestas de una sola palabra, se pregunta por el rasgo.
    { comprobacion: 'la forma aparece en el corpus COMO VERBO',
      decididos: items.filter((i) => i.respuesta.includes(' ') || comoVerbo(i.respuesta) > 0).length, total: n,
      motivoDeLosQueQuedanFuera: 'las respuestas de dos palabras (la supleción de `nōlō`) se cuentan por bigrama en `atestacion-irregulares.json`, que es donde vive esa cuenta' },
    { comprobacion: 'la celda refuta la regla general', decididos: refutan, total: n,
      motivoDeLosQueQuedanFuera: 'de las 108 celdas de los seis verbos sólo 35 refutan la regla: la 1.ª del singular y la 3.ª del plural no lo hacen en ninguno, y el imperfecto y el futuro sólo en `eō`' },
    { comprobacion: 'la supleción con `nōn` suelto de `nōlō`', decididos: locuciones, total: n,
      motivoDeLosQueQuedanFuera: 'sólo `nōlō` tiene formas de dos palabras; en los otros cinco la pregunta no existe' },
    { comprobacion: 'la irregularidad fuera del presente', decididos: fueraDelPresente, total: n,
      motivoDeLosQueQuedanFuera: 'cinco de los seis verbos son regulares en imperfecto y futuro: sólo `eō` puede examinarlo' },
  ];
}

export function tasasCiegasI(items: ItemIrregular[]) {
  const total = items.length;
  const mide = (f: (i: ItemIrregular) => string) => ({
    tasa: total === 0 ? 0 : items.filter((i) => norm(f(i)) === norm(i.respuesta)).length / total, decididos: total, total,
  });
  return {
    // Aplicar la regla general al lema. En un lote bien hecho debe ser CERO,
    // no «poco»: cada ítem que la regla acierta es un ítem que no examina el
    // punto, y eso ya lo dice `celda-que-no-examina` uno a uno.
    conjugarComoRegular: mide((i) => celdaDe(i.verbo.lema, i.tiempo, i.persona)?.regular ?? ''),
    copiarLema: mide((i) => i.verbo.lema),
  };
}

const VERBOS_MINIMOS = 4;
const PERSONAS_MINIMAS = 3;

export function revisarLoteIrregulares(items: ItemIrregular[]): FalloI[] {
  const out: FalloI[] = items.flatMap(revisarItemIrregular);

  // Dos ítems en la misma casilla del mismo verbo son un ítem repetido, y
  // la cobertura los cuenta como dos.
  {
    const vistas = new Map<string, string>();
    for (const i of items) {
      const k = `${i.verbo.lema}.${i.tiempo}.${i.persona}`;
      if (vistas.has(k)) out.push({ item: i.id, clase: 'celdas-repetidas', detalle: `misma casilla que ${vistas.get(k)}: ${k}` });
      else vistas.set(k, i.id);
    }
  }

  // EL `varia` SON DOS EJES: el verbo y la persona.
  const verbos = new Set(items.map((i) => i.verbo.lema));
  const personas = new Set(items.map((i) => i.persona));
  if (verbos.size < VERBOS_MINIMOS) out.push({ item: '(lote)', clase: 'varia-incompleto',
    detalle: `el varia son el verbo y la persona, y el lote toca ${verbos.size} verbo(s) de los seis: ${[...verbos].join(', ')}` });
  if (personas.size < PERSONAS_MINIMAS) out.push({ item: '(lote)', clase: 'varia-incompleto',
    detalle: `el lote toca ${personas.size} persona(s): ${[...personas].join(', ')}` });
  // Y el aviso literal del varia, que tiene nombre propio porque es el
  // error que se comete solo: la 1.ª del singular ES el lema.
  if (items.length > 0 && items.every((i) => i.persona === '1sg')) out.push({ item: '(lote)', clase: 'varia-incompleto',
    detalle: 'todos los ítems son 1.ª del singular, que es el lema: el lote se contesta copiando lo que se le enseña' });

  const sep = separablePorPosicion(patronDe(items, (i) => i.tiempo === 'presente'));
  if (sep) out.push({ item: '(lote)', clase: 'orden-separable', detalle: `el eje «es del presente» se predice por la POSICIÓN: ${sep}` });

  out.push(...revisarCobertura(coberturaIrregulares(items)).map((f) => ({ item: f.item, clase: f.clase as unknown as ClaseFalloI, detalle: f.detalle })));

  const t = tasasCiegasI(items);
  const pct = (x: number) => `${(100 * x).toFixed(0)} %`;
  if (t.conjugarComoRegular.tasa > 0) out.push({ item: '(lote)', clase: 'estrategia-ciega',
    detalle: `«conjugarlo como regular» acierta el ${pct(t.conjugarComoRegular.tasa)} del lote, y aquí el listón es CERO: el punto es justamente que la regla no vale` });
  if (t.copiarLema.tasa > 0.5) out.push({ item: '(lote)', clase: 'estrategia-ciega',
    detalle: `«copiar el lema» acierta el ${pct(t.copiarLema.tasa)} del lote` });
  return out;
}

export function informeIrregulares(items: ItemIrregular[]): string {
  const fallos = revisarLoteIrregulares(items);
  const t = tasasCiegasI(items);
  const pct = (x: number) => `${(100 * x).toFixed(0)} %`;
  const lineas = [`  ${items.length} ítems · ${fallos.length} fallo(s)`];
  for (const c of coberturaIrregulares(items)) lineas.push(`    cobertura · ${c.comprobacion}: ${c.decididos}/${c.total}`);
  lineas.push(`    ciega · conjugarlo como regular: ${pct(t.conjugarComoRegular.tasa)} · copiar el lema: ${pct(t.copiarLema.tasa)}`);
  const at = items.map((i) => celdaDe(i.verbo.lema, i.tiempo, i.persona)?.n ?? 0);
  lineas.push(`    atestación de las respuestas: mínimo ×${Math.min(...at)} · mediana ×${[...at].sort((a, b) => a - b)[at.length >> 1]}`);
  for (const f of fallos) lineas.push(`    ✗ ${f.item} [${f.clase}] ${f.detalle}`);
  return lineas.join('\n');
}

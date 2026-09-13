// scripts/lib/gate-pasiva-infectum.ts — LA PASIVA DEL INFECTUM.
//
// Punto `l6-pasiva-infectum`. «amor, amāris, amātur. Un juego de
// desinencias nuevo, no una perífrasis.» `varia`: «la persona y la
// conjugación». `motivo`: «el español no tiene pasiva sintética: hay que
// aprender formas, no una construcción».
//
// ══ LA ESTRATEGIA CIEGA ES «LA ACTIVA MÁS UNA -r» ════════════════════
//
// Es lo que produce un alumno que cree que la pasiva es un sufijo en vez de
// un juego entero. Yo escribí primero que «acierta en la 1.ª del singular»
// y **el instrumento me corrigió: acierta el 0 %, también ahí**.
//
// `amō` + `r` da `amōr` y la pasiva es `amor`, con `o` BREVE. La 1.ª del
// singular es la casilla donde la estrategia está más cerca de acertar y
// aun así falla — y falla justo por la cantidad, que es lo que
// `l1-cantidad-fonemica` enseña. En un curso sin mácrones ese fallo sería
// invisible; aquí no.
//
// ══ LA EXCEPCIÓN QUE EL PUNTO DECLARA, Y SU HISTORIA ═════════════════
//
// «La 2.ª singular "amāris" es homógrafa de "amārīs", ablativo plural de
// "amārus", y las separa SÓLO la cantidad — que es justo lo que este curso
// marca. **La primera versión afirmaba una homonimia con el genitivo de un
// sustantivo de la 3.ª sin nombrar ni un lema, y el corpus no da ninguno.**»
//
// O sea que el propio punto lleva dentro la corrección de una afirmación
// falsa anterior. El lote trae el par de verdad.
import { pasivaInfectum, conjugar, conjugacionDe, esMixta, type EntradaVerbal, type Persona, type Tiempo } from '../../lib/data/languages/la/paradigma-la';
import { revisarCobertura, type Cobertura } from './cobertura';
import { separablePorPosicion } from './atajos';
import { patronDe } from './orden-publicado';
import { palabrasDesconocidas } from './gate-vocabulario-del-marco';
import porAnalisis from '../../lib/data/languages/la/atestacion-por-analisis.json';

// ══ LA CADENA NO ES EL ANÁLISIS ══════════════════════════════════════
//
// Este gate leía `atestacion-acento.json`, que cuenta CADENAS. Para el
// acento la cadena es la pregunta entera; aquí no. Medido al cambiarlo:
// `amor` —la pasiva de `amō`, el ejemplo de manual— aparece 22 veces en el
// corpus y **las 22 son el sustantivo `amor`**. Cero como verbo.
const TABLA = (porAnalisis as { tabla: Record<string, Record<string, number>> }).tabla;
const comoVerbo = (f: string) => (TABLA[f]?.ind ?? 0) + (TABLA[f]?.sub ?? 0) + (TABLA[f]?.imp ?? 0);
const comoNombre = (f: string) => TABLA[f]?.nominal ?? 0;

export interface ItemPasiva {
  id: string;
  punto: string;
  verbo: EntradaVerbal;
  persona: Persona;
  tiempo: Tiempo;
  respuesta: string;
  marco: string;
  pista: string;
  glosa: string;
  ejes: {
    /** 1, 2, 3, 4 o `mixta`. Se contrasta con la máquina. */
    conjugacion: 1 | 2 | 3 | 4 | 'mixta';
  };
  /** Obligatorio si la forma no aparece en el corpus. */
  porQueSinAtestiguar?: string;
}

export type ClaseFalloPas =
  | 'respuesta-no-derivable' | 'eje-mal-declarado' | 'sin-atestiguar' | 'homonimo-nominal'
  | 'pista-regala-la-forma' | 'marco-mal' | 'marco-fuera-de-l1'
  | 'varia-incompleto' | 'estrategia-ciega' | 'celdas-repetidas'
  | 'orden-separable' | 'cobertura-cero' | 'cobertura-sin-motivo';

export interface FalloPas { item: string; clase: ClaseFalloPas; detalle: string }

const norm = (s: string) => s.normalize('NFC').toLowerCase();

/** «La activa más una -r», que acierta sólo en la 1.ª del singular. */
export function activaMasR(v: EntradaVerbal, p: Persona, t: Tiempo): string {
  return `${conjugar(v, p, t)}r`;
}

export function revisarItemPasiva(item: ItemPasiva): FalloPas[] {
  const out: FalloPas[] = [];
  const push = (clase: ClaseFalloPas, detalle: string) => out.push({ item: item.id, clase, detalle });

  const dela = pasivaInfectum(item.verbo)[`${item.tiempo}.${item.persona}`];
  if (!dela) { push('respuesta-no-derivable', `la máquina no da ${item.tiempo}.${item.persona} de «${item.verbo.lema}»`); return out; }
  if (norm(dela) !== norm(item.respuesta))
    push('respuesta-no-derivable', `la respuesta es «${item.respuesta}» y la máquina da «${dela}»`);

  let c: 1 | 2 | 3 | 4 | 'mixta';
  try { c = esMixta(item.verbo) ? 'mixta' : conjugacionDe(item.verbo); }
  catch { push('eje-mal-declarado', `«${item.verbo.lema}» no es de ninguna de las cuatro`); return out; }
  if (c !== item.ejes.conjugacion) push('eje-mal-declarado', `declara conjugación ${item.ejes.conjugacion} y es ${c}`);

  const excusado = (item.porQueSinAtestiguar ?? '').trim().length >= 20;
  if (comoVerbo(item.respuesta) === 0 && !excusado)
    push('sin-atestiguar', `«${item.respuesta}» no aparece NUNCA como verbo en el corpus`
      + ` (la cadena sale ${Object.values(TABLA[item.respuesta] ?? {}).reduce((a, b) => a + b, 0)} vez/veces)`);
  else if (comoNombre(item.respuesta) > comoVerbo(item.respuesta) && !excusado)
    push('homonimo-nominal', `«${item.respuesta}» sale ${comoNombre(item.respuesta)} vez/veces como nombre`
      + ` y sólo ${comoVerbo(item.respuesta)} como verbo`);

  for (const [donde, txt] of [['la pista', item.pista], ['la glosa', item.glosa], ['el marco', item.marco]] as const)
    if (norm(txt).includes(norm(item.respuesta))) push('pista-regala-la-forma', `${donde} contiene «${item.respuesta}»`);
  if (!item.marco.includes('___')) push('marco-mal', 'el marco latino no tiene hueco `___`');
  const d = palabrasDesconocidas(item.marco);
  if (d.length > 0) push('marco-fuera-de-l1', `el marco usa palabras que la máquina de L1 no produce: ${d.join(', ')}`);
  return out;
}

export function coberturaPasiva(items: ItemPasiva[]): Cobertura[] {
  const n = items.length;
  const personas = new Set(items.map((i) => i.persona));
  const conj = new Set(items.map((i) => i.ejes.conjugacion));
  const refutan = items.filter((i) => norm(activaMasR(i.verbo, i.persona, i.tiempo)) !== norm(i.respuesta)).length;
  return [
    // Estas dos contaban `n` de `n`: 100 % sin mirar. Ahora cuentan.
    { comprobacion: 'la respuesta contra la máquina',
      decididos: items.filter((i) => norm(pasivaInfectum(i.verbo)[`${i.tiempo}.${i.persona}`] ?? "\u0000") === norm(i.respuesta)).length, total: n },
    { comprobacion: 'la forma aparece en el corpus COMO VERBO',
      decididos: items.filter((i) => comoVerbo(i.respuesta) > 0).length, total: n,
      motivoDeLosQueQuedanFuera: 'la 1.ª conjugación no tiene ni una pasiva de 1.ª persona atestiguada en el corpus (sólo videor ×19 y dīcor ×1 en todo L1), y `amor` lleva su motivo escrito' },
    { comprobacion: 'las seis personas', decididos: personas.size, total: 6,
      motivoDeLosQueQuedanFuera: 'el varia es la persona y la conjugación: con tres personas el lote mide media tabla' },
    { comprobacion: 'las conjugaciones', decididos: conj.size, total: 5,
      motivoDeLosQueQuedanFuera: 'son cuatro más la mixta, y no todas tienen pasiva atestiguada en el corpus' },
    { comprobacion: '«la activa más una -r» queda refutada', decididos: refutan, total: n,
      motivoDeLosQueQuedanFuera: 'la estrategia falla en las seis personas, incluida la 1.ª del singular, donde sólo la separa la CANTIDAD: `amōr` contra `amor`' },
  ];
}

export function tasasCiegasPas(items: ItemPasiva[]) {
  const n = Math.max(1, items.length);
  return {
    activaMasR: items.filter((i) => norm(activaMasR(i.verbo, i.persona, i.tiempo)) === norm(i.respuesta)).length / n,
    laActiva: items.filter((i) => norm(conjugar(i.verbo, i.persona, i.tiempo)) === norm(i.respuesta)).length / n,
  };
}

export function revisarLotePasiva(items: ItemPasiva[]): FalloPas[] {
  const out: FalloPas[] = items.flatMap(revisarItemPasiva);

  const personas = new Set(items.map((i) => i.persona));
  if (personas.size < 6) out.push({ item: '(lote)', clase: 'varia-incompleto',
    detalle: `el varia es la persona y la conjugación, y el lote toca ${personas.size} persona(s) de seis: ${[...personas].join(', ')}` });
  const conj = new Set(items.map((i) => i.ejes.conjugacion));
  if (conj.size < 3) out.push({ item: '(lote)', clase: 'varia-incompleto',
    detalle: `y ${conj.size} conjugación(es): ${[...conj].join(', ')}` });

  const vistas = new Map<string, string>();
  for (const i of items) {
    const k = `${i.verbo.lema}.${i.tiempo}.${i.persona}`;
    if (vistas.has(k)) out.push({ item: i.id, clase: 'celdas-repetidas', detalle: `misma casilla que ${vistas.get(k)}: ${k}` });
    else vistas.set(k, i.id);
  }

  const sep = separablePorPosicion(patronDe(items, (i) => i.persona.endsWith('sg')));
  if (sep) out.push({ item: '(lote)', clase: 'orden-separable', detalle: `el eje «es singular» se predice por la POSICIÓN: ${sep}` });

  out.push(...revisarCobertura(coberturaPasiva(items)).map((f) => ({ item: f.item, clase: f.clase as unknown as ClaseFalloPas, detalle: f.detalle })));

  const t = tasasCiegasPas(items);
  const pct = (x: number) => `${(100 * x).toFixed(0)} %`;
  if (t.activaMasR > 0) out.push({ item: '(lote)', clase: 'estrategia-ciega',
    detalle: `«la activa más una -r» acierta el ${pct(t.activaMasR)}, y aquí el listón es CERO: medido, esa estrategia falla en las seis personas` });
  if (t.laActiva > 0) out.push({ item: '(lote)', clase: 'estrategia-ciega',
    detalle: `«responder la activa» acierta el ${pct(t.laActiva)}, y aquí el listón es CERO` });
  return out;
}

export function informePasiva(items: ItemPasiva[]): string {
  const fallos = revisarLotePasiva(items);
  const t = tasasCiegasPas(items);
  const pct = (x: number) => `${(100 * x).toFixed(0)} %`;
  const lineas = [`  ${items.length} ítems · ${fallos.length} fallo(s)`];
  for (const c of coberturaPasiva(items)) lineas.push(`    cobertura · ${c.comprobacion}: ${c.decididos}/${c.total}`);
  lineas.push(`    ciega · la activa más una -r ${pct(t.activaMasR)} · responder la activa ${pct(t.laActiva)}`);
  for (const f of fallos) lineas.push(`    ✗ ${f.item} [${f.clase}] ${f.detalle}`);
  return lineas.join('\n');
}
